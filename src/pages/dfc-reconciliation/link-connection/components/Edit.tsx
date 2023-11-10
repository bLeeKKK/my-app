import { message, Form, Button } from 'antd';
import { ModalForm, ProFormText, ProFormTimePicker, ProFormSelect } from '@ant-design/pro-form';
import { save, edit as update } from '../service';
// import type { ParamsType } from '../service';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { getModel } from '@/utils';
import { findAllByDictCode } from '@/services/dictionary';
// import moment from 'moment';
// import MyAccess from '@/components/MyAccess';

const MODE_ARR = ['day', 'hour', 'minute'];
const MODE_DIR = {
  day: { rang: 24, name: 'disabledHours', ex: 'hour' },
  hour: { rang: 60, name: 'disabledMinutes', ex: 'minute' },
  minute: { rang: 60, name: 'disabledSeconds', ex: 'second' },
  // second: { rang: 1000, name: "无", ex: '无', },
}; // 一天24小时，一小时60分钟，一分钟60秒。字典
/**
 * @description: 时间校验
 * @param {Moment} startValue 开始时间
 * @param {Moment} endValue 结束时间
 * @param {String} mode 那那种时间类型结束 day hour minute
 * @param {String} type 开始还是结束 start 向后限制、 end 向前限制
 *
 * @return: 返回对应的模式
 */
export const disabledTime = (
  startValue: any,
  endValue: any,
  mode: any = 'minute',
  type: any = 'start',
) => {
  if (!startValue || !endValue) return false;

  const obj = {
    disabledHours: () => [],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  };

  for (const m of MODE_ARR) {
    // 是否相同
    const isSame = startValue.isSame(endValue, m);

    if (isSame) {
      if (type === 'start') {
        const dt = endValue[MODE_DIR[m].ex]();
        obj[MODE_DIR[m].name] = () =>
          Array.from({ length: MODE_DIR[m].rang }, (_, i) => i).splice(
            dt + (mode === m ? 0 : 1),
            MODE_DIR[m].rang,
          );
      } else {
        const dt = startValue[MODE_DIR[m].ex]();
        obj[MODE_DIR[m].name] = () =>
          Array.from({ length: MODE_DIR[m].rang }, (_, i) => i).splice(
            0,
            dt + (mode === m ? 1 : 0),
          );
      }
    } else {
      break;
    }

    if (m === mode) break;
  }

  return obj;
};

/**
 * @description: 日期校验
 * @param {Moment} startValue 开始日期
 * @param {Moment} endValue 结束日期
 * @param {String} type 开始还是结束 start end
 * @return: 返回对应的模式
 */
export const disabledDate = (startValue: any, endValue: any, type: any = 'start') => {
  if (!startValue || !endValue) return false;
  if (type === 'start') return startValue.valueOf() > endValue?.valueOf?.();
  return startValue.valueOf() <= endValue?.valueOf?.();
};

const handleAdd = async (data: any) => {
  const hide = message.loading('正在添加');
  try {
    await save({ ...data, dfcdzFlowNodeList: [] });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

const handleUpdate = async (data: any) => {
  const hide = message.loading('正在修改');
  try {
    await update(data);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

export default function AddModalForm() {
  const { actionRef, visible, editType, edit } = useSelector((state: any) => state.linkConnection);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch({
      type: 'linkConnection/setEdit',
      payload: {
        edit: undefined,
        editType: undefined,
        visible: false,
      },
    });
  };

  useUpdateEffect(() => {
    if (visible && editType === 2 && edit) {
      form.setFieldsValue(edit);
    } else {
      form.resetFields();
    }
  }, [visible, editType, edit]);

  return (
    <>
      {/* <MyAccess aKey="config-list:operation-flow:add"> */}
      <Button
        type="primary"
        key="primary"
        onClick={() => {
          dispatch({
            type: 'linkConnection/setEdit',
            payload: {
              edit: undefined,
              visible: true,
              editType: 1,
            },
          });
        }}
      >
        <PlusOutlined /> 新建
      </Button>
      {/* </MyAccess> */}
      <ModalForm
        title={`${getModel(editType)}对账流程配置`}
        width="400px"
        visible={visible}
        form={form}
        onVisibleChange={(flag) => {
          if (!flag) closeModal();
        }}
        onFinish={async (value) => {
          let flag = false;
          if (edit?.id) {
            flag = await handleUpdate({ ...edit, ...value });
          } else flag = await handleAdd(value);
          if (flag) {
            closeModal();
            if (actionRef?.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="对账流程名称"
          width="md"
          rules={[{ required: true, message: '请输入对账流程名称' }]}
          name="name"
        />
        <ProFormSelect
          name="dzType"
          width="md"
          label="对账类型"
          rules={[{ required: true, message: '请选择对账类型' }]}
          request={async () => {
            const { success, data } = await findAllByDictCode('dz_type');
            if (success) return data.map(({ name: label, value }) => ({ label, value }));
            else return [];
          }}
        />
        <ProFormSelect
          name="warnMethod"
          width="md"
          label="预警方式"
          rules={[{ required: true, message: '请选择预警方式' }]}
          request={async () => {
            const { success, data } = await findAllByDictCode('dz_warn_method');
            if (success) return data.map(({ name: label, value }) => ({ label, value }));
            else return [];
          }}
        />
        <ProFormTimePicker
          width="md"
          name="executeTime"
          label="执行时间"
          // 选择当前时间后
        />
        <ProFormText
          label="发送队列"
          width="md"
          rules={[{ required: true, message: '请输入流程描述' }]}
          name="sendQueue"
          placeholder="多个以逗号隔开"
        />
      </ModalForm>
    </>
  );
}

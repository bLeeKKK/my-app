import { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { message, Input, Col, Row } from 'antd';
import { ProFormText, ProForm, ProFormSelect, ProFormList } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-components';
import { save, edit as update } from '../service';
import { list as linkList } from '../../link/service';
import type { ShowDataType } from '../../link/data.d';
import type { ParamsType } from '../data.d';
import { useRequest } from 'umi';

export const FREEZE_OPTIONS = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

export const YESORNO_OPTIONS = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

export const SYS_OPTIONS = [
  { value: 'SCMC', label: 'SCMC' },
  { value: 'USO', label: 'USO' },
  { value: 'EBOC', label: 'EBOC' },
  { value: 'LRP', label: 'LRP' },
  { value: 'MOFC', label: 'MOFC' },
  { value: 'R3', label: 'R3' },
  { value: 'TIMC', label: 'TIMC' },
];

export const DB_OPTIONS = [
  { value: 'Mysql', label: 'Mysql' },
  { value: 'SqlServer', label: 'SqlServer' },
];

const handleEdit = async (data: any) => {
  const hide = message.loading('正在保存');
  try {
    if (data.id) {
      await update(data);
    } else {
      await save(data);
    }

    hide();
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

const FilterLinkForm = ({
  name,
  formRef,
  linkListArr,
}: {
  name: string;
  formRef: any;
  linkListArr: any;
}) => {
  return (
    <>
      <ProFormSelect
        fieldProps={{ labelInValue: true }}
        label="数据系统"
        name={`${name}Obj`}
        options={linkListArr}
        onChange={() => {
          formRef?.current?.setFieldsValue({
            [name]: [{}],
            conent: [{}],
          });
        }}
      />
      <ProFormList initialValue={[{}]} name={`${name}List`} label="数据筛选" min={1}>
        <ProFormDependency name={[`${name}Obj`]} ignoreFormListField>
          {(formData) => {
            const diffId = formData[`${name}Obj`]?.id;
            const fieldArr =
              linkListArr.find((item: any) => item.value === diffId)?.businessEntityList || [];
            return (
              <>
                <Input.Group compact>
                  <>
                    <ProFormSelect
                      fieldProps={{ labelInValue: true }}
                      name={`field`}
                      placeholder="字段"
                      options={fieldArr.map((item: any) => ({
                        ...item,
                        value: item.fieldDesc,
                        lable: item.fieldDesc,
                      }))}
                    />
                    <ProFormSelect
                      name={['field', `symbol`]}
                      placeholder="<,>,="
                      options={[
                        {
                          value: '=',
                          label: '=',
                        },
                        {
                          value: '<',
                          label: '<',
                        },
                        {
                          value: '>',
                          label: '>',
                        },
                      ]}
                    />
                    <ProFormText name={['field', `fieldValue`]} placeholder="值" />
                    <ProFormSelect
                      name={['field', `linkSymbol`]}
                      placeholder="或与"
                      options={[
                        {
                          label: 'and',
                          value: 'and',
                        },
                        {
                          label: 'or',
                          value: 'or',
                        },
                      ]}
                    />
                  </>
                </Input.Group>
              </>
            );
          }}
        </ProFormDependency>
      </ProFormList>
    </>
  );
};

const ConentForm = ({ linkListArr }: { linkListArr: any }) => {
  return (
    <>
      <ProFormList
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        name="conent"
        label="对比主键"
        initialValue={[{}]}
        min={1}
      >
        <ProFormDependency name={['primaryEntityObj', 'subEntityObj']} ignoreFormListField>
          {({ primaryEntityObj, subEntityObj }) => {
            const fieldsPrimaryEntity =
              linkListArr.find((item: any) => item.value === primaryEntityObj?.id)
                ?.businessEntityList || [];

            const fieldssubEntity =
              linkListArr.find((item: any) => item.value === subEntityObj?.id)
                ?.businessEntityList || [];

            return (
              <>
                <Input.Group compact>
                  <>
                    <ProFormSelect
                      fieldProps={{ labelInValue: true }}
                      name={`primary`}
                      placeholder="主字段"
                      options={fieldsPrimaryEntity.map((item: any) => ({
                        ...item,
                        value: item.fieldDesc,
                        lable: item.fieldDesc,
                      }))}
                    />
                    <ProFormSelect
                      name={[`primary`, 'symbol']}
                      placeholder="<,>,="
                      options={[
                        {
                          value: '=',
                          label: '=',
                        },
                        {
                          value: '<',
                          label: '<',
                        },
                        {
                          value: '>',
                          label: '>',
                        },
                      ]}
                    />
                    <ProFormSelect
                      name={`sub`}
                      fieldProps={{ labelInValue: true }}
                      placeholder="对比字段"
                      options={fieldssubEntity.map((item: any) => ({
                        ...item,
                        value: item.fieldDesc,
                        lable: item.fieldName,
                      }))}
                    />
                    <ProFormSelect
                      name={['sub', 'linkSymbol']}
                      placeholder="或与"
                      options={[
                        {
                          label: 'and',
                          value: 'and',
                        },
                        {
                          label: 'or',
                          value: 'or',
                        },
                      ]}
                    />
                  </>
                </Input.Group>
              </>
            );
          }}
        </ProFormDependency>
      </ProFormList>
    </>
  );
};

const ContraRatioForm = ({ linkListArr }: { linkListArr: any }) => {
  return (
    <>
      <ProFormList
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        name="contra"
        label="主键"
        initialValue={[{}]}
        min={1}
      >
        <ProFormDependency name={['primaryEntityObj', 'subEntityObj']} ignoreFormListField>
          {({ primaryEntityObj, subEntityObj }) => {
            const fieldsPrimaryEntity =
              linkListArr.find((item: any) => item.value === primaryEntityObj?.id)
                ?.businessEntityList || [];

            const fieldssubEntity =
              linkListArr.find((item: any) => item.value === subEntityObj?.id)
                ?.businessEntityList || [];

            return (
              <>
                <Input.Group compact>
                  <>
                    <ProFormSelect
                      fieldProps={{ labelInValue: true }}
                      name={`primary`}
                      placeholder="主字段"
                      options={fieldsPrimaryEntity.map((item: any) => ({
                        ...item,
                        value: item.fieldRemark,
                        lable: item.fieldName,
                      }))}
                    />
                    <ProFormSelect
                      name={[`primary`, 'symbol']}
                      placeholder="<,>,="
                      options={[
                        {
                          value: '=',
                          label: '=',
                        },
                        {
                          value: '<',
                          label: '<',
                        },
                        {
                          value: '>',
                          label: '>',
                        },
                      ]}
                    />
                    <ProFormSelect
                      name={`sub`}
                      fieldProps={{ labelInValue: true }}
                      placeholder="对比字段"
                      options={fieldssubEntity.map((item: any) => ({
                        ...item,
                        value: item.fieldRemark,
                        lable: item.fieldName,
                      }))}
                    />
                  </>
                </Input.Group>
              </>
            );
          }}
        </ProFormDependency>
      </ProFormList>
    </>
  );
};

export default function AddModalForm({ select }: { select: any }) {
  const { data } = useRequest<{ data: ShowDataType[] }>(() => linkList({}), {});
  const arr = (data || []).map((item: ShowDataType) => ({
    ...item,
    label: item.sourceName,
    value: item.id,
  }));

  const formRef = useRef<any>();
  useEffect(() => {
    if (!select) {
      formRef.current?.resetFields();
      return;
    }
    const subEntityList: any[] = [];
    const primaryEntityList: any[] = [];
    const conentObj = {};
    const contraObj = {};

    select.expressionList.forEach((item: any) => {
      if (item.expressionType === 1) {
        if (item.mainFlag) {
          primaryEntityList.push({
            field: { ...item, value: item.fieldDesc, lable: item.fieldDesc },
          });
        } else {
          subEntityList.push({
            field: { ...item, value: item.fieldDesc, lable: item.fieldDesc },
          });
        }
      } else if (item.expressionType === 2) {
        const a = conentObj[item.linkCode] || [];
        conentObj[item.linkCode] = [
          ...a,
          { ...item, value: item.fieldDesc, item: item.fieldDesc },
        ].sort((i, k) => i.sort - k.sort);
      } else if (item.expressionType === 3) {
        const a = contraObj[item.linkCode] || [];
        contraObj[item.linkCode] = [
          ...a,
          { ...item, value: item.fieldDesc, item: item.fieldDesc },
        ].sort((i, k) => i.sort - k.sort);
      }
    });
    const formData = {
      modelName: select.modelName,
      primaryEntityList: primaryEntityList.sort((i, k) => i.sort - k.sort),
      subEntityList: subEntityList.sort((i, k) => i.sort - k.sort),
      primaryEntityObj: {
        label: select.primaryEntityName,
        value: select.primaryEntityId,
        id: select.primaryEntityId,
      },
      subEntityObj: {
        label: select.subEntityName,
        value: select.subEntityId,
        id: select.subEntityId,
      },
      conent: Object.keys(conentObj).map((item) => ({
        primary: conentObj[item][0],
        sub: conentObj[item][1],
      })),
      contra: Object.keys(contraObj).map((item) => ({
        primary: contraObj[item][0],
        sub: contraObj[item][1],
      })),
    };
    console.log(formData);

    formRef.current?.setFieldsValue(formData);
  }, [select]);

  return (
    <>
      <ProForm
        submitter={{
          render: (_, dom) => {
            return (
              <>
                <div
                  style={{
                    boxSizing: 'border-box',
                    padding: '12px',
                    height: '60px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  {dom.map((btn) => (
                    <div key={btn.key} style={{ marginRight: '8px' }}>
                      {btn}
                    </div>
                  ))}
                </div>
              </>
            );
          },
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        formRef={formRef}
        onFinish={async (values) => {
          const expressionList: any = [];
          values.subEntityList.forEach((item: any) => {
            expressionList.push({
              ...item.field,
              mainFlag: false,
              expressionType: 1,
            });
          });
          values.primaryEntityList.forEach((item: any) => {
            expressionList.push({
              ...item.field,
              mainFlag: true,
              expressionType: 1,
            });
          });
          values.conent.forEach((item: any) => {
            const linkCode = uuidv4();
            expressionList.push(
              {
                ...item.primary,
                linkCode,
                expressionType: 2,
              },
              {
                ...item.sub,
                linkCode,
                expressionType: 2,
              },
            );
          });
          values.contra.forEach((item: any) => {
            const linkCode = uuidv4();
            expressionList.push(
              {
                ...item.primary,
                linkCode,
                expressionType: 3,
              },
              {
                ...item.sub,
                linkCode,
                expressionType: 3,
              },
            );
          });
          const params: any = {
            id: select.id,
            modelName: values.modelName,
            primaryEntityId: values.primaryEntityObj?.id,
            primaryEntityName: values.primaryEntityObj?.label,
            subEntityId: values.subEntityObj?.id,
            subEntityName: values.subEntityObj?.label,
            expressionList: expressionList.map((item: any, index: number) => ({
              ...item,
              sort: index,
            })),
          };

          try {
            await handleEdit(params);
          } catch (error: any) {
            message.error(error.message);
          }
        }}
      >
        <div style={{ height: '60px' }}></div>
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <h3>基础配置</h3>
            <div
              style={{ width: '100%', borderBottom: '1px solid #D9D9D9', marginBottom: '12px' }}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              label="项目名称"
              rules={[{ required: true, message: '请输入项目名称' }]}
              width="sm"
              name="modelName"
            />
          </Col>
          <Col span={24}>
            <h3>筛选配置</h3>
            <div
              style={{ width: '100%', borderBottom: '1px solid #D9D9D9', marginBottom: '12px' }}
            />
          </Col>
          <Col span={12} style={{ minHeight: 200 }}>
            <FilterLinkForm name="primaryEntity" formRef={formRef} linkListArr={arr} />
          </Col>
          <Col span={12} style={{ minHeight: 200, borderLeft: '1px solid #D9D9D9' }}>
            <FilterLinkForm name="subEntity" formRef={formRef} linkListArr={arr} />
          </Col>
          <Col span={24}>
            <h3>链接主键</h3>
            <div
              style={{ width: '100%', borderBottom: '1px solid #D9D9D9', marginBottom: '12px' }}
            />
          </Col>
          <Col span={24}>
            <ConentForm linkListArr={arr} />
          </Col>
          <Col span={24}>
            <h3>对比值</h3>
            <div
              style={{ width: '100%', borderBottom: '1px solid #D9D9D9', marginBottom: '12px' }}
            />
          </Col>
          <Col span={24}>
            <ContraRatioForm linkListArr={arr} />
          </Col>
        </Row>
      </ProForm>
    </>
  );
}

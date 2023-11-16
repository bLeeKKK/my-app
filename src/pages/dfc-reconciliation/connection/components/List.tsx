import { forwardRef, useImperativeHandle } from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { useRequest, useDispatch } from 'umi';
import style from '../style.less';
import {
  // EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, List, Modal } from 'antd';
import type { ShowDataType } from '../data.d';
import { findByPage } from '../service';
import IconBox from '@/components/IconBox';

const ListBox = forwardRef(
  (
    {
      setSelect,
      select,
    }: {
      select: ShowDataType | undefined;
      setSelect: Dispatch<SetStateAction<ShowDataType | undefined>>;
    },
    ref,
  ) => {
    const { data, loading, run } = useRequest<{ data: any }>(
      () => findByPage({ size: 100000 }),
      {},
    );
    const dispatch = useDispatch();
    useImperativeHandle(ref, () => ({ run, data, loading }));
    const arr = data?.records;

    return (
      <List<any>
        loading={loading}
        header={
          <div className={style.header}>
            <span>链接列表</span>
            <span>
              <ReloadOutlined onClick={run} className={style.reload} />
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  setSelect(undefined);
                }}
              >
                <PlusOutlined /> 新建
              </Button>
            </span>
          </div>
        }
        itemLayout="vertical"
        size="small"
        dataSource={arr}
        renderItem={(item) => (
          <List.Item
            onClick={() =>
              setSelect((oldSelect: ShowDataType | undefined) => {
                return oldSelect?.id === item.id ? undefined : item;
              })
            }
            className={`${style.item} ${select?.id === item.id ? style['item-selected'] : ''}`}
            key={item.sourceName}
            actions={[
              <IconBox
                useSpace
                icon={DeleteOutlined}
                text="删除"
                key="dfc-link-del"
                onClick={(e: any) => {
                  e.stopPropagation();
                  return Modal.confirm({
                    title: '对账模型',
                    content: '确定删除该对账模型吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: async () =>
                      dispatch({
                        type: 'dfcReconciliationConnection/deleteFun',
                        payload: {
                          id: item.id,
                        },
                        callback: () => {
                          run();
                          setSelect((s: any) => (s.id === item.id ? undefined : s));
                        },
                      }),
                  });
                }}
              />,
            ]}
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              // title={<a href={item.sourceIp}>{item.sourceName}</a>}
              title={item.modelName}
              description={`${item.primaryEntityName}-${item.subEntityName}`}
            />
          </List.Item>
        )}
      />
    );
  },
);

export default ListBox;

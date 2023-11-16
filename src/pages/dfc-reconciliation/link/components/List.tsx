import { forwardRef, useImperativeHandle } from 'react';
import type { SetStateAction, Dispatch } from 'react';
import { useRequest, useDispatch } from 'umi';
import style from '../style.less';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { List, Modal } from 'antd';
import AddModalForm from './Edit';
import IconBox from '@/components/IconBox';
import type { ShowDataType } from '../data.d';
import { list } from '../service';

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
    const { data, loading, run } = useRequest<{ data: ShowDataType[] }>(() => list({}), {});
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({ run, data, loading }));

    return (
      <List<ShowDataType>
        loading={loading}
        header={
          <div className={style.header}>
            <span>链接列表</span>
            <span>
              <ReloadOutlined onClick={run} className={style.reload} />
              <AddModalForm run={run} />
            </span>
          </div>
        }
        itemLayout="vertical"
        size="small"
        dataSource={data}
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
                icon={EditOutlined}
                text="编辑"
                key="dfc-link-edit"
                onClick={(e: any) => {
                  dispatch({
                    type: 'dfcReconciliationLink/setEdit',
                    payload: {
                      edit: item,
                      visible: true,
                      editType: 2,
                    },
                  });
                  e.stopPropagation();
                }}
              />,
              <IconBox
                useSpace
                icon={DeleteOutlined}
                text="删除"
                key="dfc-link-del"
                onClick={(e: any) => {
                  e.stopPropagation();
                  return Modal.confirm({
                    title: '删除链接',
                    content: '确定删除该链接吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: async () =>
                      dispatch({
                        type: 'dfcReconciliationLink/deleteFun',
                        payload: {
                          id: item.id,
                        },
                        callback: run,
                      }),
                  });
                }}
              />,
            ]}
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              // title={<a href={item.sourceIp}>{item.sourceName}</a>}
              title={item.sourceName}
              description={item.remark}
            />
          </List.Item>
        )}
      />
    );
  },
);

export default ListBox;

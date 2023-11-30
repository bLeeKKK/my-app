import { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { message, Button, Input, Col, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProFormText, ProForm, ProFormSelect, ProFormList } from '@ant-design/pro-form';
import { ProFormDependency } from '@ant-design/pro-components';
import { save, edit as update } from '../service';
import { list as linkList } from '../../link/service';
import type { ShowDataType } from '../../link/data.d';
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

export const SYMBOL_OPTIONS = [
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: 'in', label: 'in' },
  { value: 'not in', label: 'not in' },
];

const handleEdit = async (params: any) => {
  const hide = message.loading('正在保存');
  try {
    let res = null;
    if (params.id) {
      res = await update(params);
    } else {
      res = await save(params);
    }

    hide();
    message.success('保存成功');
    return res;
  } catch (error) {
    hide();
    message.warn('添加失败请重试！');
    return false;
  }
};

export const FilterLinkForm = ({
  editType,
  name,
  form,
  linkListArr,
  initialValue,
}: {
  editType: 1 | 2;
  name: string;
  form: any;
  linkListArr: any;
  initialValue?: any;
}) => {
  // const list = Form.useWatch(`${name}List`, formRef.current);
  // console.log(list);

  return (
    <>
      <ProFormSelect
        initialValue={initialValue}
        readonly={editType === 2}
        fieldProps={{
          labelInValue: true,
          onChange: () => {
            form?.setFieldsValue({
              [`${name}List`]: [{}],
              conent: [{}],
              contra: [{}],
            });
          },
        }}
        label="数据系统"
        name={`${name}Obj`}
        options={linkListArr}
        rules={[{ required: true, message: '请选择字段' }]}
        showSearch
      />
      <ProFormList initialValue={[{}]} name={`${name}List`} label="数据筛选" min={1}>
        {(_, index) => {
          return (
            <ProFormDependency name={[`${name}Obj`, `${name}List`]} ignoreFormListField>
              {(formData) => {
                const diffId = formData[`${name}Obj`]?.id;
                const fieldArr =
                  linkListArr.find((item: any) => item.value === diffId)?.businessEntityList || [];
                return (
                  <>
                    <Input.Group compact>
                      <>
                        {index !== 0 && (
                          <ProFormSelect
                            rules={[{ required: true, message: '请输入字段' }]}
                            name={[`linkSymbol`]}
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
                        )}
                        <ProFormSelect
                          fieldProps={{ labelInValue: true, optionFilterProp: 'fieldRemark' }}
                          name={`field`}
                          placeholder="字段"
                          // rules={[{ required: true, message: '请选择字段' }]}
                          showSearch
                          options={fieldArr.map((item: any) => {
                            return {
                              ...item,
                              value: item.fieldRemark,
                              lable: item.fieldRemark,
                            };
                          })}
                        />
                        <ProFormSelect
                          name={['field', `symbol`]}
                          placeholder="<,>,=..."
                          // rules={[{ required: true, message: '请选择字段' }]}
                          options={SYMBOL_OPTIONS}
                        />
                        <ProFormText
                          // rules={[{ required: true, message: '请输入字段' }]}
                          name={['field', `fieldValue`]}
                          placeholder="值"
                        />
                      </>
                    </Input.Group>
                  </>
                );
              }}
            </ProFormDependency>
          );
        }}
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
        {(_, index) => (
          <ProFormDependency
            name={['conent', 'primaryEntityObj', 'subEntityObj']}
            ignoreFormListField
          >
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
                      {index !== 0 && (
                        <ProFormSelect
                          rules={[{ required: true, message: '请选择字段' }]}
                          name={['linkSymbol']}
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
                      )}
                      <ProFormSelect
                        fieldProps={{ labelInValue: true }}
                        name={`primary`}
                        placeholder="主字段"
                        rules={[{ required: true, message: '请选择字段' }]}
                        options={fieldsPrimaryEntity.map((item: any) => ({
                          ...item,
                          value: item.fieldRemark,
                          lable: item.fieldRemark,
                        }))}
                      />
                      <ProFormSelect
                        rules={[{ required: true, message: '请选择字段' }]}
                        name={[`primary`, 'symbol']}
                        placeholder="<,>,=..."
                        options={SYMBOL_OPTIONS}
                      />
                      <ProFormSelect
                        rules={[{ required: true, message: '请选择字段' }]}
                        name={`sub`}
                        fieldProps={{ labelInValue: true }}
                        placeholder="对比字段"
                        options={fieldssubEntity.map((item: any) => ({
                          ...item,
                          value: item.fieldRemark,
                          lable: item.fieldRemark,
                        }))}
                      />
                    </>
                  </Input.Group>
                </>
              );
            }}
          </ProFormDependency>
        )}
      </ProFormList>
    </>
  );
};

const ContraRatioForm = ({ linkListArr }: { linkListArr: any }) => {
  const actionRef = useRef<any>();

  return (
    <>
      <ProFormList
        creatorButtonProps={{ style: { display: 'none' } }}
        actionRef={actionRef}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        name="contra"
        label="主键"
        initialValue={[{}]}
        min={1}
      >
        {(_, index) => (
          <ProFormDependency
            name={['contra', 'primaryEntityObj', 'subEntityObj']}
            ignoreFormListField
          >
            {({ primaryEntityObj, subEntityObj, contra }) => {
              /**
               * 标是对比字段，还是对比值
               * compareType: 1 ｜ undefined => 主字段 对比 次字段
               * compareType: 2 => 字段(主字段或次字段) 对比 值
               * */
              const compareType = contra?.[index]?.compareType;
              /**
               * 标识使用主字段还是次字段
               * mainFlag: true 主字段 对比 值
               * mainFlag: false 次字段 对比 值
               * mainFlag: undefined 主字段 对比 次字段
               * */
              const mainFlag = contra?.[index]?.mainFlag;
              const fieldsPrimaryEntity =
                linkListArr.find((item: any) => item.value === primaryEntityObj?.id)
                  ?.businessEntityList || [];

              const fieldssubEntity =
                linkListArr.find((item: any) => item.value === subEntityObj?.id)
                  ?.businessEntityList || [];

              return (
                <>
                  <div
                    style={{
                      marginTop: index === 0 ? 0 : '-24px',
                      lineHeight: '32px',
                      fontSize: '12px',
                      color: '#999',
                    }}
                  >
                    {mainFlag === true
                      ? '主字段值对比：'
                      : mainFlag === false
                      ? '次字段值对比：'
                      : '字段对比：'}
                  </div>
                  <Input.Group compact>
                    {index !== 0 && (
                      <ProFormSelect
                        rules={[{ required: true, message: '请选择字段' }]}
                        name={['linkSymbol']}
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
                    )}
                    {(mainFlag === undefined || mainFlag === true) && (
                      <>
                        <ProFormSelect
                          rules={[{ required: true, message: '请选择字段' }]}
                          fieldProps={{ labelInValue: true }}
                          name={`primary`}
                          placeholder="主字段"
                          options={fieldsPrimaryEntity.map((item: any) => ({
                            ...item,
                            value: item.fieldRemark,
                            lable: item.fieldRemark,
                          }))}
                        />
                        <ProFormSelect
                          rules={[{ required: true, message: '请选择字段' }]}
                          name={[`primary`, 'symbol']}
                          placeholder="<,>,=..."
                          options={SYMBOL_OPTIONS}
                        />
                        {compareType === 2 && (
                          <ProFormText name={['primary', `fieldValue`]} placeholder="值" />
                        )}
                      </>
                    )}

                    {(mainFlag === undefined || mainFlag === false) && (
                      <>
                        <ProFormSelect
                          rules={[{ required: true, message: '请选择字段' }]}
                          name={`sub`}
                          fieldProps={{ labelInValue: true }}
                          placeholder="次字段"
                          options={fieldssubEntity.map((item: any) => ({
                            ...item,
                            value: item.fieldRemark,
                            lable: item.fieldRemark,
                          }))}
                        />
                        {compareType === 2 && (
                          <>
                            <ProFormSelect
                              rules={[{ required: true, message: '请选择字段' }]}
                              name={[`sub`, 'symbol']}
                              placeholder="<,>,=..."
                              options={SYMBOL_OPTIONS}
                            />
                            <ProFormText name={['sub', `fieldValue`]} placeholder="值" />
                          </>
                        )}
                      </>
                    )}

                    {(compareType === 1 || compareType === undefined) && (
                      <>
                        <ProFormSelect
                          name={['sub', 'aggCondition']}
                          placeholder="比较"
                          options={[
                            {
                              label: '求和',
                              value: 'sum',
                            },
                          ]}
                        />
                      </>
                    )}
                  </Input.Group>
                </>
              );
            }}
          </ProFormDependency>
        )}
      </ProFormList>
      <div style={{ width: '100%', display: 'flex', marginTop: '-24px', paddingLeft: '63px' }}>
        <Button
          onClick={() => {
            actionRef.current?.add({
              compareType: 1,
            });
          }}
          type="dashed"
          style={{ margin: '4px', flex: 1 }}
        >
          <PlusOutlined /> 添加字段对比
        </Button>

        <Button
          onClick={() => {
            actionRef.current?.add({
              mainFlag: true,
              compareType: 2,
            });
          }}
          type="dashed"
          style={{ margin: '4px', flex: 1 }}
        >
          <PlusOutlined /> 主字段对比值
        </Button>

        <Button
          onClick={() => {
            actionRef.current?.add({
              mainFlag: false,
              compareType: 2,
            });
          }}
          type="dashed"
          style={{ margin: '4px', flex: 1 }}
        >
          <PlusOutlined /> 次字段对比值
        </Button>
      </div>
    </>
  );
};

export default function AddModalForm({ select, setSelect, listRef }: any) {
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
            linkSymbol: item.linkSymbol,
            field: { ...item, value: item.fieldRemark, lable: item.fieldRemark },
          });
        } else {
          subEntityList.push({
            linkSymbol: item.linkSymbol,
            field: { ...item, value: item.fieldRemark, lable: item.fieldRemark },
          });
        }
      } else if (item.expressionType === 2) {
        const a = conentObj[item.linkCode] || [];
        conentObj[item.linkCode] = [
          ...a,
          { ...item, value: item.fieldRemark, item: item.fieldRemark },
        ].sort((i, k) => i.sort - k.sort);
      } else if (item.expressionType === 3) {
        const a = contraObj[item.linkCode] || [];
        contraObj[item.linkCode] = [
          ...a,
          { ...item, value: item.fieldRemark, item: item.fieldRemark },
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
        linkSymbol: conentObj[item][0].linkSymbol,
      })),
      contra: Object.keys(contraObj).map((item) => {
        const [first, second] = contraObj[item];
        if (first?.compareType === 2) {
          if (first?.mainFlag) {
            // 主字段对比值
            return {
              primary: first,
              sub: undefined,
              linkSymbol: first.linkSymbol,
              compareType: 2,
              mainFlag: true,
            };
          } else {
            // 次字段对比值
            return {
              primary: undefined,
              sub: first,
              linkSymbol: first.linkSymbol,
              compareType: 2,
              mainFlag: false,
            };
          }
        }

        // 字段对比
        return {
          primary: first,
          sub: second,
          linkSymbol: first.linkSymbol,
        };
      }),
    };

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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    top: 0,
                    left: 0,
                    position: 'absolute',
                    borderBottom: '1px solid #D9D9D9',
                  }}
                >
                  <div style={{ fontSize: '16px' }}>
                    {select?.modelName}
                    <span style={{ paddingLeft: '8px', color: '#666', fontSize: '14px' }}>
                      {select ? '编辑' : '新增'}
                    </span>
                  </div>
                  <div style={{ display: 'flex' }}>
                    {dom.map((btn) => (
                      <div key={btn.key} style={{ marginRight: '8px' }}>
                        {btn}
                      </div>
                    ))}
                  </div>
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
              linkSymbol: item.linkSymbol,
              mainFlag: false,
              expressionType: 1,
            });
          });
          values.primaryEntityList.forEach((item: any) => {
            expressionList.push({
              ...item.field,
              linkSymbol: item.linkSymbol,
              mainFlag: true,
              expressionType: 1,
            });
          });
          values.conent.forEach((item: any) => {
            const linkCode = uuidv4();
            expressionList.push(
              {
                ...item.primary,
                linkSymbol: item.linkSymbol,
                linkCode,
                mainFlag: true,
                expressionType: 2,
              },
              {
                ...item.sub,
                linkSymbol: item.linkSymbol,
                linkCode,
                mainFlag: false,
                expressionType: 2,
              },
            );
          });
          values.contra.forEach((item: any) => {
            const linkCode = uuidv4();
            if (item.compareType === 2) {
              if (item.mainFlag) {
                // 主字段对比值
                expressionList.push({
                  ...item.primary,
                  linkCode,
                  linkSymbol: item.linkSymbol,
                  mainFlag: true,
                  expressionType: 3,
                  compareType: 2,
                });
              } else {
                // 次字段对比值
                expressionList.push({
                  ...item.sub,
                  linkCode,
                  linkSymbol: item.linkSymbol,
                  mainFlag: false,
                  expressionType: 3,
                  compareType: 2,
                });
              }
            } else {
              // 字段对比
              expressionList.push(
                {
                  ...item.primary,
                  linkCode,
                  linkSymbol: item.linkSymbol,
                  mainFlag: true,
                  expressionType: 3,
                  compareType: 1,
                },
                {
                  ...item.sub,
                  linkCode,
                  linkSymbol: item.linkSymbol,
                  mainFlag: false,
                  expressionType: 3,
                  compareType: 1,
                },
              );
            }
          });
          const params: any = {
            id: select?.id,
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
            const { data: resData, success }: any = await handleEdit(params);
            if (success) setSelect(resData);
            listRef.current?.run();
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
            <FilterLinkForm
              name="primaryEntity"
              editType={select ? 2 : 1}
              form={formRef.current}
              linkListArr={arr}
            />
          </Col>
          <Col span={12} style={{ minHeight: 200, borderLeft: '1px solid #D9D9D9' }}>
            <FilterLinkForm
              name="subEntity"
              editType={select ? 2 : 1}
              form={formRef.current}
              linkListArr={arr}
            />
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
          <Col span={24} style={{ marginBottom: '24px' }}>
            <ContraRatioForm linkListArr={arr} />
          </Col>
        </Row>
      </ProForm>
    </>
  );
}

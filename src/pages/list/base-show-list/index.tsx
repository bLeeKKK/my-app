import React, { useRef, useState, Fragment } from 'react';
// import { PageContainer } from '@ant-design/pro-layout';
// import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { zonghe, interfaceCallRecordExport } from './service';
import type { TableListItem, TableListPagination } from './data';
import { useSelector } from 'umi';
import moment from 'moment';
import { Button, Modal, message, Popover, Row, Col } from 'antd';
import { download } from '@/utils';
import { Tag } from 'antd';
import { useRafInterval } from 'ahooks';
import { timeDiff } from '@/utils';
import './style.less';

let searchData = {};

// 不需要处理小节点的
const arrExtar = ['sourceCode', 'currentCode'];
const getDeepObj = (obj, path = '') => {
  const pathArr = path.split('.');
  let res = obj;
  pathArr.forEach((item) => {
    res = res?.[item];
  });
  return res;
};
// 处理小节点渲染
function intoChild(arr, render) {
  const newArr = arr.map((res) => {
    // 不处理字段
    if (res.dataIndex === 'sourceCode') return { ...res, fixed: 'left', width: '100px' };
    if (res.dataIndex.includes('.currentCode1')) {
      return {
        ...res,
        width: '100px',
        render: (_, record) => {
          return getDeepObj(record, res.dataIndex);
        },
      };
    }
    if (res.dataIndex === 'MOFC_Order_B105' ||
      res.dataIndex === 'MOFC_Order_B106' ||
      res.dataIndex === 'LRP_Dispatch_B162' ||
      res.dataIndex === 'LRP_Dispatch_B172'
    ) {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          //现货|期货
          return e.remark ? e.remark : '-';
        },
      };
    }
    if (res.dataIndex === 'product_source_type') {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          //现货|C+3|计划
          if (e.sourceType === 0) {
            return '现货';
          } else if (e.sourceType === 1) {
            return '期货';
          } else if (e.sourceType === 2) {
            return 'C+3';
          } else {
            return '-';
          }
          // return e.remark ? e.remark : '-';
        },
      };
    }
    if (
      res.dataIndex === 'MOFC_Order_B100' ||
      res.dataIndex === 'MOFC_Order_B101' ||
      res.dataIndex === 'MOFC_Order_B104' ||
      res.dataIndex === 'LRP_Dispatch_B112' ||
      res.dataIndex === 'LRP_Dispatch_B122'
    ) {
      return {
        ...res,
        width: '100px',
        render: (e, record) => {
          return e.remark ? moment(e.remark).format('YYYY-MM-DD HH:mm:ss') : '-';
        },
      };
    }
    res.dataIndex = Array.isArray(res?.dataIndex)
      ? res.dataIndex
      : res?.dataIndex?.split?.('.') || res.dataIndex;
    if (res.children && res.children.length) {
      res.children = intoChild(res.children, render);
      return {
        ...res,
        width: '100px',
      };
    }

    // 最小节点
    return {
      ...res,
      render,
      width: '100px',
    };
  });
  return newArr;
}

// const expandedRowRender = (data) => <ShowBox data={data} />;

// const now = new Date();
const TableList: React.FC = () => {
  const { actionRef } = useSelector((state) => state.baseShowList);
  const [nodeColumns, setNodeColumns] = useState([]);
  const [nodeRecords, setNodeRecords] = useState([]);
  const ref = useRef();
  const [now, setNow] = useState(new Date());

  // useRafInterval(() => {
  //   setNow(new Date());
  // }, 1000);

  const newColumns = intoChild(nodeColumns, (smallNode, row) => {
    if (typeof smallNode.startDate === 'string') {
      smallNode.startDate = moment(parseInt(smallNode.startDate)).format('YYYY-MM-DD HH:mm:ss')
    }
    if (typeof smallNode.endDate === 'string') {
      smallNode.endDate = moment(parseInt(smallNode.endDate)).format('YYYY-MM-DD HH:mm:ss')
    }

    if (smallNode === '-') {
      return smallNode;
    }
    const t = typeof smallNode;
    if (t === 'string' || t === 'number') {
      return smallNode;
    }
    return (
      <>
        <Popover
          content={
            <>
              {smallNode.smallNodeList &&
                smallNode.smallNodeList.map((res, index) => {
                  return (
                    <Fragment key={index}>
                      <Row style={{ fontSize: '12px', width: '450px' }}>
                        <Col span={10}>{res.smallNodeName}</Col>
                        <Col span={14}>
                          {' 【' + moment(res.smallNodeStartDate).format('YYYY-MM-DD HH:mm:ss')}{' '}
                          <span style={{ color: res.smallNodeEndDate ? '' : 'red' }}>
                            -{' '}
                            {res.smallNodeEndDate
                              ? moment(res.smallNodeEndDate || now).format('YYYY-MM-DD HH:mm:ss')
                              : '处理中'}{' '}
                            】
                          </span>
                        </Col>
                      </Row>
                    </Fragment>
                  );
                })}
            </>
          }
        >
          <div className={(row.lastNode && row.lastNode === smallNode?.nodeName) ? 'tdC' : ''}>
            <div style={{ textAlign: 'center' }}>
              {smallNode.startDate &&
                timeDiff(smallNode.startDate, smallNode.endDate || now, false) < '0时1分0秒'
                ? '0时1分'
                : timeDiff(smallNode.startDate, smallNode.endDate || now, true) === '0时0分'
                  ? ''
                  : timeDiff(smallNode.startDate, smallNode.endDate || now, true)}
            </div>
            {smallNode.overTimeRemark && <Tag color={smallNode.signColor}>{smallNode.overTimeRemark}</Tag>}
          </div>

        </Popover>
      </>
    );
  });
  const formatData = (data) => {
    let temp = []
    data.forEach(element => {
      if (element.title === '完成状态') {
        element.valueEnum = { true: { text: '完成' }, false: { text: '未完成' } }
        temp.push(element)
      } else if (element.title === '大节点代码') {
        let t = {}
        element.children.forEach(e => {
          t[typeof e.dataIndex === 'string' ? e.dataIndex : e.dataIndex[0]] = { text: e.title }
        })
        element.valueEnum = t
        element.fieldProps = {
          mode: 'multiple',
        }
        temp.push(element)
      } else if (element.title === '预警等级') {
        let t = {}
        element.children.forEach(e => {
          t[e.dataIndex] = { text: e.title }
        })
        element.valueEnum = t
        element.fieldProps = {
          mode: 'multiple',
        }
        temp.push(element)
      } else if (element.title === '开始时间') {
        element.valueType = 'dateTimeRange'
        element.fieldProps = { onChange: () => { console.log(111) } }
        temp.push(element)
      }
      else {
        temp.push(element)
      }
    });

    temp.forEach((e, i) => {
      if (e.title === '业务节点') {
        e.children.forEach((ee, ii) => {
          if (ee.title === '订单号') {
            temp[i].children[ii].fixed = true
            let temp2 = JSON.parse(JSON.stringify(temp[i].children[ii]))
            temp[i].children.splice(ii, 1)
            temp.splice(1, 0, temp2)


          }
        })

      } else if (e.title === '运输方式') {
        temp[i].fixed = true
      }
    })
    console.log(temp);
    return temp
  }
  //   const exportFuc=()=>{

  //     function flatten(obj, key = '') {
  //       let result = {};
  //       for (let k in obj) {
  //         let newKey = key ? `${k}` : k;
  //         if (typeof obj[k] === 'object') {
  //           Object.assign(result, flatten(obj[k], newKey));
  //         } else {
  //           result[newKey] = obj[k];
  //         }
  //       }
  //       return result;
  //     }



  //     console.log(nodeRecords);
  //     let tempC = []
  //     nodeColumns.forEach(e=>{
  //       if(!e.hideInTable){
  //        if(e.children){
  //         e.children.forEach(ee=>{
  //           tempC.push({title:`${e.title}-${ee.title}`,dataIndex:typeof ee.dataIndex === 'string' ? ee.dataIndex : ee.dataIndex[0]})
  //         })
  //       }else{
  //         tempC.push({title:e.title,dataIndex:typeof e.dataIndex === 'string' ? e.dataIndex : e.dataIndex[0]})
  //       }
  //       }

  //     }) 
  //     let tempR = []
  //     nodeRecords.forEach(e=>{
  //       tempR.push(flatten(e))
  //     })
  //     console.log(tempR);

  //   //   return
  //   //  let  columns=[
  //   //     {
  //   //       title: '姓名',
  //   //       dataIndex: 'name',
  //   //     },
  //   //     {
  //   //       title: '性别',
  //   //       dataIndex: 'sex',
  //   //     },
  //   //   ]
  //   //  let jsonData=[
  //   //     {
  //   //       name: 'test',
  //   //       sex: 'male',
  //   //     },
  //   //     {
  //   //       name: 'test2',
  //   //       sex: 'female',
  //   //     },
  //   //   ]
  //     // 将数据转换成一个二维数组，每个子数组代表一行
  // const dataArr = [tempC.map(col => col.title), ...tempR.map(item => tempC.map(col => col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]))];

  // // 创建一个工作簿
  // const wb = utils.book_new();

  // // 创建一个工作表
  // const ws = utils.aoa_to_sheet(dataArr);

  // // 将工作表添加到工作簿中
  // utils.book_append_sheet(wb, ws, 'Sheet1');

  // // 导出Excel文件
  // writeFileXLSX (wb, 'data.xlsx');
  //   }
  const formatRecord = (data) => {
    let classKey = 1
    let findKey = false
    data.forEach(e => {

      e.children && e.children.forEach(ee => {
        if (e.orderNo === ee.orderNo) ee.orderNo = ''
        e.classKey = classKey
        ee.classKey = classKey
        findKey = true
      })
      if (findKey) {
        classKey === 2 ? classKey = 1 : classKey++
        findKey = false
      }
    })
    return data
  }
  return (
    // <PageContainer>
    <ProTable<TableListItem, TableListPagination>
      actionRef={actionRef}
      rowKey="sourceCode"
      scroll={{ y: 240 }}
      search={{ labelWidth: 120 }}
      // expandable={{
      //   expandedRowRender,
      // }}
      // toolBarRender={() => [
      //   <Button
      //     key="export"
      //     onClick={() => {
      //       Modal.confirm({
      //         title: '提示',
      //         content: '确定要导出数据吗？',
      //         onOk: () => {
      //          exportFuc()
      //         },
      //       });
      //     }}
      //   >
      //     导出报表
      //   </Button>,
      // ]}
      sticky
      // style={{backgroundColor:'red'}}
      className="contolTable"
      rowClassName={(record) => {
        if (record.classKey) {
          if (record.classKey === 1) {
            return 'clumStyle1'
          } else if (record.classKey === 2) {
            return 'clumStyle2'
          }
          return ''
        }
      }}
      bordered
      scroll={{ x: 100 }}
      formRef={ref}
      request={async (params, sort) => {
        searchData = params;
        if (params.createdDates && typeof params.createdDates != 'string') {
          params.createdDates[0] = moment(params.createdDates[0]).format("YYYY-MM-DDTHH:mm:ss")
          params.createdDates[1] = moment(params.createdDates[1]).format("YYYY-MM-DDTHH:mm:ss")
        } else if (typeof params.createdDates === 'string') {
          params.createdDates = ['2022-11-01T00:00:00', moment().format("YYYY-MM-DDTHH:mm:ss")]
        }
        const { success, data } = await zonghe(params, sort);
        data.headerData = formatData(data.headerData)
        data.records = formatRecord(data.records)
        setNodeColumns(data?.headerData || []);
        setNodeRecords(data?.records || [])
        return {
          success: success,
          data: data.records,
          total: data.total,
          // intfStDatetimes: ['2022-11-11T10:33:41.436', '2022-11-30T10:33:41.436'],
        };
      }}
      pagination={{
        showSizeChanger: true,
      }}
      columns={newColumns}
    />
    // </PageContainer>
  );
};

export default TableList;

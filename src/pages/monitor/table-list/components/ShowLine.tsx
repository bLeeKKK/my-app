import { Line } from '@ant-design/plots';

const ShowLine = ({ data = [], ...props }) => {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    seriesField: 'type',
    // lineStyle: ({ type }) => {
    //   if (type === '平均') {
    //     return {
    //       lineDash: [4, 4],
    //       opacity: 1,
    //     };
    //   }

    //   return { opacity: 0.5 };
    // },
  };
  return <Line {...config} {...props} />;
};

export default ShowLine;

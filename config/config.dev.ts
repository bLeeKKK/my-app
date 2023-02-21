// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  // qiankun: {
  //   master: {
  //     // 注册子应用信息
  //     apps: [
  //       {
  //         name: 'bizlog-web', // 唯一 id
  //         entry: 'http://localhost:8003', // html entry // ?sourceOrderkey=82135509&sourceSys=SCMC&userName=MOFC-管理员
  //       },
  //     ],
  //   },
  // },
});

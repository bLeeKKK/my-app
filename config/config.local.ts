// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'bizlog-web', // 唯一 id
          entry: 'http://localhost:8000', // html entry // ?sourceOrderkey=82135509&sourceSys=SCMC&userName=MOFC-管理员
        },
      ],
    },
  },
});

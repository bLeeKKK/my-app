import { request } from 'umi';
// import { SERVER_PATH } from '@/services/constants';

// 分页查询
export async function findByPage(data) {
  return request(`/report-inf/deliverEbocLeftMofc/findAllByPage`, {
    method: 'post',
    data,
  });
}

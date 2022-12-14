import { request } from 'umi';
import { BIZLOG_CORE, SERVER_PATH, MOCKER_API } from '@/services/constants';

export async function findAllByDictCode(code: string): Promise<{ success: boolean; data: any[] }> {
  return request(`${SERVER_PATH}/${BIZLOG_CORE}/sysDictDetail/findAllByDictCode?dictCode=${code}`, {
    method: 'GET',
  });
}

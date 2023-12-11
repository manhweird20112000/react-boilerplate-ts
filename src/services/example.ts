import { type AxiosResponse } from 'axios'

import { service } from '@/utils'

export const getPostExample = async () :Promise<AxiosResponse> => {
  return await service.get('posts')
}

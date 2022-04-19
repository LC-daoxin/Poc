import {
  axiosRequest
} from '@/utils/request'
import {
  headers
} from '../config'
import {
  ApiObject
} from '../apiObjectClass'

//port传递的可以是端口也可以为模块名
const port = 'admin'
const baseUrl = '/v1/masterdata/menu'

const apiList = {
  page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
  add: new ApiObject(baseUrl, port, 'POST', headers),
  update: new ApiObject(baseUrl, port, 'PUT', headers),
  delete: new ApiObject(baseUrl, port, 'DELETE', headers),
  export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
  import: new ApiObject(baseUrl + '/import', port, 'POST', headers),
  queryMenuTreeList: new ApiObject(baseUrl + '/queryMenuTreeList', port, 'GET', headers)
}


export default {
  page(data) {
    return axiosRequest({
      ...apiList.page,
      data
    })
  },
  save(data) {
    let requestParam = {
      ...apiList.add,
      data
    }
    if (data.id > 0) {
      requestParam = {
        ...apiList.update,
        data
      }
    }
    return axiosRequest(requestParam)
  },
  update(data) {
    return axiosRequest({
      ...apiList.update,
      data
    })
  },
  delete(data) {
    return axiosRequest({
      ...apiList.delete,
      data
    })
  },
  export (data) {
    return axiosRequest({
      ...apiList.export,
      responseType: 'blob',
      data
    })
  },
  import(data) {
    return axiosRequest({
      ...apiList.import,
      data
    })
  },
  queryMenuTreeList(data) {
    return axiosRequest({
      ...apiList.queryMenuTreeList,
      data
    })
  },
}
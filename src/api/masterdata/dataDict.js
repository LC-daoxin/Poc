import {
  axiosRequest
} from '@/utils/request'
import {
  ApiObject
} from '../apiObjectClass'
import {
  headers
} from '../config';

//port传递的可以是端口也可以为模块名
const port = 'admin'
const baseUrl = '/v1/masterdata/datadict'
const apiList = {
  page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
  add: new ApiObject(baseUrl, port, 'POST', headers),
  update: new ApiObject(baseUrl, port, 'PUT', headers),
  delete: new ApiObject(baseUrl, port, 'DELETE', headers),
  export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
  import: new ApiObject(baseUrl + '/import', port, 'POST', {
    ...headers,
    'Content-Type': 'multipart/form-data'
  }),
  deleteWithItem: new ApiObject(baseUrl + '/deleteWithItem', port, 'DELETE', headers),
  loadTreeData: new ApiObject(baseUrl + '/loadTreeData', port, 'GET', headers),
  loadDictItem: new ApiObject(baseUrl + '/loadDictItem', port, 'GET', headers)
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
  deleteWithItem(data) {
    return axiosRequest({
      ...apiList.deleteWithItem,
      data
    })
  },
  loadTreeData(data) {
    return axiosRequest({
      ...apiList.loadTreeData,
      data
    })
  },
  loadDictItem(dict, data) {
    let opts = {}
    opts = Object.assign(opts, apiList.loadDictItem)
    opts.url = Util.format('%s/%s', apiList.loadDictItem.url, dict)
    return axiosRequest({
      ...apiList.loadDictItem,
      data
    })
  },
}
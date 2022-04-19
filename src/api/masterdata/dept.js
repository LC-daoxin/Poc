import Util from 'util'
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
const baseUrl = '/v1/masterdata/dept'
const apiList = {
  page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
  add: new ApiObject(baseUrl, port, 'POST', headers),
  update: new ApiObject(baseUrl, port, 'PUT', headers),
  queryByIds: new ApiObject(baseUrl + '/queryByIds', port, 'POST', headers),
  delete: new ApiObject(baseUrl, port, 'DELETE', headers),
  export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
  import: new ApiObject(baseUrl + '/import', port, 'POST', {
    ...headers,
    'Content-Type': 'multipart/form-data'
  }),
  querySimpleDeptTree: new ApiObject(baseUrl + '/querySimpleDeptTree', port, 'GET', headers),
  queryDeptTreeList: new ApiObject(baseUrl + '/queryDeptTreeList', port, 'GET', headers),
  queryByKeywords: new ApiObject(baseUrl + '/queryByKeywords', port, 'GET', headers),
  deleteWithRelation: new ApiObject(baseUrl + '/deleteWithRelation', port, 'DELETE', headers),
  queryDeptAuthority: new ApiObject(baseUrl + '/queryDeptAuthority', port, 'GET', headers),
  saveDeptAuthority: new ApiObject(baseUrl + '/saveDeptAuthority', port, 'POST', headers),
  getAuthorityRule: new ApiObject(baseUrl + '/authorityRule', port, 'GET', headers),
  saveAuthorityRule: new ApiObject(baseUrl + '/authorityRule', port, 'POST', headers),
  queryDeptParentList: new ApiObject(baseUrl + '/queryDeptParentList', port, 'GET', headers) // 根据parentId 查询部门树形数据
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
  queryByIds(data) {
    return axiosRequest({
      ...apiList.queryByIds,
      params: data
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
  querySimpleDeptTree(data) {
    return axiosRequest({
      ...apiList.querySimpleDeptTree,
      data
    })
  },
  queryDeptTreeList(data) {
    return axiosRequest({
      ...apiList.queryDeptTreeList,
      data
    })
  },
  queryByKeywords(data) {
    return axiosRequest({
      ...apiList.queryByKeywords,
      data
    })
  },
  deleteWithRelation(data) {
    return axiosRequest({
      ...apiList.deleteWithRelation,
      data
    })
  },
  queryDeptAuthority(data) {
    return axiosRequest({
      ...apiList.queryDeptAuthority,
      data
    })
  },
  saveDeptAuthority(data) {
    return axiosRequest({
      ...apiList.saveDeptAuthority,
      data
    })
  },
  getAuthorityRule(data) {
    let opts = {}
    opts = Object.assign(opts, apiList.getAuthorityRule)
    opts.url = Util.format('%s/%s/%s', apiList.getAuthorityRule.url, data.deptId, data.authorityId)
    return axiosRequest({
      ...opts
    })
  },
  saveAuthorityRule(data) {
    return axiosRequest({
      ...apiList.saveAuthorityRule,
      data
    })
  },
  queryDeptParentList(data) {
    return axiosRequest({
      ...apiList.queryDeptParentList,
      data
    })
  },
}
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
const baseUrl = '/v1/masterdata/role'
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
  queryAll: new ApiObject(baseUrl + '/queryAll', port, 'GET', headers),
  roleUserList: new ApiObject(baseUrl + '/roleUserList', port, 'GET', headers),
  addUserRole: new ApiObject(baseUrl + '/addUserRole', port, 'POST', headers),
  deleteUserRole: new ApiObject(baseUrl + '/deleteUserRole', port, 'DELETE', headers),
  getAuthorityRule: new ApiObject(baseUrl + '/authorityRule', port, 'GET', headers),
  saveAuthorityRule: new ApiObject(baseUrl + '/authorityRule', port, 'POST', headers),
  queryRoleAuthority: new ApiObject(baseUrl + '/queryRoleAuthority', port, 'GET', headers),
  saveRoleAuthority: new ApiObject(baseUrl + '/saveRoleAuthority', port, 'POST', headers),
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
  queryAll(data) {
    return axiosRequest({
      ...apiList.queryAll,
      data
    })
  },
  roleUserList(data) {
    return axiosRequest({
      ...apiList.roleUserList,
      data
    })
  },
  addUserRole(data) {
    return axiosRequest({
      ...apiList.addUserRole,
      data
    })
  },
  deleteUserRole(data) {
    return axiosRequest({
      ...apiList.deleteUserRole,
      data
    })
  },
  getAuthorityRule(data) {
    let opts = {}
    opts = Object.assign(opts, apiList.getAuthorityRule)
    opts.url = Util.format('%s/%s/%s', apiList.getAuthorityRule.url, data.roleId, data.authorityId)
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
  queryRoleAuthority(data) {
    return axiosRequest({
      ...apiList.queryRoleAuthority,
      data
    })
  },
  saveRoleAuthority(data) {
    return axiosRequest({
      ...apiList.saveRoleAuthority,
      data
    })
  },
}
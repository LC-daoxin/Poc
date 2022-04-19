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
const baseUrl = '/v1/masterdata/user'
const apiList = {
  page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
  pageUser: new ApiObject(baseUrl + '/pageUser', port, 'POST', headers), // 分页列表查询带岗位
  add: new ApiObject(baseUrl, port, 'POST', headers),
  update: new ApiObject(baseUrl, port, 'PUT', headers),
  delete: new ApiObject(baseUrl, port, 'DELETE', headers),
  export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
  import: new ApiObject(baseUrl + '/import', port, 'POST', {
    ...headers,
    'Content-Type': 'multipart/form-data'
  }),
  addWithRelation: new ApiObject(baseUrl + '/addWithRelation', port, 'POST', headers),
  editWithRelation: new ApiObject(baseUrl + '/editWithRelation', port, 'PUT', headers),
  userDepartList: new ApiObject(baseUrl + '/userDepartList', port, 'GET', headers),
  queryAccounts: new ApiObject(baseUrl + '/queryAccounts', port, 'GET', headers), // 根据主账号ID查询所有次账号 
  detail: new ApiObject(baseUrl, port, 'GET', headers), // 通过id查询用户详情
  queryUserDataByUserId: new ApiObject(baseUrl + '/queryUserDataByUserId', port, 'GET', headers), // 根据用户id关联查询相关信息
  queryUserDataByUserIds: new ApiObject(baseUrl + '/queryUserDataByUserIds', port, 'GET', headers), // 根据用户ids批量关联查询相关信息  
  findUserByUsername: new ApiObject(baseUrl + '/findUserByUsername', port, 'GET', headers), // 通过用户名查询用户
  queryUserBy: new ApiObject(baseUrl + '/queryUserBy', port, 'GET', headers), // 根据条件查询用户
  queryUserRole: new ApiObject(baseUrl + '/queryUserRole', port, 'GET', headers),
  disableBatch: new ApiObject(baseUrl + '/disableBatch', port, 'PUT', headers),
  changePassword: new ApiObject(baseUrl + '/changePassword', port, 'PUT', headers)
}


export default {
  page(data) {
    return axiosRequest({
      ...apiList.page,
      data
    })
  },
  pageUser(data) {
    return axiosRequest({
      ...apiList.pageUser,
      data
    })
  },
  save(data) {
    let requestParam = {
      ...apiList.save,
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
  addWithRelation(data) {
    return axiosRequest({
      ...apiList.addWithRelation,
      data
    })
  },
  editWithRelation(data) {
    return axiosRequest({
      ...apiList.editWithRelation,
      data
    })
  },
  getUserDepartList(data) {
    return axiosRequest({
      ...apiList.userDepartList,
      data
    })
  },
  queryAccounts(userId) {
    const requetParams = {
      ...apiList.queryAccounts
    }
    requetParams.url = requetParams.url + `/${userId}`
    return axiosRequest(requetParams)
  },
  detail(Id) {
    const requetParams = {
      ...apiList.detail
    }
    requetParams.url = requetParams.url + `/${Id}`
    return axiosRequest(requetParams)
  },
  queryUserDataByUserId(data) {
    const requetParams = {
      ...apiList.queryUserDataByUserId,
      data
    }
    // requetParams.url = requetParams.url + `/${Id}`
    return axiosRequest(requetParams)
  },
  queryUserDataByUserIds(data) {
    const requetParams = {
      ...apiList.queryUserDataByUserIds,
      data
    }
    // requetParams.url = requetParams.url + `/${Id}`
    return axiosRequest(requetParams)
  },
  findUserByUsername(username) {
    const requetParams = {
      ...apiList.findUserByUsername
    }
    requetParams.url = requetParams.url + `/${username}`
    return axiosRequest(requetParams)
  },
  queryUserBy(data) {
    const requetParams = {
      ...apiList.queryUserBy,
      data
    }
    return axiosRequest(requetParams)
  },
  queryUserRole(data) {
    return axiosRequest({
      ...apiList.queryUserRole,
      data
    })
  },
  disableBatch(data) {
    return axiosRequest({
      ...apiList.disableBatch,
      data
    })
  },
  changePassword(data) {
    return axiosRequest({
      ...apiList.changePassword,
      data
    })
  }
}
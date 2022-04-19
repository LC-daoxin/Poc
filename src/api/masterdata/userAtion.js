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
    // /masterdata/usergroupuser
    // /v1/masterdata/usergroupuser/userdata
const baseUrl = '/v1/masterdata/usergroupuser'
const apiList = {
    page: new ApiObject(baseUrl + '/userdata', port, 'GET', headers), //查询
    add: new ApiObject(baseUrl + '/saveList', port, 'POST', headers), //新增
    save: new ApiObject(baseUrl, port, 'PUT', headers), //修改
    delete: new ApiObject(baseUrl, port, 'DELETE', headers), //删除
    // delete: new ApiObject(baseUrl, port, 'DELETE', headers),
    export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
    import: new ApiObject(baseUrl + '/import', port, 'POST', {
        ...headers,
        'Content-Type': 'multipart/form-data'
    })
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
    add(data) {
        return axiosRequest({
            ...apiList.add,
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
    import (data) {
        return axiosRequest({
            ...apiList.import,
            data
        })
    }
}
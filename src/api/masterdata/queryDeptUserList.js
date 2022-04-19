import {
    axiosRequest
} from '@/utils/request';
import {
    ApiObject
} from '../apiObjectClass';
import {
    headers
} from '../config';
//port传递的可以是端口也可以为模块名
const port = 'admin';
const baseUrl = '/v1/masterdata/userdept';

const apiList = {
    page: new ApiObject(baseUrl + '/queryDeptUserList', port, 'POST', headers),
    allPage: new ApiObject(baseUrl + '/page', port, 'POST', headers),
    findCategoryAll: new ApiObject(baseUrl + '/findCategoryAll', port, 'POST', headers),
    add: new ApiObject(baseUrl, port, 'POST', headers),
    update: new ApiObject(baseUrl, port, 'PUT', headers),
    delete: new ApiObject(baseUrl, port, 'DELETE', headers),
    export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
    import: new ApiObject(baseUrl + '/import', port, 'POST', {
        ...headers,
        'Content-Type': 'multipart/form-data',
    }),
    childList: new ApiObject(baseUrl + '/childList', port, 'GET', headers),
    detail: new ApiObject(baseUrl, port, 'GET', headers),
};

export default {
    page(data) {
        return axiosRequest({
            ...apiList.page,
            data,
        });
    },
    allPage(data) {
        return axiosRequest({
            ...apiList.allPage,
            data,
        });
    },
    findCategoryAll(data) {
        return axiosRequest({
            ...apiList.findCategoryAll,
            params: data
        });
    },
    add(data) {
        return axiosRequest({
            ...apiList.add,
            data
        });
    },
    update(data) {
        return axiosRequest({
            ...apiList.update,
            data,
        });
    },
    delete(data) {
        return axiosRequest({
            ...apiList.delete,
            data,
        });
    },
    export (data) {
        return axiosRequest({
            ...apiList.export,
            responseType: 'blob',
            data,
        });
    },
    import (data) {
        return axiosRequest({
            ...apiList.import,
            data,
        });
    },
    childList(data) {
        return axiosRequest({
            ...apiList.childList,
            data,
        });
    },
    detail(Id) {
        const requetParams = {
            ...apiList.detail
        }
        requetParams.url = requetParams.url + `/${Id}`
        return axiosRequest(requetParams)
    },
};
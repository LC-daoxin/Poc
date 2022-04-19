import {axiosRequest} from '@/utils/request';
import {headers, version} from '../config';
import {ApiObject} from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'file';
const baseUrl = `/${version.documentManage}/attachment`;
const apiList = {
  page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
  update: new ApiObject(baseUrl, port, 'PUT', headers),
  query: new ApiObject(baseUrl + '/query', port, 'POST', headers), // 批量查询
  check: new ApiObject(baseUrl + '/checkFile', port, 'POST', headers),
  upload: new ApiObject(baseUrl + '/upload', port, 'POST', headers),
  uploadFile: new ApiObject(baseUrl + '/uploadFile', port, 'POST', headers),
  uploadTitle: new ApiObject(baseUrl + '/uploadTitle', port, 'POST', headers), // 图片上传 不分片 system
  merge: new ApiObject(baseUrl + '/merge', port, 'POST', headers),
  delete: new ApiObject(baseUrl, port, 'DELETE', headers),
  download: new ApiObject(baseUrl + '/download', port, 'GET', headers),
  downloadImportFile: new ApiObject(baseUrl + '/template/download', port, 'GET', headers), // 导入模板下载接口 
};

export default {
  page(data) {
    return axiosRequest({
      ...apiList.page,
      data,
    });
  },
  update(data) {
    return axiosRequest({
      ...apiList.update,
      data,
    });
  },
  query(data) {
    return axiosRequest({
      ...apiList.query,
      data
    })
  },
  uploadFile(data, onProgress) {
    return axiosRequest({
      ...apiList.uploadFile,
      onUploadProgress: onProgress,
      data,
    });
  },
  uploadTitle(data, onProgress) {
    return axiosRequest({
      ...apiList.uploadTitle,
      onUploadProgress: onProgress,
      data,
    });
  },
  // download() {
  // 	return axiosRequest({
  // 		...apiList.download,
  // 	});
  // },
  delete(data) {
    return axiosRequest({
      ...apiList.delete,
      params: data,
    });
  },
  upload(data, onProgress) {
    return axiosRequest({
      ...apiList.upload,
      onUploadProgress: onProgress,
      data,
    });
  },
  download(name) {
    const config = {...apiList.download};
    config.url += '/' + name;
    config['responseType'] = 'blob';

    return axiosRequest(config);
  },
  downloadImportFile(name) {
    const config = {...apiList.downloadImportFile};
    config.url += '/' + name;
    config['responseType'] = 'blob';
    return axiosRequest(config);
  },
  check(data) {
    const config = {...apiList.check};
    config.headers['content-type'] = 'application/json';

    return axiosRequest({
      ...apiList.check,
      data,
    });
  },
  merge(data) {
    const config = {...apiList.merge};
    config.headers['content-type'] = 'application/json';

    return axiosRequest({
      ...apiList.merge,
      data,
    });
  },
  delete(data) {
    return axiosRequest({
      ...apiList.delete,
      params: data,
    });
  },
};

import {axiosRequest} from '@/utils/request';
import {headers, version} from '../config';
import {ApiObject} from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'designer';
const sourceUrl = `/${version.dataSource}/dataflow/dataflowdatasource`;
const serviceUrl = `/${version.dataSource}/dataflow/dataflowservice`;
const fileUrl = `/${version.dataSource}/dataflow/dataflowfile`;
const apiList = {
	sourcePage: new ApiObject(sourceUrl + '/page', port, 'POST', headers),
	sourceDelete: new ApiObject(sourceUrl, port, 'DELETE', headers),
	sourceUpdate: new ApiObject(sourceUrl, port, 'PUT', headers),
	servicePage: new ApiObject(serviceUrl + '/page', port, 'POST', headers),
	serviceDelete: new ApiObject(serviceUrl, port, 'DELETE', headers),
	serviceUpdate: new ApiObject(serviceUrl, port, 'PUT', headers),
	filePage: new ApiObject(fileUrl + '/page', port, 'POST', headers),
	fileDelete: new ApiObject(fileUrl, port, 'DELETE', headers),
	fileUpdate: new ApiObject(fileUrl, port, 'PUT', headers),
};

export default {
	sourcePage(data) {
		return axiosRequest({
			...apiList.sourcePage,
			data,
		});
	},
	sourceDelete(data) {
		return axiosRequest({
			...apiList.sourceDelete,
			params: data,
		});
	},
	sourceUpdate(data) {
		return axiosRequest({
			...apiList.sourceUpdate,
			data,
		});
	},
	servicePage(data) {
		return axiosRequest({
			...apiList.servicePage,
			data,
		});
	},
  serviceDelete(data) {
		return axiosRequest({
			...apiList.serviceDelete,
			params: data,
		});
	},
	serviceUpdate(data) {
		return axiosRequest({
			...apiList.serviceUpdate,
			data,
		});
	},
	filePage(data) {
		return axiosRequest({
			...apiList.filePage,
			data,
		});
	},
  fileDelete(data) {
		return axiosRequest({
			...apiList.fileDelete,
			params: data,
		});
	},
	fileUpdate(data) {
		return axiosRequest({
			...apiList.fileUpdate,
			data,
		});
	},
};

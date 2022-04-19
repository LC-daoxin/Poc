import { axiosRequest } from '@/utils/request';
import { headers, version } from '../config';
import { ApiObject } from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'admin';
const baseUrl = `/${version.systemBulletin}/masterdata/announcement`;
const apiList = {
	page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
	add: new ApiObject(baseUrl, port, 'POST', headers),
	update: new ApiObject(baseUrl, port, 'PUT', headers),
	delete: new ApiObject(baseUrl, port, 'DELETE', headers),
	export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
	import: new ApiObject(baseUrl + '/import', port, 'POST', {
		...headers,
		'Content-Type': 'multipart/form-data'
	})
};

export default {
	page(data) {
		return axiosRequest({
			...apiList.page,
			data
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
			data
		});
	},
	delete(data) {
		return axiosRequest({
			...apiList.delete,
			params: data
		});
	},
	detail(param) {
		return axiosRequest({
			...apiList.detail,
			params: param
		});
	},
	export(data) {
		return axiosRequest({
			...apiList.export,
			responseType: 'blob',
			data
		});
	},
	import(data) {
		return axiosRequest({
			...apiList.import,
			data
		});
	}
};

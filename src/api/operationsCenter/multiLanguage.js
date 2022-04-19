import { axiosRequest } from '@/utils/request';
import { headers, version } from '../config';
import { ApiObject } from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'admin';
const baseUrl = `/${version.multiLanguage}/masterdata/locale`;

const apiList = {
	page: new ApiObject(baseUrl + '/localePage', port, 'POST', headers),
	add: new ApiObject(baseUrl + '/savelocale', port, 'POST', headers),
	update: new ApiObject(baseUrl + '/updatelocale', port, 'PUT', headers),
	delete: new ApiObject(baseUrl + '/deletelocale/', port, 'DELETE', headers),
	export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
	import: new ApiObject(baseUrl + '/import', port, 'POST', {
		...headers,
		'Content-Type': 'multipart/form-data'
	}),
	preview: new ApiObject(baseUrl + '/preview', port, 'POST', headers)
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
	delete(id) {
		const deleteObj = {...apiList.delete}
		deleteObj.url += id;

		return axiosRequest({
			...deleteObj
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
	},
	preview(data) {
		return axiosRequest({
			...apiList.preview,
			data
		});
	}
};

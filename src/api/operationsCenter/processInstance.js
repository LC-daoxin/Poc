import { axiosRequest } from '@/utils/request';
import { headers, version } from '../config';
import { ApiObject } from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'runtime';
const baseUrl = `/${version.processInstance}/process/processinstance`;
const apiList = {
	page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
	queryPage: new ApiObject(baseUrl + '/queryPage', port, 'POST', headers), // 自定义分页列表查询 
	add: new ApiObject(baseUrl, port, 'POST', headers),
	update: new ApiObject(baseUrl, port, 'PUT', headers),
	delete: new ApiObject(baseUrl, port, 'DELETE', headers),
	export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
	import: new ApiObject(baseUrl + '/import', port, 'POST', {
		...headers,
		'Content-Type': 'multipart/form-data',
	}),
	preview: new ApiObject(baseUrl + '/preview', port, 'POST', headers),

	approveTask: new ApiObject('v1/engineruntime/approveTask', 8031, 'POST', headers),
	rejectTask: new ApiObject('v1/engineruntime/rejectTask', 8031, 'POST', headers),
	redirectTask: new ApiObject('v1/engineruntime/redirectTask', 8031, 'POST', headers),
	returnTask: new ApiObject('v1/engineruntime/returnTask', 8031, 'POST', headers),
	gotoActivity: new ApiObject('v1/engineruntime/gotoActivity', 8031, 'POST', headers),
	repealProcess: new ApiObject('v1/engineruntime/repealProcess', 8031, 'POST', headers),	
	closeProcess: new ApiObject('v1/engineruntime/closeProcess', 8031, 'POST', headers), // 关闭流程
	retryProcess: new ApiObject('v1/engineruntime/retryProcess', 8031, 'POST', headers),
};

export default {
	page(data) {
		return axiosRequest({
			...apiList.page,
			data,
		});
	},
	queryPage(data) {
		return axiosRequest({
			...apiList.queryPage,
			data,
		});
	},
	add(data) {
		return axiosRequest({
			...apiList.add,
			data,
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
			params: data,
		});
	},
	export(data) {
		return axiosRequest({
			...apiList.export,
			responseType: 'blob',
			data,
		});
	},
	import(data) {
		return axiosRequest({
			...apiList.import,
			data,
		});
	},
	preview(data) {
		return axiosRequest({
			...apiList.preview,
			data,
		});
	},

	approveTask(data) {
		return axiosRequest({
			...apiList.approveTask,
			data,
		});
	},
	rejectTask(data) {
		return axiosRequest({
			...apiList.rejectTask,
			data,
		});
	},
	redirectTask(data) {
		return axiosRequest({
			...apiList.redirectTask,
			data,
		});
	},
	returnTask(data) {
		return axiosRequest({
			...apiList.returnTask,
			data,
		});
	},
	gotoActivity(data) {
		return axiosRequest({
			...apiList.gotoActivity,
			data,
		});
	},
	repealProcess(data) {
		return axiosRequest({
			...apiList.repealProcess,
			data,
		});
	},
	closeProcess(data) {
		return axiosRequest({
			...apiList.closeProcess,
			data,
		});
	},
	retryProcess(data) {
		return axiosRequest({
			...apiList.retryProcess,
			data,
		});
	},
};

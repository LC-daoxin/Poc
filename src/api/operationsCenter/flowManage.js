import {
	axiosRequest
} from '@/utils/request';
import {
	headers,
	version
} from '../config';
import {
	ApiObject
} from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'designer';
const baseUrl = `/${version.flowManage}/process/processbaseconfig`;
const apiList = {
	page: new ApiObject(baseUrl + '/getProcessList', port, 'POST', headers),
	add: new ApiObject(baseUrl, port, 'POST', headers),
	getProcessListByUserId: new ApiObject(baseUrl + '/getProcessListByUserId', port, 'POST', headers), // 流程应用(根据当前用户分页查询)
	addProcess: new ApiObject(baseUrl + '/addProcess', port, 'POST', headers), // 添加流程相关信息
	checkCode: new ApiObject(baseUrl + '/checkCode', port, 'GET', headers), // 校验流程编码是否唯一
	checkPermit: new ApiObject(baseUrl + '/checkPermit', port, 'POST', headers), // 查询用户是否有流程相关的权限
	checkTurnProcess: new ApiObject(baseUrl + '/checkTurnProcess', port, 'GET', headers), // 查询该权限是否可以代理审批 
	findUserProcess: new ApiObject(baseUrl + '/findUserProcess', port, 'POST', headers), // 查询用户对应要发起的流程 
	addProcessAll: new ApiObject(baseUrl + '/addProcessAll', port, 'POST', headers), // 添加流程相关信息 合并三个接口
	changeProcessAll: new ApiObject(baseUrl + '/process', port, 'PUT', headers), // 修改流程相关信息
	getViewAndAppover: new ApiObject(baseUrl + '/getViewAndAppover', port, 'POST', headers), // 权限控制视图
	update: new ApiObject(baseUrl, port, 'PUT', headers),
	delete: new ApiObject(baseUrl, port, 'DELETE', headers),
	export: new ApiObject(baseUrl + '/export', port, 'POST', headers),
	exportJson: new ApiObject(baseUrl + '/exportJson', port, 'POST', headers), // 导出流程Json
	import: new ApiObject(baseUrl + '/import', port, 'POST', {
		...headers,
		'Content-Type': 'multipart/form-data',
	}),
	importJson: new ApiObject(baseUrl + '/importJson', port, 'POST', { // 导入流程Json
		...headers,
		'Content-Type': 'multipart/form-data',
	}),
	preview: new ApiObject(baseUrl + '/preview', port, 'POST', headers),
	// getProcessList: new ApiObject(baseUrl + '/getProcessList', port, 'POST', headers), // 流程应用(分页查询)
};

export default {
	page(data) {
		return axiosRequest({
			...apiList.page,
			data,
		});
	},
	add(data) {
		return axiosRequest({
			...apiList.add,
			data,
		});
	},
	getProcessListByUserId(data) {
		return axiosRequest({
			...apiList.getProcessListByUserId,
			data,
		});
	},
	addProcess(data) {
		return axiosRequest({
			...apiList.addProcess,
			data,
		});
	},
	checkCode(Code) {
		const requetParams = {
			...apiList.checkCode
		}
		requetParams.url = requetParams.url + `/${Code}`
		return axiosRequest(requetParams)
	},
	checkPermit(data) {
		return axiosRequest({
			...apiList.checkPermit,
			data,
		});
	},
	checkTurnProcess(data) {
		return axiosRequest({
			...apiList.checkTurnProcess,
			data,
		});
	},
	findUserProcess(data) {
		return axiosRequest({
			...apiList.findUserProcess,
			data,
		});
	},
	addProcessAll(data) {
		return axiosRequest({
			...apiList.addProcessAll,
			data,
		});
	},
	changeProcessAll(data) {
		return axiosRequest({
			...apiList.changeProcessAll,
			data,
		});
	},
	getViewAndAppover(data) {
		return axiosRequest({
			...apiList.getViewAndAppover,
			data,
		});
	},
	put(data) {
		return axiosRequest({
			...apiList.put,
			data,
		});
	},
	delete(data) {
		return axiosRequest({
			...apiList.delete,
			params: data,
		});
	},
	export (data) {
		return axiosRequest({
			...apiList.export,
			responseType: 'blob',
			data,
		});
	},
	exportJson (data) {
		return axiosRequest({
			...apiList.exportJson,
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
	importJson(data) {
		return axiosRequest({
			...apiList.importJson,
			data,
		});
	},
	preview(data) {
		return axiosRequest({
			...apiList.preview,
			data,
		});
	},
	page(data) {
		return axiosRequest({
			...apiList.page,
			data,
		});
	},
};
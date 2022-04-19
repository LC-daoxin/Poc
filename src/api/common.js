import Vue from 'vue';
import { axiosRequest } from '@/utils/request';
import { headers, version } from './config';
import {
	ApiObject
} from './apiObjectClass'

//port传递的可以是端口也可以为模块名
const port = 'admin';
const baseUrl = `/${version.common}/common/duplicate`;
const apiList = {
	duplicateCheck: new ApiObject(baseUrl + '/check', port, 'GET', headers)
};

export default {
	duplicateCheck(data) {
		return axiosRequest({
			...apiList.duplicateCheck,
			data
		});
	},
	/**
	 * 获取文件服务访问路径
	 * @param avatar
	 * @param subStr
	 * @returns {*}
	 */
	getFileAccessHttpUrl(avatar, subStr) {
		if (!subStr) subStr = 'http';
		try {
			if (avatar && avatar.startsWith(subStr)) {
				return avatar;
			} else {
				if (avatar && avatar.length > 0 && avatar.indexOf('[') == -1) {
					return window._CONFIG['staticDomainURL'] + '/' + avatar;
				}
			}
		} catch (err) {
			return;
		}
	}
};

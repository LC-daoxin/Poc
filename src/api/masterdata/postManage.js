import { axiosRequest } from '@/utils/request';
import { headers, version } from '../config';
import { ApiObject } from '../apiObjectClass';

//port传递的可以是端口也可以为模块名
const port = 'admin';
const baseUrl = `/${version.postManage}/masterdata/position`;
const apiList = {
	page: new ApiObject(baseUrl + '/page', port, 'POST', headers),
};

export default {
	page(data) {
		return axiosRequest({
			...apiList.page,
			data,
		});
	}
};

import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

function handleError(error, reject, opts) {
	// let isAlert = opts.custom ? opts.custom['isAlert'] : true;
	// isAlert = isAlert === undefined ? true : isAlert;
	// console.log(error, error.response)
	// const {data,config} = error.response
	// if (isAlert && error instanceof Object && error.code != undefined) {
	// 	if (error.code === 'ECONNABORTED') {
	// 		message.error('请求超时');
	// 	} else if (error.response && error.response.data) {
	// 		if (error.response.data.msg) {
	// 			message.error(error.response.data.msg);
	// 		} else if (error.response.data.message) {
	// 			message.error(error.response.data.msg);
	// 		}
	// 	} else if (error.message) {
	// 		message.error(error.message);
	// 	}
	// }
	// if(data.errorCode !=undefined && data.status=='FAILED' && config.url =='/oauth/token')
	// {
	// 	Modal.error({
	// 		title: '登录遇到问题',
	// 		content: '登录遇到问题,将跳转到统一登陆页面',
	// 		okText: '确定',
	// 		mask: false,
	// 		onOk: () => {
	// 			Cookie.remove('oauth-auth-server');
	// 			removeAuthorization()
	// 			db.remove('token');
	// 			db.remove('state');
	// 			window.location.href = '/#/ssologin';
	// 			window.location.reload();
	// 		},
	// 	});
	// }
	// else{
	// 	reject(error);
	// }
}

// http请求
const axiosRequest = (opts) => {
	// 公共参数
	const publicParams = {
		// ts: Date.now()
	};

	// http默认配置
	const method = opts.method.toUpperCase();
	// baseURL
	// 开发环境： /api                 // 开发环境在 vue.config.js 中有 devServer.proxy 代理
	// 生产环境： http://IP:PORT/api   // 生产环境中 代理失效， 故需要配置绝对路径
	//判断port传递的是否是端口,否则为模块名
	var path = `:${opts.port}`;
	if(isNaN(parseInt(opts.port)))
	{
       path = `/${opts.port}`
	}
	const httpDefaultOpts = {
		method,
		baseURL: process.env.VUE_APP_API_BASE_URL + path,
		url: opts.url,
		responseType: opts.responseType || '',
		timeout: 600000,
	};
	if (opts['headers']) {
		httpDefaultOpts.headers = opts['headers'];
	}
	if (opts['baseURL']) {
		httpDefaultOpts.baseURL = opts['baseURL'];
	}
	if (opts['onUploadProgress']) {
		httpDefaultOpts.onUploadProgress = opts['onUploadProgress'];
	}

	const dataRequest = ['PUT', 'POST', 'PATCH'];
	if (dataRequest.includes(method)) {
		httpDefaultOpts.data = opts.data || {};
		if (opts.params != null && opts.params != undefined) {
			httpDefaultOpts.params = {
				...publicParams,
				...opts.params,
			};
		}
	} else {
    if (method === 'DELETE') {
      opts.data ? httpDefaultOpts.data = opts.data : ''
		}
 		httpDefaultOpts.params = {
			...publicParams,
			...(opts.params || opts.data),
		};
	}

	// formData转换
	if (opts.formData) {
		httpDefaultOpts.transformRequest = [
			(data) => {
				const formData = new FormData();
				if (data) {
					Object.entries(data).forEach((item) => {
						formData.append(item[0], item[1]);
					});
				}
				return formData;
			},
		];
	}

	const promise = new Promise((resolve, reject) => {
		axios(httpDefaultOpts)
			.then((response) => {
				handleSuccess(response, resolve, opts);
			})
			.catch((error) => {
				handleError(error, reject, opts);
			});
	});
	return promise;
};

/**
 * post
 * @param {url,port,parameter} opts
 */
 async function postAction(opts) {
	//判断port传递的是否是端口,否则为模块名
	var path = `:${opts.port}`;
	if(isNaN(parseInt(opts.port)))
	{
       path = `/${opts.port}`
	}
	let requestUrl = baseURL + path + opts.url;
	opts = {
		url: requestUrl,
		method: 'post',
		data: opts.parameter,
	};
	const promise = new Promise((resolve, reject) => {
		axios(opts)
			.then((response) => {
				handleSuccess(response, resolve, opts);
			})
			.catch((error) => {
				handleError(error, reject, opts);
			});
	});
	return promise;
}

export default request

export {
  installer as VueAxios,
  request as axios,
  axiosRequest,
  postAction
}

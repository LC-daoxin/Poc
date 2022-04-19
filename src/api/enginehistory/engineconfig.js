import { axiosRequest } from '@/utils/request'
import { ApiObject } from '@/api/apiObjectClass'
import { headers } from '@/api/config';

//port传递的可以是端口也可以为模块名
const port = 'flowengine'
const baseUrl = '/v1/engineconfig'
const apiList = {
  activateProcessDefinitionByKey: new ApiObject(baseUrl + '/activateProcessDefinitionByKey', port, 'POST', headers), // 激活流程
  deleteDeployment: new ApiObject(baseUrl + '/deleteDeployment', port, 'DELETE', headers), // 删除部署
  deleteDeploymentAndHistory: new ApiObject(baseUrl + '/deleteDeploymentAndHistory', port, 'DELETE', headers), // 删除部署以及实例
  deploy: new ApiObject(baseUrl + '/deploy', port, 'POST', headers), // 部署流程
  getActivityDefinition: new ApiObject(baseUrl + '/getActivityDefinition', port, 'POST', headers), // 获取流程节点信息
  getProcessDefinition: new ApiObject(baseUrl + '/getProcessDefinition', port, 'POST', headers), // 获取流程定义信息
  suspendProcessDefinitionByKey: new ApiObject(baseUrl + '/suspendProcessDefinitionByKey', port, 'POST', headers), // 挂起流程
  getProcessModelView: new ApiObject(baseUrl + '/getProcessModelView', port, 'GET', headers), // 获取流程模型视图
  queryMatrixNodeList: new ApiObject(baseUrl + '/queryMatrixNodeList', port, 'POST', headers), // 矩阵节点配置查询
  queryNextNodes: new ApiObject(baseUrl + '/queryNextNodes', port, 'POST', headers), // 管理员修改节点权限的查询
  realApplyName: new ApiObject('/v1/user/realApplyName', port, 'GET', headers), // 获取流程申请人
  queryLoginUrl: new ApiObject('/v1/user/queryLoginUrl', port, 'POST', headers), // 获取业务系统登录链接
  getPass: new ApiObject('/v1/user/getPass', port, 'GET', headers), // 根据用户生成免登信息
}

export default {
  activateProcessDefinitionByKey(data) {
    return axiosRequest({
      ...apiList.activateProcessDefinitionByKey,
      data
    });
  },
  deleteDeployment(data) {
    return axiosRequest({
      ...apiList.deleteDeployment,
      data
    });
  },
  deleteDeploymentAndHistory(data) {
    return axiosRequest({
      ...apiList.deleteDeploymentAndHistory,
      data
    });
  },
  deploy(data) {
    return axiosRequest({
      ...apiList.deploy,
      data
    });
  },
  getActivityDefinition(data) {
    return axiosRequest({
      ...apiList.getActivityDefinition,
      data
    });
  },
  getProcessDefinition(data) {
    return axiosRequest({
      ...apiList.getProcessDefinition,
      data
    });
  },
  suspendProcessDefinitionByKey(data) {
    return axiosRequest({
      ...apiList.suspendProcessDefinitionByKey,
      data
    });
  },
  getProcessModelView(data) {
    return axiosRequest({
      ...apiList.getProcessModelView,
      data
    });
  },
  queryMatrixNodeList(data) {
    return axiosRequest({
      ...apiList.queryMatrixNodeList,
      data
    });
  },
  queryNextNodes(data) {
    return axiosRequest({
      ...apiList.queryNextNodes,
      data
    });
  },
  realApplyName(data) {
    return axiosRequest({
      ...apiList.realApplyName,
      data
    });
  },
  queryLoginUrl(data) {
    return axiosRequest({
      ...apiList.queryLoginUrl,
      data
    });
  },
  getPass(data) {
    return axiosRequest({
      ...apiList.getPass,
      data
    });
  },
};

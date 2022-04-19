import { axiosRequest } from '@/utils/request'
import { ApiObject } from '@/api/apiObjectClass'
import { headers } from '@/api/config';

//port传递的可以是端口也可以为模块名
const port = 'flowengine'
const baseUrl = '/v1/enginehistory'
const apiList = {
  approvedActHistory: new ApiObject(baseUrl + '/approvedActHistory', port, 'GET', headers), // 获取流程已审批节点信息 
  deleteHistoricProcessInstance: new ApiObject(baseUrl + '/deleteHistoricProcessInstance', port, 'DELETE', headers), // 删除历史流程实例
  deleteHistoricTaskInstance: new ApiObject(baseUrl + '/deleteHistoricTaskInstance', port, 'DELETE', headers), // 删除历史任务实例
  getHistoricActivityInstance: new ApiObject(baseUrl + '/getHistoricActivityInstance', port, 'GET', headers), // 获取历史流程节点实例
  getHistoricApproveUserForProcessInstance: new ApiObject(baseUrl + '/getHistoricApproveUserForProcessInstance', port, 'GET', headers), // 获取历史流程审批人
  getHistoricApproveUserForTask: new ApiObject(baseUrl + '/getHistoricApproveUserForTask', port, 'GET', headers), // 获取历史任务审批人
  getHistoricProcessInstance: new ApiObject(baseUrl + '/getHistoricProcessInstance', port, 'GET', headers), // 获取历史流程实例
  getHistoricTaskInstance: new ApiObject(baseUrl + '/getHistoricTaskInstance', port, 'GET', headers), // 获取历史流程节点实例
  getHistoricVariableInstance: new ApiObject(baseUrl + '/getHistoricVariableInstance', port, 'GET', headers), // 获取历史流程变量实例
  getProcessInstanceHistoryLog: new ApiObject(baseUrl + '/getProcessInstanceHistoryLog', port, 'GET', headers), // 获取流程实例历史记录
  getProcessInstanceOperationHistoryLog: new ApiObject(baseUrl + '/getProcessInstanceOperationHistoryLog', port, 'GET', headers), // 获取流程操作记录
  getProcessInstanceView: new ApiObject(baseUrl + '/getProcessInstanceView', port, 'GET', headers), // 获取流程实例流程图
}

export default {
  approvedActHistory(data) {
    return axiosRequest({
      ...apiList.approvedActHistory,
      params: data
    });
  },
  deleteHistoricProcessInstance(data) {
    return axiosRequest({
      ...apiList.deleteHistoricProcessInstance,
      params: data
    });
  },
  deleteHistoricTaskInstance(data) {
    return axiosRequest({
      ...apiList.deleteHistoricTaskInstance,
      params: data
    });
  },
  getHistoricActivityInstance(data) {
    return axiosRequest({
      ...apiList.getHistoricActivityInstance,
      data
    })
  },
  getHistoricApproveUserForProcessInstance(data) {
    return axiosRequest({
      ...apiList.getHistoricApproveUserForProcessInstance,
      data
    })
  },
  getHistoricApproveUserForTask(data) {
    return axiosRequest({
      ...apiList.getHistoricApproveUserForTask,
      data
    })
  },
  getHistoricProcessInstance(data) {
    return axiosRequest({
      ...apiList.getHistoricProcessInstance,
      data
    })
  },
  getHistoricTaskInstance(data) {
    return axiosRequest({
      ...apiList.getHistoricTaskInstance,
      data
    })
  },
  getHistoricVariableInstance(data) {
    return axiosRequest({
      ...apiList.getHistoricVariableInstance,
      data
    })
  },
  getProcessInstanceHistoryLog(data) {
    return axiosRequest({
      ...apiList.getProcessInstanceHistoryLog,
      params: data
    })
  },
  getProcessInstanceOperationHistoryLog(data) {
    return axiosRequest({
      ...apiList.getProcessInstanceOperationHistoryLog,
      params: data
    })
  },
  getProcessInstanceView(data) {
    return axiosRequest({
      ...apiList.getProcessInstanceView,
      params: data
    })
  }
};

import { axiosRequest } from '@/utils/request'
import { ApiObject } from '@/api/apiObjectClass'
import { headers } from '@/api/config';

//port传递的可以是端口也可以为模块名
const port = 'flowengine'
const baseUrl = '/v1/engineruntime'
const apiList = {
  activateProcessInstanceByKey: new ApiObject(baseUrl + '/activateProcessInstanceByKey', port, 'POST', headers), // 激活流程实例
  addSignTask: new ApiObject(baseUrl + '/addSignTask', port, 'POST', headers), // 加签流程
  adjustActivityTask: new ApiObject(baseUrl + '/adjustActivityTask', port, 'POST', headers), // 加减节点审批
  approveFreeNode: new ApiObject(baseUrl + '/approveFreeNode', port, 'POST', headers), // 处理自由流程节点
  approveTask: new ApiObject(baseUrl + '/approveTask', port, 'POST', headers), // 审批流程
  callBackTask: new ApiObject(baseUrl + '/callBackTask', port, 'POST', headers), // 召回流程
  returnTask: new ApiObject(baseUrl + '/returnTask', port, 'POST', headers), // 审批过程中退回流程
  recallTask: new ApiObject(baseUrl + '/recallTask', port, 'POST', headers), // 已审批人撤回流程
  copyUserTask: new ApiObject(baseUrl + '/copyUserTask', port, 'POST', headers), // 传阅抄送
  communicationTask: new ApiObject(baseUrl + '/communicationTask', port, 'POST', headers), // 沟通  
  delegateTask: new ApiObject(baseUrl + '/delegateTask', port, 'POST', headers), // 代理任务
  deleteProcessInstance: new ApiObject(baseUrl + '/deleteProcessInstance', port, 'POST', headers), // 删除流程实例
  deleteProcessInstanceByProcess: new ApiObject(baseUrl + '/deleteProcessInstanceByProcess', port, 'POST', headers), // 根据流程删除流程实例
  getActiveActivityIds: new ApiObject(baseUrl + '/getActiveActivityIds', port, 'POST', headers), // 获取激活的节点Id
  gotoActivity: new ApiObject(baseUrl + '/gotoActivity', port, 'POST', headers), // 跳转流程
  nextTask: new ApiObject(baseUrl + '/nextTask', port, 'POST', headers), // 获取下一个审批节点信息
  redirectTask: new ApiObject(baseUrl + '/redirectTask', port, 'POST', headers), // 转交任务
  rejectTask: new ApiObject(baseUrl + '/rejectTask', port, 'POST', headers), // 拒绝流程
  removeVariable: new ApiObject(baseUrl + '/removeVariable', port, 'POST', headers), // 移除流程全局变量
  removeVariableLocal: new ApiObject(baseUrl + '/removeVariableLocal', port, 'POST', headers), // 移除流程任务局部变量
  removeVariables: new ApiObject(baseUrl + '/removeVariables', port, 'POST', headers), // 批量移除流程全局变量
  removeVariablesLocal: new ApiObject(baseUrl + '/removeVariablesLocal', port, 'POST', headers), // 批量移除流程任务局部变量
  closeProcess: new ApiObject(baseUrl + '/closeProcess', port, 'POST', headers), // 关闭流程
  repealProcess: new ApiObject(baseUrl + '/repealProcess', port, 'POST', headers), // 作废流程(审批人)
  repealProcessByApplicant: new ApiObject(baseUrl + '/repealProcessByApplicant', port, 'POST', headers), // 作废流程（申请人）
  resubmitTask: new ApiObject(baseUrl + '/resubmitTask', port, 'POST', headers), // 再次发起流程
  retryProcess: new ApiObject(baseUrl + '/retryProcess', port, 'POST', headers), // 重试流程
  setVariable: new ApiObject(baseUrl + '/setVariable', port, 'POST', headers), // 设置流程全局变量
  setVariableLocal: new ApiObject(baseUrl + '/setVariableLocal', port, 'POST', headers), // 设置流程任务局部变量
  setVariables: new ApiObject(baseUrl + '/setVariables', port, 'POST', headers), // 批量设置流程全局变量
  setVariablesLocal: new ApiObject(baseUrl + '/setVariablesLocal', port, 'POST', headers), // 批量设置流程任务局部变量
  startProcessInstance: new ApiObject(baseUrl + '/startProcessInstance', port, 'POST', headers), // 发起流程
  suspendProcessInstanceByKey: new ApiObject(baseUrl + '/suspendProcessInstanceByKey', port, 'POST', headers), // 挂起流程实例
  updateBusinessKey: new ApiObject(baseUrl + '/updateBusinessKey', port, 'POST', headers), // 更新业务单据号
  processFlowAddSignList: new ApiObject(baseUrl + '/processFlowAddSignList', port, 'GET', headers), // 获取流程加签节点信息
  currentTaskApprovers: new ApiObject(baseUrl + '/currentTask/approvers', port, 'GET', headers), // 获取当前节点的审批人
  processFlowView: new ApiObject(baseUrl + '/processFlowView', port, 'GET', headers), // 获取流程实例视图 （加签）
  querybackType: new ApiObject(baseUrl + '/querybackType', port, 'GET', headers), // 退回流程状态
  originProcessFlowView: new ApiObject(baseUrl + '/origin/processFlowView', port, 'GET', headers), // 获取流程实例视图 (审批环节调整)
  managerUpdateNodes: new ApiObject(baseUrl + '/managerUpdateNodes', port, 'POST', headers), // 管理员修改后续节点
  createPendingByKey: new ApiObject(baseUrl + '/createPendingByKey', port, 'POST', headers), // 根据流程实力自此生成本地代办
}

export default {
  activateProcessInstanceByKey(data) {
    return axiosRequest({
      ...apiList.activateProcessInstanceByKey,
      data
    });
  },
  addSignTask(data) {
    return axiosRequest({
      ...apiList.addSignTask,
      data
    });
  },
  adjustActivityTask(data) {
    return axiosRequest({
      ...apiList.adjustActivityTask,
      data
    });
  },
  approveFreeNode(data) {
    return axiosRequest({
      ...apiList.approveFreeNode,
      data
    });
  },
  approveTask(data) {
    return axiosRequest({
      ...apiList.approveTask,
      data
    });
  },
  callBackTask(data) {
    return axiosRequest({
      ...apiList.callBackTask,
      data
    });
  },
  returnTask(data) {
    return axiosRequest({
      ...apiList.returnTask,
      data
    });
  },
  recallTask(data) {
    return axiosRequest({
      ...apiList.recallTask,
      data
    });
  },
  copyUserTask(data) {
    return axiosRequest({
      ...apiList.copyUserTask,
      data
    });
  },
  communicationTask(data) {
    return axiosRequest({
      ...apiList.communicationTask,
      data
    });
  },
  delegateTask(data) {
    return axiosRequest({
      ...apiList.delegateTask,
      data
    });
  },
  deleteProcessInstance(data) {
    return axiosRequest({
      ...apiList.deleteProcessInstance,
      data
    });
  },
  deleteProcessInstanceByProcess(data) {
    return axiosRequest({
      ...apiList.deleteProcessInstanceByProcess,
      data
    });
  },
  getActiveActivityIds(data) {
    return axiosRequest({
      ...apiList.getActiveActivityIds,
      data
    });
  },
  gotoActivity(data) {
    return axiosRequest({
      ...apiList.gotoActivity,
      data
    });
  },
  nextTask(data) {
    return axiosRequest({
      ...apiList.nextTask,
      data
    });
  },
  redirectTask(data) {
    return axiosRequest({
      ...apiList.redirectTask,
      data
    });
  },
  rejectTask(data) {
    return axiosRequest({
      ...apiList.rejectTask,
      data
    });
  },
  removeVariable(data) {
    return axiosRequest({
      ...apiList.removeVariable,
      data
    });
  },
  removeVariableLocal(data) {
    return axiosRequest({
      ...apiList.removeVariableLocal,
      data
    });
  },
  removeVariables(data) {
    return axiosRequest({
      ...apiList.removeVariables,
      data
    });
  },
  removeVariablesLocal(data) {
    return axiosRequest({
      ...apiList.removeVariablesLocal,
      data
    });
  },
  closeProcess(data) {
    return axiosRequest({
      ...apiList.closeProcess,
      data
    });
  },
  repealProcess(data) {
    return axiosRequest({
      ...apiList.repealProcess,
      data
    });
  },
  repealProcessByApplicant(data) {
    return axiosRequest({
      ...apiList.repealProcessByApplicant,
      data
    });
  },
  resubmitTask(data) {
    return axiosRequest({
      ...apiList.resubmitTask,
      data
    });
  },
  retryProcess(data) {
    return axiosRequest({
      ...apiList.retryProcess,
      data
    });
  },
  setVariable(data) {
    return axiosRequest({
      ...apiList.setVariable,
      data
    });
  },
  setVariableLocal(data) {
    return axiosRequest({
      ...apiList.setVariableLocal,
      data
    });
  },
  setVariables(data) {
    return axiosRequest({
      ...apiList.setVariables,
      data
    });
  },
  setVariablesLocal(data) {
    return axiosRequest({
      ...apiList.setVariablesLocal,
      data
    });
  },
  startProcessInstance(data) {
    return axiosRequest({
      ...apiList.startProcessInstance,
      data
    });
  },
  suspendProcessInstanceByKey(data) {
    return axiosRequest({
      ...apiList.suspendProcessInstanceByKey,
      data
    });
  },
  updateBusinessKey(data) {
    return axiosRequest({
      ...apiList.updateBusinessKey,
      data
    });
  },
  processFlowAddSignList(data) {
    return axiosRequest({
      ...apiList.processFlowAddSignList,
      data
    });
  },
  currentTaskApprovers(data) {
    return axiosRequest({
      ...apiList.currentTaskApprovers,
      data
    });
  },
  processFlowView(data) {
    return axiosRequest({
      ...apiList.processFlowView,
      data
    });
  },
  querybackType(data) {
    return axiosRequest({
      ...apiList.querybackType,
      data
    });
  },
  originProcessFlowView(data) {
    return axiosRequest({
      ...apiList.originProcessFlowView,
      data
    });
  },
  managerUpdateNodes(data) {
    return axiosRequest({
      ...apiList.managerUpdateNodes,
      data
    });
  },
  createPendingByKey(data) {
    return axiosRequest({
      ...apiList.createPendingByKey,
      data
    });
  }
};

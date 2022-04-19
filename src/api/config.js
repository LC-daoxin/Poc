export const version = {
	common: 'v1',
	portalsettins: 'v1', // 门户配置
	pendingtask: 'v1', // 我的待办
	requestapplication: 'v1', // 我的申请
	draftapplication: 'v1', // 我的草稿
	copymetask: 'v1', // 抄送我的
	communicatetask: 'v1', // 我的沟通
	participatedtask: 'v1', // 我的已办
	myProxy: 'v1', // 我的代理
	mycollection: 'v1', // 我的收藏
	newInitiative: 'v1', // 新发起
	processInstance: 'v1', // 流程实例
	dataModal: 'v1', // 数据模型
	menuList: 'v1', // 菜单管理
	flowManage: 'v1', // 流程管理
	multiLanguage: 'v1', // 多语言
	thirdPartyManage: 'v1', // 第三方应用
	formManage: 'v1', // 表单管理
	routeManage: 'v1', // 路由管理
	loginLog: 'v1', // 登陆日志查看
	operationLog: 'v1', // 操作日志查看
	exceptionLog: 'v1', // 异常日志查看
	resourceOperation: 'v1', // 资源操作
	systemRoleAuth: 'v1', // 系统角色授权
	swaggergroup: 'v1', // API
	departmentRole: 'v1', // 部门角色
	departmentRoleAuth: 'v1', // 部门角色授权
	messageTemplate: 'v1', // 消息模版
	accessQueryAndMaintenance: 'v1', // 权限查询与维护
	systemBulletin: 'v1', // 系统公告
	metrics: 'v1', //系统管理
	authentication: 'v1', //认证
	dataFlowDataSource: 'v1', // 数据源
	textManage: 'v1', // 消息管理
	documentManage: 'v1', // 文档管理
	actuatorManagement: 'v1', // 执行器管理
	cronTaskManage: 'v1', // cron任务管理
	chartInfo: 'v1', // 运行报表
	schedulingLog: 'v1', // 调度日志
	postManage: 'v1', // 岗位管理
	dataSource: 'v1', // 数据源
	abnormalprocess: 'v1', //异常流程
	forminstance: 'v1', // 单运行时数据操作-表单实例
};

const userInfo = JSON.parse(localStorage.getItem('admin.user'));
const {access_token} = userInfo || {access_token: ''};

export const headers = {
	Authorization: 'Basic enVpaG91X3VpOnp1aWhvdV91aV9zZWNyZXQ=',
	tenant: 'default'
};

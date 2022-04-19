/*
 * @Author: Lince 
 * @Date: 2021-08-10 14:07:24 
 * @Last Modified by: Lince
 * @Last Modified time: 2021-12-13 20:37:09
 * @Description 部门管理
 */
<template>
  <a-card
    :bordered="false"
    class="dept"
  >
    <a-row :gutter="10">
      <a-col
        :md="9"
        :sm="24"
      >
        <a-card
          class="deptTree"
          :bordered="false"
        >
          <!-- 按钮操作区域 -->
          <a-row>
            <a-button
              @click="handleAdd(1)"
              type="primary"
            >添加组织</a-button>
            <a-button
              @click="handleAdd(2)"
              type="primary"
            >添加下级</a-button>
            <!-- <a-button type="primary" icon="download" @click="handleExportXls('部门信息')">导出</a-button>
						<a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
							<a-button type="primary" icon="import">导入</a-button>
						</a-upload> -->
            <a-button
              title="删除多条数据"
              @click="batchDel"
              type="default"
            >批量删除</a-button>
            <a-dropdown
              :trigger="['click']"
              placement="topCenter"
            >
              <a-menu slot="overlay">
                <a-menu-item
                  key="1"
                  @click="checkALL"
                >全部勾选</a-menu-item>
                <a-menu-item
                  key="2"
                  @click="cancelCheckALL"
                >取消全选</a-menu-item>
                <a-menu-item
                  key="3"
                  @click="expandAll"
                >展开所有</a-menu-item>
                <a-menu-item
                  key="4"
                  @click="closeAll"
                >合并所有</a-menu-item>
                <a-menu-item
                  key="5"
                  @click="refresh"
                >刷新</a-menu-item>
              </a-menu>
              <a-button> 操作
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </a-row>
          <a-spin :spinning="loading">
            <div class="tree-content">
              <a-alert
                type="info"
                :showIcon="true"
              >
                <div slot="message">
                  当前选择：<span>{{ this.currSelected.departName || '未选择' }}</span>
                  <a
                    v-if="this.currSelected.departName"
                    style="margin-left: 10px"
                    @click="onClearSelected"
                  >取消</a>
                </div>
              </a-alert>
              <a-input-search
                @search="onSearch"
                v-model="deptSearch"
                style="width: 100%; margin-top: 10px"
                placeholder="请输入部门名称"
              />
              <!-- 树-->
              <div class="tree">
                <a-dropdown
                  :trigger="[this.dropTrigger]"
                  @visibleChange="dropStatus"
                >
                  <span style="user-select: none">
                    <a-tree
                      v-if="deptTree.length > 0"
                      checkable
                      multiple
                      @select="onSelect"
                      @check="onCheck"
                      @rightClick="rightHandle"
                      :selectedKeys="selectedKeys"
                      :checkedKeys="checkedKeys"
                      :treeData="deptTree"
                      :load-data="onLoadTreeChildren"
                      :expandedKeys="iExpandedKeys"
                      :replace-fields="replaceFields"
                      @expand="onExpand"
                    />
                  </span>
                  <!--新增右键点击事件,和增加添加和删除功能-->
                  <a-menu slot="overlay">
                    <a-menu-item
                      @click="handleAdd(3)"
                      key="1"
                    >添加</a-menu-item>
                    <a-menu-item
                      @click="handleDelete"
                      key="2"
                    >删除</a-menu-item>
                    <a-menu-item
                      @click="closeDrop"
                      key="3"
                    >取消</a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </a-spin>
        </a-card>
      </a-col>
      <a-col
        :md="15"
        :sm="24"
      >
        <a-tabs defaultActiveKey="1">
          <a-tab-pane
            tab="部门信息"
            key="1"
          >
            <a-card
              :bordered="false"
              v-if="selectedKeys.length > 0"
            >
              <a-form-model
                class="basicInfo"
                ref="form"
                :model="model"
                :rules="rules"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              >
                <a-form-model-item
                  label="机构名称"
                  prop="departName"
                >
                  <a-input
                    v-model="model.departName"
                    placeholder="请输入机构/部门名称"
                  />
                </a-form-model-item>
                <a-form-model-item
                  label="机构编码"
                  prop="orgCode"
                >
                  <a-input
                    v-model="model.orgCode"
                    placeholder="无"
                    disabled
                  />
                </a-form-model-item>
                <a-form-model-item label="上级部门">
                  <a-tree-select
                    v-show="model.parentId != 0 && !allDeptLoading"
                    style="width: 100%"
                    :dropdownStyle="{maxHeight: '400px', overflow: 'auto'}"
                    :treeData="treeDeptOptions"
                    :replace-fields="deptReplaceFields"
                    v-model="model.parentId"
                    :load-data="onLoadTreeChildren"
                    disabled
                    placeholder="无"
                  >
                  </a-tree-select>
                  <a-select
                    v-show="model.parentId == 0"
                    placeholder="无上级部门"
                    disabled
                  />
                  <a-select
                    v-show="model.parentId != 0 && allDeptLoading"
                    :loading="allDeptLoading"
                    :placeholder="`${$t('loading')}...`"
                    disabled
                  />
                </a-form-model-item>
                <a-form-model-item
                  label="机构类型"
                  prop="orgCategory"
                >
                  <a-radio-group
                    v-model="model.orgCategory"
                    placeholder="请选择机构类型"
                  >
                    <a-radio
                      v-if="model.orgCategory == '1'"
                      value="1"
                    > 公司 </a-radio>
                    <template v-else>
                      <a-radio value="2"> 部门 </a-radio>
                      <a-radio value="3"> 岗位 </a-radio>
                    </template>
                  </a-radio-group>
                </a-form-model-item>
                <a-form-model-item label="排序">
                  <a-input-number
                    v-model="model.sort"
                    :min="0"
                  />
                </a-form-model-item>
                <a-form-model-item
                  label="手机号"
                  prop="mobile"
                >
                  <a-input
                    v-model="model.mobile"
                    placeholder="请输入手机号"
                  />
                </a-form-model-item>
                <a-form-item label="传真">
                  <a-input
                    v-model="model.fax"
                    placeholder="请输入传真"
                  />
                </a-form-item>
                <a-form-model-item label="地址">
                  <a-input
                    v-model="model.address"
                    placeholder="请输入地址"
                  />
                </a-form-model-item>
                <a-form-model-item label="部门负责人">
                  <!-- <dept-user-select
                    v-model="model.responsibleUserId"
                    placeholder="请选择部门负责人"
                    :multiple="true"
                    :currentDeptId="currentDeptId"
                    :itemId='itemId'
                  /> -->
                  <select-single
                    ref="responsibleUser"
                    :typeList="[1]"
                    typeName="user"
                    showInputValue="realname"
                    :selectMultiple="true"
                    placeholder="选择部门负责人"
                    v-model="responsibleUser"
                    @modelChange="modelChangeUser($event, 'responsibleUserId')"
                  />
                </a-form-model-item>
                <a-form-model-item label="部门分管领导">
                  <!-- <dept-user-select
                    v-model="model.departmentLeaderId"
                    placeholder="请选择部门分管领导"
                    :multiple="true"
                    :currentDeptId="currentDeptId"
                    :itemId='itemId'
                  /> -->
                  <select-single
                    ref="departmentLeader"
                    :typeList="[1]"
                    typeName="user"
                    showInputValue="realname"
                    :selectMultiple="true"
                    placeholder="选择部门分管领导"
                    v-model="departmentLeader"
                    @modelChange="modelChangeUser($event, 'departmentLeaderId')"
                  />
                </a-form-model-item>
                <a-form-model-item label="流程对接人">
                  <!-- <dept-user-select
                    v-model="model.processResponsibleUserId"
                    placeholder="请选择流程对接人"
                    :multiple="true"
                    :currentDeptId="currentDeptId"
                    :itemId='itemId'
                  /> -->
                  <select-single
                    ref="processResponsibleUser"
                    :typeList="[1]"
                    typeName="user"
                    showInputValue="realname"
                    :selectMultiple="true"
                    placeholder="选择流程对接人"
                    v-model="processResponsibleUser"
                    @modelChange="modelChangeUser($event, 'processResponsibleUserId')"
                  />
                </a-form-model-item>
                <a-form-model-item label="备注">
                  <a-textarea
                    v-model="model.memo"
                    placeholder="请输入备注"
                  />
                </a-form-model-item>
              </a-form-model>
              <div class="drawer-bootom-button">
                <a-button
                  @click="clearForm"
                  type="default"
                  htmlType="button"
                  icon="sync"
                >重置</a-button>
                <a-button
                  @click="submitForm"
                  type="primary"
                  htmlType="button"
                  icon="form"
                >保存</a-button>
              </div>
            </a-card>
            <a-card v-else>
              <a-empty>
                <span slot="description"> 请先选择一个部门! </span>
              </a-empty>
            </a-card>
          </a-tab-pane>
          <a-tab-pane
            tab="部门用户"
            key="2"
            forceRender
          >
            <dept-user-info ref="DeptUserInfo" />
          </a-tab-pane>
          <a-tab-pane
            tab="部门角色"
            key="3"
            forceRender
          >
            <dept-role-info ref="DeptRoleInfo" />
          </a-tab-pane>
          <a-tab-pane
            tab="部门权限"
            key="4"
            forceRender
          >
            <dept-authority-modal ref="deptAuth" />
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <dept-modal
        ref="deptModal"
        :deptReplaceFields="deptReplaceFields"
        :treeDeptOptions="treeDeptOptions"
        :allDeptLoading="allDeptLoading"
        @ok="loadTree"
      ></dept-modal>
    </a-row>
  </a-card>
</template>
<script>
  import {pick, cloneDeep} from 'lodash';
  import DeptAuthorityModal from './modules/DeptAuthorityModal';
  import DeptUserSelect from '@/components/BizComponents/DeptUserSelect';
  import DeptUserInfo from './modules/DeptUserInfo';
  import DeptRoleInfo from './modules/DeptRoleInfo';
  import DeptModal from './modules/DeptModal';
  import deptApi from '@/api/masterdata/dept';
  import userApi from '@/api/masterdata/user.js';
  import SelectSingle from '@/components/PannelPicker/SelectSingle';
  import {unique} from '@/utils/util';

  export default {
  	name: 'DeptList',
  	components: {
  		DeptAuthorityModal,
  		DeptModal,
  		DeptUserInfo,
  		DeptRoleInfo,
  		DeptUserSelect,
  		SelectSingle
  	},
  	data() {
  		return {
  			currentDeptId: '',
  			iExpandedKeys: [], // 展开节点 []
  			setExpandedKeys: [], // 记录展开节点 []
  			deptSearch: '', // 搜索部门名称
  			loading: false,
  			model: {},
  			rules: {
  				departName: [{required: true, message: '请输入机构名称', trigger: 'blur'}],
  				// orgCode: [{required: true, message: '请输入机构编码', trigger: 'blur'}],
  				orgCategory: [{required: true, message: '请选择机构类型', trigger: 'change'}],
  				mobile: [{validator: this.validateMobile, trigger: 'blur'}]
  			},
  			treeDeptOptions: [], // 上级部门Options
  			replaceFields: {
  				children: 'children',
  				title: 'departName',
  				key: 'id'
  			},
  			deptReplaceFields: {
  				value: 'id',
  				title: 'departName',
  				key: 'id'
  			},
  			allDeptLoading: false, // 全部部门获取Loading
  			deptTree: [], // 部门数据Tree
  			rightClickSelectedKey: '',
  			rightClickSelectedOrgCode: '',
  			dropTrigger: '',
  			dept: {},
  			disableSubmit: false,
  			checkedKeys: [],
  			selectedKeys: [],
  			currSelected: {},
  			allTreeKeys: [],
  			labelCol: {
  				xs: {span: 24},
  				sm: {span: 5}
  			},
  			wrapperCol: {
  				xs: {span: 24},
  				sm: {span: 16}
  			},
  			itemId: '',
  			responsibleUser: [], // 部门负责人
  			departmentLeader: [], // 部门分管领导
  			processResponsibleUser: [] // 流程对接人
  		};
  	},
  	methods: {
  		loadTree(parentId = 0) {
  			this.loading = true;
  			this.deptTree = [];
  			console.log(this.iExpandedKeys);
  			this._queryDeptParentList(parentId).then((res) => {
  				this.allTreeKeys = [];
  				for (let i = 0; i < res.length; i++) {
  					if (res[i].isLeaf) {
  						delete res[i].children;
  					}
  					let temp = res[i];
  					this.deptTree.push(temp);
  					// this.setThisExpandedKeys(temp);
  					this.getAllKeys(temp);
  				}
  				this.loading = false;
  			});
  		},
  		onLoadTreeChildren(treeNode) {
  			return new Promise((resolve) => {
  				if (treeNode.dataRef.children?.length > 0) {
  					resolve();
  					return;
  				}
  				this._queryDeptParentList(treeNode.dataRef.id)
  					.then((res) => {
  						res.forEach((item) => {
  							if (item.isLeaf) {
  								delete item.children;
  							}
  							if (this.setExpandedKeys.includes(item.id)) {
  								this.iExpandedKeys.push(item.id);
  								this.iExpandedKeys = unique(this.iExpandedKeys);
  							}
  							treeNode.dataRef.children.push(item);
  						});
  						resolve();
  					})
  					.catch((res) => {
  						resolve();
  					});
  			});
  		},
  		_queryDeptParentList(parentId = 0) {
  			return new Promise((resolve, reject) => {
  				deptApi.queryDeptParentList({parentId}).then((res) => {
  					const {code, msg, data} = res;
  					if (code === '0001') {
  						console.log('loadTree', data);
  						if (data.length > 0) {
  							resolve(data);
  						} else {
  							reject([]);
  						}
  					} else {
  						reject([]);
  						this.$message.error(msg);
  					}
  				});
  			});
  		},
  		loadALlTree() {
  			// 获取全部部门信息
  			this.treeDeptOptions = [];
  			this.allDeptLoading = true;
  			deptApi.queryDeptTreeList().then((res) => {
  				console.log(res);
  				if (res.isSuccess) {
  					// this.allTreeKeys = [];
  					for (let i = 0; i < res.data.length; i++) {
  						let temp = res.data[i];
  						this.treeDeptOptions.push(temp);
  						this.allDeptLoading = false;
  					}
  				}
  			});
  		},
  		setThisExpandedKeys(node) {
  			// 记录展开的node
  			if (node.children && node.children.length > 0) {
  				this.iExpandedKeys.push(node.id);
  				for (let a = 0; a < node.children.length; a++) {
  					this.setThisExpandedKeys(node.children[a]);
  				}
  			}
  		},
  		refresh() {
  			this.deptSearch = '';
  			this.loadTree();
  		},
  		// 右键操作方法
  		rightHandle(node) {
  			this.dropTrigger = 'contextmenu';
  			console.log(node.node.eventKey);
  			this.rightClickSelectedKey = node.node.eventKey;
  			this.rightClickSelectedOrgCode = node.node.dataRef.orgCode;
  		},
  		onExpand(expandedKeys) {
  			console.log('onExpand', expandedKeys);
  			this.setExpandedKeys = expandedKeys;
  			this.iExpandedKeys = expandedKeys;
  			console.log(this.deptTree);
  		},
  		// 右键点击下拉框改变事件
  		dropStatus(visible) {
  			if (visible == false) {
  				this.dropTrigger = '';
  			}
  		},
  		// 右键店家下拉关闭下拉框
  		closeDrop() {
  			this.dropTrigger = '';
  		},
  		batchDel: function () {
  			console.log(this.checkedKeys);
  			if (this.checkedKeys.length <= 0) {
  				this.$message.warning('请选择一条记录！');
  			} else {
  				var ids = '';
  				for (var a = 0; a < this.checkedKeys.length; a++) {
  					ids += this.checkedKeys[a] + ',';
  				}
  				var that = this;
  				this.$confirm({
  					title: '确认删除',
  					content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
  					onOk: function () {
  						deptApi.deleteWithRelation({ids: ids}).then((res) => {
  							if (res.isSuccess) {
  								that.$message.success(res.msg);
  								that.loadTree();
  								that.onClearSelected();
  							} else {
  								that.$message.warning(res.msg);
  							}
  						});
  					}
  				});
  			}
  		},
  		onSearch(value) {
  			let that = this;
  			if (value?.trim()) {
  				deptApi.queryByKeywords({keyWord: value}).then((res) => {
  					if (res.isSuccess) {
  						that.deptTree = [];
  						for (let i = 0; i < res.data.length; i++) {
  							res.data[i].isLeaf = true;
  							let temp = res.data[i];
  							that.deptTree.push(temp);
  						}
  					} else {
  						that.$message.warning(res.msg);
  					}
  				});
  			} else {
  				that.loadTree();
  			}
  		},
  		onCheck(checkedKeys, info) {
  			let record = info.node.dataRef;
  			console.log('onCheck', checkedKeys, info);
  			this.currentDeptId = record.id;
  			this.$refs.DeptUserInfo.open(record);
  			this.$refs.DeptRoleInfo.open(record);
  			this.checkedKeys = checkedKeys;
  		},
  		getUserInfo(ids, key) {
  			console.log(ids);
  			let idList = ids?.split(',');
  			this[key] = [];
  			if (idList?.length > 0) {
  				userApi.queryUserDataByUserIds({userIds: ids}).then((res) => {
  					console.log('用户详情', res);
  					const {code, msg, data} = res;
  					if (code === '0001') {
  						data.forEach((user) => {
  							this[key].push({
  								...user,
  								type: 'user',
  								typeName: '人员',
  								name: user.username,
  								id: user.id
  							});
  						});
  					}
  				});
  			}
  		},
  		modelChangeUser(row, key) {
  			if (row?.length > 0) {
  				let ids = [];
  				row.forEach((item) => {
  					ids.push(item.id);
  				});
  				this.model[key] = ids.join(',')
  			} else if (row?.length == 0) {
					this.model[key] = ''
				}
  		},
  		onSelect(selectedKeys, e) {
  			let record = e.node.dataRef;
  			this.itemId = record.id;
  			console.log('onSelect-record', selectedKeys, record);
  			this.getUserInfo(record.responsibleUserId, 'responsibleUser');
  			this.getUserInfo(record.departmentLeaderId, 'departmentLeader');
  			this.getUserInfo(record.processResponsibleUserId, 'processResponsibleUser');
  			this.currSelected = Object.assign({}, record);
  			this.model = Object.assign(
  				{},
  				pick(cloneDeep(this.currSelected), [
  					'id',
  					'parentId',
  					'departName',
  					'orgCategory',
  					'orgCode',
  					'sort',
  					'mobile',
  					'fax',
  					'address',
  					'memo',
  					'responsibleUserId', // 部门负责人
  					'departmentLeaderId', // 部门分管领导
  					'processResponsibleUserId' // 流程对接人
  				])
  			);
  			this.selectedKeys = [record.id];
  			this.$refs.deptAuth.show(record.id);
  			this.currentDeptId = record.id;
  			this.$refs.DeptRoleInfo.open(record);
  			this.$refs.DeptUserInfo.open(record);
  		},
  		onClearSelected() {
  			// 取消选择
  			this.checkedKeys = [];
  			this.currSelected = {};
  			this.$refs['form']?.resetFields();
  			this.selectedKeys = [];
  			this.$nextTick(() => {
  				this.$refs.deptAuth.deptId = '';
  				this.$refs.DeptUserInfo.model.deptId = null;
  				this.$refs.DeptRoleInfo.model.deptId = null;
  			});
  		},
  		submitForm() {
  			console.log('submitForm');
  			this.$refs['form'].validate((valid) => {
  				if (valid) {
  					if (!this.currSelected.id) {
  						this.$message.warning('请点击选择要修改部门!');
  						return;
  					}
  					deptApi.update(this.model).then((res) => {
  						if (res.isSuccess) {
  							this.$message.success('保存成功!');
  							this.currSelected = Object.assign({}, this.model);
  							// this.iExpandedKeys = [];
  							this.loadTree();
  						} else {
  							this.$message.error(res.msg);
  						}
  					});
  				} else {
  					console.log('error submit!!');
  					return false;
  				}
  			});
  		},
  		clearForm() {
  			// 重置
  			this.$refs['form'].resetFields();
  			this.model = Object.assign(
  				{},
  				pick(cloneDeep(this.currSelected), [
  					'id',
  					'parentId',
  					'departName',
  					'orgCategory',
  					'orgCode',
  					'sort',
  					'mobile',
  					'fax',
  					'address',
  					'memo',
  					'responsibleUserId',
  					'departmentLeaderId', // 部门分管领导
  					'processResponsibleUserId'
  				])
  			);
  		},
  		handleAdd(num) {
  			if (num == 1) {
  				this.$refs.deptModal.add();
  				this.$refs.deptModal.title = '新增';
  			} else if (num == 2) {
  				let key = this.currSelected.id;
  				if (!key) {
  					this.$message.warning('请先点击选中上级部门！');
  					return false;
  				}
  				this.$refs.deptModal.add(this.selectedKeys);
  				this.$refs.deptModal.title = '新增';
  			} else {
  				this.$refs.deptModal.add(this.rightClickSelectedKey);
  				this.$refs.deptModal.title = '新增';
  			}
  		},
  		handleDelete() {
  			var that = this;
  			this.$confirm({
  				title: '确认删除',
  				content: '确定要删除此部门以及子节点数据吗?',
  				onOk: function () {
  					deptApi.deleteWithRelation({ids: that.rightClickSelectedKey}).then((res) => {
  						if (res.isSuccess) {
  							//删除成功后，去除已选中中的数据
  							that.checkedKeys.splice(
  								that.checkedKeys.findIndex((key) => key === that.rightClickSelectedKey),
  								1
  							);
  							that.$message.success('删除成功!');
  							that.loadTree();
  							//删除后同步清空右侧基本信息内容
  							let orgCode = that.form.getFieldValue('orgCode');
  							if (orgCode && orgCode === that.rightClickSelectedOrgCode) {
  								that.onClearSelected();
  							}
  						} else {
  							that.$message.warning('删除失败!');
  						}
  					});
  				}
  			});
  		},
  		expandAll() {
  			// 展开
  			this.iExpandedKeys = this.allTreeKeys;
  		},
  		closeAll() {
  			// 合并
  			this.iExpandedKeys = [];
  		},
  		checkALL() {
  			// 全部选择
  			this.checkedKeys = this.allTreeKeys;
  		},
  		cancelCheckALL() {
  			// 取消选择
  			this.checkedKeys = [];
  		},
  		getAllKeys(node) {
  			// 记录所有节点id
  			this.allTreeKeys.push(node.id);
  			if (node.children && node.children.length > 0) {
  				for (let a = 0; a < node.children.length; a++) {
  					this.getAllKeys(node.children[a]);
  				}
  			}
  		},
  		validateMobile(rule, value, callback) {
  			if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
  				callback();
  			} else {
  				callback('您的手机号码格式不正确!');
  			}
  		}
  	},
  	created() {
  		this.refresh();
  		this.loadALlTree();
  	}
  };
</script>
<style lang="less" scoped>
.dept {
	height: calc(100vh - 115px);
	width: 100%;
	overflow: hidden;
	background-color: #fff;
	/deep/ .ant-card-body {
		padding: 10px;
	}
}
.deptTree {
	padding: 0;
	/deep/ .ant-card-body {
		padding: 20px 15px;
		.tree-content {
			background: #fff;
			height: calc(100vh - 200px);
			margin-top: 10px;
			overflow: hidden;
			.tree {
				height: calc(100vh - 260px);
				overflow: auto;
				padding-bottom: 10px;
				&::-webkit-scrollbar {
					width: 6px;
					height: 10px;
				}
				&::-webkit-scrollbar-thumb {
					background-color: #c4c8cf;
					border: 1px solid #c4c8cf;
				}
			}
		}
		// .table-operator {
		// 	margin: 10px;
		// }
	}
}
.basicInfo {
	height: calc(100vh - 260px);
	width: 100%;
	overflow: auto;
	&::-webkit-scrollbar {
		width: 6px;
		height: 10px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #c4c8cf;
		border: 1px solid #c4c8cf;
	}
}

.anty-node-layout .ant-layout-header {
	padding-right: 0;
}

.header {
	padding: 0 8px;
}

.header button {
	margin: 0 3px;
}

.ant-modal-cust-warp {
	height: 100%;
}

.ant-modal-cust-warp .ant-modal-body {
	height: calc(100% - 110px) !important;
	overflow-y: auto;
}

.ant-modal-cust-warp .ant-modal-content {
	height: 90% !important;
	overflow-y: hidden;
}

#app .desktop {
	height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
	margin-left: 3px;
}

.drawer-bootom-button {
	/*position: absolute;*/
	bottom: 0;
	width: 100%;
	border-top: 1px solid #e8e8e8;
	padding: 10px 16px;
	text-align: right;
	left: 0;
	background: #fff;
	border-radius: 0 0 2px 2px;
}
</style>

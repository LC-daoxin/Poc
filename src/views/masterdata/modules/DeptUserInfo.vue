<template>
	<div class="dept-user">
		<template v-if="model.deptId">
			<!-- 查询区域 -->
			<a-form-model
				ref="form"
				class="search-bar"
				layout="inline"
				:model="model"
				:labelCol="{span: searchLabelCol}"
				:wrapperCol="{span: searchWrapperCol}"
			>
				<a-form-model-item class="form-item" :label="$t('username')" prop="userName">
					<a-input v-model="model.userName" :placeholder="$t('username')" allowClear></a-input>
				</a-form-model-item>
				<a-form-model-item class="form-item">
					<a-button type="primary" icon="search" @click="searchQuery">{{ $t('search') }}</a-button>
				</a-form-model-item>
			</a-form-model>
			<div class="search-approval-wrapper" style="margin-bottom: 10px">
				<a-space>
					<a-button @click="handleAddUserDepart" type="primary" icon="plus">添加已有用户</a-button>
					<!-- <a-button @click="handleAdd" type="primary" icon="plus">新建用户</a-button> -->
					<a-button @click="searchReset" icon="reload">重置</a-button>
					<a-dropdown v-if="selectionKeys.length > 0">
						<a-menu slot="overlay">
							<a-menu-item key="1" @click="batchDel">
								<a-icon type="delete" />
								取消关联
							</a-menu-item>
						</a-menu>
						<a-button>
							批量操作
							<a-icon type="down" />
						</a-button>
					</a-dropdown>
				</a-space>
				<a-space> </a-space>
			</div>
			<!-- table区域-begin -->
			<public-table
				class="public-table"
				:pagination="pagination"
				:params="tableParams"
				:rowSelection="true"
				@pageChange="loadData"
				@selectionChange="selectionChange"
			></public-table>
			<!-- table区域-end -->
		</template>
		<a-card v-else>
			<a-empty>
				<span slot="description"> 请先选择一个部门! </span>
			</a-empty>
		</a-card>
		<!-- 功能区域 -->
		<user-modal ref="modalForm" @ok="searchQuery"></user-modal>
		<Select-User-Modal ref="selectUserModal" @selectFinished="selectOK"></Select-User-Modal>
		<dept-role-user-modal ref="deptRoleUser"></dept-role-user-modal>
	</div>
</template>

<script>
import {langAndAuth} from '@/mixin';
import userDeptApi from '@/api/masterdata/userDept';
import SelectUserModal from './SelectUserModal';
import UserModal from './UserModal';
import DeptRoleUserModal from './DeptRoleUserModal';

export default {
	name: 'DeptUserInfo',
	mixins: [langAndAuth],
	components: {
		DeptRoleUserModal,
		SelectUserModal,
		UserModal
	},
	data() {
		return {
			formParam: {},
			searchLabelCol: 7,
			searchWrapperCol: 17,
			model: {
				deptId: null,
				userName: ''
			},
			pagination: {
				total: 0,
				current: 1,
				pageSize: 10
			},
			selectionKeys: [],
			tableParams: {
				loading: false,
				dataSource: [],
				scroll: {x: 650, y: 'calc(100vh - 430px)'},
				columns: [
					{
						title: this.$t('username'), // 用户账号
						dataIndex: 'username',
						i18n: 'username',
						align: 'center',
						width: 140,
						ellipsis: true
					},
					{
						title: this.$t('realname'), // 真实姓名
						dataIndex: 'realname',
						i18n: 'realname',
						align: 'center',
						ellipsis: true
					},
					{
						title: this.$t('sex'), // 性别,
						dataIndex: 'sex',
						i18n: 'sex',
						align: 'center',
						width: 70,
						customRender: (sex) => <a-tag color="blue">{sex === 1 ? '男' : '女'}</a-tag>
					},
					{
						title: this.$t('phone'), // 电话
						dataIndex: 'phone',
						i18n: 'phone',
						width: 140,
						align: 'center',
						ellipsis: true
					},
					{
						title: this.$t('operation'), // 操作
						i18n: 'operation',
						scopedSlots: {customRender: 'action'},
						fixed: 'right',
						width: 180,
						align: 'center',
						customRender: (text, record) => {
							const renderElement = [];
							const {id} = record;
							renderElement.push(
								<a-button
									icon="edit"
									type="primary"
									size="small"
									onClick={() => {
										this.handleEdit(record);
									}}
								>
									{this.$t('edit')}
								</a-button>
							);
							renderElement.push(
								<a-dropdown>
									<a-button icon="control" size="small">
										{this.$t('more')}
									</a-button>
									<a-menu slot="overlay">
										<a-menu-item onClick={() => this.handleDeptRole(record)}>
											<a-icon type="idcard" />
											<span>分配部门角色</span>
										</a-menu-item>
										<a-menu-item onClick={() => this.handleDetail(record)}>
											<a-icon type="solution" />
											<span>用户详情</span>
										</a-menu-item>
										<a-menu-item>
											<a-popconfirm
												title="确定取消与选中部门关联吗?"
												okText={this.$t('ok')}
												cancelText={this.$t('cancel')}
												onConfirm={() => this.handleDelete(id)}
											>
												<a-icon type="delete" />
												<span>取消关联</span>
											</a-popconfirm>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							);
							return <a-space>{renderElement}</a-space>;
						}
					}
				]
			}
		};
	},
	methods: {
		searchQuery() {
			let {current, pageSize} = this.pagination;
			this.loadData(current, pageSize, this.model);
		},
		searchReset() {
			// 重置
			this.model.userName = '';
			this.searchQuery();
		},
		loadData(current = 1, size = 10, model = this.model) {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
				return;
			}
			this.tableParams.loading = true;
			userDeptApi.deptUserList({current, size, model}).then((res) => {
				console.log(res);
				const {
					data: {records, total}
				} = res;
				if (res.isSuccess && res.data) {
					this.tableParams.dataSource = records;
					this.pagination.total = total;
					this.pagination.current = current;
					this.pagination.pageSize = size;
					this.tableParams.loading = false;
				}
			});
		},
		open(record) {
			this.model.deptId = record.id;
			this.searchQuery();
		},
		handleDetail(record) {
			this.$refs.modalForm.edit(record);
			this.$refs.modalForm.title = '详情';
			this.$refs.modalForm.disableSubmit = true;
		},
		batchDel() {
			if (!this.model.deptId) {
				this.$message.error('未选中任何部门，无法取消部门与用户的关联!');
				return;
			}
			if (this.selectionKeys.length <= 0) {
				this.$message.warning('请选择一条记录！');
				return;
			} else {
				let ids = '';
				for (let a = 0; a < this.selectionKeys.length; a++) {
					ids += this.selectionKeys[a] + ',';
				}
				const that = this;
				this.$confirm({
					title: '确认取消',
					content: '是否取消用户与选中部门的关联?',
					onOk: function () {
						userDeptApi.deleteDeptUser({deptId: that.model.deptId, userIds: ids}).then((res) => {
							if (res.isSuccess) {
								that.$message.success('删除用户与选中部门关系成功！');
								that.searchQuery();
							} else {
								that.$message.warning(res.msg);
							}
						});
					}
				});
			}
		},
		handleDelete(id) {
			if (!this.model.deptId) {
				this.$message.error('未选中任何部门，无法取消部门与用户的关联!');
				return;
			}
			userDeptApi.deleteDeptUser({deptId: this.model.deptId, userIds: id}).then((res) => {
				if (res.isSuccess) {
					this.$message.success('删除用户与选中部门关系成功！');
					this.searchQuery();
				} else {
					this.$message.warning(res.msg);
				}
			});
		},
		handleAddUserDepart() {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
			} else {
				this.$refs.selectUserModal.visible = true;
				this.$refs.selectUserModal.onClearSelected();
			}
		},
		handleEdit: function (record) {
			this.$refs.modalForm.title = '编辑';
			this.$refs.modalForm.departDisabled = true;
			this.$refs.modalForm.disableSubmit = false;
			this.$refs.modalForm.edit(record);
		},
		handleAdd() {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
			} else {
				this.$refs.modalForm.departDisabled = true;
				this.$refs.modalForm.userDepartModel.departIdList = [this.model.deptId]; //传入一个部门id
				this.$refs.modalForm.add();
				this.$refs.modalForm.title = '新增';
			}
		},
		selectOK(data) {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
				return;
			}
			let params = {};
			params.deptId = this.model.deptId;
			params.userIdList = [];
			for (var a = 0; a < data.length; a++) {
				params.userIdList.push(data[a]);
			}
			console.log(params);
			userDeptApi.addDeptUser(params).then((res) => {
				if (res.isSuccess) {
					this.$message.success(res.msg);
					this.searchQuery();
				} else {
					this.$message.warning(res.msg);
				}
			});
		},
		handleDeptRole(record) {
			if (!this.model.deptId) {
				this.$message.warning('请先选择一个部门!');
			} else {
				this.$refs.deptRoleUser.add(record, this.model.deptId);
				this.$refs.deptRoleUser.title = '部门角色分配';
			}
		}
	}
};
</script>
<style lang="less" scoped>
.dept-user {
	/deep/ .ant-card-body {
		padding: 10px 0 !important;
	}
	.search-bar {
		.ant-form-item {
			// width: calc(25% - 16px);
		}
	}
}
</style>
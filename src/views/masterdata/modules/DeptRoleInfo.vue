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
				<a-form-model-item class="form-item" :label="$t('roleName')" prop="roleName">
					<a-input v-model="model.roleName" :placeholder="$t('roleName')" allowClear></a-input>
				</a-form-model-item>
				<a-form-model-item class="form-item">
					<a-button type="primary" icon="search" @click="searchQuery">{{ $t('search') }}</a-button>
				</a-form-model-item>
			</a-form-model>
			<div class="search-approval-wrapper" style="margin-bottom: 10px">
				<a-space>
					<a-button @click="handleAdd" type="primary" icon="plus">新建部门角色</a-button>
					<a-button @click="searchReset" icon="reload">重置</a-button>
					<a-dropdown v-if="selectionKeys.length > 0">
						<a-menu slot="overlay">
							<a-menu-item key="1" @click="batchDel">
								<a-icon type="delete" />
								删除
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
		<dept-role-modal ref="modalForm" @ok="searchQuery" />
	</div>
</template>

<script>
import {langAndAuth} from '@/mixin';
import deptRoleApi from '@/api/masterdata/deptRole';
import DeptRoleModal from './DeptRoleModal';

export default {
	name: 'DeptRoleInfo',
	mixins: [langAndAuth],
	components: {
		DeptRoleModal
	},
	data() {
		return {
			formParam: {},
			searchLabelCol: 7,
			searchWrapperCol: 17,
			model: {
				deptId: null,
				roleName: ''
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
						title: this.$t('roleName'), // 角色名称
						dataIndex: 'roleName',
						i18n: 'roleName',
						align: 'center',
						width: 140,
						ellipsis: true
					},
					{
						title: this.$t('roleCode'), // 角色编码
						dataIndex: 'roleCode',
						i18n: 'roleCode',
						align: 'center',
						width: 140,
						ellipsis: true
					},
					{
						title: this.$t('description'), // 描述
						dataIndex: 'description',
						i18n: 'description',
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
								<a-popconfirm
									title="是否确认删除此项?"
									okText="确定"
									cancelText="取消"
									onConfirm={() => {
										this.handleDelete(id);
									}}
								>
									<a-button icon="delete" type="danger" size="small">
										{this.$t('delete')}
									</a-button>
								</a-popconfirm>
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
			this.model.roleName = '';
			this.searchQuery();
		},
		loadData(current = 1, size = 10, model = this.model) {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
				return;
			}
			this.tableParams.loading = true;
			deptRoleApi.page({current, size, model}).then((res) => {
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
					title: '确认删除',
					content: '是否删除选中数据?',
					onOk: function () {
						deptRoleApi.deleteDeptUser({ids: ids}).then((res) => {
							if (res.isSuccess) {
								that.$message.success(res.msg);
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
			deptRoleApi.delete({ids: id}).then((res) => {
				if (res.isSuccess) {
					this.$message.success(res.msg);
					this.searchQuery();
				} else {
					this.$message.warning(res.msg);
				}
			});
		},
		handleEdit: function (record) {
			this.$refs.modalForm.title = '编辑';
			this.$refs.modalForm.edit(record, record.departId);
		},
		handleAdd() {
			if (!this.model.deptId) {
				this.$message.error('请选择一个部门!');
			} else {
				this.$refs.modalForm.title = '新增';
				this.$refs.modalForm.add(this.model.deptId);
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
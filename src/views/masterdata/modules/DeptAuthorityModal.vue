<template>
	<a-card class="deptAuthority" :bordered="false">
		<template v-if="this.deptId">
			<a-spin :spinning="loading">
				<a-form class="tree">
					<a-form-item label="当前部门的权限">
						<a-tree
							checkable
							@check="onCheck"
							:checkedKeys="checkedKeys"
							:treeData="treeData"
							@expand="onExpand"
							@select="onTreeNodeSelect"
							:selectedKeys="selectedKeys"
							:expandedKeys="expandedKeys"
						>
							<span slot="hasDatarule" slot-scope="{slotTitle, ruleFlag}">
								{{ slotTitle }}
								<a-icon v-if="ruleFlag" type="align-left" style="margin-left: 5px; color: red"></a-icon>
							</span>
						</a-tree>
					</a-form-item>
				</a-form>
			</a-spin>
			<div class="drawer-bootom-button">
				<a-dropdown :trigger="['click']" placement="topCenter" style="margin-right: 10px">
					<a-menu slot="overlay">
						<a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
						<a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
						<a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
						<a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
					</a-menu>
					<a-button> 操作 <a-icon type="down" /> </a-button>
				</a-dropdown>
				<a-button @click="handleSubmit" type="primary" htmlType="button" icon="form">保存</a-button>
			</div>
		</template>
		<a-card v-else>
			<a-empty>
				<span slot="description"> 请先选择一个部门! </span>
			</a-empty>
		</a-card>
		<dept-authority-datarule-modal ref="deptAuthorityDatarule" />
	</a-card>
</template>

<script>
import menuApi from '@/api/masterdata/menu';
import deptApi from '@/api/masterdata/dept';
import DeptAuthorityDataruleModal from './DeptAuthorityDataruleModal';

export default {
	name: 'DeptAuthorityModal',
	components: {DeptAuthorityDataruleModal},
	data() {
		return {
			deptId: '',
			treeData: [],
			defaultCheckedKeys: [], // 操作前默认的返回权限
			checkedKeys: [], // 选中的
			expandedKeys: [],
			allTreeKeys: [],
			autoExpandParent: true,
			title: '部门权限配置',
			visible: false,
			loading: false,
			selectedKeys: []
		};
	},
	methods: {
		onTreeNodeSelect(id) {
			if (id && id.length > 0) {
				this.selectedKeys = id;
			}
			this.$refs.deptAuthorityDatarule.show(this.selectedKeys[0], this.deptId);
		},
		onCheck(checkedKeys) {
			this.checkedKeys = checkedKeys;
		},
		show(deptId) {
			this.deptId = deptId;
			this.loadData();
		},
		close() {
			this.reset();
			this.$emit('close');
			this.visible = false;
		},
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys;
			this.autoExpandParent = false;
		},
		reset() {
			this.expandedKeys = [];
			this.checkedKeys = [];
			this.defaultCheckedKeys = [];
			this.loading = false;
		},
		expandAll() {
			this.expandedKeys = this.allTreeKeys;
		},
		closeAll() {
			this.expandedKeys = [];
		},
		checkALL() {
			this.checkedKeys = this.allTreeKeys;
		},
		cancelCheckALL() {
			this.checkedKeys = [];
		},
		handleCancel() {
			this.close();
		},
		handleSubmit() {
			if (!this.deptId) {
				this.$message.warning('请点击选择一个部门!');
			}
			let params = {
				deptId: this.deptId, // 部门id
				authorityIds: [...this.checkedKeys].join(','), // 存储本次操作选择的权限id。
				lastAuthorityIds: [...this.defaultCheckedKeys].join(',') // 表示在本次操作之前，该单位已经拥有的权限
			};
			this.loading = true;
			deptApi.saveDeptAuthority(params).then((res) => {
				if (res.isSuccess) {
					this.$message.success(res.msg);
					this.loading = false;
					this.loadData();
				} else {
					this.$message.error(res.msg);
					this.loading = false;
				}
			});
		},
		convertTreeListToKeyLeafArr(treeList, keyLeafArr = []) {
			// 把树形结构转换为全部节点数组 [{title: '', key: xxx,isChild: false || true}, {}....]
			for (const {title, key, isChild, children} of treeList) {
				keyLeafArr.push({title, key, isChild});
				if (children && children.length > 0) {
					this.convertTreeListToKeyLeafArr(children, keyLeafArr);
				}
			}
			return keyLeafArr;
		},
		clearForm() {
			this.form.resetFields();
		},
		loadData() {
			this.loading = true;
			menuApi.queryMenuTreeList().then((res) => {
				if (res.isSuccess) {
					console.log('queryMenuTreeList', res);
					this.treeData = res.data.treeList;
					this.allTreeKeys = res.data.ids;
					const keyLeafArr = this.convertTreeListToKeyLeafArr(this.treeData);
					deptApi.queryDeptAuthority({deptId: this.deptId}).then((res) => {
						const { data, msg, isSuccess } = res
						if (isSuccess) {
							// 过滤一边返回的权限，是否还存在在当前tree-node中，防止万一目录节点已被删除
							const checkedKeys = [...data].filter((key) => {
								return keyLeafArr.find((item) => item.key === key)
							});
							this.checkedKeys = [...checkedKeys];
							this.defaultCheckedKeys = [...data];
							console.log(this.checkedKeys, this.defaultCheckedKeys)
							this.loading = false;
						} else {
							this.$message.error(msg);
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.deptAuthority {
	/deep/ .ant-card-body {
		padding-top: 0 !important;
		.tree {
			height: calc(100vh - 250px);
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
	}
}
</style>
<template>
	<common-select-component :width="1000" v-bind="configs" v-on="$listeners" :itemId="itemId" />
</template>

<script>
import CommonSelectComponent from './CommonSelectComponent';
import userDeptApi from '@/api/masterdata/userDept';
export default {
	name: 'DeptUserSelect',
	components: {CommonSelectComponent},
	props: ['value', 'currentDeptId', 'itemId'],
	data() {
		return {
			settings: {
				name: '部门用户',
				displayKey: 'realname',
				returnKeys: ['id'],
				basePort: 'admin',
				listUrl: '/v1/masterdata/userdept/queryDeptUserList',
				valueUrl: '/v1/masterdata/user/queryPageList',
				queryParamCode: 'name',
				queryParamText: '用户名称',
				queryParam: {},
				columns: [
					{title: '用户名称', dataIndex: 'username', align: 'center', width: '33.3%', widthRight: '70%'},
					{title: '用户真实姓名', dataIndex: 'realname', align: 'center', width: '33.3%', widthRight: '70%'},
					{title: '用户邮箱', dataIndex: 'email', align: 'center', width: '33.3%', widthRight: '70%'}
				]
			}
		};
	},
	computed: {
		configs() {
			this.settings.queryParam.deptId = this.currentDeptId;
			return Object.assign({value: this.value}, this.settings, this.$attrs);
		}
	}
};
</script>

<style lang="less" scoped></style>
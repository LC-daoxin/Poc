<!--
 * @Author: your name
 * @Date: 2021-11-11 16:25:14
 * @LastEditTime: 2021-11-12 16:44:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \platform-admin-ui\src\mixin\processCenter.vue
-->
<template></template>

<script>
  import {mapActions} from 'vuex';
  export default {
  	data() {
  		return {};
  	},
  	methods: {
  		...mapActions('menu', ['setAuthMenu']),
  		async handleDelete(id) {
  			let ids;
  			if (this.selectionKeys.length > 0) {
  				ids = this.selectionKeys.join(',');
  			} else {
  				ids = id;
  			}
  			const res = await api.delete({ids});
  			const {code, msg} = res;
  			if (code === '0001') {
  				this.refresh();
  				this.$message.success('操作成功');
  			} else {
  				this.$message.error(msg);
  			}
  		},
  		refresh(refresh = true) {
  			this.model = {};
  			if (refresh) {
  				this.processPage(1, 10, this.model).then(() => {
  					this.setAuthMenu();
  				});
  			}
  		},
  		processPage(current = 1, size = 10, model = this.model) {
  			return new Promise((resolve, reject) => {
  				this.tableParams.loading = true;
  				this.api
  					.page({current, size, model})
  					.then((res) => {
  						const {
  							data: {records, total}
  						} = res;
  						console.log('processPage', res);
  						this.tableParams.dataSource = records;
  						this.pagination.total = total;
  						this.pagination.current = current;
  						this.pagination.pageSize = size;
  						this.tableParams.loading = false;
  						resolve();
  					})
  					.catch((err) => {
  						console.log(err);
  						reject();
  					});
  			});
  		},
  		search() {
  			// 搜索
  			this.pagination.current = 1;
  			this.processPage(this.pagination.current, this.pagination.pageSize, this.model);
  		}
  	},
  	created() {
  		this.refresh();
  	}
  };
</script>

<style lang="less" scoped>
.form-item {
	width: 25%;
	margin-right: 0;
}
</style>


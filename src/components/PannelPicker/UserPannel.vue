<template>
	<a-modal
		title="选择用户"
		okText="确认"
		cancelText="取消"
		:width="600"
		:visible="visible"
		@ok="submit"
		@cancel="cancel"
	>
		<a-form-model
			layout="inline"
			:model="postData.model"
			:destroyOnClose="true"
			:label-col="labelCol"
			:wrapper-col="wrapperCol"
			style="margin-bottom: 20px"
		>
			<a-form-model-item label="用户名称">
				<a-input v-model="postData.model.name"></a-input>
			</a-form-model-item>
		</a-form-model>
		<a-table
			bordered
			size="small"
			:columns="columns"
			:data-source="dataSource"
			:row-selection="rowSelection"
			:rowKey="(record) => record.id"
			:pagination="false"
		></a-table>
		<a-pagination
			show-size-changer
			:page-size-options="pageSizeOptions"
			size="small"
			style="margin-top: 10px"
			:total="total"
			:page-size="postData.size"
			:show-total="(total, range) => `共 ${total} 项`"
			@showSizeChange="showPageChange"
			@change="pageChange"
		>
			<template slot="buildOptionText" slot-scope="props">
				<span v-if="props.value !== total">{{ props.value }}条/页</span>
				<span v-if="props.value === total">全部</span>
			</template>
		</a-pagination>
	</a-modal>
</template>

<script>
import api from '@/api/masterdata/user';
import mixin from './mixin.vue';

export default {
	mixins: [mixin],
	data() {
		return {
			// 列表参数
			dataSource: [],
			columns: [
				{
					title: '用户名',
					dataIndex: 'username',
					sorter: true,
				},
				{
					title: '真实姓名',
					dataIndex: 'realname',
				},
				{
					title: '电子邮件',
					dataIndex: 'email',
				},
				{
					title: '负责部门',
					dataIndex: 'responsibleDepartIds',
				},
			],
		};
	},
	methods: {
		async getSourceData() {
      this.htmlCol()
      const res = await api.page(this.postData);
      const {code, msg, data} = res;
      if (code === '0001') {
        this.total = data.total
        this.dataSource = data.records;
      } else {
        this.$message.error(msg);
      }
		},
	},
};
</script>

<template>
  <div>
    <a-form-model
      layout="inline"
      :model="postData.model"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      style="margin-bottom: 20px"
    >
      <a-form-model-item label="">
        <a-input-group
          class="search"
          compact
        >
          <a-select
            class="search_select"
            v-model="searchValue"
            @change="changeOption"
          >
            <a-select-option
              v-for="option in searchOption"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</a-select-option>
          </a-select>
          <a-input
            class="search_input"
            v-model="postData.model[searchValue]"
            allowClear
            @pressEnter="getSourceData"
          />
          <a-button
            class="search_btn"
            type="primary"
            @click="getSourceData"
          >搜索</a-button>
        </a-input-group>
      </a-form-model-item>
    </a-form-model>
    <a-table
      bordered
      :loading="loading"
      size="small"
      :columns="columns"
      :scroll="{ x: 'calc(100%)', y: 320 }"
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
      <template
        slot="buildOptionText"
        slot-scope="props"
      >
        <span v-if="props.value !== total">{{ props.value }}条/页</span>
        <span v-if="props.value === total">全部</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
  import api from '@/api/masterdata/role';
  import mixin from '../mixin.vue';
  import {dateFormat} from '@/utils/util.js';

  export default {
  	mixins: [mixin],
  	data() {
  		return {
  			columns: [
  				{
  					title: '角色名称',
  					dataIndex: 'name',
  					align: 'center',
  					ellipsis: true
  				},
  				{
  					title: '状态',
  					dataIndex: 'status',
  					align: 'center',
  					width: 120,
  					customRender: (status) => (
  						<a-tag color={status === 1 ? 'green' : 'orange'}>{status === 1 ? '启用' : '禁用'}</a-tag>
  					)
  				},
  				{
  					title: '创建时间',
  					dataIndex: 'createTime',
  					align: 'center',
  					width: 200,
  					ellipsis: true
  					// sorter: true,
  					// customRender: (text) => {
  					// 	return dateFormat('YYYY-mm-dd HH:MM:SS', text);
  					// },
  				}
  			],
  			searchOption: [
  				{
  					label: '角色名称',
  					value: 'name'
  				}
  			],
  			searchValue: 'name'
  		};
  	},
  	methods: {
  		async getSourceData() {
  			this.htmlCol();
  			this.loading = true;
  			const res = await api.page(this.postData);
  			const {code, msg, data} = res;
  			console.log(res);
  			if (code === '0001') {
  				this.total = data.total;
  				this.dataSource = data.records;
  			} else {
  				this.$message.error(msg);
  			}
  			this.loading = false;
  		}
  	}
  };
</script>

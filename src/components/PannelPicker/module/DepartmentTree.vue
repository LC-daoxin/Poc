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
          >
            <a-select-option
              v-for="option in searchOption"
              :key="option.value"
              :value="option.value"
            >{{
							option.label
						}}</a-select-option>
          </a-select>
          <a-input
            class="search_input"
            v-model="postData.model[searchValue]"
            allowClear
            @pressEnter="search"
          />
          <a-button
            class="search_btn"
            type="primary"
            @click="search"
          >搜索</a-button>
        </a-input-group>
      </a-form-model-item>
    </a-form-model>
    <public-table
      :pagination="pagination"
      :params="tableParams"
      :rowSelection="true"
      :events="events"
      @pageChange="getSourceData"
      @selectionChange="rowSelection.onChange"
    >
      <span slot="customTitle">
        <a-icon type="smile-o" /> Name
      </span>
    </public-table>
  </div>
</template>

<script>
  import api from '@/api/masterdata/dept';
  import mixin from '../mixin.vue';
  import PublicTable from '@/components/PublicTable';

  export default {
  	mixins: [mixin],
  	components: {PublicTable},
  	data() {
  		return {
  			searchOption: [
  				{
  					label: '部门名称',
  					value: 'departName'
  				},
  				{
  					label: '机构编码',
  					value: 'orgCode'
  				}
  			],
  			searchValue: 'departName',
  			selectionKeys: [],
  			pagination: {
  				total: 0,
  				current: 1,
  				pageSize: 10
  			},
  			events: {
  				expandedRowsChange: this.expandedRowsChange,
  				expand: this.expand
  			},
  			tableParams: {
  				loading: false,
  				dataSource: [],
  				scroll: {x: 700, y: 320},
  				indentSize: 30,
  				expandedRowKeys: [],
  				columns: [
  					{
  						title: this.$t('department'), // 部门名称,
  						dataIndex: 'departName',
  						i18n: 'departName',
  						align: 'left',
  						ellipsis: true
  					},
  					{
  						title: '机构编码',
  						dataIndex: 'orgCode',
  						i18n: 'orgCode',
  						width: 100,
  						align: 'center',
  						ellipsis: true
  					},
  					{
  						title: '创建时间',
  						dataIndex: 'createTime',
  						i18n: 'createTime',
  						align: 'center',
  						width: 170,
  						ellipsis: true
  					}
  				]
  			}
  		};
  	},
  	methods: {
  		async getSourceData() {
  			this.htmlCol();
  			this.tableParams.loading = true;
  			this.tableParams.expandedRowKeys = [];
  			this._queryDeptParentList(0).then((list) => {
  				this.tableParams.dataSource = list;
  				this.pagination.total = list.length;
  				this.tableParams.loading = false;
  			});
  		},
  		async search() {
  			if (this.postData.model[this.searchValue]) {
  				this.tableParams.loading = true;
  				const res = await api.page(this.postData);
  				const {code, msg, data} = res;
  				if (code === '0001') {
  					this.tableParams.total = data.total;
  					this.tableParams.dataSource = data.records;
  				} else {
  					this.$message.error(msg);
  				}
  				this.tableParams.loading = false;
  			} else {
  				this.getSourceData();
  			}
  		},
  		_queryDeptParentList(parentId = 0) {
  			return new Promise((resolve, reject) => {
  				api.queryDeptParentList({parentId}).then((res) => {
  					const {code, msg, data} = res;
  					if (code === '0001') {
  						console.log('loadTree', data);
  						if (data.length > 0) {
  							let list = data.map((item) => {
  								if (item.isLeaf) {
  									delete item.children;
  								}
  								return item;
  							});
  							resolve(list)
  						} else {
  							reject([])
  						}
  					} else {
							reject([])
  						this.$message.error(msg);
  					}
  				});
  			});
  		},
  		expand(expanded, record) {
  			if (expanded) {
  				this._queryDeptParentList(record.id).then((list) => {
  					record.children = list;
  				});
  			}
  		},
  		expandedRowsChange(expandedRowKeys) {
  			this.tableParams.expandedRowKeys = expandedRowKeys;
  		},
  		selectionChange(keys, rows) {
  			this.selectionKeys = keys;
  		}
  	}
  };
</script>
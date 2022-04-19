<template></template>

<script>
  import {mapState, mapGetters} from 'vuex';
  import {TableTemplate} from '@/components';
  import {checkMenuFuncPermission} from '@/utils/permissions';
  import PublicTable from '@/components/PublicTable';
	import engineconfigApi from '@/api/enginehistory/engineconfig.js'

  export default {
  	data() {
  		return {
				engineconfigApi,
  			searchLabelCol: 7,
  			searchWrapperCol: 17,
				selectionRows: [],
  			status: [
  				{
  					value: 1,
  					label: '流转中'
  				},
  				{
  					value: 2,
  					label: '退回待发起'
  				},
  				{
  					value: 3,
  					label: '已完成'
  				},
  				{
  					value: 4,
  					label: '已关闭'
  				},
  				{
  					value: 5,
  					label: '作废'
  				},
  				{
  					value: 6,
  					label: '错误'
  				},
  			]
  		};
  	},
  	computed: {
  		// ...mapState('setting', ['lang']),
  		// ...mapGetters('langs', ['langs']),
			lang: (state) => state.app.lang,
  	},
  	methods: {
  		checkMenuFuncPermission,
  		setColumns(lang) {
  			if (this.tableParams) {
  				if (this.columnsLang) {
  					for (let key in this.columnsLang) {
  						this.tableParams.columns[key].title = this.columnsLang[key][lang];
  					}
  				} else {
  					this.tableParams.columns.forEach((item) => {
  						item.i18n ? (item.title = this.$t(item.i18n)) : '';
  					});
  				}
  			} else {
  				for (let key in this.columnsLang) {
  					this.columns[key].title = this.columnsLang[key][lang];
  				}
  			}
  		},
  		flowStatus(status) {
  			const s = {
  				1: '流转中',
  				2: '退回待发起',
  				3: '已完成',
  				4: '已关闭',
  				5: '作废',
  				6: '错误'
  			};
  			return s[status];
  		},
			setStatusColor(status) {
  			const c = {
  				1: 'blue',
  				2: 'blue',
  				3: 'green',
  				4: 'red',
  				5: 'purple',
  				6: 'orange'
  			};
  			return c[status];
  		},
  		setMultiLangs() {
  			// this.$i18n.setLocaleMessage('CN', this.langs.CN);
  			// this.$i18n.setLocaleMessage('HK', this.langs.HK);
  			// this.$i18n.setLocaleMessage('US', this.langs.US);
  		},
  		selectionChange(keys, rows) {
  			this.selectionKeys = keys;
  			this.selectionRows = rows;
  		},
  		refresh() {
  			this.model = {};
  			this.fetch(1, 10, this.model);
  		},
  		async fetch(current = 1, size = 10, model =this.model, order = 'ascending') {
  			this.tableParams.loading = true;
  			const res = await this.api.page({current, size, model});
  			const {
  				data: {records, total}
  			} = res;
  			this.tableParams.dataSource = records;
  			this.pagination.total = total;
  			this.pagination.current = current;
  			this.pagination.pageSize = size;
  			this.tableParams.loading = false;
  		},
  		setCol(lang) {
  			if (lang === 'US') {
  				this.setLongCol?.();
  			}
  			if (lang === 'HK') {
  				this.setShortCol?.();
  			}
  			if (lang === 'CN') {
  				this.setShortCol?.();
  			}
  		}
  	},
  	watch: {
  		lang(val) {
  			this.setColumns(val);
  			this.setCol(val);
  		}
  	},
  	created() {
  		this.setMultiLangs();
  		this.setCol(this.lang);
  	},
  	mounted() {
  		this.setColumns(this.lang);
  	},
  	components: {
  		PublicTable,
  		TableTemplate
  	}
  };
</script>

<style lang="less">
.ant-form {
	margin-bottom: 10px;
}
.processCenter {
	.ant-form-item {
		width: calc(25% - 16px);
	}
}
.public-table {
	.ant-tag {
		margin-right: 0;
	}
}
</style>

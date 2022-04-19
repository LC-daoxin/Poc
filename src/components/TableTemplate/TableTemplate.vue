<script>
  import {mapGetters} from 'vuex';
  import {STable} from '../index';
  import SearchBar from './SearchBar';
  import ApprovalModal from './approvalModal';
  import {fileExport} from '@/utils/util';
  import documentApi from '@/api/documentCenter/documentManage';

  export default {
  	name: 'TableTemplate',
  	props: {
  		api: Object,
  		formData: {
  			type: Object,
  			default: () => {}
  		},
  		scroll: Object,
  		columns: {
  			type: Array,
  			default: () => []
  		},
  		innerColumns: {
  			type: Array,
  			default: () => []
  		},
  		selection: {
  			type: Boolean,
  			default: false
  		},
  		exportName: {
  			type: String,
  			default: '导出文件'
  		},
  		expandTable: {
  			type: Boolean,
  			default: false
  		},
  		tableCustomParams: Object,
  		tableKey: String,
  		rowSelection: Object,
  		rules: Object,
  		searchLabelCol: Number,
  		searchWrapperCol: Number,
  		modalLabelCol: Object,
  		modalWrapperCol: Object,
  		modalUrl: String,
  		modalConfig: Array,
  		initParams: Object,
  		searchConfig: Array,
  		actionConfig: Array,
  		approvalConfig: Array,
  		loadFunction: Function,
  		postType: String,
  		longForm: Boolean,
  		noCleaning: String,
  		documentName: String
  	},
  	data() {
  		return {
  			timer: null,
  			expand: false,
  			searchData: null,
  			treeData: [],
  			selectedRows: [],
  			selectedRowKeys: [],
  			tableParameter: null,
  			curParentId: ''
  		};
  	},
  	computed: {
  		...mapGetters('langs', ['langs'])
  	},
  	methods: {
  		loadData(parameter) {
  			let postData = JSON.parse(JSON.stringify(parameter));

  			if (this.loadFunction) {
  				return this.loadFunction(postData);
  			} else {
  				this.tableParameter = parameter;
  				if (this.initParams) {
  					Object.assign(postData.model, this.initParams);
  				}
  				if (this.searchData) {
  					Object.assign(postData.model, this.searchData);
  				}
  				if (this.formData) {
  					Object.assign(postData.model, this.formData);
  				}
  				if (this.postType && this.postType === 'form') {
  					let postForm = '';
  					for (let key in this.formData) {
  						postForm += `${key}=${this.formData[key]}&`;
  					}
  					postForm += `start=${(parameter.current - 1) * parameter.size}&length=${parameter.size}`;
  					postData = postForm;
  				}
  				if (this.api) {
  					return this.api.page(postData).then((res) => {
  						if (this.tableCustomParams) {
  							const {
  								tableCustomParams: {total, records}
  							} = this;
  							return {
  								current: postData.current,
  								size: postData.size,
  								total: res[total],
  								data: {
  									records: res[records]
  								}
  							};
  						} else {
  							let {
  								code,
  								data: {records, total}
  							} = res;
  							if (code === '0001') {
  								// const {records, total} = data;
  								this.treeData = records;
  								!total && (total = records.length);
  								return res;
  							} else {
  								return [];
  							}
  						}
  					});
  				} else {
  					return [];
  				}
  			}
  		},
  		openModal() {
  			if (this.modalUrl) {
  				this.$router.push(this.modalUrl);
  				return;
  			}
  			this.$refs.modal.open();
  		},
  		approvalEvent(item, data) {
  			let scope = {};
  			Object.assign(scope, data);
  			console.log(scope.status);
  			if (scope.parentId) {
  				console.log(scope.parentId);
  				this.curParentId = scope.parentId;
  			}
  			if (scope.status != undefined) {
  				// alert(1)
  				scope.status === 0 ? (scope.status = false) : (scope.status = true);
  			}
  			if (item.event) {
  				item.event(scope);
  				return;
  			}
  			if (item.approval) {
  				item.approval(scope);
  				return;
  			}
  			if (item.label === '查看') {
  				console.log(11);
  				this.$refs.modal.detail(scope);
  				return;
  			}
  			if (item.label === '复制') {
  				this.$refs.modal.copy(scope);
  				return;
  			}
  			if (item.label === '修改') {
  				this.$refs.modal.edit(scope);
  				return;
  			}
  			if (item.label === '删除') {
  				this.handleDelete(scope.id);
  			}
  		},
  		onSelectChange(selectedRowKeys, selectedRows) {
  			this.selectedRowKeys = selectedRowKeys;
  			this.selectedRows = selectedRows;
  			this.$emit('tableSelect', selectedRowKeys, selectedRows);
  		},
  		handleSearch(values) {
  			this.searchData = values;
  			this.refresh();
  		},
  		async handleDelete(id) {
  			let ids = id;
  			if (!id) {
  				ids = this.selectedRowKeys.join(',');
  			}
  			const postData = {ids};
  			if (this.postType && this.postType === 'form') {
  				postData['id'] = ids;
  			}
  			const res = await this.api.delete(postData);
  			if (res.code === '0001') {
  				this.$message.success('删除成功');
  				if (!id) this.selectedRowKeys = [];
  				this.refresh();
  			} else {
  				this.$message.warning(res.msg);
  			}
  		},
  		async handleExport(data) {
  			const postData = {...this.tableParameter, map: {}, model: data};
  			const res = await this.api.export(postData);
  			fileExport(res);
  		},
  		async handleImport({file}) {
  			let param = new FormData();
  			param.append('file', file, file.name);

  			const res = await this.api.import(param);
  			if (res.code === '0001') {
  				this.$message.success('导入成功');
  			} else {
  				this.$message.warning(res.msg);
  				return [];
  			}
  		},
  		async downloadImportFile() {
  			const res = await documentApi.downloadImportFile(this.documentName);
  			fileExport(res, this.documentName);
  		},
  		refresh() {
  			if (this.curParentId && this.$refs[this.curParentId]) {
  				this.$refs[this.curParentId].refresh(true);
  				this.curParentId = '';
  				return;
  			}
  			this.$refs.table.refresh(true);
  		},
  		setTimer(varible) {
  			this.timer = setTimeout(() => {
  				this[varible] = false;
  				clearTimeout(this.timer);
  			}, 1500);
  		},
  		renderSearchBar() {
  			if (this.searchConfig) {
  				return (
  					<search-bar
  						{...{
  							props: {
  								langs: this.langs,
  								model: this.formData,
  								config: this.searchConfig,
  								noCleaning: this.noCleaning,
  								labelCol: this.searchLabelCol,
  								wrapperCol: this.searchWrapperCol,
  								actionConfig: this.actionConfig,
  								selectedKeys: this.selectedRowKeys
  							},
  							on: {
  								search: this.handleSearch,
  								export: this.handleExport,
  								download: this.downloadImportFile,
  								import: this.handleImport,
  								modal: this.openModal,
  								refresh: this.refresh,
  								reset: this.selectedClear,
  								delete: this.handleDelete
  							}
  						}}
  					>
  						<template slot="approval-before">{this.$slots['approval-before']}</template>
  						<template slot="approval-before">{this.$slots['approval-after']}</template>
  						<template slot="approval-before">{this.$slots['search-before']}</template>
  						<template slot="approval-before">{this.$slots['search-after']}</template>
  					</search-bar>
  				);
  			}
  			return '';
  		},
  		renderAction(createElement, props) {
  			return createElement(
  				'a-space',
  				(() => {
  					const actions = [];

  					for (let item of this.approvalConfig) {
  						if (item.auth) {
  							const newProps = {};
  							let label = item.label || '';

  							if (this.langs && item.i18n) {
  								label = this.$t(item.i18n);
  							}
  							if (item.disabled) {
  								newProps['disabled'] = props[item.disabled[0]] === item.disabled[1];
  							}
  							if (item.params) {
  								Object.assign(newProps, item.params);
  							}
  							if (item.confirm) {
  								actions.push(
  									createElement(
  										'a-popconfirm',
  										{
  											props: {
  												...item.confirm.params
  											},
  											on: {
  												confirm: () => this.approvalEvent(item, props)
  											}
  										},
  										[
  											createElement('a-icon', {
  												slot: 'icon',
  												props: {
  													type: 'question-circle-o'
  												},
  												style: {
  													color: 'red'
  												}
  											}),
  											createElement('a-button', {props: {...item.params}}, label)
  										]
  									)
  								);
  							} else {
  								item.tag = item.tag || 'a-button';

  								if (item.child) {
  									actions.push(
  										<item.tag
  											{...{props: newProps}}
  											{...{on: {click: () => this.approvalEvent(item, props)}}}
  											class={item.class}
  										>
  											{this.renderActionChild(item.child, props)}
  										</item.tag>
  									);
  								} else {
  									actions.push(
  										<item.tag
  											{...{props: newProps}}
  											{...{on: {click: () => this.approvalEvent(item, props)}}}
  											class={item.class}
  										>
  											{label}
  										</item.tag>
  									);
  								}
  							}
  						}
  					}
  					return actions;
  				})()
  			);
  		},
  		renderActionChild(data, props) {
  			const children = [];
  			for (let item of data) {
  				children.push(
  					<item.tag
  						{...{props: item.params}}
  						{...{on: {click: () => this.approvalEvent(item, props)}}}
  						{...{slot: item.slot}}
  					>
  						{item.label}
  						{item.child ? this.renderActionChild(item.child, props) : ''}
  					</item.tag>
  				);
  			}
  			return children;
  		},
  		renderTable(createElement) {
  			const alert = this.selection ? {show: true, clear: true} : null;
  			let rowSelection = null;
  			if (this.selection) {
  				rowSelection = {
  					selectedRowKeys: this.selectedRowKeys,
  					onChange: this.onSelectChange
  				};
  			}
  			if (this.rowSelection) {
  				rowSelection = {...this.rowSelection};
  			}
  			if (this.rowSelection && !rowSelection.selectedRowKeys) {
  				rowSelection['selectedRowKeys'] = this.selectedRowKeys;
  			}
  			if (this.rowSelection && !rowSelection.onChange) {
  				rowSelection['onChange'] = this.onSelectChange;
  			}

  			return createElement('s-table', {
  				ref: 'table',
  				props: {
  					alert,
  					rowSelection,
  					size: 'small',
  					pageSize: 20,
  					scroll: this.scroll,
  					data: this.loadData,
  					columns: this.columns,
  					rowKey: (record) => record[this.tableKey] || record.id
  				},
  				scopedSlots: {
  					action: (props) => this.renderAction(createElement, props),
  					expandedRowRender: this.expandTable ? (props) => this.renderChildTable(createElement, props) : false
  				}
  			});
  		},
  		renderChildTable(createElement, props) {
  			return [
  				createElement('s-table', {
  					ref: props.id,
  					props: {
  						size: 'small',
  						bordered: false,
  						showPagination: false,
  						columns: this.innerColumns,
  						data: (parameter) => {
  							parameter.model['parentId'] = props.id;
  							return this.api.page(parameter).then((res) => {
  								const {code, msg} = res;
  								if (code === '0001') {
  									return res;
  								} else {
  									this.$message.warning(msg);
  									return [];
  								}
  							});
  						},
  						rowKey: (record) => record.id
  					},
  					scopedSlots: {
  						action: (actionProps) => this.renderAction(createElement, actionProps),
  						expandedRowRender: (row) => this.renderChildTable(createElement, row)
  					}
  				})
  			];
  		},
  		setMultiLangs() {
  			if (this.langs) {
  				this.$i18n.setLocaleMessage('CN', this.langs.CN);
  				this.$i18n.setLocaleMessage('HK', this.langs.HK);
  				this.$i18n.setLocaleMessage('US', this.langs.US);
  			}
  		},
  		selectedClear() {
  			this.selectedRowKeys = [];
  		}
  	},
  	render(createElement) {
  		return createElement(
  			'a-card',
  			{
  				props: {
  					bordered: false
  				}
  			},
  			[
  				this.renderSearchBar(),
  				this.$slots['search-bar'],
  				this.renderTable(createElement),
  				this.modalConfig &&
  					createElement('approval-modal', {
  						ref: 'modal',
  						props: {
  							api: this.api,
  							langs: this.langs,
  							rules: this.rules,
  							config: this.modalConfig,
  							treeData: this.treeData,
  							formData: this.formData,
  							labelCol: this.modalLabelCol,
  							wrapperCol: this.modalWrapperCol,
  							postType: this.postType,
  							longForm: this.longForm
  						},
  						on: {
  							refresh: this.refresh,
  							success: () => {
  								this.$emit('success');
  							}
  						}
  					})
  			]
  		);
  	},
  	created() {
  		this.setMultiLangs();
  	},
  	components: {
  		STable,
  		SearchBar,
  		ApprovalModal
  	}
  };
</script>

<style lang="less" scoped>
/deep/ .search-form {
	margin-bottom: 10px;
}
</style>

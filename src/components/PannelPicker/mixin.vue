<template></template>

<script>
  import _ from 'lodash';
  export default {
  	props: {
  		multiple: Boolean,
  		customParams: {
  			type: Object,
  			required: true
  		},
  		disabled: {
  			type: Boolean
  		}
  	},
  	data() {
  		return {
  			key: 0,
  			// 对话框参数
  			visible: false,
  			// 搜索表单参数
  			labelCol: {span: 0},
  			wrapperCol: {span: 24},
  			// 列表参数
  			dataSource: [],
  			loading: false,
  			total: 0,
  			postData: {
  				current: 1,
  				size: 10,
  				model: {}
  			},
  			pageSizeOptions: ['5', '10', '20', '50'],
  			selectedRows: [],
  			uniqSelectedRows: [], // 去重
  			rowSelection: {
  				fixed: true,
  				type: this.multiple ? 'checkbox' : 'radio',
  				selectedRowKeys: [],
  				onChange: (selectedRowKeys, selectedRows) => {
  					let newSelectedRows = [];
  					selectedRows.forEach((item) => {
  						let obj = {
  							...item,
  							type: this.customParams.type,
  							typeName: this.customParams.typeName,
  							name: item[this.customParams.name],
  							id: item[this.customParams.id]
  							// orgCode: this.customParams.type === 'department' ? item.orgCode : undefined
  						};
  						newSelectedRows.push(obj);
  					});
  					this.rowSelection.selectedRowKeys = selectedRowKeys;
  					this.selectedRows = newSelectedRows;
  					// this.uniqSelectedRows = [...this.uniqSelectedRows, ...newSelectedRows]
  					// this.uniqSelectedRows = _.uniqWith(this.uniqSelectedRows, _.isEqual); // 去重方法一  完全去重
  					// this.uniqSelectedRows =  _.uniqBy(this.uniqSelectedRows, 'id'); // 去重方法二 完全去重
  					// this.uniqSelectedRows = this.uniqSelectedRows.filter(item => {
  					//   return selectedRowKeys.includes(item.id)
  					// })
  					const all = [...this.uniqSelectedRows, ...newSelectedRows]; // 去重方法三 id去重
  					this.uniqSelectedRows = [];
  					all.reduce((arr, cur) => {
  						selectedRowKeys.includes(cur.id) &&
  							arr.indexOf(cur.id) == -1 &&
  							arr.push(cur.id) &&
  							this.uniqSelectedRows.push(cur);
  						return arr;
  					}, []);
  					console.log(
  						'onChange[selectedRowKeys, selectedRows, newSelectedRows, uniqSelectedRows]',
  						selectedRowKeys,
  						selectedRows,
  						newSelectedRows,
  						this.uniqSelectedRows
  					);
  					this.$emit('change', selectedRowKeys, this.uniqSelectedRows, this.customParams);
  				},
  				getCheckboxProps: (record) => ({
  					props: {
  						disabled: this.disabled
  					}
  				})
  			}
  		};
  	},
  	methods: {
  		htmlCol(num = 24) {
  			let wrapper = document.querySelectorAll('.pannel .ant-form-item-control-wrapper');
  			if (wrapper.length > 0) {
  				for (let i = 0; i < wrapper.length; i++) {
  					wrapper[i].classList.add(`ant-col-${num}`);
  				}
  				// wrapper.forEach((item) => {
  				// 	item.classList.add(`ant-col-${num}`);
  				// });
  			}
  		},
  		deleteSelect(obj) {
  			_.pull(this.rowSelection.selectedRowKeys, obj.id); // 移除数组中所有和给定值相等的元素
  			this.key += 1; // 刷新table
  		},
  		open() {
  			this.visible = true;
  			this.getSourceData();
  		},
  		cancel() {
  			this.visible = false;
  			this.selectedRows = [];
  			this.uniqSelectedRows = [];
  			this.rowSelection.selectedRowKeys = [];
  		},
  		submit() {
  			this.$emit('change', this.selectedRows);
  		},
  		showPageChange(current, size) {
  			this.postData.current = current;
  			this.postData.size = size;
  			this.getSourceData();
  		},
  		pageChange(page, pageSize) {
  			this.postData.current = page;
  			this.postData.size = pageSize;
  			this.getSourceData();
  		},
  		// 根据选择的项，重新赋值
  		setTable(selected) {
  			this.uniqSelectedRows = [];
  			selected.forEach((item) => {
  				if (item.type === this.customParams.type) {
  					this.rowSelection.selectedRowKeys.push(item.id);
  					// let obj = {
  					//   type: item.type,
  					//   typeName: item.typeName,
  					//   name: item.name,
  					//   id: item.id,
  					//   orgCode: item.orgCode
  					// }
  					// this.uniqSelectedRows.push(obj)
  					this.uniqSelectedRows.push(item);
  				}
  			});
  			console.log(this.customParams.type, this.rowSelection.selectedRowKeys);
  		},
  		changeOption(val) {
  			this.postData.model = {};
  		}
  	}
  };
</script>
<style lang="less" scoped>
.input_search {
	width: 260px;
}
.search {
	.search_select {
		width: 130px;
	}
	.search_input {
		width: 180px;
	}
	.search_btn {
		width: 65px;
	}
}
</style>
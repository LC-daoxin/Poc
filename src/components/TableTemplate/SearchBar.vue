<script>
export default {
	i18n: require('./i18n.js'),
	props: {
		config: Array,
		rules: Object,
		model: Object,
		selectedKeys: Array,
		actionConfig: Array,
		langs: Object,
		noCleaning: String,
		labelCol: {
			type: Number,
			default: 7,
		},
		wrapperCol: {
			type: Number,
			default: 17,
		},
	},
	data() {
		return {
			expand: false,
		};
	},
	computed: {
		count() {
			return this.expand ? this.config.length : 4;
		},
	},
	methods: {
		formItem() {
			const items = [];
			if (this.config) {
				this.config.map((item, index) => {
					const {label, key, params, event, i18n} = item;
					const child = item.child ? this.formItemChild(item.child) : '';
					const placeholder = item.placeholder || null;
					let i18nLabel = null;
					if (this.langs && this.langs.CN.i18n) {
						i18nLabel = this.$t(i18n);
					} else {
						i18nLabel = label;
					}

					const style = {};
					if (item.style) {
						Object.assign(style, item.style);
					} else {
						style.width = '25%';
					}

					items.push(
						<div class="form-item" style={style}>
							<a-form-model-item
								vShow={index < this.count}
								label={i18nLabel}
								prop={key}
							>
								<item.tag
									{...{
										on: {...event},
									}}
									{...{
										props: {...params},
									}}
									vModel={this.model[key]}
									placeholder={placeholder}
								>
									{child}
								</item.tag>
							</a-form-model-item>
						</div>
					);
				});
			}

			return items;
		},
		formItemChild(child) {
			const children = [];
			for (let item of child.options) {
				const props = {...item};
				if (!item.value && child.value) props['value'] = item[child.value];
				if (!item.label && child.label) props['label'] = item[child.label];

				children.push(
					<child.tag
						{...{
							props,
						}}
					>
						{props.label}
					</child.tag>
				);
			}

			return children;
		},
		addBtn() {
			if (this.actionConfig && this.actionConfig.includes('add')) {
				return (
					<a-button icon="plus" type="primary" onClick={this.openModal}>
						{this.$t('add')}
					</a-button>
				);
			}
			return '';
		},
		exportBtn() {
			if (this.actionConfig && this.actionConfig.includes('export')) {
				return (
					<a-button icon="export" type="primary" onClick={this.handleExport}>
						{this.$t('export')}
					</a-button>
				);
			}
			return '';
		},
		importBtn() {
			if (this.actionConfig && this.actionConfig.includes('import')) {
				return (
					<a-upload customRequest={this.handleUpload}>
						<a-button type="primary" icon="import">
							{this.$t('import')}
						</a-button>
					</a-upload>
				);
			}
			return '';
		},
    downloadBtn() {
      if (this.actionConfig && this.actionConfig.includes('download')) {
        return (
          <a-button icon="download" type="primary" onClick={this.handleDownload}>
            导入模板下载
          </a-button>
        );
      }
      return '';
    },
		deleteBtn() {
			if (
				this.actionConfig.includes('delete') &&
				this.selectedKeys.length > 0
			) {
				return (
					<a-popconfirm
						title="确定执行删除操作？"
						okText="确定"
						cancelText="取消"
						onConfirm={this.handleDelete}
					>
						<a-button type="danger" icon="delete">
							{this.$t('delete')}
						</a-button>
					</a-popconfirm>
				);
			}
			return '';
		},
		refreshBtn() {
			if (this.actionConfig && this.actionConfig.includes('refresh')) {
				return (
					<a-button type="primary" icon="redo" onClick={this.refresh}>
						{this.$t('refresh')}
					</a-button>
				);
			}
			return '';
		},
		searchBtnWrapper() {
			if (this.config && this.config.length > 0) {
				return (
					<a-space>
						{this.$slots['search-before']}
						<a-button type="primary" icon="search" onClick={this.refresh}>
							{this.$t('search')}
						</a-button>
						<a-button icon="delete" onClick={this.handleReset}>
							{this.$t('clear')}
						</a-button>
						<a vShow={this.config.length > 4} onClick={this.toggle}>
							{this.expand ? this.$t('contract') : this.$t('spreadOut')}
							<a-icon type={this.expand ? 'up' : 'down'} />
						</a>
						{this.$slots['search-after']}
					</a-space>
				);
			}
			return '';
		},
		openModal() {
			this.$emit('modal');
		},
		handleSearch(e) {
			e.preventDefault();
			this.$refs.form.validate((valid) => {
				if (!valid) {
					this.$emit('search', this.model);
				}
			});
			this.$refs.form.validateFields((error, values) => {});
		},
		handleExport() {
			this.$emit('export', this.model);
		},
		handleUpload(file) {
			this.$emit('import', file);
		},
		handleDownload(file) {
			this.$emit('download', file);
		},
		handleDelete() {
			this.$emit('delete');
		},
		refresh() {
			this.$emit('refresh');
		},
		handleReset() {
			let no = [];
			if (this.noCleaning) {
				no = this.noCleaning.split(',');
			}
			for (let key in this.model) {
				if (no.length === 0 || !no.includes(key)) this.model[key] = '';
			}
			this.$emit('reset');
			this.$emit('refresh');
		},
		toggle() {
			this.expand = !this.expand;
		},
	},
	render() {
		return (
			<a-form-model
				{...{
					props: {
						model: this.model,
						rules: this.rules,
						labelCol: {span: this.labelCol},
						wrapperCol: {span: this.wrapperCol},
					},
				}}
				class="form"
				ref="form"
			>
				<div class="form-item-wrapper">{this.formItem()}</div>
				<div class="button-wrapper">
					{this.searchBtnWrapper()}
					<a-space class="action-bar">
						{this.$slots['approval-before']}
						{this.addBtn()}
						{this.exportBtn()}
						{this.importBtn()}
						{this.downloadBtn()}
						{this.deleteBtn()}
						{this.refreshBtn()}
						{this.$slots['approval-after']}
					</a-space>
				</div>
			</a-form-model>
		);
	},
};
</script>

<style scoped>
.form {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 1em;
}

.form-item-wrapper {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}

.button-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
}
</style>

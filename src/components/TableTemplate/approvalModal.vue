<script>
import IconPicker from '@/components/IconPannel/IconPicker';
import PannelPicker from '@/components/PannelPicker';

export default {
	name: 'ApprovalModal',
	i18n: require('./i18n.js'),
	props: {
		api: Object,
		langs: Object,
		rules: Object,
		formData: Object,
		postType: String,
		longForm: Boolean,
		labelCol: {
			type: Object,
			default: () => ({
				xs: {span: 24},
				sm: {span: 6},
			}),
		},
		wrapperCol: {
			type: Object,
			default: () => ({
				xs: {span: 24},
				sm: {span: 16},
			}),
		},
		config: {
			type: Array,
			default: () => [],
		},
		treeData: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			id: '',
			actId: '',
			title: '操作',
			isEdit: false,
			visible: false,
			isDetail: false,
			confirmLoading: false,
			modelData: JSON.parse(JSON.stringify(this.formData)),
		};
	},
	methods: {
		formItem() {
			const items = [];
			for (let item of this.config) {
				const {params, key, child, i18n, extend} = item;
				let event = {};
				let itemExtend = '';
				let i18nLabel = null;
				let elementShow = {};
				let style = {};
				let children = [];
				let disabled = false;
				if (item.disabled) {
					this.modelData[item.disabled[0]] === item.disabled[1] ||
						this.isDetail;
				}
				if (child) {
					children = this.formItemChild(child);
				}
				if (item.show) {
					elementShow.display =
						this.modelData[item.show[0]] === item.show[1] ? 'block' : 'none';
				}
				if (item.style) {
					style = item.style;
				}
				if (this.langs && this.langs.CN.i18n) {
					i18nLabel = this.$t(i18n);
				} else {
					i18nLabel = item.label;
				}

				if (extend) {
					itemExtend = this.formItemExtend(extend);
				}

				if (item.event) {
					event = item.event;
				}

				if (item.tag === 'icon-picker') {
					event['clear'] = () => {
						this.modelData[key] = '';
					};
					event['select'] = (icon) => {
						this.modelData[key] = icon;
					};
				}

				if (key === 'status' && item.tag === 'a-switch') {
						event['change'] = (checked,event) => {							
							this.modelData.status = checked;
						};
				}				

				if (item.tag === 'a-divider') {
					items.push(
						<a-divider
							{...{
								props: {...params},
							}}
						>
							{item.content}
						</a-divider>
					);
				} else {
					items.push(
						<div class="form-item" class={{'long-form-item': this.longForm}}>
							<a-form-model-item
								label={i18nLabel}
								prop={key}
								style={{...elementShow, ...item.wrapperStyle}}
							>
								<item.tag
									{...{
										on: {...event},
									}}
									{...{
										props: {...params},
									}}
									style={style}
									disabled={disabled}
									vModel={this.modelData[key]}
								>
									{item.content}
									{itemExtend}
									{children}
								</item.tag>
							</a-form-model-item>
						</div>
					);
				}
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
		formItemExtend(extend) {
			const elements = [];

			for (let item of extend) {
				let style = item.style || {};

				!item.event && (item['event'] = {});

				if (item.clear) {
					item.event['change'] = (value) => {
						let changeVal = value;

						if (item.tag === 'a-checkbox') {
							changeVal = value.target.checked;
							this.modelData[item.key] = changeVal;
						}
						if (changeVal === item.clear[1] && this.modelData[item.clear[0]]) {
							this.modelData[item.clear[0]] = '';
						}
					};
				}
				if (item.tag === 'a-checkbox') {
					elements.push(
						<item.tag
							{...{
								on: item.event,
							}}
							{...{
								props: item.params,
							}}
							checked={this.modelData[item.key]}
							style={style}
						>
							{item.label || ''}
						</item.tag>
					);
				} else {
					elements.push(
						<item.tag
							{...{
								on: item.event,
							}}
							{...{
								props: item.params,
							}}
							style={style}
							v-model={this.modelData[item.key]}
						>
							{item.label || ''}
						</item.tag>
					);
				}
			}
			return elements;
		},
		actionBtns() {
			if (this.isDetail) {
				return '';
			}
			return (
				<a-space>
					<a-popconfirm
						title="确定放弃编辑？"
						okText="确定"
						cancelText="取消"
						onConfirm={this.handleCancel}
					>
						<a-button>取消</a-button>
					</a-popconfirm>
					<a-button
						type="primary"
						loading={this.confirmLoading}
						onClick={this.handleSubmit}
					>
						保存
					</a-button>
				</a-space>
			);
		},
		open() {
			this.isEdit = false;
			this.visible = true;
		},
		detail(scope) {
			this.isDetail = true;
			Object.assign(this.modelData, scope);
			this.open();
		},
		edit(scope) {
			this.id = scope.id;
			this.actId = scope.actId;
			this.isEdit = true;
			this.visible = true;
			this.$nextTick(() => {
				Object.assign(this.modelData, scope);
			});
		},
		copy(scope) {
			this.id = scope.id;
			this.actId = scope.actId;
			this.isEdit = false;
			this.visible = true;
			this.$nextTick(() => {
				Object.assign(this.modelData, scope);
			});
		},
		handleAdd() {
			this.modelData.status === true
				? (this.modelData.status = 1)
				: (this.modelData.status = 0);

			// if (this.postType && this.postType === 'form') {
			// 	let postForm = '';
			// 	for (let key in postData) {
			// 		postForm += `${key}=${postData[key]}&`;
			// 	}
			// 	postForm = postForm.substring(0, postForm.length - 1);
			// 	postData = postForm;
			// }

			this.api
				.add(this.modelData)
				.then((res) => {
					const {code, msg} = res;
					if (code === '0001' || code === 200) {
						this.$message.success('操作成功');
						this.$emit('success');
						this.handleCancel();
					} else {
						this.$message.warning(msg);
					}
					this.confirmLoading = false;
				})
				.catch((err) => {
					this.confirmLoading = false;
					this.$message.error(err);
				});
		},
		handleEdit() {
			const postData = JSON.parse(JSON.stringify(this.modelData));
			postData.id = this.id;
			postData.actId = this.actId;
			postData.status === true ? (postData.status = 1) : (postData.status = 0);

			this.api
				.update(postData)
				.then((res) => {
					const {code, msg} = res;
					if (code === '0001') {
						this.$message.success('修改成功');
						this.handleCancel();
					} else {
						this.$message.warning(msg);
					}
					this.confirmLoading = false;
				})
				.catch((err) => {
					this.confirmLoading = false;
					this.$message.error(err);
				});
		},
		handleSubmit() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.confirmLoading = true;
					if (this.isEdit) {
						this.handleEdit();
					} else {
						this.handleAdd();
					}
				}
			});
		},
		handleCancel() {
			this.isEdit = false;
			this.isDetail = false;
			this.$refs.form.resetFields();
			for (let key in this.modelData) {
				if (this.modelData[key] === true) {
					this.modelData[key] = false;
				} else if (
					key !== 'typeStatus' &&
					this.modelData[key] !== '' &&
					this.modelData[key] !== false
				) {
					this.modelData[key] = '';
				}
			}
			this.$emit('refresh');
			this.visible = false;
		},
	},
	components: {
		IconPicker,
		PannelPicker,
	},
	render() {
		return (
			<a-drawer
				{...{
					props: {
						placement: 'right',
						closable: true,
						maskClosable: true,
						title: this.title,
						visible: this.visible,
						width: this.longForm ? 900 : 400,
					},
				}}
				onClose={this.handleCancel}
				class="modal-drawer"
			>
				<a-spin spinning={this.confirmLoading} onSubmit={this.handleSubmit}>
					<a-form-model
						{...{
							props: {
								rules: this.rules,
								model: this.modelData,
								labelCol: this.labelCol,
								wrapperCol: this.wrapperCol,
							},
						}}
						ref="form"
					>
						<div class={{'long-form': this.longForm}}>{this.formItem()}</div>
					</a-form-model>
					{this.actionBtns()}
				</a-spin>
			</a-drawer>
		);
	},
};
</script>

<style lang="less" scoped>
.modal-drawer {
	height: 100%;
	overflow: auto;
	padding-bottom: 53px;

	/deep/ .ant-calendar-picker {
		width: 100%;
	}
}
.long-form {
	display: flex;
	flex-wrap: wrap;
}
.long-form-item {
	width: 50%;
}
.ant-divider-horizontal {
	margin-top: 0;
}
</style>

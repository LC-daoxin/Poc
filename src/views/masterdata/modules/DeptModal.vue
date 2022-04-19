<template>
	<a-modal title="操作" :width="700" v-model="visible" :confirmLoading="confirmLoading" @ok="handleSubmit">
		<a-form-model
			class="basicInfo"
			ref="form"
			:model="model"
			:rules="rules"
			:labelCol="labelCol"
			:wrapperCol="wrapperCol"
		>
			<a-form-model-item label="机构名称" prop="departName" hasFeedback>
				<a-input v-model="model.departName" placeholder="请输入机构/部门名称" />
			</a-form-model-item>
			<a-form-model-item label="机构编码" prop="orgCode" hasFeedback>
				<a-input v-model.trim="model.orgCode" placeholder="请输入机构编码" />
			</a-form-model-item>
			<a-form-model-item label="上级部门" :hidden="seen">
				<a-tree-select
					v-show="!allDeptLoading"
					style="width: 100%"
					:dropdownStyle="{maxHeight: '400px', overflow: 'auto'}"
					:treeData="treeDeptOptions"
					:replace-fields="deptReplaceFields"
					v-model="model.parentId"
					disabled
					placeholder="无"
				>
				</a-tree-select>
				<a-select
					v-show="allDeptLoading"
					:loading="allDeptLoading"
					:placeholder="`${$t('loading')}...`"
					disabled
				/>
			</a-form-model-item>
			<a-form-model-item label="机构类型" prop="orgCategory">
				<a-radio-group v-model="model.orgCategory" placeholder="请选择机构类型">
					<a-radio v-if="seen" value="1"> 公司 </a-radio>
					<a-radio v-if="!seen" value="2"> 部门 </a-radio>
					<a-radio v-if="!seen" value="3"> 岗位 </a-radio>
				</a-radio-group>
			</a-form-model-item>
			<a-form-model-item label="排序">
				<a-input-number v-model="model.sort" :min="0" />
			</a-form-model-item>
			<a-form-model-item label="手机号" prop="mobile">
				<a-input v-model="model.mobile" placeholder="请输入手机号" />
			</a-form-model-item>
			<a-form-item label="传真">
				<a-input v-model="model.fax" placeholder="请输入传真" />
			</a-form-item>
			<a-form-model-item label="地址">
				<a-input v-model="model.address" placeholder="请输入地址" />
			</a-form-model-item>
			<!-- <a-form-model-item label="流程对接人">
				<dept-user-select
					v-model="model.processResponsibleUserId"
					placeholder="请选择流程对接人"
					:multiple="false"
					:currentDeptId="currentDeptId"
				/>
			</a-form-model-item> -->
			<a-form-model-item label="备注">
				<a-textarea v-model="model.memo" placeholder="请输入备注" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>
<script>
import pick from 'lodash.pick';
import ATextarea from 'ant-design-vue/es/input/TextArea';
import commonApi from '@/api/common';
import deptApi from '@/api/masterdata/dept';

export default {
	name: 'DeptModal',
	props: {
		deptReplaceFields: {
			type: Object
		},
		treeDeptOptions: {
			type: Array
		},
		allDeptLoading: {
			type: Boolean
		}
	},
	components: {
		ATextarea
	},
	data() {
		return {
			visible: false,
			seen: false,
			labelCol: {
				xs: {span: 24},
				sm: {span: 5}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16}
			},
			confirmLoading: false,
			model: {
				parentId: 0,
				departName: '',
				orgCode: '',
				orgCategory: '1',
				sort: null,
				mobile: '',
				fax: '',
				address: '',
				memo: ''
			},
			rules: {
				departName: [{required: true, message: '请输入机构名称', trigger: 'blur'}],
				orgCode: [{required: true, validator: this.validateOrgCode, trigger: 'blur'}],
				orgCategory: [{required: true, message: '请选择机构类型', trigger: 'change'}],
				mobile: [{validator: this.validateMobile, trigger: 'blur'}]
			}
		};
	},
	methods: {
		add(depart) {
			console.log(depart)
			if (depart) {
				this.seen = false;
			} else {
				this.seen = true;
			}
			this.edit(depart);
		},
		edit(record) {
			this.model = Object.assign({}, {
				parentId: record?.toString() || 0,
				departName: '',
				orgCode: '',
				orgCategory: this.seen ? '1' : '2',
				sort: null,
				mobile: '',
				fax: '',
				address: '',
				memo: ''
			});
			this.visible = true;
			this.$nextTick(() => {
				this.$refs['form'].resetFields();
				// this.form.setFieldsValue(
				// 	pick(this.model, 'id', 'departName', 'sort', 'orgCategory', 'orgCode', 'mobile', 'fax', 'address', 'memo')
				// );
			});
		},
		handleSubmit(e) {
			e.preventDefault();
			this.$refs['form'].validate((valid) => {
				if (valid) {
					console.log(this.model);
					this.confirmLoading = true;
					deptApi
						.save(this.model)
						.then((res) => {
							if (res.isSuccess) {
								this.$message.success('保存成功');
								this.$emit('ok');
								this.visible = false;
							} else {
								this.$message.error(res.msg);
							}
						})
						.catch(() => {
							this.$message.error('系统错误，请稍后再试');
						})
						.finally(() => {
							this.confirmLoading = false;
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},
		validateOrgCode(rule, value, callback) {
			if (!value) {
				callback('请输入部门编码!');
			} else if (/[\u4E00-\u9FA5]/g.test(value)) {
				callback('部门编码不可输入汉字!');
			} else {
				var params = {
					tableName: 'sys_dept',
					fieldName: 'org_code',
					fieldVal: value,
					dataId: this.model.id
				};
				commonApi.duplicateCheck(params).then((res) => {
					if (res.isSuccess) {
						callback();
					} else {
						callback(res.msg);
					}
				});
			}
		},
		validateMobile(rule, value, callback) {
			if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
				callback();
			} else {
				callback('您的手机号码格式不正确!');
			}
		}
	}
};
</script>
<style lang="less" scoped>
.basicInfo {
	height: calc(50vh);
	overflow: auto;
	&::-webkit-scrollbar {
		width: 6px;
		height: 10px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #c4c8cf;
		border: 1px solid #c4c8cf;
	}
}
</style>

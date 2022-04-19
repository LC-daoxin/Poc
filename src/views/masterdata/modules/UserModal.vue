<template>
	<a-modal
		:title="title"
		:width="700"
		v-model="visible"
		:confirmLoading="confirmLoading"
		@cancel="handleCancel"
	>
		<a-form-model
			class="userForm"
			ref="form"
			:model="model"
			:rules="rules"
			:label-col="labelCol"
			:wrapper-col="wrapperCol"
		>
			<a-form-model-item label="头像">
				<img-upload ref="imgUpload" text="头像上传" :imageUrl="model.avatar" @success="(v) => (newAvatar = v)" />
			</a-form-model-item>
			<a-form-model-item :label="$t('username')" prop="username">
				<a-input v-model="model.username" :placeholder="$t('username')" />
			</a-form-model-item>
			<template v-if="isEdit === 'add'">
				<a-form-model-item :label="$t('password')" prop="password">
					<a-input
						type="password"
						v-model="model.password"
						placeholder="请输入登录密码"
						autocomplete="new-password"
						:maxLength="20"
					/>
				</a-form-model-item>
				<a-form-model-item label="确认密码" prop="confirmpassword">
					<a-input type="password" v-model="model.confirmpassword" placeholder="请再次输入登录密码" :maxLength="20" />
				</a-form-model-item>
			</template>
			<a-form-model-item :label="$t('realname')" prop="realname">
				<a-input v-model="model.realname" :placeholder="$t('realname')" />
			</a-form-model-item>
			<a-form-model-item :label="$t('nickname')" prop="nickname">
				<a-input v-model="model.nickname" :placeholder="$t('nickname')" />
			</a-form-model-item>
			<a-form-model-item :label="$t('birthday')" prop="birthday">
				<a-date-picker
					style="width: 100%"
					v-model="model.birthday"
					format="YYYY-MM-DD"
					valueFormat="YYYY-MM-DD"
					:placeholder="$t('birthday')"
				/>
			</a-form-model-item>
			<a-form-model-item :label="$t('sex')" prop="sex">
				<a-select v-model="model.sex" :placeholder="$t('sex')">
					<a-select-option :value="1">男</a-select-option>
					<a-select-option :value="2">女</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item :label="$t('email')" prop="email">
				<a-input v-model="model.email" :placeholder="$t('email')" />
			</a-form-model-item>
			<a-form-model-item :label="$t('mobilePhone')" prop="phone">
				<a-input v-model="model.phone" :placeholder="$t('mobilePhone')" />
			</a-form-model-item>
			<a-form-model-item label="座机号" prop="telephone">
				<a-input v-model="model.telephone" placeholder="座机号" />
			</a-form-model-item>
			<a-form-model-item label="标签" prop="label">
				<a-input v-model="model.label" placeholder="标签" />
			</a-form-model-item>
			<a-form-model-item label="职务">
				<select-single
					:typeList="[3]"
					typeName="post"
					:selectMultiple="true"
					:options="postOptions"
					placeholder="选择职务"
					v-model="post"
					@modelChange="modelSelectPost"
				/>
			</a-form-model-item>
			<a-form-model-item label="角色分配" prop="selectedRoles">
				<a-select
					mode="multiple"
					:disabled="modalDisabled"
					style="width: 100%"
					placeholder="请选择用户角色"
					v-model="model.selectedRoles"
					 @change="handleChangeRoles"
				>
					<a-select-option v-for="(role, i) in roleOptions" :key="i" :value="role.id">
						{{ role.name }}
					</a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item label="所属部门">
				<select-single
					:typeList="[2]"
					typeName="department"
					:selectMultiple="true"
					:options="departmentOptions"
					placeholder="选择所属部门"
					v-model="department"
					@modelChange="modelSelectDepartment"
				/>
			</a-form-model-item>
			<!-- <a-form-model-item label="身份">
				<a-radio-group v-model="model.identity">
					<a-radio value="1">普通用户</a-radio>
					<a-radio value="2">上级</a-radio>
				</a-radio-group>
			</a-form-model-item> -->
			<a-form-model-item label="负责部门">
				<a-select
					mode="multiple"
					style="width: 100%"
					placeholder="请选择负责部门"
					v-model="departIds"
					optionFilterProp="children"
					:dropdownStyle="{maxHeight: '200px', overflow: 'auto'}"
				>
					<a-select-option v-for="item in resultDepartOptions" :key="item.key" :value="item.key">{{
						item.title
					}}</a-select-option>
				</a-select>
			</a-form-model-item>
		</a-form-model>
		<template slot="footer">
			<a-button key="back" @click="handleCancel">取消</a-button>
			<a-button v-show="isEdit !== 'detail'" key="submit" type="primary" @click="handleSubmit">{{ isEdit === 'edit' ? '保存' : '提交' }}</a-button>
		</template>
	</a-modal>
</template>
<script>
import imgUpload from '@/components/FileUpload/imgUpload.vue';
import SelectSingle from '@/components/PannelPicker/SelectSingle.vue';
import userApi from '@/api/masterdata/user';
import roleApi from '@/api/masterdata/role';
import deptApi from '@/api/masterdata/dept';
import positionApi from '@/api/masterdata/position';
import commonApi from '@/api/common';
import _ from 'lodash';
export default {
	name: 'user-modal',
	components: {
		imgUpload,
		SelectSingle
	},
	data() {
		return {
			title: '新增',
			isEdit: 'add', // 是否为编辑状态 add 添加 edit 编辑 detail 详情
			visible: false,
			modalDisabled: false,
			confirmLoading: false,
			userId: null, //用户id
			post: [], // 职务选择ids
			postOptions: {
				// 职务选择selected
				selected: []
			},
			department: [],
			departmentOptions: {
				// 部门选择selected
				selected: []
			},
			roleOptions: [], // 全部角色
			resultDepartOptions: [], // 用户对应的负责部门
			departIds: [], // 负责部门ids
			newAvatar: '', // 改变的新图片
			labelCol: {
				xs: {span: 24},
				sm: {span: 5}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 16}
			},
			model: {
				sex: 1,
				// identity: 1,
				birthday: '',
				selectedRoles: [] // 选择的角色
			},
			rules: {
				username: [
					{required: true, message: '请输入用户名！', trigger: 'blur'},
					{validator: this.validateUsername, trigger: 'blur'}
				],
				password: [
					{
						required: true,
						pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{6,20}$/,
						message: '密码由6-20位数字、大小写字母和特殊符号组成!',
						trigger: 'blur'
					},
					{validator: this.validatePassword, trigger: 'blur'}
				],
				confirmpassword: [
					{required: true, message: '请重新输入登录密码!', trigger: 'blur'},
					{validator: this.validateConfirmPassword, trigger: 'blur'}
				],
				realname: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
				phone: [{required: false, validator: this.validatePhone, trigger: 'blur'}],
				email: [{required: false, validator: this.validateEmail, trigger: 'blur'}],
				selectedRoles: [{required: true, validator: this.validateRoles, trigger: 'change'}],
			}
		};
	},
	mounted() {
		this.initialRoleList(); // 获取全部角色
	},
	methods: {
		setTitle() {
			let s = {
				add: '新增',
				edit: '编辑',
				detail: '详情'
			}
			return this.title = s[this.isEdit]
		},
		add() {
			this.visible = true;
			this.isEdit = 'add';
			this.$nextTick(() => {
				this.$refs['form'].resetFields();
				this.clear();
				this.$refs.form.$el.scrollTop = 0;
				this.setTitle()
			});
		},
		edit(record, type = 'edit') { // edit detail
			console.log('edit', record);
			this.visible = true;
			this.clear();
			this.isEdit = type;
			this.userId = record.id;
			this.newAvatar = this._.cloneDeep(record.avatar)
			record.post && this.loadUserPost(record.post);
			this.loadCheckedDeparts();
			this.loadUserRoles(record.id);
			this.$nextTick(() => {
				this.$refs['form'].resetFields();
				this.setTitle()
				this.model = _.pick(
					record,
					'avatar',
					'id',
					'username',
					'realname',
					'nickname',
					'sex',
					'email',
					'phone',
					'telephone',
					'post',
					'label',
					'responsibleDepartIds'
				);
				this.$refs.form.$el.scrollTop = 0;
			});
		},
		handleCancel() {
			this.visible = false;
			this.clear();
		},
		clear() {
			this.model = {
				sex: 1,
				// identity: 1,
				birthday: '',
				selectedRoles: []
			};
			this.newAvatar = ''
			this.userId = null;
			this.post = []; // 职务选择ids
			this.postOptions = {
				// 职务选择selected
				selected: []
			};
			this.department = [];
			this.departmentOptions = {
				// 部门选择selected
				selected: []
			};
			this.resultDepartOptions = []; // 负责部门Options
			this.departIds = []; // 负责部门ids
			console.log('clear', this.model);
		},
		handleSubmit() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.confirmLoading = true;
					let params = _.cloneDeep(this.model);
					let departmentIdsArr = this.department.map((item) => item.id);
					let postIdsArr = this.post.map((item) => item.id);
					params.avatar = this.newAvatar
					params.post = postIdsArr.length > 0 ? postIdsArr.join(',') : '';
					console.log(this.model)
					params.selectedRoles = this.model.selectedRoles.length > 0 ? this.model.selectedRoles.join() : '';
					params.selectedDepts = departmentIdsArr.length > 0 ? departmentIdsArr.join(',') : '';
					params.responsibleDepartIds = this.departIds.length > 0 ? this.departIds.join(',') : '';
					console.log(params);
					let obj;
					if (!this.userId) {
						obj = userApi.addWithRelation(params);
					} else {
						obj = userApi.editWithRelation(params);
					}
					obj
						.then((res) => {
							if (res.isSuccess) {
								this.$message.success('保存成功');
								this.$emit('ok', this.model);
								this.handleCancel();
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
			});
		},
		modelSelectPost(row) {
			// 选择职务回调
			console.log(row);
		},
		modelSelectDepartment(row) {
			// 选择部门回调
			console.log(row);
			let depart = [];
			let departIds = [];
			row.forEach((item) => {
				depart.push({
					key: item.id,
					title: item.name
				});
				if (this.departIds.includes(item.id)) {
					departIds.push(item.id);
				}
			});
			this.resultDepartOptions = depart; // 负责部门Options
			this.departIds = departIds;
		},
		initialRoleList() {
			// 获取全部角色信息
			roleApi.queryAll().then((res) => {
				if (res.isSuccess) {
					this.roleOptions = res.data;
				} else {
					console.log(res.message);
				}
			});
		},
		loadUserPost(post) {
			// 获取用户的职务信息
			positionApi.queryByIds({ids: post}).then((res) => {
				const {code, msg, data} = res;
				if (code === '0001') {
					data.forEach((item) => {
						let obj = {
							type: 'post',
							typeName: '职务',
							name: item.name,
							id: item.id,
							orgCode: null
						};
						this.post.push(obj);
						this.postOptions.selected.push(obj);
					});
				} else {
					this.$message.error(msg);
				}
			});
		},
		loadUserRoles(userId) {
			// 获取用户的角色信息
			userApi.queryUserRole({userId: userId}).then((res) => {
				if (res.isSuccess) {
					this.model.selectedRoles = res.data;
				} else {
					console.log(res.message);
				}
			});
		},
		handleChangeRoles(value) {
			this.model.selectedRoles = value
		},
		loadCheckedDeparts() {
			// 获取查询用户对应的部门信息
			if (!this.userId) {
				return;
			}
			let depart = [];
			let departIds = [];
			userApi
				.getUserDepartList({userId: this.userId})
				.then((res) => {
					if (res.isSuccess) {
						for (let i = 0; i < res.data.length; i++) {
							//新增负责部门选择下拉框
							depart.push({
								key: res.data[i].key,
								title: res.data[i].title
							});
							departIds.push(res.data[i].key);
						}
						this.resultDepartOptions = depart; // 负责部门Options
						if (departIds.length > 0) {
							deptApi.queryByIds({ids: departIds.join(',')}).then((res) => {
								console.log(res);
								const {code, msg, data} = res;
								if (code === '0001') {
									data.forEach((item) => {
										let obj = {
											type: 'department',
											typeName: '部门',
											name: item.departName,
											id: item.id,
											orgCode: item.orgCode
										};
										this.department.push(obj);
										this.departmentOptions.selected.push(obj);
									});
								} else {
									this.$message.error(msg);
								}
							});
						}
						//判断部门id是否存在，不存在择直接默认当前所在部门
						if (this.model.responsibleDepartIds) {
							this.departIds = this.model.responsibleDepartIds.split(',');
						} else {
							this.departIds = [];
						}
					} else {
						console.log(res.message);
					}
				})
		},
		validateUsername(rule, value, callback) {
			var params = {
				tableName: 'sys_user',
				fieldName: 'username',
				fieldVal: value,
				dataId: this.userId
			};
			commonApi.duplicateCheck(params).then((res) => {
				if (res.isSuccess) {
					callback();
				} else {
					callback('用户名已存在!');
				}
			});
		},
		validatePassword(rule, value, callback) {
			const confirmpassword = this.model.confirmpassword;
			if (value && confirmpassword && value !== confirmpassword) {
				callback('两次输入的密码不一样！');
			}
			callback();
		},
		validateConfirmPassword(rule, value, callback) {
			const password = this.model.password;
			if (value && password && value !== password) {
				callback('两次输入的密码不一样！');
			}
			callback();
		},
		validatePhone(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (!new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
					callback('请输入正确格式的手机号码!');
				} else {
					callback();
				}
			}
		},
		validateRoles(rule, value, callback) {
			if (this.model.selectedRoles.length > 0) {
				callback();
			} else {
				callback('至少分配一个角色！');
			}
		},
		validateEmail(rule, value, callback) {
			if (!value) {
				callback();
			} else {
				if (
					!new RegExp(
						/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					).test(value)
				) {
					callback('请输入正确格式的邮箱!');
				} else {
					callback();
				}
			}
		}
	}
};
</script>
<style lang="less" scoped>
.userForm {
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

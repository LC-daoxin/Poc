/*
 * @Author: Lince 
 * @Date: 2021-08-12 17:28:24 
 * @Last Modified by: Lince
 * @Last Modified time: 2022-04-19 11:49:15
 */
<template>
  <a-card>
    <a-form-model
      ref="form"
      class="processCenter"
      layout="inline"
      :model="model"
      :labelCol="{span: searchLabelCol}"
      :wrapperCol="{span: searchWrapperCol}"
    >
      <a-form-model-item
        class="form-item"
        :label="$t('username')"
        prop="username"
      >
        <a-input
          allowClear
          v-model.trim="model.username"
					@pressEnter="search"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        class="form-item"
        :label="$t('realname')"
        prop="realname"
      >
        <a-input
          allowClear
          v-model.trim="model.realname"
					@pressEnter="search"
        ></a-input>
      </a-form-model-item>
      <!--	<a-form-model-item :label="$t('startingTime')" class="form-item" prop="startDate">
					
				<a-date-picker
					placeholder="开始时间"
					valueFormat="YYYY-MM-DD HH:mm:ss"
					allowClear
					v-model="model.startDate"
				/>
			</a-form-model-item>
			<a-form-model-item :label="$t('endTime')" class="form-item" prop="endDate">
				<a-date-picker
				
					show-time
					placeholder="结束时间"
					valueFormat="YYYY-MM-DD HH:mm:ss"
					allowClear
					v-model="model.endDate"
				/>
				</a-form-model-item>-->
      <a-form-model-item
        class="form-item"
        :label="$t('nickname')"
        prop="nickname"
      >
        <a-input
          allowClear
          v-model.trim="model.nickname"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-space>
        <a-button
          type="primary"
          icon="plus"
          @click="$refs.modal.add()"
        >新建</a-button>
        <a-button
          type="primary"
          icon="search"
          @click="search"
        >{{ $t('search') }}</a-button>
        <a-button
          type="primary"
          icon="download"
          @click="handleExport"
        >导出</a-button>
        <a-upload
          :customRequest="handleImport"
          :disabled="importLoading"
          :showUploadList="false"
          style="display: inline-block"
        >
          <a-button
            type="primary"
            icon="import"
            :loading="importLoading"
          > 导入 </a-button>
        </a-upload>
        <a-button
          type="primary"
          icon="download"
          @click="downloadImportFile"
        >导入模板下载</a-button>
        <a-button
          icon="delete"
          @click="model = {}"
        >{{ $t('clear') }}</a-button>

      </a-space>
      <a-space>
        <a-button
          icon="redo"
          type="primary"
          @click="refresh"
        >{{ $t('refresh') }}</a-button>
        <a-popconfirm
          v-show="hasDeleteAuth"
          title="确定执行删除操作？"
          okText="确定"
          cancelText="取消"
          @confirm="handleDelete"
        >
          <a-button
            v-show="hasDeleteAuth"
            icon="delete"
            type="danger"
            @click="handleDelete"
          >{{
						$t('delete')
					}}</a-button>
        </a-popconfirm>
      </a-space>
    </div>
    <public-table
      class="public-table"
      :pagination="pagination"
      :params="tableParams"
      :rowSelection="true"
      @pageChange="fetch"
      @selectionChange="selectionChange"
    ></public-table>
    <user-modal
      ref="modal"
      @ok="refresh"
    />
    <password-modal
      ref="passwordmodal"
      @ok="passwordModalOk"
    ></password-modal>
  </a-card>
</template>

<script>
  import {fileExport} from '@/utils/util';
  import api from '@/api/masterdata/user';
  import documentApi from '@/api/documentCenter/documentManage.js';
  import UserModal from './modules/UserModal';
  import PasswordModal from './modules/PasswordModal';
  import {langAndAuth} from '@/mixin';
  export default {
  	name: 'UserList',
  	mixins: [langAndAuth],
  	data() {
  		return {
  			api,
  			expand: false,
  			model: {},
  			selectionKeys: [],
  			pagination: {
  				total: 0,
  				current: 1,
  				pageSize: 10
  			},
  			tableParams: {
  				loading: false,
  				dataSource: [],
  				scroll: {x: 1300},
  				columns: [
  					{
  						title: this.$t('avatar'), // 头像
  						dataIndex: 'avatar',
  						i18n: 'avatar',
  						align: 'center',
  						width: 60,
  						customRender: (text, record) => {
  							const renderElement = [];
  							renderElement.push(
  								<div class="anty-img-wrap">
  									<a-avatar shape="square" size="small" src={record.avatar} icon="user" />
  								</div>
  							);
  							return <a-space>{renderElement}</a-space>;
  						}
  					},
  					{
  						title: this.$t('username'), // 用户名
  						dataIndex: 'username',
  						i18n: 'username',
  						width: 150,
  						align: 'center',
  						ellipsis: true
  					},
  					{
  						title: this.$t('realname'), // 真实姓名
  						dataIndex: 'realname',
  						i18n: 'realname',
  						width: 90,
  						align: 'center',
  						ellipsis: true
  					},
  					{
  						title: this.$t('nickname'), // 昵称,
  						dataIndex: 'nickname',
  						i18n: 'nickname',
  						align: 'center',
  						width: 90,
  						ellipsis: true
  					},
						{
  						title: '主子账户', // belongTo,
  						dataIndex: 'belongTo',
  						// i18n: 'nickname',
  						align: 'center',
  						width: 200,
  						ellipsis: true,
							customRender: (text, record) => {
								if (text == '-1') {
									return <a-tag color='blue'>主账户({record.oaUserId})</a-tag>
								} else {
									return text ? <a-tag color='blue'>主账户({text})-子账户({record.oaUserId})</a-tag> : ''
								}
  						}
  					},
  					{
  						title: this.$t('sex'), // 性别
  						dataIndex: 'sex',
  						i18n: 'sex',
  						width: 70,
  						align: 'center',
  						customRender: (sex) => <a-tag color={this.sexStyle(sex)}>{ this.sexText(sex) }</a-tag>
  					},
  					{
  						title: this.$t('birthday'), // 生日
  						dataIndex: 'birthday',
  						i18n: 'birthday',
  						width: 110,
  						align: 'center',
  						ellipsis: true,
  						customRender: (birthday) => (birthday ? this.$moment(birthday).format('YYYY-MM-DD') : '')
  					},
  					{
  						title: this.$t('email'), // 电子邮件
  						dataIndex: 'email',
  						i18n: 'email',
  						align: 'center',
  						width: 200,
  						ellipsis: true
  					},
  					{
  						title: this.$t('mobilePhone'), // 手机号
  						dataIndex: 'phone',
  						i18n: 'mobilePhone',
  						width: 120,
  						align: 'center',
  						ellipsis: true
  					},
  					{
  						title: this.$t('status'), // 是否启用
  						dataIndex: 'status',
  						i18n: 'status',
  						align: 'center',
  						width: 70,
  						customRender: (status) => <a-tag color={status == 1 ? 'blue' : 'orange'}>{this.statusFilter(status)}</a-tag>
  					},
  					// {
  					// 	title: this.$t('responsibleDepartIds'), // 负责部门
  					// 	dataIndex: 'responsibleDepartIds',
  					// 	i18n: 'responsibleDepartIds',
  					// 	align: 'center',
  					// 	width: 120,
  					// 	ellipsis: true
  					// },
  					{
  						title: this.$t('operation'), // 操作
  						i18n: 'operation',
  						scopedSlots: {customRender: 'action'},
  						fixed: 'right',
  						width: 180,
  						align: 'center',
  						customRender: (text, record) => {
  							const renderElement = [];
  							const {id} = record;
  							renderElement.push(
  								<a-button
  									icon="edit"
  									type="primary"
  									size="small"
  									onClick={() => {
  										this.handleEdit(record);
  									}}
  								>
  									{this.$t('edit')}
  								</a-button>
  							);
  							renderElement.push(
  								<a-dropdown>
  									<a-button icon="control" size="small">
  										{this.$t('more')}
  									</a-button>
  									<a-menu slot="overlay">
  										<a-menu-item onClick={() => this.handleDetail(record)}>
  											<a-icon type="solution" />
  											<span>用户详情</span>
  										</a-menu-item>
  										<a-menu-item onClick={() => this.handleChangePassword(record.username)}>
  											<a-icon type="edit" />
  											<span>修改密码</span>
  										</a-menu-item>
  										{record.status === 1 ? (
  											<a-menu-item onClick={() => this.handleDisable(record.id, 0, record.username)}>
  												<a-icon type="stop" />
  												<span>{this.$t('disable')}</span>
  											</a-menu-item>
  										) : (
  											<a-menu-item onClick={() => this.handleDisable(record.id, 1, record.username)}>
  												<a-icon type="check-square" />
  												<span>{this.$t('enable')}</span>
  											</a-menu-item>
  										)}
  										<a-menu-item>
  											<a-popconfirm
  												title="确定删除该用户吗?"
  												okText={this.$t('ok')}
  												cancelText={this.$t('cancel')}
  												onConfirm={() => this.handleDelete(id)}
  											>
  												<a-icon type="delete" />
  												<span>删除用户</span>
  											</a-popconfirm>
  										</a-menu-item>
  									</a-menu>
  								</a-dropdown>
  							);
  							return <a-space>{renderElement}</a-space>;
  						}
  					}
  				]
  			},
  			importLoading: false
  		};
  	},
  	computed: {
  		hasDeleteAuth() {
  			return this.selectionKeys.length > 0; // && this.checkMenuFuncPermission('processCenter:myTodo:delete');
  		}
  	},
  	created() {
  		this.refresh();
  	},
  	methods: {
			search() {
  			// 搜索
				this.pagination.current = 1;
				this.fetch(this.pagination.current, this.pagination.pageSize, this.model)
  		},
  		//展开收起
  		toggle() {
  			this.expand = !this.expand;
  		},
  		setShortCol() {
  			this.searchLabelCol = 7;
  			this.searchWrapperCol = 17;
  		},
  		setLongCol() {
  			this.searchLabelCol = 9;
  			this.searchWrapperCol = 15;
  		},
  		statusFilter(status) {
  			const statusMap = {
  				0: '禁用',
  				1: '正常'
  			};
  			return statusMap[status];
  		},
  		async handleDelete(id) {
  			let ids;
  			if (this.selectionKeys.length > 0) {
  				ids = this.selectionKeys.join(',');
  			} else {
  				ids = id;
  			}

  			const res = await api.delete({ids});
  			const {code, msg} = res;
  			if (code === '0001') {
  				this.refresh();
  				this.$message.success('操作成功');
  			} else {
  				this.$message.error(msg);
  			}
  		},
  		async handleExport() {
  			const postData = {map: {}, model: {}}; // this.queryParams
  			const res = await api.export(postData);
  			fileExport(res);
  		},
  		handleImport({file}) {
  			let param = new FormData();
  			let that = this;
  			param.append('file', file, file.name);
  			this.importLoading = true;
  			userApi
  				.import(param)
  				.then((res) => {
  					if (res.code === '0001') {
  						this.$message.success('导入成功');
  						that.$refs.table.refresh(true);
  					} else {
  						this.$message.warning(res.msg);
  						return [];
  					}
  					this.importLoading = false;
  				})
  				.catch((err) => {
  					this.importLoading = false;
  				});
  		},
  		async downloadImportFile() {
  			const res = await documentApi.downloadImportFile('用户导入模板.xlsx');
  			fileExport(res, '用户导入模板.xlsx');
  		},
  		handleEdit(record) {
  			this.$refs.modal.edit(record, 'edit');
  		},
  		handleDetail(record) {
  			this.$refs.modal.edit(record, 'detail');
  		},
  		handleChangePassword(username) {
  			this.$refs.passwordmodal.show(username);
  		},
  		passwordModalOk() {
  			//TODO 密码修改完成事件
  		},
  		handleDisable: function (id, status, username) {
  			let that = this;
  			if ('admin' == username) {
  				that.$message.warning('管理员账号不允许此操作！');
  				return;
  			}
  			api.disableBatch({ids: id, status: status}).then((res) => {
  				if (res.isSuccess) {
  					that.$message.success(res.msg);
  					that.refresh();
  				} else {
  					that.$message.warning(res.msg);
  				}
  			});
  		},
			sexStyle(sex) {
  			const sexArr = new Map([
  				[0, 'yellow'],
  				[1, 'blue'],
  				[2, 'green']
  			]);
  			return sexArr.get(sex) || nameArr.get(0);
  		},
			sexText(sex) {
  			const sexArr = new Map([
  				[0, '未知'],
  				[1, '男'],
  				[2, '女']
  			]);
  			return sexArr.get(sex) || nameArr.get(0);
  		}
  	},
  	components: {
  		PasswordModal,
  		UserModal
  	}
  };
</script>

<style lang="less" scoped>
</style>

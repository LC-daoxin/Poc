<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门角色名称">
          <a-input placeholder="请输入部门角色名称" v-decorator="['roleName', validatorRules.roleName]" autoComplete="off"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="部门角色编码">
          <a-input placeholder="请输入部门角色编码" v-decorator="['roleCode', validatorRules.roleCode]" autoComplete="off"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-input placeholder="请输入描述" v-decorator="['description', validatorRules.description]" autoComplete="off"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import deptRoleApi from '@/api/masterdata/deptRole'
  import pick from 'lodash.pick'
  import commonApi  from '@/api/common'

  export default {
    name: "DeptRoleModal",
    data () {
      return {
        title:"操作",
        visible: false,
        deptId: 0,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          roleName:{
            rules: [
              { required: true, message: '请输入部门角色名称!' },
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ]},
          roleCode:{
            rules: [
              { required: true, message: '请输入部门角色编码!'},
              { min: 0, max: 64, message: '长度不超过 64 个字符', trigger: 'blur' },
              { validator: this.validateRoleCode}
            ]},
          description:{
            rules: [
              { min: 0, max: 126, message: '长度不超过 126 个字符', trigger: 'blur' }
            ]}
        },
      }
    },
    created () {
    },
    methods: {
      add (deptId) {
        this.edit({},deptId);
      },
      edit (record,deptId) {
        this.deptId = deptId;
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'roleName','roleCode','description'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;         
            let formData = Object.assign(this.model, values);
            formData.deptId = this.deptId;
            deptRoleApi.save(formData).then((res)=>{
              if(res.isSuccess){
                that.$message.success(res.msg);
                that.$emit('ok');
              }else{
                that.$message.warning(res.msg);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateRoleCode(rule, value, callback){
        if(/[\u4E00-\u9FA5]/g.test(value)){
          callback("部门角色编码不可输入汉字!");
        }else{
          var params = {
            tableName: "sys_dept_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          commonApi.duplicateCheck(params).then((res)=>{
            if(res.isSuccess){
              callback();
            }else{
              callback(res.msg);
            }
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
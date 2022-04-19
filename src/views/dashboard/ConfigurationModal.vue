<template>
  <a-modal :title="isEdit ? $t('edit') : $t('add')" :width="700" v-model="visible" :confirmLoading="confirmLoading">
    <a-form-model ref="form" :model="model" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item :label="$t('vacation')" prop="date">
        <a-date-picker v-model="model.date" :placeholder="$t('vacation')" style="width: 100%" />
      </a-form-model-item>
      <a-form-model-item :label="$t('type')" prop="type">
        <a-select v-model="model.type" :placeholder="$t('type')">
          <a-select-option v-for="(item, index) in typeOptions" :key="index" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('description')" prop="describe">
        <a-input v-model="model.describe" :placeholder="$t('description')" />
      </a-form-model-item>
    </a-form-model>
    <template slot="footer">
      <a-button key="back" @click="handleCancel">
        {{ this.$t('cancel') }}
      </a-button>
      <a-button v-if="isEdit" key="submit" type="primary" @click="save">
        {{ this.$t('save') }}
      </a-button>
      <a-button v-else key="submit" type="primary" @click="handleSubmit">
        {{ this.$t('submit') }}
      </a-button>
    </template>
  </a-modal>
</template>
<script>
import { randomString } from '@/utils/util'
import _ from 'lodash'
export default {
  name: 'configuration-modal',
  components: {},
  props: ['typeOptions'],
  data() {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      model: {
        date: null,
        type: 16,
        description: '',
      },
      rules: {
        date: [{ required: true, message: '请输入假期', trigger: 'change' }],
        // description: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
      },
      isEdit: false, // 是否为编辑状态
    }
  },
  methods: {
    add() {
      this.visible = true
      this.isEdit = false
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.model.id = randomString(12)
        this.model = _.cloneDeep(this.model)
      })
    },
    edit(record) {
      this.isEdit = true
      this.model = Object.assign({}, record)
      this.visible = true
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save', this.model)
          this.visible = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('add', this.model)
          this.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

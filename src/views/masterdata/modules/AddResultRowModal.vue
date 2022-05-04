/*
 * @Author: Lince 
 * @Date: 2022-04-27 00:37:42 
 * @Last Modified by: Lince
 * @Last Modified time: 2022-05-03 19:10:49
 */


<template>
  <vxe-modal
    v-model="visible"
    title="Edit"
    width="800"
    height="500"
    resize
    showFooter
  >
    <template #default>
      <a-form-model
        class="form"
        ref="form"
        :model="model"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="ActivityNo"
          prop="ActivityNo"
        >
          <a-input
            v-model="model.ActivityNo"
            disabled
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="Description"
          prop="Description"
        >
          <a-input
            v-model="model.Description"
            disabled
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="Discount"
          prop="Discount"
        >
          <a-input v-model="model.Discount"></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="StartDate"
          prop="StartDate"
        >
          <a-date-picker
            v-model="model.StartDate"
						show-time
            format="YYYY/MM/DD HH:mm:ss"
          />
        </a-form-model-item>
        <a-form-model-item
          label="ReportDeliverDate"
          prop="ReportDeliverDate"
        >
          <a-date-picker
            v-model="model.ReportDeliverDate"
            format="YYYY/MM/DD HH:mm:ss"
						show-time
          />
        </a-form-model-item>
        <a-form-model-item
          label="Comments"
          prop="Comments"
        >
          <a-input v-model="model.Comments"></a-input>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template #footer>
      <a-button
        type="primary"
        @click="add"
      >提交</a-button>
    </template>
  </vxe-modal>
</template>

<script>
	import axios from 'axios'
  export default {
    name: 'AddResultRowModal',
    data() {
      return {
        visible: false,
        editStatus: false, // 编辑状态
        model: {
          ActivityNo: '',
          Description: '',
          Discount: '',
          StartDate: '',
          ReportDeliverDate: '',
          Comments: '',
        },
        processInfo: null,
        rules: {
          Discount: [{ required: true, message: 'Please input Discount', trigger: 'blur' }],
          StartDate: [{ required: true, message: 'Please input StartDate', trigger: 'blur' }],
          ReportDeliverDate: [{ required: true, message: 'Please input ReportDeliverDate', trigger: 'blur' }],
          Comments: [{ required: true, message: 'Please input Comments', trigger: 'blur' }],
        },
        params: [], // 流程参数
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
        formInstanceData: null,
        forminstanceId: null,
      }
    },
    methods: {
      cancel() {
				this.visible = false
				setTimeout(() => {
					this.model = {
						ActivityNo: '',
						Description: '',
						Discount: '',
						StartDate: '',
						ReportDeliverDate: '',
						Comments: '',
            Revenue,
					}
				}, 1000)
        this.$emit('refresh')
      },
      open() {
        this.editStatus = false
        this.visible = true
      },
      edit(record) {
        console.log(record)
        this.editStatus = true
        this.model = Object.assign(
          {},
          {
						ID: record.ID,
            ActivityNo: record.ActivityNo,
            Description: record.Description,
            Discount: record.Discount,
            Revenue: record.Revenue,
            StartDate: this.$moment(record.StartDate, 'YYYY/MM/DD HH:mm:ss'),
            ReportDeliverDate: this.$moment(record.ReportDeliverDate, 'YYYY/MM/DD HH:mm:ss'),
            Comments: record.Comments,
          }
        )
        this.visible = true
      },
      add() {
				console.log(1)
        this.$refs.form.validate((valid) => {
          if (valid) {
						console.log(2)
						axios.post('http://123.56.242.202:8080/api/SplitRule/PMSDataSplitResultUpdate', [this.model]).then((res) => {
							console.log('PMSDataSplitResultUpdate', res)
							this.cancel()
						})
          }
        })
      },
    },
    components: {
		},
  }
</script>

<style lang="less" scoped>
/deep/ .ant-modal-body {
  padding-bottom: 0;
}
.form {
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
.h120 {
  height: 120px;
}
button.redirect {
  background: #42c3ff;
  border: 1px solid #42c3ff;
  color: #fff;
}
button:disabled {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  text-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.reset {
  margin-left: 20px;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  margin-left: 10px;
  font-size: 18px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

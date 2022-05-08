<template>
  <vxe-modal
    v-model="visible"
    title="Edit Split Rule"
    width="1100"
    height="600"
    resize
    showFooter
  >
    <template #default>
      <div class="selectType">
      <span class="ruleRowTop">IF The Separate Type is</span>
      <a-select
        allowClear
        v-model="Type"
        @change="changeSeparateType"
      >
        <a-select-option
          :value="item.value"
          :key="item.value"
          v-for="item in typeOptions"
        >{{
            item.label
          }}</a-select-option>
      </a-select>
    </div>
    <rule
      class="rule"
      ref="rule"
      :group-list="rules"
      :SeparateType="Type"
      :ActivityID="currentRow.ActivityID"
      :SplitRuleID="currentRow.ID"
      :optionsList="optionsList"
    />
    </template>
    <template #footer>
      <a-button
        key="back"
        @click="handleCancel"
      > 取消 </a-button>
      <a-button
        key="submit"
        type="primary"
        @click="onOk"
      > 保存 </a-button>
    </template>
  </vxe-modal>
  <!-- <a-modal
    title="拆分规则维护"
    width="90%"
    v-model="visible"
    :confirmLoading="confirmLoading"
  >
    
    <template slot="footer">
      
    </template>
  </a-modal> -->
</template>

<script>
  import rule from './rule'
  import clonedeep from 'lodash.clonedeep'
  import { randomUUID } from '@/utils/util'
  import axios from 'axios'
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'EditRuleModal',
    props: {
      isDisabledEdit: {
        type: Boolean,
      }
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        isEdit: false, // 编辑状态
        Type: 1,
        rules: {}, // 场景规则
        currentRow: {}, // 被选择的拆分SubActivity
        typeOptions: [
          {
            label: '按固定比例拆分',
            value: 1,
          },
          {
            label: '按条件拆分',
            value: 2,
          },
          {
            label: '按周期拆分',
            value: 3,
          },
        ],
        Rules1: {
          // 默认-固定拆分
          id: `rule_${randomUUID(10)}`,
          SeparateType: 1,
          ActivityID: '',
          SplitRuleID: '',
          tierIndex: 1,
          Then: [],
        },
        Rules2: {
          // 默认-条件拆分
          id: `rule_${randomUUID(10)}`,
          SeparateType: 2,
          ActivityID: '',
          SplitRuleID: '',
          tierIndex: 1,
          Then: [
            {
              type: 'IF',
              id: `${randomUUID(10)}`,
              tierIndex: 2,
              leftOperatorExpression: {
                type: 2,
                value: 'Scale',
              },
              compareOperation: '=',
              rightOperatorExpression: {
                type: 1,
                value: 50,
              },
              Then: [],
            },
            {
              type: 'ELSE',
              id: `${randomUUID(10)}`,
              tierIndex: 2,
              leftOperatorExpression: {
                type: 2,
                value: 'Scale',
              },
              compareOperation: '=',
              rightOperatorExpression: {
                type: 1,
                value: 50,
              },
              Then: [],
            },
          ],
        },
        optionsList: {
          BuList: [],
          Property: []
        }
      }
    },
    mounted() {
    },
    methods: {
      ...mapMutations({
        setOptionsList(commit, obj) {
          console.log('setOptionsList', obj)
          return commit('poc/setOptionsList', obj)
        },
      }),
      open(record) {
        this.currentRow = record
        console.log(record)
        this.visible = true
        this.getOptionsAll()
        // ?ActivityID=${record.ActivityID}&&userID=${JSON.parse(sessionStorage.getItem("LoginUser")).UserID}
        axios.post(`http://123.56.242.202:8080/api/SplitRule/GetActivitySplit?ActivityID=${record.ActivityID}&&userID=${JSON.parse(sessionStorage.getItem("LoginUser")).UserID}`).then((res) => {
          console.log('GetActivitySplit', res, JSON.parse(res.data))
          if (res.data == '[]') {
            this.rules = clonedeep(this.Rules1)
            this.rules.ActivityID = this.currentRow.ActivityID
            this.rules.SplitRuleID = this.currentRow.ID
            this.isEdit = false
            this.Type = 1
          } else {
            this.rules = clonedeep(this.Rules1)
            this.rules.ActivityID = this.currentRow.ActivityID
            this.rules.SplitRuleID = this.currentRow.ID
            this.rules.Then = JSON.parse(res.data)
            if (JSON.parse(res.data)[0].type == 'IF') {
              this.Type = 2 // 条件
            } else if (JSON.parse(res.data)[0].compareOperation == 'forEach') {
              this.Type = 3 // 周期
            } else {
              this.Type = 1 // 固定比例
            }
            this.isEdit = true
          }
        })
      },
      getOptionsAll() {
        axios.all([this.getBuList(), this.getProperty()]).then( // 并行请求要加()调用
          axios.spread((res1,res2)=>{
            console.log('getBuList', res1.data)
            console.log('getProperty', res2.data)
            res1.data.forEach(item => {
              item.isLeaf = false
              item.loading = false
              // item.children = []
            })
            this.optionsList = {
              BuList: res1.data,
              Property: res2.data
            }
            this.setOptionsList(clonedeep(this.optionsList))
          })
        )
      },
      getBuList() {
        return axios.get(`http://123.56.242.202:8080/api/SplitRule/GetBuList`)
      },
      getProperty() {
        return axios.get(`http://123.56.242.202:8080/api/SplitRule/GetProperty`)
      },
      changeSeparateType(val) {
        if (val == 1) {
          this.rules = clonedeep(this.Rules1)
        } else if (val == 2) {
          this.rules = clonedeep(this.Rules2)
          this.rules.Then[0].ActivityID = this.currentRow.ActivityID
          this.rules.Then[0].SplitRuleID = this.currentRow.ID
          this.rules.Then[1].ActivityID = this.currentRow.ActivityID
          this.rules.Then[1].SplitRuleID = this.currentRow.ID
        } else if (val == 3) {
          this.rules = clonedeep(this.Rules1)
          this.rules.SeparateType = 3
        }
        this.rules.ActivityID = this.currentRow.ActivityID
        this.rules.SplitRuleID = this.currentRow.ID
        console.log(this.optionsList)
      },
      handleCancel() {
        this.visible = false
      },
      onOk() {
        console.log('保存规则', this.rules)
        if (this.rules.Then.length === 0) {
          this.$message.warning('请配置拆分规则！')
        } else {
          debugger
          this.currentRow
          axios.post(`http://123.56.242.202:8080//api/SplitRule/DataUserSplitUpdate`, [{
            ID: this.currentRow.ID,
            // SplitRuleID: this.currentRow.SplitRuleID,
            batchID:  this.currentRow.BatchID,
            UserID: JSON.parse(sessionStorage.getItem("LoginUser")).UserID,
            ActivityID: this.currentRow.ActivityID,
            json: this.rules.Then
          }]).then((res) => {
            console.log('DataUserSplitUpdate', res)
            this.rules = {}
            this.handleCancel()
            this.$emit('refresh')
          })
          // if (!this.isEdit) { // 创建
          //   axios.post(`http://123.56.242.202:8080/api/SplitRule/DataSplitCreate`, this.rules.Then).then((res) => {
          //     console.log('DataSplitCreate', res)
          //     this.rules = {}
          //     this.handleCancel()
          //   })
          // } else { // 更新
          //   axios.post(`http://123.56.242.202:8080/api/SplitRule/DataSplitUpdate`, this.rules.Then).then((res) => {
          //     console.log('DataSplitUpdate', res)
          //     this.rules = {}
          //     this.handleCancel()
          //   })
          // }
        }
      },
    },
    components: {
      rule,
    },
  }
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 0 !important;
}
.ruleRowTop {
  margin-right: 20px;
  font-size: 20px;
  font-weight: 500;
}
.selectType {
  display: flex;
  align-items: center;
}
.rule {
  height: calc(50vh);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c4c8cf;
    border: 1px solid #c4c8cf;
  }
}
</style>
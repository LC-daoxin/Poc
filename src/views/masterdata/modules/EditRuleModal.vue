<template>
  <a-modal title="拆分规则维护" width="90%" v-model="visible" :confirmLoading="confirmLoading">
    <div class="selectType">
      <span class="ruleRowTop">IF The Separate Type is</span>
      <a-select allowClear v-model="Type" :dropdownStyle="{ 'z-index': 9999 }" @change="changeSeparateType">
        <a-select-option :value="item.value" :key="item.value" v-for="item in typeOptions">{{
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
    <template slot="footer">
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
      <a-button key="submit" type="primary" @click="onOk"> 保存 </a-button>
    </template>
  </a-modal>
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
      type: Boolean
    },
    typeOptions: {
      type: Array
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
      Rules1: {
        // 默认-固定拆分
        id: `rule_${randomUUID(10)}`,
        SeparateType: 1,
        ActivityID: '',
        SplitRuleID: '',
        tierIndex: 1,
        Then: []
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
              type: '2',
              value: 'Scale'
            },
            compareOperation: '=',
            rightOperatorExpression: {
              type: '1',
              value: 50
            },
            Then: []
          },
          {
            type: 'ELSE',
            id: `${randomUUID(10)}`,
            tierIndex: 2,
            leftOperatorExpression: {
              type: '2',
              value: 'Scale'
            },
            compareOperation: '=',
            rightOperatorExpression: {
              type: '1',
              value: 50
            },
            Then: []
          }
        ]
      },
      optionsList: {
        BuList: [],
        Property: []
      }
    }
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setOptionsList(commit, obj) {
        console.log('setOptionsList', obj)
        return commit('poc/setOptionsList', obj)
      }
    }),
    open(record) {
      console.log(record)
      this.currentRow = record
      this.visible = true
      this.getOptionsAll()
      axios.get(`http://47.103.127.217:8080/api/SplitRule/GetDataSplit?splitRuleID=${record.ID}`).then(res => {
        console.log('GetDataSplit', res, JSON.parse(res.data))
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
            this.rules.SeparateType = 2
          } else if (JSON.parse(res.data)[0].compareOperation == 'forEach') {
            this.Type = 3 // 周期
            this.rules.SeparateType = 3
          } else {
            this.Type = 1 // 固定比例
          }
          this.isEdit = true
        }
      })
    },
    getOptionsAll() {
      axios.all([this.getBuList(), this.getProperty()]).then(
        // 并行请求要加()调用
        axios.spread((res1, res2) => {
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
      return axios.get(`http://47.103.127.217:8080/api/SplitRule/GetBuList`)
    },
    getProperty() {
      return axios.get(`http://47.103.127.217:8080/api/SplitRule/GetProperty`)
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
        if (!this.isEdit) {
          // 创建
          axios.post(`http://47.103.127.217:8080/api/SplitRule/DataSplitCreate`, this.rules.Then).then(res => {
            console.log('DataSplitCreate', res)
            this.rules = {}
            this.handleCancel()
          })
        } else {
          // 更新
          axios.post(`http://47.103.127.217:8080/api/SplitRule/DataSplitUpdate`, this.rules.Then).then(res => {
            console.log('DataSplitUpdate', res)
            this.rules = {}
            this.handleCancel()
          })
        }
      }
    }
  },
  components: {
    rule
  }
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

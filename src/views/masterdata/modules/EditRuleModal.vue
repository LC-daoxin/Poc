<template>
  <a-modal
    title="拆分规则维护"
    width="90%"
    v-model="visible"
    :confirmLoading="confirmLoading"
  >
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
    />
    <template slot="footer">
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
  </a-modal>
</template>

<script>
  import rule from './rule'
  import clonedeep from 'lodash.clonedeep'
  import { randomUUID } from '@/utils/util'
  export default {
    name: 'EditRuleModal',
    props: {
      isDisabledEdit: {
        type: Boolean,
      },
      typeOptions: {
        type: Array,
      },
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
          tierIndex: 1,
          Then: [],
        },
        Rules2: {
          // 默认-条件拆分
          id: `rule_${randomUUID(10)}`,
          SeparateType: 2,
          ActivityID: '',
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
      }
    },
    watch: {
      visible(val) {
        if (val) {
          // 打开时
          this.$nextTick(() => {
            this.rules = clonedeep(this.Rules1)
            this.rules.ActivityID = this.currentRow.ActivityID
          })
        }
      },
    },
    methods: {
      open(record) {
        this.currentRow = record
        this.visible = true
        this.isEdit = false
      },
      changeSeparateType(val) {
        if (val == 1) {
          this.rules = clonedeep(this.Rules1)
        } else if (val == 2) {
          this.rules = clonedeep(this.Rules2)
        } else if (val == 3) {
        }
        this.rules.ActivityID = this.currentRow.ActivityID
      },
      handleCancel() {
        this.visible = false
      },
      onOk() {
        console.log('保存规则', this.rules)
        if (this.rules.Then.length === 0) {
          this.$message.warning('请配置拆分规则！')
        } else {
          // this.currentRow.rule = this.rules;
          console.log(this.currentRow)
          this.rules = {}
          this.handleCancel()
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
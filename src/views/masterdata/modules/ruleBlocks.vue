<template>
  <a-row>
    <a-col
      class="col"
      :span="24"
    >
      <div class="toolbar">
        <span class="thenText">THEN</span>
        <a-button
          v-if="groupList.SeparateType == 1 || groupList.tierIndex == 2"
          type="primary"
          size="small"
          class="toolbtn"
          :disabled="!isEdit"
          @click.stop="addCondition('fixed')"
        >
          <a-icon type="plus-circle" /> 添加拆分规则
        </a-button>
        <!-- <a-button
          type="primary"
          size="small"
          class="toolbtn"
          :disabled="!isEdit"
          @click.stop="addCondition('symbol')"
        >
          <a-icon type="plus-circle" /> 添加逻辑符号
        </a-button> -->
        <!-- <a-button
          v-if="groupList.SeparateType != 1"
          type="primary"
          size="small"
          class="toolbtn"
          :disabled="!isEdit"
          @click.stop="addCondition('THEN')"
        >
          <a-icon type="folder-add" /> 添加条件组
        </a-button> -->
        <a-button
          v-if="type !== 'children'"
          size="small"
          class="toolbtn"
          @click.stop="getGroup()"
        >
          数据
        </a-button>
      </div>
      <div
        v-for="item in groupList.Then"
        :key="item.id"
        class="condition-item"
      >
        <!-- <div
          v-if="groupList.Then.length > 1 && ['THEN', 'IF', 'ELSE'].includes(item.type)"
          class="line"
        ></div> -->
        <div
          class="condition-select"
          v-if="['fixed', 'IF', 'ELSE'].includes(item.type)"
        >
          <div class="input-group">
            <span class="ifText" v-if="item.type == 'IF'">IF</span>
            <span class="elseText" v-if="item.type == 'ELSE'">ELSE IF</span>
            <a-select
              class="left-select"
              @change="setCondition($event, item, 1)"
              placeholder="选择拆分对象"
            >
              <a-select-opt-group v-if="!['IF', 'ELSE'].includes(item.type)">
                <span slot="label">BU/SubBU</span>
                <a-select-option value="1&&BU">BU</a-select-option>
                <a-select-option value="1&&SubBU">SubBU</a-select-option>
              </a-select-opt-group>
              <a-select-opt-group>
                <span slot="label">Property</span>
                <a-select-option value="2&&Scale">Scale</a-select-option>
                <a-select-option value="2&&Property1">Property1</a-select-option>
                <a-select-option value="2&&Property2">Property2</a-select-option>
                <a-select-option value="2&&Property3">Property3</a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
          <a-select
            v-model="item.compareOperation"
            class="symbol"
            @change="handleChangeSymbol"
          >
            <a-select-option
              v-for="item in symbolOptions"
              :key="item.value"
              :value="item.value"
              :disabled="!isEdit"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <div class="input-group">
            <a-input-group compact>
              <a-select style="width: 100px" v-model="item.rightOperatorExpression.type">
                <a-select-option :value="1">固定值</a-select-option>
                <a-select-option v-if="!['IF', 'ELSE'].includes(item.type)" :value="2">公式</a-select-option>
              </a-select>
              <a-input
                v-model="item.rightOperatorExpression.value"
                class="selectCondition"
                placeholder="请选择"
              />
            </a-input-group>
          </div>
          <a-icon
            v-show="!['IF', 'ELSE'].includes(item.type)"
            class="deleteBtn"
            type="delete"
            @click="deleteCondition(item.id)"
          />
        </div>
        <!-- <div class="condition-select" v-if="item.type === 'symbol'">
          <a-select v-model="item.formulaRelation" style="width: 120px">
            <a-select-option
              v-for="item in operatorOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-icon
            v-show="isEdit"
            class="deleteBtn"
            type="delete"
            @click="deleteCondition(item.id)"
          />
        </div> -->
        <div
          class="group"
          v-if="['IF', 'ELSE'].includes(item.type)"
        >
          <div
            class="group-box"
          >
            <div class="group-line"></div>
            <div class="group-content">
              <rule-blocks
                v-on="$listeners"
                :group-list="item"
                :isEdit="isEdit"
                type="children"
              />
            </div>
          </div>
          <!-- <a-icon
            v-show="isEdit"
            class="deleteBtn"
            type="delete"
            @click="deleteCondition(item.id)"
          /> -->
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
  import { operatorOptions, symbolOptions } from './config'
  import { randomUUID } from '@/utils/util'
  export default {
    name: 'rule-blocks',
    props: {
      // 单个组件的数据结构
      groupList: {
        type: Object,
        default: () => {
          return {
            id: `${randomUUID(10)}`,
            tierIndex: 1,
            Then: [],
          }
        },
      },
      // 用于判断是不是显示删除条件组
      type: {
        type: String,
        default: '',
      },
      isEdit: {
        type: Boolean,
      },
    },
    data() {
      return {
        operatorOptions,
        symbolOptions,
        visible: false, // 复合选择器
        condition: {
          conditionId: null,
          conditionType: null, // 1：左值表达式 2：右值表达式
        },
      }
    },
    methods: {
      // 选择条件值表达式
      onSelectExpression(value, item, type) {
        this.condition.conditionId = item.id
        this.condition.conditionType = type
        console.log(value, item, type)
        // let Obj =
        //   type === 1 ? item.leftOperatorExpression : item.rightOperatorExpression;
        // this.$refs.selector.open(Obj);
      },
      // 修改条件符号
      handleChangeSymbol(e) {
        console.log(e)
      },
      setCondition(val, item, type) {
        let obj = val.split('&&')
        // 设置选择的条件值
        this.condition.conditionId = item.id
        this.condition.conditionType = type
        this.$emit('setCondition', { type: obj[0], value: obj[1] }, this.groupList.tierIndex, this.groupList.id, this.condition)
      },
      addCondition(type) {
        // 添加条件或条件组
        console.log('groupList', this.groupList)
        console.log('添加条件或条件组', this.groupList.tierIndex, this.groupList.id, type)
        this.$emit('addCondition', this.groupList.tierIndex, this.groupList.id, type)
      },
      deleteCondition(conditionId) {
        // 删除条件
        this.$emit('deleteCondition', this.groupList.tierIndex, this.groupList.id, conditionId)
      },
      getGroup() {
        console.log(this.groupList)
        console.log(JSON.stringify(this.groupList))
      },
    },
    components: {},
  }
</script>

<style lang="less">
.col {
  padding: 11px 20px;
  .toolbar {
    position: relative;
    display: flex;
    align-items: center;
    .thenText {
      margin-left: 10px;
      font-size: 20px;
      font-weight: 500;
    }
    .toolbtn {
      margin-left: 10px;
    }
  }
  .condition-item {
    position: relative;
    margin-top: 10px;
    min-height: 30px;
    line-height: 30px;
    &.has-line:not(:last-child)::before {
      content: '';
      display: block;
      position: absolute;
      top: 15px;
      left: -10px;
      height: calc(100% + 10px);
      border-left: 2px solid #4379e8;
    }
    &.has-line:first-child {
      &::before {
        content: '';
        display: block;
        position: absolute;
        left: -10px;
        top: 15px;
        height: calc(50% + 12px);
        border-left: 2px solid #4379e8;
      }
    }
    .line {
      &::before {
        content: '';
        display: block;
        width: 10px;
        height: 2px;
        background: #4379e8;
        position: absolute;
        left: -10px;
        top: 15px;
      }
    }
    .input-inline {
      display: inline-block;
      width: 280px;
      margin-right: 10px;
      vertical-align: bottom;
    }
    .input-group {
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 10px;
      display: inline-block;
      .left-select {
        width: 200px;
      }
      .ifText {
        margin-left: 15px;
        font-size: 18px;
        font-weight: 500;
        margin-right: 10px;
      }
      .elseText {
        margin-left: 15px;
        font-size: 18px;
        font-weight: 500;
        margin-right: 10px;
      }
    }
    .selectCondition {
      width: 240px;
    }
    .OperatorType {
      width: 110px;
      margin-right: 10px;
    }
    .symbol {
      width: 120px;
      margin-right: 10px;
    }
    .describe {
      width: 240px;
    }
    .deleteBtn {
      margin-left: 10px;
      cursor: pointer;
      color: red;
    }
    .group {
      display: flex;
      align-items: center;
    }
    .group-box {
      position: relative;
      margin-left: 15px;
      // border: 1px solid gainsboro;
      border-radius: 10px;
      width: calc(100% - 50px);
      display: inline-block;
      &.has-line:not(:last-child)::before {
        content: '';
        display: block;
        position: absolute;
        left: -11px;
        height: calc(50%);
        border-left: 2px solid #4379e8;
      }
      &.has-line.frist-group::before {
        content: '';
        display: block;
        position: absolute;
        left: -11px;
        height: calc(50%);
        border-left: 2px solid #fff;
      }
      &.has-line > .group-line {
        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 2px;
          background: #4379e8;
          position: absolute;
          left: -11px;
          top: 50%;
        }
      }
    }
  }
}
</style>
<template>
	<rule-blocks
    v-if="groupList"
    :isEdit="isEdit"
    @addCondition="addCondition(arguments, groupList)"
    @deleteCondition="deleteCondition(arguments, groupList)"
    @setCondition="setCondition(arguments, groupList)"
    :group-list="groupList"
  />
</template>

<script>
  import ruleBlocks from './ruleBlocks'
  import { randomUUID } from '@/utils/util';
  export default {
    name: "rule",
    data() {
      return {
      }
    },
    props: {
      ActivityID: {
        type: String,
        default: ''
      },
      groupList: {
        type: Object
        // required: true
      },
      isEdit: { // 是否为编辑， true 可编辑 false 不可编辑
        type: Boolean,
        default: true
      }
    },
    methods: {
      // 添加条件或条件组或逻辑符号
      addCondition (args, groupList) { // index 为层级
        const [index, id, type] = args
        console.log('添加条件或条件组或逻辑符号', args, groupList)
        if (groupList.tierIndex === index && groupList.id === id) {
          if (type === 'fixed') {
            groupList.Then.push({
              ActivityID: this.ActivityID,
	            id: `${randomUUID(10)}`,
	            type: 'fixed',
              leftOperatorExpression: undefined,
              compareOperation: '=',
              rightOperatorExpression: {type: 1, value: ''},
              // describe: ''
            })
          } else if (type === 'THEN') {
            groupList.Then.push({
              id: `${randomUUID(10)}`,
              type: 'THEN',
              tierIndex: index + 1,
              Then: []
            })
          }
          // } else if (type === 'symbol') {
          //   groupList.Then.push({
          //     id: `${randomUUID(10)}`,
          //     type: 'symbol',
          //     formulaRelation: 'and'
          //   })
          // }
        } else {
          for (let i = 0; i < groupList.Then.length; i++) {
            if (['IF', 'ELSE'].includes(groupList.Then[i].type)) {
              this.addCondition(args, groupList.Then[i]);
            }
          }
        }
        return groupList
      },
      // 删除条件
      deleteCondition (args, groupList) {
        const [index, id, conditionId] = args
        console.log('删除条件', args, groupList)
        if (groupList.tierIndex === index && groupList.id === id) {
          groupList.Then = groupList.Then.filter(item => {
            return item.id !== conditionId
          })
        } else {
          for (let i = 0; i < groupList.Then.length; i++) {
            if (['IF', 'ELSE'].includes(groupList.Then[i].type)) {
              this.deleteCondition(args, groupList.Then[i]);
            }
          }
        }
        return groupList
      },
      // 设置选择的条件值
      setCondition(args, groupList) {
        const [val, index, id, condition] = args
        console.log('设置选择的条件值',args, groupList)
        if (groupList.tierIndex === index && groupList.id === id) {
          groupList.Then.forEach(item => {
            if (item.id === condition.conditionId) {
              if (condition.conditionType === 1) {
                // item.leftOperatorExpression = val
                this.$set(item, 'leftOperatorExpression', val)
              } else if (condition.conditionType === 2) {
                // item.rightOperatorExpression = val
                this.$set(item, 'rightOperatorExpression', val)
              }
            }
          })
        } else {
          for (let i = 0; i < groupList.Then.length; i++) {
            if (['IF', 'ELSE'].includes(groupList.Then[i].type)) {
              this.setCondition(args, groupList.Then[i]);
            }
          }
        }
        return groupList
      }
    },
    components: {
      ruleBlocks
    }
  }
</script>

<style lang="less" scoped>
</style>
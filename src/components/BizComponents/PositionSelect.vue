<template>
  <common-select-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import CommonSelectComponent from './CommonSelectComponent'

  export default {
    name: 'PositionSelect',
    components: { CommonSelectComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '职务',
          displayKey: 'name',
          returnKeys: ['id'],          
          basePort: 'admin',
          listUrl: '/v1/masterdata/position/queryPageList',
          queryParamCode: 'name',
          queryParamText: '职务名称',
          columns: [
            { title: '职务名称', dataIndex: 'name', align: 'center', width: '50%', widthRight: '70%' },            
            { title: '描述', dataIndex: 'description', align: 'center', width: '35%' }
          ]
        }
      }
    },
    computed: {
      configs() {
        return Object.assign({ value: this.value }, this.settings, this.$attrs)
      }
    }
  }
</script>

<style lang="less" scoped></style>
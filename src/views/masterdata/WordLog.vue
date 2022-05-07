
<template>
  <div>
    <vxe-table
      ref="vxeTable"
      size="small"
      border
      show-overflow
      row-id="ID"
      :row-config="{ isHover: true }"
      :data="tableList"
      :radio-config="{ trigger: 'row' }"
    >
      <vxe-column field="FileName" align="center" width="400" title="FileName"></vxe-column>
      <vxe-column field="InnerText" title="Modification Content"></vxe-column>
      <vxe-column field="Author" width="120" title="Modifier"></vxe-column>
      <vxe-column field="UpdateTime" width="300" title="Modification time" :formatter="formatDate"></vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import axios from 'axios'   
import XEUtils from 'xe-utils'
export default {
  name: 'WordLog',
  data() {
    return {
      tableList: [],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatDate({ cellValue }, format) {
      return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
    },
    getList() {
      axios.post('http://123.56.242.202:8080/api/User/GetWordLog').then((res) => {
        this.tableList = res.data;




      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>

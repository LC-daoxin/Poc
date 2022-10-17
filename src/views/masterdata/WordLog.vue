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
      <vxe-column type="seq" title="FileName" width="400" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="OnloadFile(row)">{{ row.FileName }}</vxe-button>
        </template>
      </vxe-column>
      <vxe-column field="InnerText" title="Modification Content"></vxe-column>
      <vxe-column field="Author" width="120" title="Modifier"></vxe-column>
      <vxe-column field="UpdateTime" width="300" title="Modification time" :formatter="formatDate"></vxe-column>
    </vxe-table>
    <vxe-modal v-model="showDetails" title="File" width="1200" height="800" resize>
      <template #default>
        <div class="Generate">
          <iframe
            v-if="iframeShow"
            sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-downloads"
            id="Generate"
            :src="url"
            class="iframe"
          />
        </div>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import XEUtils from 'xe-utils'

export default {
  name: 'WordLog',
  data() {
    return {
      showDetails: false,
      tableList: [],
      url: '/static/SelectOnlineEditing.html',
      iframeShow: true
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
      axios.post('http://47.103.127.217:8080/api/User/GetWordLog').then(res => {
        this.tableList = res.data
      })
    },
    OnloadFile(row) {
      axios.post('http://47.103.127.217:8080//api/Contract/GetFile?fileName=' + row.FileName).then(res => {
        debugger
        this.tableList = res.data
        var name = res.data.IP + '/default/' + row.FileName
        this.showDetails = true
        this.iframeShow = false
        this.$nextTick(() => {
          this.iframeShow = true
        })
        setTimeout(() => {
          document.getElementById('Generate').contentWindow.postMessage(
            {
              name
            },
            '*'
          )
        }, 500)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Generate {
  height: calc(100vh);
  padding: 0 0 30px;
}
.iframe {
  margin: 20px 0;
  border: none;
  width: 95%;
  height: 100%;
  margin-left: 2.5%;
}
</style>

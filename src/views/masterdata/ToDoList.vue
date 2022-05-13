
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <a-select allowClear :disabled="ActivityLoading" v-model="Template" @change="changeApprove" style="width: 15%">
          <a-select-option value="">Pending approval</a-select-option>
          <a-select-option value="true">Approved</a-select-option>
        </a-select>
      </template>
    </vxe-toolbar>
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
      <vxe-column field="ProjectID" width="180" title="ProjectID"></vxe-column>
      <vxe-column field="ProjectName" width="300" title="ProjectName"></vxe-column>
      <vxe-column field="FileName" width="350" title="FileName"></vxe-column>
      <vxe-column field="CreateDate" width="160" title="CreateDate"></vxe-column>
      <vxe-column field="CreateUser" width="140" title="CreateUser"></vxe-column>
      <vxe-column field="ApproveStatus" width="200" title="ApproveStatus"></vxe-column>

      <vxe-column type="seq" title="Operation" width="200" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="ViewFile(row)">View File</vxe-button>
          <vxe-button @click="Approved(row)">Approved</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-modal v-model="showDetails" title="File Information" width="1200" height="800" resize>
      <template #default>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="Document content" name="first">
            <div class="Generate">
              <iframe
                v-if="iframeShow"
                sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-downloads"
                id="Generate"
                :src="url"
                class="iframe"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Adjustment record" name="second">
            <vxe-table
              ref="vxeTable"
              size="small"
              border
              show-overflow
              row-id="ID"
              :row-config="{ isHover: true }"
              :data="tableFileList"
              :radio-config="{ trigger: 'row' }"
            >
              <vxe-column field="FileName" title="FileName"></vxe-column>
              <vxe-column field="InnerText" title="Modification Content"></vxe-column>
              <vxe-column field="Author" width="120" title="Modifier"></vxe-column>
              <vxe-column field="UpdateTime" width="300" title="Modification time" :formatter="formatDate"></vxe-column>
            </vxe-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </vxe-modal>
  </div>
</template>


<script>
import _ from 'lodash'
import axios from 'axios'
import XEUtils from 'xe-utils'

export default {
  name: 'ToDoList',
  data() {
    return {
      showDetails: false,
      currentRow: {},
      title: '',
      formData: {},
      selectRow: {},
      //模板数据
      tableList: [],
      tableFileList: [],
      searchKey: '',
      //部门数据
      depList: [],
      url: '/static/SelectOnlineEditing.html',
      iframeShow: true,
      selectFileName: '',
      Template: '',
      activeName: 'first',
    }
  },
  mounted() {
    this.getList('')
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 'second') {
        axios.post('http://localhost:44372//api/user/GetByWordNameLog?fileName=' + this.selectFileName).then((res) => {
          this.tableFileList = res.data
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
        })
      }
    },
    formatDate({ cellValue }, format) {
      return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
    },
    getDepName(id) {
      let name = ''
      for (var item of this.depList) {
        if (item.ID == id) {
          name = item.DepartName
          break
        }
      }
      return name
    },
    changeApprove(val) {
      this.getList(val)
    },
    search() {
      this.getList(this.searchKey)
    },
    ViewFile(row) {
      debugger
      var name = row.IP + '/default/' + row.FileName
      this.showDetails = true
      this.iframeShow = false
      this.selectFileName = row.FileName
      axios.post('http://localhost:44372//api/user/GetByWordNameLog?fileName=' + row.FileName).then((res) => {
        this.tableFileList = res.data
        setTimeout(() => {
          this.$refs.vxeTable.setAllTreeExpand(true)
        }, 200)
      })
      this.$nextTick(() => {
        this.iframeShow = true
      })
      setTimeout(() => {
        document.getElementById('Generate').contentWindow.postMessage(
          {
            name,
          },
          '*'
        )
      }, 500)
    },
    getList(val) {
      var user = JSON.parse(sessionStorage.getItem('LoginUser'))
      axios.post('http://localhost:44372//api/user/ToDoList?userID=' + user.UserID + '&approve=' + val).then((res) => {
        this.tableList = res.data
        setTimeout(() => {
          this.$refs.vxeTable.setAllTreeExpand(true)
        }, 200)
      })
    },
    Approved(row) {
      this.$XModal.confirm('Are you sure you want to approve?','Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' }).then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
          axios
            .post('http://localhost:44372//api/user/Approve?fileName=' + row.FileName + '&batchID=' + row.BatchID)
            .then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Approval succeeded', status: 'success' })
                this.getList()
              } else {
                this.$XModal.message({ content: 'Approval failed:' + res.data.Message, status: 'error' })
              }
            })
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.Generate {
  height: calc(100vh);
  padding: 0 0 30px;
}
.processCenter {
  .ant-form-item {
    width: calc(25% - 16px);
  }
  margin-bottom: 10px;
}
.iframe {
  margin: 20px 0;
  border: none;
  width: 95%;
  height: 100%;
  margin-left: 2.5%;
}
</style>

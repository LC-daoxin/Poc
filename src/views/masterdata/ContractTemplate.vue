<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <!-- <vxe-input v-model="searchKey" placeholder="模板名称"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button> -->
        <vxe-button status="primary" icon="fa vxe-icon--plus" @click="add">Add</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--edit-outline" @click="edit">Edit</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--close" @click="del">Delete</vxe-button>
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
      <vxe-column type="radio" align="center" width="80" title=" "></vxe-column>
      <vxe-column field="Name" width="700" title="Name"></vxe-column>
      <vxe-column field="TempDesc" width="220" title="TempDesc"></vxe-column>
      <vxe-column field="URL" title="Document Address"></vxe-column>
      <vxe-column type="seq" title="Operation" width="200" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="ViewFile(row)">View Template</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="600" height="230" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="Name" field="Name" span="12">
            <template #default>
              <vxe-input v-model="formData.Name" placeholder="Please enter Name"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TempDesc" field="TempDesc" span="12">
            <template #default>
              <vxe-input v-model="formData.TempDesc" placeholder="Please enter TempDesc"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Document Address" field="URL" span="24">
            <template #default>
              <vxe-input v-model="formData.URL" placeholder="Please enter URL"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">Save</vxe-button>
              <vxe-button type="button" @click="close">Close</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
    <vxe-modal v-model="showDetails" title="Template" width="1200" height="800" resize>
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
import axios from 'axios'
import XEUtils from 'xe-utils'
export default {
  name: 'ContractTemplate',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //模板数据
      tableList: [],
      searchKey: '',
      //部门数据
      depList: [],
      url: '/static/SelectOnlineEditing.html',
      showDetails: false,
      iframeShow: true
    }
  },

  mounted() {
    this.getList('')
    this.getDepList('')
  },
  methods: {
    getDepList(name) {
      axios.post('http://47.103.127.217:8080/api/User/GetDepartmentInfo?departmentName=' + name).then(res => {
        this.arrayToTree(res.data, 'ID', 'ParentID', this.depList)
      })
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

    arrayToTree(data, id, pid, data2) {
      if (!data || !data.length) return []
      var targetData = [] //存储数据的容器(返回)
      var records = {}
      var itemLength = data.length //数据集合的个数
      for (var i = 0; i < itemLength; i++) {
        var o = data[i]
        records[o[id]] = o
      }
      for (var i = 0; i < itemLength; i++) {
        var currentData = data[i]
        var parentData = records[currentData[pid]]
        if (!parentData) {
          currentData['prefix'] = '|--'
          //alert(currentData["name"]);
          data2.push(currentData)
          currentData['DepartName'] = currentData['prefix'] + currentData['DepartName']
          targetData.push(currentData)
          continue
        }

        currentData['prefix'] = parentData['prefix'] + '|--'
        //alert(currentData["prefix"]);
        parentData.children = parentData.children || []
        parentData.children.push(currentData)
        currentData['DepartName'] = currentData['prefix'] + currentData['DepartName']
        data2.push(currentData)
      }
      return targetData
    },
    search() {
      this.getList(this.searchKey)
    },
    ViewFile(row) {
      debugger
      var name = 'Template/' + row.Name
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
      }, 200)
    },
    add() {
      this.title = 'Add Template'
      this.open = true
      this.formData = {}
    },
    edit() {
      var checked = this.$refs.vxeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to modify', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = 'Modify Template'
      this.open = true
    },
    del() {
      var checked = this.$refs.vxeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to delete', status: 'warning' })
        return
      }
      this.$XModal
        .confirm('Are you sure to delete?', 'Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            axios
              .post('http://47.103.127.217:8080/api/BaseData/ProposalInstanceDelete?instanceID=' + checked.ID)
              .then(res => {
                this.$XModal.close('loding')
                if (res.data.Code == 200) {
                  this.$XModal.message({ content: 'Deleted successfully', status: 'success' })
                  this.open = false
                  this.getList('')
                } else {
                  this.$XModal.message({ content: 'Delete failed' + res.data.Message, status: 'error' })
                }
              })
          }
        })
    },
    save() {
      this.$XModal
        .confirm('Are you sure to save?', 'Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            if (this.formData.ID == null) {
              axios
                .post('http://47.103.127.217:8080/api/BaseData/ProposalInstanceCreate', [this.formData])
                .then(res => {
                  this.$XModal.close('loding')
                  if (res.data.Code == 200) {
                    this.$XModal.message({ content: 'Added successfully', status: 'success' })
                    this.open = false
                    this.getList('')
                  } else {
                    this.$XModal.message({ content: 'Add failed:' + res.data.Message, status: 'error' })
                  }
                })
            } else {
              axios
                .post('http://47.103.127.217:8080/api/BaseData/ProposalInstanceUpdate', [this.formData])
                .then(res => {
                  this.$XModal.close('loding')
                  if (res.data.Code == 200) {
                    this.$XModal.message({ content: 'Modified successfully', status: 'success' })
                    this.open = false
                    this.getList('')
                  } else {
                    this.$XModal.message({ content: 'Modification failed:' + res.data.Message, status: 'error' })
                  }
                })
            }
          }
        })
    },
    close() {
      this.open = false
    },
    getList(name) {
      axios
        .post('http://47.103.127.217:8080/api/BaseData/GetProposalInstance?departmentID=&userName=' + name)
        .then(res => {
          this.tableList = res.data
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
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

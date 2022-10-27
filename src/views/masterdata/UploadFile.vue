<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <el-upload
          action=""
          class="avatar-uploader"
          ref="upload"
          :show-file-list="false"
          :limit="1"
          :http-request="uploadCover"
        >
          <el-button size="small" type="primary" :loading="upLoading">点击上传</el-button>
        </el-upload>
      </template>
    </vxe-toolbar>
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
          <!-- <el-tab-pane label="Adjustment record" name="second" style="display: :none;">
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
          </el-tab-pane> -->
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
  name: 'UploadFile',
  data() {
    return {
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],

      showDetails: false,
      showDetailsCN: false,
      showDetails11: false,
      title: '',
      formData: {},
      selectRow: {},
      //模板数据
      tableList: [],
      tableFileList: [],
      selectFileName: '',
      searchKey: '',
      //部门数据
      depList: [],
      url: '/static/SelectOnlineEditing.html',
      activeName: 'first',
      iframeShow: true,
      Template: ''
    }
  },
  mounted() {
    this.getList('')
    this.getDepList('')
  },
  methods: {
    uploadCover(params) {
      this.upLoading = true
      // 在这里进行一系列的校验
      const formData = new FormData()
      formData.append('Files', params.file)
      axios
        .post('http://47.103.127.217:8080/api/Contract/ProcessRequest', formData, {
          'Content-type': 'multipart/form-data'
        })
        .then(res => {
          debugger
          var name = res.data
          this.showDetails = true
          this.iframeShow = false
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
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
        })
    },

    getDepList(name) {
      axios
        .post(
          'http://47.103.127.217:8080/api/Contract/GetContractListProposal?fileName=' +
            name +
            '&approve=' +
            this.Template
        )
        .then(res => {
          this.arrayToTree(res.data, 'ID', 'ParentID', this.depList)
        })
    },
    handleClick(tab, event) {
      if (tab.name == 'second') {
        axios.post('http://47.103.127.217:8080/api/user/GetByWordNameLog?fileName=' + this.selectFileName).then(res => {
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
    Approved(row) {
      this.$XModal
        .confirm('Are you sure you want to approve?', 'Message prompt', {
          cancelButtonText: 'cancel',
          confirmButtonText: 'sure'
        })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            axios.post('http://47.103.127.217:8080/api/user/ApproveContract?&batchID=' + row.BatchID).then(res => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Approval succeeded', status: 'success' })
                this.getList('')
              } else {
                this.$XModal.message({ content: 'Approval failed:' + res.data.Message, status: 'error' })
              }
            })
          }
        })
    },

    changeApprove() {
      this.getList('')
    },
    SelectProposal(name, row) {
      name = row.ProposalFileNameIP + '/default/' + name
      this.showDetails11 = true
      this.iframeShow = false
      this.selectFileName = row.ProposalFileName
      axios.post('http://47.103.127.217:8080/api/user/GetByWordNameLog?fileName=' + row.FileName).then(res => {
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
            name
          },
          '*'
        )
      }, 200)
    },
    SelectContract(name, row) {
      name = row.ContractFileNameIP + '/default/' + name

      this.showDetails11 = true
      this.iframeShow = false
      this.selectFileName = row.ContractFileName

      axios.post('http://47.103.127.217:8080/api/user/GetByWordNameLog?fileName=' + row.ContractFileName).then(res => {
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
            name
          },
          '*'
        )
      }, 200)
    },
    handleUpload() {
      alert(123)
      this.$refs.UploadDialog.openDialog()
    },
    SelectContract1(name, row) {
      debugger
      name = row.ProposalFileNameIP + '/default/' + name

      if (row.Status == 'Not generated') {
        this.$XModal.message({
          content: 'This contract has not been generated and cannot be viewed',
          status: 'warning'
        })
        return
      }

      if (row.ProposalFileName.indexOf('EN') == -1) {
        this.$XModal.message({
          content: 'This data has only one file.',
          status: 'warning'
        })
        return
      }
      this.showDetails11 = true
      this.iframeShow = false
      this.selectFileName = row.ContractFileName

      axios.post('http://47.103.127.217:8080/api/user/GetByWordNameLog?fileName=' + row.ProposalFileName).then(res => {
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
            name
          },
          '*'
        )
      }, 300)
    },

    showDetailEvent(row) {
      this.formData = {}

      if (row.Status == 'Generated') {
        this.$XModal.message({
          content: 'This contract has been generated and cannot be generated again.',
          status: 'warning'
        })
        return
      }
      var user = JSON.parse(sessionStorage.getItem('LoginUser'))

      if (row.ProposalFileName.indexOf('EN') != -1) {
        axios.post('http://47.103.127.217:8080/api/Contract/GetMasterData').then(res => {
          this.selectRow = row
          this.showDetails = true
          this.formData.BatchID = row.BatchID
          this.formData.CompanyName = res.data[0].CorporateName
          this.formData.ClientName = res.data[0].ClientName
          this.formData.Address = res.data[0].FullAddress
          this.formData.Organization = res.data[0].Organization
          this.formData.Email = res.data[0].ClientEmail
          this.formData.CreateUser = user.UserID
          this.formData.ClientTitle = res.data[0].ProjectName
        })
      } else {
        axios.post('http://47.103.127.217:8080/api/Contract/GetMasterData').then(res => {
          debugger
          this.selectRow = row
          this.showDetailsCN = true
          this.formData.BatchID = row.BatchID
          this.formData.Client = res.data[0].ClientNameCN
          this.formData.ProjectName = res.data[0].ProjectNameCN
          this.formData.ClientName = res.data[0].ClientName
          this.formData.ClientAddress = res.data[0].FullAddress
          this.formData.CreateUser = user.UserID

          this.formData.ClientPhone = res.data[0].ClientPhone
          this.formData.ClientEmail = res.data[0].ClientEmail
          this.formData.TrusteeEmail = res.data[0].TechnicalContractCN
          this.formData.Trustee = '无锡药明生物技术股份有限公司'
          this.formData.TrusteeName = 'Li Lei'
          this.formData.ClientTelephone = '0512-81879000'
          this.formData.TrusteeTelephone = '4008200985'
          this.formData.TrusteePhone = '13777777777'
          this.formData.TrusteeAddress = '中国（上海）自由贸易试验区意威路31弄2号厂房'
        })

        return
      }
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
    close() {
      this.showDetails = false
      this.showDetailsCN = false
    },
    getList(name) {
      axios
        .post(
          'http://47.103.127.217:8080/api/Contract/GetContractListProposal?fileName=' +
            name +
            '&approve=' +
            this.Template
        )
        .then(res => {
          this.tableList = res.data
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
        })
    },

    save() {
      this.$XModal
        .confirm('Are you sure to save?', 'Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })

            axios.post('http://47.103.127.217:8080/api/Contract/DataContractCreate', [this.formData]).then(res => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Generated successfully', status: 'success' })
                this.showDetails = false
                this.showDetailsCN = false

                this.getList('')
              } else {
                this.$XModal.message({ content: 'Build failed:' + res.data.Message, status: 'error' })
              }
            })
          }
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

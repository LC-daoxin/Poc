
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <a-select allowClear :disabled="ActivityLoading" v-model="Template" @change="changeApprove" style="width: 13%">
          <a-select-option value="">Not generated</a-select-option>
          <a-select-option value="true">Generated</a-select-option>
        </a-select>
        &nbsp;
        <vxe-input v-model="searchKey" placeholder="FileName"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">Search</vxe-button>
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
      <vxe-column field="ProjectID" width="100" title="ProjectID"></vxe-column>
      <vxe-column field="ProjectName" width="180" title="ProjectName"></vxe-column>
      <vxe-column field="ProposalFileName" width="330" title="ProposalFileName"></vxe-column>
      <vxe-column field="ContractFileName" width="230" title="ContractFileName"></vxe-column>
      <vxe-column field="CreateDate" width="160" title="CreateDate"></vxe-column>
      <vxe-column field="UserName" width="100" title="CreateUser"></vxe-column>
      <vxe-column field="Status" width="80" title="Status"></vxe-column>

      <vxe-column type="seq" title="Operation" width="600" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="showDetailEvent(row)">Generate Contract{{ row.batchID }}</vxe-button>
          <vxe-button @click="Approved(row)">Submit</vxe-button>
          <vxe-button @click="SelectProposal(row.ProposalFileName, row)">View Proposal{{ row.batchID }}</vxe-button>
          <vxe-button @click="SelectContract(row.ContractFileName, row)">View Contract{{ row.batchID }}</vxe-button>
          <!-- <vxe-button @click="SelectContract1(row.ProposalFileName, row)"
            >View Contract Proposal{{ row.batchID }}</vxe-button
          > -->
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="showDetails" title="English contract information" width="700" height="600" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="200">
          <vxe-form-item title="CompanyName" field="CompanyName" span="16">
            <template #default>
              <vxe-input v-model="formData.CompanyName" placeholder="Please enter the CompanyName"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Address" field="Address" span="16">
            <template #default>
              <vxe-input v-model="formData.Address" placeholder="Please enter the Address"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Postal Code" field="PostalCode" span="16">
            <template #default>
              <vxe-input v-model="formData.PostalCode" placeholder="Please enter the Postal Code"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Organization" field="Organization" span="16">
            <template #default>
              <vxe-input v-model="formData.Organization" placeholder="Please enter the Organization"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Email" field="Email" span="16">
            <template #default>
              <vxe-input v-model="formData.Email" placeholder="Please enter the Email"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientName" field="ClientName" span="16">
            <template #default>
              <vxe-input v-model="formData.ClientName" placeholder="Please enter ClientName"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientTitle" field="ClientTitle" span="16">
            <template #default>
              <vxe-input v-model="formData.ClientTitle" placeholder="Please enter the ClientTitle"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientBy" field="ClientBy" span="16">
            <template #default>
              <vxe-input v-model="formData.ClientBy" placeholder="Please enter the ClientBy"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Payment Date" field="PaymentDate" span="16">
            <template #default>
              <vxe-select v-model="formData.PaymentDate" placeholder="Payment Date" clearable>
                <vxe-option value="within 30 days" label="within 30 days"></vxe-option>
                <vxe-option value="other formats" label="other formats"></vxe-option>
              </vxe-select>
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

    <vxe-modal v-model="showDetailsCN" title="Chinese contract information" width="1100" height="650" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="ProjectName" field="ProjectName" span="20">
            <template #default>
              <vxe-input v-model="formData.ProjectName" placeholder="Please enter the project name"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Client" field="Client" span="10">
            <template #default>
              <vxe-input v-model="formData.Client" placeholder="Please enter the Client"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Trustee" field="Trustee" span="10">
            <template #default>
              <vxe-input v-model="formData.Trustee" placeholder="Please enter the Trustee"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="BeginDate" field="BeginDate" span="10">
            <vxe-input v-model="formData.BeginDate" placeholder="Please enter the BeginDate" type="date"></vxe-input>
          </vxe-form-item>
          <vxe-form-item title="EndDate" field="EndDate" span="10">
            <vxe-input v-model="formData.EndDate" placeholder="Please enter the EndDate" type="date"></vxe-input>
          </vxe-form-item>

          <vxe-form-item title="ClientName" field="ClientName" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientName" placeholder="Please enter the ClientName"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TrusteeName" field="TrusteeName" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeName" placeholder="Please enter the TrusteeName"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientTelephone" field="ClientTelephone" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientTelephone" placeholder="Please enter the ClientTelephone"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TrusteeTelephone" field="TrusteeTelephone" span="10">
            <template #default>
              <vxe-input
                v-model="formData.TrusteeTelephone"
                placeholder="Please enter the TrusteeTelephone"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientPhone" field="ClientPhone" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientPhone" placeholder="Please enter the ClientPhone"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TrusteePhone" field="TrusteePhone" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteePhone" placeholder="Please enter the TrusteePhone"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientEmail" field="ClientEmail" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientEmail" placeholder="Please enter the ClientEmail"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TrusteeEmail" field="TrusteeEmail" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeEmail" placeholder="Please enter the TrusteeEmail"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientAddress" field="ClientAddress" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientAddress" placeholder="Please enter the Client Address"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TrusteeAddress" field="TrusteeAddress" span="10">
            <template #default>
              <vxe-input
                v-model="formData.TrusteeAddress"
                placeholder="Please enter the mailing address of the entrusted party"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Total expenses (RMB)" field="Total" span="10">
            <template #default>
              <vxe-input v-model="formData.Total" placeholder="Please enter the total fee (RMB)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Project start-up funds" field="StartUpFunds" span="10">
            <template #default>
              <vxe-input
                v-model="formData.StartUpFunds"
                placeholder="Please enter the project start-up fund"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="One time material cost" field="OneFee" span="10">
            <template #default>
              <vxe-input v-model="formData.OneFee" placeholder="Please enter the total fee (RMB)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Filler cost" field="FillerCost" span="10">
            <template #default>
              <vxe-input v-model="formData.FillerCost" placeholder="Please enter the filling fee"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">Generate</vxe-button>
              <vxe-button type="button" @click="close">Cancel</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>

    <vxe-modal v-model="showDetails11" title="File Information" width="1200" height="800" resize>
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
  name: 'Proposal',
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
      Template: '',
    }
  },
  mounted() {
    this.getList('')
    this.getDepList('')
  },
  methods: {
    getDepList(name) {
      axios
        .post(
          'http://123.56.242.202:8080/api/Contract/GetContractListProposal?fileName=' +
            name +
            '&approve=' +
            this.Template
        )
        .then((res) => {
          this.arrayToTree(res.data, 'ID', 'ParentID', this.depList)
        })
    },
    handleClick(tab, event) {
      if (tab.name == 'second') {
        axios
          .post('http://123.56.242.202:8080//api/user/GetByWordNameLog?fileName=' + this.selectFileName)
          .then((res) => {
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
          confirmButtonText: 'sure',
        })
        .then((type) => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            axios.post('http://123.56.242.202:8080/api/user/ApproveContract?&batchID=' + row.BatchID).then((res) => {
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
      axios.post('http://123.56.242.202:8080//api/user/GetByWordNameLog?fileName=' + row.FileName).then((res) => {
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
    SelectContract(name, row) {
      name = row.ContractFileNameIP + '/default/' + name

      this.showDetails11 = true
      this.iframeShow = false
      this.selectFileName = row.ContractFileName

      axios
        .post('http://123.56.242.202:8080//api/user/GetByWordNameLog?fileName=' + row.ContractFileName)
        .then((res) => {
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
    SelectContract1(name, row) {
      debugger
      name = row.ProposalFileNameIP + '/default/' + name

      if (row.Status == 'Not generated') {
        this.$XModal.message({
          content: 'This contract has not been generated and cannot be viewed',
          status: 'warning',
        })
        return
      }

      if (row.ProposalFileName.indexOf('EN') == -1) {
        this.$XModal.message({
          content: 'This data has only one file.',
          status: 'warning',
        })
        return
      }
      this.showDetails11 = true
      this.iframeShow = false
      this.selectFileName = row.ContractFileName

      axios
        .post('http://123.56.242.202:8080//api/user/GetByWordNameLog?fileName=' + row.ProposalFileName)
        .then((res) => {
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

    showDetailEvent(row) {
      this.formData = {}

      if (row.Status == 'Generated') {
        this.$XModal.message({
          content: 'This contract has been generated and cannot be generated again.',
          status: 'warning',
        })
        return
      }
      var user = JSON.parse(sessionStorage.getItem('LoginUser'))

      if (row.ProposalFileName.indexOf('EN') != -1) {
        axios.post('http://123.56.242.202:8080//api/Contract/GetMasterData').then((res) => {
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
        axios.post('http://123.56.242.202:8080//api/Contract/GetMasterData').then((res) => {
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
          'http://123.56.242.202:8080//api/Contract/GetContractListProposal?fileName=' +
            name +
            '&approve=' +
            this.Template
        )
        .then((res) => {
          this.tableList = res.data
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
        })
    },

    save() {
      this.$XModal
        .confirm('Are you sure to save?', 'Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' })
        .then((type) => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })

            axios.post('http://123.56.242.202:8080//api/Contract/DataContractCreate', [this.formData]).then((res) => {
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
    },
  },
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

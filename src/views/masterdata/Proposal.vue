
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
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
      <vxe-column field="ProjectID" width="180" title="ProjectID"></vxe-column>
      <vxe-column field="ProjectName" width="180" title="ProjectName"></vxe-column>
      <vxe-column field="ProposalFileName" width="180" title="ProposalFileName"></vxe-column>
      <vxe-column field="ContractFileName" width="180" title="ContractFileName"></vxe-column>
      <vxe-column field="CreateDate" width="160" title="CreateDate"></vxe-column>
      <vxe-column field="UserName" width="120" title="CreateUser"></vxe-column>
      <vxe-column field="Status" width="80" title="Status"></vxe-column>

      <vxe-column type="seq" title="Operation" width="400" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="showDetailEvent(row)">Generate Contract{{ row.batchID }}</vxe-button>
          <vxe-button @click="SelectProposal(row.ProposalFileName, row)">View Proposal{{ row.batchID }}</vxe-button>
          <vxe-button @click="SelectContract(row.ContractFileName, row)">View Contract{{ row.batchID }}</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="showDetails" title="English contract information" width="600" height="440" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="Name" field="Name" span="16">
            <template #default>
              <vxe-input v-model="formData.Name" placeholder="Please enter Name"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Client" field="Client" span="16">
            <template #default>
              <vxe-input v-model="formData.Client" placeholder="Please enter Client"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Title" field="Title" span="16">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="Please enter Title"></vxe-input>
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

    <vxe-modal v-model="showDetailsCN" title="中文合同信息" width="1100" height="600" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="项目名称" field="ProjectName" span="20">
            <template #default>
              <vxe-input v-model="formData.ProjectName" placeholder="请输入项目名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户（委托方）" field="Client" span="10">
            <template #default>
              <vxe-input v-model="formData.Client" placeholder="请输入客户（委托方）"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="研究开发方（受托方）" field="Trustee" span="10">
            <template #default>
              <vxe-input v-model="formData.Trustee" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="合同开始日期" field="BeginDate" span="10">
            <vxe-input v-model="formData.BeginDate" placeholder="合同开始日期" type="date"></vxe-input>
          </vxe-form-item>
          <vxe-form-item title="合同结束日期" field="EndDate" span="10">
            <vxe-input v-model="formData.EndDate" placeholder="合同结束日期" type="date"></vxe-input>
          </vxe-form-item>

          <vxe-form-item title="姓名" field="ClientName" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientName" placeholder="请输入委托方项目姓名"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="姓名" field="TrusteeName" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeName" placeholder="请输入受托方项目姓名"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作电话" field="ClientTelephone" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientTelephone" placeholder="请输入委托方项目工作电话"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作电话" field="TrusteeTelephone" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeTelephone" placeholder="请输入受托方项目工作电话"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机" field="ClientPhone" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientPhone" placeholder="请输入委托方项目手机"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机" field="TrusteePhone" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteePhone" placeholder="请输入受托方项目手机"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Email" field="ClientEmail" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientEmail" placeholder="请输入委托方项目Email"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Email" field="TrusteeEmail" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeEmail" placeholder="请输入受托方项目Email"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="通信地址" field="ClientAddress" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientAddress" placeholder="请输入委托方项目通信地址"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="通信地址" field="TrusteeAddress" span="10">
            <template #default>
              <vxe-input v-model="formData.TrusteeAddress" placeholder="请输入受托方项目通信地址"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="费用总额（人民币）" field="Total" span="10">
            <template #default>
              <vxe-input v-model="formData.Total" placeholder="请输入费用总额（人民币）"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="项目启动经费" field="StartUpFunds" span="10">
            <template #default>
              <vxe-input v-model="formData.StartUpFunds" placeholder="请输入项目启动经费"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="一次性材料费用" field="OneFee" span="10">
            <template #default>
              <vxe-input v-model="formData.OneFee" placeholder="请输入费用总额（人民币）"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="填料费用" field="FillerCost" span="10">
            <template #default>
              <vxe-input v-model="formData.FillerCost" placeholder="请输入填料费用"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">生成</vxe-button>
              <vxe-button type="button" @click="close">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>

    <vxe-modal v-model="showDetails11" title="File Information" width="1200" height="800" resize>
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
      searchKey: '',
      //部门数据
      depList: [],
      url: '/static/SelectOnlineEditing.html',
      iframeShow: true,
    }
  },
  mounted() {
    this.getList('')
    this.getDepList('')
  },
  methods: {
    getDepList(name) {
      axios.post('http://123.56.242.202:8080/api/Contract/GetContractList?fileName=' + name).then((res) => {
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
    SelectProposal(name, row) {
      name = row.ProposalFileNameIP + '/default/' + name
      this.showDetails11 = true
      this.iframeShow = false
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

      if (row.Status == '未生成') {
        this.$XModal.message({ content: 'This contract has not been generated and cannot be viewed', status: 'warning' })
        return
      }
      this.showDetails11 = true
      this.iframeShow = false
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

      if (row.Status == '已生成') {
        this.$XModal.message({ content: 'This contract has been generated and cannot be generated again.', status: 'warning' })
        return
      }

      if (row.ProposalFileName.indexOf('EN') > 0) {
        this.selectRow = row
        this.showDetails = true
        this.formData.BatchID = row.BatchID
      } else {
        this.selectRow = row
        this.showDetailsCN = true
        this.formData.BatchID = row.BatchID
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
    },
    getList(name) {
      axios.post('http://123.56.242.202:8080/api/Contract/GetContractList?fileName=' + name).then((res) => {
        this.tableList = res.data
        setTimeout(() => {
          this.$refs.vxeTable.setAllTreeExpand(true)
        }, 200)
      })
    },
    save() {
      this.$XModal.confirm('Are you sure to save?').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })

          axios.post('http://123.56.242.202:8080/api/Contract/DataContractCreate', [this.formData]).then((res) => {
            this.$XModal.close('loding')
            if (res.data.Code == 200) {
              this.$XModal.message({ content: 'Generated successfully', status: 'success' })
              this.showDetails = false
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

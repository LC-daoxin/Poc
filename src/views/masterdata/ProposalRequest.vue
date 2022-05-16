
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
      <vxe-column field="ProjectID" width="180" title="ProjectID"></vxe-column>
      <vxe-column field="ProjectName" width="300" title="ProjectName"></vxe-column>
      <vxe-column field="CreateDate" width="160" title="CreateDate"></vxe-column>
      <vxe-column field="CreateUser" width="140" title="CreateUser"></vxe-column>
      <vxe-column field="ApproveStatus" width="200" title="ApproveStatus"></vxe-column>

      <vxe-column type="seq" title="Operation" width="200" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="ViewFile(row)">Details</vxe-button>

          <vxe-button @click="Approved(row)">Approved</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-modal v-model="showDetails" title="Proposal" width="1100" height="630" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="140">
          <vxe-form-item title="ProjectID" field="ProjectID" span="20">
            <template #default>
              <vxe-input v-model="formData.ProjectID"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectName(CN)" field="ProjectNameCN" span="10">
            <template #default>
              <vxe-input v-model="formData.ProjectNameCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectName" field="ProjectName" span="10">
            <template #default>
              <vxe-input v-model="formData.ProjectName"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CorporateName(CN)" field="CorporateNameCN" span="10">
            <template #default>
              <vxe-input v-model="formData.CorporateNameCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CorporateName" field="CorporateName" span="10">
            <template #default>
              <vxe-input v-model="formData.CorporateName"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientName(CN)" field="ClientNameCN" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientNameCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientName" field="ClientName" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientName"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="FullAddress(CN)" field="FullAddressCN" span="10">
            <template #default>
              <vxe-input v-model="formData.FullAddressCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="FullAddress" field="FullAddress" span="10">
            <template #default>
              <vxe-input v-model="formData.FullAddress"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="TechnicalContract(CN)" field="TechnicalContractCN" span="10">
            <template #default>
              <vxe-input v-model="formData.TechnicalContractCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="TechnicalContract" field="TechnicalContract" span="10">
            <template #default>
              <vxe-input v-model="formData.TechnicalContract"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="BusinessContract(CN)" field="BusinessContractCN" span="10">
            <template #default>
              <vxe-input v-model="formData.BusinessContractCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="BusinessContract" field="BusinessContract" span="10">
            <template #default>
              <vxe-input v-model="formData.BusinessContract"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CustomerService(CN)" field="CustomerServiceCN" span="10">
            <template #default>
              <vxe-input v-model="formData.CustomerServiceCN"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CustomerService" field="CustomerService" span="10">
            <template #default>
              <vxe-input v-model="formData.CustomerService"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Organization" field="Organization" span="10">
            <template #default>
              <vxe-input v-model="formData.Organization"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientEmail" field="ClientEmail" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientEmail"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ClientPhone" field="ClientPhone" span="10">
            <template #default>
              <vxe-input v-model="formData.ClientPhone"></vxe-input>
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
  </div>
</template>


<script>
import _ from 'lodash'
import axios from 'axios'
import XEUtils from 'xe-utils'
export default {
  name: 'ProposalRequest',
  data() {
    return {
      showDetails: false,
      currentRow: {},
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
      Template: '',
    }
  },
  mounted() {
    this.getList('')
  },
  methods: {
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
      this.showDetails = true
      this.formData.MasterID = row.MasterID
      this.formData.ProjectID = row.ProjectID
      this.formData.ProjectNameCN = row.ProjectNameCN
      this.formData.ProjectName = row.ProjectName
      this.formData.CorporateNameCN = row.CorporateNameCN
      this.formData.CorporateName = row.CorporateName
      this.formData.ClientNameCN = row.ClientNameCN
      this.formData.ClientName = row.ClientName
      this.formData.OrganizationCN = row.OrganizationCN
      this.formData.Organization = row.Organization
      this.formData.FullAddressCN = row.FullAddressCN
      this.formData.FullAddress = row.FullAddress
      this.formData.ClientEmail = row.ClientEmail
      this.formData.ClientPhone = row.ClientPhone
      this.formData.TechnicalContractCN = row.TechnicalContractCN
      this.formData.TechnicalContract = row.TechnicalContract
      this.formData.BusinessContractCN = row.BusinessContractCN
      this.formData.BusinessContract = row.BusinessContract
      this.formData.CustomerServiceCN = row.CustomerServiceCN
      this.formData.CustomerService = row.CustomerService
    },
    getList(val) {
      var user = JSON.parse(sessionStorage.getItem('LoginUser'))
      axios.post('http://123.56.242.202:8080//api/user/GetMasterData?projectName=&corporateName=').then((res) => {
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
            axios.post('http://123.56.242.202:8080//api/BaseData/MasterDataUpdate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Modified successfully', status: 'success' })
                this.showDetails = false
                this.getList('', '')
              } else {
                this.$XModal.message({ content: 'Modification failed:' + res.data.Message, status: 'error' })
              }
            })
          }
        })
    },
    close() {
      this.showDetails = false
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
            axios.post('http://123.56.242.202:8080//api/user/MasterDataUpdate?masterID=' + row.MasterID).then((res) => {
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

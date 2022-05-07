
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchData.projectName" placeholder="ProjectName (Chinese)"></vxe-input>
        &nbsp;
        <vxe-input v-model="searchData.corporateName" placeholder="CorporateName (Chinese)"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">Search</vxe-button>
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
      :data="dataList"
      :radio-config="{ trigger: 'row' }"
    >
      <vxe-column type="radio" align="center" width="80" title=" "></vxe-column>
      <vxe-column field="ProjectNameCN" width="130" title="ProjectName (Chinese)"></vxe-column>
      <vxe-column field="ProjectName" width="130" title="ProjectName"></vxe-column>
      <vxe-column field="CorporateNameCN" width="130" title="CorporateName (Chinese)"></vxe-column>
      <vxe-column field="CorporateName" width="130" title="CorporateName"></vxe-column>
      <vxe-column field="OrganizationCN" width="100" title="Organization"></vxe-column>
      <vxe-column field="ProjectID" width="80" title="ProjectID"></vxe-column>
      <vxe-column field="ClientNameCN" width="130" title="ClientName (Chinese)"></vxe-column>
      <vxe-column field="ClientName" width="100" title="ClientName"></vxe-column>
      <vxe-column field="OrganizationCN" width="130" title="Organization (Chinese)"></vxe-column>
      <vxe-column field="Organization" width="100" title="Organization"></vxe-column>
      <vxe-column field="FullAddressCN" width="100" title="FullAddress (Chinese)"></vxe-column>
      <vxe-column field="FullAddress" width="80" title="FullAddress"></vxe-column>
      <vxe-column field="ClientEmail" width="100" title="ClientEmail"></vxe-column>
      <vxe-column field="ClientPhone" width="100" title="ClientPhone"></vxe-column>
      <vxe-column field="TechnicalContractCN" width="130" title="TechnicalContract (Chinese)"></vxe-column>
      <vxe-column field="TechnicalContract" width="110" title="TechnicalContract"></vxe-column>
      <vxe-column field="BusinessContractCN" width="130" title="BusinessContract (Chinese)"></vxe-column>
      <vxe-column field="BusinessContract" width="110" title="BusinessContract"></vxe-column>
      <vxe-column field="CustomerServiceCN" width="110" title="CustomerServiceCN (Chinese)"></vxe-column>
      <vxe-column field="CustomerService" width="80" title="CustomerService"></vxe-column>
      <vxe-column field="DateIssued" width="100" title="DateIssued"></vxe-column>
      <vxe-column field="ValidTo" width="100" title="ValidTo"></vxe-column>
      <vxe-column field="Version" width="80" title="Version"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="1000" height="650" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="ProjectName (Chinese)" field="ProjectNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectNameCN" placeholder="Please enter the (Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectName(英文)" field="ProjectName" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectName" placeholder="Please enter the ProjectName"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CorporateName (Chinese)" field="CorporateNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.CorporateNameCN" placeholder="Please enter the CorporateName(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CorporateName" field="CorporateName" span="12">
            <template #default>
              <vxe-input v-model="formData.CorporateName" placeholder="Please enter the CorporateName"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectID" field="ProjectID" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectID" placeholder="Please enter the ProjectID"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientName (Chinese)" field="ClientNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientNameCN" placeholder="Please enter the ClientName(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientName" field="ClientName" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientName" placeholder="Please enter the ClientName"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Organization (Chinese)" field="OrganizationCN" span="12">
            <template #default>
              <vxe-input v-model="formData.OrganizationCN" placeholder="Please enter the Organization(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Organization" field="Organization" span="12">
            <template #default>
              <vxe-input v-model="formData.Organization" placeholder="Please enter the Organization"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="FullAddress (Chinese)" field="FullAddressCN" span="12">
            <template #default>
              <vxe-input v-model="formData.FullAddressCN" placeholder="Please enter the FullAddress(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="FullAddress" field="FullAddress" span="12">
            <template #default>
              <vxe-input v-model="formData.FullAddress" placeholder="Please enter the FullAddress"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientEmail" field="ClientEmail" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientEmail" placeholder="Please enter the ClientEmail"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ClientPhone" field="ClientPhone" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientPhone" placeholder="Please enter the ClientPhone"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="TechnicalContract (Chinese)" field="TechnicalContractCN" span="12">
            <template #default>
              <vxe-input v-model="formData.TechnicalContractCN" placeholder="Please enter the TechnicalContract(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="TechnicalContract" field="TechnicalContract" span="12">
            <template #default>
              <vxe-input v-model="formData.TechnicalContract" placeholder="Please enter the TechnicalContract"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="BusinessContract (Chinese)" field="BusinessContractCN" span="12">
            <template #default>
              <vxe-input v-model="formData.BusinessContractCN" placeholder="Please enter the BusinessContract (Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="BusinessContract" field="BusinessContract" span="12">
            <template #default>
              <vxe-input v-model="formData.BusinessContract" placeholder="Please enter the BusinessContract"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CustomerService (Chinese)" field="CustomerServiceCN" span="12">
            <template #default>
              <vxe-input v-model="formData.CustomerServiceCN" placeholder="Please enter the CustomerService(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="CustomerService" field="CustomerService" span="12">
            <template #default>
              <vxe-input v-model="formData.CustomerService" placeholder="Please enter the CustomerService"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="DateIssued" field="DateIssued" span="12">
            <template #default>
              <vxe-input v-model="formData.DateIssued" placeholder="Please enter the release date" type="date"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ValidTo" field="ValidTo" span="12">
            <template #default>
              <vxe-input v-model="formData.ValidTo" placeholder="Please enter a valid date" type="date"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Version" field="Version" span="12">
            <template #default>
              <vxe-input v-model="formData.Version" placeholder="Please enter version"></vxe-input>
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
import axios from 'axios'
import XEUtils from 'xe-utils'
export default {
  name: 'MasterBase',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //用户数据
      dataList: [],
      searchData: { projectName: '', corporateName: '' },
    }
  },
  mounted() {
    this.getList('', '')
  },
  methods: {
    formatDate({ cellValue }, format) {
      return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
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
      this.getList(this.searchData.projectName, this.searchData.corporateName)
    },
    add() {
      this.title = 'New user'
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
      this.title = 'Modify user'
      this.open = true
    },
    del() {
      var checked = this.$refs.vxeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to delete', status: 'warning' })
        return
      }
      this.$XModal.confirm('Are you sure to delete?').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
          axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataDelete?MasterID=' + checked.MasterID).then((res) => {
            this.$XModal.close('loding')
            if (res.data.Code == 200) {
              this.$XModal.message({ content: 'Deleted successfully', status: 'success' })
              this.open = false
              this.getList('', '')
            } else {
              this.$XModal.message({ content: 'Delete failed' + res.data.Message, status: 'error' })
            }
          })
        }
      })
    },
    save() {
      this.$XModal.confirm('Are you sure to save?').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
          if (this.formData.MasterID == null) {
            axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataCreate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Added successfully', status: 'success' })
                this.open = false
                this.getList('', '')
              } else {
                this.$XModal.message({ content: 'Add failed:' + res.data.Message, status: 'error' })
              }
            })
          } else {
            axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataUpdate',[this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Modified successfully', status: 'success' })
                this.open = false
                this.getList('', '')
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
    getList(projectName, corporateName) {
      axios
        .post(
          'http://123.56.242.202:8080/api/BaseData/GetMasterData?projectName=' +
            projectName +
            '&corporateName= ' +
            corporateName
        )
        .then((res) => {
          this.dataList = res.data
        })
    },
  },
}
</script>
<style lang="less" scoped>
</style>


<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchData.projectName" placeholder="项目名称(中文)"></vxe-input>
        &nbsp;
        <vxe-input v-model="searchData.corporateName" placeholder="公司名称(中文)"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--plus" @click="add">添加</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--edit-outline" @click="edit">编辑</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--close" @click="del">删除</vxe-button>
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
      <vxe-column type="radio" align="center" width="80" title="序号"></vxe-column>
      <vxe-column field="ProjectNameCN" width="130" title="项目名称(中文)"></vxe-column>
      <vxe-column field="ProjectName" width="130" title="项目名称(英文)"></vxe-column>
      <vxe-column field="CorporateNameCN" width="130" title="公司名称(中文)"></vxe-column>
      <vxe-column field="CorporateName" width="130" title="公司名称(英文)"></vxe-column>
      <vxe-column field="OrganizationCN" width="100" title="公司名称"></vxe-column>
      <vxe-column field="ProjectID" width="80" title="项目ID"></vxe-column>
      <vxe-column field="ClientNameCN" width="130" title="客户名称(中文)"></vxe-column>
      <vxe-column field="ClientName" width="100" title="客户名称"></vxe-column>
      <vxe-column field="OrganizationCN" width="130" title="组织名称(中文)"></vxe-column>
      <vxe-column field="Organization" width="100" title="组织名称"></vxe-column>
      <vxe-column field="FullAddressCN" width="100" title="地址(中文)"></vxe-column>
      <vxe-column field="FullAddress" width="80" title="地址"></vxe-column>
      <vxe-column field="ClientEmail" width="100" title="客户邮箱"></vxe-column>
      <vxe-column field="ClientPhone" width="100" title="客户电话"></vxe-column>
      <vxe-column field="TechnicalContractCN" width="130" title="技术信息(中文)"></vxe-column>
      <vxe-column field="TechnicalContract" width="110" title="技术信息"></vxe-column>
      <vxe-column field="BusinessContractCN" width="130" title="业务信息(中文)"></vxe-column>
      <vxe-column field="BusinessContract" width="110" title="业务信息"></vxe-column>
      <vxe-column field="CustomerServiceCN" width="110" title="联系人(中文)"></vxe-column>
      <vxe-column field="CustomerService" width="80" title="联系人"></vxe-column>
      <vxe-column field="DateIssued" width="100" title="发布日期"></vxe-column>
      <vxe-column field="ValidTo" width="100" title="有效日期"></vxe-column>
      <vxe-column field="Version" width="80" title="版本"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="1000" height="650" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="项目名称(中文)" field="ProjectNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectNameCN" placeholder="请输入项目名称(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="项目名称(英文)" field="ProjectName" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectName" placeholder="请输入项目名称(英文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="公司名称(中文)" field="CorporateNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.CorporateNameCN" placeholder="请输入公司名称(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="公司名称" field="CorporateName" span="12">
            <template #default>
              <vxe-input v-model="formData.CorporateName" placeholder="请输入公司名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="项目ID" field="ProjectID" span="12">
            <template #default>
              <vxe-input v-model="formData.ProjectID" placeholder="项目ID"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户名称(中文)" field="ClientNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientNameCN" placeholder="请输入客户名称(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户名称" field="ClientName" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientName" placeholder="请输入客户名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="组织名称(中文)" field="OrganizationCN" span="12">
            <template #default>
              <vxe-input v-model="formData.OrganizationCN" placeholder="请输入组织名称(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="组织名称" field="Organization" span="12">
            <template #default>
              <vxe-input v-model="formData.Organization" placeholder="请输入组织名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="地址(中文)" field="FullAddressCN" span="12">
            <template #default>
              <vxe-input v-model="formData.FullAddressCN" placeholder="请输入地址(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="地址" field="FullAddress" span="12">
            <template #default>
              <vxe-input v-model="formData.FullAddress" placeholder="地址"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户邮箱" field="ClientEmail" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientEmail" placeholder="请输入客户邮箱"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户电话" field="ClientPhone" span="12">
            <template #default>
              <vxe-input v-model="formData.ClientPhone" placeholder="请输入客户电话"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="技术信息(中文)" field="TechnicalContractCN" span="12">
            <template #default>
              <vxe-input v-model="formData.TechnicalContractCN" placeholder="请输入技术信息(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="技术信息" field="TechnicalContract" span="12">
            <template #default>
              <vxe-input v-model="formData.TechnicalContract" placeholder="请输入技术信息"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="业务信息(中文)" field="BusinessContractCN" span="12">
            <template #default>
              <vxe-input v-model="formData.BusinessContractCN" placeholder="请输入业务信息(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="业务信息" field="BusinessContract" span="12">
            <template #default>
              <vxe-input v-model="formData.BusinessContract" placeholder="请输入业务信息"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="联系人(中文)" field="CustomerServiceCN" span="12">
            <template #default>
              <vxe-input v-model="formData.CustomerServiceCN" placeholder="请输入联系人(中文)"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="联系人" field="CustomerService" span="12">
            <template #default>
              <vxe-input v-model="formData.CustomerService" placeholder="请输入联系人"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="发布日期" field="DateIssued" span="12">
            <template #default>
              <vxe-input v-model="formData.DateIssued" placeholder="请输入发布日期" type="date"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="有效日期" field="ValidTo" span="12">
            <template #default>
              <vxe-input v-model="formData.ValidTo" placeholder="请输入有效日期" type="date"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="版本" field="Version" span="12">
            <template #default>
              <vxe-input v-model="formData.Version" placeholder="请输入版本"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">保存</vxe-button>
              <vxe-button type="button" @click="close">取消</vxe-button>
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
      this.title = '新增用户'
      this.open = true
      this.formData = {}
    },
    edit() {
      var checked = this.$refs.vxeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要修改的数据', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = '修改用户'
      this.open = true
    },
    del() {
      var checked = this.$refs.vxeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要删除的数据', status: 'warning' })
        return
      }
      this.$XModal.confirm('确定删除？').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
          axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataDelete?MasterID=' + checked.MasterID).then((res) => {
            this.$XModal.close('loding')
            if (res.data.Code == 200) {
              this.$XModal.message({ content: '删除成功', status: 'success' })
              this.open = false
              this.getList('', '')
            } else {
              this.$XModal.message({ content: '删除失败' + res.data.Message, status: 'error' })
            }
          })
        }
      })
    },
    save() {
      this.$XModal.confirm('确定保存？').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
          debugger;
          if (this.formData.MasterID == null) {
            axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataCreate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '添加成功', status: 'success' })
                this.open = false
                this.getList('', '')
              } else {
                this.$XModal.message({ content: '添加失败：' + res.data.Message, status: 'error' })
              }
            })
          } else {
            axios.post('http://123.56.242.202:8080/api/BaseData/MasterDataUpdate',[this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '修改成功', status: 'success' })
                this.open = false
                this.getList('', '')
              } else {
                this.$XModal.message({ content: '修改失败：' + res.data.Message, status: 'error' })
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

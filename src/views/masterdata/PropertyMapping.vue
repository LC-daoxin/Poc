
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <!-- <vxe-input v-model="searchData.projectName" placeholder="项目名称(中文)"></vxe-input>
        <vxe-input v-model="searchData.corporateName" placeholder="公司名称(中文)"></vxe-input> -->
        <!-- <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button> -->
        <!-- <vxe-button status="primary" icon="fa vxe-icon--plus" @click="add">添加</vxe-button> -->
        <vxe-button status="primary" icon="fa vxe-icon--edit-outline" @click="edit">编辑</vxe-button>
        <!-- <vxe-button status="primary" icon="fa vxe-icon--close" @click="del">删除</vxe-button> -->
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
      <vxe-column field="MappingID" width="130" title="集合ID"></vxe-column>
      <vxe-column field="PropertyNum" width="130" title="属性编码"></vxe-column>
      <vxe-column field="PropertyName" width="130" title="属性名称"></vxe-column>
      <vxe-column field="PropertyDesc" width="130" title="属性排序"></vxe-column>
      <vxe-column field="PropertyType" width="100" title="属性类型"></vxe-column>
      <vxe-column field="CreateDate" width="80" title="创建时间"></vxe-column>
      <vxe-column field="CreateUser" width="130" title="创建用户"></vxe-column>
      <!-- <vxe-column field="IsDelete" width="130" title="是否删除"></vxe-column> -->
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="1000" height="250" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="属性编码" field="PropertyNum" span="12">
            <template #default>
              <vxe-input v-model="formData.PropertyNum" placeholder="请输入属性编码" readonly></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="属性名称" field="PropertyName" span="12">
            <template #default>
              <vxe-input v-model="formData.PropertyName" placeholder="请输入属性名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="类型排序" field="PropertyDesc" span="12">
            <template #default>
              <vxe-input v-model="formData.PropertyDesc" placeholder="请输入类型排序"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="属性类型" field="PropertyType" span="12">
            <template #default>
              <vxe-select v-model="formData.PropertyType" placeholder="请输入属性类型" clearable>
                <vxe-option value="String" label="String"></vxe-option>
                <vxe-option value="Int" label="Int"></vxe-option>
                <vxe-option value="Double" label="Double"></vxe-option>
                <vxe-option value="datetime" label="datetime"></vxe-option>
              </vxe-select>
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
  name: 'PropertyMapping',
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
      this.title = '修改属性'
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
          axios
            .post('http://123.56.242.202:8080/api/BaseData/MasterDataDelete?MasterID=' + checked.MasterID)
            .then((res) => {
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
          debugger
          if (this.formData.MappingID == null) {
            axios.post('http://123.56.242.202:8080/api/BaseData/PropertyMappingCreate', [this.formData]).then((res) => {
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
            axios.post('http://123.56.242.202:8080/api/BaseData/PropertyMappingUpdate', [this.formData]).then((res) => {
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
      axios.post('http://123.56.242.202:8080/api/BaseData/GetPropertyMapping').then((res) => {
        this.dataList = res.data
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>

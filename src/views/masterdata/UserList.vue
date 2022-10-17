<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchKey" placeholder="User name"></vxe-input>
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
      :data="userList"
      :radio-config="{ trigger: 'row' }"
    >
      <vxe-column type="radio" align="center" width="80" title=" "></vxe-column>
      <vxe-column field="DepartmentName" width="150" title="Organization"></vxe-column>
      <vxe-column field="UserName" width="180" title="UserName"></vxe-column>
      <vxe-column field="Sex" width="80" title="Sex"></vxe-column>
      <vxe-column field="Mobile" title="Mobile"></vxe-column>
      <vxe-column field="CreateTime" title="CreateTime" :formatter="formatDate"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="600" height="270" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="Organization" field="DepartmentID" span="24">
            <template #default>
              <vxe-select v-model="formData.DepartmentID" placeholder="Please select a department">
                <vxe-option
                  v-for="item in depList"
                  :key="item.ID"
                  :value="item.ID"
                  :label="item.DepartName"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="UserName" field="UserName" span="12">
            <template #default>
              <vxe-input v-model="formData.UserName" placeholder="Please enter user name"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Gender" field="Sex" span="12">
            <template #default>
              <vxe-select v-model="formData.Sex" placeholder="Please select gender" clearable>
                <vxe-option value="男" label="男"></vxe-option>
                <vxe-option value="女" label="女"></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Telephone" field="Mobile" span="24">
            <template #default>
              <vxe-input v-model="formData.Mobile" placeholder="Please enter the phone number"></vxe-input>
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
  name: 'UserList',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //用户数据
      userList: [],
      searchKey: '',
      //部门数据
      depList: []
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
      this.$XModal
        .confirm('Are you sure to delete?', 'Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            axios.post('http://47.103.127.217:8080/api/User/UserDelete?userID=' + checked.ID).then(res => {
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
            this.formData.DepartmentName = this.getDepName(this.formData.DepartmentID).replace(/\|\-\-/g, '')
            if (this.formData.ID == null) {
              axios.post('http://47.103.127.217:8080/api/User/UserCreate', [this.formData]).then(res => {
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
              axios.post('http://47.103.127.217:8080/api/User/UserUpdate', this.formData).then(res => {
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
      axios.post('http://47.103.127.217:8080/api/User/GetUserInfo?departmentID=&userName=' + name).then(res => {
        this.userList = res.data
        setTimeout(() => {
          this.$refs.vxeTable.setAllTreeExpand(true)
        }, 200)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

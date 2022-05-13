
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchKey" placeholder="Organization Name"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">Search</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--plus" @click="add">Add</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--edit-outline" @click="edit">Edit</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--close" @click="del">Delete</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="treeTable"
      size="small"
      border
      show-overflow
      row-id="ID"
      :row-config="{ isHover: true }"
      :data="depList"
      :radio-config="{ trigger: 'row' }"
      :tree-config="{ transform: true, rowField: 'ID', parentField: 'ParentID', expandAll: true }"
    >
      <vxe-column type="radio" align="center" width="80" title=" "></vxe-column>
      <vxe-column field="OrgCode" width="150" title="Organization Code" tree-node></vxe-column>
      <vxe-column field="DepartName" width="180" title="Organization Name"></vxe-column>
      <vxe-column field="Sort" width="80" title="Sort"></vxe-column>
      <vxe-column field="Description" title="Remarks"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="800" height="350" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="Organization Code" field="OrgCode" span="12">
            <template #default>
              <vxe-input v-model="formData.OrgCode" placeholder="Please enter the organization code"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Organization Name" field="DepartName" span="12">
            <template #default>
              <vxe-input v-model="formData.DepartName" placeholder="Please enter the organization name"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Sort" field="Sort" span="12">
            <template #default>
              <vxe-input v-model="formData.Sort" type="number" placeholder="Please enter the sort"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Remarks" field="Description" span="24">
            <template #default>
              <vxe-textarea v-model="formData.Description" placeholder="Please enter comments"></vxe-textarea>
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
export default {
  name: 'DeptList',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //组织数据
      depList: [],
      searchKey: '',
    }
  },
  mounted() {
    this.getList("")
  },
  methods: {
    search() {
      this.getList(this.searchKey)
    },
    add() {
      this.formData={};
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked != null) {
        this.formData.ParentID = checked.ID
      }
      this.title = 'New organization'
      this.open = true
    },
    edit() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to modify', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = 'Modify organization'
      this.open = true
    },
    del() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to delete', status: 'warning' })
        return
      }
      if (checked.children.length > 0) {
        this.$XModal.message({ content: 'The data to be deleted has sub organizations', status: 'warning' })
        return
      }
      this.$XModal.confirm('Are you sure to delete?','Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' }).then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
          axios.post('http://123.56.242.202:8080//api/User/DepartmentDelete?userID=' + checked.ID).then((res) => {
            this.$XModal.close('loding')
            if (res.data.Code == 200) {
              this.$XModal.message({ content: 'Deleted successfully', status: 'success' })
              this.open = false
              this.getList("")
            } else {
              this.$XModal.message({ content: 'Delete failed' + res.data.Message, status: 'error' })
            }
          })
        }
      })
    },
    save() {
      this.$XModal.confirm('Are you sure to save?','Message prompt', { cancelButtonText: 'cancel', confirmButtonText: 'sure' }).then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })

          if (this.formData.ID == null) {
            axios.post('http://123.56.242.202:8080//api/User/DepartmentCreate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Added successfully', status: 'success' })
                this.open = false
                this.getList("")
              } else {
                this.$XModal.message({ content: 'Add failed:' + res.data.Message, status: 'error' })
              }
            })
          } else {
            axios.post('http://123.56.242.202:8080//api/User/DepartmentUpdate', this.formData).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: 'Modified successfully', status: 'success' })
                this.open = false
                this.getList("")
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
      axios.post('http://123.56.242.202:8080//api/User/GetDepartmentInfo?departmentName='+name).then((res) => {
        this.depList = res.data
        setTimeout(() => {
          this.$refs.treeTable.setAllTreeExpand(true)
        }, 200)
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>


<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchKey" placeholder="部门名称"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--plus" @click="add">添加</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--edit-outline" @click="edit">编辑</vxe-button>
        <vxe-button status="primary" icon="fa vxe-icon--close" @click="del">删除</vxe-button>
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
      <vxe-column type="radio" align="center" width="80" title="序号"></vxe-column>
      <vxe-column field="OrgCode" width="150" title="部门编码" tree-node></vxe-column>
      <vxe-column field="DepartName" width="180" title="部门名称"></vxe-column>
      <vxe-column field="Sort" width="80" title="显示顺序"></vxe-column>
      <vxe-column field="Description" title="备注"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="600" height="310" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="部门编码" field="OrgCode" span="12">
            <template #default>
              <vxe-input v-model="formData.OrgCode" placeholder="请输入部门编码"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="部门名称" field="DepartName" span="12">
            <template #default>
              <vxe-input v-model="formData.DepartName" placeholder="请输入部门名称"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="显示顺序" field="Sort" span="12">
            <template #default>
              <vxe-input v-model="formData.Sort" type="number" placeholder="请输入显示顺序"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="备注" field="Description" span="24">
            <template #default>
              <vxe-textarea v-model="formData.Description" placeholder="请输入备注"></vxe-textarea>
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
export default {
  name: 'DeptList',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //部门数据
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
      this.title = '新增部门'
      this.open = true
    },
    edit() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要修改的数据', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = '修改部门'
      this.open = true
    },
    del() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要删除的数据', status: 'warning' })
        return
      }
      if (checked.children.length > 0) {
        this.$XModal.message({ content: '要删的数据还有子部门', status: 'warning' })
        return
      }
      this.$XModal.confirm('确定删除？').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
          axios.post('http://123.56.242.202:8080/api/User/DepartmentDelete?userID=' + checked.ID).then((res) => {
            this.$XModal.close('loding')
            if (res.data.Code == 200) {
              this.$XModal.message({ content: '删除成功', status: 'success' })
              this.open = false
              this.getList("")
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

          if (this.formData.ID == null) {
            axios.post('http://123.56.242.202:8080/api/User/DepartmentCreate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '添加成功', status: 'success' })
                this.open = false
                this.getList("")
              } else {
                this.$XModal.message({ content: '添加失败：' + res.data.Message, status: 'error' })
              }
            })
          } else {
            axios.post('http://123.56.242.202:8080/api/User/DepartmentUpdate', this.formData).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '修改成功', status: 'success' })
                this.open = false
                this.getList("")
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
    getList(name) {
      axios.post('http://123.56.242.202:8080/api/User/GetDepartmentInfo?departmentName='+name).then((res) => {
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

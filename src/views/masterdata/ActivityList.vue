<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <!-- <vxe-input v-model="searchKey" placeholder="节点名称"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button> -->
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
      row-id="TypeID"
      :row-config="{ isHover: true }"
      :data="actList"
      :radio-config="{ trigger: 'row' }"
      :tree-config="{ transform: true, rowField: 'TypeID', parentField: 'ParentID', expandAll: true }"
    >
      <vxe-column type="radio" align="center" width="80" title="序号"></vxe-column>
      <vxe-column field="ActivetName" width="180" title="节点名称" tree-node></vxe-column>
      <vxe-column field="Type" width="150" title="节点类型" :formatter="formatterSex"></vxe-column>
      <vxe-column field="Version" width="80" title="版本"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="600" height="230" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="节点名称" field="ActivetName" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivetName" placeholder="请输入节点名称"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="节点类型" field="Type" span="12">
            <template #default>
              <vxe-select v-model="formData.Type" placeholder="请选择节点类型" clearable>
                <vxe-option value="1" label="Project Type1"></vxe-option>
                <vxe-option value="2" label="Project Type2"></vxe-option>
                <vxe-option value="3" label="Pipeline"></vxe-option>
              </vxe-select>
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
export default {
  name: 'ActivityList',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //节点数据
      actList: [],
      searchKey: ''
    }
  },
  mounted() {
    this.getList('')
  },
  methods: {
    search() {
      this.getList(this.searchKey)
    },
    add() {
      this.formData = {}
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked != null) {
        this.formData.ParentID = checked.TypeID
      }
      this.title = '新增节点'
      this.open = true
    },
    edit() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要修改的数据', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = '修改节点'
      this.open = true
    },
    del() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: '请选择要删除的数据', status: 'warning' })
        return
      }
      if (checked.children.length > 0) {
        this.$XModal.message({ content: '要删的数据还有子节点', status: 'warning' })
        return
      }
      this.$XModal.confirm('确定删除？', 'Message prompt').then(type => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
          axios
            .post('http://47.103.127.217:8080/api/BaseData/ActivityTypeDelete?typeID=' + checked.TypeID)
            .then(res => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '删除成功', status: 'success' })
                this.open = false
                this.getList('')
              } else {
                this.$XModal.message({ content: '删除失败' + res.data.Message, status: 'error' })
              }
            })
        }
      })
    },
    save() {
      this.$XModal.confirm('确定保存？', 'Message prompt').then(type => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })

          if (this.formData.TypeID == null) {
            axios.post('http://47.103.127.217:8080/api/BaseData/ActivityTypeCreate', [this.formData]).then(res => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '添加成功', status: 'success' })
                this.open = false
                this.getList('')
              } else {
                this.$XModal.message({ content: '添加失败：' + res.data.Message, status: 'error' })
              }
            })
          } else {
            axios.post('http://47.103.127.217:8080/api/BaseData/ActivityTypeUpdate', [this.formData]).then(res => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '修改成功', status: 'success' })
                this.open = false
                this.getList('')
              } else {
                this.$XModal.message({ content: '修改失败：' + res.data.Message, status: 'error' })
              }
            })
          }
        }
      })
    },
    formatterSex({ cellValue }) {
      if (cellValue == '1') return 'Project Type1'
      if (cellValue == '2') return 'Project Type2'
      if (cellValue == '3') return 'Pipeline'
      return cellValue
    },
    close() {
      this.open = false
    },
    getList(name) {
      axios.post('http://47.103.127.217:8080/api/BaseData/GetActivityType?name=' + name).then(res => {
        this.actList = res.data
        for (var item of this.actList) {
          item.Type = item.Type + ''
        }
        setTimeout(() => {
          this.$refs.treeTable.setAllTreeExpand(true)
        }, 200)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

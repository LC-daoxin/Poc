<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <!-- <vxe-input v-model="searchKey" placeholder="节点名称"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button> -->
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
      :loading="loading"
      :column-config="{ resizable: true }"
      row-id="ActivityID"
      :row-config="{ isHover: true }"
      :data="actList"
      :radio-config="{ trigger: 'row' }"
      :tree-config="{ transform: true, rowField: 'ActivityID', parentField: 'ParentID', expandAll: true }"
    >
      <vxe-column type="radio" align="center" width="80" title=" "></vxe-column>
      <vxe-column field="ActivityName" width="320" title="ActivityName" tree-node></vxe-column>
      <vxe-column field="ActivityNameCN" width="200" title="ActivityName (Chinese)"></vxe-column>
      <vxe-column field="ActivityDesc" width="110" title="ActivityDesc"></vxe-column>
      <vxe-column field="ActivityDescCN" width="180" title="ActivityDesc (Chinese)"></vxe-column>
      <vxe-column field="ActivityShortName" width="120" title="ActivityShortName"></vxe-column>
      <vxe-column field="ActivityShortNameCN" width="150" title="ActivityShortName (Chinese)"></vxe-column>
      <vxe-column field="StageCN" width="150" title="Stage (Chinese)"></vxe-column>
      <vxe-column field="Stage" width="80" title="Stage"></vxe-column>
      <vxe-column field="Price" width="80" title="Price"></vxe-column>
      <vxe-column field="PriceMark" width="80" title="PriceMark"></vxe-column>
      <vxe-column field="PassThroughPrice" width="150" title="PassThroughPrice"></vxe-column>
      <vxe-column field="PassThroughPriceMark" width="150" title="PassThroughPriceMark"></vxe-column>
      <vxe-column field="StartTime" width="180" title="StartTime"></vxe-column>
      <vxe-column field="EndTime" width="80" title="EndTime"></vxe-column>
      <vxe-column field="Duration" width="140" title="Duration"></vxe-column>
      <vxe-column field="DisCount" width="80" title="DisCount"></vxe-column>
      <vxe-column field="Scale" width="80" title="Scale"></vxe-column>
      <vxe-column field="Property2" width="100" :title="Property.Property2"></vxe-column>
      <vxe-column field="Property3" width="100" :title="Property.Property3"></vxe-column>
      <vxe-column field="Property4" width="100" :title="Property.Property4"></vxe-column>
      <vxe-column field="Property5" width="100" :title="Property.Property5"></vxe-column>
      <vxe-column field="Property6" width="100" :title="Property.Property6"></vxe-column>
      <vxe-column field="Property7" width="100" :title="Property.Property7"></vxe-column>
      <vxe-column field="Sort" width="80" title="Sort"></vxe-column>
      <vxe-column field="Version" width="80" title="Version"></vxe-column>
    </vxe-table>

    <vxe-modal v-model="open" :title="title" width="1000" height="600" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="100">
          <!-- <vxe-form-item title="ActivityID" field="ActivityID" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityID" placeholder="请输入ActivityID"></vxe-input>
            </template>
          </vxe-form-item> -->
          <vxe-form-item title="ActivityName" field="ActivityName" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityName" placeholder="Please enter the ActivityName"> </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ActivityName (Chinese)" field="ActivityNameCN" span="12">
            <template #default>
              <vxe-input
                v-model="formData.ActivityNameCN"
                placeholder="Please enter the ActivityName(Chinese)"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ActivityDesc" field="ActivityDesc" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityDesc" placeholder="Please enter the ActivityDesc"> </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ActivityDesc (Chinese)" field="ActivityDescCN" span="12">
            <template #default>
              <vxe-input
                v-model="formData.ActivityDescCN"
                placeholder="Please enter the  ActivityDesc(Chinese)"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ActivityShortName" field="ActivityShortName" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityShortName" placeholder="Please enter the ActivityShortName">
              </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="ActivityShortName (Chinese)" field="ActivityShortNameCN" span="12">
            <template #default>
              <vxe-input
                v-model="formData.ActivityShortNameCN"
                placeholder="Please enter the ActivityShortName(Chinese)"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectID" field="ProjectID" span="12">
            <template #default>
              <vxe-select v-model="formData.ProjectID" placeholder="Please select">
                <vxe-option
                  v-for="item in projectList"
                  :key="item.MasterID"
                  :value="item.MasterID"
                  :label="item.ProjectName"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="PipelineModolID" field="PipelineModolID" span="12">
            <template #default>
              <vxe-select v-model="formData.PipelineModolID" placeholder="Please select">
                <vxe-option
                  v-for="item in activityList"
                  :key="item.TypeID"
                  :value="item.TypeID"
                  :label="item.ActivetName"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Stage (Chinese)" field="StageCN" span="12">
            <template #default>
              <vxe-input v-model="formData.StageCN" placeholder="Please enter the Stage(Chinese)"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Stage" field="Stage" span="12">
            <template #default>
              <vxe-input v-model="formData.Stage" placeholder="Please enter the Stage"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Price" field="Price" span="12">
            <template #default>
              <vxe-input v-model="formData.Price" placeholder="Please enter the Price"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="PriceMark" field="PriceMark" span="12">
            <template #default>
              <vxe-input v-model="formData.PriceMark" placeholder="Please enter the PriceMark"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="PassThroughPrice" field="PassThroughPrice" span="12">
            <template #default>
              <vxe-input
                v-model="formData.PassThroughPrice"
                placeholder="Please enter the PassThroughPrice"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="PassThroughPriceMark" field="PassThroughPriceMark" span="12">
            <template #default>
              <vxe-input
                v-model="formData.PassThroughPriceMark"
                placeholder="Please enter the PassThroughPriceMark"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="StartTime" field="StartTime" span="12">
            <template #default>
              <vxe-input
                v-model="formData.StartTime"
                placeholder="Please enter the start time"
                type="datetime"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="EndTime" field="EndTime" span="12">
            <template #default>
              <vxe-input v-model="formData.EndTime" placeholder="Please enter the EndTime" type="datetime"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Duration" field="Duration" span="12">
            <template #default>
              <vxe-input v-model="formData.Duration" placeholder="Please enter the Duration"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="DisCount" field="DisCount" span="12">
            <template #default>
              <vxe-input v-model="formData.DisCount" placeholder="Please enter the DisCount"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Scale" field="Scale" span="12">
            <template #default>
              <vxe-input v-model="formData.Scale" placeholder="Scale"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item :title="Property.Property2" field="Property2" span="12">
            <template #default>
              <vxe-input v-model="formData.Property2" placeholder="Property2"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property3" field="Property3" span="12">
            <template #default>
              <vxe-input v-model="formData.Property3" placeholder="Property3"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property4" field="Property4" span="12">
            <template #default>
              <vxe-input v-model="formData.Property4" placeholder="Property4"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property5" field="Property5" span="12">
            <template #default>
              <vxe-input v-model="formData.Property5" placeholder="Property5"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property6" field="Property6" span="12">
            <template #default>
              <vxe-input v-model="formData.Property6" placeholder="Property6"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property7" field="Property7" span="12">
            <template #default>
              <vxe-input v-model="formData.Property7" placeholder="Property7"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property8" field="Property8" span="12">
            <template #default>
              <vxe-input v-model="formData.Property8" placeholder="Property8"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property9" field="Property9" span="12">
            <template #default>
              <vxe-input v-model="formData.Property9" placeholder="Property9"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property10" field="Property10" span="12">
            <template #default>
              <vxe-input v-model="formData.Property10" placeholder="Property10"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property11" field="Property11" span="12">
            <template #default>
              <vxe-input v-model="formData.Property11" placeholder="Property11"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property12" field="Property12" span="12">
            <template #default>
              <vxe-input v-model="formData.Property12" placeholder="Property12"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property13" field="Property13" span="12">
            <template #default>
              <vxe-input v-model="formData.Property13" placeholder="Property13"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property14" field="Property14" span="12">
            <template #default>
              <vxe-input v-model="formData.Property14" placeholder="Property14"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property15" field="Property15" span="12">
            <template #default>
              <vxe-input v-model="formData.Property15" placeholder="Property15"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property16" field="Property16" span="12">
            <template #default>
              <vxe-input v-model="formData.Property16" placeholder="Property16"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property17" field="Property17" span="12">
            <template #default>
              <vxe-input v-model="formData.Property17" placeholder="Property17"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property18" field="Property18" span="12">
            <template #default>
              <vxe-input v-model="formData.Property18" placeholder="Property18"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property19" field="Property19" span="12">
            <template #default>
              <vxe-input v-model="formData.Property19" placeholder="Property19"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item :title="Property.Property20" field="Property20" span="12">
            <template #default>
              <vxe-input v-model="formData.Property20" placeholder="Property20"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Sort" field="Sort" span="12">
            <template #default>
              <vxe-input v-model="formData.Sort" placeholder="Sort"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Version" field="Version" span="12">
            <template #default>
              <vxe-input v-model="formData.Version" placeholder="Version"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="CreateDate" field="CreateDate" span="12">
            <template #default>
              <vxe-input v-model="formData.CreateDate" placeholder="CreateDate" type="datetime"></vxe-input>
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
  name: 'ActivityMapping',
  data() {
    return {
      open: false,
      loading: false,
      title: '',
      formData: {},
      //节点数据
      actList: [],
      searchKey: '',
      projectList: [],
      activityList: [],
      Property: {}
    }
  },
  mounted() {
    this.getList('')
    axios.post('http://47.103.127.217:8080/api/BaseData/GetMasterData?projectName=&corporateName=').then(res => {
      this.projectList = res.data
    })

    axios.post('http://47.103.127.217:8080/api/BaseData/GetActivityType?name=').then(res => {
      this.activityList = this.arrayToTree(res.data, 'TypeID', 'ParentID', [])
      this.activityList = this.getActTree(this.activityList)
    })
    // 获取属性列表
    axios.post('http://47.103.127.217:8080/api/BaseData/GetPropertyMapping').then(res => {
      console.log('PropertyList', res.data)
      res.data.forEach(item => {
        this.Property[item.PropertyNum] = item.PropertyName
      })
    })
  },
  methods: {
    getActTree(datas) {
      var dt = []
      for (var item of datas) {
        item.ActivetName = '|--' + item.ActivetName + '(' + this.formatterType(item.Type) + ')'
        dt.push(item)
        item.children = item.children == undefined ? [] : item.children
        for (var cd of item.children) {
          cd.ActivetName = '|--|--' + cd.ActivetName + '(' + this.formatterType(item.Type) + ')'
          dt.push(cd)
        }
      }
      console.log(dt)
      return dt
    },
    search() {
      this.getList(this.searchKey)
    },
    //将ID、ParentID这种数据格式转换为树格式
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
          //alert(currentData["name"]);
          data2.push(currentData)
          targetData.push(currentData)
          continue
        }
        //alert(currentData["prefix"]);
        parentData.children = parentData.children || []
        parentData.children.push(currentData)
        data2.push(currentData)
      }
      return targetData
    },

    add() {
      this.formData = {}
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked != null) {
        this.formData.ParentID = checked.ActivityID
      }
      this.title = 'New node'
      this.open = true
    },
    edit() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to modify', status: 'warning' })
        return
      }
      this.formData = checked
      this.title = 'Modify Activity Basic data'
      this.open = true
    },
    del() {
      var checked = this.$refs.treeTable.getRadioRecord()
      if (checked == null) {
        this.$XModal.message({ content: 'Please select the data to delete', status: 'warning' })
        return
      }
      if (checked.children.length > 0) {
        this.$XModal.message({ content: 'The data to be deleted has child nodes', status: 'warning' })
        return
      }
      this.$XModal
        .confirm({
          content: 'Are you sure to delete?',
          cancelButtonText: 'cancel',
          confirmButtonText: 'sure',
          title: 'Message prompt'
        })
        .then(type => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: 'Data processing...', status: 'loading' })
            axios
              .post('http://47.103.127.217:8080/api/BaseData/BaseDataDelete?baseDataID=' + checked.ActivityID)
              .then(res => {
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

            if (this.formData.ActivityID == null) {
              axios.post('http://47.103.127.217:8080/api/BaseData/BaseDataCreate', [this.formData]).then(res => {
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
              axios.post('http://47.103.127.217:8080/api/BaseData/BaseDataUpdate', [this.formData]).then(res => {
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
    formatterType(cellValue) {
      if (cellValue == '1') return 'Project Type1'
      if (cellValue == '2') return 'Project Type2'
      if (cellValue == '3') return 'Pipeline'
      return cellValue
    },
    close() {
      this.open = false
    },
    getList() {
      this.loading = true
      axios.post('http://47.103.127.217:8080/api/BaseData/GetBaseData').then(res => {
        this.actList = res.data
        this.loading = false
        setTimeout(() => {
          this.$refs.treeTable.setAllTreeExpand(true)
        }, 200)
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

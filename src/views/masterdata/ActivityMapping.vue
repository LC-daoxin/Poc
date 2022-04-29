
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
      row-id="ActivityID"
      :row-config="{ isHover: true }"
      :data="actList"
      :radio-config="{ trigger: 'row' }"
      :tree-config="{ transform: true, rowField: 'ActivityID', parentField: 'ParentID', expandAll: true }"
    >
      <vxe-column type="radio" align="center" width="80" title="序号"></vxe-column>
      <vxe-column field="ActivityName" width="120" title="工作项名称" tree-node></vxe-column>
      <vxe-column field="ActivityNameCN" width="150" title="工作项名称（中文）"></vxe-column>
      <vxe-column field="ActivityDesc" width="120" title="工作项描述"></vxe-column>
      <vxe-column field="ActivityDescCN" width="150" title="工作项描述（中文）"></vxe-column>
      <vxe-column field="ActivityShortName" width="120" title="工作项简介"></vxe-column>
      <vxe-column field="ActivityShortNameCN" width="150" title="工作项简介（中文）"></vxe-column>
      <vxe-column field="StageCN" width="150" title="阶段（中文）"></vxe-column>
      <vxe-column field="Stage" width="80" title="阶段"></vxe-column>
      <vxe-column field="Price" width="80" title="报价"></vxe-column>
      <vxe-column field="PriceMark" width="80" title="报价其他"></vxe-column>
      <vxe-column field="PassThroughPrice" width="120" title="耗价价格"></vxe-column>
      <vxe-column field="PassThroughPriceMark" width="150" title="耗价价格其他"></vxe-column>
      <vxe-column field="StartTime" width="80" title="开始时间"></vxe-column>
      <vxe-column field="EndTime" width="80" title="结束时间"></vxe-column>
      <vxe-column field="Duration" width="80" title="期间（人天）"></vxe-column>
      <vxe-column field="DisCount" width="80" title="DisCount"></vxe-column>
      <vxe-column field="Scale" width="80" title="Scale"></vxe-column>
      <vxe-column field="Property2" width="90" title="Property2"></vxe-column>
      <vxe-column field="Property3" width="90" title="Property3"></vxe-column>
      <vxe-column field="Property4" width="90" title="Property4"></vxe-column>
      <vxe-column field="Property5" width="90" title="Property5"></vxe-column>
      <vxe-column field="Property6" width="90" title="Property6"></vxe-column>
      <vxe-column field="Property7" width="90" title="Property7"></vxe-column>
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
          <vxe-form-item title="工作项名称" field="ActivityName" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityName" placeholder="请输入工作项名称"> </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作项名称（中文）" field="ActivityNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityNameCN" placeholder="请输入工作项名称（中文）"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作项描述" field="ActivityDesc" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityDesc" placeholder="请输入工作项描述"> </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作项描述（中文）" field="ActivityDescCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityDescCN" placeholder="请输入工作项描述（中文）"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作项简介" field="ActivityShortName" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityShortName" placeholder="请输入工作项简介"> </vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作项简介（中文）" field="ActivityShortNameCN" span="12">
            <template #default>
              <vxe-input v-model="formData.ActivityShortNameCN" placeholder="请输入工作项简介（中文）"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="ProjectID" field="ProjectID" span="12">
            <template #default>
              <vxe-select v-model="formData.ProjectID" placeholder="请选择">
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
              <vxe-select v-model="formData.PipelineModolID" placeholder="请选择">
                <vxe-option
                  v-for="item in activityList"
                  :key="item.TypeID"
                  :value="item.TypeID"
                  :label="item.ActivetName"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="阶段（中文）" field="StageCN" span="12">
            <template #default>
              <vxe-input v-model="formData.StageCN" placeholder="请输入阶段（中文）"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="阶段" field="Stage" span="12">
            <template #default>
              <vxe-input v-model="formData.Stage" placeholder="请输入阶段"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="报价" field="Price" span="12">
            <template #default>
              <vxe-input v-model="formData.Price" placeholder="请输入报价"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="报价其他" field="PriceMark" span="12">
            <template #default>
              <vxe-input v-model="formData.PriceMark" placeholder="请输入报价其他"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="耗价价格" field="PassThroughPrice" span="12">
            <template #default>
              <vxe-input v-model="formData.PassThroughPrice" placeholder="请输入耗价价格"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="耗价价格其他" field="PassThroughPriceMark" span="12">
            <template #default>
              <vxe-input v-model="formData.PassThroughPriceMark" placeholder="请输入耗价价格其他"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="开始时间" field="StartTime" span="12">
            <template #default>
              <vxe-input v-model="formData.StartTime" placeholder="请输入开始时间" type="datetime"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="结束时间" field="EndTime" span="12">
            <template #default>
              <vxe-input v-model="formData.EndTime" placeholder="请输入结束时间" type="datetime"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="期间（人天）" field="Duration" span="12">
            <template #default>
              <vxe-input v-model="formData.Duration" placeholder="请输入期间（人天）"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="DisCount" field="DisCount" span="12">
            <template #default>
              <vxe-input v-model="formData.DisCount" placeholder="请输入DisCount"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Scale" field="Scale" span="12">
            <template #default>
              <vxe-input v-model="formData.Scale" placeholder="Scale"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Property2" field="Property2" span="12">
            <template #default>
              <vxe-input v-model="formData.Property2" placeholder="Property2"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Property2" field="Property2" span="12">
            <template #default>
              <vxe-input v-model="formData.Property2" placeholder="Property2"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property3" field="Property3" span="12">
            <template #default>
              <vxe-input v-model="formData.Property3" placeholder="Property3"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property4" field="Property4" span="12">
            <template #default>
              <vxe-input v-model="formData.Property4" placeholder="Property4"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property5" field="Property5" span="12">
            <template #default>
              <vxe-input v-model="formData.Property5" placeholder="Property5"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property6" field="Property6" span="12">
            <template #default>
              <vxe-input v-model="formData.Property6" placeholder="Property6"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property7" field="Property7" span="12">
            <template #default>
              <vxe-input v-model="formData.Property7" placeholder="Property7"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property8" field="Property8" span="12">
            <template #default>
              <vxe-input v-model="formData.Property8" placeholder="Property8"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property9" field="Property9" span="12">
            <template #default>
              <vxe-input v-model="formData.Property9" placeholder="Property9"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property10" field="Property10" span="12">
            <template #default>
              <vxe-input v-model="formData.Property10" placeholder="Property10"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property11" field="Property11" span="12">
            <template #default>
              <vxe-input v-model="formData.Property11" placeholder="Property11"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property12" field="Property12" span="12">
            <template #default>
              <vxe-input v-model="formData.Property12" placeholder="Property12"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property13" field="Property13" span="12">
            <template #default>
              <vxe-input v-model="formData.Property13" placeholder="Property13"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property14" field="Property14" span="12">
            <template #default>
              <vxe-input v-model="formData.Property14" placeholder="Property14"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property15" field="Property15" span="12">
            <template #default>
              <vxe-input v-model="formData.Property15" placeholder="Property15"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property16" field="Property16" span="12">
            <template #default>
              <vxe-input v-model="formData.Property16" placeholder="Property16"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property17" field="Property17" span="12">
            <template #default>
              <vxe-input v-model="formData.Property17" placeholder="Property17"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property18" field="Property18" span="12">
            <template #default>
              <vxe-input v-model="formData.Property18" placeholder="Property18"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property19" field="Property19" span="12">
            <template #default>
              <vxe-input v-model="formData.Property19" placeholder="Property19"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Property20" field="Property20" span="12">
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
  name: 'ActivityMapping',
  data() {
    return {
      open: false,
      title: '',
      formData: {},
      //节点数据
      actList: [],
      searchKey: '',
      projectList: [],
      activityList: [],
    }
  },
  mounted() {
    this.getList('')
    axios.post('http://123.56.242.202:8080/api/BaseData/GetMasterData?projectName=&corporateName=').then((res) => {
      this.projectList = res.data
    })

    axios.post('http://123.56.242.202:8080/api/BaseData/GetActivityType?name=').then((res) => {
        this.activityList = this.arrayToTree(res.data, 'TypeID', 'ParentID',[])
        this.activityList = this.getActTree(this.activityList);
    })
  },
  methods: {
    getActTree(datas){
      var dt = [];
      for(var item of datas){
          item.ActivetName="|--"+item.ActivetName+"("+this.formatterType(item.Type)+")";
          dt.push(item);
          item.children=item.children==undefined?[]:item.children;
          for(var cd of item.children){
            cd.ActivetName="|--|--"+cd.ActivetName+"("+this.formatterType(item.Type)+")";
            dt.push(cd);
          }
      }
      console.log(dt);
      return dt;
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
        var currentData =data[i];
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
      this.title = '修改Activity基础数据'
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
      this.$XModal.confirm('确定删除？').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
          axios
            .post('http://123.56.242.202:8080/api/BaseData/BaseDataDelete?baseDataID=' + checked.ActivityID)
            .then((res) => {
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
      this.$XModal.confirm('确定保存？').then((type) => {
        if (type === 'confirm') {
          this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })

          if (this.formData.ActivityID == null) {
            axios.post('http://123.56.242.202:8080/api/BaseData/BaseDataCreate', [this.formData]).then((res) => {
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
            axios.post('http://123.56.242.202:8080/api/BaseData/BaseDataUpdate', [this.formData]).then((res) => {
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
      axios.post('http://123.56.242.202:8080/api/BaseData/GetBaseData').then((res) => {
        this.actList = res.data
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

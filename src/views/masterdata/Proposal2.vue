
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input
          v-model="searchKey"
          placeholder="FileName"
        ></vxe-input>
        <vxe-button
          status="primary"
          icon="fa vxe-icon--search"
          @click="search"
        >Search</vxe-button>
      </template>
    </vxe-toolbar>
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
      <vxe-column
        field="ProjectID"
        width="180"
        title="ProjectID"
      ></vxe-column>
      <vxe-column
        field="ProjectName"
        width="180"
        title="ProjectName"
      ></vxe-column>
      <vxe-column
        field="ProposalFileName"
        width="230"
        title="ProposalFileName"
      ></vxe-column>
      <vxe-column
        field="ContractFileName"
        width="230"
        title="ContractFileName"
      ></vxe-column>
      <vxe-column
        field="CreateDate"
        width="160"
        title="CreateDate"
      ></vxe-column>
      <vxe-column
        field="UserName"
        width="140"
        title="CreateUser"
      ></vxe-column>
      <vxe-column
        field="Status"
        width="80"
        title="Status"
      ></vxe-column>

      <vxe-column
        type="seq"
        title="Operation"
        width="180"
        :resizable="false"
        show-overflow
      >
        <template #default="{ row }">
          <vxe-button @click="showSplitResult(row)">Activity Split Result</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal
      v-model="showDetails"
      title="英文合同信息"
      width="600"
      height="440"
      resize
    >
      <template #default>
        <vxe-form
          :data="formData"
          title-align="right"
          title-width="80"
        >
          <vxe-form-item
            title="Name"
            field="Name"
            span="16"
          >
            <template #default>
              <vxe-input
                v-model="formData.Name"
                placeholder="Please enter Name"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="Client"
            field="Client"
            span="16"
          >
            <template #default>
              <vxe-input
                v-model="formData.Client"
                placeholder="Please enter Client"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="Title"
            field="Title"
            span="16"
          >
            <template #default>
              <vxe-input
                v-model="formData.Title"
                placeholder="Please enter Title"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="Payment Date"
            field="PaymentDate"
            span="16"
          >
            <template #default>
              <vxe-select
                v-model="formData.PaymentDate"
                placeholder="Payment Date"
                clearable
              >
                <vxe-option
                  value="within 30 days"
                  label="within 30 days"
                ></vxe-option>
                <vxe-option
                  value="other formats"
                  label="other formats"
                ></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item
            align="right"
            span="24"
          >
            <template #default>
              <vxe-button
                type="button"
                status="primary"
                @click="save"
              >生成</vxe-button>
              <vxe-button
                type="button"
                @click="close"
              >取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
    <vxe-modal
      v-model="showSplit"
      title="Activity Split Result"
      width="1100"
      height="600"
      @show="openSplit"
      fullscreen
      resize
      show-zoom
      remember
    >
      <template #default>
        <activity-split-result ref="ActivitySplitResult"/>
      </template>
    </vxe-modal>
    <vxe-modal
      v-model="showDetailsCN"
      title="中文合同信息"
      width="1100"
      height="600"
      resize
    >
      <template #default>
        <vxe-form
          :data="formData"
          title-align="right"
          title-width="120"
        >
          <vxe-form-item
            title="项目名称"
            field="ProjectName"
            span="20"
          >
            <template #default>
              <vxe-input
                v-model="formData.ProjectName"
                placeholder="请输入项目名称"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="客户（委托方）"
            field="Client"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.Client"
                placeholder="请输入客户（委托方）"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="研究开发方（受托方）"
            field="Trustee"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.Trustee"
                placeholder="请输入"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="合同开始日期"
            field="BeginDate"
            span="10"
          >
            <vxe-input
              v-model="formData.BeginDate"
              placeholder="合同开始日期"
              type="date"
            ></vxe-input>
          </vxe-form-item>
          <vxe-form-item
            title="合同结束日期"
            field="EndDate"
            span="10"
          >
            <vxe-input
              v-model="formData.EndDate"
              placeholder="合同结束日期"
              type="date"
            ></vxe-input>
          </vxe-form-item>

          <vxe-form-item
            title="姓名"
            field="ClientName"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.ClientName"
                placeholder="请输入委托方项目姓名"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="姓名"
            field="TrusteeName"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.TrusteeName"
                placeholder="请输入受托方项目姓名"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="工作电话"
            field="ClientTelephone"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.ClientTelephone"
                placeholder="请输入委托方项目工作电话"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="工作电话"
            field="TrusteeTelephone"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.TrusteeTelephone"
                placeholder="请输入受托方项目工作电话"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="手机"
            field="ClientPhone"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.ClientPhone"
                placeholder="请输入委托方项目手机"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="手机"
            field="TrusteePhone"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.TrusteePhone"
                placeholder="请输入受托方项目手机"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="Email"
            field="ClientEmail"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.ClientEmail"
                placeholder="请输入委托方项目Email"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="Email"
            field="TrusteeEmail"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.TrusteeEmail"
                placeholder="请输入受托方项目Email"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="通信地址"
            field="ClientAddress"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.ClientAddress"
                placeholder="请输入委托方项目通信地址"
              ></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item
            title="通信地址"
            field="TrusteeAddress"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.TrusteeAddress"
                placeholder="请输入受托方项目通信地址"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="费用总额（人民币）"
            field="Total"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.Total"
                placeholder="请输入费用总额（人民币）"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="项目启动经费"
            field="StartUpFunds"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.StartUpFunds"
                placeholder="请输入项目启动经费"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="一次性材料费用"
            field="OneFee"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.OneFee"
                placeholder="请输入费用总额（人民币）"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            title="填料费用"
            field="FillerCost"
            span="10"
          >
            <template #default>
              <vxe-input
                v-model="formData.FillerCost"
                placeholder="请输入填料费用"
              ></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item
            align="right"
            span="24"
          >
            <template #default>
              <vxe-button
                type="button"
                status="primary"
                @click="save"
              >生成</vxe-button>
              <vxe-button
                type="button"
                @click="close"
              >取消</vxe-button>
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
  import ActivitySplitResult from './modules/ActivitySplitResult.vue'
  export default {
    name: 'Proposal2',
    components: {
      ActivitySplitResult
    },
    data() {
      return {
        value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        value2: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        showDetails: false,
        showDetailsCN: false,
        showSplit: false,
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
        iframeShow: true
      }
    },
    mounted() {
      this.getList('')
      this.getDepList('')
    },
    methods: {
      getDepList(name) {
        axios.post('http://123.56.242.202:8080/api/Contract/GetContractList?fileName=' + name).then((res) => {
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
      showSplitResult(row) {
        console.log(row)
        this.currentRow = row
        this.showSplit = true
      },
      openSplit() {
        this.$refs.ActivitySplitResult.openLoad(this.currentRow)
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
      close() {
        this.showDetails = false
      },
      getList(name) {
        axios.post('http://123.56.242.202:8080/api/Contract/GetContractList?fileName=' + name).then((res) => {
          this.tableList = res.data
          setTimeout(() => {
            this.$refs.vxeTable.setAllTreeExpand(true)
          }, 200)
        })
      },
      save() {
        this.$XModal.confirm('确定保存？').then((type) => {
          if (type === 'confirm') {
            this.$XModal.message({ id: 'loding', content: '数据处理中...', status: 'loading' })
            axios.post('http://123.56.242.202:8080/api/Contract/DataContractCreate', [this.formData]).then((res) => {
              this.$XModal.close('loding')
              if (res.data.Code == 200) {
                this.$XModal.message({ content: '生成成功', status: 'success' })
                this.showDetails = false
                this.getList('')
              } else {
                this.$XModal.message({ content: '生成失败：' + res.data.Message, status: 'error' })
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
.iframe {
  margin: 20px 0;
  border: none;
  width: 95%;
  height: 100%;
  margin-left: 2.5%;
}
</style>

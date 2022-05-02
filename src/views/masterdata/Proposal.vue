
<template>
  <div>
    <vxe-toolbar style="padding-left: 10px; margin-bottom: 10px; border-radius: 5px">
      <template #buttons>
        <vxe-input v-model="searchKey" placeholder="文件名称"></vxe-input>
        <vxe-button status="primary" icon="fa vxe-icon--search" @click="search">查询</vxe-button>
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
      <vxe-column field="ProposalFileName" width="280" title="Proposal文件名称"></vxe-column>
      <vxe-column field="ContractFileName" width="280" title="Contract文件名称"></vxe-column>
      <vxe-column field="CreateDate" width="180" title="创建时间"></vxe-column>
      <vxe-column field="UserName" width="140" title="创建人"></vxe-column>
      <vxe-column field="Status" width="140" title="状态"></vxe-column>

      <vxe-column type="seq" title="操作" width="400" :resizable="false" show-overflow>
        <template #default="{ row }">
          <vxe-button @click="showDetailEvent(row)">生成合同{{ row.batchID }}</vxe-button>
          <vxe-button @click="SelectProposal(row.ProposalFileName)">查看Proposal{{ row.batchID }}</vxe-button>
          <vxe-button @click="SelectContract(row.ContractFileName, row)">查看Contract{{ row.batchID }}</vxe-button>
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="showDetails" title="英文合同信息" width="600" height="340" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="80">
          <vxe-form-item title="Name" field="Name" span="16">
            <template #default>
              <vxe-input v-model="formData.Name" placeholder="Please enter Name"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Client" field="Client" span="16">
            <template #default>
              <vxe-input v-model="formData.Client" placeholder="Please enter Client"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Title" field="Title" span="16">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="Please enter Title"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="Payment Date" field="PaymentDate" span="16">
            <template #default>
              <vxe-select v-model="formData.PaymentDate" placeholder="Payment Date" clearable>
                <vxe-option value="within 30 days" label="within 30 days"></vxe-option>
                <vxe-option value="other formats" label="other formats"></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">生成</vxe-button>
              <vxe-button type="button" @click="close">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>

    <vxe-modal v-model="showDetailsCN" title="中文合同信息" width="1100" height="600" resize>
      <template #default>
        <vxe-form :data="formData" title-align="right" title-width="120">
          <vxe-form-item title="项目名称" field="Name" span="10">
            <template #default>
              <vxe-input v-model="formData.Name" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="客户（委托方）" field="Client" span="10">
            <template #default>
              <vxe-input v-model="formData.Client" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="研究开发方（受托方）" field="Title" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="合同有效期" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="委托方项目联系人" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="姓名" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作电话" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Email" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="通信地址" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="受托方项目联系人 " field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="姓名" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="工作电话" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="Email" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="通信地址" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="费用总额（人民币）" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="一次性材料费用" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="填料费用" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="项目启动经费" field="PaymentDate" span="10">
            <template #default>
              <vxe-input v-model="formData.Title" placeholder="请输入"></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item align="right" span="24">
            <template #default>
              <vxe-button type="button" status="primary" @click="save">生成</vxe-button>
              <vxe-button type="button" @click="close">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>

    <vxe-modal v-model="showDetails11" title="文件信息" width="1200" height="800" resize>
      <template #default>
        <div class="Generate">
          <iframe
            v-if="iframeShow"
            sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-downloads"
            id="Generate"
            :src="url"
            class="iframe"
          />
        </div>
      </template>
    </vxe-modal>
  </div>
</template>


<script>
import _ from 'lodash'
import axios from 'axios'
import XEUtils from 'xe-utils'
export default {
  name: 'Proposal',
  data() {
    return {
      showDetails: false,
      showDetailsCN: false,
      showDetails11: false,
      title: '',
      formData: {},
      selectRow: {},
      //模板数据
      tableList: [],
      searchKey: '',
      //部门数据
      depList: [],
      url: '/static/SelectOnlineEditing.html',
      iframeShow: true,
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
    SelectProposal(name) {
      this.showDetails11 = true

      document.getElementById('Generate').contentWindow.postMessage(
        {
          name,
        },
        '*'
      )
    },
    SelectContract(name, row) {
      if (row.Status == '未生成') {
        this.$XModal.message({ content: '此合同未生成，无法查看', status: 'warning' })
        return
      }
      this.showDetails11 = true

      document.getElementById('Generate').contentWindow.postMessage(
        {
          name,
        },
        '*'
      )
    },
    showDetailEvent(row) {
      if (row.Status == '已生成') {
        this.$XModal.message({ content: '此合同已经生成，无法再次进行生成。', status: 'warning' })
        return
      }

      if (row.ProposalFileName.indexOf('EN') > 0) {
        this.selectRow = row
        this.showDetails = true
        //this.showDetailsCN = true

        this.formData.BatchID = row.BatchID
      } else {
        this.$XModal.message({ content: '开始生成中文合同', status: 'warning' })
        return
      }
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
          debugger
          this.formData.DepartmentName = this.getDepName(this.formData.DepartmentID).replace(/\|\-\-/g, '')

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

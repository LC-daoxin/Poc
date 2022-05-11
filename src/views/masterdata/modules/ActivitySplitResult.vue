<template>
  <div class="activities">
    <div class="search-approval-wrapper">
      <!-- <a-button
        class="search_btn"
        type="primary"
        icon="plus"
        @click="addRow"
      >Add Row</a-button> -->
      <a-button class="search_btn" type="primary" icon="redo" @click="loadData()">Refresh</a-button>
      &nbsp; &nbsp; &nbsp;
      <a-button class="export_btn" type="primary" icon="export" @click="exportData()">Export</a-button>
      <!-- <a-button
        class="search_btn"
        icon="plus"
        type="primary"
        @click="openAddModal"
      > {{this.$t('add')}} </a-button> -->
      <!-- <a-button
        class="search_btn"
        icon="delete"
        @click="refresh(false)"
      >Reset</a-button> -->
    </div>
    <public-table
      class="table"
      :pagination="false"
      :params="tableParams"
      :rowKey="(record) => record.ID"
      :rowSelection="true"
      :draggableRow="false"
      @pageChange="loadData"
      @changeRow="changeRow"
      @selectionChange="selectionChange"
    ></public-table>
    <result-edit-rule-modal ref="ResultEditRuleModal" @refresh="loadData" />
    <add-result-row-modal ref="AddResultRowModal" @refresh="loadData" />
  </div>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { PublicTable } from '@/components'
import _ from 'lodash'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import AddResultRowModal from './AddResultRowModal'
import ResultEditRuleModal from './ResultEditRuleModal.vue'

export default {
  name: 'SubActivities',
  components: {
    PageHeaderWrapper,
    PublicTable,
    AddResultRowModal,
    ResultEditRuleModal,
  },
  data() {
    return {
      // data
      searchLabelCol: 9,
      searchWrapperCol: 15,
      selectionKeys: [],
      selectionRows: [],
      selectActivityID: [],
      currentRow: null,
      model: {
        activityID: [],
        keyWords: '',
      },
      pipelineOptions: [],
      projectType1Disabled: true,
      projectType1Options: [],
      projectType2Disabled: true,
      projectType2Options: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      tableParams: {
        loading: false,
        dataSource: [],
        scroll: { x: 1200 },
        bordered: true,
        columns: [
          {
            title: 'ActivityNo',
            dataIndex: 'ActivityNo',
            align: 'center',
            width: 100,
            ellipsis: true,
            customRender: (text, row, index) => {
              return <b>{text}</b>
            },
          },
          {
            title: 'Description',
            dataIndex: 'Description',
            align: 'center',
            width: 350,
            ellipsis: true,
          },
          {
            title: 'Revenue',
            dataIndex: 'Revenue',
            align: 'center',
            width: 150,
            ellipsis: true,
            customRender: (text) => {
              if (text === 0) {
                return <b style="color: red;">{0}</b>
              } else {
                return text
              }
            },
          },
          {
            title: 'Discount',
            dataIndex: 'Discount',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'ActualRevenue',
            dataIndex: 'ActualRevenue',
            align: 'center',
            width: 150,
            ellipsis: true,
            customRender: (text) => {
              if (text === 0) {
                return <b style="color: red;">{0}</b>
              } else {
                return text
              }
            },
          },
          {
            title: 'BU',
            dataIndex: 'BU',
            width: 100,
            align: 'center',
            ellipsis: true,
          },
          {
            title: 'SubBU',
            dataIndex: 'SubBU',
            width: 100,
            align: 'center',
            ellipsis: true,
          },
          {
            title: 'MilestoneCode',
            dataIndex: 'MilestoneCode',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'Batch',
            dataIndex: 'Batch',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'StartDate',
            dataIndex: 'StartDate',
            align: 'center',
            width: 180,
            ellipsis: true,
          },
          {
            title: 'ReportDeliverDate',
            dataIndex: 'ReportDeliverDate',
            align: 'center',
            width: 180,
            ellipsis: true,
          },
          {
            title: 'RRDate',
            dataIndex: 'RRDate',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'Deliverables',
            dataIndex: 'Deliverables',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'Comments',
            dataIndex: 'Comments',
            align: 'center',
            width: 100,
            ellipsis: true,
          },
          {
            title: 'Operation', // 操作
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            width: 260,
            align: 'center',
            customRender: (text, record) => {
              const renderElement = []
              renderElement.push(
                <a-button
                  icon="edit"
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.edit(record)
                  }}
                >
                  Edit Info
                </a-button>
              )
              renderElement.push(
                <a-button
                  icon="edit"
                  type="primary"
                  size="small"
                  onClick={() => {
                    this.editSplitRule(record)
                  }}
                >
                  Split Rule
                </a-button>
              )
              // renderElement.push(
              //   <a-popconfirm
              //     title="是否确认删除此项?"
              //     okText="确定"
              //     cancelText="取消"
              //     onConfirm={() => {
              //       this.handleDelete(id);
              //     }}
              //   >
              //     <a-button icon="delete" type="danger" size="small">
              //       Delete
              //     </a-button>
              //   </a-popconfirm>
              // );
              return <a-space>{renderElement}</a-space>
            },
          },
        ],
      },
    }
  },
  computed: {
    ...mapState({
      lang: (state) => state.app.lang,
      activitiesSelect: (state) => state.poc.activitiesSelect,
    }),
  },
  watch: {
    lang(val) {
      this.setColumns(val)
    },
    activitiesSelect(list) {
      this.selectActivityID = []
      if (list.length > 0) {
        list.forEach((item) => {
          this.selectActivityID.push(item.ActivityID)
        })
        this.model.activityID = this.selectActivityID.join(',')
        this.loadData()
      }
    },
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setSubActivitiesAll(commit, select) {
        console.log('setSubActivitiesAll', select)
        return commit('poc/setSubActivitiesAll', select)
      },
    }),
    addRow() {
      this.$refs.AddResultRowModal.open()
    },
    edit(record) {
      this.$refs.AddResultRowModal.edit(record)
    },
    handleDelete() {},
    // 拖拽列
    changeColumns(evt) {
      console.log(evt, 'oldIndex', evt.oldIndex, 'newIndex', evt.newIndex)
      let oldColumnsItem = _.cloneDeep(this.tableParams.columns[evt.oldIndex])
      this.tableParams.columns.splice(evt.oldIndex, 1)
      this.tableParams.columns.splice(evt.newIndex, 0, oldColumnsItem)
      console.log('changeColumns', this.tableParams.columns)
    },
    // 拖拽行
    changeRow(evt) {
      // let list = _.cloneDeep(this.tableParams.dataSource)
      console.log(evt, 'oldIndex', evt.oldIndex, 'newIndex', evt.newIndex)
      // let oldRowsItem = _.cloneDeep(list[evt.oldIndex])
      // list.splice(evt.oldIndex, 1)
      // list.splice(evt.newIndex, 0, oldRowsItem)
      // this.tableParams.dataSource = list
      console.log('changeRow', this.tableParams.dataSource)
    },
    // 选择Pipeline
    changePipeline(list) {
      console.log(list)
      if (list.length > 0) {
        this.model.activityID = list.join(',')
      }
    },
    editSplitRule(record) {
      this.$refs.ResultEditRuleModal.open(record)
    },
    setColumns(lang) {
      console.log(lang)
      this.tableParams.columns.forEach((item) => {
        item.i18n ? (item.title = this.$t(item.i18n)) : ''
      })
    },
    refresh() {
      this.model = {
        activityID: [],
        keyWords: '',
      }
      this.loadData()
    },
    openLoad(row) {
      this.currentRow = row
      this.loadData()
    },
    loadData() {
      this.tableParams.loading = true
      axios
        .post(`http://123.56.242.202:8080/api/SplitRule/GetPMSDataSplitResult?BatchID=${this.currentRow.BatchID}`)
        .then((res) => {
          console.log(res.data)
          // this.setSubActivitiesAll(res.data)
          this.tableParams.dataSource = res.data
          this.tableParams.loading = false
        })
    },
    exportData() {
      // axios
      //   .post(`http://123.56.242.202:8080/api/SplitRule/GetPMSDataSplitResultFile?BatchID=${this.currentRow.BatchID}`)
      //   .then((res) => {
      //     const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      //     const url = window.URL.createObjectURL(blob)
      //     window.open(url, '_blank')

      //   })
      //   .catch((err) => {
      //     this.$message.error('文件下载失败！')
      //   })

      axios({
        url: `http://123.56.242.202:8080/api/SplitRule/GetPMSDataSplitResultFile?BatchID=${this.currentRow.BatchID}`,
        responseType: 'blob', //表明返回服务器返回的数据类型
        method: 'post', //请求方式
      }).then((res) => {
        //请求成功之后
        //创建一个隐藏的a链接
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }) //文件流处理
        link.style.display = 'none' //去除a标签的样式
        link.href = URL.createObjectURL(blob)
        link.download = new Date().valueOf() + '拆分结果.xlsx'
        document.body.appendChild(link)
        link.click()
      })
    },
    selectionChange(keys, rows) {
      this.selectionKeys = keys
      this.selectionRows = rows
      this.setSubActivitiesAll(this.selectionRows)
    },
  },
  created() {
    // this.refresh()
  },
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-row-level-0 {
  height: 41px;
}
.activities {
  margin-top: 20px;
  padding: 0 20px;
}
/deep/ .ant-table {
  background: #fff;
}
.processCenter {
  .ant-form-item {
    width: calc(25% - 16px);
  }
  margin-bottom: 10px;
}
.search-approval-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  .search_btn {
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
}
.table {
  margin-bottom: 20px;
}
</style>

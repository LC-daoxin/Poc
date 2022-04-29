<template>
  <div class="activities">
    <a-form-model
      class="processCenter"
      ref="form"
      layout="inline"
      :model="model"
      :labelCol="{ span: searchLabelCol }"
      :wrapperCol="{ span: searchWrapperCol }"
    >
      <a-form-model-item
        class="form-item"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="width: calc(40%)"
        label="Activity"
      >
        <a-select
          allowClear
          :disabled="ActivityLoading"
          v-model="model.Activity"
          @change="changeActivity"
        >
          <a-select-option
            :value="item.ActivityID"
            :key="item.ActivityID"
            v-for="item in ActivityOptions"
          >{{
            item.ActivityName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        class="form-item"
        :labelCol="{ span: 5 }"
        :wrapperCol="{ span: 19 }"
        style="width: calc(40%)"
        label="SubActivity"
      >
        <a-select
          allowClear
          v-model="model.SubActivity"
          :disabled="SubActivityLoading"
          @change="changeSubActivity"
        >
          <a-select-option
            :value="item.SubActivityID"
            :key="item.SubActivityID"
            v-for="item in SubActivityOptions"
          >{{
            item.SubActivityName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="Version"
        class="form-item"
      >
        <a-select
          allowClear
          v-model="model.Version"
        >
          <a-select-option
            :value="item.value"
            :key="item.value"
            v-for="item in VersionOptions"
          >{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-button
        class="search_btn"
        type="primary"
        icon="search"
        @click="loadData"
      >Search</a-button>
      <a-button
        class="search_btn"
        type="primary"
        icon="plus"
        @click="addActivity"
      >Add Row</a-button>
      <a-button
        class="search_btn"
        icon="delete"
        @click="refresh(false)"
      >Reset</a-button>
    </div>
    <public-table
      class="table"
      :pagination="false"
      :params="tableParams"
      :rowSelection="true"
      :rowKey="(record) => record.ActivityID"
      @pageChange="loadData"
      @changeColumns="changeColumns"
      @selectionChange="selectionChange"
    ></public-table>
    <edit-rule-modal
      ref="ruleModal"
      :typeOptions="typeOptions"
    />
  </div>
</template>

<script>
  import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
  import { PublicTable } from '@/components'
  import EditRuleModal from './EditRuleModal.vue'
  import _ from 'lodash'
  import axios from 'axios'
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'Activities',
    components: {
      PageHeaderWrapper,
      PublicTable,
      EditRuleModal,
    },
    data() {
      return {
        // data
        searchLabelCol: 9,
        searchWrapperCol: 15,
        selectionKeys: [],
        selectionRows: [],
        model: {
          Activity: '',
          SubActivity: '',
          Version: 1,
        },
        ActivityLoading: false,
        SubActivityLoading: false,
        ActivityOptions: [],
        SubActivityOptions: [],
        VersionOptions: [
          {
            label: '1.0',
            value: 1,
          },
        ],
        typeOptions: [
          {
            label: '按固定比例拆分',
            value: 1,
          },
          {
            label: '按条件拆分',
            value: 2,
          },
          {
            label: '按批次拆分',
            value: 3,
          },
        ],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
        },
        tableParams: {
          loading: false,
          dataSource: [],
          scroll: { x: 1050 },
          bordered: true,
          columns: [
            {
              title: 'Split Name',
              dataIndex: 'SplitName',
              align: 'center',
              width: 150,
              customRender: (text, record, index) => {
                return (
                  <a-input
                    value={text}
                    onChange={(e) => {
                      this.changeSplitName(e.target.value, record)
                    }}
                  ></a-input>
                )
              },
            },
            {
              title: 'Split Desc',
              dataIndex: 'SplitDesc',
              align: 'center',
              width: 150,
              customRender: (text, record, index) => {
                return (
                  <a-input
                    value={text}
                    onChange={(e) => {
                      this.changeSplitDesc(e.target.value, record)
                    }}
                  ></a-input>
                )
              },
            },
            {
              title: 'Split Type',
              dataIndex: 'SplitType',
              align: 'center',
              width: 150,
              ellipsis: true,
              customRender: (text, record, index) => {
                return (
                  <a-select
                    value={text}
                    style="width: 100%"
                    onChange={(val) => {
                      this.changeSplitType(val, record)
                    }}
                  >
                    {this.typeOptions.map((item) => {
                      return <a-select-option value={item.value}>{item.label}</a-select-option>
                    })}
                  </a-select>
                )
              },
            },
            {
              title: 'Version',
              dataIndex: 'Version',
              width: 100,
              align: 'center',
            },
            {
              title: 'Effictive Date',
              dataIndex: 'Effictive',
              width: 200,
              align: 'center',
              customRender: (text, record, index) => {
                let date = this.$moment(text, 'YYYY-MM-DD')
                return (
                  <a-date-picker
                    value={date}
                    format={'YYYY-MM-DD'}
                    onChange={(val) => {
                      this.changeEffictiveDate(val, record)
                    }}
                  />
                )
              },
            },
            {
              title: 'Status',
              dataIndex: 'Status',
              width: 100,
              align: 'center',
              customRender: (status, record) => (
                <a-switch
                  checked-children="启用"
                  un-checked-children="禁用"
                  checked={this.checkedStatus(status)}
                  onChange={(val) => {
                    this.changeCheckedStatus(val, record)
                  }}
                />
              ),
            },
            {
              title: 'Split Rule', // 操作
              scopedSlots: { customRender: 'action' },
              align: 'center',
              fixed: 'right',
              width: 180,
              customRender: (text, record) => {
                const renderElement = []
                const { status } = record
                renderElement.push(
                  <a-button
                    icon="edit"
                    type="primary"
                    size="small"
                    onClick={() => {
                      this.editRule(record)
                    }}
                  >
                    Edit Split Rule
                  </a-button>
                )
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
      }),
    },
    watch: {
      lang(val) {
        this.setColumns(val)
      },
    },
    mounted() {
      this.getActivitiesList()
    },
    methods: {
      ...mapMutations({
        setActivitiesSelect(commit, select) {
          console.log('setActivitiesSelect', select)
          return commit('poc/setActivitiesSelect', select)
        },
      }),
      // 拖拽列
      changeColumns(evt) {
        console.log(evt, 'oldIndex', evt.oldIndex, 'newIndex', evt.newIndex)
        let oldColumnsItem = _.cloneDeep(this.tableParams.columns[evt.oldIndex])
        this.tableParams.columns.splice(evt.oldIndex, 1)
        this.tableParams.columns.splice(evt.newIndex, 0, oldColumnsItem)
        console.log('changeColumns', this.tableParams.columns)
      },
      setColumns(lang) {
        console.log(lang)
        this.tableParams.columns.forEach((item) => {
          item.i18n ? (item.title = this.$t(item.i18n)) : ''
        })
      },
      refresh() {
        this.model = {
          Activity: '',
          SubActivity: '',
          Version: 1,
        }
        this.loadData()
      },
      loadData() {
        if (this.model.SubActivity) {
          this.tableParams.loading = true
          axios
            .post(`http://123.56.242.202:8080/api/BaseData/GetSplitRuleData?activityID=${this.model.SubActivity}`, {
              params: { activityID: this.model.SubActivity },
            })
            .then((res) => {
              console.log('loadData', res)
              this.tableParams.dataSource = res.data
              this.tableParams.loading = false
            })
        } else {
          return []
        }
      },
      addActivity() {
        if (this.model.SubActivity) {
          axios
            .post('http://123.56.242.202:8080/api/BaseData/SplitRuleCreate', [{
              ActivityID: this.model.SubActivity,
              Effictive: null,
              Sort: this.tableParams.dataSource.length,
              SplitDesc: 'Split Desc',
              SplitName: 'Split Name',
              SplitType: 1,
              Status: 1,
              Version: this.model.Version,
            }])
            .then((res) => {
              console.log('SplitRuleCreate', res.data)
              this.loadData()
            })
        } else {
          this.$message.warning('SubActivity not selected')
        }
      },
      changeActivity(val) {
        console.log('changeActivity', val)
        this.SubActivityOptions = []
        this.model.SubActivity = ''
        this.SubActivityLoading = true
        this.activityID = val
        axios
          .get('http://123.56.242.202:8080/api/poc/GetSubActivitiesList', {
            params: {
              activityID: [val],
              keyWords: '',
            },
          })
          .then((res) => {
            console.log('getSubActivity', res.data)
            this.SubActivityOptions = res.data
            this.SubActivityLoading = false
          })
      },
      changeSubActivity(val) {
        console.log('changeSubActivity', val)
        console.log(this.model.SubActivity, { activityID: val })
        this.tableParams.loading = true
        axios.post(`http://123.56.242.202:8080/api/BaseData/GetSplitRuleData?activityID=${val}`).then((res) => {
          console.log('GetSplitRuleData', res)
          const { status, statusText, data } = res
          if (status == 200 && statusText == 'OK') {
            if (data.length > 0) {
              this.tableParams.dataSource = res.data
            } else {
              this.$message.warning('No data！')
            }
          }
          this.tableParams.loading = false
        })
      },
      getActivitiesList() {
        this.ActivityLoading = true
        axios
          .get('http://123.56.242.202:8080/api/poc/GetActivitiesList', {
            params: {
              proposalPipelineID: '',
              activityName: '',
            },
          })
          .then((res) => {
            console.log('getActivitiesList', res)
            this.ActivityOptions = res.data
            this.ActivityLoading = false
          })
      },
      selectionChange(keys, rows) {
        console.log(keys, rows)
        this.selectionKeys = keys
        this.selectionRows = rows
        this.setActivitiesSelect(rows)
      },
      checkedStatus(status) {
        return status == 1 ? true : false
      },
      changeSplitName: _.debounce(function (val, record) {
        console.log(val, record)
        record.SplitName = val
        this.updateSplitList(record)
      }, 1000),
      changeSplitDesc: _.debounce(function (val, record) {
        console.log(val, record)
        record.SplitDesc = val
        this.updateSplitList(record)
      }, 1000),
      changeCheckedStatus(val, record) {
        console.log(val, record)
        val ? (record.Status = 1) : (record.Status = 0)
        this.updateSplitList(record)
      },
      changeEffictiveDate(val, record) {
        console.log(val, record)
        record.Effictive = this.$moment(val).format('YYYY-MM-DD')
        this.updateSplitList(record)
      },
      changeSplitType(val, record) {
        console.log(val, record)
        record.SplitType = val
        this.updateSplitList(record)
      },
      updateSplitList(record) {
        axios
          .post('http://123.56.242.202:8080/api/BaseData/SplitRuleUpdate', [
            {
              ...record,
            },
          ])
          .then((res) => {
            console.log('SplitRuleUpdate', res)
            this.loadData()
            this.$message.success('已更新！')
          })
      },
      editRule(record) {
        this.$refs.ruleModal.open(record)
      },
    },
  }
</script>

<style lang="less" scoped>
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

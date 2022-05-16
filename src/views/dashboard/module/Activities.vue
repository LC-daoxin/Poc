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
      <a-form-model-item class="form-item" label="Pipeline" prop="proposalPipelineID">
        <a-select allowClear v-model="model.proposalPipelineID">
          <a-select-option :value="item.TypeID" :key="item.TypeID" v-for="item in pipelineOptions">{{
            item.ActivetName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item class="form-item" label="ProjectType1">
        <a-select allowClear>
          <a-select-option :value="item.TypeID" :key="item.TypeID" v-for="item in pipelineOptions">{{
            item.ActivetName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item class="form-item" label="ProjectType2">
        <a-select allowClear>
          <a-select-option :value="item.TypeID" :key="item.TypeID" v-for="item in pipelineOptions">{{
            item.ActivetName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="Activity Name" class="form-item">
        <a-input allowClear v-model="model.activityName"></a-input>
      </a-form-model-item>
    </a-form-model>

    <div class="search-approval-wrapper">
      <a-button class="search_btn" type="primary" icon="search" @click="loadData(model)">Search</a-button>
      <a-button class="search_btn" icon="delete" @click="refresh(false)">Reset</a-button>
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
  </div>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { PublicTable } from '@/components'
import _ from 'lodash'
import axios from 'axios'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Activities',
  components: {
    PageHeaderWrapper,
    PublicTable,
  },
  data() {
    const Options = [
      {
        label: '无',
        value: 'False',
      },
      {
        label: 'Options',
        value: 'True',
      },
    ]
    return {
      // data
      searchLabelCol: 9,
      searchWrapperCol: 15,
      selectionKeys: [],
      selectionRows: [],
      model: {
        proposalPipelineID: '',
        activityName: '',
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
        scroll: { x: 1060 },
        bordered: true,
        columns: [
          {
            title: 'Activity Name',
            dataIndex: 'ActivityName',
            align: 'center',
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                return this.templateSelect[0].Name.indexOf('CN') != -1 ? (
                  <a-input size="small" v-model:value={row.ActivityNameCN} value={row.ActivityNameCN} />
                ) : row.text ? (
                  ''
                ) : (
                  <a-input size="small" v-model:value={row.text} value={text} />
                )
              } else {
                return <a-input size="small" v-model:value={row.text} value={text} />
              }
            },
          },
          {
            title: 'Activity Short Desc',
            dataIndex: 'ActivityDesc',
            align: 'center',
            width: 180,
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                return this.templateSelect[0].Name.indexOf('CN') != -1 ? (
                  <a-input size="small" v-model:value={row.ActivityDescCN} value={row.ActivityDescCN} />
                ) : row.text ? (
                  ''
                ) : (
                  <a-input size="small" v-model:value={row.text} value={text} />
                )
              } else {
                return <a-input size="small" v-model:value={row.text} value={text} />
              }
            },
          },
          {
            title: 'Options',
            dataIndex: 'Property11',
            align: 'center',
            width: 100,
            ellipsis: true,
            customRender: (text, record, index) => {
              let val = text && text == 'True' ? 'True' : 'False'
              return (
                <a-select
                  value={val}
                  style="width: 100%"
                  size="small"
                  onChange={(val) => {
                    this.changeOptions(val, record)
                  }}
                >
                  {Options.map((item) => {
                    return <a-select-option value={item.value}>{item.label}</a-select-option>
                  })}
                </a-select>
              )
            },
          },
          // {
          //   title: 'DisCount',
          //   dataIndex: 'DisCount',
          //   align: 'center',
          //   width: 140,
          //   ellipsis: true,
          //   customRender: (text, row, index) => (
          //     <a-input
          //       size="small"
          //       v-model:value={text}
          //       onChange={(e) => this.onChangeServicePrice(e, row)}
          //       value={text}
          //     />
          //   ),
          // },
          // {
          //   title: 'Time',
          //   width: 260,
          //   align: 'center',
          //   customRender: (text, row, index) => (
          //     <a-range-picker
          //       size="small"
          //       format="YYYY-MM-DD"
          //       placeholder={['Start Time', 'End Time']}
          //       onChange={(val) => this.onChangeTime(val, row)}
          //     />
          //   ),
          // },
          // {
          //   title: 'Duration',
          //   dataIndex: 'Duration',
          //   width: 150,
          //   align: 'center',
          //   customRender: (text, row, index) => <span>{text}</span>,
          // },
        ],
      },
    }
  },
  computed: {
    ...mapState({
      lang: (state) => state.app.lang,
      templateSelect: (state) => state.poc.templateSelect,
    }),
  },
  watch: {
    lang(val) {
      this.setColumns(val)
    },
    'model.proposalPipelineID'(val) {
      console.log('model.proposalPipelineID', val)
      val ? (this.projectType1Disabled = false) : (this.projectType1Disabled = true)
    },
    templateSelect(list) {
      console.log('watch', list)
      if (list.length > 0) {
        this.loadData(this.model)
      }
    },
  },
  mounted() {
    this.model = {
      proposalPipelineID: '',
      activityName: '',
    }

    this.getProposalPipeLine()
    this.loadData(this.model)
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
    changeOptions(val, row) {
      console.log(val, row)
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.ActivityID == row.ActivityID) {
          this.$set(this.tableParams.dataSource[i], 'Property11', val)
          // this.setSubActivitiesAll(this.tableParams.dataSource)
          // this.setSubActivitiesAll(this.selectionRows)
        }
      })
    },

    changeProjectType1(id) {
      console.log(id)
      // id ? (this.projectType2Disabled = false) : (this.projectType2Disabled = true)
      if (id) {
        this.GetProposalProjectType2(id)
      }
    },
    changeProjectType2(id) {
      console.log(id, this.model)
    },
    setColumns(lang) {
      console.log(lang)
      this.tableParams.columns.forEach((item) => {
        item.i18n ? (item.title = this.$t(item.i18n)) : ''
      })
    },
    refresh() {
      this.model = {
        proposalPipelineID: '',
        activityName: '',
      }
      this.loadData(this.model)
    },
    loadData(model = {}) {
      this.tableParams.loading = true
      let url = 'GetActivitiesList'
      if (this.templateSelect.length > 0) {
        this.templateSelect[0].Name == 'POCCN' ? (url = 'GetActivitiesListCN') : ''
      }
      console.log(1, `http://123.56.242.202:8080//api/poc/${url}`)
      axios
        .get(`http://123.56.242.202:8080//api/poc/${url}`, {
          params: model,
        })
        .then((res) => {
          console.log('loadData', res)
          this.tableParams.dataSource = res.data
          this.tableParams.loading = false
        })
    },
    getProposalPipeLine() {
      // this.tableParams.loading = true
      axios.get('http://123.56.242.202:8080//api/poc/GetProposalPipeLine', {}).then((res) => {
        console.log('getProposalPipeLine', res)
        this.pipelineOptions = res.data
      })
    },
    selectionChange(keys, rows) {
      console.log(keys, rows)
      this.selectionKeys = keys
      this.selectionRows = rows
      this.setActivitiesSelect(rows)
    },
    onChangeTime(dates, row) {
      console.log(dates, row)
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.ActivityID == row.ActivityID) {
          const Duration = dates[1].diff(dates[0], 'days') + 1
          this.$set(this.tableParams.dataSource[i], 'Duration', `${Duration} days`)
          if (this.selectionRows.length > 0) {
            this.$emit('updateSub')
          }
        }
      })
    },
    onChangeServicePrice(e, row) {
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.ActivityID == row.ActivityID) {
          this.$set(this.tableParams.dataSource[i], 'DisCount', e.target.value)
          if (this.selectionRows.length > 0) {
            this.$emit('updateSub')
          }
        }
      })
    },
  },
  created() {
    // this.refresh()
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
/deep/ .ant-table-row-level-0 {
  height: 41px;
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

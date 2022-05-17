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
      <a-form-model-item label="Key Words" class="form-item">
        <a-input allowClear v-model="model.keyWords"></a-input>
      </a-form-model-item>
      <a-form-model-item label="Checked Activity" prop="activityID">
        <a-select
          allowClear
          style="width: 400px"
          :maxTagCount="3"
          mode="multiple"
          v-model="selectActivityID"
          @change="changePipeline"
        >
          <a-select-option :value="item.ActivityID" :key="item.ActivityID" v-for="item in activitiesSelect">{{
            templateSelect.length > 0 && templateSelect[0].Name.indexOf('CN') != -1 ? item.ActivityNameCN : item.ActivityName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-button class="search_btn" type="primary" icon="search" @click="loadData()">Search</a-button>
      <a-button class="search_btn" icon="delete" @click="refresh(false)">Reset</a-button>
    </div>
    <public-table
      class="table"
      :pagination="false"
      :params="tableParams"
      :rowSelection="{ selectedRowKeys: selectionKeys, onChange: selectionChange, type: 'checkbox'}"
      :draggableRow="true"
      :fixed="false"
      :rowKey="(record) => record.SubActivityID"
      :showAlert="false"
      @pageChange="loadData"
      @changeRow="changeRow"
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
  name: 'SubActivities',
  components: {
    PageHeaderWrapper,
    PublicTable,
  },
  data() {
    const EstimateOptions = [
      {
        label: '无',
        value: 'False',
      },
      {
        label: 'Estimate',
        value: 'True',
      },
    ]

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
      selectActivityID: [],
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
        scroll: { x: 1600 },
        bordered: true,
        columns: [
          {
            title: 'Activity Name',
            dataIndex: 'ActivityName',
            align: 'center',
            width: 300,
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                return this.templateSelect[0].Name.indexOf('CN') != -1 ? (
                  row.ActivityNameCN == '' ? (
                    ''
                  ) : (
                    <a-input size="small" v-model:value={row.ActivityNameCN} value={row.ActivityNameCN} />
                  )
                ) : row.ActivityName == '' ? (
                  ''
                ) : (
                  <a-input size="small" v-model:value={row.text} value={text} />
                )
              } else {
                return row.text == '' ? '' : <a-input size="small" v-model:value={row.text} value={text} />
              }
            },
          },
          {
            title: 'Sub Activity Name',
            dataIndex: 'SubActivityName',
            align: 'center',
            width: 300,
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                return this.templateSelect[0].Name.indexOf('CN') != -1 ? (
                  <a-input size="small" v-model:value={row.SubActivityNameCN} value={row.SubActivityNameCN} />
                ) : (
                  <a-input size="small" v-model:value={row.text} value={text} />
                )
              } else {
                return <a-input size="small" v-model:value={row.text} value={text} />
              }
            },
          },
          {
            title: 'Sub Activity Desc',
            dataIndex: 'ActivityDesc',
            align: 'center',
            width: 200,
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
            title: 'Estimate',
            dataIndex: 'Property10',
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
                    this.changeEstimate(val, record)
                  }}
                >
                  {EstimateOptions.map((item) => {
                    return <a-select-option value={item.value}>{item.label}</a-select-option>
                  })}
                </a-select>
              )
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
          {
            title: 'Service Price',
            dataIndex: 'Price',
            align: 'center',
            width: 150,
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                // Property3
                if (this.templateSelect[0].Name.indexOf('CN') != -1) {
                  return (
                    <a-input
                      size="small"
                      v-model:value={row.Property3}
                      onChange={(e) => this.onChangeServicePrice(e, row)}
                      value={row.Property3}
                    />
                  )
                } else {
                  return (
                    <a-input
                      size="small"
                      v-model:value={text}
                      onChange={(e) => this.onChangeServicePrice(e, row)}
                      value={text}
                    />
                  )
                }
              } else {
                return (
                  <a-input
                    size="small"
                    v-model:value={text}
                    onChange={(e) => this.onChangeServicePrice(e, row)}
                    value={text}
                  />
                )
              }
            },
          },
          {
            title: 'Pass Though Price',
            dataIndex: 'PassThroughPrice',
            align: 'center',
            width: 150,
            ellipsis: true,
            customRender: (text, row, index) => (
              <a-input
                size="small"
                v-model:value={text}
                onChange={(e) => this.onChangePassPrice(e, row)}
                value={text}
              />
            ),
          },
          {
            title: 'Duration',
            dataIndex: 'Duration',
            width: 100,
            align: 'center',
            ellipsis: true,
            customRender: (text, row, index) => {
              if (this.templateSelect.length > 0) {
                // Property3
                if (this.templateSelect[0].Name.indexOf('CN') != -1) {
                  return (
                    <a-input
                      size="small"
                      v-model:value={row.Property2}
                      onChange={(e) => this.onChangeDuration(e, row)}
                      value={row.Property2}
                    />
                  )
                } else {
                  return (
                    <a-input
                      size="small"
                      v-model:value={text}
                      onChange={(e) => this.onChangeDuration(e, row)}
                      value={text}
                    />
                  )
                }
              } else {
                return (
                  <a-input
                    size="small"
                    v-model:value={text}
                    onChange={(e) => this.onChangeDuration(e, row)}
                    value={text}
                  />
                )
              }
            },
          },
          {
            title: 'DisCount',
            dataIndex: 'DisCount',
            width: 100,
            align: 'center',
            ellipsis: true,
            customRender: (text, row, index) => (
              <a-input size="small" v-model:value={text} onChange={(e) => this.onChangeDisCount(e, row)} value={text} />
            ),
          },
          {
            title: 'Scale',
            dataIndex: 'Scale',
            align: 'center',
            width: 100,
            ellipsis: true,
            customRender: (text, row, index) => (
              <a-input size="small" v-model:value={text} onChange={(e) => this.onChangeScale(e, row)} value={text} />
            ),
          },
        ],
      },
    }
  },
  computed: {
    ...mapState({
      lang: (state) => state.app.lang,
      templateSelect: (state) => state.poc.templateSelect,
      activitiesSelect: (state) => state.poc.activitiesSelect,
      rejectedList: (state) => state.poc.rejectedList,
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
      let list = _.cloneDeep(this.tableParams.dataSource)
      console.log(evt, 'oldIndex', evt.oldIndex, 'newIndex', evt.newIndex)
      let oldRowsItem = _.cloneDeep(list[evt.oldIndex])
      list.splice(evt.oldIndex, 1)
      list.splice(evt.newIndex, 0, oldRowsItem)
      this.tableParams.dataSource = list
      console.log('changeRow', this.tableParams.dataSource)
    },
    // 选择Pipeline
    changePipeline(list) {
      console.log(list)
      if (list.length > 0) {
        this.model.activityID = list.join(',')
      }
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
    edit(list) {
      let arrIds = []
      let selectRows = []
      this.rejectedList.forEach(item => {
        item.ActivityID && arrIds.push(item.ActivityID)
      })
      let actIds = [...new Set(arrIds)];
      this.selectionKeys = actIds
      console.log(actIds)
      let newList = []
      list.forEach(item => {
        let Obj = {...item}
        if (actIds.includes(item.SubActivityID)) {
          for (let i = 0; i < this.rejectedList.length; i++) {
            if (item.SubActivityID == this.rejectedList[i].ActivityID) {
              Obj.SubActivityName = this.rejectedList[i].ActivityName
              Obj.SubActivityNameCN = this.rejectedList[i].ActivityNameCN
              Obj.ActivityDesc = this.rejectedList[i].ActivityDesc
              Obj.ActivityDescCN = this.rejectedList[i].ActivityNameCN
              Obj.Property10 = this.rejectedList[i].Property10
              Obj.Property11 = this.rejectedList[i].Property11
              Obj.Price = this.rejectedList[i].Price
              Obj.Property3 = this.rejectedList[i].Property3
              Obj.PassThroughPrice = this.rejectedList[i].PassThroughPrice
              Obj.Duration = this.rejectedList[i].Duration
              Obj.Property2 = this.rejectedList[i].Property2
              Obj.DisCount = this.rejectedList[i].DisCount
              Obj.Scale = this.rejectedList[i].Scale
              break
            }
          }
          selectRows.push(Obj)
          newList.push(Obj)
        } else {
          newList.push(item)
        }
      })
      this.tableParams.dataSource = newList
      this.setSubActivitiesAll(selectRows)
    },
    loadData() {
      if (this.model.activityID.length > 0) {
        let url = 'GetSubActivitiesList'
        if (this.templateSelect.length > 0) {
          this.templateSelect[0].Name.indexOf('CN') != -1 ? (url = 'GetSubActivitiesListCN') : ''
        } else {
          this.$message.warning('Please Select Template!')
          return []
        }
        this.tableParams.loading = true
        axios
          .get(`http://123.56.242.202:8080//api/poc/${url}`, {
            params: this.model,
          })
          .then((res) => {
            console.log('GetSubActivitiesList/CN', res.data)
            // this.setSubActivitiesAll(res.data)
            this.tableParams.dataSource = res.data
            this.tableParams.loading = false
            if (this.$route.query.Type == 'Relaunch') {
              this.edit(res.data)
            }
          })
      }
    },
    changeEstimate(val, row) {
      console.log(val, row)
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          this.$set(this.tableParams.dataSource[i], 'Property10', val)
        }
      })
    },

    changeOptions(val, row) {
      console.log(val, row)
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          this.$set(this.tableParams.dataSource[i], 'Property11', val)
        }
      })
    },
    onChangePassPrice(e, row) {
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          console.log('onChangePassPrice', e.target.value)
          this.$set(this.tableParams.dataSource[i], 'PassThroughPrice', e.target.value)
        }
      })
      console.log(this.tableParams.dataSource)
    },
    onChangeServicePrice(e, row) {
      let text = 'Price'
      if (this.templateSelect.length > 0) {
        if (this.templateSelect[0].Name.indexOf('CN') != -1) {
          text = 'Property3'
        } else {
          text = 'Price'
        }
      }
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          console.log('onChangeServicePrice', e.target.value)
          this.$set(this.tableParams.dataSource[i], text, e.target.value)
        }
      })
    },
    onChangeDuration(e, row) {
      let text = 'Duration'
      if (this.templateSelect.length > 0) {
        if (this.templateSelect[0].Name.indexOf('CN') != -1) {
          text = 'Property2'
        } else {
          text = 'Duration'
        }
      }
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          this.$set(this.tableParams.dataSource[i], text, e.target.value)
          if ((item.ActivityNameCN == '项目管理')) {
            item.ActivityDescCN = '预计项目完成周期' + e.target.value + '个月，每月100,000元项目管理费。'
          }
        }
      })
    },
    onChangeScale(e, row) {
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          this.$set(this.tableParams.dataSource[i], 'Scale', e.target.value)
          // this.setSubActivitiesAll(this.tableParams.dataSource)
          // this.setSubActivitiesAll(this.selectionRows)
        }
      })
    },
    onChangeDisCount(e, row) {
      this.tableParams.dataSource.forEach((item, i) => {
        if (item.SubActivityID == row.SubActivityID) {
          this.$set(this.tableParams.dataSource[i], 'DisCount', e.target.value)
          // this.setSubActivitiesAll(this.tableParams.dataSource)
          // this.setSubActivitiesAll(this.selectionRows)
        }
      })
    },
    selectionChange(keys, rows) {
      this.selectionKeys = keys
      this.selectionRows = rows
      console.log(keys)
      this.setSubActivitiesAll(this.selectionRows)
    },
    saveSubActivitiesAll() {
      if (this.tableParams.dataSource.length > 0) {
        let array = []
        this.tableParams.dataSource.forEach((item) => {
          if (this.selectionKeys.includes(item.SubActivityID)) {
            array.push(item)
          }
        })
        console.log('saveSubActivitiesAll', array)
        this.setSubActivitiesAll(array)
      }
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

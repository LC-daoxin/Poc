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
        label="Pipeline"
        prop="proposalPipelineID"
      >
        <a-select
          allowClear
          @change="changePipeline"
          v-model="model.proposalPipelineID"
        >
          <a-select-option
            :value="item.TypeID"
            :key="item.TypeID"
            v-for="item in pipelineOptions"
          >{{ item.ActivetName }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        class="form-item"
        label="Project Type1"
        prop="proposalProject1ID"
      >
        <a-select
          allowClear
          :disabled="projectType1Disabled"
          @change="changeProjectType1"
          v-model="model.proposalProject1ID"
        >
          <a-select-option
            v-for="item in projectType1Options"
            :key="item.TypeID"
            :value="item.TypeID"
          >{{
            item.ActivetName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        class="form-item"
        label="Project Type2"
        prop="proposalProject2ID"
      >
        <a-select
          allowClear
          @change="changeProjectType2"
          :disabled="projectType2Disabled"
          v-model="model.proposalProject2ID"
        >
          <a-select-option
            v-for="item in projectType2Options"
            :key="item.TypeID"
            :value="item.TypeID"
          >{{
            item.ActivetName
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="Key Words"
        class="form-item"
      >
        <a-input
          allowClear
          v-model="model.keyWords"
        ></a-input>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-button
        class="search_btn"
        type="primary"
        icon="search"
        @click="loadData(model)"
      >Search</a-button>
      <!-- <a-button
        class="search_btn"
        icon="plus"
        type="primary"
        @click="openAddModal"
      > {{this.$t('add')}} </a-button> -->
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
      return {
        // data
        searchLabelCol: 9,
        searchWrapperCol: 15,
        selectionKeys: [],
        selectionRows: [],
        model: {
          proposalPipelineID: '',
          proposalProject1ID: '',
          proposalProject2ID: '',
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
          scroll: { x: 1050 },
          bordered: true,
          columns: [
            {
              title: 'Activity Name',
              dataIndex: 'ActivityName',
              align: 'center',
              width: 176,
              customRender: (text, row, index) => {
                return <b>{text}</b>
              },
            },
            {
              title: 'Activity Short Desc',
              dataIndex: 'ActivityDesc',
              align: 'center',
            },
            {
              title: 'Service Price',
              dataIndex: 'ServicePrice',
              align: 'center',
              width: 140,
              ellipsis: true,
              customRender: (text, row, index) => (
                <a-input
                  v-model:value={text}
                  onChange={e => this.onChangeServicePrice(e, row)}
                  style="margin: -5px 0"
                />
              ),
            },
            {
              title: 'Pass Through Price',
              dataIndex: 'PassThroughPrice',
              align: 'center',
              width: 140,
              ellipsis: true,
              customRender: (text, row, index) => (
                <a-input
                  v-model:value={text}
                  onChange={e => this.onChangePassPrice(e, row)}
                  style="margin: -5px 0"
                />
              ),
            },
            {
              title: 'Time',
              width: 260,
              align: 'center',
              customRender: (text, row, index) => (
                <a-range-picker
                  format="YYYY-MM-DD"
                  placeholder={['Start Time', 'End Time']}
                  onChange={(val) => this.onChangeTime(val, row)}
                />
              ),
            },
            {
              title: 'Duration',
              dataIndex: 'Duration',
              width: 120,
              align: 'center',
              customRender: (text, row, index) => <span>{text}</span>,
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
      'model.proposalPipelineID'(val) {
        console.log('model.proposalPipelineID', val)
        val ? (this.projectType1Disabled = false) : (this.projectType1Disabled = true)
      },
      'model.proposalProject1ID'(val) {
        console.log('model.proposalProject1ID', val)
        val ? (this.projectType2Disabled = false) : (this.projectType2Disabled = true)
      },
    },
    mounted() {
      this.getProposalPipeLine()
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
      // 选择Pipeline
      changePipeline(id) {
        if (id) {
          this.model.proposalProject1ID = ''
          this.model.proposalProject2ID = ''
          this.ProposalProject1ID(id)
        }
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
          proposalProject1ID: '',
          proposalProject2ID: '',
          keyWords: '',
        }
        this.loadData(this.model)
      },
      loadData(model = {}) {
        this.tableParams.loading = true
        axios
          .get('http://123.56.242.202:8080/api/poc/GetActivitiesList', {
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
        axios.get('http://123.56.242.202:8080/api/poc/GetProposalPipeLine', {}).then((res) => {
          console.log('getProposalPipeLine', res)
          this.pipelineOptions = res.data
        })
      },
      ProposalProject1ID(id) {
        axios.get(`http://123.56.242.202:8080/api/poc/GetProposalProjectType1?ProposalPipelineID=${id}`).then((res) => {
          console.log('GetProposalProjectType1', res)
          this.projectType1Options = res.data
        })
      },
      GetProposalProjectType2(id) {
        // this.tableParams.loading = true
        axios.get(`http://123.56.242.202:8080/api/poc/GetProposalProjectType2?ProposalProject1ID=${id}`).then((res) => {
          console.log('GetProposalProjectType2', res)
          this.projectType2Options = res.data
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
            this.$set(this.tableParams.dataSource[i], 'ServicePrice', e.target.value)
            if (this.selectionRows.length > 0) {
              this.$emit('updateSub')
            }
          }
        })
      },
      onChangePassPrice(e, row) {
        this.tableParams.dataSource.forEach((item, i) => {
          if (item.ActivityID == row.ActivityID) {
            this.$set(this.tableParams.dataSource[i], 'PassThroughPrice', e.target.value)
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

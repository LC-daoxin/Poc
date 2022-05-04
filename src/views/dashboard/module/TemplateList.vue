<template>
  <div class="activities">
    <!-- <a-form-model
      class="processCenter"
      ref="form"
      layout="inline"
      :model="model"
      :labelCol="{ span: searchLabelCol }"
      :wrapperCol="{ span: searchWrapperCol }"
    >
      <a-form-model-item
        label="Key Words"
        class="form-item"
      >
        <a-input
          allowClear
          v-model="model.keyWords"
        ></a-input>
      </a-form-model-item>
      <a-form-model-item
        label="Pipeline"
        prop="activityID"
      >
        <a-select
          allowClear
          style="width: 400px"
          :maxTagCount="3"
          mode="multiple"
          @change="changePipeline"
        >
          <a-select-option
            :value="item.ActivityID"
            :key="item.ActivityID"
            v-for="item in activitiesSelect"
          >{{ item.ActivityName }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-button
        class="search_btn"
        type="primary"
        icon="search"
        @click="loadData(model)"
      >Search</a-button>
      <a-button
        class="search_btn"
        icon="plus"
        type="primary"
        @click="openAddModal"
      > {{this.$t('add')}} </a-button>
      <a-button
        class="search_btn"
        icon="delete"
        @click="refresh(false)"
      >Reset</a-button>
    </div> -->
    <public-table
      class="table"
      :pagination="false"
      :params="tableParams"
      :multiple="false"
      :rowSelection="true"
      :rowKey="(record) => record.ID"
      @pageChange="loadData"
      @changeColumns="changeColumns"
      @selectionChange="selectionChange"
    ></public-table>
  </div>
</template>

<script>
  import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
  import { PublicTable } from '@/components'
  import { mapState, mapMutations } from 'vuex'
  import _ from 'lodash'
  import axios from 'axios'

  export default {
    name: 'TemplateList',
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
          activityID: '',
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
          scroll: { x: 900 },
          bordered: true,
          columns: [
            {
              title: 'Template Name',
              dataIndex: 'Name',
              align: 'center',
              width: 250,
              customRender: (text, row, index) => {
                return <b>{text}</b>
              },
            },
            {
              title: 'Template Desc',
              dataIndex: 'TempDesc',
              align: 'center',
              ellipsis: true,
            }
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
    },
    mounted() {
      this.loadData()
    },
    methods: {
      ...mapMutations({
        setTemplateSelect(commit, select) {
          console.log('setTemplateSelect', select)
          return commit('poc/setTemplateSelect', select)
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
      changePipeline(list) {
        console.log(list)
        if (list.length > 0) {
          this.model.activityID = list.join(',')
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
        this.loadData(this.model)
      },
      loadData(model = {}) {
        this.tableParams.loading = true
        axios.get('http://123.56.242.202:8080/api/poc/GetDocumentsTempList').then((res) => {
          console.log('loadData', res)
          this.tableParams.dataSource = res.data
          this.tableParams.loading = false
        })
      },
      selectionChange(keys, rows) {
        this.selectionKeys = keys
        this.selectionRows = rows
        this.setTemplateSelect(rows)
      },
      checkSelect() {
        return new Promise((resolve, reject) => {
          if (this.selectionRows.length > 0) {
            return resolve(true)
          } else {
            this.$message.warning('Please select a template！')
            return reject(false)
          }
        })
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

<template>
  <page-header-wrapper>
    <a-form-model
      class="processCenter"
      ref="form"
      layout="inline"
      :model="model"
      :labelCol="{ span: searchLabelCol }"
      :wrapperCol="{ span: searchWrapperCol }"
    >
      <a-form-model-item class="form-item" :label="$t('year')" prop="year">
        <a-select allowClear v-model="model.year">
          <a-select-option :value="2021">2021</a-select-option>
          <a-select-option :value="2020">2020</a-select-option>
          <a-select-option :value="2019">2019</a-select-option>
          <a-select-option :value="2018">2018</a-select-option>
          <a-select-option :value="2017">2017</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item" :label="$t('month')" prop="month">
        <a-select allowClear v-model="model.month">
          <a-select-option v-for="item in monthOptions" :key="item.value" :value="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item class="form-item" :label="$t('type')" prop="type">
        <a-select allowClear v-model="model.type">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option v-for="item in typeOptions" :key="item.value" :value="item.value">{{
            item.label
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :label="$t('description')" class="form-item">
        <a-input allowClear v-model="model.description"></a-input>
      </a-form-model-item>
    </a-form-model>
    <div class="search-approval-wrapper">
      <a-button class="search_btn" type="primary" icon="search" @click="loadData(1, 10, model)">{{ $t('search') }}</a-button>
      <a-button class="search_btn" icon="plus" type="primary" @click="openAddModal"> {{this.$t('add')}} </a-button>
      <a-button class="search_btn" icon="delete" @click="refresh(false)">{{ $t('clear') }}</a-button>
    </div>
    <public-table
      :pagination="pagination"
      :params="tableParams"
      :rowSelection="false"
      @pageChange="loadData"
      @selectionChange="selectionChange"
    ></public-table>
    <configuration-modal :typeOptions="typeOptions" @save="handleSave" @add="handleAdd" ref="model"/>
  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { mapState } from 'vuex'
import { PublicTable } from '@/components'
import ConfigurationModal from './ConfigurationModal'

export default {
  name: 'Configuration',
  components: {
    PageHeaderWrapper,
    PublicTable,
    ConfigurationModal
  },
  data() {
    return {
      // data
      searchLabelCol: 9,
      searchWrapperCol: 15,
      selectionKeys: [],
      month: '',
      model: {
        year: 2021,
        month: 0,
        type: 0,
        description: '',
      },
      monthOptions: [
        {
          label: '全部',
          value: 0,
        },
        {
          label: '一月',
          value: 1,
        },
        {
          label: '二月',
          value: 2,
        },
        {
          label: '三月',
          value: 3,
        },
        {
          label: '四月',
          value: 4,
        },
        {
          label: '五月',
          value: 5,
        },
        {
          label: '六月',
          value: 6,
        },
        {
          label: '七月',
          value: 7,
        },
        {
          label: '八月',
          value: 8,
        },
        {
          label: '九月',
          value: 9,
        },
        {
          label: '十月',
          value: 10,
        },
        {
          label: '十一月',
          value: 11,
        },
        {
          label: '十二月',
          value: 12,
        },
      ],
      typeOptions: [
        {
          label: '星期一',
          value: 1,
        },
        {
          label: '星期二',
          value: 2,
        },
        {
          label: '星期三',
          value: 3,
        },
        {
          label: '星期四',
          value: 4,
        },
        {
          label: '星期五',
          value: 5,
        },
        {
          label: '星期六',
          value: 6,
        },
        {
          label: '星期日',
          value: 7,
        },
        {
          label: '元旦',
          value: 8,
        },
        {
          label: '春节',
          value: 9,
        },
        {
          label: '清明节',
          value: 10,
        },
        {
          label: '劳动节',
          value: 11,
        },
        {
          label: '端午节',
          value: 12,
        },
        {
          label: '中秋节',
          value: 13,
        },
        {
          label: '国庆节',
          value: 14,
        },
        {
          label: '工作日',
          value: 15,
        },
        {
          label: '非工作日',
          value: 16,
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
        scroll: { x: 1000 },
        bordered: true,
        columns: [
          {
            title: 'No.',
            i18n: 'No.',
            width: 50,
            align: 'center',
            customRender: (text, row, index) => index + 1,
          },
          {
            title: this.$t('vacation'), // 假期
            dataIndex: 'date',
            i18n: 'vacation',
            align: 'center',
            width: 200,
          },
          {
            title: this.$t('year'), // 年份
            i18n: 'year',
            width: 130,
            align: 'center',
            customRender: (text, row, index) => {
              return row.date.split('-')[0]
            },
          },
          {
            title: this.$t('type'), // 类型
            dataIndex: 'type',
            i18n: 'type',
            width: 160,
            align: 'center',
            customRender: (text) => (
              <a-tag color="blue" style="margin-right: 0;">
                {this.vacationType(text)}
              </a-tag>
            ),
          },
          {
            title: this.$t('description'), // 备注
            dataIndex: 'description',
            i18n: 'description',
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('operation'), // 操作
            i18n: 'operation',
            scopedSlots: { customRender: 'action' },
            fixed: 'right',
            width: 220,
            align: 'center',
            customRender: (text, record) => {
              const renderElement = []
              const { id } = record
              renderElement.push(
								<a-button
									icon="edit"
									type="primary"
									size="small"
									onClick={() => {
										this.openEditModal(record);
									}}
								>
									{this.$t('edit')}
								</a-button>
							);
              renderElement.push(
                <a-popconfirm
                  title="是否确认删除此项?"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => {
                    this.handleDelete(id)
                  }}
                >
                  <a-button icon="delete" type="danger" size="small">
                    {this.$t('delete')}
                  </a-button>
                </a-popconfirm>
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
  mounted() {},
  methods: {
    openAddModal() {
      this.$refs.model.add()
    },
    openEditModal(row) {
      this.$refs.model.edit(row)
    },
    vacationType(type) {
      for (let item of this.typeOptions) {
        if (item.value === type) {
          return item.label
        }
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
        year: 2021,
        month: 0,
        type: 0,
        description: '',
      }
      this.loadData(1, 10, this.model)
    },
    handleDelete(id) {
      this.refresh()
    },
    handleSave(id) {
      this.refresh()
    },
    handleAdd(id) {
      this.refresh()
    },
    loadData(pageNo = 1, pageSize = 10, model = {}) {
      this.tableParams.loading = true
      this.$http
        .get('/common/vacation', {
          params: { pageNo: 1, pageSize: 10, model },
        })
        .then((res) => {
          console.log('loadData', res)
          const { data, pageNo, pageSize, totalCount, isSuccess } = res.result
          if (isSuccess) {
            this.tableParams.dataSource = data
            this.pagination.total = totalCount
            this.pagination.current = pageNo
            this.pagination.pageSize = pageSize
          }
          this.tableParams.loading = false
        })
    },
    selectionChange(keys, rows) {
      this.selectionKeys = keys
    },
  },
  created() {
    this.refresh()
  },
}
</script>

<style lang="less" scoped>
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
</style>

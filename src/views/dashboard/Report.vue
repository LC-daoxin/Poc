<template>
  <page-header-wrapper>
    <a-form-model
			ref="form"
			layout="inline"
			:model="model"
			:labelCol="{span: searchLabelCol}"
			:wrapperCol="{span: searchWrapperCol}"
		>
			<a-form-model-item class="form-item" :label="$t('contract_No')" prop="contractNo">
				<a-input allowClear v-model="model.contractNo"></a-input>
			</a-form-model-item>
			<a-form-model-item class="form-item">
				<a-button type="primary" icon="search" @click="loadData(1, 10, model)">{{ $t('search') }}</a-button>
			</a-form-model-item>
			<a-form-model-item class="form-item">
				<a-button icon="delete" @click="refresh()">{{ $t('clear') }}</a-button>
			</a-form-model-item>
      <a-form-model-item class="form-item">
				<a-button icon="export" @click="handleExport">{{ $t('export') }}</a-button>
			</a-form-model-item>
		</a-form-model>
    <public-table
      :pagination="pagination"
      :params="tableParams"
      :rowSelection="true"
      @pageChange="loadData"
      @selectionChange="selectionChange"
    ></public-table>
  </page-header-wrapper>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { mapState } from 'vuex'
import { PublicTable } from '@/components'
import { fileExport } from '@/utils/util'

export default {
  name: 'Report',
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
      model: {
        contractNo: '123,345,456,678'
      },
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
            title: this.$t('contract_No'), // 合同号
            dataIndex: 'contract_No',
            i18n: 'contract_No',
            align: 'center',
            width: 150,
            sorter: (a, b) => a.contract_No - b.contract_No,
          },
          {
            title: this.$t('contract_Type'), // 合同类型
            dataIndex: 'contract_Type',
            i18n: 'contract_Type',
            width: 130,
            align: 'center',
          },
          {
            title: this.$t('business_Area'), // 商业面积
            dataIndex: 'business_Area',
            i18n: 'business_Area',
            width: 130,
            align: 'center',
          },
          {
            title: this.$t('leasing_Company_Code'), // 公司编码
            dataIndex: 'leasing_Company_Code',
            i18n: 'leasing_Company_Code',
            width: 180,
            align: 'center',
          },
          {
            title: this.$t('dealer_Name'), // 经销商名称
            dataIndex: 'dealer_Name',
            i18n: 'dealer_Name',
            width: 150,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('assignment'), // 任务
            dataIndex: 'assignment',
            i18n: 'assignment',
            width: 140,
            align: 'center',
          },
          {
            title: this.$t('account'), // 帐户
            dataIndex: 'account',
            i18n: 'account',
            width: 120,
            align: 'center',
          },
          {
            title: this.$t('account_Desp'), // 账户管理
            dataIndex: 'account_Desp',
            i18n: 'account_Desp',
            width: 150,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('currency'), // 货币
            dataIndex: 'currency',
            i18n: 'currency',
            width: 80,
            align: 'center',
          },
          {
            title: this.$t('document_No'), // 文档编码
            dataIndex: 'document_No',
            i18n: 'document_No',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('posting_Date'), // 发布日期
            dataIndex: 'posting_Date',
            i18n: 'posting_Date',
            width: 170,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('value_Date'), // 起息日期
            dataIndex: 'value_Date',
            i18n: 'value_Date',
            width: 170,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('documentText'), // 文档文本
            dataIndex: 'documentText',
            i18n: 'documentText',
            width: 130,
            align: 'center',
            ellipsis: true,
          },
          {
            title: this.$t('dc'), // 生产日期码
            dataIndex: 'dc',
            i18n: 'dc',
            width: 100,
            align: 'center'
          },
          {
            title: this.$t('debit'), // 借款
            dataIndex: 'debit',
            i18n: 'debit',
            width: 100,
            align: 'center'
          },
          {
            title: this.$t('credit'), // 贷款
            dataIndex: 'credit',
            i18n: 'credit',
            width: 100,
            align: 'center'
          },
          {
            title: this.$t('net'), // 净值
            dataIndex: 'net',
            i18n: 'net',
            width: 100,
            align: 'center'
          },
          // {
          //   title: this.$t('operation'), // 操作
          //   i18n: 'operation',
          //   scopedSlots: { customRender: 'action' },
          //   fixed: 'right',
          //   width: 150,
          //   align: 'center',
          //   customRender: (text, record) => {
          //     const renderElement = []
          //     const { id } = record
          //     renderElement.push(
          //       <a-popconfirm
          //         title="是否确认删除此项?"
          //         okText="确定"
          //         cancelText="取消"
          //         onConfirm={() => {
          //           this.handleDelete(id)
          //         }}
          //       >
          //         <a-button icon="delete" type="danger" size="small">
          //           {this.$t('delete')}
          //         </a-button>
          //       </a-popconfirm>
          //     )
          //     return <a-space>{renderElement}</a-space>
          //   },
          // }
        ],
      }
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
    setColumns(lang) {
      console.log(lang)
      this.tableParams.columns.forEach((item) => {
        console.log(this.$t(item.i18n))
        item.i18n ? (item.title = this.$t(item.i18n)) : ''
      })
    },
    refresh() {
			this.model = {
        contractNo: ''
      }
			this.loadData(1, 10, this.model)
		},
    loadData(pageNo = 1, pageSize = 10, model = {}) {
      this.tableParams.loading = true
      this.$http
        .get('/common/report', {
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
    async handleExport() {
			const res = await this.$http
        .get('/common/export', {
          params: {},
        })
        console.log('handleExport', res)
			fileExport(res.data);
		}
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
</style>

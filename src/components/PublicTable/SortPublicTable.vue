<script>
  import Sortable from 'sortablejs'
  export default {
    props: {
      params: Object,
      rowSelection: Boolean | Object,
      pagination: {
        type: Object,
        default: () => {
          return {
            total: 0,
            current: 1,
            pageSize: 10,
          }
        },
      },
    },
    data() {
      return {
        renderRowSelection: {
          fixed: true,
          selectedRowKeys: [],
          onChange: (selectedRowKeys, selectedRows) => {
            this.renderRowSelection.selectedRowKeys = selectedRowKeys
            this.$emit('selectionChange', selectedRowKeys, selectedRows)
          },
        },
      }
    },
    mounted() {
      this.initSortable()
    },
    methods: {
      initSortable() {
        var el = this.$el.querySelector('.sort-table tbody')
				const that = this
        Sortable.create(el, {
          handle: '.ant-table-row',
          animation: 150,
          group: { name: 'name', pull: true, put: true },
          onUpdate: function (evt) {
						console.log(evt, that.params.dataSource)
					},
          // 开始拖拽的时候
          onStart: function (evt) {},
          onAdd: function (evt) {},
          onRemove: function (evt) {},
        })
      },
      renderAlert(createElement) {
        if (!this.rowSelection) return null
        return createElement(
          'a-alert',
          {
            props: {
              showIcon: true,
            },
            style: {
              marginBottom: '10px',
            },
          },
          [
            createElement('template', { slot: 'message' }, [
              createElement('span', { style: { marginRight: '12px' } }, [
                '已选择',
                this.renderSelectionCount(createElement),
                this.renderClear(createElement),
              ]),
            ]),
          ]
        )
      },
      renderSelectionCount(createElement) {
        return createElement(
          'a',
          { style: { fontWeight: 'bold', marginLeft: '10px' } },
          this.renderRowSelection.selectedRowKeys.length
        )
      },
      renderClear(createElement) {
        if (this.renderRowSelection.selectedRowKeys.length <= 0) return null
        return createElement(
          'a',
          {
            style: { marginLeft: '24px' },
            on: {
              click: () => {
                this.renderRowSelection.selectedRowKeys = []
                this.$emit('selectionChange', [], [])
              },
            },
          },
          '清空'
        )
      },
      renderTable(createElement) {
        const size = 'small'
        const rowSelection = this.createRowSelection()

        return createElement('a-table', {
          class: {
            'sort-table': true,
          },
          props: {
            size,
            rowSelection,
            pagination: false,
            rowKey: (record) => record.id,
            ...this.params,
          },
        })
      },
      createRowSelection() {
        const type = typeof this.rowSelection
        if (type && type === 'object') {
          return type
        }
        if (type && type === 'boolean' && this.rowSelection) {
          return this.renderRowSelection
        }
        return null
      },
      renderPagination(createElement) {
        const size = 'small'
        const showSizeChanger = true
        const pageSizeOptions = ['10', '20', '30', '40']
        const style = { marginTop: '20px' }

        return createElement('a-pagination', {
          style,
          props: {
            size,
            showSizeChanger,
            total: this.pagination.total,
            current: this.pagination.current,
            pageSize: this.pagination.pageSize,
            pageSizeOptions,
            showTotal: (total, range) => `共 ${total} 项`,
          },
          on: {
            change: (page, pageSize) => {
              this.$emit('pageChange', page, pageSize)
            },
            showSizeChange: (current, size) => {
              this.$emit('pageChange', current, size)
            },
          },
        })
      },
    },
    render(createElement) {
      const paginationWrapper = createElement(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'flex-end',
          },
        },
        [this.renderPagination(createElement)]
      )
      return createElement('div', [this.renderAlert(createElement), this.renderTable(createElement), paginationWrapper])
    },
  }
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

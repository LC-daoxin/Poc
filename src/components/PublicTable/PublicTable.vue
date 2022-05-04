<script>
  import Sortable from 'sortablejs'
  export default {
    props: {
      params: Object,
      rowSelection: Boolean | Object,
      rowKey: {
        type: Function,
        default: (record) => record.id
      },
			draggableColumn: {
				type: Boolean,
        default: false
			},
			draggableRow: {
				type: Boolean,
        default: false
			},
      fixed: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      pagination: {
        type: Object | Boolean,
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
          fixed: this.fixed ? true : false,
          type: this.multiple ? 'checkbox' : 'radio',
          selectedRowKeys: [],
          onChange: (selectedRowKeys, selectedRows) => {
            this.renderRowSelection.selectedRowKeys = selectedRowKeys
            this.$emit('selectionChange', selectedRowKeys, selectedRows)
          },
        },
      }
    },
    mounted() {
			if (this.draggableColumn) {
				this.initColumnsSortable()
			}
      if (this.draggableRow) {
				this.initRowSortable()
			}
    },
    methods: {
      initColumnsSortable() {
        var el = this.$el.querySelector('.sort-th')
        const that = this
        Sortable.create(el, {
          handle: 'th',
          animation: 150,
          group: { name: 'name', pull: true, put: true },
          onUpdate: function (evt) {
            that.$emit('changeColumns', evt)
          },
          // 开始拖拽的时候
          onStart: function (evt) {},
          onAdd: function (evt) {},
          onRemove: function (evt) {},
        })
      },
      initRowSortable() {
        var el = this.$el.querySelector('.sort-table tbody')
        const that = this
        Sortable.create(el, {
          handle: '.ant-table-row',
          animation: 150,
          group: { name: 'name', pull: true, put: true },
          onUpdate: function (evt) {
            that.$emit('changeRow', evt)
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
            rowKey: this.rowKey,
            customHeaderRow: (column) => {
              return {
                class: {
                  'sort-th': true,
                },
                onClick: () => {
                  console.log(column)
                },
              }
            },
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
      return createElement('div', [
        this.renderAlert(createElement),
        this.renderTable(createElement),
        this.pagination ? paginationWrapper : '',
      ])
    },
  }
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>

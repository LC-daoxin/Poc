<template>
  <s-modal
    centered
    :title="name + '选择'"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="close"
    cancelText="关闭">

    <a-row :gutter="18">
      <a-col :span="16">
        <!-- 查询区域 -->
        <a-form layout="inline" class="inline-form">
          <!-- 固定条件 -->
          <a-form-item :label="(queryParamText||name)">
            <a-input v-model="queryParam[queryParamCode||valueKey]" :placeholder="'请输入' + (queryParamText||name)" @pressEnter="searchQuery"/>
          </a-form-item>
          <!-- 动态生成的查询条件 -->
          <select-query-item v-if="queryConfig.length>0" v-show="showMoreQueryItems" :queryParam="queryParam" :queryConfig="queryConfig" @pressEnter="searchQuery"/>
          <!-- 按钮 -->
          <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          <a v-if="queryConfig.length>0" @click="showMoreQueryItems=!showMoreQueryItems" style="margin-left: 8px">
            {{ showMoreQueryItems ? '收起' : '展开' }}
            <a-icon :type="showMoreQueryItems ? 'up' : 'down'"/>
          </a>
        </a-form>

        <a-table
          size="middle"
          bordered
          :rowKey="rowKey"
          :columns="innerColumns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ y: 240 }"
          :rowSelection="{selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          @change="handleTableChange">
        </a-table>

      </a-col>
      <a-col :span="8">
        <a-card :title="'已选' + name" :bordered="false" :head-style="{padding:0}" :body-style="{padding:0}">

          <a-table size="middle" :rowKey="rowKey" bordered v-bind="selectedTable">
              <span slot="action" slot-scope="text, record, index">
                <a @click="handleDeleteSelected(record, index)">删除</a>
              </span>
          </a-table>

        </a-card>
      </a-col>
    </a-row>
  </s-modal>
</template>

<script>
  import Ellipsis from '@/components/Ellipsis'
  import { cloneObject, pushIfNotExist,filterObj } from '@/utils/util'
  import { STable,SModal } from '@/components'
  import SelectQueryItem from './SelectQueryItem'
  import { getAction,postAction } from '@/utils/request'
   import postAction1 from '@/api/masterdata/queryDeptUserList.js'

  export default {
    name: 'SelectComponentModal',    
    components: {Ellipsis, SelectQueryItem,SModal},
    props: {
      value: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: false
      },
      valueKey: {
        type: String,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 900
      },

      name: {
        type: String,
        default: ''
      },
      basePort: {
        type: String,
        required: true,
        default: '8022'
      },
      listUrl: {
        type: String,
        required: true,
        default: ''
      },
      // 根据 value 获取显示文本的地址，例如存的是 username，可以通过该地址获取到 realname
      valueUrl: {
        type: String,
        default: ''
      },
      displayKey: {
        type: String,
        default: null
      },
      columns: {
        type: Array,
        required: true,
        default: () => []
      },
      // 查询条件Code
      queryParamCode: {
        type: String,
        default: null
      },
      // 查询条件文字
      queryParamText: {
        type: String,
        default: null
      },
      extendQueryParam: {
        type: Object,
        default: () => {}
      },   
      // 查询配置
      queryConfig: {
        type: Array,
        default: () => []
      },
      rowKey: {
        type: String,
        default: 'id'
      },
      // 过长裁剪长度，设置为 -1 代表不裁剪
      ellipsisLength: {
        type: Number,
        default: 12
      },
    },
    data() {
      return {
        innerValue: [],
        // 已选择列表
        selectedTable: {
          pagination: false,
          scroll: { y: 240 },
          columns: [
            {
              ...this.columns[0],
              width: this.columns[0].widthRight || this.columns[0].width,
            },
            { title: '操作', dataIndex: 'action', align: 'center', width: 60, scopedSlots: { customRender: 'action' }, }
          ],
          dataSource: [],
        },
        renderEllipsis: (value) => (<ellipsis length={this.ellipsisLength}>{value}</ellipsis>),
        url: { port: this.basePort ,list: this.listUrl },
        /* 查询条件 */
        queryParam: {},
        /* 数据源 */
        dataSource:[],
        /* 分页参数 */
        ipagination: {
          current: 1,
          size: '10',
          sizeOptions: ['5', '10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '条'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
         /* 排序参数 */
        isorter:{
          sort: 'create_time',
          order: 'descending',
        },
        /* 筛选参数 */
        filters: {},
        /* table加载状态 */
        loading:false,
        /* table选中keys*/
        selectedRowKeys: [],
        /* table选中records*/
        selectionRows: [],      
        /* 查询折叠 */
        toggleSearchStatus:false,
        /* 高级查询条件生效状态 */
        superQueryFlag:false,       
         /* 高级查询条件 */
        superQueryParams: '', 
        /** 高级查询拼接方式 */
        superQueryMatchType: 'and',
        options: [],
        dataSourceMap: {},
        showMoreQueryItems: false,
      }
    },
    computed: {
      // 表头
      innerColumns() {
        let columns = cloneObject(this.columns)
        columns.forEach(column => {
          // 给所有的列加上过长裁剪
          if (this.ellipsisLength !== -1) {
            column.customRender = (text) => this.renderEllipsis(text)
          }
        })
        //  this.loadData();
        return columns
      },
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(val) {
            this.loadData();
          this.innerValue = cloneObject(val)
          this.selectedRowKeys = []
          this.valueWatchHandler(val)
          this.queryOptionsByValue(val)
          // this.loadData();
        }
      },
      dataSource: {
        deep: true,
        handler(val) {
          this.emitOptions(val)
          this.valueWatchHandler(this.innerValue)
          // this.loadData();
        }
      },
      selectedRowKeys: {
        immediate: true,
        deep: true,
        handler(val) {
          // this.loadData();
          this.selectedTable.dataSource = val.map(key => {
            for (let data of this.dataSource) {
              if (data[this.rowKey] === key) {
                pushIfNotExist(this.innerValue, data[this.valueKey])
                return data
              }
            }
            for (let data of this.selectedTable.dataSource) {
              if (data[this.rowKey] === key) {
                pushIfNotExist(this.innerValue, data[this.valueKey])
                return data
              }
            }
            console.warn('未找到选择的行信息，key：' + key)
            return {}
          })
        },
      }
    },

    methods: {
      loadData(arg) {          
        if(!this.url.list){
          this.$message.error("请设置url.list属性!")
          return
        }
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        
        var params = this.getQueryParams();//查询条件
        console.log(params)
         var params1={
           current:params.current,
           deptId:params.deptId,
           size:params.size*1,
           userName:params.name,
         }
        this.loading = true;
        console.log({port:this.url.port,url:this.url.list,parameter:params1})
        postAction1.page(params1).then((res) => {
          if (res.isSuccess) {
            this.dataSource = res.data.records;
            this.ipagination.total = res.data.total;
          }
          else
          {
            this.$message.warning(res.message)
          }
          this.loading = false;
        })
      },
      getQueryParams() {        
        //获取查询条件
        let sqp = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        var param = Object.assign(sqp, this.queryParam,this.extendQueryParam, this.isorter ,this.filters);
        // param.field = this.getQueryField();
        param.current = this.ipagination.current;
        param.size = this.ipagination.size;
        return filterObj(param);
      },
      getQueryField() {        
        var str = "id,";
        this.columns.forEach(function (value) {
          str += "," + value.dataIndex;
        });
        return str;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      searchQuery() {
        this.loadData(1)
      },
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      /** 关闭弹窗 */
      close() {
        this.$emit('update:visible', false)
      },

      valueWatchHandler(val) {
        val.forEach(item => {
          this.dataSource.concat(this.selectedTable.dataSource).forEach(data => {
            if (data[this.valueKey] === item) {
              pushIfNotExist(this.selectedRowKeys, data[this.rowKey])
            }
          })
        })
      
      },

      queryOptionsByValue(value) {        
        if (!value || value.length === 0) {
          return
        }
        // 判断options是否存在value，如果已存在数据就不再请求后台了
        let notExist = false
        for (let val of value) {
          let find = false
          for (let option of this.options) {
            if (val === option.value) {
              find = true
              break
            }
          }
          if (!find) {
            notExist = true
            break
          }
        }
        if (!notExist) return        
        postAction(
          {
            port:this.basePort,
            url:this.valueUrl || this.listUrl,
            parameter:{          
              [this.valueKey]: value.join(','),
              current: 1,
              size: value.length
            }
          }
          ).then((res) => {
          if (res.isSuccess) {
            let dataSource = res.data
            if (!(dataSource instanceof Array)) {
              dataSource = res.data.records
            }
            this.emitOptions(dataSource, (data) => {
              pushIfNotExist(this.innerValue, data[this.valueKey])
              pushIfNotExist(this.selectedRowKeys, data[this.rowKey])
              pushIfNotExist(this.selectedTable.dataSource, data, this.rowKey)
            })
          }
        })
      },

      emitOptions(dataSource, callback) {
        dataSource.forEach(data => {
          let key = data[this.valueKey]
          this.dataSourceMap[key] = data
          pushIfNotExist(this.options, { label: data[this.displayKey || this.valueKey], value: key }, 'value')
          typeof callback === 'function' ? callback(data) : ''
        })
        this.$emit('options', this.options, this.dataSourceMap)
      },

      /** 完成选择 */
      handleOk() {
        let value = this.selectedTable.dataSource.map(data => data[this.valueKey])
        console.log(value)
        this.$emit('input', value)
        this.close()
      },
      /** 删除已选择的 */
      handleDeleteSelected(record, index) {
        this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record[this.rowKey]), 1)        
        this.selectedTable.dataSource.splice(this.selectedTable.dataSource.indexOf(record), 1)
        this.innerValue.splice(this.innerValue.indexOf(record[this.valueKey]), 1)        
      },

      customRowFn(record) {
        return {
          on: {
            click: () => {
              let key = record[this.rowKey]
              if (!this.multiple) {
                this.selectedRowKeys = [key]
                this.selectedTable.dataSource = [record]
              } else {
                let index = this.selectedRowKeys.indexOf(key)
                if (index === -1) {
                  this.selectedRowKeys.push(key)
                  this.selectedTable.dataSource.push(record)
                } else {
                  this.handleDeleteSelected(record, index)
                }
              }
            }
          }
        }
      },

    }
  }
</script>
<style lang="less" scoped>
  .full-form-item {
    display: flex;
    margin-right: 0;

    /deep/ .ant-form-item-control-wrapper {
      flex: 1 1;
      display: inline-block;
    }
  }

  .inline-form {
    /deep/ .ant-form-item {
      margin-bottom: 12px;
    }

    /deep/ .ant-form-item-label {
      line-height: 32px;
      width: auto;
    }

    /deep/ .ant-form-item-control {
      height: 32px;
      line-height: 32px;
    }
  }
</style>
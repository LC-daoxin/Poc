<template>
  <div>
    <a-form-model
      layout="inline"
      :model="postData.model"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      style="margin-bottom: 20px"
    >
      <a-form-model-item label="">
        <a-input-group
          class="search"
          compact
        >
          <a-select
            class="search_select"
            v-model="searchValue"
            @change="changeOption"
          >
            <a-select-option
              v-for="option in searchOption"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</a-select-option>
          </a-select>
          <a-input
            class="search_input"
            v-model.trim="postData.model[searchValue]"
            allowClear
            @pressEnter="getSourceData"
          />
          <a-button
            class="search_btn"
            type="primary"
            @click="getSourceData"
          >搜索</a-button>
        </a-input-group>
      </a-form-model-item>
    </a-form-model>
    <a-table
      bordered
      :loading="loading"
      size="small"
      :columns="columns"
      :scroll="{ x: 1040, y: 320 }"
      :data-source="dataSource"
      :row-selection="rowSelection"
      :rowKey="(record) => record.id"
      :pagination="false"
    ></a-table>
    <a-pagination
      show-size-changer
      :page-size-options="pageSizeOptions"
      size="small"
      style="margin-top: 10px"
      :total="total"
      :page-size="postData.size"
      :show-total="(total, range) => `共 ${total} 项`"
      @showSizeChange="showPageChange"
      @change="pageChange"
    >
      <template
        slot="buildOptionText"
        slot-scope="props"
      >
        <span v-if="props.value !== total">{{ props.value }}条/页</span>
        <span v-if="props.value === total">全部</span>
      </template>
    </a-pagination>
  </div>
</template>

<script>
  import api from '@/api/masterdata/dept'
  import mixin from '../mixin.vue'
  export default {
    mixins: [mixin],
    data() {
      return {
        columns: [
          {
            title: '部门名称',
            dataIndex: 'departName',
            align: 'center',
            sorter: true,
            width: 240,
            ellipsis: true,
          },
          {
            title: '部门ID',
            dataIndex: 'departmentId',
            width: 100,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '机构编码',
            dataIndex: 'orgCode',
            width: 100,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '所属分部ID',
            dataIndex: 'subCompanyId',
            width: 100,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '部门名称缩写',
            dataIndex: 'departNameAbbr',
            width: 300,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            width: 200,
            ellipsis: true,
          },
        ],
        searchOption: [
          {
            label: '部门名称',
            value: 'departName',
          },
          {
            label: '部门ID',
            value: 'departmentId',
          },
          {
            label: '机构编码',
            value: 'orgCode',
          },
          {
            label: '所属分部ID',
            value: 'subCompanyId',
          },
          {
            label: '部门名称缩写',
            value: 'departNameAbbr',
          },
        ],
        searchValue: 'departName',
      }
    },
    methods: {
      async getSourceData() {
        this.htmlCol()
        this.loading = true
        const res = await api.page(this.postData)
        const { code, msg, data } = res
        console.log(this.postData)
        if (code === '0001') {
          this.total = data.total
          this.dataSource = data.records
        } else {
          this.$message.error(msg)
        }
        this.loading = false
      },
    },
  }
</script>

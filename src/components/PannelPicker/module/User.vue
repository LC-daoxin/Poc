<template>
  <div>
    <a-form-model
      layout="inline"
      :model="postData.model"
      :destroyOnClose="true"
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
      :key="key"
      size="small"
      :columns="columns"
      :scroll="{ x: 1240, y: 320 }"
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
  import api from '@/api/masterdata/user'
  import mixin from '../mixin.vue'

  export default {
    mixins: [mixin],
    data() {
      return {
        columns: [
          {
            title: '用户名',
            dataIndex: 'username',
            width: 200,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '真实姓名',
            dataIndex: 'realname',
            width: 90,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '岗位',
            dataIndex: 'jobTitleName',
            width: 180,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '所属部门',
            dataIndex: 'departmentName',
            width: 300,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '分部名称',
            dataIndex: 'subCompanyName',
            width: 240,
            align: 'center',
            ellipsis: true,
          },
          {
            title: '电子邮件',
            dataIndex: 'email',
            width: 230,
            align: 'center',
            ellipsis: true,
          },
        ],
        searchOption: [
          {
            label: '真实姓名',
            value: 'realname',
          },
          {
            label: '用户名称',
            value: 'username',
          },
          {
            label: '岗位',
            value: 'jobTitleName',
          },
          {
            label: '所属部门',
            value: 'departmentName',
          },
          {
            label: '分部名称',
            value: 'subCompanyName',
          },
          {
            label: '电子邮件',
            value: 'email',
          },
        ],
        searchValue: 'realname',
      }
    },
    methods: {
      async getSourceData() {
        console.log(this.searchValue, this.postData)
        this.htmlCol()
        this.loading = true
        const res = await api.pageUser(this.postData)
        const { code, msg, data } = res
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

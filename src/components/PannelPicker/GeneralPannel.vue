<template>
  <a-modal
    :title="title"
    okText="确认"
    cancelText="取消"
    width="75%"
    :visible="visible"
    :destroyOnClose="true"
    @ok="submit"
    @cancel="cancel"
  >
    <a-row>
      <a-col
        class="left"
        :span="16"
      >
        <div class="content">
          <a-tabs
            type="card"
            @change="changeTabs"
          >
            <a-tab-pane
              v-if="typeList.includes(1)"
              key="1"
              tab="人员"
              force-render
            >
              <div class="tab-pane">
                <user
                  ref="user"
                  :options="options"
                  :customParams="customParams.user"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="typeList.includes(2)"
              key="2"
              tab="部门"
              force-render
            >
              <div class="tab-pane">
                <department
                  ref="department"
                  :options="options"
                  :customParams="customParams.department"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="typeList.includes(3)"
              key="3"
              tab="职务"
              force-render
            >
              <div class="tab-pane">
                <post
                  ref="post"
                  :options="options"
                  :customParams="customParams.post"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="typeList.includes(4)"
              key="4"
              tab="用户组"
              force-render
            >
              <div class="tab-pane">
                <user-group
                  ref="userGroup"
                  :options="options"
                  :customParams="customParams.userGroup"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="typeList.includes(5)"
              key="5"
              tab="角色"
              force-render
            >
              <div class="tab-pane">
                <role
                  ref="role"
                  :options="options"
                  :customParams="customParams.role"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane
              v-if="typeList.includes(6)"
              key="6"
              tab="系统定义"
              force-render
            >
              <div class="tab-pane">
                <custom-user
                  ref="customUser"
                  :options="options"
                  :customParams="customParams.customUser"
                  :multiple="multiple"
                  :disabled="disabled"
                  @change="pannelChange"
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
      <a-col
        class="right"
        :span="8"
      >
        <div class="title">Selected</div>
        <div class="select-list">
          <a-row
            class="select-row"
            :gutter="16"
            v-for="(item, index) in selectList"
            :key="index"
          >
            <a-col
              class="center-col"
              :span="21"
            >
              <div class="center-box">
                <span>{{ item | name }}</span>
                <span class="text">（{{ item.typeName }}）</span>
              </div>
            </a-col>
            <a-col
              class="del-row"
              :span="3"
            >
              <a-icon
                v-show="!disabled"
                type="delete"
                @click="deleteSelect(item, index)"
              />
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import User from './module/User.vue'
  import UserGroup from './module/UserGroup.vue'
  import Department from './module/Department.vue'
  import Role from './module/Role.vue'
  import Post from './module/Post.vue'
  import customUser from './module/CustomUser.vue'

  export default {
    components: {
      User,
      UserGroup,
      Department,
      Role,
      Post,
      customUser,
    },
    props: {
      title: {
        type: String,
        default: '通用选择',
      },
      multiple: {
        type: Boolean,
      },
      options: {
        // 选择的项
        type: Object,
      },
      typeList: {
        type: Array,
        default: () => [1, 2, 3, 4, 5, 6],
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      visible() {
        if (this.visible) {
          console.log(this.options)
          if (this.options.selected?.length > 0) {
            // 根据选项重新赋值
            this.$nextTick(() => {
              this.selectList = this._.cloneDeep(this.options.selected)
              console.log(this.selectList)
              this.selectList.forEach((item) => {
                this.selectListKeys.push(item.id)
              })
              for (let item of this.selectList) {
                this.temporary[item.type].push({
                  ...item,
                  // orgCode: item.orgCode,
                  type: item.type,
                  typeName: item.typeName,
                  name: item.name,
                  id: item.id,
                })
              }
              console.log(this.temporary)
              this.typeList.includes(1)
                ? this.$refs.user.setTable(this.options.selected)
                : ''
              this.typeList.includes(2)
                ? this.$refs.department.setTable(this.options.selected)
                : ''
              this.typeList.includes(3)
                ? this.$refs.post.setTable(this.options.selected)
                : ''
              this.typeList.includes(4)
                ? this.$refs.userGroup.setTable(this.options.selected)
                : ''
              this.typeList.includes(5)
                ? this.$refs.role.setTable(this.options.selected)
                : ''
              this.typeList.includes(6)
                ? this.$refs.customUser.setTable(this.options.selected)
                : ''
            })
          }
        }
      },
    },
    filters: {
      name: function (item) {
        const nameArr = new Map([
          ['user', `${item.name}-${item.realname}`],
          ['department', `${item.name}-${item.departmentId || item.orgCode}`],
          ['default', item.name],
        ])
        return nameArr.get(item.type) || nameArr.get('default')
      },
    },
    data() {
      return {
        visible: false,
        customParams: {
          user: {
            type: 'user',
            typeName: '人员',
            id: 'id',
            name: 'username',
          },
          userGroup: {
            type: 'userGroup',
            typeName: '用户组',
            id: 'id',
            name: 'name',
          },
          role: {
            type: 'role',
            typeName: '角色',
            id: 'id',
            name: 'name',
          },
          post: {
            type: 'post',
            typeName: '岗位',
            id: 'id',
            name: 'name',
          },
          department: {
            type: 'department',
            typeName: '部门',
            id: 'id',
            name: 'departName',
          },
          customUser: {
            type: 'customUser',
            typeName: '系统定义',
            id: 'id',
            name: 'name',
          },
        },
        temporary: {
          user: [],
          department: [],
          post: [],
          userGroup: [],
          role: [],
          customUser: [],
        },
        selectListKeys: [], // 选择的listKeys
        selectList: [], // 选择的list
      }
    },
    methods: {
      changeTabs(e) {
        switch (e) {
          case '1':
            this.$nextTick(() => {
              this.$refs.user.getSourceData()
            })
            break
          case '2':
            this.$nextTick(() => {
              this.$refs.department.getSourceData()
            })
            break
          case '3':
            this.$nextTick(() => {
              this.$refs.post.getSourceData()
            })
            break
          case '4':
            this.$nextTick(() => {
              this.$refs.userGroup.getSourceData()
            })
            break
          case '5':
            this.$nextTick(() => {
              this.$refs.role.getSourceData()
            })
            break
          case '6':
            this.$nextTick(() => {
              this.$refs.customUser.getSourceData()
            })
            break
        }
      },
      pannelChange(selectedRowKeys, selectedRow, config) {
        console.log('pannelChange', selectedRowKeys, selectedRow, config)
        this.temporary[config.type] = [] // 首先清空临时arr
        for (let item of selectedRow) {
          this.temporary[config.type].push(item)
        }
        this.setSelectList()
      },
      // 生成选择的list
      setSelectList() {
        this.selectListKeys = []
        // 选择的list
        this.selectList = [
          ...this.temporary.user,
          ...this.temporary.department,
          ...this.temporary.post,
          ...this.temporary.userGroup,
          ...this.temporary.role,
          ...this.temporary.customUser,
        ]
        this.selectList.forEach((item) => {
          this.selectListKeys.push(item.id)
        })
      },
      // 删除某一个item
      deleteSelect(item, index) {
        this.selectList.splice(index, 1)
        this.selectListKeys = []
        this.selectList.forEach((item) => {
          this.selectListKeys.push(item.id)
        })
        this.temporary[item.type] = this.temporary[item.type].filter((v) => {
          return v.id !== item.id
        })
        this.$refs[item.type].deleteSelect(item)
      },
      submit() {
        this.$emit('change', this.selectList, this.selectListKeys)
      },
      open(type = 'user') {
        this.visible = true
        this.$nextTick(() => {
          console.log(this.$refs)
          this.$refs[type].getSourceData()
        })
      },
      cancel() {
        this.visible = false
        this.selectList = []
        this.selectListKeys = []
        this.temporary = {
          user: [],
          department: [],
          post: [],
          userGroup: [],
          role: [],
          customUser: [],
        }
      },
    },
  }
</script>

<style lang="less" scoped>
/deep/ .ant-modal-body {
  padding: 0;
  .left {
    border-right: 1px solid gainsboro;
    .content {
      height: 490px;
      overflow: hidden;
      .ant-tabs {
        height: 490px !important;
        overflow: hidden;
        .ant-tabs-bar {
          margin-bottom: 0;
        }
        .tab-pane {
          padding: 5px 10px;
          height: 450px;
          overflow: auto;
          &::-webkit-scrollbar {
            width: 6px;
            height: 8px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #dbdfe6;
            border: 1px solid #dbdfe6;
            border-radius: 5px;
          }
          .ant-form {
            margin-bottom: 5px !important;
          }
        }
      }
    }
  }
  .right {
    .select-list {
      height: 450px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px;
        height: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #dbdfe6;
        border: 1px solid #dbdfe6;
        border-radius: 5px;
      }
      .select-row {
        height: 40px;
        margin: 0 !important;
        border-bottom: 1px solid #dcdfe6;
        padding: 0 10px;
        display: flex;
        align-items: center;
        .center-box {
          /*display: flex;*/
          /*flex-direction: column;*/
          .text {
            color: #14c2c2;
          }
        }
        .del-row {
          text-align: center;
          color: red;
        }
      }
    }
  }
  .title {
    font-weight: 500;
    color: #32475d;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #dcdfe6;
  }
}
</style>

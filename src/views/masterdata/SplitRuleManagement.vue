<template>
  <page-header-wrapper>
    <div>
      <a-row>
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <activities />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { STable } from '@/components'
import Activities from './modules/Activities.vue'
import axios from 'axios'

export default {
  name: 'SplitRuleManagement',
  components: {
    PageHeaderWrapper,
    STable,
    Activities
  },
  data() {
    return {
      current: 0,
      btnLoading: false,
      systemComputedTime: '',
      timeFix: timeFix(),
      avatar: '',
      user: {},
      loading: false,
      // data
      selectedRowKeys: [],
      selectedRows: [],
      stepStyle: {},
      listData: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome,
      activitiesSelect: state => state.poc.activitiesSelect,
      subActivitiesAll: state => state.poc.subActivitiesAll,
      templateSelect: state => state.poc.templateSelect
    }),
    currentUser() {
      return {
        name: '李承',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted() {
    // this.getTest()
  },
  // watch: {
  //   current(val) {
  //     if (val == 1 && this.selectedRows.length > 0) {
  //       this.$refs.subActivities.loadData()
  //     }
  //   },
  // },
  methods: {
    loadData(parameter) {
      // 加载数据方法
      return this.listData
    },
    SaveProposal() {
      this.btnLoading = true
      let ProposalJson = []
      console.log(this.templateSelect[0].ID)
      this.subActivitiesAll.forEach((item, i) => {
        ProposalJson[i] = {
          ActivityID: item.ParentID,
          SubActivityID: item.SubActivityID,
          TemplateID: this.templateSelect[0].ID || item.TemplateID,
          Price: item.Price,
          ServicePrice: item.ServicePrice,
          PassThroughPrice: item.PassThroughPrice,
          Duration: item.Duration,
          Property1: item.Property1,
          Property2: item.Property2,
          Property3: item.Property3,
          Property4: item.Property4,
          Property5: item.Property5,
          Property6: item.Property6,
          Property7: item.Property7,
          Property8: item.Property8,
          Property9: item.Property9,
          Property10: item.Property10,
          Property11: item.Property11,
          Property12: item.Property12,
          Property13: item.Property13,
          Property14: item.Property14,
          Property15: item.Property15,
          Property16: item.Property16,
          Property17: item.Property17,
          Property18: item.Property18,
          Property19: item.Property19,
          Property20: item.Property20,
          Sort: item.Sort
        }
      })
      axios.post('http://47.103.127.217:8080/api/poc/SaveProposal', ProposalJson).then(res => {
        console.log('SaveProposal', res)
        axios
          .get('http://47.103.127.217:8080/api/poc/CreateProposalInstance', {
            params: { batchID: res.data.Data }
          })
          .then(val => {
            console.log('CreateProposalInstance', val)
            axios
              .get('http://47.103.127.217:8080/api/poc/GetDocumentsName', {
                params: { batchID: res.data.Data }
              })
              .then(res => {
                console.log('GetDocumentsName', res.data)
                this.current++
                this.btnLoading = false
                this.$nextTick(() => {
                  this.$refs.generate.sendName(res.data)
                })
              })
          })
      })
    },
    setCss(status) {
      let css = ''
      switch (status) {
        case 'success':
          css = 'green'
          break
        case 'error':
          css = 'red'
          break
        case 'current':
          css = 'blue'
          break
        default:
          css = 'gray'
          break
      }
      return css
    },
    selectMonth(dates, dateStrings) {
      this.systemComputedTime = dates
      this.loading = true
      this.getExectResults(dates)
      console.log(dates, dateStrings)
    },
    getExectResults(date) {
      const params = { date }
      this.$http
        .get('http://118.31.45.238:8089/common/GetExectResults', {
          params
        })
        .then(res => {
          console.log(res)
          this.loading = false
        })
    },
    getTest() {
      this.loading = true
      this.$http.get('/common/GetExectResults').then(res => {
        console.log(res)
        this.Results = res.result?.data.map((node, i) => {
          if (node.status === 'current') {
            this.current = i
          }
          return node
        })
        this.listData = this.Results[this.Results.length - 1].list
        this.$refs.table.refresh()
        this.loading = false
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style lang="less" scoped>
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}

.steps-action {
  padding: 0;
  margin: 24px;
}

[data-theme='dark'] .steps-content {
  background-color: #2f2f2f;
  border: 1px dashed #404040;
}
/deep/ .ant-steps {
  padding: 0 150px 0 150px;
}
/deep/ .ant-steps-item-finish {
  .ant-steps-item-icon {
    background-color: #fff;
    border-color: #15d437;
    & > .ant-steps-icon {
      color: #15d437;
    }
  }
  .ant-steps-item-content {
    .ant-steps-item-title {
      color: #15d437;
    }
    .ant-steps-item-description {
      color: #15d437;
    }
  }
}
.node {
  display: inline-block;
  width: 200px;
  .node-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: 500;
    .node-circle {
      border-radius: 50%;
      width: 60px;
      height: 60px;
      cursor: pointer;
      border: none;
    }
    // .node-title {
    //   font-weight: 500;
    // }
  }
}

.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>

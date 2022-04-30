<template>
  <page-header-wrapper>
    <!-- <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar
            size="large"
            :src="currentUser.avatar"
          />
        </div>
        <div class="content">
          <div class="content-title">{{ timeFix }}，李承<span class="welcome-text"></span></div>
          <div>开发工程师 | 大众金融 - 开发项目组 - NMS-DSFA平台</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic
            title="项目数"
            :value="56"
          />
        </div>
        <div class="stat-item">
          <a-statistic
            title="待执行任务"
            :value="8"
            suffix="/ 24"
          />
        </div>
        <div class="stat-item">
          <a-statistic
            title="总任务数"
            :value="2223"
          />
        </div>
      </div>
    </template> -->

    <div>
      <a-row>
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <!-- <a slot="title">
              <a-month-picker
                format="YYYY年MM月"
                valueFormat="YYYYMM"
                placeholder="系统计算时间"
                :value="systemComputedTime"
                @change="selectMonth"
              />
            </a> -->
            <div class="steps-action">
              <a-button v-if="current < Steps.length - 1" :loading="btnLoading" type="primary" @click="next"
                >Next Step</a-button
              >
              <a-button
                v-if="current == Steps.length - 1"
                type="primary"
                @click="message.success('Processing complete!')"
              >
                Done
              </a-button>
              <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">Previous Step</a-button>
            </div>
            <a-steps v-model="current">
              <a-step
                v-for="node in Steps"
                :key="node.id"
                @click="handleNode(node)"
                :title="node.title"
                :style="stepStyle"
                :description="node.time"
              />
              <!-- <a-step
                v-for="node in Steps"
                :key="node.id"
                @click="handleNode(node)"
                :title="node.title"
                :style="stepStyle"
                :status="setStatus(node.status)"
                :description="node.time"
              /> -->
            </a-steps>
            <!-- <div>
              <div class="label">系统执行状态：</div>
              <div class="node" v-for="node in Results" :key="node.id" @click="handleNode(node)">
                <div class="node-box">
                  <div class="node-circle" :style="{ background: setCss(node.status) }"></div>
                  <div class="node-title">{{ node.title }}</div>
                  <div class="node-time">{{ node.time }}</div>
                </div>
              </div>
            </div> -->
            <activities v-show="current == 1" @updateSub="subActivitiesloadData" />
            <sub-activities ref="subActivities" v-show="current == 2" />
            <template-list ref="template" v-show="current == 0" />
            <generate ref="generate" v-show="current == 3" />
            <!-- <s-table
              size="default"
              ref="table"
              rowKey="id"
              :alert="false"
              :loading='loading'
              :columns="columns"
              :data="loadData"
            >
            </s-table> -->
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
import Activities from './module/Activities'
import SubActivities from './module/SubActivities'
import TemplateList from './module/TemplateList'
import Generate from './module/Generate'
import axios from 'axios'

export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    STable,
    Activities,
    SubActivities,
    TemplateList,
    Generate,
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
      Steps: [
        {
          id: 1,
          title: 'Select Template',
          status: 'success',
        },
        {
          id: 2,
          title: 'Building Activities',
          status: 'success',
        },
        {
          id: 3,
          title: 'Building Sub Activities',
          status: 'success',
        },

        {
          id: 4,
          title: 'Generate Proposal',
          status: 'success',
        },
      ],
      stepStyle: {},
      columns: [
        {
          title: '任务/数据状态',
          dataIndex: 'name',
          width: 200,
          align: 'center',
        },
        {
          title: '任务状态汇总',
          dataIndex: 'status',
          width: 140,
          align: 'center',
          customRender: (status) => {
            const renderElement = []
            switch (status) {
              case 'Successded':
                renderElement.push(<a-tag color="green">Successded</a-tag>)
                break
              case 'Idle':
                renderElement.push(<a-tag color="orange">Idle</a-tag>)
                break
              case 'Not Started':
                renderElement.push(<a-tag color="blue">Not Started</a-tag>)
                break
              case 'Running':
                renderElement.push(<a-tag color="green">Running</a-tag>)
                break
              case 'Failed':
                renderElement.push(<a-tag color="red">Failed</a-tag>)
                break
            }
            return renderElement
          },
        },
        {
          title: '任务开始时间',
          dataIndex: 'startTime',
          width: 220,
          align: 'center',
        },
        {
          title: '任务结束时间',
          dataIndex: 'endTime',
          width: 220,
          align: 'center',
        },
        {
          title: '说明',
          width: 240,
          align: 'center',
          dataIndex: 'description',
          // scopedSlots: { customRender: 'action' }
        },
      ],
      listData: [],
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome,
      activitiesSelect: (state) => state.poc.activitiesSelect,
      subActivitiesAll: (state) => state.poc.subActivitiesAll,
      templateSelect: (state) => state.poc.templateSelect,
    }),
    currentUser() {
      return {
        name: '李承',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      }
    },
    userInfo() {
      return this.$store.getters.userInfo
    },
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted() {
    // this.getTest()
  },
  watch: {
    current(val) {
      if (val == 1 && this.selectedRows.length > 0) {
        this.subActivitiesloadData()
      }
    },
  },
  methods: {
    loadData(parameter) {
      // 加载数据方法
      return this.listData
    },
    subActivitiesloadData() {
      this.$refs.subActivities.loadData()
    },
    setStatus(status) {
      let stepStatus = ''
      switch (status) {
        case 'success':
          stepStatus = 'finish'
          break
        case 'error':
          stepStatus = 'error'
          break
        case 'current':
          stepStatus = 'process'
          break
        default:
          stepStatus = 'wait'
          break
      }
      return stepStatus
    },
    next() {
      if (this.current == 2) {
        this.$refs.template.checkSelect().then((val) => {
          if (val) {
            this.SaveProposal()
          }
        })
      } else {
        this.current++
      }
    },
    SaveProposal() {
      this.btnLoading = true
      let ProposalJson = []
      console.log(this.templateSelect[0].ID)
      this.subActivitiesAll.forEach((item, i) => {
        ProposalJson[i] = {
          ActivityID: item.SubActivityID,
          TemplateID: this.templateSelect[0].ID || item.TemplateID,
          Price: item.Price,
          PriceMark: item.PriceMark,
          ServicePrice: item.ServicePrice,
          PassThroughPrice: item.PassThroughPrice,
          Duration: item.Duration,
          ParentID:item.ActivityID,
          ActivityName:item.ActivityName,
          ProjectID: item.ProjectID,
          ParentID:item.ParentID,
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
          Sort: item.Sort,
          CreateUser:JSON.parse(sessionStorage.getItem("LoginUser")).UserID
        }
      })
      this.activitiesSelect.forEach((item, i) => {
        ProposalJson.push({
          ActivityID: item.ActivityID,
          ParentID:item.ParentID,
          TemplateID: this.templateSelect[0].ID || item.TemplateID,
          Price: item.Price,
          PriceMark: item.PriceMark,
          ServicePrice: item.ServicePrice,
          PassThroughPrice: item.PassThroughPrice,
          ActivityName:item.ActivityName,
          ProjectID: item.ProjectID,
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
          Sort: item.Sort,
          CreateUser:JSON.parse(sessionStorage.getItem("LoginUser")).UserID
        })
      })
      debugger  

      axios.post('http://123.56.242.202:8080/api/poc/SaveProposal', ProposalJson).then((res) => {
        console.log('SaveProposal', res)
        axios
          .get('http://123.56.242.202:8080/api/poc/CreateProposalInstance', {
            params: { batchID: res.data.Data },
          })
          .then((val) => {
            console.log('CreateProposalInstance', val)
            axios
              .get('http://123.56.242.202:8080/api/poc/GetDocumentsName', {
                params: { batchID: res.data.Data }, 
              })
              .then((res) => {
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
    prev() {
      this.current--
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
    handleNode(node) {
      console.log(node)
      console.log(this.listData)
      this.listData = node.list
      // this.$refs.table.refresh()
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
          params,
        })
        .then((res) => {
          console.log(res)
          this.loading = false
        })
    },
    getTest() {
      this.loading = true
      this.$http.get('/common/GetExectResults').then((res) => {
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
    },
  },
}
</script>

<style lang="less" scoped>
@import './Workplace.less';
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
  padding: 0 20px 0 10px;
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

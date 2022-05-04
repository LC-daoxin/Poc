import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
import { randomString, randomNumber } from "@/utils/util";

const totalCount = 1024

const serverList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: 'No ' + tmpKey,
      description: '这是一段描述',
      callNo: Mock.mock('@integer(1, 999)'),
      status: Mock.mock('@integer(0, 3)'),
      updatedAt: Mock.mock('@datetime'),
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const projects = () => {
  return builder({
    'data': [{
      id: 1,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      title: 'Alipay',
      description: '那是一种内在的东西， 他们到达不了，也无法触及的',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 2,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      title: 'Angular',
      description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 3,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      title: '',
      description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 4,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      title: '',
      description: '那时候我只会想自己想要什么，从不想自己拥有什么',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 5,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      title: 'Bootstrap',
      description: '凛冬将至',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    },
    {
      id: 6,
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
      title: 'Vue',
      description: '生命就像一盒巧克力，结果往往出人意料',
      status: 1,
      updatedAt: '2018-07-26 00:00:00'
    }
    ],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 6,
    'totalCount': 57
  })
}

const activity = () => {
  return builder([{
    id: 1,
    user: {
      nickname: '@name',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '更新',
      event: '番组计划'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '蓝莓酱',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '更新',
      event: '番组计划'
    },
    time: '2018-08-23 09:35:37'
  },
  {
    id: 1,
    user: {
      nickname: '@name',
      avatar: '@image(64x64)'
    },
    project: {
      name: '白鹭酱油开发组',
      action: '创建',
      event: '番组计划'
    },
    time: '2017-05-27 00:00:00'
  },
  {
    id: 1,
    user: {
      nickname: '曲丽丽',
      avatar: '@image(64x64)'
    },
    project: {
      name: '高逼格设计天团',
      action: '更新',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '@name',
      avatar: '@image(64x64)'
    },
    project: {
      name: '高逼格设计天团',
      action: 'created',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  },
  {
    id: 1,
    user: {
      nickname: '曲丽丽',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    project: {
      name: '高逼格设计天团',
      action: 'created',
      event: '六月迭代'
    },
    time: '2018-08-23 14:47:00'
  }
  ])
}

const teams = () => {
  return builder([{
    id: 1,
    name: '科学搬砖组',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
  },
  {
    id: 2,
    name: '程序员日常',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
  },
  {
    id: 1,
    name: '设计天团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
  },
  {
    id: 1,
    name: '中二少女团',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
  },
  {
    id: 1,
    name: '骗你学计算机',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
  }
  ])
}

const radar = () => {
  return builder([{
    item: '引用',
    '个人': 70,
    '团队': 30,
    '部门': 40
  },
  {
    item: '口碑',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '产量',
    '个人': 50,
    '团队': 60,
    '部门': 40
  },
  {
    item: '贡献',
    '个人': 40,
    '团队': 50,
    '部门': 40
  },
  {
    item: '热度',
    '个人': 60,
    '团队': 70,
    '部门': 40
  },
  {
    item: '引用',
    '个人': 70,
    '团队': 50,
    '部门': 40
  }
  ])
}

const Results = () => {
  return builder({
    'data': [{
      id: 1,
      status: 'success',
      time: '4月1日 6:00',
      title: '2nd Changed Contract',
      list: [{
        id: 1001,
        name: 'Data Prepare',
        status: 'Successded',
        startTime: '2021/04/01 07:00:00',
        endTime: '2021/04/01 08:10:35',
        description: 'DFSC和BI向DSFA传输预估数据的系统状态'
      },
      {
        id: 1002,
        name: 'DSF Calculate',
        status: 'Successded',
        startTime: '2021/04/01 9:20:06',
        endTime: '2021/04/03 14:33:06',
        description: '服务费摊销计算'
      },
      {
        id: 1003,
        name: 'Accounting Posting',
        status: 'Successded',
        startTime: '2021/04/05 10:14:46',
        endTime: '2021/04/10 10:20:24',
        description: '输出Posting文件'
      },
      {
        id: 1004,
        name: 'Return BI',
        status: 'Successded',
        startTime: '2021/04/15 12:00:27',
        endTime: '2021/04/20 18:31:06',
        description: '输出BI返回值'
      }]
    },
    {
      id: 2,
      status: 'success',
      time: '4月29日 8:00',
      title: 'Actual DSF',
      list: [{
        id: 1001,
        name: 'Data Prepare',
        status: 'Successded',
        startTime: '2021/04/29 08:00:00',
        endTime: '2021/04/29 09:10:35',
        description: 'DFSC和BI向DSFA传输预估数据的系统状态'
      },
      {
        id: 1002,
        name: 'DSF Calculate',
        status: 'Successded',
        startTime: '2021/04/29 10:11:35',
        endTime: '2021/04/29 11:12:44',
        description: '服务费摊销计算'
      },
      {
        id: 1003,
        name: 'Accounting Posting',
        status: 'Successded',
        startTime: '2021/04/29 14:12:42',
        endTime: '2021/04/29 14:12:42',
        description: '输出Posting文件'
      },
      {
        id: 1004,
        name: 'Return BI',
        status: 'Idle',
        startTime: '2021/04/29 14:50:10',
        endTime: '2021/04/29 18:07:25',
        description: '输出BI返回值'
      }]
    },
    {
      id: 3,
      status: 'error',
      time: '4月30日 6:00',
      title: '1st Changed Contract',
      list: [{
        id: 1001,
        name: 'Data Prepare',
        status: 'Successded',
        startTime: '2021/04/30 06:00:00',
        endTime: '2021/04/30 07:10:35',
        description: 'DFSC和BI向DSFA传输预估数据的系统状态'
      },
      {
        id: 1002,
        name: 'DSF Calculate',
        status: 'Failed',
        startTime: '2021/04/30 08:00:00',
        endTime: '2021/04/30 08:00:00',
        description: '服务费摊销计算'
      },
      {
        id: 1003,
        name: 'Accounting Posting',
        status: 'Idle',
        startTime: '/',
        endTime: '/',
        description: '输出Posting文件'
      },
      {
        id: 1004,
        name: 'Return BI',
        status: 'Idle',
        startTime: '/',
        endTime: '/',
        description: '输出BI返回值'
      }]
    },
    {
      id: 4,
      status: 'current',
      time: '4月30日 21:00',
      title: 'Estimated DSF',
      list: [{
        id: 1001,
        name: 'Data Prepare',
        status: 'Successded',
        startTime: '2021/04/30 21:00:00',
        endTime: '2021/04/30 21:10:35',
        description: 'DFSC和BI向DSFA传输预估数据的系统状态'
      },
      {
        id: 1002,
        name: 'DSF Calculate',
        status: 'Not Started',
        startTime: '/',
        endTime: '/',
        description: '服务费摊销计算'
      },
      {
        id: 1003,
        name: 'Accounting Posting',
        status: 'Idle',
        startTime: '/',
        endTime: '/',
        description: '输出Posting文件'
      },
      {
        id: 1004,
        name: 'Return BI',
        status: 'Idle',
        startTime: '/',
        endTime: '/',
        description: '输出BI返回值'
      }]
    }],
    'pageSize': 10,
    'pageNo': 0,
    'totalPage': 1,
    'totalCount': 4
  })
}
const reportList = (options) => {
  console.log(options)
  const parameters = getQueryParameters(options)
  console.log(parameters)
  let contractNo = JSON.parse(parameters.model).contractNo.split(';')
  console.log(contractNo)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1
  let Str = 'ABCDEFGH'
  for (let i = 1; i < next; i++) {
    let debit = Mock.mock('@integer(0, 10000)')
    let credit = Mock.mock('@integer(0, 10000)')
    let contract_No = contractNo[Math.floor((Math.random()*contractNo.length))]
    result.push({
      id: `no_${randomString(10)}`,
      contract_No: contract_No || randomNumber(12),
      contract_Type: 'C_SLB',
      business_Area: randomNumber(4),
      leasing_Company_Code: `${randomString(2, Str)}${randomNumber(2)}`,
      'dealer_Name': '深圳市晨午二手车交易有限公司',
      assignment: randomNumber(12),
      account: randomNumber(9),
      account_Desp: 'Deferred Dealer Service Fee without VAT',
      currency: 'CNY',
      // 'document_No': `${randomString(8)}-${randomString(4)}-${randomString(4)}-${randomString(4)}-${randomString(12)}`,
      'document_No': Mock.mock('@guid'),
      'posting_Date': Mock.mock('@datetime'),
      'value_Date': Mock.mock('@datetime'),
      documentText: 'DSF amort Act 20217',
      dc: 'C',
      debit,
      credit,
      net: debit - credit
    })
  }
  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    isSuccess: true,
    data: result
  })
}
const vacationList = (options) => {
  console.log(options)
  const parameters = getQueryParameters(options)
  console.log(parameters)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const next = (pageNo >= totalPage ? (totalCount % pageSize) : pageSize) + 1
  const { year, month, type } = JSON.parse(parameters.model)
  let m = month.toString().length === 1 ? `0${month}` : month
  console.log(month.toString().length, m)
  for (let i = 1; i < next; i++) {
    result.push({
      id: Mock.mock('@guid'),
      type: type === 0 ? Mock.mock('@integer(1, 16)') : type,
      description: Mock.mock('@boolean') ? '开心的一天～' : '无',
      date: year + '-' + (month === 0 ? Mock.mock('@date("MM-dd")') : (m + '-' + Mock.mock('@date("dd")'))),
      creationTime: Mock.mock('@datetime'),
      creator: Mock.mock('@guid'),
    })
  }
  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    isSuccess: true,
    data: result
  })
}

const exportFile = (options) => {
  return builder({
    isSuccess: true,
    data: 12345
  })
}

Mock.mock(/\/service/, 'get', serverList)
Mock.mock(/\/list\/search\/projects/, 'get', projects)
Mock.mock(/\/workplace\/activity/, 'get', activity)
Mock.mock(/\/workplace\/teams/, 'get', teams)
Mock.mock(/\/workplace\/radar/, 'get', radar)
Mock.mock(/\/common\/GetExectResults/, 'get', Results)
Mock.mock(/\/common\/vacation/, 'get', vacationList)
Mock.mock(/\/common\/report/, 'get', reportList)
Mock.mock(/\/common\/export/, 'get', exportFile)

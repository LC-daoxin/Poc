const operatorOptions = [
  {
    label: 'And （&&）',
    value: 'and'
  },
  {
    label: 'Or （||）',
    value: 'or'
  }
]

const symbolOptions = [
  {
    label: '=',
    value: '='
  },
  // {
  //   label: '!=',
  //   value: 2
  // },
  {
    label: '<',
    value: '<'
  },
  {
    label: '<=',
    value: '<='
  },
  {
    label: '>',
    value: '>'
  },
  {
    label: '>=',
    value: '>='
  },
  // {
  //   label: 'contains',
  //   value: 7
  // },
  // {
  //   label: 'notContains',
  //   value: 8
  // },
  // {
  //   label: 'In',
  //   value: 7
  // },
  // {
  //   label: 'Not In',
  //   value: 8
  // },
  // {
  //   label: 'Like',
  //   value: 9
  // },
  // {
  //   label: 'Not Like',
  //   value: 10
  // }

  // {
  //   label: '以...开始',
  //   value: 7
  // },
  // {
  //   label: '以...结束',
  //   value: 8
  // },
  // {
  //   label: '不以...开始',
  //   value: 9
  // },
  // {
  //   label: '不以...结束',
  //   value: 10
  // },
  // {
  //   label: '包含以下内容',
  //   value: 11
  // },
  // {
  //   label: '不包含以下内容',
  //   value: 12
  // },
  // {
  //   label: '为null',
  //   value: 13
  // },
  // {
  //   label: '不为null',
  //   value: 14
  // }
]

const linkSymbolOptions = [
  {
    label: '==',
    value: 1
  },
  {
    label: '!=',
    value: 2
  },
  {
    label: 'contains',
    value: 3
  },
  {
    label: 'notContains',
    value: 4
  },
]

const variableOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '数字',
    value: 'double'
  },
  {
    label: '日期时间',
    value: 'datetime'
  }
]

const summarySymbolOptions = [
  {
    value: '-',
    valueType: 1
  },
  {
    value: '_',
    valueType: 2
  },
  {
    value: '~',
    valueType: 3
  },
  {
    value: '<',
    valueType: 4
  },
  {
    value: '>',
    valueType: 5
  },
  {
    value: '(',
    valueType: 6
  },
  {
    value: ')',
    valueType: 7
  },
  {
    value: '[',
    valueType: 8
  },
  {
    value: ']',
    valueType: 9
  },
  {
    value: '{',
    valueType: 10
  },
  {
    value: '}',
    valueType: 11
  }
]

const processOptions = [
  {
    label: '流程名称',
    value: 'name'
  },
  {
    label: '流程编码',
    value: 'code'
  },
  {
    label: '是否可导入数据',
    value: 'allowDataImport'
  },
  {
    label: '分类',
    value: 'category'
  },
  {
    label: '分类名称',
    value: 'categoryName'
  },
  {
    label: '备注',
    value: 'description'
  },
  {
    label: '引擎类型',
    value: 'engineType'
  },
  {
    label: '表单设计ID',
    value: 'formDesignId'
  },
  {
    label: '图标',
    value: 'icon'
  },
  {
    label: '是否限制申请',
    value: 'isLimitApply'
  },
  {
    label: '限制申请次数',
    value: 'limitNum'
  },
  {
    label: '流程配置JSON',
    value: 'processLayout'
  },
  {
    label: '排序',
    value: 'sort'
  },
  {
    label: '是否启用',
    value: 'status'
  },
  {
    label: '流程摘要规则表达式',
    value: 'summaryExpression'
  },
  {
    label: '版本号 ',
    value: 'version'
  }
]

const nodeOptions = [
  {
    label: '节点名称',
    value: 'name'
  },
  {
    label: '节点编码',
    value: 'code'
  },
  {
    label: '图标',
    value: 'icon'
  },
  {
    label: '备注',
    value: 'description'
  },
  {
    label: '父节点Id',
    value: 'parentId'
  },
  {
    label: '流程ID',
    value: 'processDesignId'
  },
  {
    label: '排序',
    value: 'sort'
  },
  {
    label: '是否启用',
    value: 'status'
  },
  {
    label: '类型',
    value: 'type'
  },
  {
    label: '版本号',
    value: 'version'
  },
  {
    label: '扩展信息Json',
    value: 'extendJson'
  }
]

const agentUserOptions = [
  {
    label: 'OA账户真实姓名',
    valueType: 'string',
    value: 'realname'
  },
  {
    label: 'OA账户用户名',
    valueType: 'string',
    value: 'username'
  },
  {
    label: 'OA账户公司名称',
    valueType: 'string',
    value: 'subCompanyName'
  },
  {
    label: 'OA账户公司Id',
    valueType: 'string',
    value: 'subCompanyId'
  },
  {
    label: 'OA账户岗位名称',
    valueType: 'string',
    value: 'jobTitleName'
  },
  {
    label: 'OA账户岗位Id',
    valueType: 'string',
    value: 'jobTitle'
  },
  {
    label: 'OA账户部门名称',
    valueType: 'string',
    value: 'departmentName'
  },
  {
    label: 'OA账户部门Id',
    valueType: 'string',
    value: 'departmentId'
  }
]

export { operatorOptions, symbolOptions, variableOptions, linkSymbolOptions, summarySymbolOptions, processOptions, nodeOptions, agentUserOptions }
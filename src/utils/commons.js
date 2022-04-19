/**
 * 下载方法
 * @param response
 */
export const downloadFile = (response) => {
  const res = response.data
  const type = res.type
  if (type.includes('application/json')) {
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target.readyState === 2) {
        const data = JSON.parse(e.target.result)
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    }
    reader.readAsText(res)
  } else {
    const disposition = response.headers['content-disposition']
    let fileName = '下载文件.zip'
    if (disposition) {
      const respcds = disposition.split(';')
      for (let i = 0; i < respcds.length; i++) {
        const header = respcds[i]
        if (header !== null && header !== '') {
          const headerValue = header.split('=')
          if (headerValue !== null && headerValue.length > 0) {
            if (headerValue[0].trim().toLowerCase() === 'filename') {
              fileName = decodeURI(headerValue[1])
              break
            }
          }
        }
      }
    }
    //处理引号
    if ((fileName.startsWith("'") || fileName.startsWith('"')) && (fileName.endsWith("'") || fileName.endsWith('"'))) {
      fileName = fileName.substring(1, fileName.length - 1)
    }

    const blob = new Blob([res])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}

// 初始化查询参数
export const initQueryParams = params => {  
  const defParams = {
    size: 10,
    current: 1,
    sort: 'id',
    order: 'descending',
    model: {

    },
    map: {},
    timeRange: null
  } 
  return params ? { ...defParams, ...params } : defParams
}

// 初始化查询参数
export const mergeQueryParams = (queryParams,params) => {
  queryParams.current = params.current
  queryParams.size = params.size
  queryParams.sort = params.sortField
  queryParams.order = params.sortOrder
  Object.assign(queryParams.model, params.filters)
  return queryParams
}
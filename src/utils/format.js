import { formatTimeToStr } from '@/utils/date'
import { getDict } from '@/utils/dictionary'

export const formatStatus= (status) => {
  if (status === 0) {
    return '待处理'
  }
  if (status === 1) {
    return '通过'
  }
  if (status === 2) {
    return '驳回'
  }
}

export const formatBoolean = (bool) => {
  if (bool !== null) {
    return bool ? '是' : '否'
  } else {
    return ''
  }
}
export const formatDate = (time) => {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
  } else {
    return ''
  }
}

export const filterDict = (value, options) => {
  const rowLabel = options && options.filter(item => item.value === value)
  return rowLabel && rowLabel[0] && rowLabel[0].label
}

export const getDictFunc = async(type) => {
  const dicts = await getDict(type)
  return dicts
}

const path = import.meta.env.VITE_BASE_PATH + ':' + import.meta.env.VITE_SERVER_PORT + '/'
export const ReturnArrImg = (arr) => {
  let imgArr = []
  if (arr instanceof Array){ // 如果是数组类型
    for (let arrKey in arr) {
      if (arr[arrKey].slice(0, 4) !== 'http'){
        imgArr.push(path + arr[arrKey])
      }else {
        imgArr.push(arr[arrKey])
      }
    }
  }else { // 如果不是数组类型
    if (arr.slice(0, 4) !== 'http'){
      imgArr.push(path + arr)
    }else {
      imgArr.push(arr)
    }
  }
  return imgArr
}

export const onDownloadFile = (url) => {
  window.open(path + url)

}
import { export_json_to_excel } from '@/utils/tools/Export2Excel'
import fp from 'lodash/fp'
export const utils = {
  /**
   * 生成指定范围随机数
   * @param {number} min 最小值
   * @param {number} max 最大值
   * @returns
   */
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * 数字千分位分隔
   * @param {number} n
   * @returns
   */
  format(n) {
    let num = n.toString()
    let len = num.length

    if (len <= 3) {
      return num
    } else {
      let temp = ''
      let remainder = len % 3
      if (remainder > 0) {
        //非3的整数倍
        return (
          num.splice(0, remainder) +
          ',' +
          num
            .splice(remainder, len)
            .match(/\d{3}/g)
            .join(',') +
          temp
        )
      } else {
        return (
          num
            .splice(0, len)
            .match(/\d{3}/g)
            .join(',') + temp
        )
      }
    }
  },

  /**
   * 数组扁平化
   * @param {array} arr 数组
   */
  flatten(arr) {
    let result = []

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        result = result.concat(flatten(arr[i]))
      } else {
        result.push(arr[i])
      }
    }
  },

  /**
   * 数组乱序
   * @param {array} arr 数组
   * @returns
   */
  arrScrambling(arr) {
    for (let i = 0; i < arr.length; i++) {
      const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i
      ;[arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
    }
    return arr
  },

  /**
   * 数组中获取随机数
   * @param {array} arr 数组
   * @returns
   */
  sample(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  },

  /**
   * 生成随机字符串
   * @param {number} len 长度
   * @returns
   */
  randomString(len) {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789'
    let strLen = chars.length
    let randomStr = ''
    for (let i = 0; i < len; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * strLen))
    }
    return randomStr
  },

  /**
   * 字符串首字母大写
   * @param {string} str 字符串
   * @returns
   */
  fistLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  /**
   * 手机号脱敏
   * @param {number} tel 手机号
   * @returns
   */
  telFormat(tel) {
    tel = String(tel)
    return tel.substr(0, 3) + '****' + tel.substr(7)
  },

  /**
   * 驼峰命名转换成短横线命名
   * @param {string} str 驼峰命名式字符串
   * @returns
   */
  getKebabCase(str) {
    return str.replace(/[A-Z]/g, item => '-' + item.toLowerCase())
  },

  /**
   * 短横线命名转换成驼峰命名
   * @param {string} str 短横线命名式字符串
   * @returns
   */
  getCamelCase(str) {
    return str.replace(/-([a-z])/g, (i, item) => item.toUpperCase())
  },

  /**
   * 全角转换为半角
   * @param {string} str 字符串
   * @returns
   */
  toCDB(str) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      code = str.charCodeAt(i)
      if (code >= 65281 && code <= 65374) {
        result += String.fromCharCode(str.charCodeAt(i) - 65248)
      } else if (code == 12288) {
        result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32)
      } else {
        result += str.charAt(i)
      }
    }
    return result
  },

  /**
   * 半角转换为全角
   * @param {string} str 字符串
   * @returns
   */
  toDBC(str) {
    let result = ''
    for (let i = 0; i < str.length; i++) {
      code = str.charCodeAt(i)
      if (code >= 33 && code <= 126) {
        result += String.fromCharCode(str.charCodeAt(i) + 65248)
      } else if (code == 32) {
        result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32)
      } else {
        result += str.charAt(i)
      }
    }
    return result
  },

  /***************************************格式化****************************************/

  /**
   * 数字转化为大写金额
   * @param {number} n 数字金额
   * @returns
   */
  digitUppercase(n) {
    const fraction = ['角', '分']
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟'],
    ]
    n = Math.abs(n)
    let s = ''
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = ''
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  },

  /**
   * 数字转化为中文数字
   * @param {number} value 数字
   * @returns
   */
  intToChinese(value) {
    const str = String(value)
    const len = str.length - 1
    const idxs = [
      '',
      '十',
      '百',
      '千',
      '万',
      '十',
      '百',
      '千',
      '亿',
      '十',
      '百',
      '千',
      '万',
      '十',
      '百',
      '千',
      '亿',
    ]
    const num = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    return str.replace(/([1-9]|0+)/g, ($, $1, idx, full) => {
      let pos = 0
      if ($1[0] !== '0') {
        pos = len - idx
        if (idx == 0 && $1[0] == 1 && idxs[len - idx] == '十') {
          return idxs[len - idx]
        }
        return num[$1[0]] + idxs[len - idx]
      } else {
        let left = len - idx
        let right = len - idx + $1.length
        if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
          pos = left - (left % 4)
        }
        if (pos) {
          return idxs[pos] + num[$1[0]]
        } else if (idx + $1.length >= len) {
          return ''
        } else {
          return num[$1[0]]
        }
      }
    })
  },

  /**
   * 字符串转小写
   * @param {string} str 需要处理的字符串
   * @returns 处理成小写的字符串
   */
  toLower(str) {
    return fp.toLower(str)
  },

  /******************************数据存储**************************/

  /**
   * 存储localstorage
   * @param {string} key 键名
   * @param {string | object} value 值
   * @returns
   */
  localStorageSet(key, value) {
    if (!key) return
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(key, value)
  },

  /**
   * 获取localStorage
   * @param {string} key 键名
   * @returns
   */
  localStorageGet(key) {
    if (!key) return
    return window.localStorage.getItem(key)
  },

  /**
   * 删除localStorage
   * @param {string} key 键名
   * @returns
   */
  localStorageRemove(key) {
    if (!key) return
    window.localStorage.removeItem(key)
  },

  /**
   * 存储sessionStorage
   * @param {string} key 键名
   * @param {string | object} value 值
   * @returns
   */
  sessionStorageSet(key, value) {
    if (!key) return
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    window.sessionStorage.setItem(key, value)
  },

  /**
   * 获取sessionStorage
   * @param {string} key 键名
   * @returns
   */
  sessionStorageGet(key) {
    if (!key) return
    return window.sessionStorage.getItem(key)
  },

  /**
   * 删除sessionStorage
   * @param {string} key 键名
   * @returns
   */
  sessionStorageRemove(key) {
    if (!key) return
    window.sessionStorage.removeItem(key)
  },

  /**
   * 设置cookie
   * @param {string} key 键名
   * @param {string} value 键值
   * @param {string } expire 过期时间
   */
  setCookie(key, value, expire) {
    const d = new Date()
    d.setDate(d.getDate() + expire)
    document.cookie = `${key}=${value};expires=${d.toUTCString()}`
  },

  /**
   * 读取cookie
   * @param {string} key 键名
   * @returns
   */
  getCookie(key) {
    const cookieStr = unescape(document.cookie)
    const arr = cookieStr.split('; ')
    let cookieValue = ''
    for (let i = 0; i < arr.length; i++) {
      const temp = arr[i].split('=')
      if (temp[0] === key) {
        cookieValue = temp[1]
        break
      }
    }
    return cookieValue
  },

  /**
   * 删除cookie
   * @param {string} key 键名
   */
  delCookie(key) {
    document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`
  },

  /**************************格式校验********************************/

  /**
   * 校验身份证号码
   * @param {string | number} value 身份证
   * @returns
   */
  checkCardNo(value) {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return reg.test(value)
  },

  /**
   * 校验是否包含中文
   * @param {string } value 校验字符串
   * @returns
   */
  haveCNChars(value) {
    return /[\u4e00-\u9fa5]/.test(value)
  },

  /**
   * 校验是否为ipV6地址
   * @param {string} str ip地址
   * @returns
   */
  isIPv6(str) {
    return Boolean(
      str.match(/:/g)
        ? str.match(/:/g).length <= 7
        : false && /::/.test(str)
        ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str)
        : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str)
    )
  },

  /**
   * 校验是否为邮箱地址
   * @param {string} value 字符串
   * @returns
   */
  isEmail(value) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
  },

  /**
   * 校验是否为中国大陆手机号
   * @param {number|string } value 手机号
   * @returns
   */
  isTel(value) {
    return /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value.toString())
  },

  /**
   * 校验是否包含emoji表情
   * @param {string} value
   * @returns
   */
  isEmojiCharacter(value) {
    value = String(value)
    for (let i = 0; i < value.length; i++) {
      const hs = value.charCodeAt(i)
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (value.length > 1) {
          const ls = value.charCodeAt(i + 1)
          const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true
          }
        }
      } else if (value.length > 1) {
        const ls = value.charCodeAt(i + 1)
        if (ls == 0x20e3) {
          return true
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true
        } else if (0x2b05 <= hs && hs <= 0x2b07) {
          return true
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true
        } else if (
          hs == 0xa9 ||
          hs == 0xae ||
          hs == 0x303d ||
          hs == 0x3030 ||
          hs == 0x2b55 ||
          hs == 0x2b1c ||
          hs == 0x2b1b ||
          hs == 0x2b50
        ) {
          return true
        }
      }
    }
    return false
  },

  /***************************设备判断**************************************/

  /**
   * 判断是移动还是PC设备
   * @returns mobile-移动设备，desktop-pc设备
   */
  isMobile() {
    if (
      navigator.userAgent.match(
        /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
      )
    ) {
      return 'mobile'
    }
    return 'desktop'
  },

  /**判断是否是苹果设备 */
  isAppleMobileDevice() {
    let reg = /iphone|ipod|ipad|Macintosh/i
    return reg.test(navigator.userAgent.toLowerCase())
  },

  /**
   * 判断是否是安卓设备
   * @returns
   */
  isAndroidMobileDevice() {
    return /android/i.test(navigator.userAgent.toLowerCase())
  },

  /**
   * 判断是windows还是Mac系统
   * @returns windows-微软，mac-苹果
   */
  osType() {
    const agent = navigator.userAgent.toLowerCase()
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
    const isWindows =
      agent.indexOf('win64') >= 0 ||
      agent.indexOf('wow64') >= 0 ||
      agent.indexOf('win32') >= 0 ||
      agent.indexOf('wow32') >= 0
    if (isWindows) {
      return 'windows'
    }
    if (isMac) {
      return 'mac'
    }
  },

  /**
   * 判断是否是微信/qq内置浏览器
   * @returns
   */
  broswer() {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return 'weixin'
    } else if (ua.match(/QQ/i) == 'qq') {
      return 'QQ'
    }
    return false
  },

  /**
   * 浏览器型号和版本
   * @returns
   */
  getExplorerInfo() {
    let t = navigator.userAgent.toLowerCase()
    return 0 <= t.indexOf('msie')
      ? {
          //ie < 11
          type: 'IE',
          version: Number(t.match(/msie ([\d]+)/)[1]),
        }
      : !!t.match(/trident\/.+?rv:(([\d.]+))/)
      ? {
          // ie 11
          type: 'IE',
          version: 11,
        }
      : 0 <= t.indexOf('edge')
      ? {
          type: 'Edge',
          version: Number(t.match(/edge\/([\d]+)/)[1]),
        }
      : 0 <= t.indexOf('firefox')
      ? {
          type: 'Firefox',
          version: Number(t.match(/firefox\/([\d]+)/)[1]),
        }
      : 0 <= t.indexOf('chrome')
      ? {
          type: 'Chrome',
          version: Number(t.match(/chrome\/([\d]+)/)[1]),
        }
      : 0 <= t.indexOf('opera')
      ? {
          type: 'Opera',
          version: Number(t.match(/opera.([\d]+)/)[1]),
        }
      : 0 <= t.indexOf('Safari')
      ? {
          type: 'Safari',
          version: Number(t.match(/version\/([\d]+)/)[1]),
        }
      : {
          type: t,
          version: -1,
        }
  },

  /***************************浏览器操作************************************/

  /**
   * 滚动到浏览器顶部
   */
  scrollToTop() {
    const height = document.documentElement.scrollTop || document.body.scrollTop
    if (height > 0) {
      window.requestAnimationFrame(scrollToTop)
      window.scrollTo(0, height - height / 8)
    }
  },

  /**滚动到浏览器底部 */
  scrollToBottom() {
    window.scrollTo(0, document.documentElement.clientHeight)
  },

  /**
   * 滚动到指定元素区域
   * @param {*} element 带标志符的元素
   */
  smoothScroll(element) {
    document.querySelector(element).scrollIntoView({
      behavior: 'smooth',
    })
  },

  /**
   * 获取可视窗口高度
   * @returns
   */
  getClientHeight() {
    let clientHeight = 0
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      clientHeight =
        document.body.clientHeight < document.documentElement.clientHeight
          ? document.body.clientHeight
          : document.documentElement.clientHeight
    } else {
      clientHeight =
        document.body.clientHeight > document.documentElement.clientHeight
          ? document.body.clientHeight
          : document.documentElement.clientHeight
    }
    return clientHeight
  },

  /**
   * 获取可视窗口宽度
   * @returns
   */
  getPageViewWidth() {
    return (document.compatMode == 'BackCompat' ? document.body : document.documentElement)
      .clientWidth
  },

  /**开启浏览器全屏 */
  openFullScreen() {
    let element = document.body
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullScreen()
    }
  },

  /**退出浏览器全屏 */
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  },

  /**********************js常用工具**********************************/

  /**
   *防抖动函数
   *
   * @param {function} fn 回调函数
   * @param {number} wait 等待时间
   * @return {*}
   */
  debounce(fn, wait) {
    let timer = null

    return function() {
      let context = this,
        args = arguments

      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  },

  /**
   *节流函数
   *
   * @param {function} fn 延迟执行函数
   * @param {number} delay 延迟执行时间
   * @return {*}
   */
  throttle(fn, delay) {
    let curTime = Date.now()

    return function() {
      let context = this,
        args = arguments,
        nowTime = Date.now()

      if (nowTime - curTime >= delay) {
        curTime = Date.now()
        return fn.apply(context, args)
      }
    }
  },

  /**
   *获取数据类型
   *
   * @param {string} value
   * @return {*}
   */
  getType(value) {
    if (value === null) {
      return value + ''
    }
    // 判断数据是引用类型的情况
    if (typeof value === 'object') {
      let valueClass = Object.prototype.toString.call(value),
        type = valueClass.split(' ')[1].split('')
      type.pop()
      return type.join('').toLowerCase()
    } else {
      // 判断数据是基本数据类型的情况和函数的情况
      return typeof value
    }
  },

  /**
   *
   *深层拷贝
   * @param {*} obj 源数据
   * @param {*} [hash=new WeakMap()]
   * @return {*}
   */
  deepClone(obj, hash = new WeakMap()) {
    // 日期对象直接返回一个新的日期对象
    if (obj instanceof Date) {
      return new Date(obj)
    }
    //正则对象直接返回一个新的正则对象
    if (obj instanceof RegExp) {
      return new RegExp(obj)
    }
    //如果循环引用,就用 weakMap 来解决
    if (hash.has(obj)) {
      return hash.get(obj)
    }
    // 获取对象所有自身属性的描述
    let allDesc = Object.getOwnPropertyDescriptors(obj)
    // 遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)

    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        cloneObj[key] = deepClone(obj[key], hash)
      } else {
        cloneObj[key] = obj[key]
      }
    }
    return cloneObj
  },

  /**
   * 按特定个数切割数组
   * @param {*} num 总长度
   * @param {*} size 单个长度
   * @returns array
   */
  splitArrayBySize(num, size) {
    let result = []
    if (num <= size) return [num]
    while (num > size) {
      result.push(size)
      num -= size
    }
    if (num > 0) {
      result.push(num)
    }

    return result
  },

  /************************************文件操作*************************************/
  /**
   * excel表格导出
   * @param {array} headerNameList 表头名称数组
   * @param {array} headerKeyList 与表头名称对应的字段名数组
   * @param {array} List 表格数据 （如有格式化的情况,请格式化后再传入）
   * @param {string} fileName 导出表格的名称
   */
  exportExcel(headerNameList, headerKeyList, List, fileName = '列表') {
    const data = this.formatJson(headerKeyList, List)
    export_json_to_excel(headerNameList, data, fileName)
  },

  formatJson(headerKeyList, jsonData) {
    return jsonData.map(v => headerKeyList.map(j => v[j]))
  },

  /*****************************图形验证码*****************************************/
  drawCode() {},
  /**
   * 判断是否是IE
   */
  isIE() {
    if (!!window.ActiveXobject || 'ActiveXObject' in window) {
      return true
    } else {
      return false
    }
  },
  /**
   * 判断是否是IE11
   */
  isIE11() {
    if (/Trident\/7\./.test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  },

  /**
   * 获取图片请求地址
   * @returns
   */
  getImgServePath() {
    switch (process.env.NODE_ENV) {
      case 'development':
        return 'http://10.3.40.86:9001'
      case 'production':
        return ''
      default:
        return ''
    }
  },

  /**
   * 文件流转base64 data:URL
   * @param {*} blob 文件流
   * @returns
   */
  blobToBase64(blob) {
    let fileReader = new FileReader()
    fileReader.readAsDataURL(blob)
    return new Promise((resolve, reject) => {
      fileReader.onloadend = function() {
        resolve(fileReader.result)
      }
    })
  },
  /**
   *
   * @param {*} n 数字金额
   * @returns 返回大写金额
   */
  digitUppercase(n) {
    var fraction = ['角', '分']
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟'],
    ]
    var head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    var s = ''
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = ''
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p
        n = Math.floor(n / 10)
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    )
  },

  /**
   * base64编码的dataURL转Blob对象
   * @param {*} dataurl dataURL格式
   * @returns 一个Blob对象的实例
   */
  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {
      type: mime,
    })
  },
}

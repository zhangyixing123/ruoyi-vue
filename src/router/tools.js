/** 自定义router整体导出 */
const files = require.context('.', false, /.js$/)
const obj = []

files.keys().forEach(key => {
  if (['./index.js', './localRoutes.js'].includes(key)) return
  if(files(key) && files(key).default) {
    obj.push(...Array.from((files(key).default)))
  }
})

export default obj
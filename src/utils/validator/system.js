// 授信品种名称
export const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    return callback(
      new Error(
        `${window.vm.$t('common.pleaseInput')} ${window.vm.$t('systemManagement.newPassword')}`
      )
    )
  }
  setTimeout(() => {
    if (value.length > 20 || value.length < 6) {
      callback(new Error(window.vm.$t('common.isLength', { min: 6, max: 20 })))
    } else {
      callback()
    }
  }, time)
}

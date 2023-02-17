/**ukey弹窗逻辑封装 */
export const UKeyModal = (context, judgmentCallBack, callback) => {
  context
    .$prompt('输入ukey密码', '输入ukey密码', {
      inputType: 'password',
      inputValidator: judgmentCallBack
        ? judgmentCallBack
        : value => {
            return value ? true : false
          },
      inputErrorMessage: 'ukey密码不能为空',
      confirmButtonText: '确定',
      closeOnClickModal: false,
    })
    .then(_ => {
      return callback ? callback() : undefined
    })
}

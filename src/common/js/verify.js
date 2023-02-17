import i18n from "@/lang/index";
export const RegRule = {
    /*
    *字符串验证规则
    *验证级别：初级
    */
    money: /^\d{0,10}(\.\d{1,2})?$/, // 匹配金额格式
    rate: /^\d{1,2}(\.\d{1,4})?$/, // 不可超过100，最多保留4位小数
    nonnegativeInteger: /^[1-9]\d*$|^0$/, // 非负整数
}
let template = (rule, value, callback, params) => {
    /*
    *el-form表单验证方法公用模板
    *hint1: 提示信息1，值为空时
    *hint2: 提示信息2，值格式错误时
    */
    // let language = Cookies.get('language') || 'zh';
    if (rule.required) {
        if (value === '' || value === undefined || value === null) {
            callback(new Error(i18n.t('common.isEmpty')));
        } else if (!RegRule[params.ruleName].test(value)) {
            callback(new Error(params.errMsg))
        } else {
            callback();
        }
    } else if (value != '' && value != undefined && value != null) {
        if (!RegRule[params.ruleName].test(value)) {
            callback(params.errMsg);
        } else {
            callback();
        }
    } else {
        callback();
    }
}

export class ElValidation {
    static money(rule, value, callback) { // 验证金额格式
        template(rule, value, callback, {
            ruleName: 'money',
            errMsg: i18n.t('common.isMoney'),
        });
    }
    static rate(rule, value, callback) { // 验证利率格式
        template(rule, value, callback, {
            ruleName: 'rate',
            errMsg: i18n.t('common.isRate'),
        });
    }

    static nonnegativeInteger(rule, value, callback) { // 验证非负整数
        template(rule, value, callback, {
            ruleName: 'nonnegativeInteger',
            errMsg: i18n.t('common.isNonnegativeInteger'),
        });
    }
}
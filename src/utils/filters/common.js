/** 字典转换 */
export function dictFilter(val, dictOptions, keys) {
  if (!dictOptions) {
    return val;
  }
  let valueKey = "dictValue",
    labelKey = "dictLabel";
  if (keys) {
    valueKey = keys.valueKey || valueKey;
    labelKey = keys.labelKey || labelKey;
  }
  let dictOption = dictOptions.find((item) => item[valueKey] == val);
  return dictOption ? dictOption[labelKey] : val;
}

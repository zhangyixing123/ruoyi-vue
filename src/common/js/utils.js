import { Message , MessageBox, Loading} from 'element-ui';

/* 模态框 */
var loading;
export function showLoading(loadText){
    loading = Loading.service({
        text: loadText || 'loading……',
        customClass: 'opacity-80'
    });
}
export function hideLoading(){
    loading && loading.close();
}

export const isJson = (obj) => {
    /*
    *判断对象是否为JSON
    *obj: 需要判断的对象
    */
    return (Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length);
}

export const openNewWindow = (url) => {
    /*
    *打开新窗口，防止被拦截
    *@String url
    */
    let a = document.createElement('a');
    a.setAttribute("onclick",`window.open('${url}')`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export const getFormatDate = (timestamp) => {
    /*
    *将时间戳转换成时间格式
    *@timestamp: 时间戳
    */
    let d = new Date(timestamp);
    let years = d.getFullYear();
    let days = d.getDate();
    let months = d.getMonth() + 1;
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    let formate = function(d) {
        return d > 9 ? d : '0' + d;
    }
    return `${years}-${formate(months)}-${formate(days)} ${formate(hours)}:${formate(minutes)}:${formate(seconds)}`;
}

export const showSuccess = (message, callback) => {
    /*
    *提示成功信息
    *@message 提示文字
    *@callback 提示框关闭后的回调
    */
    Message({
        type: 'success',
        message: message,
        showClose: true,
        duration: 1000,
        onClose() {
            callback && callback();
        }
    });
};

export const showError = (message, callback) => {
    /*
    *提示错误信息
    *@message 提示文字
    *@callback 提示框关闭后的回调
    */
    Message({
        type: 'warning',
        message: message,
        showClose: true,
        duration: 3000,
        onClose() {
            callback && callback();
        }
    });
};

export const showMessage = (obj, callback) => {
    /*
    *公用提示信息
    *@obj: 后台返回的json对象
    */
    let status = obj.code; // 取什么字段，试后端接口而定
    let message = obj.msg; // 取什么字段，试后端接口而定
    // status 在正确时的取值，和 后端 协商
    if (status == 200 ) {
        showSuccess(message, callback);
    } else {
        showError(message, callback);
    }
}

export const showInvalidMessage = (obj, prefix = '', suffix = '') => {
    /*
    *显示未通过表单验证的提示信息
    *@obj: form表单验证未通过验证的字段对象
    *@prefix: 需要添加的前缀信息
    *@suffix: 需要添加的后缀信息
    */
    let arr = [];
    console.log(obj);
    for (let key in obj) {
        if (obj[key][0] && obj[key][0].message) {
            arr.push(obj[key][0].message)
        }
    }
    showError(`${prefix}${arr[0]}${suffix}`);
}

export class Storage {
    /*
    *本地储存
    */
    static set(name, data) { //储存
        if (typeof data == 'object' ) { //如果是对象
            if ((isJson(data)) || data instanceof Array) {
                //如果是JSON对象或者数组对象需要转换成字符串再存入本地，不然获取时会出错
                sessionStorage.setItem(name, JSON.stringify(data));
            }
        } else {
            sessionStorage.setItem(name, data);
        }
    }
    static get(name) { //获取
        let result = sessionStorage.getItem(name);
        //如果字符串是json或者数组字符串，就解析返回
        try {
            return JSON.parse(result);
        } catch (e) {
            return result;
        }
    }
    static remove(name) { //移出
        sessionStorage.removeItem(name);
    }
    static clear() { //清除所有sessionStorage
        sessionStorage.clear();
    }
}

export const isIE = () => {
    /*
    *是否是ie浏览器，返回版本号
    */
    let theUA = window.navigator.userAgent.toLowerCase();
    let ieVersion = 0;
    if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0])) {
        ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0];
    } else if (theUA.indexOf('trident') > -1 && theUA.indexOf("rv:11.0") > -1) {
        ieVersion = 11;
    }
    return ieVersion;
}

export const compressImg = (file, maxSize = 524288) => {
    /*
    *压缩图片文件
    *@file: File文件
    */
    function convertBase64UrlToBlob(urlData) {
        const bytes = window.atob(urlData.split(',')[1]); // 去掉url的头，并转换为byte
        // 处理异常,将ascii码小于0的转换为大于0
        const ab = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
    }
    return new Promise((resolve, reject) => {
        try {
            const image = new Image()
            image.src = URL.createObjectURL(file);
            image.onload = function() {
            	const _this = this; // 默认按比例压缩
            	let w = _this.width;
            	let h = _this.height;
                let max = 1920; //最大尺寸，超过就压缩到1920
                let width = w; //计算后的允许的最大宽高
                let height = h;
                // let maxSize = .5 * 1024 * 1024 ; // 限制，压缩到不超过500K
                let quality = Number((maxSize / file.size).toFixed(2));
                quality = quality > 0.6 ? 0.6 : quality < 0.2 ? 0.2 : quality; // 图片质量
                // let quality = .8;
                if (w > h && w / h < 5) { //如果宽高比例不超过5的长图（长图压缩至1920可能会糊）
                    if (w > max) {
                        width = max;
                        height = Math.floor(max / w * h);
                    }
                } else if (h > w && h / w < 5) {
                    if (h > max) {
                        height = max;
                        width = Math.floor(max / h * w);
                    }
                }
            	// 生成canvas
            	const canvas = document.createElement('canvas');
            	const ctx = canvas.getContext('2d'); // 创建属性节点
                canvas.width = width;
                canvas.height = height;
            	ctx.drawImage(_this, 0, 0, width, height); //绘制图片
                const data = canvas.toDataURL('image/jpeg', quality);
                const blob = convertBase64UrlToBlob(data);
                let newFile;
                if (isIE()) {
                    blob.name = file.name;
                    newFile = blob;
                } else {
                    newFile = new File([blob], file.name, {type: file.type.toLowerCase()});
                    // newFile = new File([blob], file.name, {type: 'image/jpg'});
                }
                resolve(newFile);
            }
        } catch (e) {
            resolve(file);
        }
    });
}

export const imgToBase64 = (file) =>{
    if (typeof (FileReader) === 'undefined') {
        return new Promise((resolve, reject) => {
            try {
                const image = new Image()
                image.src = URL.createObjectURL(file);
                image.onload = function() {
                    // 生成canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    ctx.drawImage(this, 0, 0);
                    const base64Url = canvas.toDataURL('image/jpeg', 1);
                    resolve(base64Url);
                }
            } catch (e) {
                resolve(file);
            }
        });
    } else {
        return new Promise((resolve, reject) => {
            try {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) { 
                    let base64Url = this.result
                    resolve(base64Url)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}

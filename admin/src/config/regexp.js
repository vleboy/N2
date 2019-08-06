
export const pattern = {
  positiveInteger: new RegExp(/^[0-9]*[1-9][0-9]*$/),  // 正整数
  url: new RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/), // url验证
  digitalRange : new RegExp(/^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/), // 数字范围验证 （0.00-100.00）
  positive : new RegExp(/^[0-9]+([.]{1}[0-9]{1,2})?$/) // 正数，保留两位小数点
}


//商户表单验证
export const validateUsername = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("用户名不能为空"))
  } else {
    let nameReg = /^[a-zA-Z0-9]{5,16}$/
    if (!nameReg.test(value)) {
      callback(new Error("5-16位,限英文和数字"))
    } else {
      callback()
    }
  }
}
export const validatePwd = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("密码不能为空"));
  } else {
    let pwdReg = /^(\w){6,15}$/
    if (!pwdReg.test(value)) {
      callback(new Error("密码中必须包含6-15位由字母、数字、符号组成"));
    } else {
      callback();
    }
  }
}
export const validateSn = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("标识不能为空"))
  } else {
      callback()
    }
}

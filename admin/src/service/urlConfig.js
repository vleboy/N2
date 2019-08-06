// console.log(process.env.NODE_ENV);
// export const URL='d3rqtlfdd4m9wd.cloudfront.net'
export let URL = () => {
  if (process.env.NODE_ENV == 'production') {
    return 'n1admin.na12345.com'
  } else {
    return '192.168.3.18:2000'
  }
}
// console.log(URL);

export const httpType = 'http://'

export const api = {
  getVaptcha: httpType + URL() + '/vaptcha/getVaptcha',
  getDownTime: httpType + URL() + '/vaptcha/getDownTime'
}

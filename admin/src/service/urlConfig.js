export let URL = () => {
  if (process.env.NODE_ENV == 'production') {
    return 'n1admin.na12345.com'
  } else {
    return '192.168.3.16:2000'
  }
}

export const httpType = 'http://'

export const api = {
  getVaptcha: httpType + URL() + '/vaptcha/getVaptcha',
  getDownTime: httpType + URL() + '/vaptcha/getDownTime'
}

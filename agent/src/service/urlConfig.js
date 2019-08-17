export let URL = () => {
  if (process.env.NODE_ENV == 'production') {
    return 'api.1bets.co'
  } else {
    return 'api.1bets.co'
  }
}

export const httpType = 'https://'

export const api = {
  getVaptcha: httpType + URL() + '/vaptcha/getVaptcha',
  getDownTime: httpType + URL() + '/vaptcha/getDownTime'
}

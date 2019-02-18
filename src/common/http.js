import Axios from 'axios'
import general from '@/common/general'

export default Axios.create({
  baseURL: general.getApiUrl(),
  transformRequest: function (data, headers) {
    let token = window.localStorage.getItem(general.getTokenKey())
    headers['Authorization'] = general.getTokenHeader() + ' ' + token
    return data
  }
})

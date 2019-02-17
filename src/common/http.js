import Axios from 'axios'
import general from '@/common/general'
import session from '@/common/session'

export default Axios.create({
  baseURL: general.getApiUrl(),
  transformRequest: function (data, headers) {
    headers['Authorization'] = session.getAuthHeader()
    return data
  }
})

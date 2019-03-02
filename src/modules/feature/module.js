import state from '@/modules/feature/store/state'
import mutations from '@/modules/feature/store/mutations'
import getters from '@/modules/feature/store/getters'
import actions from '@/modules/feature/store/actions'

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}

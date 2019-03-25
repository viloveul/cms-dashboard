import initial from '@/modules/comment/store/initial'

export default {
  setComment: (state, comment) => {
    state.data = Object.assign({}, initial.data, comment)
  }
}

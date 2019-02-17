import initial from '@/modules/comment/store/initial'

export default {
  setComment: (state, comment) => {
    state.attributes = Object.assign({}, initial.attributes, comment.attributes)
  }
}

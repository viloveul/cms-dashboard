import initial from '@/modules/post/store/initial'

export default {
  setPost (state, post) {
    state.post = Object.assign({}, initial.post, post)
  },
  setTag (state, tag) {
    state.tag = Object.assign({}, initial.tag, tag)
  },
  setTags (state, tags) {
    state.tags = tags
  }
}

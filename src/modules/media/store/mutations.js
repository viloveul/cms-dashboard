import initial from '@/modules/media/store/initial'

export default {
  setFile (state, file) {
    state.attributes = Object.assign({}, initial.attributes, file)
  }
}

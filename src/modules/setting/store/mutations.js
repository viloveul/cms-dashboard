export default {
  setOptions: async (state, payload) => {
    for (let i in payload) {
      if (payload[i] !== null) {
        if (typeof payload[i] !== 'string') {
          state[i] = payload[i]
        } else if (payload[i].length > 0) {
          state[i] = payload[i]
        }
      }
    }
  }
}

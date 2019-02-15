const getters = {
  getOption: (state) => (name, $default = null) => {
    if (typeof state[name] === 'string' && state[name].length > 0) {
      return state[name]
    }
    return (typeof state[name] !== 'undefined' && state[name] !== null) ? state[name] : $default
  }
}

export default getters

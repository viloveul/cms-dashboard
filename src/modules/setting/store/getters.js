export default {
  getOption: (state) => (name, $default = null) => {
    if (state[name] !== undefined && state[name] !== null) {
      return state[name]
    } else if (typeof state[name] === 'string' && state[name].length > 0) {
      return state[name]
    } else {
      return $default
    }
  }
}

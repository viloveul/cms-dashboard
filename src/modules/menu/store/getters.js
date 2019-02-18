export default {
  getMenu: (state) => () => {
    return state.menu
  },
  getMenus: (state) => () => {
    return state.menus
  }
}

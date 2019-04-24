export default {
  getMenu: (state) => () => {
    return state.menu
  },
  getMenus: (state) => () => {
    return state.menus
  },
  getMenuItem: (state) => () => {
    return state.menuItem
  },
  getMenuItems: (state) => () => {
    return state.menuItems
  }
}

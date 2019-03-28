export default {
  getMenu: (state) => () => {
    return state.menu
  },
  getMenus: (state) => () => {
    return state.menus
  },
  getLink: (state) => () => {
    return state.link
  },
  getLinks: (state) => () => {
    return state.links
  }
}

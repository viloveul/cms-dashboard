export default {
  setMenu: async (context, menu) => {
    context.menu = menu
  },
  setMenus: async (context, menus) => {
    context.menus = menus
  },
  setMenuItem: async (context, menuItem) => {
    context.menuItem = menuItem
  },
  setMenuItems: async (context, menuItems) => {
    context.menuItems = menuItems
  }
}

export default {
  setMenu: async (context, menu) => {
    context.menu = menu
  },
  setMenus: async (context, menus) => {
    context.menus = menus
  },
  setLink: async (context, link) => {
    context.link = link
  },
  setLinks: async (context, links) => {
    context.links = links
  }
}

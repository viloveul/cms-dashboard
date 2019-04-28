<template>
  <nav class="board-menu">
    <ul class="menu-inner">
      <li
        v-for="(menu, index) in mymenus"
        :key="index"
        :class="[(activedIndex === index) ? ' active ' : '', (openedParent === index) ? ' opened ' : '']"
      >
        <router-link v-if="menu.childs.length === 0" :to="menu.link" v-on:click.native="activedIndex = index">
          <i :class="'glyphicon glyphicon-' + menu.icon"></i> {{ menu.label }}
        </router-link>
        <span v-else v-on:click="handleClick(index)">
          <i :class="'glyphicon glyphicon-' + menu.icon"></i> {{ menu.label }}
        </span>

        <ul class="sidebar-nav" v-if="menu.childs.length > 0 && (openedParent === index)">
          <li v-for="(child, indexChild) in menu.childs" :key="index + '-' + indexChild" :class="menu.actived === true ? 'active' : ''">
            <router-link :to="child.link" v-on:click.native="activedIndex = index">{{ child.label }}</router-link>
          </li>
        </ul>
      </li>
      <li>
        <span v-on:click="handleLogout">
          <i class="glyphicon glyphicon-log-out"></i> Logout
        </span>
      </li>
    </ul>
  </nav>
</template>

<script type="text/javascript">

export default {
  props: {
    privileges: {
      type: Array,
      default: () => {
        return []
      }
    },
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    async handleLogout () {
      await this.$store.dispatch('user/resetToken')
      await this.$router.push('/login')
    },
    async handleClick (index) {
      if (this.openedParent === index) {
        this.openedParent = -1
      } else {
        this.openedParent = index
      }
    },
    generateMenus () {
      let menus = []
      let filteredMenus = this.menus.filter((item) => {
        return item.privilege === undefined || this.privileges.indexOf(item.privilege) !== -1
      })
      for (var i = 0; i < filteredMenus.length; i++) {
        menus[i] = {...filteredMenus[i]}
        if (menus[i].link === this.path || this.path.search(menus[i].match) !== -1) {
          this.activedIndex = i
        }
        if (menus[i].childs === undefined) {
          menus[i].childs = []
        }
        for (let a = 0; a < menus[i].childs.length; a++) {
          if (menus[i].childs[a].link === this.path) {
            this.activedIndex = i
            menus[i].childs[a].actived = true
          } else {
            menus[i].childs[a].actived = false
          }
        }
      }
      this.openedParent = this.activedIndex
      return menus
    }
  },
  computed: {
    me () {
      return this.$store.getters['user/getMe']()
    },
    mymenus () {
      return this.generateMenus()
    }
  },
  data () {
    return {
      activedIndex: -1,
      openedParent: -1,
      menus: [
        {
          label: 'Profile',
          link: '/',
          icon: 'sunglasses',
          match: /^$/
        },
        {
          label: 'Users',
          link: '/user',
          icon: 'user',
          match: /^\/user\/(update|detail)\/([^/]+)/,
          privilege: 'user.create#access',
          childs: [
            {
              label: 'List User',
              link: '/user',
              actived: false
            },
            {
              label: 'Create New',
              link: '/user/create',
              privilege: 'user.create#access',
              actived: false
            }
          ]
        },
        {
          label: 'Roles',
          link: '/role',
          icon: 'transfer',
          match: /^\/role\/(update\/.+|detail\/.+|assignment\/.+)?$/,
          privilege: 'role.create#access',
          childs: [
            {
              label: 'Management Roles',
              link: '/role',
              actived: false
            },
            {
              label: 'Role Assignment',
              link: '/role/assignment',
              actived: false
            }
          ]
        },
        {
          label: 'Media',
          link: '/media',
          icon: 'picture',
          match: /^\/media\/(gallery|upload)$/,
          privilege: 'media.upload#access',
          childs: [
            {
              label: 'Gallery',
              link: '/media',
              actived: false
            },
            {
              label: 'Upload',
              link: '/media/upload',
              privilege: 'user.create#access',
              actived: false
            }
          ]
        },
        {
          label: 'Posts',
          link: '/post',
          icon: 'book',
          match: /^\/(post|tag)\/(detail|update|create)(\/[^/]+)?$/,
          privilege: 'post.create#access',
          childs: [
            {
              label: 'List Posts',
              link: '/post',
              actived: false
            },
            {
              label: 'Create New',
              link: '/post/create',
              actived: false,
              privilege: 'post.create#access'
            },
            {
              label: 'Tags',
              link: '/tag',
              actived: false,
              privilege: 'tag.index#access'
            }
          ]
        },
        {
          label: 'Comments',
          link: '/comment',
          icon: 'comment',
          match: /^\/comment\/(detail|update)\/([^/]+)$/
        },
        {
          label: 'Features',
          link: '/feature',
          icon: 'link',
          match: /^\/feature\/(widget|banner|menu)$/,
          privilege: 'setting.set#access',
          childs: [
            {
              label: 'Widgets',
              link: '/feature/widget',
              actived: false,
              privilege: 'widget.availables#access'
            },
            {
              label: 'Banner',
              link: '/feature/banner',
              actived: false,
              privilege: 'setting.set#access'
            },
            {
              label: 'Menu Featured',
              link: '/feature/menu',
              actived: false,
              privilege: 'setting.set#access'
            }
          ]
        },
        {
          label: 'Menus',
          link: '/menu',
          icon: 'th-list',
          match: /^\/menu\/(editor|item)/,
          privilege: 'menu.index#access'
        },
        {
          label: 'Setting',
          link: '/setting',
          icon: 'cog',
          match: /^\/setting\/.+$/,
          privilege: 'setting.set#access',
          childs: [
            {
              label: 'General',
              link: '/setting',
              actived: false
            },
            {
              label: 'Theme',
              link: '/setting/theme',
              actived: false
            },
            {
              label: 'Moderator',
              link: '/setting/moderator',
              actived: false
            }
          ]
        }
      ]
    }
  }
}

</script>

<template>
  <div class="app-board" v-if="me.id !== 0">
    <aside class="board-sidebar">
      <h3 class="brand">
        <a :href="getOption('url')" v-if="getOption('url') !== null && getOption('url') !== '/'">
          {{ getOption('brand') }}
        </a>
        <router-link :to="'/'" v-else>
          {{ getOption('brand') }}
        </router-link>
        <span class="bell" v-on:click="handleNotification">
          <i class="glyphicon glyphicon-bell connected" v-if="socketConnected"></i>
          <i class="glyphicon glyphicon-bell disconnected" v-else></i>
          <span class="badge" v-if="mine.notification.unread > 0">{{ mine.notification.unread }}</span>
        </span>
      </h3>
      <NavMenu :path="$route.path" :privileges="mine.privileges">
      </NavMenu>
    </aside>

    <div class="board-wrapper">
      <header v-if="breadcrumbs.length > 0">
        <Breadcrumbs :items="breadcrumbs">
        </Breadcrumbs>
      </header>

      <main class="wrapper-body">
        <div class="alert-collection">
          <div class="alert alert-danger" v-for="(error, index) in errors" :key="index">
            {{ error }}
            <span class="close" v-on:click="handleDeleteError(index)">&times;</span>
          </div>
        </div>
        <router-view :key="$route.path"></router-view>
      </main>

      <Notification v-if="modalNotification === true" v-on:close-notification="toggleNotification">
      </Notification>
    </div>
  </div>
</template>

<script type="text/javascript">

import '@/assets/style.css'

import io from 'socket.io-client'
import general from '@/common/general'
import NavMenu from '@/components/NavMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import Notification from '@/components/Notification'

export default {
  components: {
    NavMenu,
    Breadcrumbs,
    Notification
  },
  async mounted () {
    await this.$store.dispatch('user/fetchMe')
    await this.$store.dispatch('setting/fetchOption', 'url')
    await this.$store.dispatch('setting/fetchOption', 'brand')
    await this.$store.dispatch('setting/fetchOption', 'email')
    await this.$store.dispatch('setting/fetchOption', 'description')
    await this.$store.dispatch('setting/fetchOption', 'banner')
    if (this.me.id === 0) {
      await this.$router.replace('/gate')
    } else {
      let vtoken = 'viloveul:token'
      this.socket = io(general.getRelayUrl(), {
        query: {
          [vtoken]: window.localStorage.getItem('viloveul:token')
        },
        autoConnect: false
      })
      this.socket.open()
      this.socket.on('connect_error', () => {
        this.socket.close()
      })
      this.socket.on('system.notification', (message) => {
        this.$store.commit('user/setMine', {
          notification: {...message}
        })
      })
      this.socket.on('connect', () => {
        this.socketConnected = true
      })
      this.socket.on('disconnect', () => {
        this.socketConnected = false
      })
    }
  },
  methods: {
    handleDeleteError (index) {
      this.errors.splice(index, 1)
    },
    handleNotification () {
      this.toggleNotification()
      if (this.socketConnected === false) {
        this.socket.open()
      }
    },
    toggleNotification () {
      this.modalNotification = !this.modalNotification
    }
  },
  watch: {
    async status (v) {
      if (v === 401) {
        await this.$router.push('/gate')
      }
    }
  },
  computed: {
    getOption () {
      return this.$store.getters['setting/getOption']
    },
    breadcrumbs () {
      return this.$store.getters['getBreadcrumbs']()
    },
    errors () {
      return this.$store.getters['getErrors']()
    },
    me () {
      return this.$store.getters['user/getMe']()
    },
    mine () {
      return this.$store.getters['user/getMine']()
    },
    status () {
      return this.$store.getters['getStatus']()
    }
  },
  data () {
    return {
      socket: null,
      socketConnected: false,
      modalNotification: false
    }
  }
}

</script>

<template>
  <div class="app-board">
    <aside class="board-sidebar">
      <h3 class="brand">
        <a :href="getOption('url')" v-if="getOption('url') !== null && getOption('url') !== '/'">
          {{ getOption('brand') }}
        </a>
        <router-link :to="'/'" v-else>
          {{ getOption('brand') }}
        </router-link>
      </h3>
      <NavMenu :path="$route.path" :privileges="privileges" />
    </aside>
    <div class="board-wrapper">
      <header v-if="breadcrumbs.length > 0">
        <Breadcrumbs :items="breadcrumbs" />
      </header>
      <main class="wrapper-body">
        <div class="alert alert-danger" v-for="(error, index) in errors" :key="index">
          {{ error }}
          <span class="close" v-on:click="handleDeleteError(index)">&times;</span>
        </div>
        <router-view :key="$route.path"></router-view>
      </main>
    </div>
  </div>
</template>

<script type="text/javascript">

import '@/assets/style.css'

import NavMenu from '@/components/NavMenu'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  components: {
    NavMenu,
    Breadcrumbs
  },
  async mounted () {
    await this.$store.dispatch('user/fetchMe')
    let url = await this.$store.dispatch('setting/fetchOption', 'url')
    let brand = await this.$store.dispatch('setting/fetchOption', 'brand')
    let email = await this.$store.dispatch('setting/fetchOption', 'email')
    let description = await this.$store.dispatch('setting/fetchOption', 'description')
    let banner = await this.$store.dispatch('setting/fetchOption', 'banner')
    window.localStorage.setItem('general:url', url)
    window.localStorage.setItem('general:brand', brand)
    window.localStorage.setItem('general:email', email)
    window.localStorage.setItem('general:description', description)
    window.localStorage.setItem('general:banner', banner)
    if (this.me.id === 0) {
      await this.$router.push('/login')
    }
  },
  methods: {
    handleDeleteError (index) {
      this.errors.splice(index, 1)
    }
  },
  watch: {
    async status (v) {
      if (v === 401) {
        await this.$router.push('/login')
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
    privileges () {
      return this.$store.getters['user/getPrivileges']()
    },
    status () {
      return this.$store.getters['getStatus']()
    }
  }
}

</script>

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
    if (this.me.id === 0) {
      await this.$router.replace('/login')
    }
    await this.$store.dispatch('setting/fetchOption', 'url')
    await this.$store.dispatch('setting/fetchOption', 'brand')
    await this.$store.dispatch('setting/fetchOption', 'email')
    await this.$store.dispatch('setting/fetchOption', 'description')
    await this.$store.dispatch('setting/fetchOption', 'banner')
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

<template>
  <div class="app-board">
    <aside class="board-sidebar">
      <h3 class="brand">
        <router-link :to="'/'">
          <i class="glyphicon glyphicon-home"></i> {{ getOption('brand') }}
        </router-link>
      </h3>
      <div class="sidebar-inner">
        <NavMenu :path="$route.path" :privileges="privileges" />
      </div>
    </aside>
    <div class="board-wrapper">
      <div class="wrapper-head" v-if="breadcrumbs.length > 0">
        <Breadcrumbs :items="breadcrumbs" />
        <p class="me">
          {{ me.nickname || me.name }}
        </p>
      </div>
      <div class="wrapper-body">
        <div class="alert alert-danger" v-for="(error, index) in errors" :key="index">
          {{ error }}
          <span class="close" v-on:click="handleDeleteError(index)">&times;</span>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import '@/assets/style.css'

import NavMenu from '@/components/NavMenu'
import Breadcrumbs from '@/components/Breadcrumbs'
import session from '@/common/session'

export default {
  components: {
    NavMenu,
    Breadcrumbs
  },
  async mounted () {
    await this.$store.dispatch('user/fetchMe')
    if (!session.hasToken()) {
      await this.$router.push('/login')
    } else {
      await this.$store.dispatch('setting/fetchOption', 'brand')
      await this.$store.dispatch('setting/fetchOption', 'tags')
    }
  },
  methods: {
    handleDeleteError (index) {
      this.errors.splice(index, 1)
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
    }
  }
}

</script>

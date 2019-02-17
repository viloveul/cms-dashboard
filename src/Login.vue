<template>
  <div class="login-page-container">
    <div class="login-page">
      <h1><router-link :to="'/'">{{ brand }}</router-link></h1>
      <div class="login-page-inner">
        <div class="alert alert-danger" v-for="(error, index) in errors" :key="index">
          {{ error }}
        </div>
        <form method="post" v-on:submit.prevent="handleSubmit">
          <div class="form-group">
            <div class="input-group input-group-username">
              <div class="input-group-addon">
                <i class="glyphicon glyphicon-user"></i>
              </div>
              <input type="text" v-model="username" class="form-control input-lg" autocomplete="off" placeholder="Username">
            </div>
          </div>
          <div class="form-group">
            <div class="input-group input-group-password">
              <div class="input-group-addon">
                <i class="glyphicon glyphicon-lock"></i>
              </div>
              <input type="password" v-model="password" class="form-control input-lg" autocomplete="off" placeholder="Password">
            </div>
          </div>
          <button class="btn btn-primary btn-block btn-lg" type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import '@/assets/login.css'
import session from '@/common/session'

export default {
  name: 'Login',
  data () {
    return {
      brand: 'Viloveul',
      username: null,
      password: null
    }
  },
  methods: {
    async handleSubmit (e) {
      await this.$store.dispatch('resetErrors')
      await this.$store.dispatch('user/requestToken', {
        username: this.username,
        password: this.password
      })
      if (session.hasToken()) {
        await this.$router.replace(this.redirect)
      }
    }
  },
  async mounted () {
    session.unsetToken()
    await this.$store.commit('setTitle', 'Login')
    this.brand = await this.$store.dispatch('setting/fetchOption', 'brand')
  },
  computed: {
    errors () {
      return this.$store.getters['getErrors']()
    },
    redirect () {
      return this.$store.getters['getRedirect']()
    }
  }
}

</script>

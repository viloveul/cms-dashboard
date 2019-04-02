<template>
  <div class="gate-page-container">
    <div class="gate-page-inner">
      <div class="gate-page-title">{{ title }}</div>
      <div class="alert-collection">
        <div class="alert alert-danger" v-for="(error, index) in errors" :key="index">
          {{ error }}
        </div>
      </div>
      <form method="post" v-on:submit.prevent="handleSubmitLogin" v-if="page === 'login'">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">
              <i class="glyphicon glyphicon-user"></i>
            </div>
            <input type="text" v-model="user.username" class="form-control input-lg" autocomplete="off" placeholder="Username">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">
              <i class="glyphicon glyphicon-lock"></i>
            </div>
            <input type="password" v-model="user.password" class="form-control input-lg" autocomplete="off" placeholder="Password">
          </div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Submit</button>
      </form>

      <form method="post" v-on:submit.prevent="handleSubmitRegister" v-if="page === 'register'">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">#</div>
            <input type="text" v-model="user.name" class="form-control input-lg" autocomplete="off" placeholder="Fullname">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">#</div>
            <input type="text" v-model="user.email" class="form-control input-lg" autocomplete="off" placeholder="Email">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">#</div>
            <input type="text" v-model="user.username" class="form-control input-lg" autocomplete="off" placeholder="Username">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">#</div>
            <input type="password" v-model="user.password" class="form-control input-lg" autocomplete="off" placeholder="Password">
          </div>
        </div>
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">#</div>
            <input type="password" v-model="user.passconf" class="form-control input-lg" autocomplete="off" placeholder="Password Confirmation">
          </div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Submit</button>
      </form>

      <form method="post" v-on:submit.prevent="handleSubmitReset" v-if="page === 'reset'">
        <div class="form-group">
          <div class="input-group">
            <div class="input-group-addon">
              <i class="glyphicon glyphicon-envelope"></i>
            </div>
            <input type="text" v-model="user.email" class="form-control input-lg" autocomplete="off" placeholder="Email">
          </div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">Submit</button>
      </form>
      <ul class="option">
        <li v-if="page !== 'login'">
          <a href="#" v-on:click.prevent="handlePageChanged('login', 'Login Page')">Get Login</a>
        </li>
        <li v-if="page !== 'register'">
          <a href="#" v-on:click.prevent="handlePageChanged('register', 'Create Account')">Create Account</a>
        </li>
        <li v-if="page !== 'reset'">
          <a href="#" v-on:click.prevent="handlePageChanged('reset', 'Reset Password')">Reset Password</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import '@/assets/gate.css'

import endpoints from '@/common/endpoints'

export default {
  name: 'Gate',
  data () {
    return {
      user: {
        email: null,
        name: null,
        username: null,
        password: null,
        passconf: null
      },
      page: 'login',
      title: 'Login Page'
    }
  },
  methods: {
    async handleSubmitLogin () {
      await this.$store.dispatch('resetErrors')
      await this.$store.dispatch('user/requestToken', {
        username: this.user.username,
        password: this.user.password
      })
      if (this.me.id !== 0) {
        await this.$router.replace(this.redirect)
      }
      await this.resetParams()
    },
    async handleSubmitReset () {
      await this.$store.dispatch('resetErrors')
      await endpoints.requestPassword({
        email: this.user.email
      })
      await this.resetParams()
      await this.handlePageChanged('login', 'Login Page')
    },
    async handleSubmitRegister () {
      await this.$store.dispatch('resetErrors')
      await endpoints.requestAccount({
        ...this.user
      })
      await this.resetParams()
      await this.handlePageChanged('login', 'Login Page')
    },
    async resetParams () {
      this.user = {
        email: null,
        name: null,
        username: null,
        password: null,
        passconf: null
      }
    },
    async handlePageChanged (page, title) {
      await this.$store.dispatch('resetErrors')
      this.page = page
      this.title = title
    }
  },
  async mounted () {
    await this.$store.commit('setTitle', 'Login')
    await this.$store.dispatch('user/resetToken')
  },
  computed: {
    errors () {
      return this.$store.getters['getErrors']()
    },
    me () {
      return this.$store.getters['user/getMe']()
    },
    redirect () {
      return this.$store.getters['getRedirect']()
    }
  }
}

</script>

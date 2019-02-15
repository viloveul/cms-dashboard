<template>
  <div class="user-container">
    <h2>User Editor</h2>
    <form method="post" v-on:submit.prevent="handleSave">
      <div class="form-group">
        <label>Name</label>
        <input type="text" class="form-control" v-model="user.attributes.name">
        <small class="help-block">Input the full name</small>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Username</label>
            <input type="text" class="form-control" v-model="user.attributes.username">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model="user.attributes.email">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="user.attributes.password">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>Confirmation</label>
            <input type="password" class="form-control" v-model="user.attributes.passconf">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Groups</label>
        <label class="checkbox-inline" v-for="(group, index) in roles" :key="index">
          <input type="checkbox" v-model="relations" :value="group.id"> {{ group.name }}
        </label>
      </div>
      <div class="form-group">
        <label>Status</label>
        <div class="row">
          <div class="col-md-3">
            <select class="form-control input-sm" v-model="user.attributes.status">
              <option value="0">Inactive</option>
              <option value="1">Active</option>
              <option value="2">On Moderate</option>
              <option value="3">Deleted</option>
            </select>
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-sm btn-primary">Save</button>
    </form>
  </div>
</template>

<script type="text/javascript">

export default {
  async mounted () {
    await this.$store.dispatch('updateTitle', 'User Editor')
    await this.$store.commit('setBreadcrumbs', [
      {
        label: 'Board',
        link: '/'
      },
      {
        label: 'Users',
        link: '/user'
      },
      {
        label: 'Editor'
      }
    ])
    await this.$store.dispatch('user/fetchRoles', {type: 'group'})
    if (this.$route.params.id !== undefined) {
      await this.$store.dispatch('user/fetchUser', this.$route.params.id)
      this.relations = this.user.relationships.roles.data.map(role => {
        return role.id
      })
    }
  },
  async beforeRouteLeave (to, from, next) {
    await this.$store.dispatch('user/resetUser')
    next()
  },
  methods: {
    async handleSave () {
      let action = this.user.id > 0 ? 'user/updateUser' : 'user/createUser'
      await this.$store.dispatch(action, {
        ...this.user.attributes,
        relations: this.relations
      })
      await this.$store.dispatch('user/resetUser')
      await this.$router.push('/user')
    }
  },
  computed: {
    user () {
      return this.$store.getters['user/getUser']()
    },
    roles () {
      return this.$store.getters['user/getRoles']()
    }
  },
  data () {
    return {
      relations: []
    }
  }
}
</script>

<style type="text/css">
@import './../assets/style.css'
</style>

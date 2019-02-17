<template>
  <div class="user-container">
    <h2>Edit Roles</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control input-sm" v-model="role.attributes.name">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control input-sm" v-model="role.attributes.description"></textarea>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="role.attributes.type">
              <option :value="'group'">Role Group</option>
              <option :value="'access'">Role Access</option>
            </select>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-sm btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'

export default {
  async beforeRouteLeave (to, from, next) {
    await this.$store.dispatch('user/resetRole')
    next()
  },
  async mounted () {
    await this.$store.dispatch('user/fetchRole', this.$route.params.id)
    await this.$store.commit('setTitle', 'Roles')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Roles'}
    ])
  },
  methods: {
    async handleSave () {
      await this.$store.dispatch('user/updateRole', {...this.role.attributes})
      await this.$store.dispatch('user/resetRole')
      await this.$router.push('/role')
    }
  },
  computed: {
    role () {
      return this.$store.getters['user/getRole']()
    }
  }
}
</script>

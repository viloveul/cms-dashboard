<template>
  <div class="menu-container">
    <h2>Menu Item</h2>
    <form class="form-horizontal" v-on:submit.prevent="handleSave">
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Label</label>
        <div class="col-md-4">
          <input type="text" v-model="item.label" class="form-control">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Link Url</label>
        <div class="col-md-4">
          <input type="text" v-model="item.url" class="form-control">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Icon Url</label>
        <div class="col-md-4">
          <input type="text" v-model="item.icon" class="form-control">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Description</label>
        <div class="col-md-6">
          <textarea v-model="item.description" class="form-control"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Role User</label>
        <div class="col-md-9">
          <select class="form-control" v-model="item.role_id">
            <option :value="''">-</option>
            <option v-for="(role, indexRole) in roles" :key="'role-' + indexRole" :value="role.id">
              {{ role.name }}#{{ role.type }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-12">
          <button type="submit" class="btn btn-primary">Save</button>
          <span class="btn btn-warning" v-on:click="handleCancel">Cancel</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script type="text/javascript">

export default {
  async created () {
    this.roles = await this.$store.dispatch('user/fetchRoles', {
      size: 1000,
      page: 1
    })
  },
  async mounted () {
    this.$store.dispatch('menu/resetMenuItem')
    this.$store.dispatch('menu/fetchMenuItem', this.$route.params.id)
  },
  computed: {
    item () {
      return this.$store.getters['menu/getMenuItem']()
    }
  },
  methods: {
    async handleCancel () {
      await this.$router.push('/menu/editor/' + this.item.menu_id)
    },
    async handleSave () {
      await this.$store.dispatch('menu/updateMenuItem', {
        ...this.item
      })
      await this.$router.push('/menu/editor/' + this.item.menu_id)
    }
  },
  data: () => {
    return {
      roles: []
    }
  }
}
</script>

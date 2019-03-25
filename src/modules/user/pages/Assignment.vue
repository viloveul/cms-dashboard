<template>
  <div class="user-container">
    <h2>Management Roles</h2>
    <div class="row">
      <div class="col-md-10">
        <div class="form-group">
          <select class="form-control input-sm" v-model="id" v-on:change="handleChange">
            <option value="0" disabled="disabled">Select Group</option>
            <option v-for="(theGroup, x) in groups" :key="'group-' + x" :value="theGroup.id">
              {{ theGroup.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <div class="form-group">
          <label>Assigned Roles</label>
          <select class="form-control input-sm" v-model="toUnAssign" multiple="multiple" style="height: 300px;">
            <option v-if="id.length > 0" v-for="(theAccess, x) in group.childs" :key="'assigned-' + x" :value="theAccess.id">
              {{ theAccess.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-2 dor">
        <span class="btn btn-info btn-block" v-on:click="handleAssign">Assign</span>
        <span class="btn btn-danger btn-block" v-on:click="handleUnAssign">UnAssign</span>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Available Roles</label>
          <select class="form-control input-sm" v-model="toAssign" multiple="multiple" style="height: 300px;">
            <option v-if="id.length > 0" v-for="(theAccess, x) in availables" :key="'available-' + x" :value="theAccess.id">
              {{ theAccess.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'

export default {
  async mounted () {
    await this.$store.commit('setTitle', 'Role Assignment')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Roles', link: '/role'},
      {label: 'Role Assignment'}
    ])
    this.roles = await this.$store.dispatch('user/fetchRoles')
  },
  methods: {
    async handleAssign () {
      await this.$store.dispatch('user/assignRoleChilds', {
        id: this.id,
        childIds: this.toAssign
      })
      await this.handleChange()
    },
    async handleUnAssign () {
      await this.$store.dispatch('user/unAssignRoleChilds', {
        id: this.id,
        childIds: this.toUnAssign
      })
      await this.handleChange()
    },
    async handleChange () {
      await this.$store.dispatch('user/fetchRole', this.id)
    }
  },
  computed: {
    group () {
      return this.$store.getters['user/getRole']()
    },
    access () {
      return this.roles.filter(res => {
        return res.type !== 'group'
      })
    },
    groups () {
      return this.roles.filter(res => {
        return res.type === 'group'
      })
    },
    exists () {
      return this.group.childs.map(res => {
        return res.id
      })
    },
    availables () {
      return this.access.filter(res => {
        return this.exists.indexOf(res.id) === -1
      })
    }
  },
  data: () => {
    return {
      id: 0,
      toAssign: [],
      toUnAssign: [],
      roles: []
    }
  }
}
</script>

<style type="text/css" scoped>
  .dor {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 300px;
  }
</style>

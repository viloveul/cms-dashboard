<template>
  <div class="user-container">
    <div class="media">
      <div class="media-left hidden-xs">
        <router-link :to="'/@' + me.username">
          <img :src="me.picture" class="media-object thumbnail" style="max-height: 120px;" :alt="me.username">
        </router-link>
      </div>
      <div class="media-body">
        <h2 class="media-heading">{{ me.name }}</h2>
        <table class="table table-condensed">
          <tbody>
            <tr>
              <td class="key">Username</td>
              <td class="colon">:</td>
              <td>{{ me.username }}</td>
            </tr>
            <tr>
              <td class="key">Email</td>
              <td class="colon">:</td>
              <td>{{ me.email }}</td>
            </tr>
            <tr>
              <td class="key">Created</td>
              <td class="colon">:</td>
              <td>{{ me.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <form>
      <div class="form-group">
        <label>Nick Name</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>website/blog</label>
        <input type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Birthday</label>
        <input type="text" class="form-control">
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script type="text/javascript">

export default {
  computed: {
    me () {
      return this.$store.getters['user/getMe']()
    }
  }
}
</script>

<style type="text/css">
@import './../assets/style.css'
</style>

<style type="text/css" scoped="true">
.user-container table,
.user-container table * {
  background: none !important;
  border: none;
}
.user-container table td {
  padding: 0px;
}
.user-container table td.key {
  width: 75px;
}
.user-container table td.colon {
  width: 10px;
}
</style>

<template>
  <div class="post-container">
    <h2>Comment Editor</h2>
    <form method="post" class="row" v-on:submit.prevent="handleSave">
      <div class="col-md-9">
        <div class="form-group">
          <label class="hidden-lg hidden-md">Name</label>
          <input type="text" class="form-control input-lg" v-model="comment.name" placeholder="Name...">
        </div>
        <div class="form-group">
          <label>Email</label>
          <div class="input-group">
            <span class="input-group-addon">
              <i class="glyphicon glyphicon-envelope"></i>
            </span>
            <input type="text" class="form-control input-sm" v-model="comment.email">
          </div>
        </div>
        <div class="form-group">
          <label>Website</label>
          <div class="input-group">
            <span class="input-group-addon">
              <i class="glyphicon glyphicon-link"></i>
            </span>
            <input type="text" class="form-control input-sm" v-model="comment.website" placeholder="http://">
          </div>
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea class="form-control input-sm" v-model="comment.content" rows="10"></textarea>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel panel-default">
          <div class="panel-heading">Meta</div>
          <div class="panel-body">
            <div class="form-group">
              <label>Status</label>
              <select class="form-control input-sm" v-model="comment.status">
                <option value="1">Publish</option>
                <option value="0">Un Publish</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input v-model="comment.created_at" type="text" class="form-control input-sm" readonly="readonly">
            </div>
          </div>
        </div>
        <span class="btn btn-warning btn-block" v-on:click="handleReset">Reset</span>
        <button type="submit" class="btn btn-primary btn-block">Save</button>
      </div>
    </form>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'

export default {
  async mounted () {
    await this.$store.dispatch('comment/resetComment')
    await this.$store.dispatch('comment/fetchComment', this.$route.params.id)
    await this.$store.commit('setTitle', 'Comment Editor')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Comments', link: '/comment'},
      {label: 'Comment Editor'}
    ])
  },
  methods: {
    async handleReset () {
      await this.$store.dispatch('comment/resetComment')
      await this.$store.dispatch('comment/fetchComment', this.$route.params.id)
    },
    async handleSave () {
      await this.$store.dispatch('comment/updateComment', {...this.comment})
      await this.$store.dispatch('comment/resetComment')
      await this.$router.push('/comment')
    }
  },
  computed: {
    comment () {
      return this.$store.getters['comment/getComment']()
    }
  },
  data: () => {
    return {
      types: []
    }
  }
}
</script>

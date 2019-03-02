<template>
  <div class="setting-container">
    <h2>General Settings</h2>
    <form method="post" class="form-horizontal" v-on:submit.prevent="handleSave">
      <div class="form-group">
        <label class="col-md-2 control-label control-label-normal">Brand Name</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="options.brand">
        </div>
      </div>
      <div class="form-group">
        <label class="col-md-2 control-label control-label-normal">URL</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="options.url">
        </div>
      </div>
      <div class="form-group">
        <label class="col-md-2 control-label control-label-normal">Email</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="options.email">
        </div>
      </div>
      <div class="form-group">
        <label class="col-md-2 control-label control-label-normal">Description</label>
        <div class="col-md-6">
          <textarea class="form-control" v-model="options.description" placeholder="Input something..."></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-8">
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'

export default {
  async mounted () {
    await this.$store.commit('setTitle', 'Settings')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Settings'}
    ])
    await this.$store.dispatch('setting/fetchOption', 'brand')
    await this.$store.dispatch('setting/fetchOption', 'description')
    await this.$store.dispatch('setting/fetchOption', 'email')
    await this.$store.dispatch('setting/fetchOption', 'url')
    this.options.brand = this.$store.getters['setting/getOption']('brand')
    this.options.description = this.$store.getters['setting/getOption']('description')
    this.options.email = this.$store.getters['setting/getOption']('email')
    this.options.url = this.$store.getters['setting/getOption']('url')
  },
  methods: {
    async handleSave () {
      await this.$store.dispatch('setting/updateOption', this.options)
      for (let i in this.options) {
        window.localStorage.setItem('general:' + i, this.options[i])
      }
    }
  },
  data () {
    return {
      banner: false,
      options: {
        brand: '',
        description: '',
        email: '',
        url: ''
      }
    }
  }
}
</script>

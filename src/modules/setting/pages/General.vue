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
        <label class="col-md-2 control-label control-label-normal">Banner</label>
        <div class="col-md-10">
          <div v-if="options.banner !== null && options.banner.length > 0">
            <img :src="options.banner" style="max-width: 100%;" /><br />
            <span class="btn btn-danger btn-xs" v-on:click="options.banner = ''">Delete Banner</span>
          </div>
          <span class="btn btn-info" v-on:click="banner = true" v-else>Add Banner Image</span>
        </div>
      </div>
      <div class="form-group">
        <div class="col-md-8">
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </div>
    </form>
    <Fileman v-if="banner" v-on:close-fileman="banner = false" v-on:selected-fileman="handleSelectedBanner" />
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import Fileman from '@/modules/media/components/Fileman'

export default {
  components: {
    Fileman
  },
  async mounted () {
    await this.$store.commit('setTitle', 'Settings')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Settings'}
    ])
    await this.$store.dispatch('setting/fetchOption', 'brand')
    await this.$store.dispatch('setting/fetchOption', 'description')
    await this.$store.dispatch('setting/fetchOption', 'email')
    await this.$store.dispatch('setting/fetchOption', 'banner')
    await this.$store.dispatch('setting/fetchOption', 'url')
    this.options.brand = this.$store.getters['setting/getOption']('brand')
    this.options.description = this.$store.getters['setting/getOption']('description')
    this.options.email = this.$store.getters['setting/getOption']('email')
    this.options.banner = this.$store.getters['setting/getOption']('banner')
    this.options.url = this.$store.getters['setting/getOption']('url')
  },
  methods: {
    handleSelectedBanner (x) {
      this.banner = false
      if (x.type.indexOf('image') !== -1) {
        this.options.banner = x.url
      }
    },
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
        url: '',
        banner: ''
      }
    }
  }
}
</script>

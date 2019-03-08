<template>
  <div class="setting-container">
    <h2>
      Theme Settings
      <a href="#" style="font-size: 10pt;" v-on:click.prevent="handleSync">
        <i class="glyphicon glyphicon-refresh"></i> Sync
      </a>
    </h2>
    <div v-if="theme.name !== null" class="form-horizontal">
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Name</label>
        <div class="col-md-10">
          <p class="form-control-static">{{ theme.name }}</p>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Author</label>
        <div class="col-md-10">
          <p class="form-control-static">{{ theme.author }}</p>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Support</label>
        <div class="col-md-10">
          <table class="table table-condensed">
            <thead>
              <tr>
                <th>Contents</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <pre>{{ contents }}</pre>
                </td>
                <td>
                  <pre>{{ features }}</pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="alert alert-warning" v-else>
      Please "sync" your theme
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import Axios from 'axios'

export default {
  async mounted () {
    await this.$store.commit('setTitle', 'Settings')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Settings'}
    ])
    await this.$store.dispatch('setting/fetchOption', 'theme')
    await this.$store.dispatch('setting/fetchOption', 'contents')
    await this.$store.dispatch('setting/fetchOption', 'features')
    await this.assign()
  },
  methods: {
    async assign () {
      this.theme = this.$store.getters['setting/getOption']('theme', {name: null, author: null})
      this.contents = this.$store.getters['setting/getOption']('contents', {})
      this.features = this.$store.getters['setting/getOption']('features', {})
    },
    async handleSync () {
      let url = await this.$store.dispatch('setting/fetchOption', 'url')
      if (url !== null && url.length > 0) {
        Axios.get(url + '/sync.json').then(async (res) => {
          if (res.data.name !== undefined) {
            this.theme.name = res.data.name
            this.theme.author = res.data.author === undefined ? 'No Name' : res.data.author
            await this.$store.dispatch('setting/updateOption', {
              theme: this.theme,
              contents: res.data.support.contents !== undefined ? res.data.support.contents : {},
              features: res.data.support.features !== undefined ? res.data.support.features : {}
            })
            await this.assign()
          }
        }).catch(async (e) => {
          await this.$store.commit('setErrors', [e.message])
        })
      }
    }
  },
  data () {
    return {
      theme: {
        name: null,
        author: null
      },
      contents: {},
      features: {}
    }
  }
}
</script>

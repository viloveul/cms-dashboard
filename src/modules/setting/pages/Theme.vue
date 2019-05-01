<template>
  <div class="setting-container">
    <h2>
      Theme Settings
    </h2>
    <div class="form-group">
      <label>Update Configuration File (property.json)</label>
      <input type="file" v-on:change="handleJsonFile">
    </div>
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
    async handleJsonFile (e) {
      if (e.target.files[0] !== undefined && e.target.files[0].type === 'application/json') {
        try {
          let reader = new FileReader()
          reader.onload = (e) => {
            this.jsonValue = JSON.parse(e.target.result)
            if (this.jsonValue) {
              this.handleSync()
            }
          }
          reader.readAsText(e.target.files[0])
        } catch (err) {
          // do nothing
        }
      }
    },
    async handleSync () {
      this.theme.name = this.jsonValue.name
      this.theme.author = this.jsonValue.author === undefined ? 'No Name' : this.jsonValue.author
      await this.$store.dispatch('setting/updateOption', {
        theme: this.theme,
        contents: this.jsonValue.support.contents !== undefined ? this.jsonValue.support.contents : {},
        features: this.jsonValue.support.features !== undefined ? this.jsonValue.support.features : {}
      })
      await this.assign()
    }
  },
  data () {
    return {
      jsonValue: {},
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

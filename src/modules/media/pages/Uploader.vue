<template>
  <div class="media-container">
    <h2>Upload</h2>
    <div class="media-uploader">
      <div class="form-group">
        <input type="file" multiple="multiple" ref="file" v-on:change="handleFileUpload" class="form-control input-lg">
      </div>
      <div class="form-group" v-if="logs.length > 0">
        <p class="form-control-static" v-for="(myfile, index) in files" :key="index">
          {{ myfile.name }} ({{ myfile.size }})
        </p>
      </div>
      <span class="btn btn-primary" v-on:click="handleUpload">Upload</span>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'

export default {
  async mounted () {
    await this.$store.commit('setTitle', 'Media Upload')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Media', link: '/media'},
      {label: 'Upload'}
    ])
  },
  methods: {
    handleFileUpload () {
      this.files = this.$refs.file.files
      this.logs = [...this.files]
    },
    async handleUpload () {
      for (let i = 0; i < this.files.length; i++) {
        let data = new FormData()
        data.append('file', this.files[i])
        await this.$store.dispatch('media/uploadFile', data)
        this.logs.splice(i, 1)
      }
      this.$refs.file.value = []
      this.$router.push('/media')
    }
  },
  data () {
    return {
      files: [],
      logs: []
    }
  }
}
</script>

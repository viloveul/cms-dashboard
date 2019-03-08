<template>
  <div class="feature-container">
    <h2>Banner</h2>
    <div class="form-group">
      <div class="thumbnail" :style="'width: ' + width + 'px; height: ' + height + 'px;'">
        <img :src="url" style="width: 100%; height: 100%;">
      </div>
    </div>
    <div class="form-group">
      <span class="btn btn-warning" v-on:click="toggleModal">Change</span>
    </div>
    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modal === true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click="toggleModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              Change Banner Image
            </h4>
          </div>
          <div class="modal-body">
            <croppa v-model="banner"
              :width="width"
              :height="height"
              :disable-scroll-to-zoom="false"
              :disable-drag-to-move="false"
              :prevent-white-space="true"
              :disable-rotation="true"
            >
            </croppa>
          </div>
          <div class="modal-footer">
            <span class="btn btn-info" v-on:click="handleSave">Save</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import '@/modules/feature/assets/style.css'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  async mounted () {
    await this.$store.dispatch('setting/fetchOption', 'features')
    await this.$store.commit('setTitle', 'Banner')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Banner'}
    ])
    try {
      let features = this.$store.getters['setting/getOption']('features', {})
      let banner = features.banner
      if (banner.width !== undefined && banner.height !== undefined) {
        this.url = await this.$store.dispatch('setting/fetchOption', 'banner') || null
        this.width = parseInt(banner.width)
        this.height = parseInt(banner.height)
      }
    } catch (e) {
      // do nothing
    }
  },
  methods: {
    async toggleModal () {
      this.modal = !this.modal
    },
    async handleSave () {
      await this.banner.generateBlob(
        async blob => {
          let form = new FormData()
          form.append('banner', blob)
          let data = await this.$store.dispatch('media/uploadFile', form)
          if (data.length > 0) {
            this.url = data[0].attributes.url
            this.toggleModal()
            await this.$store.dispatch('setting/updateOption', {
              banner: this.url
            })
          }
        },
        'image/png',
        0
      )
    }
  },
  data () {
    return {
      modal: false,
      url: '',
      width: 0,
      height: 0,
      params: {},
      headers: {},
      banner: null
    }
  }
}

</script>

<style type="text/css" scoped="true">
.modal {
  display: block;
}
.modal .modal-dialog {
  width: auto;
  min-width: 100%;
  margin: 0px;
  border: none;
}
.modal .modal-dialog .modal-content {
  border-radius: 0px;
  min-height: 100vh;
}
</style>

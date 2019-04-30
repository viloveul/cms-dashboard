<template>
  <div class="feature-container">
    <h2>Banner</h2>
    <div v-if="width > 0 && height > 0">
      <div class="form-group">
        <div class="thumbnail" :style="'width: ' + width + 'px; height: ' + height + 'px;'">
          <img :src="url" style="width: 100%; height: 100%;">
        </div>
      </div>
      <div class="form-group">
        <span class="btn btn-warning" v-on:click="toggleModalUploader">Upload</span>
        <span class="btn btn-warning" v-on:click="toggleModalMedia">Media</span>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      Not Support
    </div>
    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modalUploader === true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click="toggleModalUploader" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              Change Banner Image
            </h4>
          </div>
          <div class="modal-body" style="text-align: center;">
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

    <Fileman
      v-on:close-fileman="toggleModalMedia"
      v-if="modalMedia === true"
      v-on:selected-fileman="handleSelectedMedia"
    >
    </Fileman>
  </div>
</template>

<script type="text/javascript">

import '@/modules/feature/assets/style.css'
import 'vue-croppa/dist/vue-croppa.css'
import Fileman from '@/modules/media/components/Fileman'

export default {
  components: {
    Fileman
  },
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
    async toggleModalUploader () {
      this.modalUploader = !this.modalUploader
    },
    async toggleModalMedia () {
      this.modalMedia = !this.modalMedia
    },
    async handleSelectedMedia (media) {
      this.url = media.url
      await this.$store.dispatch('setting/updateOption', {
        banner: this.url
      })
      await this.toggleModalMedia()
    },
    async handleSave () {
      await this.banner.generateBlob(
        async blob => {
          let form = new FormData()
          form.append('banner', blob)
          let data = await this.$store.dispatch('media/uploadFile', form)
          if (data.length > 0) {
            this.url = data[0].url
            this.toggleModalUploader()
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
      modalUploader: false,
      modalMedia: false,
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

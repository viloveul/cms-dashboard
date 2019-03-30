<template>
  <div class="user-container">
    <div class="media">
      <div class="media-left hidden-xs">
        <img
          style="max-height: 120px;"
          :src="me.picture"
          :class="'media-object thumbnail'"
          :alt="me.username"
        >
      </div>
      <div class="media-body">
        <h2 class="media-heading">{{ me.name }}</h2>
        <table class="table table-condensed profile">
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
          <tfoot>
            <tr>
              <td colspan="3">
                <small><a href="#" v-on:click.prevent="toggleEditAccount">Edit Account</a></small>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <form class="form-horizontal form-edit-profile" v-on:submit.prevent="handleSaveProfile">
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Phone</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="profile.phone" v-if="editProfile === true">
          <p v-else class="form-control-static">{{ profile.phone ? profile.phone : '-' }}</p>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">website/blog</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="profile.website" v-if="editProfile === true">
          <p v-else class="form-control-static">{{ profile.website ? profile.website : '-' }}</p>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Birthday</label>
        <div class="col-md-6">
          <input type="text" class="form-control" v-model="profile.birthday" v-if="editProfile === true">
          <p v-else class="form-control-static">{{ profile.birthday ? profile.birthday : '-' }}</p>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label control-label-normal col-md-2">Quote</label>
        <div class="col-md-8">
          <textarea class="form-control" v-model="profile.quote" v-if="editProfile === true"></textarea>
          <p v-else class="form-control-static">{{ profile.quote ? profile.quote : '-' }}</p>
        </div>
      </div>
      <span class="edit-handler" v-if="editProfile === false" v-on:click="toggleEditProfile">
        <i class="glyphicon glyphicon-pencil"></i>
      </span>
      <button type="submit" class="btn btn-primary" v-if="editProfile === true">Save</button>
      <span class="btn btn-warning" v-if="editProfile === true" v-on:click="toggleEditProfile">Cancel</span>
    </form>

    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modalAccount === true" style="display: block;">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click.prevent="toggleEditAccount" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              Edit Account
            </h4>
          </div>
          <div class="modal-body">
            <div class="thumbnail" style="max-width: 310px; margin: 0px auto 30px; text-align: center; display: block">
              <croppa
                v-if="pictureUpload === true"
                v-model="picture"
                :width="300"
                :height="300"
                :disable-scroll-to-zoom="false"
                :disable-drag-to-move="false"
                :prevent-white-space="true"
                :disable-rotation="true"
                :show-remove-button="false"
              >
              </croppa>
              <img v-else :src="me.picture" style="width: 300px; height: 300px;">
              <div class="caption">
                <span v-if="pictureUpload === true" v-on:click="handleSavePicture" class="btn btn-info btn-sm">
                  <i class="glyphicon glyphicon-upload"></i> Upload
                </span>
                <span v-if="pictureUpload === true" v-on:click="pictureUpload = false" class="btn btn-warning btn-sm">
                  <i class="glyphicon glyphicon-remove-circle"></i> Cancel
                </span>
                <span v-else class="btn btn-warning btn-sm" v-on:click="pictureUpload = true">
                  <i class="glyphicon glyphicon-pencil"></i> Change
                </span>
              </div>
            </div>
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-md-2">Name</label>
                <div class="col-md-8">
                  <input type="text" v-model="me.name" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-2">Username</label>
                <div class="col-md-8">
                  <input type="text" v-model="me.username" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-2">Email</label>
                <div class="col-md-8">
                  <input type="text" v-model="me.email" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-2">Picture</label>
                <div class="col-md-8">
                  <input type="text" v-model="me.picture" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-2">Password</label>
                <div class="col-md-8">
                  <input type="password" v-model="me.password" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-2">Confirmation</label>
                <div class="col-md-8">
                  <input type="password" v-model="me.passconf" class="form-control">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-warning" v-on:click.prevent="toggleEditAccount">Cancel</button>
            <button type="button" class="btn btn-primary" v-on:click.prevent="handleSaveAccount">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  computed: {
    me () {
      return this.$store.getters['user/getMe']()
    },
    profile () {
      return this.$store.getters['user/getProfile']()
    }
  },
  async mounted () {
    await this.$store.dispatch('user/fetchMe')
    await this.$store.dispatch('user/fetchProfile', this.me.id)
  },
  methods: {
    async handleSaveAccount () {
      await this.$store.dispatch('user/updateUser', this.me)
      this.toggleEditAccount()
    },
    async handleSaveProfile () {
      await this.$store.dispatch('user/updateProfile', {
        id: this.me.id,
        params: {...this.profile}
      })
      this.toggleEditProfile()
    },
    async handleSavePicture () {
      if (this.pictureUpload === true) {
        await this.picture.generateBlob(
          async blob => {
            let form = new FormData()
            form.append('profile', blob)
            let data = await this.$store.dispatch('media/uploadFile', form)
            if (data.length > 0) {
              this.me.picture = data[0].url
              this.pictureUpload = false
            }
          },
          'image/png',
          0
        )
      }
    },
    async handleFileChoose (file) {
      this.pictureUpload = true
      this.picture.refresh()
    },
    async toggleEditAccount () {
      this.modalAccount = !this.modalAccount
      if (this.modalAccount === false) {
        await this.$store.dispatch('user/fetchMe')
      }
    },
    toggleEditProfile () {
      this.editProfile = !this.editProfile
    }
  },
  data () {
    return {
      picture: null,
      pictureUpload: false,
      modalAccount: false,
      editProfile: false
    }
  }
}
</script>

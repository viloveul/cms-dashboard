<template>
  <div class="setting-container">
    <h2>Moderator Settings</h2>
    <form method="post" v-on:submit.prevent="handleSave">
      <div class="form-group">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="options.user"> User must be accepted when registering
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="options.post"> Posts must be checked before publication
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="checkbox">
          <label>
            <input type="checkbox" v-model="options.comment"> Comments must be checked before they are displayed
          </label>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </div>
</template>

<script type="text/javascript">

export default {
  async mounted () {
    await this.$store.dispatch('setting/fetchOption', 'moderations')
    await this.$store.dispatch('updateTitle', 'Settings')
    await this.$store.commit('setBreadcrumbs', [
      {
        label: 'Board',
        link: '/'
      },
      {
        label: 'Settings'
      }
    ])
  },
  methods: {
    async handleSave () {
      await this.$store.dispatch('setting/updateOption', {
        moderations: this.options
      })
    }
  },
  computed: {
    options () {
      return this.$store.getters['setting/getOption']('moderations')
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style type="text/css">
@import './../assets/style.css'
</style>

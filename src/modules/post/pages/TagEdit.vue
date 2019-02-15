<template>
  <div class="post-container">
    <h2>Tags</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control input-sm" v-model="tag.attributes.title" v-on:change="handleChangeTitle">
          </div>
          <div class="form-group">
            <label>Slug</label>
            <input type="text" class="form-control input-sm" v-model="tag.attributes.slug">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="tag.attributes.type" v-on:change="handleChangeType">
              <option v-for="type in types" :key="type.name" :value="type.name">{{ type.label }}</option>
            </select>
          </div>
          <div class="form-group" v-if="isFormatCategory() === true">
            <label>Parent</label>
            <select class="form-control input-sm" v-model="tag.attributes.parent_id">
              <option value="0">Select parent</option>
              <option v-for="(parentTag, parentIndex) in tags" :key="'parent-' + parentIndex" :value="parentTag.id">
                {{ parentTag.attributes.display }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-sm btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import endpoints from '@/common/endpoints'

export default {
  async beforeRouteLeave (to, from, next) {
    await this.$store.dispatch('post/resetTag')
    next()
  },
  async mounted () {
    await this.$store.dispatch('post/fetchTag', this.$route.params.id)
    await this.$store.dispatch('updateTitle', 'Tags')
    await this.$store.commit('setBreadcrumbs', [
      {
        label: 'Board',
        link: '/'
      },
      {
        label: 'Tags'
      }
    ])
    endpoints.getOption('tags').then(res => {
      this.types = res.data.data.option
    })
  },
  methods: {
    isFormatCategory () {
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].name === this.tag.attributes.type && this.types[i].format === 'category') {
          return true
        }
      }
      return false
    },
    async handleSave () {
      await this.$store.dispatch('post/updateTag', {...this.tag.attributes})
      await this.$store.dispatch('post/resetTag')
      await this.$router.push('/tag')
    },
    async handleChangeType () {
      await this.$store.dispatch('post/fetchTags', {type: this.tag.attributes.type})
    },
    async handleChangeTitle () {
      if (this.tag.attributes.slug.length === 0) {
        this.tag.attributes.slug = this.tag.attributes.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    }
  },
  computed: {
    tags () {
      return this.$store.getters['post/getTags']()
    },
    tag () {
      return this.$store.getters['post/getTag']()
    }
  },
  data: () => {
    return {
      types: []
    }
  }
}
</script>

<style type="text/css">
@import './../assets/style.css'
</style>

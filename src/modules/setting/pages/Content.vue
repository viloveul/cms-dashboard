<template>
  <div class="setting-container">
    <h2>Content Settings</h2>
    <form method="post" v-on:submit.prevent="handleSave">
      <fieldset>
        <legend>Posts</legend>
        <table class="table table-condensed">
          <thead>
            <tr>
              <td>Label</td>
              <td>Name</td>
              <td>Format</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(post, index) in options.posts" :key="'post-' + index">
              <td>
                <input type="text" readonly="readonly" v-model="options.posts[index].label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.posts[index].name" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.posts[index].format" class="form-control input-sm">
              </td>
              <td><span class="btn btn-danger btn-sm" v-on:click="handleDeletePost(index)">x</span></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <input type="text" v-model="post.label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" v-model="post.name" class="form-control input-sm">
              </td>
              <td>
                <select v-model="post.format" class="form-control input-sm">
                  <option value="post">post</option>
                  <option value="page">page</option>
                </select>
              </td>
              <td><span class="btn btn-info btn-sm" v-on:click="handleAddPost()">+</span></td>
            </tr>
          </tfoot>
        </table>
      </fieldset>
      <fieldset>
        <legend>Tags</legend>
        <table class="table table-condensed">
          <thead>
            <tr>
              <td>Label</td>
              <td>Name</td>
              <td>Format</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tag, index) in options.tags" :key="'tag-' + index">
              <td>
                <input type="text" readonly="readonly" v-model="options.tags[index].label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.tags[index].name" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.tags[index].format" class="form-control input-sm">
              </td>
              <td><span class="btn btn-danger btn-sm" v-on:click="handleDeleteTag(index)">x</span></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <input type="text" v-model="tag.label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" v-model="tag.name" class="form-control input-sm">
              </td>
              <td>
                <select v-model="tag.format" class="form-control input-sm">
                  <option value="tag">tag</option>
                  <option value="category">category</option>
                </select>
              </td>
              <td><span class="btn btn-info btn-sm" v-on:click="handleAddTag()">+</span></td>
            </tr>
          </tfoot>
        </table>
      </fieldset>
      <fieldset>
        <legend>Menus</legend>
        <table class="table table-condensed">
          <thead>
            <tr>
              <td>Label</td>
              <td>Name</td>
              <td>Format</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(menu, index) in options.menus" :key="'menu-' + index">
              <td>
                <input type="text" readonly="readonly" v-model="options.menus[index].label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.menus[index].name" class="form-control input-sm">
              </td>
              <td>
                <input type="text" readonly="readonly" v-model="options.menus[index].format" class="form-control input-sm">
              </td>
              <td><span class="btn btn-danger btn-sm" v-on:click="handleDeleteTag(index)">x</span></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <input type="text" v-model="menu.label" class="form-control input-sm">
              </td>
              <td>
                <input type="text" v-model="menu.name" class="form-control input-sm">
              </td>
              <td>
                <input type="text" v-model="menu.format" class="form-control input-sm" readonly="readonly">
              </td>
              <td><span class="btn btn-info btn-sm" v-on:click="handleAddTag()">+</span></td>
            </tr>
          </tfoot>
        </table>
      </fieldset>
      <button type="submit" class="btn btn-primary">Save</button>
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
    await this.$store.dispatch('setting/fetchOption', 'contents')
    this.options = this.$store.getters['setting/getOption']('contents', [])
  },
  methods: {
    async handleSave () {
      await this.$store.dispatch('setting/updateOption', {
        contents: this.options
      })
    },
    async handleAddTag () {
      this.options.tags.push(this.tag)
      this.tag = {
        label: '',
        name: '',
        format: 'tag'
      }
    },
    async handleDeleteTag (index) {
      this.options.tags.splice(index, 1)
    },
    async handleAddMenu () {
      this.options.menus.push(this.menu)
      this.menu = {
        label: '',
        name: '',
        format: 'standar'
      }
    },
    async handleDeleteMenu (index) {
      this.options.menus.splice(index, 1)
    },
    async handleAddPost () {
      this.options.posts.push(this.post)
      this.post = {
        label: '',
        name: '',
        format: 'post'
      }
    },
    async handleDeletePost (index) {
      this.options.posts.splice(index, 1)
    }
  },
  data () {
    return {
      tag: {
        label: '',
        name: '',
        format: 'tag'
      },
      post: {
        label: '',
        name: '',
        format: 'post'
      },
      menu: {
        label: '',
        name: '',
        format: 'standar'
      },
      options: {
        posts: [],
        menus: [],
        tags: []
      }
    }
  }
}
</script>

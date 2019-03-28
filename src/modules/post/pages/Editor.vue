<template>
  <div class="post-container">
    <h2>Post Editor</h2>
    <form method="post" v-on:submit.prevent="handleSave" class="row">
      <div class="col-md-9">
        <div class="form-group">
          <input type="text" class="form-control input-lg" v-model="post.title" placeholder="Post Title Here..." v-on:change="handleChangeTitle">
        </div>
        <div class="form-group">
          <input type="text" class="form-control input-sm" v-model="post.slug" placeholder="Slug or URL Title.." title="Slug or URL Title..">
        </div>
        <div class="form-group">
          <span class="btn btn-default btn-sm" v-on:click="fileman = true">
            <i class="glyphicon glyphicon-picture"></i> Gallery
          </span>
        </div>
        <div class="form-group">
          <ckeditor ref="editor" :config="ckeconfig" :editor="ckeclassic" v-model="post.content"></ckeditor>
        </div>
        <div class="row" v-if="isFormatPost() === true">
          <div class="col-md-6">
            <TagPanel
              v-for="(tag, i) in leftTags"
              :key="'left' + i"
              :name="tag.name"
              :type="tag.format"
              :items="tagByKey(tag.name)"
              v-model="relations"
            >
            </TagPanel>
          </div>
          <div class="col-md-6">
            <TagPanel
              v-for="(tag, i) in rightTags"
              :key="'right' + i"
              :name="tag.name"
              :type="tag.format"
              :items="tagByKey(tag.name)"
              v-model="relations"
            >
            </TagPanel>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel panel-default">
          <div class="panel-heading">Meta</div>
          <div class="panel-body">
            <div class="form-group">
              <div class="thumbnail" v-if="post.cover !== null && post.cover.length > 0">
                <img :src="post.cover" class="cover" style="max-width: 100%">
                <div class="caption">
                  <span class="btn btn-danger btn-xs btn-block" v-on:click="post.cover = ''">
                    Delete Cover
                  </span>
                </div>
              </div>
              <span v-if="post.cover === null || post.cover.length === 0" class="btn btn-info btn-xs btn-block" v-on:click="cover = true">
                Add Cover Image
              </span>
            </div>
            <div class="form-group">
              <label>Date</label>
              <input v-model="post.created_at" type="text" class="form-control input-sm" readonly="readonly">
            </div>
            <div class="form-group">
              <label>Type</label>
              <select class="form-control input-sm" v-model="post.type">
                <option disabled="disabled">Select Type</option>
                <option v-for="type in postTypes" :key="type.name" :value="type.name">{{ type.label }}</option>
              </select>
            </div>
            <div class="form-group" v-if="isFormatPost() === true">
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="post.comment_enabled"> Enable Comment
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select class="form-control input-sm" v-model="post.status">
                <option disabled="disabled">Select Status</option>
                <option value="0">Draft</option>
                <option value="1">Published</option>
                <option value="2">On Moderate</option>
                <option value="3">Deleted</option>
              </select>
            </div>
          </div>
        </div>
        <span class="btn btn-warning btn-block" v-on:click="handleReset">Reset</span>
        <button type="submit" class="btn btn-primary btn-block">Save</button>
      </div>
    </form>
    <Fileman v-if="fileman" v-on:close-fileman="fileman = false" v-on:selected-fileman="handleSelectedMedia"/>
    <Fileman v-if="cover" v-on:close-fileman="cover = false" v-on:selected-fileman="handleSelectedCover"/>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import TagPanel from '@/modules/post/components/TagPanel'
import Fileman from '@/modules/media/components/Fileman'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  components: {
    Fileman,
    TagPanel
  },
  async mounted () {
    await this.$store.dispatch('post/resetPost')
    await this.$store.dispatch('post/fetchTags')
    await this.$store.dispatch('setting/fetchOption', 'contents')
    await this.$store.commit('setTitle', 'Post Editor')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Posts', link: '/post'},
      {label: 'Editor'}
    ])
    if (this.$route.params.id !== undefined) {
      await this.$store.dispatch('post/fetchPost', this.$route.params.id)
      this.relations = this.post.tags.map(tag => {
        return tag.id
      })
    }
    let contents = this.$store.getters['setting/getOption']('contents', [])
    this.postTypes = contents.posts
    this.tagTypes = contents.tags
  },
  methods: {
    isFormatPost () {
      for (let i = 0; i < this.postTypes.length; i++) {
        if (this.postTypes[i].name === this.post.type && this.postTypes[i].format === 'post') {
          return true
        }
      }
      return false
    },
    handleChangeTitle () {
      if (this.post.slug.length === 0) {
        this.post.slug = this.post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    },
    handleSelectedMedia (x) {
      let el
      let model = this.$refs.editor.instance.model
      this.fileman = false
      model.change(writer => {
        if (x.type.indexOf('image') !== -1) {
          el = writer.createElement('image', {src: x.url})
        } else {
          el = writer.createText(x.name, {linkHref: x.url})
        }
        model.insertContent(el, model.document.selection)
      })
    },
    handleSelectedCover (x) {
      this.cover = false
      if (x.type.indexOf('image') !== -1) {
        this.post.cover = x.url
      }
    },
    async handleSave () {
      let action = this.post.id !== 0 ? 'post/updatePost' : 'post/createPost'
      if (this.isFormatPost() === false) {
        this.post.comment_enabled = 0
        this.relations = []
      }
      await this.$store.dispatch(action, {
        ...this.post,
        relations: this.relations
      })
      await this.$store.dispatch('post/resetPost')
      await this.$router.push('/post')
    },
    async handleReset () {
      await this.$store.dispatch('post/resetPost')
      if (this.$route.params.id !== undefined) {
        await this.$store.dispatch('post/fetchPost', this.$route.params.id)
        this.relations = this.post.tags.map(tag => {
          return tag.id
        })
      }
    },
    tagByKey ($key) {
      return this.tags.filter(tag => {
        return tag.type === $key
      })
    }
  },
  computed: {
    post () {
      return this.$store.getters['post/getPost']()
    },
    tags () {
      return this.$store.getters['post/getTags']()
    },
    sepTagType () {
      return Math.ceil(this.tagTypes.length / 2)
    },
    leftTags () {
      return this.tagTypes.slice(0, this.sepTagType)
    },
    rightTags () {
      return this.tagTypes.slice(this.sepTagType)
    }
  },
  data: () => {
    return {
      relations: [],
      ckeclassic: ClassicEditor,
      ckeconfig: {
        toolbar: {
          items: [
            'heading',
            '|',
            'insertTable',
            'link',
            '|',
            'bold',
            'italic',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'undo',
            'redo'
          ]
        },
        image: {
          toolbar: [
            'imageStyle:full',
            'imageStyle:alignLeft',
            'imageStyle:alignRight',
            '|',
            'imageTextAlternative'
          ],
          styles: [
            'full',
            'alignLeft',
            'alignRight'
          ]
        },
        alignment: {
          options: ['left', 'right']
        },
        fontFamily: {
          options: ['arial']
        }
      },
      postTypes: [],
      tagTypes: [],
      fileman: false,
      cover: false
    }
  }
}

</script>

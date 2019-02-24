<template>
  <div class="widget-container">
    <h2>Widgets</h2>
    <div class="row" v-if="widgets.length > 0">
      <div class="col-md-4">
        <ul class="nav nav-pills nav-stacked">
          <li v-for="(type, index) in widgets" :key="'type' + index" :class="(actived === type ? 'active' : '')">
            <a href="#" v-on:click.prevent="handleChange(type)">{{ type }}</a>
          </li>
        </ul>
      </div>
      <div class="col-md-8">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">{{ actived }}</h4>
          </div>
          <div class="panel-body">
            <Draggable
              v-model="items"
              class="draggable-wrap-area area-field"
              :options="{group:{ name:'field', pull: false }, handle: '.handler'}"
            >
              <component
                v-for="(useItem, useIndex) in items"
                v-if="getComponent(useItem) !== false"
                v-on:delete-item="handleDeleteItem(useIndex)"
                :key="'item-used-' + useIndex + Math.random()"
                :is="getComponent(useItem)"
                :name="useItem.name"
                :options="useItem.options || {}"
              />
            </Draggable>
          </div>
          <div class="panel-footer">
            <button type="button" class="btn btn-sm btn-info" v-on:click="handleAddItem">Add Item</button>
            <button type="button" class="btn btn-sm btn-primary" v-on:click="handleSave">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      Not Support
    </div>
    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modal === true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click="modal = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              Available Widgets
            </h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-pills nav-stacked">
              <li v-for="(itemAvailable, indexAvailable) in availables" :key="'item-available-' + indexAvailable">
                <a href="#" v-on:click.prevent="handleSelectedItem(itemAvailable)">{{ itemAvailable.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import '@/modules/widget/assets/style.css'

import Draggable from 'vuedraggable'
import Menu from '@/modules/widget/components/Menu'
import RecentPost from '@/modules/widget/components/RecentPost'
import RecentComment from '@/modules/widget/components/RecentComment'
import Archive from '@/modules/widget/components/Archive'

export default {
  components: {
    Draggable,
    MenuWidget: Menu,
    RecentPostWidget: RecentPost,
    RecentCommentWidget: RecentComment,
    ArchiveWidget: Archive
  },
  async mounted () {
    await this.$store.dispatch('widget/fetchAvailables')
    await this.$store.dispatch('setting/fetchOption', 'contents')
    let widgets = window.localStorage.getItem('features:widget:types')
    try {
      this.widgets = JSON.parse(widgets) || []
      if (this.widgets.length > 0) {
        await this.handleChange(this.widgets[0])
      }
    } catch (e) {
      // do nothing
    }
  },
  methods: {
    getComponent (item) {
      let name = item.name + 'Widget'
      if (name in this.$options.components) {
        return name
      } else {
        return false
      }
    },
    handleDeleteItem (index) {
      this.items.splice(index, 1)
    },
    async handleChange (type) {
      this.actived = type
      await this.$store.dispatch('widget/resetDetail')
      await this.$store.dispatch('widget/resetItems')
      this.items = await this.$store.dispatch('setting/fetchOption', 'widget-' + type) || []
    },
    async handleAddItem () {
      this.modal = true
    },
    async handleSave () {
      await this.$store.dispatch('setting/updateOption', {
        ['widget-' + this.actived]: this.items
      })
      await this.handleChange(this.actived)
    },
    handleSelectedItem (item) {
      this.items.push({...JSON.parse(JSON.stringify(item))})
      this.modal = false
    }
  },
  computed: {
    availables () {
      return this.$store.getters['widget/getAvailables']()
    }
  },
  data () {
    return {
      items: [],
      widgets: [],
      modal: false,
      actived: null
    }
  }
}

</script>

<style type="text/css" scoped="true">
.modal {
  display: block;
}
.modal-body .content {
  height: 50vh;
  padding: 20px;
  margin: 15px auto;
  border: 1px solid #CCC;
  overflow-x: auto;
}
</style>

<template>
  <div class="menu-container">
    <h2>Menus</h2>
    <div class="row">
      <div class="col-md-3">
        <div class="form-group">
          <ul class="nav nav-pills nav-stacked" style="margin-bottom: 15px;">
            <li class="" v-for="(type, index) in types" :key="'type-' + index" :class="activedIndex === index ? 'active' : ''">
              <a href="#" v-on:click.prevent="handleChange(index)">
                {{ type.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-9">
        <div class="item-manager" v-if="types[activedIndex] !== undefined">
          <div class="panel panel-default panel-editor">
            <div class="panel-heading">Menu Items</div>
            <div class="panel-body">
              <div class="item-manager-box">
                <DraggableTree :data="menus" draggable="draggable" cross-tree="cross-tree" :get-trigger-el="treeHandler">
                  <div slot-scope="{data, store}">
                    <template v-if="!data.isDragPlaceHolder">
                      <div class="item">
                        <span class="handler">##</span>
                        <span class="text">{{ data.label }}</span>
                      </div>
                    </template>
                  </div>
                </DraggableTree>
              </div>
            </div>
            <div class="panel-footer">
              <div class="item-manager-action">
                <button type="button" class="btn btn-xs btn-warning" v-on:click="handleReset">Reset</button>
                <button type="button" class="btn btn-xs btn-primary" v-on:click="handleSave">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import { DraggableTree } from 'vue-draggable-nested-tree'

export default {
  components: {
    DraggableTree
  },
  async mounted () {
    await this.$store.commit('setTitle', 'Menus')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Menus'}
    ])
    await this.loadData()
  },
  computed: {
    menus () {
      return this.$store.getters['menu/getMenus']()
    },
    types () {
      let contents = this.$store.getters['setting/getOption']('contents')
      return contents.menus
    }
  },
  methods: {
    async loadData () {
      await this.$store.dispatch('setting/fetchOption', 'contents')
      await this.handleChange(0)
    },
    async handleChange (index) {
      this.activedIndex = index
      if (this.types[this.activedIndex] !== undefined) {
        await this.handleReset()
      }
    },
    async handleSave () {
      let menus = Object.assign({}, this.menus)
      let items = this.parseRecursive(menus) || []
      await this.$store.dispatch('setting/updateOption', {
        ['menu-' + this.types[this.activedIndex].name]: items
      })
      await this.handleReset()
    },
    async handleReset () {
      await this.$store.dispatch('menu/loadMenus', this.types[this.activedIndex].name)
    },
    treeHandler (node) {
      return node.$el.querySelector('span.handler')
    },
    parseRecursive (menus) {
      let items = []
      for (let menuIndex in menus) {
        items.push({
          label: menus[menuIndex].label,
          url: menus[menuIndex].url,
          icon: menus[menuIndex].icon,
          id: menus[menuIndex].id,
          children: this.parseRecursive(menus[menuIndex].children)
        })
      }
      return items
    }
  },
  data () {
    return {
      activedIndex: 0
    }
  }
}
</script>

<template>
  <div class="menu-container">
    <h2>Menus</h2>
    <div class="row">
      <div class="col-md-9">
        <div class="item-manager">
          <div class="panel panel-default panel-editor">
            <div class="panel-heading">Menu Items</div>
            <div class="panel-body" style="min-height: 100px;">
              <div class="item-manager-box">
                <DraggableTree :data="menu.items" draggable="draggable" cross-tree="cross-tree" :get-trigger-el="treeHandler">
                  <div slot-scope="{data, store}">
                    <template v-if="!data.isDragPlaceHolder">
                      <div class="item">
                        <span class="handler">##</span>
                        <span class="text">{{ data.label }}</span>
                        <span class="delete" v-on:click.prevent="handleDeleteItem(data)">X</span>
                      </div>
                    </template>
                  </div>
                </DraggableTree>
              </div>
            </div>
            <div class="panel-footer">
              <button type="button" class="btn btn-xs btn-info" v-on:click="toggleModal">Add Item</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="panel panel-default panel-editor">
          <div class="panel-body">
            <div class="form-group">
              <label>Label</label>
              <input type="text" class="form-control input-sm" v-model="menu.label">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control input-sm" v-model="menu.description"></textarea>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-block" v-on:click.prevent="handleSave">Save</button>
      </div>
    </div>
    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modal === true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click.prevent="toggleModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">Links</h4>
          </div>
          <div class="modal-body">
            <ul class="nav nav-pills nav-stacked">
              <li v-for="(itemAvailable, indexAvailable) in links" :key="'item-available-' + indexAvailable">
                <a href="#" v-on:click.prevent="handleSelectedItem(itemAvailable)">
                  {{ itemAvailable.label }}
                </a>
              </li>
            </ul>
            <Paginate
              :page-count="total"
              :container-class="'pagination'"
              :click-handler="handlePageChanged"
            >
            </Paginate>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import Paginate from 'vuejs-paginate'
import endpoints from '@/common/endpoints'
import { DraggableTree } from 'vue-draggable-nested-tree'

export default {
  components: {
    DraggableTree,
    Paginate
  },
  async mounted () {
    await this.$store.dispatch('menu/resetMenu')
    if (this.$route.params.id !== undefined) {
      await this.$store.dispatch('menu/fetchMenu', this.$route.params.id)
    }
    await this.$store.commit('setTitle', 'Menu Editor')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Menu Editor'}
    ])
  },
  computed: {
    menu () {
      return this.$store.getters['menu/getMenu']()
    }
  },
  methods: {
    async loadLinks () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        let { data } = await endpoints.getLinks({
          order: 'label',
          sort: 'asc',
          size: 20,
          page: parseInt(this.page),
          search_status: 1
        })
        this.links = data.data
        this.total = Math.ceil(data.meta.total / 20)
      }, 500)
    },
    async handleDeleteItem (item) {
      for (let a = 0; a < item.parent.children.length; a++) {
        if (item.parent.children[a]._id === item._id) {
          item.parent.children.splice(a, 1)
        }
      }
    },
    async handleSelectedItem (item) {
      this.menu.items.push(item)
      this.toggleModal()
    },
    async handlePageChanged (n) {
      this.page = n
      await this.loadLinks()
    },
    async handleReset () {
      //
    },
    async toggleModal () {
      this.modal = !this.modal
      if (this.modal === true) {
        await this.loadLinks()
      }
    },
    async handleSave () {
      this.menu.content = this.parseRecursive(this.menu.items)
      if (this.menu.id === 0) {
        await this.$store.dispatch('menu/createMenu', {
          label: this.menu.label,
          description: this.menu.description,
          content: this.menu.content
        })
      } else {
        await this.$store.dispatch('menu/updateMenu', {
          id: this.menu.id,
          label: this.menu.label,
          description: this.menu.description,
          content: this.menu.content
        })
      }
      await this.$router.push('/menu')
    },
    treeHandler (node) {
      return node.$el.querySelector('span.handler')
    },
    parseRecursive (items) {
      let newItems = []
      for (let itemIndex in items) {
        newItems.push({
          id: items[itemIndex].id,
          children: this.parseRecursive(items[itemIndex].children)
        })
      }
      return newItems
    }
  },
  data () {
    return {
      links: [],
      timeout: null,
      page: 1,
      total: 0,
      modal: 0
    }
  }
}
</script>

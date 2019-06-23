<template>
  <div class="menu-container">
    <h2>Menus</h2>
    <div class="row">
      <div class="col-md-9">
        <div class="item-manager">
          <div class="panel panel-default panel-editor">
            <div class="panel-heading">Menu Items</div>
            <div class="panel-body" style="min-height: 200px;">
              <div class="item-manager-box">
                <DraggableTree :data="menu.items" draggable="draggable" cross-tree="cross-tree" :get-trigger-el="treeHandler">
                  <div slot-scope="{data}">
                    <template v-if="!data.isDragPlaceHolder">
                      <div class="item">
                        <span class="drag-handler">##</span>
                        <span class="text">{{ data.label }}</span>
                        <div class="item-action">
                          <span class="update" title="Edit Item" v-on:click.prevent="handleDetailItem(data)">
                            &raquo;
                          </span>
                          <span class="delete" title="Delete Item" v-on:click.prevent="handleDeleteItem(data)">
                            &times;
                          </span>
                        </div>
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
          <div class="panel-heading">
            Meta
          </div>
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
            <h4 class="modal-title">Add Item</h4>
          </div>
          <div class="modal-body">
            <div class="form-horizontal">
              <div class="form-group">
                <label class="control-label col-md-3">Label</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" v-model="item.label">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3">Link</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" v-model="item.url">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3">Icon Url</label>
                <div class="col-md-9">
                  <input type="text" class="form-control" v-model="item.icon">
                </div>
              </div>
              <div class="form-group">
                <label class="control-label col-md-3">Role User</label>
                <div class="col-md-9">
                  <select class="form-control" v-model="item.role_id">
                    <option :value="''">-</option>
                    <option v-for="(role, indexRole) in roles" :key="'role-' + indexRole" :value="role.id">
                      {{ role.name }}#{{ role.type }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click.prevent="handleAddItem" class="btn btn-primary">Save</button>
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
    await this.$store.commit('setTitle', 'Menu Editor')
    await this.loadData()
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Menu Editor'}
    ])
    this.item.menu_id = this.menu.id
    this.roles = await this.$store.dispatch('user/fetchRoles', {
      size: 1000,
      page: 1
    })
  },
  computed: {
    menu () {
      return this.$store.getters['menu/getMenu']()
    }
  },
  methods: {
    async loadData () {
      await this.$store.dispatch('menu/resetMenu')
      await this.$store.dispatch('menu/fetchMenu', this.$route.params.id)
    },
    async handleDetailItem (item) {
      await this.$router.push('/menu/item/' + item.id)
    },
    async handleDeleteItem (item) {
      if (window.confirm('Delete item ?')) {
        await this.$store.dispatch('menu/deleteMenuItem', item.id)
        await this.loadData()
      }
    },
    async handleAddItem () {
      await this.$store.dispatch('menu/createMenuItem', {...this.item})
      await this.loadData()
      this.toggleModal()
    },
    async toggleModal () {
      this.modal = !this.modal
      this.item.label = ''
      this.item.url = '#'
      this.item.icon = ''
      this.item.role_id = ''
      this.item.description = ''
    },
    async handleSave () {
      this.menu.items = this.parseRecursive(this.menu.items)
      await this.$store.dispatch('menu/updateMenu', {
        id: this.menu.id,
        label: this.menu.label,
        description: this.menu.description,
        items: this.menu.items
      })
      await this.$router.push('/menu')
    },
    treeHandler (node) {
      return node.$el.querySelector('span.drag-handler')
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
      roles: [],
      timeout: null,
      page: 1,
      total: 0,
      modal: 0,
      item: {
        label: '',
        url: '#',
        icon: '',
        role_id: '',
        menu_id: '',
        description: ''
      }
    }
  }
}
</script>

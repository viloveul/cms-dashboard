<template>
  <div class="menu-container">
    <h2>Menus</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Label</label>
            <input type="text" class="form-control input-sm" v-model="menu.label">
          </div>
          <div class="form-group">
            <label>Url</label>
            <input type="text" class="form-control input-sm" v-model="menu.url">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control input-sm" v-model="menu.description"></textarea>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="menu.type">
              <option v-for="type in types" :key="type.name" :value="type.name">{{ type.label }}</option>
            </select>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
      <div class="col-md-9">
        <vue-good-table
          @on-column-filter="onColumnFilter"
          @on-page-change="onPageChange"
          @on-per-page-change="onPerPageChange"
          @on-sort-change="onSortChange"
          :mode="'remote'"
          :columns="columns"
          :rows="rows"
          :totalRows="meta.total"
          :lineNumbers="true"
          :pagination-options="pagination"
          styleClass="vgt-table table-bordered table-striped">
          <template slot="table-row" slot-scope="props" v-if="props.column.field === 'label'">
            {{ props.formattedRow[props.column.field] }}
            <div class="action">
              <span class="text-warning" v-on:click="handleUpdate(props.row.id)">
                <i class="glyphicon glyphicon-pencil"></i> Update
              </span>
              <span class="text-danger" v-if="parseInt(props.row.status) !== 3" v-on:click="handleDelete(props.row.id)">
                <i class="glyphicon glyphicon-trash"></i> Delete
              </span>
            </div>
          </template>
        </vue-good-table>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import './../assets/style.css'
import endpoints from '@/common/endpoints'

export default {
  async created () {
    this.serverParams = {...this.$route.query}
    this.pagination.setCurrentPage = parseInt(this.serverParams.page || 1)
    this.pagination.perPage = parseInt(this.serverParams.size || 10)
    for (let i in this.columns) {
      if (typeof this.serverParams['search_' + this.columns[i].field] !== 'undefined') {
        this.columns[i].filterOptions.filterValue = this.serverParams['search_' + this.columns[i].field]
      }
    }
    await this.loadData()
  },
  async mounted () {
    await this.$store.dispatch('setting/fetchOption', 'contents')
    await this.$store.commit('setTitle', 'Menus')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Menus'}
    ])
    if (this.$route.query.id !== undefined) {
      await this.loadUpdate(this.$route.query.id)
    }
  },
  computed: {
    menu () {
      return this.$store.getters['menu/getMenu']()
    },
    types () {
      let contents = this.$store.getters['setting/getOption']('contents')
      return contents.menus
    }
  },
  methods: {
    async loadUpdate (id) {
      await this.$store.dispatch('menu/resetMenu')
      await this.$store.dispatch('menu/fetchMenu', id)
    },
    async handleUpdate (id) {
      await this.loadUpdate(id)
      await this.$router.push({
        path: '/menu',
        query: {id}
      })
    },
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getMenus(this.serverParams).then(res => {
          this.rows = res.data.data.map(menu => {
            return menu.attributes
          })
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    async handleSave () {
      let act = this.menu.id === 0 ? 'menu/createMenu' : 'menu/updateMenu'
      await this.$store.dispatch(act, this.menu)
      await this.$store.dispatch('menu/resetMenu')
      await this.$router.push('/menu')
      this.serverParams = {
        order: 'id',
        sort: 'desc',
        page: 1,
        size: 10
      }
      await this.loadData()
    },
    async handleDelete (id) {
      await this.$store.dispatch('menu/deleteMenu', id)
      await this.loadData()
    },
    onPerPageChange (params, x) {
      if (this.serverParams.size !== params.currentPerPage) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/menu',
          query: this.serverParams
        })
        this.loadData()
      }
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/menu',
          query: this.serverParams
        })
        this.loadData()
      }
    },
    onColumnFilter (filters) {
      for (let i in filters.columnFilters) {
        this.serverParams['search_' + i] = filters.columnFilters[i]
      }
      this.serverParams.page = 1
      this.$router.push({
        path: '/menu',
        query: this.serverParams
      })
      this.loadData()
    },
    onSortChange (params) {
      if (this.serverParams.order !== params[0].field) {
        this.serverParams.order = params[0].field
      }

      if (this.serverParams.sort !== params[0].type) {
        this.serverParams.sort = params[0].type
      }

      this.$router.push({
        path: '/menu',
        query: this.serverParams
      })
      this.loadData()
    }
  },
  data: () => {
    return {
      timeout: null,
      rows: [],
      links: {},
      meta: {
        total: 0
      },
      columns: [
        {
          label: 'Label',
          field: 'label',
          tdClass: 'cell-min-300',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Type',
          field: 'type',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Description',
          field: 'description',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Url',
          field: 'url',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Status',
          field: 'status',
          filterOptions: {
            enabled: true,
            filterDropdownItems: [
              {
                value: 0,
                text: 'Unpublish'
              },
              {
                value: 1,
                text: 'Published'
              },
              {
                value: 2,
                text: 'On Moderate'
              },
              {
                value: 3,
                text: 'Deleted'
              }
            ]
          },
          formatFn: (value) => {
            let text
            switch (parseInt(value)) {
              case 3:
                text = 'Deleted'
                break
              case 2:
                text = 'On Moderate'
                break
              case 1:
                text = 'Published'
                break
              default:
                text = 'Unpublish'
                break
            }
            return text
          }
        }
      ],
      serverParams: {
        order: 'id',
        sort: 'desc',
        page: 1,
        size: 10
      },
      pagination: {
        enabled: true,
        perPage: 10,
        setCurrentPage: 1,
        position: 'bottom'
      }
    }
  }
}
</script>

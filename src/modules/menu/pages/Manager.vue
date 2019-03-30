<template>
  <div class="menu-container">
    <h2>Menus</h2>
    <div class="row">
      <div class="col-md-3" v-if="types">
        <div class="form-group" v-for="(type, index) in types" :key="'type-' + index">
          <label>{{ type.label }}</label>
          <select class="form-control" v-model="menuset[type.name]">
            <option disabled="disabled">Select Menu</option>
            <option v-for="(mymenu, indexMine) in menus" :key="indexMine" :value="mymenu.id">
              {{ mymenu.label }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary" v-on:click.prevent="handleSave">Save</button>
        </div>
      </div>
      <div :class="(types) ? 'col-md-9' : 'col-md-12'">
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
    this.serverParams = Object.assign({}, this.def, {...this.$route.query})
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
    for (let z in this.types) {
      if (this.menuset[this.types[z].name] === undefined) {
        let opt = await this.$store.dispatch(
          'setting/fetchOption',
          'menu-' + this.types[z].name
        )
        if (opt !== null && opt.id !== undefined) {
          this.menuset[this.types[z].name] = opt.id
        }
      }
    }
  },
  computed: {
    types () {
      let contents = this.$store.getters['setting/getOption']('contents')
      return contents.menus
    }
  },
  methods: {
    async handleSave () {
      let options = {}
      for (let y in this.menuset) {
        let {data} = await endpoints.getMenu(this.menuset[y])
        options['menu-' + y] = {
          id: data.data.id,
          items: data.data.items
        }
      }
      await this.$store.dispatch('setting/updateOption', options)
    },
    async handleUpdate (id) {
      await this.$router.push('/menu/editor/' + id)
    },
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getMenus(this.serverParams).then(res => {
          this.rows = res.data.data
          this.links = res.data.links
          this.meta = res.data.meta
        })
        await endpoints.getMenus({order: 'label', sort: 'asc', size: 1000, search_status: 1}).then(res => {
          this.menus = res.data.data
        })
      }, 500)
    },
    async handleDelete (id) {
      await this.$store.dispatch('menu/deleteMenu', id)
      await this.loadData()
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/menu',
          query: this.serverParams
        })
      }
      this.loadData()
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/menu',
          query: this.serverParams
        })
      }
      this.loadData()
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
      menus: [],
      menuset: [],
      def: {
        order: 'created_at',
        sort: 'desc',
        page: 1,
        size: 10
      },
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
          label: 'Description',
          field: 'description',
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
      serverParams: {},
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

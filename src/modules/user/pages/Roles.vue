<template>
  <div class="user-container">
    <h2>Management Roles</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control input-sm" v-model="role.attributes.name">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control input-sm" v-model="role.attributes.description"></textarea>
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="role.attributes.type">
              <option :value="'group'">Role Group</option>
              <option :value="'access'">Role Access</option>
            </select>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-sm btn-primary">Save</button>
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
          styleClass="vgt-table table-condensed table-bordered table-striped">
          <template slot="table-row" slot-scope="props" v-if="props.column.field == 'name'">
            {{ props.formattedRow[props.column.field] }}
            <div class="action">
              <span class="text-warning" v-on:click="handleUpdate(props.row.id)">
                <i class="glyphicon glyphicon-pencil"></i> Update
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
    await this.$store.dispatch('user/resetRole')
    await this.$store.commit('setTitle', 'Roles')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Roles'}
    ])
    if (this.$route.params.id !== undefined) {
      await this.loadUpdate(this.$route.params.id)
    }
  },
  methods: {
    async loadUpdate (id) {
      await this.$store.dispatch('user/resetRole')
      await this.$store.dispatch('user/fetchRole', id)
    },
    async handleUpdate (id) {
      await this.loadUpdate(id)
      await this.$router.push('/role/update/' + id)
    },
    async handleSave () {
      let act = this.role.attributes.id === 0 ? 'user/createRole' : 'user/updateRole'
      await this.$store.dispatch(act, {...this.role.attributes})
      await this.$store.dispatch('user/resetRole')
      await this.$router.push('/role')
      this.serverParams = {...this.def}
      await this.loadData()
    },
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getRoles(this.serverParams).then(res => {
          this.rows = res.data.data.map(role => {
            return role.attributes
          })
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/role',
          query: this.serverParams
        })
      }
      this.loadData()
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/role',
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
        path: '/role',
        query: this.serverParams
      })
      this.loadData()
    },
    onSortChange (params, x) {
      if (this.serverParams.order !== params[0].field) {
        this.serverParams.order = params[0].field
      }

      if (this.serverParams.sort !== params[0].type) {
        this.serverParams.sort = params[0].type
      }

      this.$router.push({
        path: '/role',
        query: this.serverParams
      })
      this.loadData()
    }
  },
  computed: {
    role () {
      return this.$store.getters['user/getRole']()
    }
  },
  data: () => {
    return {
      def: {
        order: 'id',
        sort: 'desc',
        page: 1,
        size: 10
      },
      rows: [],
      links: {},
      types: [],
      meta: {
        total: 0
      },
      columns: [
        {
          label: 'Name',
          field: 'name',
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
          label: 'Type',
          field: 'type',
          filterOptions: {
            enabled: true
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

<template>
  <div class="menu-container">
    <h2>
      Links
      <small class="btn btn-primary btn-xs" style="font-size: 8pt;" v-on:click.prevent="handleCreate">Create</small>
    </h2>
    <div class="row">
      <div class="col-md-12">
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
    <div class="modal fade in" tabindex="-1" role="dialog" v-if="modal === true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click.prevent="toggleModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">Link Editor</h4>
          </div>
          <div class="modal-body">
            <dir class="form-horizontal">
              <div class="form-group">
                <label class="col-md-3 control-label control-label-normal">Label</label>
                <div class="col-md-9">
                  <input type="text" class="form-control input-sm" v-model="link.label">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label control-label-normal">Url</label>
                <div class="col-md-9">
                  <input type="text" class="form-control input-sm" v-model="link.url">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label control-label-normal">Icon Url</label>
                <div class="col-md-9">
                  <input type="text" class="form-control input-sm" v-model="link.icon">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label control-label-normal">Role User</label>
                <div class="col-md-9">
                  <select class="form-control input-sm" v-model="link.role_id">
                    <option :value="0">-</option>
                    <option v-for="(role, indexRole) in roles" :key="indexRole" :value="role.id">
                      {{ role.name }} # {{ role.type }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label control-label-normal">Description</label>
                <div class="col-md-9">
                  <textarea class="form-control input-sm" v-model="link.description"></textarea>
                </div>
              </div>
            </dir>
          </div>
          <div class="modal-footer">
            <button class="btn btn-warning" type="button" v-on:click.prevent="toggleModal">Cancel</button>
            <button class="btn btn-primary" type="button" v-on:click.prevent="handleSave">Save</button>
          </div>
        </div>
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
    await this.$store.dispatch('menu/resetLink')
    await this.$store.commit('setTitle', 'Links')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Links'}
    ])
    this.roles = await this.$store.dispatch('user/fetchRoles', {
      size: 1000,
      page: 1
    })
  },
  computed: {
    link () {
      return this.$store.getters['menu/getLink']()
    }
  },
  methods: {
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getLinks(this.serverParams).then(res => {
          this.rows = res.data.data
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    async handleCreate () {
      await this.$store.dispatch('menu/resetLink')
      await this.toggleModal()
    },
    async handleUpdate (id) {
      await this.toggleModal()
      await this.$store.dispatch('menu/fetchLink', id)
    },
    async handleSave () {
      let act = this.link.id !== 0 ? 'menu/updateLink' : 'menu/createLink'
      await this.$store.dispatch(act, this.link)
      await this.$store.dispatch('menu/resetLink')
      await this.$router.push('/link')
      this.serverParams = {...this.def}
      await this.toggleModal()
      await this.loadData()
    },
    async handleDelete (id) {
      await this.$store.dispatch('menu/deleteLink', id)
      await this.loadData()
    },
    async toggleModal () {
      this.modal = !this.modal
      if (this.modal === false) {
        await this.$store.dispatch('menu/resetLink')
      }
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/link',
          query: this.serverParams
        })
      }
      this.loadData()
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/link',
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
        path: '/link',
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
        path: '/link',
        query: this.serverParams
      })
      this.loadData()
    }
  },
  data: () => {
    return {
      roles: [],
      modal: false,
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
          label: 'Url',
          field: 'url',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Icon',
          field: 'icon',
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

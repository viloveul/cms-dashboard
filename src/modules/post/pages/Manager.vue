<template>
  <div class="post-container">
    <h2>Posts</h2>
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
      <template slot="table-row" slot-scope="props" v-if="props.column.field == 'title'">
        {{ props.formattedRow[props.column.field] }}
        <div class="action">
          <router-link :to="'/post/update/' + props.row.id" class="text-warning">
            <i class="glyphicon glyphicon-pencil"></i> Update
          </router-link>
          <span class="text-danger" v-if="parseInt(props.row.status) !== 3" v-on:click="handleDelete(props.row.id)">
            <i class="glyphicon glyphicon-trash"></i> Delete
          </span>
          <span class="text-success" v-if="parseInt(props.row.status) === 0" v-on:click="handleApprove(props.row.id)">
            <i class="glyphicon glyphicon-check"></i> Approve
          </span>
        </div>
      </template>
    </vue-good-table>
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
    await this.$store.commit('setTitle', 'Posts')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Posts'}
    ])
  },
  methods: {
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getPosts(this.serverParams).then(res => {
          this.rows = res.data.data
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    async handleDelete (id) {
      await this.$store.dispatch('post/deletePost', id)
      await this.loadData()
    },
    async handleApprove (id) {
      await endpoints.approvePost(id)
      await this.loadData()
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/post',
          query: this.serverParams
        })
      }
      this.loadData()
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/post',
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
        path: '/post',
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
        path: '/post',
        query: this.serverParams
      })
      this.loadData()
    }
  },
  data: () => {
    return {
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
          label: 'Title',
          field: 'title',
          tdClass: 'cell-min-300',
          filterOptions: {
            enabled: true
          }
        },
        {
          label: 'Slug',
          field: 'slug',
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

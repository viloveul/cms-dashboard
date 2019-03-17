<template>
  <div class="media-container">
    <h2>Gallery</h2>
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
      <template slot="table-row" slot-scope="props" v-if="props.column.field == 'name'">
        <div class="media">
          <a class="media-left" v-on:click.prevent="handlePreview(props.row.id)">
            <img :src="props.row.image_url" class="media-object" style="max-width: 75px;">
          </a>
          <div class="media-body">
            <div class="media-heading">{{ props.row.name }}</div>
            <div class="action">
              <a class="text-warning" v-on:click.prevent="handlePreview(props.row.id)">
                <i class="glyphicon glyphicon-pencil"></i> Preview
              </a>
            </div>
          </div>
        </div>
      </template>
    </vue-good-table>
    <div class="modal fade in" tabindex="-1" role="dialog" style="display: block;" v-if="preview === true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" v-on:click="preview = false" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              {{ uploadedFile.name }}
            </h4>
          </div>
          <div class="modal-body">
            <code>{{ uploadedFile.url }}</code>
            <img :src="uploadedFile.image_url" style="max-width: 100%;">
          </div>
          <div class="modal-footer">
            <span class="btn btn-danger" v-on:click="handleDelete(uploadedFile.id)">Delete</span>
            <span class="btn btn-info" v-on:click="preview = false">Close</span>
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
    this.serverParams.search_ref = 'gallery'
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
    await this.$store.commit('setTitle', 'Media')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Media'}
    ])
  },
  computed: {
    uploadedFile () {
      return this.$store.getters['media/getFile']()
    }
  },
  methods: {
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getUploadedFiles(this.serverParams).then(res => {
          this.rows = res.data.data.map(post => {
            return post.attributes
          })
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    async handlePreview (id) {
      this.preview = true
      await this.$store.dispatch('media/resetFile')
      await this.$store.dispatch('media/fetchFile', id)
    },
    async handleDelete (id) {
      this.preview = false
      await this.$store.dispatch('media/deleteFile', id)
      await this.loadData()
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/media',
          query: this.serverParams
        })
      }
      this.loadData()
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/media',
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
        path: '/media',
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
        path: '/media',
        query: this.serverParams
      })
      this.loadData()
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
      preview: false,
      timeout: null,
      rows: [],
      links: {},
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
          label: 'Size',
          field: 'size',
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

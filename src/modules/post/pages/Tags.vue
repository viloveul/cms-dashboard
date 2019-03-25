<template>
  <div class="post-container">
    <h2>Tags</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control input-sm" v-model="tag.title" v-on:change="handleChangeTitle">
          </div>
          <div class="form-group">
            <label>Slug</label>
            <input type="text" class="form-control input-sm" v-model="tag.slug">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="tag.type" v-on:change="handleChangeType">
              <option v-for="type in types" :key="type.name" :value="type.name">{{ type.label }}</option>
            </select>
          </div>
          <div class="form-group" v-if="isFormatCategory() === true">
            <label>Parent</label>
            <select class="form-control input-sm" v-model="tag.parent_id">
              <option value="0">Select parent</option>
              <option v-for="(parentTag, parentIndex) in tags" :key="'parent-' + parentIndex" :value="parentTag.id">
                {{ parentTag.display }}
              </option>
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
          styleClass="vgt-table table-bordered table-striped">
          <template slot="table-row" slot-scope="props" v-if="props.column.field == 'title'">
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
    await this.$store.dispatch('post/resetTag')
    await this.$store.commit('setTitle', 'Tags')
    await this.$store.commit('setBreadcrumbs', [
      {label: 'Board', link: '/'},
      {label: 'Tags'}
    ])
    await endpoints.getOption('contents').then(res => {
      this.types = res.data.data.option.tags
    })
    if (this.$route.params.id !== undefined) {
      await this.loadUpdate(this.$route.params.id)
    }
  },
  methods: {
    isFormatCategory () {
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].name === this.tag.type && this.types[i].format === 'category') {
          return true
        }
      }
      return false
    },
    async loadUpdate (id) {
      await this.$store.dispatch('post/resetTag')
      await this.$store.dispatch('post/fetchTag', id)
    },
    async handleUpdate (id) {
      await this.loadUpdate(id)
      await this.$router.push('/tag/update/' + id)
    },
    async handleSave () {
      let act = this.tag.id !== 0 ? 'post/updateTag' : 'post/createTag'
      await this.$store.dispatch(act, {...this.tag})
      await this.$store.dispatch('post/resetTag')
      await this.$router.push('/tag')
      this.serverParams = {
        order: 'id',
        sort: 'desc',
        page: 1,
        size: 10
      }
      await this.loadData()
    },
    async handleDelete (id) {
      await this.$store.dispatch('post/deleteTag', id)
      await this.$store.dispatch('post/resetTag')
      await this.loadData()
    },
    async handleChangeType () {
      await this.$store.dispatch('post/fetchTags', {type: this.tag.type})
    },
    async handleChangeTitle () {
      if (this.tag.slug.length === 0) {
        this.tag.slug = this.tag.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    },
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getTags(this.serverParams).then(res => {
          this.rows = res.data.data
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    onPerPageChange (params) {
      if (this.serverParams.size !== params.currentPerPage && this.serverParams.size !== undefined) {
        this.serverParams.size = parseInt(params.currentPerPage)
        this.$router.push({
          path: '/tag',
          query: this.serverParams
        })
        this.loadData()
      }
    },
    onPageChange (params) {
      if (this.serverParams.page !== params.currentPage) {
        this.serverParams.page = parseInt(params.currentPage)
        this.$router.push({
          path: '/tag',
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
        path: '/tag',
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
        path: '/tag',
        query: this.serverParams
      })
      this.loadData()
    }
  },
  computed: {
    tags () {
      return this.$store.getters['post/getTags']()
    },
    tag () {
      return this.$store.getters['post/getTag']()
    }
  },
  data: () => {
    return {
      rows: [],
      links: {},
      types: [],
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

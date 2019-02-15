<template>
  <div class="post-container">
    <h2>Tags</h2>
    <div class="row">
      <div class="col-md-3">
        <form method="post" v-on:submit.prevent="handleSave">
          <div class="form-group">
            <label>Title</label>
            <input type="text" class="form-control input-sm" v-model="tag.attributes.title" v-on:change="handleChangeTitle">
          </div>
          <div class="form-group">
            <label>Slug</label>
            <input type="text" class="form-control input-sm" v-model="tag.attributes.slug">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm" v-model="tag.attributes.type" v-on:change="handleChangeType">
              <option v-for="type in types" :key="type.name" :value="type.name">{{ type.label }}</option>
            </select>
          </div>
          <div class="form-group" v-if="isFormatCategory() === true">
            <label>Parent</label>
            <select class="form-control input-sm" v-model="tag.attributes.parent_id">
              <option value="0">Select parent</option>
              <option v-for="(parentTag, parentIndex) in tags" :key="'parent-' + parentIndex" :value="parentTag.id">
                {{ parentTag.attributes.display }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-sm btn-primary">Save</button>
          </div>
        </form>
      </div>

      <div class="col-md-9">
        <VueGoodTable
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
          styleClass="table table-condensed table-bordered table-striped">
          <template slot="table-row" slot-scope="props" v-if="props.column.field == 'title'">
            {{ props.formattedRow[props.column.field] }}
            <div class="action">
              <router-link :to="'/tag/update/' + props.row.id" class="text-warning">
                <i class="glyphicon glyphicon-pencil"></i> Update
              </router-link>
              <span class="text-danger" v-if="parseInt(props.row.status) !== 3" v-on:click="handleDelete(props.row.id)">
                <i class="glyphicon glyphicon-trash"></i> Delete
              </span>
            </div>
          </template>
        </VueGoodTable>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import 'vue-good-table/dist/vue-good-table.css'

import endpoints from '@/common/endpoints'
import { VueGoodTable } from 'vue-good-table'

export default {
  components: {
    VueGoodTable
  },
  async beforeRouteLeave (to, from, next) {
    await this.$store.dispatch('post/resetTag')
    next()
  },
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
    await this.$store.dispatch('updateTitle', 'Tags')
    await this.$store.commit('setBreadcrumbs', [
      {
        label: 'Board',
        link: '/'
      },
      {
        label: 'Tags'
      }
    ])
    endpoints.getOption('tags').then(res => {
      this.types = res.data.data.option
    })
  },
  methods: {
    isFormatCategory () {
      for (let i = 0; i < this.types.length; i++) {
        if (this.types[i].name === this.tag.attributes.type && this.types[i].format === 'category') {
          return true
        }
      }
      return false
    },
    async handleSave () {
      await this.$store.dispatch('post/createTag', {...this.tag.attributes})
      await this.$store.dispatch('post/resetTag')
      await this.loadData()
    },
    async handleChangeType () {
      await this.$store.dispatch('post/fetchTags', {type: this.tag.attributes.type})
    },
    async handleChangeTitle () {
      if (this.tag.attributes.slug.length === 0) {
        this.tag.attributes.slug = this.tag.attributes.title.toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    },
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getTags(this.serverParams).then(res => {
          this.rows = res.data.data.map(tag => {
            return tag.attributes
          })
          this.links = res.data.links
          this.meta = res.data.meta
        })
      }, 500)
    },
    onPerPageChange (params, x) {
      if (this.serverParams.size !== params.currentPerPage) {
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

<style type="text/css">
@import './../assets/style.css'
</style>

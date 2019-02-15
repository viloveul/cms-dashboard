<template>
  <div class="modal fade in" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" v-on:click="$emit('close-fileman')" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">
            Media Gallery
          </h4>
        </div>
        <div class="modal-body">
          <input type="text" v-model="requests.search_name" class="form-control" placeholder="Search name..." v-on:keydown.enter="handleSearch">
          <div class="content">
            <div class="row" v-for="(fileRows, index) in files" :key="'row' + index">
              <div class="col-md-2" v-for="(file, i) in fileRows" :key="'col' + i">
                <div class="thumbnail" :title="file.attributes.name">
                  <img :src="file.attributes.image_url">
                  <div class="caption">
                    <p>{{ file.attributes.name }}</p>
                    <span class="btn btn-info btn-xs btn-block" v-on:click.prevent="$emit('selected-fileman', file.attributes)">
                      Select
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Paginate
            :page-count="totalPage"
            :container-class="'pagination'"
            :click-handler="handlePageChanged"
          >
          </Paginate>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import endpoints from '@/common/endpoints'
import Paginate from 'vuejs-paginate'

export default {
  components: {
    Paginate
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      if (this.timeout !== null) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(async () => {
        await endpoints.getUploadedFiles(this.requests).then(res => {
          this.rows = res.data.data
          this.totalPage = Math.ceil(res.data.meta.total / this.requests.size)
        })
      }, 500)
    },
    async handlePageChanged (pageNum) {
      this.requests.page = pageNum
      await this.loadData()
    },
    async handleSearch () {
      this.requests.page = 1
      await this.loadData()
    }
  },
  computed: {
    files () {
      let results = []
      let curFiles = [...this.rows]
      while (curFiles.length) {
        results.push(curFiles.splice(0, 6))
      }
      return results
    }
  },
  data () {
    return {
      timeout: null,
      rows: [],
      totalPage: 10,
      requests: {
        search_name: '',
        size: 12,
        page: 1
      }
    }
  }
}

</script>

<style type="text/css" scoped="true">
.modal {
  display: block;
}
.modal-body .content {
  height: 50vh;
  padding: 20px;
  margin: 15px auto;
  border: 1px solid #CCC;
  overflow-x: auto;
}
.content .thumbnail {
    position: relative;
}
.content .thumbnail>img {
    max-width: 100% !important;
}
.pagination {
  margin: 0px auto;
}
@media (min-width: 992px) {
  .modal-dialog.modal-lg {
    width: 95vw !important;
    height: 95vh !important;
  }
}
</style>

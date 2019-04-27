<template>
  <div class="modal fade in notification" tabindex="-1" role="dialog" style="display: block;">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" v-on:click.prevent="$emit('close-notification')">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Notification</h4>
        </div>
        <div class="modal-body">
          <div class="notification-item" v-for="(row, index) in rows" :key="index">
            <div
              :class="['alert', parseInt(row.status) === 1 ? 'alert-warning' : 'alert-info']"
              style="margin: 2px auto;"
            >
              {{ row.content }}
              <span class="close" v-on:click="handleStatus(row.id)" v-if="parseInt(row.status) === 0">&times;</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Paginate
            v-show="pages > 1"
            :page-count="pages"
            :click-handler="handlePage"
            :prev-text="'Prev'"
            :next-text="'Next'"
            :force-page="page"
            :container-class="'pagination'">
          </Paginate>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import Paginate from 'vuejs-paginate'
import endpoints from '@/common/endpoints'

export default {
  components: {
    Paginate
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      let { data } = await endpoints.getNotifications({
        page: parseInt(this.page),
        order: this.order,
        sort: this.sort
      })
      this.rows = data.data
      this.pages = Math.ceil(data.meta.total / data.meta.size)
    },
    async handleStatus (id) {
      await endpoints.getNotification(id)
      await this.loadData()
    },
    async handlePage (pageNum) {
      this.page = pageNum
      await this.loadData()
    }
  },
  data () {
    return {
      rows: [],
      pages: 1,
      page: 1,
      order: 'id',
      sort: 'desc'
    }
  }
}

</script>

<style type="text/css" scoped="true">
.pagination {
  margin: 0;
}
</style>

<template>
  <div :class="className">
    <div class="item-header">
      <span class="handler">o</span>
      <span class="text" v-on:click="toggle">{{ name }}</span>
    </div>
    <div class="item-body" v-if="body === true">
      <div class="form-group">
        <label>Type</label>
        <select v-model="options.id" class="form-control">
          <option v-for="menu in menus" :key="menu.id" :value="menu.id">{{ menu.label }}</option>
        </select>
      </div>
      <div class="form-group">
        <span class="btn btn-danger btn-xs" v-on:click="$emit('delete-item')">Delete</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

import endpoints from '@/common/endpoints'

export default {
  props: {
    className: {
      type: String,
      default: 'widget-item'
    },
    name: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  async mounted () {
    await endpoints.getMenus({order: 'label', sort: 'asc', size: 1000, search_status: 1}).then(res => {
      this.menus = res.data.data
    })
  },
  methods: {
    toggle () {
      this.body = !this.body
    }
  },
  data () {
    return {
      body: false,
      menus: []
    }
  }
}

</script>

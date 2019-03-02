<template>
  <div :class="className">
    <div class="item-header">
      <span class="handler">o</span>
      <span class="text" v-on:click="toggle">{{ name }}</span>
    </div>
    <div class="item-body" v-if="body === true">
      <div class="form-group">
        <label>Label</label>
        <input type="text" v-model="options.placeholder" class="form-control">
      </div>
      <div class="form-group">
        <span class="btn btn-danger btn-xs" v-on:click="$emit('delete-item')">Delete</span>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

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
  methods: {
    toggle () {
      this.body = !this.body
    }
  },
  data () {
    return {
      body: false,
      types: []
    }
  }
}

</script>

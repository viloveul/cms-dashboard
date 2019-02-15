<template>
  <ul class="breadcrumb">
    <li>
      <router-link :to="'/'" replace>
        <i class="glyphicon glyphicon-console"></i>
      </router-link>
    </li>
    <li v-for="(item, index) in linkItems" :key="index">
      <router-link :to="item.link" replace>{{ item.label }}</router-link>
    </li>
    <li class="active">{{ lastItem.label }} $</li>
  </ul>
</template>

<script type="text/javascript">

export default {
  props: {
    items: {
      type: Array
    }
  },
  computed: {
    lastItem () {
      return this.items[this.items.length - 1]
    },
    linkItems () {
      if (this.items.length > 1) {
        return this.items.slice(0, this.items.length - 1)
      } else {
        return []
      }
    }
  }
}

</script>

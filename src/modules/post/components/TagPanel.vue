<template>
  <div class="panel panel-default panel-editor" v-if="items.length > 0">
    <div class="panel-heading">{{ name.charAt(0).toUpperCase() + name.slice(1) }}</div>
    <div class="panel-body">
      <div class="panel-body-inner">
        <div class="form-group" v-if="type !== 'category'">
          <label class="checkbox-inline" v-for="(item, index) in myItems" :key="name + type + index">
            <input type="checkbox" :value="item.id" v-model="myRelations"> {{ item.display }}
          </label>
        </div>
        <div class="form-group" v-if="type === 'category'" v-for="(item, index) in myItems" :key="name + type + index">
          <div class="checkbox">
            <label>
              <input type="checkbox" :value="item.id" v-model="myRelations"> {{ item.display }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">

export default {
  props: {
    value: {
      type: Array
    },
    items: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'tag'
    },
    selections: {
      type: Array
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    myItems () {
      return this.items
    },
    myRelations: {
      get () {
        return this.value
      },
      set ($val) {
        this.$emit('input', $val)
      }
    }
  }
}

</script>

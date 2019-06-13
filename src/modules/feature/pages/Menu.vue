<template>
  <div class="feature-container">
    <h2>Menu Featured</h2>
    <div class="" v-if="types.length > 0">
      <div class="form-group" v-for="(type, index) in types" :key="'type-' + index">
        <label>{{ type.label }}</label>
        <select class="form-control" v-model="menuset[type.location]">
          <option disabled="disabled">Select Menu</option>
          <option v-for="(mymenu, indexMine) in menus" :key="indexMine" :value="mymenu.id">
            {{ mymenu.label }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-primary" v-on:click.prevent="handleSave">Save</button>
      </div>
    </div>
    <div v-else class="alert alert-danger">
      Not Support
    </div>
  </div>
</template>

<script type="text/javascript">

import endpoints from '@/common/endpoints'

export default {
  async created () {
    await this.$store.dispatch('setting/loadOptions')
    let { data } = await endpoints.getMenus({
      size: 1000,
      page: 1
    })
    this.menus = data.data
  },
  computed: {
    options () {
      return this.$store.getters['setting/getOptions']()
    }
  },
  async mounted () {
    let prepared = await this.prepare()
    this.menuset = prepared.sets
    this.types = prepared.types
  },
  methods: {
    async prepare () {
      return new Promise(async (resolve, reject) => {
        let sets = {}
        let types = []
        try {
          let features = this.options.features
          for (let z in features.menu) {
            types.push({location: z, label: features.menu[z]})
            if (sets[z] === undefined) {
              let opt = this.options['menu-' + z] === undefined ? {} : this.options['menu-' + z]
              if (opt !== null && opt.id !== undefined) {
                sets[z] = opt.id
              }
            }
          }
        } catch (e) {
          // do nothing
        }
        resolve({
          sets: sets,
          types: types
        })
      })
    },
    async handleSave () {
      let options = {}
      for (let y in this.menuset) {
        options['menu-' + y] = {id: this.menuset[y]}
      }
      await this.$store.dispatch('setting/updateOption', options)
    }
  },
  data () {
    return {
      menuset: {},
      types: [],
      menus: []
    }
  }
}

</script>

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import NProgress from 'nprogress'
import store from '@/store'
import router from '@/router'
import CKEditor from '@ckeditor/ckeditor5-vue'
import endpoints from '@/common/endpoints'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-datetime/dist/vue-datetime.css'
import 'nprogress/nprogress.css'
import '@/assets/dashbar.css'

Vue.config.productionTip = false

Vue.use(CKEditor)

NProgress.configure({
  trickle: false
})

endpoints.base().interceptors.request.use(config => {
  NProgress.start()
  return config
})

endpoints.base().interceptors.response.use(
  res => {
    NProgress.done()
    return res
  },
  err => {
    if (err.response.status !== 404) {
      let errors = err.response.data.errors.map(e => {
        return e.detail
      })
      store.dispatch('updateErrors', errors)
    }
    NProgress.done()
    return Promise.reject(err)
  }
)

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    store.commit('setBreadcrumbs', [])
    store.dispatch('resetErrors')
    store.dispatch('updateTitle', 'Viloveul')
  }
  store.dispatch('updateRedirection', from.path)
  return next()
})

router.beforeResolve((to, from, next) => {
  NProgress.start()
  return next()
})

router.afterEach((to, from) => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#viloveul',
  store,
  router,
  template: '<transition name="slide"><router-view></router-view></transition>'
})

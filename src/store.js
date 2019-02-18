import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/modules/user/module'
import post from '@/modules/post/module'
import media from '@/modules/media/module'
import menu from '@/modules/menu/module'
import comment from '@/modules/comment/module'
import setting from '@/modules/setting/module'

Vue.use(Vuex)

const state = {
  redirect: '/',
  breadcrumbs: [],
  errors: []
}

const mutations = {
  setBreadcrumbs: (context, items) => {
    context.breadcrumbs = [...items]
  },
  setErrors: (context, errors) => {
    for (let i = 0; i < errors.length; i++) {
      context.errors.push(errors[i])
    }
  },
  setTitle: (context, title) => {
    window.document.title = title
  },
  setRedirection: (context, path) => {
    context.redirect = path
  }
}

const getters = {
  getBreadcrumbs: (context) => () => {
    return context.breadcrumbs
  },
  getErrors: (context) => () => {
    return context.errors
  },
  getTitle: (context) => () => {
    return window.document.title
  },
  getRedirect: (context) => () => {
    return context.redirect
  }
}

const actions = {
  resetErrors: (context, payload) => {
    context.state.errors = []
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  modules: {
    user,
    media,
    post,
    menu,
    comment,
    setting
  }
})

export default store

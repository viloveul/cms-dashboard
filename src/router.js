import Vue from 'vue'
import VueRouter from 'vue-router'
import general from '@/common/general'

import App from '@/App'
import Login from '@/Login'

import {
  Profile as UserProfile,
  Manager as UserManager,
  Editor as UserEditor,
  Assignment as RoleAssignment,
  Roles,
  RoleEdit
} from '@/modules/user'

import {
  Content as ContentSetting,
  General as GeneralSetting,
  Moderator as ModeratorSetting
} from '@/modules/setting'

import {
  Manager as CommentManager
} from '@/modules/comment'

import {
  Gallery as MediaGallery,
  Uploader as MediaUploader
} from '@/modules/media'

import {
  Tags as TagManager,
  Manager as PostManager,
  Editor as PostEditor,
  TagEdit
} from '@/modules/post'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        exact: true,
        component: UserProfile
      },
      {
        path: '/setting',
        component: GeneralSetting
      },
      {
        path: '/setting/content',
        component: ContentSetting
      },
      {
        path: '/setting/moderator',
        component: ModeratorSetting
      },
      {
        path: '/user',
        component: UserManager
      },
      {
        path: '/user/create',
        component: UserEditor
      },
      {
        path: '/user/update/:id',
        component: UserEditor
      },
      {
        path: '/role/assignment',
        component: RoleAssignment
      },
      {
        path: '/role',
        component: Roles
      },
      {
        path: '/role/update/:id',
        component: RoleEdit
      },
      {
        path: '/comment',
        component: CommentManager
      },
      {
        path: '/tag',
        component: TagManager
      },
      {
        path: '/media',
        component: MediaGallery
      },
      {
        path: '/media/upload',
        component: MediaUploader
      },
      {
        path: '/post',
        component: PostManager
      },
      {
        path: '/post/create',
        component: PostEditor
      },
      {
        path: '/post/update/:id',
        component: PostEditor
      },
      {
        path: '/tag/update/:id',
        component: TagEdit
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: general.getBaseUrl(),
  routes: routes
})

export default router

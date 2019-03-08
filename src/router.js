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
  Roles
} from '@/modules/user'

import {
  General as GeneralSetting,
  Theme as ThemeSetting,
  Moderator as ModeratorSetting
} from '@/modules/setting'

import {
  Manager as CommentManager,
  Editor as CommentEditor
} from '@/modules/comment'

import {
  Manager as MenuManager,
  Editor as MenuEditor
} from '@/modules/menu'

import {
  Gallery as MediaGallery,
  Uploader as MediaUploader
} from '@/modules/media'

import {
  Widget,
  Banner
} from '@/modules/feature'

import {
  Tags as TagManager,
  Manager as PostManager,
  Editor as PostEditor
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
        path: '/setting',
        component: GeneralSetting
      },
      {
        path: '/setting/theme',
        component: ThemeSetting
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
        component: Roles
      },
      {
        path: '/comment',
        component: CommentManager
      },
      {
        path: '/comment/update/:id',
        component: CommentEditor
      },
      {
        path: '/menu',
        component: MenuManager
      },
      {
        path: '/menu/update/:id',
        component: MenuManager
      },
      {
        path: '/menu/editor',
        component: MenuEditor
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
        path: '/tag',
        component: TagManager
      },
      {
        path: '/tag/update/:id',
        component: TagManager
      },
      {
        path: '/feature/widget',
        component: Widget
      },
      {
        path: '/feature/widget/:type',
        component: Widget
      },
      {
        path: '/feature/banner',
        component: Banner
      },
      {
        path: '',
        exact: true,
        component: UserProfile
      },
      {
        path: '/*',
        component: () => {
          window.location.href = '/'
        }
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

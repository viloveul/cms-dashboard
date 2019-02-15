import Axios from 'axios'
import general from '@/common/general'
import session from '@/common/session'
import qs from 'qs'

const http = Axios.create({
  baseURL: general.getApiUrl(),
  transformRequest: function (data, headers) {
    headers['Authorization'] = session.getAuthHeader()
    return data
  }
})

const endpoints = {
  base () {
    return http
  },

  /**
   * AUTH ENDPOINT
   */
  async requestToken ($data, $params) {
    return http.request({
      url: '/auth/login',
      method: 'post',
      data: qs.stringify($data),
      params: $params || {}
    })
  },

  /**
   * USERS ENDPOINT
   */
  async getMe ($params) {
    return http.get('/user/me', {
      params: $params || {}
    })
  },
  async getUsers ($params) {
    return http.get('/user/index', {
      params: $params || {}
    })
  },
  async deleteUser ($id, $params) {
    return http.delete('/user/delete/' + $id, {
      params: $params || {}
    })
  },
  async getUser ($id, $params) {
    return http.get('/user/detail/' + $id, {
      params: $params || {}
    })
  },
  async updateUser ($id, $data, $params) {
    return http.post('/user/update/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async createUser ($data, $params) {
    return http.post('/user/create', qs.stringify($data), {
      params: $params || {}
    })
  },
  async assignUser ($id, $data, $params) {
    return http.post('/user/assign/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async unAssignUser ($id, $data, $params) {
    return http.post('/user/unassign/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async getAllRoles ($params) {
    return http.get('/role/all', {
      params: $params || {}
    })
  },
  async getRoles ($params) {
    return http.get('/role/index', {
      params: $params || {}
    })
  },
  async getRole ($id, $params) {
    return http.get('/role/detail/' + $id, {
      params: $params || {}
    })
  },
  async updateRole ($id, $data, $params) {
    return http.post('/role/update/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async createRole ($data, $params) {
    return http.post('/role/create', qs.stringify($data), {
      params: $params || {}
    })
  },
  async assignRole ($id, $data, $params) {
    return http.post('/role/assign/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async unAssignRole ($id, $data, $params) {
    return http.post('/role/unassign/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },

  /**
   * SETTINGS ENDPOINT
   */
  async getOption ($name) {
    return http.get('/setting/' + $name)
  },
  async setOption ($name, $value) {
    let data = typeof $value !== 'string' ? JSON.stringify($value) : $value
    return http.post('/setting/' + $name, data)
  },

  /**
   * MEDIA ENDPOINT
   */
  async getUploadedFiles ($params) {
    return http.get('/media/index', {
      params: $params || {}
    })
  },
  async uploadFiles ($data, $params) {
    return http.post('/media/upload', $data, {
      params: $params || {},
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  async deleteUploadedFile ($id, $params) {
    return http.delete('/media/delete/' + $id, {
      params: $params || {}
    })
  },
  async detailUploadedFile ($id, $params) {
    return http.get('/media/detail/' + $id, {
      params: $params || {}
    })
  },

  /**
   * POSTS ENDPOINT
   */
  async getPosts ($params) {
    return http.get('/post/index', {
      params: $params || {}
    })
  },
  async getPost ($id, $params) {
    return http.get('/post/detail/' + $id, {
      params: $params || {}
    })
  },
  async deletePost ($id, $params) {
    return http.delete('/post/delete/' + $id, {
      params: $params || {}
    })
  },
  async createPost ($data, $params) {
    return http.post('/post/create', qs.stringify($data), {
      params: $params || {}
    })
  },
  async updatePost ($id, $data, $params) {
    return http.post('/post/update/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async getTag ($id, $params) {
    return http.get('/tag/detail/' + $id, {
      params: $params || {}
    })
  },
  async getTags ($params) {
    return http.get('/tag/index', {
      params: $params || {}
    })
  },
  async getAllTags ($params) {
    return http.get('/tag/all', {
      params: $params || {}
    })
  },
  async createTag ($data, $params) {
    return http.post('/tag/create', qs.stringify($data), {
      params: $params || {}
    })
  },
  async deleteTag ($id, $params) {
    return http.delete('/tag/delete/' + $id, {
      params: $params || {}
    })
  },
  async updateTag ($id, $data, $params) {
    return http.post('/tag/update/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },

  /**
   * COMMENTS ENDPOINT
   */
  async getComment ($id, $params) {
    return http.get('/comment/detail/' + $id, {
      params: $params || {}
    })
  },
  async getComments ($params) {
    return http.get('/comment/index', {
      params: $params || {}
    })
  },
  async createComment ($data, $params) {
    return http.post('/comment/create', qs.stringify($data), {
      params: $params || {}
    })
  },
  async updateComment ($id, $data, $params) {
    return http.post('/comment/update/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  },
  async deleteComment ($id, $params) {
    return http.delete('/comment/delete/' + $id, {
      params: $params || {}
    })
  },

  /**
   * BLOG ENDPOINT
   */
  async getBlogPost ($params) {
    return http.get('/blog/index', {
      params: $params || {}
    })
  },
  async getBlogDetail ($slug, $params) {
    return http.get('/blog/detail/' + $slug, {
      params: $params || {}
    })
  },
  async getBlogArchive ($slug, $params) {
    return http.get('/blog/archive/' + $slug, {
      params: $params || {}
    })
  },
  async getBlogAuthor ($slug, $params) {
    return http.get('/blog/author/' + $slug, {
      params: $params || {}
    })
  },
  async getBlogCommentList ($id, $params) {
    return http.get('/blog/comments/' + $id, {
      params: $params || {}
    })
  },
  async sendComment ($id, $data, $params) {
    return http.post('/blog/comment/' + $id, qs.stringify($data), {
      params: $params || {}
    })
  }
}

export default endpoints

export default {
  attributes: {
    id: 0,
    post_id: 0,
    parent_id: 0,
    author_id: 0,
    name: '',
    nickname: '',
    email: '',
    website: '',
    content: '',
    status: 1,
    created_at: '',
    deleted_at: '',
    updated_at: ''
  },
  relationships: {
    post: {
      data: {
        id: 0,
        title: '',
        slug: '',
        type: 'post',
        description: ''
      }
    },
    author: {
      data: {
        id: 0,
        name: '',
        nickname: '',
        email: ''
      }
    }
  }
}

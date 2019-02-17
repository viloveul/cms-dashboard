export default {
  attributes: {
    id: 0,
    author_id: 0,
    name: '',
    filename: '',
    type: '',
    size: 0,
    year: 0,
    month: '',
    day: '',
    url: '',
    image_url: '',
    status: 1,
    created_at: '',
    updated_at: '',
    deleted_at: ''
  },
  relationships: {
    author: {
      data: {
        id: 0,
        name: '',
        nickname: ''
      }
    }
  }
}

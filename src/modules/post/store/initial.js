let curDate = new Date()
let dateFormated = curDate.getFullYear() + '-' + curDate.getMonth().toString().padStart(2, '0') + '-' + curDate.getDate().toString().padStart(2, '0')
let timeFormated = curDate.getHours().toString().padStart(2, '0') + ':' + curDate.getMinutes().toString().padStart(2, '0') + ':' + curDate.getSeconds().toString().padStart(2, '0')

export default {
  tags: [],
  tag: {
    attributes: {
      id: 0,
      parent_id: 0,
      author_id: 0,
      title: '',
      slug: '',
      type: 'tag',
      status: 1,
      created_at: dateFormated + ' ' + timeFormated
    },
    relationships: {
      childs: {
        data: []
      }
    }
  },
  post: {
    attributes: {
      id: 0,
      parent_id: 0,
      author_id: 0,
      title: '',
      cover: '',
      slug: '',
      type: 'post',
      description: '',
      content: '',
      status: 1,
      created_at: dateFormated + ' ' + timeFormated,
      comment_count: 0,
      comment_enabled: 1
    },
    relationships: {
      comments: {
        data: []
      },
      tags: {
        data: []
      },
      author: {
        data: {
          id: 0,
          name: '',
          username: '',
          email: ''
        }
      }
    }
  },
  relations: []
}

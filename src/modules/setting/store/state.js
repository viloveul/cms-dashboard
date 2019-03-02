export default {
  brand: 'Viloveul',
  description: 'Content Management System',
  email: 'me@viloveul.com',
  contents: {
    posts: [
      {
        name: 'post',
        format: 'post',
        label: 'Post'
      },
      {
        name: 'page',
        format: 'page',
        label: 'Page'
      }
    ],
    tags: [
      {
        name: 'tag',
        format: 'tag',
        label: 'Post Tag'
      },
      {
        name: 'category',
        format: 'category',
        label: 'Category'
      }
    ],
    menus: [
      {
        name: 'menu',
        format: 'standar',
        label: 'Menus'
      }
    ]
  },
  moderations: {
    user: true,
    post: true,
    comment: false
  }
}

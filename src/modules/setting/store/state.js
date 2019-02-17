export default {
  brand: 'Viloveul',
  description: 'Content Management System',
  email: 'me@viloveul.com',
  banner: '',
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
  moderations: {
    user: true,
    post: true,
    comment: false
  }
}

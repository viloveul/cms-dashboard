export default {
  roles: [],
  role: {
    attributes: {
      id: 0,
      name: '',
      description: '',
      type: 'access'
    },
    relationships: {
      childs: {
        data: []
      }
    }
  },
  user: {
    attributes: {
      id: 0,
      picture: '',
      name: '',
      email: '',
      username: '',
      status: 0,
      password: null,
      passconf: null
    },
    relationships: {
      roles: {
        data: []
      }
    }
  }
}

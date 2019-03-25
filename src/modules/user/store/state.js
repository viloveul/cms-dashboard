import initial from '@/modules/user/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

export default {
  ...initState,
  me: {
    ...initState.user
  },
  mine: {
    privileges: [],
    notification: {
      total: 0,
      read: 0,
      unread: 0
    }
  }
}

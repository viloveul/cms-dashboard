import initial from '@/modules/user/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

export default {
  ...initState,
  me: {
    ...initState.user.attributes
  },
  privileges: []
}

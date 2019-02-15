import initial from '@/modules/user/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

const state = {
  ...initState,
  me: {
    ...initState.user
  },
  privileges: []
}

export default state

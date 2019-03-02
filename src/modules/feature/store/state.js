import initial from '@/modules/feature/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

export default {
  ...initState
}

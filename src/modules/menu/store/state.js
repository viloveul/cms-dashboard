import initial from '@/modules/menu/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

export default {
  ...initState
}

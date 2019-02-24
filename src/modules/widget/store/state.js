import initial from '@/modules/widget/store/initial'

let initState = {...JSON.parse(JSON.stringify(initial))}

export default {
  ...initState
}

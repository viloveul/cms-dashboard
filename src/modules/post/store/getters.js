let groupingItems = (items) => {
  let tmpItems = []
  for (let i = 0; i < items.length; i++) {
    if (typeof tmpItems[items[i].attributes.parent_id] === 'undefined') {
      tmpItems[items[i].attributes.parent_id] = []
    }
    tmpItems[items[i].attributes.parent_id].push(items[i])
  }
  return tmpItems
}

let recursiveMapItems = (results, items, parentId, prefix) => {
  if (items[parentId] !== undefined) {
    for (let a = 0; a < items[parentId].length; a++) {
      let item = {...items[parentId][a]}
      item.attributes.display = prefix + items[parentId][a].attributes.title
      results.push(item)
      let childs = recursiveMapItems([], items, items[parentId][a].id, prefix + '-- ')
      if (childs.length > 0) {
        results.push(...childs)
      }
    }
  }
  return results
}

export default {
  getPost: (state) => () => {
    return state.post
  },
  getTag: (state) => () => {
    return state.tag
  },
  getTags: (state) => () => {
    return recursiveMapItems([], groupingItems([...state.tags]), 0, '')
  }
}

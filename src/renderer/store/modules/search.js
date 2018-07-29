const state = {
  showSearch: false
}

const mutations = {
  toggleSearch (state) {
    state.showSearch = !state.showSearch
  }
}

export default {
  state,
  mutations
}

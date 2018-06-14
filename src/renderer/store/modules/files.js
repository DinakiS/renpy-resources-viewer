import { remote } from 'electron'

const dialog = remote.dialog

const state = {
  gameDir: null,
  files: {},
  currentFile: null
}

const mutations = {
  setGameDir (state, dir) {
    state.gameDir = dir
  },
  setFiles (state, files) {
    state.files = files
  },
  setArchiveContent (state, params) {
    Object.assign(state.files[params.name], params.content)
  },
  showFile (state, file) {
    state.currentFile = file
  }
}

const actions = {
  changeGameDir ({ commit }) {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (dirPaths) => {
      if (dirPaths && dirPaths.length) {
        commit('setFiles', {})
        commit('setGameDir', dirPaths[0])
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}

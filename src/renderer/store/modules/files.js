import { remote } from 'electron'
import path from 'upath'
import fs from 'fs'

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
  },
  extractFile ({ state }) {
    if (!state.currentFile) return
    let fileName = path.basename(state.currentFile)
    dialog.showSaveDialog({
      title: `Extract file ${fileName}`,
      defaultPath: fileName
    }, filename => {
      if (!filename) return

      fs.createReadStream(state.currentFile).pipe(fs.createWriteStream(filename))
    })
  }
}

export default {
  state,
  mutations,
  actions
}

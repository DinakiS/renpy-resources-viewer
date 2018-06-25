/*
import path from 'upath'
import fs from 'fs'
*/

const state = {
  useRenpyPython: true,
  pythonPath: 'lib/windows-i686/python.exe'
}

const mutations = {
  setUseRenpyPython (state, use) {
    state.useRenpyPython = use
  },
  setRenpyFolder (state, folder) {
    state.renpyFolder = folder
  }
}

export default {
  state,
  mutations
}

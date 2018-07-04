import os from 'os'

const state = {
  useRenpyPython: true,
  pythonPath: 'lib/windows-i686/python.exe',
  showSettings: false
}

const mutations = {
  setUseRenpyPython (state, use) {
    state.useRenpyPython = use
  },
  setPythonPath (state, py) {
    state.pythonPath = py
  },
  toggleSettings (state) {
    state.showSettings = !state.showSettings
  }
}

const actions = {
  defaultPythonPath ({ commit }) {
    let platform = os.platform()

    if (platform.match('win')) {
      return commit('setPythonPath', 'lib/windows-i686/python.exe')
    }
    if (platform.match('linux')) {
      if (os.arch() === 'x64') {
        return commit('setPythonPath', 'lib/linux-x86_64/python')
      } else {
        return commit('setPythonPath', 'lib/linux-i686/python')
      }
    }
  }
}

export default {
  state,
  mutations,
  actions
}

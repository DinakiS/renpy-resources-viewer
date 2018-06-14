<template>
  <div id='left-menu' class='left-menu' v-hotkey="keymap">
    <div class='toolbar'>
      <button class='btn' @click="selectGameDir" title="Select game folder"><span class='icon-folder'></span></button>
    </div>

    <div class='msg no-folder' v-if="!gameDir">Choose the game folder</div>
    <div class='msg problem' v-if="problem">{{problem}}</div>
    <div class='msg loading' v-if="filesLoading">Loading...</div>

    <ul v-if="Object.keys(renpyFiles).length">
      <menu-item v-for="(file, name) in renpyFiles" :key="file.basename" :name="name" :file="file"></menu-item>
    </ul>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'

import recursive from 'recursive-readdir'

import MenuItem from './LeftMenu/Item.vue'

export default {
  name: 'left-menu',
  components: { MenuItem },
  data () {
    return {
      problem: '',
      filesLoading: false,
      renpyFiles: {}
    }
  },
  computed: {
    gameDir () {
      return this.$store.state.files.gameDir
    },
    keymap () {
      return {
        up: this.prevFile,
        left: this.prevFile,
        right: this.nextFile,
        down: this.nextFile
      }
    }
  },
  watch: {
    gameDir (gameDir) {
      if (!gameDir) return
      console.log(`Game dir changed: ${gameDir}`)

      this.renpyFiles = {}
      this.$store.commit('setFiles', {})
      this.$store.commit('showFile', null)

      let folders = fs.readdirSync(gameDir)

      if (!folders.includes('game') || !folders.includes('renpy')) {
        this.problem = "Can't find 'renpy' or 'game' folders."
        this.$store.commit('setGameDir', '')
        return
      }

      this.problem = ''
      this.filesLoading = true

      this.searchRenpyFiles(path.join(gameDir, 'game'))
    }
  },
  methods: {
    searchRenpyFiles (dir) {
      recursive(dir, [ignoreFunc], (err, files) => {
        if (err) throw err

        files.forEach(filePath => {
          this.renpyFiles[path.basename(filePath)] = {
            archivePath: filePath
          }

          this.$store.commit('setFiles', this.renpyFiles)

          this.filesLoading = false
        })
        console.log(files)
      })
    },
    prevFile () {
      console.log('prev')
      /*
      let fPath = this.$store.state.files.currentFile.replace(/.*?renpy-reader\//, '')
      let splitPath = fPath.split('/')

      if (splitPath.length === 2) {
        this.$store.state.files.files[splitPath[0]]
      }
      console.log(fPath)
      */
    },
    nextFile () {
      console.log('next')
    },
    selectGameDir () {
      this.$store.dispatch('changeGameDir')
    }
  }
}

function ignoreFunc (file, stats) {
  let renpyFiles = ['.rpa', '.rpy', '.rpyc']

  return stats.isDirectory() || !renpyFiles.includes(path.extname(file))
}
</script>

<style lang="scss" scoped>
  .left-menu {
    background-color: #212127;
    color: #fff;
    overflow-y: auto;
    overflow-x: auto;
    grid-column: 1;
    grid-row: 2;

    .msg {
      padding: 10px;
      color: #888585;
      font-family: monospace;
      text-align: center;
    }

    .problem {
      color: #ff7777;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }
  }
</style>

<template>
  <div id='left-menu' class='left-menu' v-hotkey="keymap">
    <div class='msg no-folder' v-if="!gameDir">Choose the game folder</div>
    <div class='msg problem' v-if="problem">{{problem}}</div>
    <div class='msg loading' v-if="filesLoading">Loading...</div>

    <search-bar @search="items => searchResult = items" v-if="$store.state.search.showSearch"/>

    <div v-show="mode === 'search'">
      <ul>
        <search-item v-for="item in searchResult.results" :query="searchResult.query" :item="item" :key="item.basename"/>
      </ul>
    </div>

    <ul v-show="Object.keys(renpyFiles).length && mode === 'files'">
      <menu-item v-for="(file, name) in renpyFiles" :key="file.basename" :name="name" :file="file"></menu-item>
    </ul>

  </div>
</template>

<script>
import fs from 'fs'
import path from 'path'

import recursive from 'recursive-readdir'

import MenuItem from './LeftMenu/Item.vue'
import SearchBar from './LeftMenu/SearchBar.vue'
import SearchItem from './LeftMenu/SearchItem.vue'

export default {
  name: 'left-menu',
  components: { MenuItem, SearchBar, SearchItem },
  data () {
    return {
      problem: '',
      filesLoading: false,
      renpyFiles: {},
      searchResult: []
    }
  },
  computed: {
    gameDir () {
      return this.$store.state.files.gameDir
    },
    keymap () {
      return {
        left: this.prevFile,
        right: this.nextFile
      }
    },
    mode () {
      if (this.$store.state.search.showSearch) return 'search'

      return 'files'
    }
  },
  watch: {
    gameDir (gameDir) {
      if (!gameDir) return

      this.renpyFiles = {}
      if (this.$store.state.search.showSearch) this.$store.commit('toggleSearch')
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
      })
    },
    prevFile () {
      const currFile = document.querySelector('.tree-item.active')
      if (currFile) {
        const prevFile = currFile.previousElementSibling
        prevFile && prevFile.children.length && prevFile.children[0].click()
      }
    },
    nextFile () {
      const currFile = document.querySelector('.tree-item.active')

      if (currFile) {
        const nextFile = currFile.nextElementSibling
        nextFile && nextFile.children.length && nextFile.children[0].click()
      }
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
    font-family: monospace;

    .msg {
      padding: 10px;
      color: #888585;
      text-align: center;
    }

    .problem {
      color: #ff7777;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    .text-center {
      text-align: center;
    }
  }
</style>

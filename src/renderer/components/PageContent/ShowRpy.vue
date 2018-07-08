<template>
  <div v-if="loading" class='loading'>
    Loading...
  </div>
  <div v-else class="rpy-code" v-hotkey="keymap">
    <search class='search' v-if="showSearch"/>
    <pre v-html="code"></pre>
  </div>
</template>

<script>
import fs from 'fs'
import Prism from 'prismjs'
import prismRenpy from '../../libs/prism-renpy'

import Search from './code/SearchInFile.vue'

Prism.languages.renpy = prismRenpy

export default {
  props: ['file'],
  components: { Search },
  data () {
    return {
      loading: false,
      code: null,
      showSearch: false
    }
  },
  computed: {
    currentFile () {
      return this.$store.state.files.currentFile
    },
    keymap () {
      return {
        'ctrl+f': this.toggleSearch
      }
    }
  },
  watch: {
    currentFile (val) {
      if (val && val.endsWith('.rpy')) {
        this.readFile()
      }
    }
  },
  methods: {
    toggleSearch () {
      this.showSearch = !this.showSearch
    },
    readFile () {
      this.loading = true

      fs.readFile(this.file, 'utf8', (err, data) => {
        if (err) throw err

        this.code_text = data
        if (this.$store.state.config.highlightCode) {
          this.code = Prism.highlight(data, Prism.languages.renpy, 'renpy')
        } else {
          this.code = data
        }
        this.loading = false
      })
    }
  },
  created () {
    this.readFile()
  }
}
</script>

<style lang="scss">
  .rpy-code {
    white-space: pre;
    color: #fff;
    line-height: 1.4rem;
    font-family: monospace;
    padding: 20px;
    position: relative;

    .search {
      position: fixed;
      top: 70px;
      right: 13px;
    }
  }
</style>


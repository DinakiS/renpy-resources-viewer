<template>
  <div v-if="loading" class='loading'></div>
  <div v-else class="rpy-code">
    <pre v-html="code"></pre>
  </div>
</template>

<script>
import fs from 'fs'
import Prism from 'prismjs'
import prismRenpy from '../../libs/prism-renpy'

Prism.languages.renpy = prismRenpy

export default {
  props: ['file'],
  data () {
    return {
      loading: false,
      code_text: null,
      code: null,
      searchText: '',
      _searchTextRegExp: null
    }
  },
  computed: {
    currentFile () {
      return this.$store.state.files.currentFile
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
    readFile () {
      this.loading = true

      fs.readFile(this.file, 'utf8', (err, data) => {
        if (err) throw err

        this.code_text = data
        this.code = Prism.highlight(data, Prism.languages.renpy, 'renpy')
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
  }
</style>


<template>
  <ace v-model="code" @init="aceInit" :lang="lang" theme="tomorrow_night_eighties" :options="aceOpt"/>
</template>

<script>
import fs from 'fs'
import path from 'path'
import Ace from 'vue2-ace-editor'

export default {
  props: ['file'],
  components: { Ace },
  data () {
    return {
      code: '',
      editor: null,
      aceOpt: {
        readOnly: true
      }
    }
  },
  computed: {
    currentFile () {
      return this.$store.state.files.currentFile
    },
    lang () {
      if (this.currentFile.match(/\.h?xml$/)) {
        return 'xml'
      }
      return 'renpy'
    }
  },
  watch: {
    currentFile (val, oldVal) {
      if (path.extname(oldVal) !== path.extname(val)) {
        this.aceInit()
      }
      this.readFile()
    }
  },
  methods: {
    toggleSearch () {
      this.showSearch = !this.showSearch
    },
    aceInit (editor) {
      require('brace/ext/searchbox')
      require('brace/theme/tomorrow_night_eighties')
      require('brace/mode/xml')
      require('../../libs/ace-mode-renpy')
      this.$set(this, 'editor', editor)
    },
    readFile () {
      fs.readFile(this.file, 'utf8', (err, data) => {
        if (err) throw err

        this.code = data
      })
    }
  },
  created () {
    this.readFile()
  },
  mounted () {
    this.$root.$on('editor gotoLine', num => {
      this.editor.scrollToLine(num, true, false)
      this.editor.gotoLine(num, 0, false)
    })
  }
}
</script>

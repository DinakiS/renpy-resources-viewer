<template>
  <ace v-model="code" @init="aceInit" lang="renpy" theme="tomorrow_night_eighties" :options="aceOpt"/>
</template>

<script>
import fs from 'fs'
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
    aceInit () {
      require('brace/ext/searchbox')
      require('brace/theme/tomorrow_night_eighties')
      require('../../libs/ace-mode-renpy')
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
  }
}
</script>

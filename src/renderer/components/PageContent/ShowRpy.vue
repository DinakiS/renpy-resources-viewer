<template>
  <div v-if="loading" class='loading'></div>
  <div v-else class="code">
    {{code}}
  </div>
</template>

<script>
import fs from 'fs'

export default {
  props: ['file'],
  data () {
    return {
      code: null,
      loading: false
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

        this.code = data
        this.loading = false
      })
    }
  },
  created () {
    this.readFile()
  }
}
</script>

<style lang="scss" scoped>
  .code {
    white-space: pre;
    color: #fff;
    line-height: 1.4rem;
    font-family: monospace;
    padding: 20px;
  }
</style>


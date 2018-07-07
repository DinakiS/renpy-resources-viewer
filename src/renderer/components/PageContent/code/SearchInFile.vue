<template>
  <div class='search-wrap' v-hotkey="keymap">
    <input type="text" v-model="searchText" placeholder="Search" @keyup.enter="searchNext" ref="searchField">

    <div v-if="findNext">{{currentSelected}} of {{totalFound}}</div>
    <div v-else>No results</div>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  data () {
    return {
      findNext: false,
      searchText: '',
      currentSelected: 0,
      totalFound: 0,
      webContents: remote.getCurrentWebContents()
    }
  },
  computed: {
    keymap () {
      return {
        enter: this.searchNext,
        'shift+enter': this.searchBack
      }
    }
  },
  watch: {
    searchText (val) {
      this.findNext = false
    }
  },
  methods: {
    search (options = {}) {
      if (!this.findNext) this.findNext = true

      if (this.searchText) {
        this.webContents.findInPage(this.searchText, options)
      } else {
        this.stopSearch()
      }
    },
    stopSearch () {
      this.webContents.stopFindInPage('clearSelection')
      if (this.$refs.searchField) {
        this.$refs.searchField.focus()
      }
    },
    searchNext () {
      this.search({ forward: true, findNext: this.findNext })
    },
    searchBack () {
      this.search({ forward: false, findNext: this.findNext })
    }
  },
  mounted () {
    this.webContents.on('found-in-page', (event, result) => {
      this.currentSelected = result.activeMatchOrdinal
      this.totalFound = result.matches
    })
    if (this.$refs.searchField) {
      this.$refs.searchField.focus()
    }
  },
  beforeDestroy () {
    this.stopSearch()
  }
}
</script>

<style lang="scss" scoped>
  .search-wrap {
    display: flex;
    align-items: center;
    background-color: #28282f;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.45);
    padding: 5px;

    input:focus {
      outline: none;
    }

    & > * {
      margin: 0 5px;
    }
  }
</style>

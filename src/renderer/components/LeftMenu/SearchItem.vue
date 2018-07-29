<template>
  <li class="files-search tree-item">
    <div class='name' @click="expand = !expand">
      <span class='icon' :class='"icon-" + itemType'></span>
      {{name}} [{{expand ? '-' : '+'}}]
      <span class="path">{{path}}</span>
      <span class="result-count">{{item.fileSearchResult.length}}</span>
    </div>
    <div class="search-results" v-if="expand">
      <div v-for="search in item.fileSearchResult" :key="query + search.index" class="text-line" @click="showInFile(search)">
        <span v-html="markSearch(search.line.text)"></span>
      </div>
    </div>
  </li>
</template>

<script>
import path from 'upath'
import utils from '../../utils'

export default {
  props: ['item', 'query'],
  data () {
    return {
      expand: true
    }
  },
  computed: {
    name () {
      return path.basename(this.item.file)
    },
    path () {
      return path.parse(this.item.file).dir
    },
    itemType () {
      return utils.fileType(this.name)
    }
  },
  methods: {
    markSearch (text) {
      return text.replace(this.query, `<b>${this.query}</b>`)
    },
    showInFile (search) {
      if (this.$store.state.files.currentFile === this.item.realPath) {
        return this.$root.$emit('editor gotoLine', search.line.num + 1)
      }

      this.$store.commit('showFile', this.item.realPath)
      setTimeout(() => {
        this.$root.$emit('editor gotoLine', search.line.num + 1)
      }, 200)
      console.log(this.item, search)
    }
  },
  mounted () {
    if (this.item.fileSearchResult.length > 10) this.expand = false
  }
}
</script>

<style lang="scss">
  .files-search {
    .name {
      display: flex;
      align-items: center;
      padding: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .icon {
        margin-right: 10px;
      }

      .path {
        font-size: 0.85em;
        color: #a0a0a0;
      }

      .result-count {
        background: #101013;
        padding: 2px 5px;
        border-radius: 10px;
        margin-left: auto;
        position: absolute;
        right: 0;
      }
    }
    .search-results {
      .text-line {
        padding: 5px;
        padding-left: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;

        &:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }

        b {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
</style>

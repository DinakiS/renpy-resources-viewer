<template>
  <li
    :title="file.path"
    class="tree-item"
    :class="itemClass"
  >
    <div class='name' @click="showOrExpand">
      <span :class='"icon-" + itemType'></span>
      {{name}}
      <span v-if="name.endsWith('rpa') || isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>

    <ul v-if="open">
      <menu-item 
        v-for="(file, name) in file"
        v-if="typeof file === 'object'"
        :key="name"
        :name="name"
        :file="file">
      </menu-item>
    </ul>
  </li>
</template>

<script>
import os from 'os'
import path from 'upath'
import fs from 'fs'

import rpa from '../../libs/rpa'
import treeify from '../../libs/treeify'
import utils from '../../utils'
import rpyc from '../../libs/rpyc'

export default {
  name: 'menu-item',
  props: [ 'file', 'name' ],
  data () {
    return {
      open: false
    }
  },
  computed: {
    itemClass () {
      let type = this.itemType
      return {
        file: this.file.info,
        [type]: true,
        active: this.$store.state.files.currentFile &&
                this.file.basename &&
                this.$store.state.files.currentFile.match(this.file.basename.replace('.rpyc', '.rpy'))
      }
    },
    isFolder () {
      return this.file.type === 'folder'
    },
    itemType () {
      let type = utils.fileType(this.name)

      if (type === 'undefined' && this.isFolder) {
        return 'folder'
      }

      return type
    }
  },
  methods: {
    showOrExpand () {
      if (this.name.endsWith('rpa') || this.isFolder) {
        if (!this.open) {
          this.expand()
        } else {
          this.open = false
        }
      } else {
        this.show(this.file)
      }
    },
    expand () {
      if (this.name.endsWith('rpa') && !this.file.children) {
        rpa.getIndex(this.file.archivePath).then(result => {
          let archiveContent = sortFiles(treeify(result.index, this.name))

          this.$store.commit('setArchiveContent', {name: this.name, content: archiveContent})

          Object.assign(this.file, archiveContent)

          this.open = true
        }).catch(err => {
          throw new Error(err.message)
        })
      } else if (this.isFolder) {
        this.open = true
      }
    },
    show (file) {
      if (!file.archivePath) {
        const archivePath = this.$store.state.files.files[file.archive].archivePath
        const gameFolderName = path.basename(this.$store.state.files.gameDir)
        const tmp = path.join(os.tmpdir(), 'renpy-reader', gameFolderName, file.archive)
        const outPath = path.join(tmp, file.basename)

        if (fs.existsSync(outPath)) {
          if (path.extname(outPath) === '.rpyc') {
            const rpyPath = outPath.replace('.rpyc', '.rpy')

            if (fs.existsSync(rpyPath)) {
              return this.$store.commit('showFile', rpyPath)
            }
          }
          return this.$store.commit('showFile', outPath)
        }

        rpa.extractFile(archivePath, file, tmp, this.$store.state).then(filePath => {
          if (filePath.endsWith('rpyc')) {
            rpyc.convertToRpy(filePath, this.$store.state).then(newPath => {
              this.$store.commit('showFile', newPath)
            }).catch(err => {
              throw new Error(err.message)
            })
          } else {
            this.$store.commit('showFile', filePath)
          }
        }).catch(err => {
          throw new Error(err.message)
        })
      } else {
        this.$store.commit('showFile', file.archivePath)
      }
    }
  }
}

function sortFunc (a, b) {
  let rg = /\..{3,4}/
  if (a.match(rg) && b.match(rg)) return a.localeCompare(b)
  if (a.match(rg)) return 1
  if (b.match(rg)) return -1
  return a.localeCompare(b)
}

function sortFiles (obj) {
  let sorted = {}
  Object.keys(obj).sort(sortFunc).forEach(key => {
    sorted[key] = obj[key]

    if (typeof sorted[key] === 'object') sorted[key] = sortFiles(sorted[key])
  })
  return sorted
}
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
    padding-left: 20px;

    .tree-item {
      & > .name {
        padding: 10px;
        cursor: pointer;
      }

      .active, &:hover {
        & > .name {
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
</style>

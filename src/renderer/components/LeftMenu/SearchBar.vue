<template>
  <div class='search-bar'>
    <div class="input-wrap">
      <input type="text" placeholder="Type something and press Enter" v-model="query" class="search" @keyup.enter="startSearch">
      <button class="close" @click="query = ''; $emit('search', [])">&times;</button>
    </div>
    <label>files to include</label>
    <input type="text" v-model="include" class="search" @keyup.enter="startSearch">
    <div v-if="status !== ''" class="status">{{status}}</div>
  </div>
</template>

<script>
import path from 'upath'
import os from 'os'
import fs from 'fs'
import { promisify } from 'util'

import rpa from '../../libs/rpa'
import rpyc from '../../libs/rpyc'

const readfile = promisify(fs.readFile)

export default {
  data () {
    return {
      query: '',
      include: '.rpy .rpyc .json .txt',
      result: [],
      status: ''
    }
  },
  methods: {
    async startSearch () {
      if (this.query === '') {
        this.result = []
        return
      }
      if (this.query.length < 3) {
        this.result = []
        this.status = 'Query is too short'
        return
      }
      const filters = this.include.split(' ')

      try {
        const topFiles = Object.keys(this.$store.state.files.files)
        const rpaArchives = topFiles.filter(file => file.endsWith('.rpa'))

        const rpaIndexes = await Promise.all(rpaArchives.map(async archive => {
          const indexes = await rpa.getIndex(this.$store.state.files.files[archive].archivePath)
          indexes.archive = archive
          return indexes
        }))

        let matchedFiles = []

        rpaIndexes.forEach(index => {
          const files = Object.keys(index.index)

          const matchedFilesNames = files.filter(file => {
            return filters.some(filter => file.match(filter))
          })

          matchedFilesNames.forEach(fileName => {
            matchedFiles.push({
              archive: index.archive,
              file: fileName
            })
          })
        })

        const gameFolderName = path.basename(this.$store.state.files.gameDir)
        const tmp = path.join(os.tmpdir(), 'renpy-reader', gameFolderName)
        let extractSomething = false

        await Promise.all(topFiles.map(async topFile => {
          const archiveFiles = matchedFiles.filter(file => file.archive === topFile)

          if (archiveFiles.length && !this.$store.state.files.extractedArchives.includes(topFile)) {
            this.status = `Extracting ${topFile}...`

            const out = path.join(tmp, topFile)
            const archive = path.join(this.$store.state.files.gameDir, 'game', topFile)
            await rpa.extractAll(archive, out, this.$store.state)

            this.$store.commit('addExtractedArchive', topFile)
            extractSomething = true
          }
        }))

        if (extractSomething) {
          this.status = `Converting .rpyc to .rpy...`
          await rpyc.convertToRpy(tmp, this.$store.state)
        }

        matchedFiles = matchedFiles.map(file => {
          if (file.file.endsWith('rpyc')) {
            const rpyPath = path.join(tmp, file.archive, file.file.replace('.rpyc', '.rpy'))
            return {
              ...file,
              realPath: rpyPath,
              exists: fs.existsSync(rpyPath)
            }
          } else {
            const realPath = path.join(tmp, file.archive, file.file)
            return {
              ...file,
              realPath,
              exists: fs.existsSync(realPath)
            }
          }
        })

        this.status = 'Searching...'

        let searchResult = {
          query: this.query,
          results: []
        }

        await Promise.all(matchedFiles.map(async file => {
          if (!file.exists) return console.error(`File ${file.file} doesn't found`)

          const fileContent = await readfile(file.realPath, 'utf8')
          let fileSearchResult = []

          let index = fileContent.indexOf(this.query)
          while (index !== -1) {
            fileSearchResult.push({
              index: index,
              line: getLine(fileContent, index)
            })

            index = fileContent.indexOf(this.query, index + 1)
          }

          if (fileSearchResult.length) {
            searchResult.results.push({
              ...file,
              fileSearchResult
            })
          }
          return true
        }))
        if (searchResult.results.length === 0) {
          this.status = 'Not found'
        } else {
          this.status = ''
        }

        if (searchResult.results.length > 100) {
          searchResult.results.splice(100, searchResult.results.length - 100)
        }

        this.$emit('search', searchResult)

        console.log(searchResult)
      } catch (err) {
        this.result = []
        throw err
      }
    }
  }
}

function getLine (text, index) {
  const lines = text.split('\n')
  let len = 0
  let i = 0
  while (len <= index && i < lines.length) {
    len += lines[i].length + 1 // + 1 is for break line character
    i++
  }
  return {
    num: i - 1,
    text: lines[i - 1].trim()
  }
}
</script>

<style lang="scss" scoped>
  .search-bar {
    display: flex;
    padding: 5px;
    flex-direction: column;


    input:focus {
      outline: none;
    }

    .input-wrap {
      display: flex;
      flex: 1;
      background: rgba(255, 255, 255, 0.11);

      input {
        background: transparent;
      }
    }

    input {
      flex-grow: 1;
      border: none;
      border-radius: 0;
    }

    label {
      margin-top: 8px;
    }

    button {
      margin-left: 5px;
      background-color: transparent;
      border: none;
      padding: 0 7px;
      color: #ffffff;
      cursor: pointer;
      font-size: 19px;
      font-weight: bold;
    }

    .status {
      margin-top: 10px;
      text-align: center;
      flex-grow: 1;
    }
  }
</style>

<template>
  <div id="content">
    <select-game-dir v-if="!gameDir"></select-game-dir>

    <show-image v-if="fileType === 'picture'" :file="currentFile"></show-image>
    <show-sound v-if="fileType === 'sound'" :file="currentFile"></show-sound>
    <show-code v-if="fileType === 'code'" :file="currentFile"/>
    <show-font v-if="fileType === 'font'" :file="currentFile"></show-font>
  </div>
</template>

<script>
  import SelectGameDir from './PageContent/SelectGameDir.vue'
  import ShowImage from './PageContent/ShowImage.vue'
  import ShowSound from './PageContent/ShowSound.vue'
  import ShowFont from './PageContent/ShowFont.vue'
  import ShowCode from './PageContent/ShowCode.vue'
  import utils from '../utils'

  export default {
    name: 'game-content',
    components: { SelectGameDir, ShowImage, ShowSound, ShowFont, ShowCode },
    data () {
      return {
        fileType: null
      }
    },
    computed: {
      gameDir () {
        return this.$store.state.files.gameDir
      },
      currentFile () {
        return this.$store.state.files.currentFile
      }
    },
    watch: {
      currentFile (val) {
        if (val) {
          this.show(val)
        } else {
          this.fileType = null
        }
      }
    },
    methods: {
      show (filePath) {
        this.fileType = utils.fileType(filePath)
      }
    }
  }
</script>

<style>
#content {
  overflow-y: auto
}
</style>

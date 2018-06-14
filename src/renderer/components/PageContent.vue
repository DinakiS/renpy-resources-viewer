<template>
  <div id="content">
    <select-game-dir v-if="!gameDir"></select-game-dir>

    <show-image v-if="fileType === 'image'" :file="currentFile"></show-image>
    <show-sound v-if="fileType === 'sound'" :file="currentFile"></show-sound>
    <show-rpy v-if="fileType === 'code'" :file="currentFile"></show-rpy>
  </div>
</template>

<script>
  import path from 'path'
  import SelectGameDir from './PageContent/SelectGameDir.vue'
  import ShowImage from './PageContent/ShowImage.vue'
  import ShowSound from './PageContent/ShowSound.vue'
  import ShowRpy from './PageContent/ShowRpy.vue'
  import rpyc from '../libs/rpyc'

  export default {
    name: 'game-content',
    components: { SelectGameDir, ShowImage, ShowSound, ShowRpy },
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
        }
      }
    },
    methods: {
      show (filePath) {
        let images = ['.png', '.jpg', '.webp', '.bmp']
        if (images.includes(path.extname(filePath))) {
          this.fileType = 'image'
        }

        let sounds = ['.mp3', '.wav', '.ogg']
        if (sounds.includes(path.extname(filePath))) {
          this.fileType = 'sound'
        }

        if (filePath.endsWith('rpyc')) {
          rpyc.convertToRpy(filePath).then(newPath => {
            this.$store.commit('showFile', newPath)
          })
        }

        if (filePath.endsWith('rpy')) {
          this.fileType = 'code'
        }
      }
    }
  }
</script>

<style>
#content {
  overflow-y: auto;
  flex-grow: 2;
  grid-column: 2;
  grid-row: 2;
}
</style>

<template>
  <div class='toolbar'>
    <button class='btn open' @click="$store.dispatch('changeGameDir')" v-tooltip="{ content: 'Select game folder', placement: 'bottom' }"></button>
    <button class='btn save' @click="$store.dispatch('extractFile')" v-tooltip="{ content: 'Extract file', placement: 'bottom' }"></button>
    <div class='separator'></div>
    <button class='btn search' v-if= "$store.state.files.gameDir" @click="$store.commit('toggleSearch')" v-tooltip="{ content: 'Search through all files', placement: 'bottom' }"></button>
    <button
      class='btn console'
      v-if="$store.state.files.gameDir"
      v-tooltip="{ content: consoleTooltip, placement: 'bottom' }"
      @click="toggleConsole"
      >
    </button>
    <button class='btn settings' @click="$store.commit('toggleSettings')" v-tooltip="{ content: 'Settings', placement: 'bottom' }"></button>
  </div>
</template>

<script>
import fs from 'fs'
import path from 'upath'

export default {
  data () {
    return {
      consoleStatus: 'Disabled'
    }
  },
  computed: {
    consoleTooltip () {
      return `
        Toggle console in the game<br>
        Shift + O to open
        <br><br>
        Current status: ${this.consoleStatus}
      `
    },
    gameDir () {
      return this.$store.state.files.gameDir
    }
  },
  watch: {
    gameDir (val) {
      if (val) this.getConsoleStatus()
    }
  },
  methods: {
    toggleConsole () {
      let fileContent = this.getConsoleFile()
      if (fileContent) {
        if (fileContent.includes('config.console = True')) {
          fileContent = fileContent.replace('config.console = True', 'config.console = False')
          this.consoleStatus = 'Disabled'
        } else if (fileContent.includes('config.console = False')) {
          fileContent = fileContent.replace('config.console = False', 'config.console = True')
          this.consoleStatus = 'Enabled'
        }

        fs.writeFileSync(path.join(this.$store.state.files.gameDir, 'renpy', 'common', '00console.rpy'), fileContent, 'utf8')
      }
    },
    getConsoleStatus () {
      const fileContent = this.getConsoleFile()
      if (fileContent) {
        this.consoleStatus = fileContent.includes('config.console = True') ? 'Enabled' : 'Disabled'
        return
      }
      this.consoleStatus = 'Unknown'
    },
    getConsoleFile () {
      const consoleFile = path.join(this.$store.state.files.gameDir, 'renpy', 'common', '00console.rpy')
      if (fs.existsSync(consoleFile)) {
        return fs.readFileSync(consoleFile, 'utf8')
      }
      return null
    }
  }
}
</script>


<style lang="scss" scoped>
  .toolbar {
    display: flex;
    grid-row: 2;
    grid-column: 1/3;
    padding: 10px;
    align-items: center;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.45);

    .btn {
      width: 25px;
      height: 25px;
      margin: 0 6px;
      border: none;
      background: none;
      background-size: cover;
      cursor: pointer;
      transition-duration: 0.2s;

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      
      &:not(:disabled):hover {
        transform: translateY(-4px);
      }

      &.open {
        background-image: url('~@/assets/toolbar/open.png');
      }
      &.save {
        background-image: url('~@/assets/toolbar/extract.png');
      }
      &.search {
        background-image: url('~@/assets/toolbar/search.png');
      }
      &.console {
        background-image: url('~@/assets/toolbar/terminal.png');
      }
      &.settings {
        background-image: url('~@/assets/toolbar/settings.png');
        margin-left: auto;
      }
    }

    .separator {
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      height: 100%;
      margin: 0 10px;
    }
  }
</style>

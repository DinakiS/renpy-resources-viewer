<template>
  <div class='titlebar'>
    <div class='title'>Renpy Resources Viewer</div>
    <div class='controls'>
      <!--
      <span class='icon-window-minimize' @click="minimize"></span>
      <span class='icon-window-maximize' @click="maximize"></span>
      <span class='icon-window-close' @click="close"></span>
      -->
      <span class='circle maximize' title='Maximize window' @click="maximize"></span>
      <span class='circle minimize' title='Minimize window' @click="minimize"></span>
      <span class='circle close' title='Close window' @click="close"></span>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  name: 'titlebar',
  data () {
    return {
      w: remote.getCurrentWindow()
    }
  },
  methods: {
    minimize () {
      this.w.minimize()
    },
    maximize () {
      if (this.w.isMaximized()) {
        this.w.unmaximize()
      } else {
        this.w.maximize()
      }
    },
    close () {
      remote.app.quit()
    }
  }
}
</script>

<style lang="scss" scoped>
  .titlebar {
    -webkit-app-region: drag;
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 1;
    padding: 3px;
    font-family: 'Courier New', Courier, monospace;
    text-align: center;
    justify-content: center;
    display: flex;
    align-items: center;
    background-color: rgba(17, 22, 27, 0.9);

    .title {
      font-size: 0.9em;
      color: #b3b3b3;
    }

    .controls {
      position: absolute;
      right: 10px;
      display: flex;
      -webkit-app-region: no-drag;

      .circle {
        display: block;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 50%;
        margin: 0 5px;
        cursor: pointer;
        font-size: 0.8rem;

        &.close {
          background-color: #ff6969;
        }
        &.minimize {
          background-color: #FFD02C;
        }
        &.maximize {
          background-color: #ADE32D;
        }
      }
    }
  }
</style>

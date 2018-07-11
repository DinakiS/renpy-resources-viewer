<template>
  <div class='settings-modal'>
    <div class='settings'>
      <div class="block version">
        <div>App version</div>
        <div>v{{version}} (<a href="https://github.com/DinakiS/renpy-resources-viewer">GitHub</a>)</div>
      </div>
      <div class="block" v-if="!systemPython">
        <div>Python path (in the game folder)</div>
        <input type="text" v-model="pythonPath">
      </div>
      <div class="block">
        <div>Use system python</div>
        <input type="checkbox" v-model="systemPython">
      </div>

      <div class='buttons'>
        <button @click="$store.commit('toggleSettings')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'

export default {
  data () {
    return {
      version: remote.app.getVersion()
    }
  },
  computed: {
    pythonPath: {
      get () {
        return this.$store.state.config.pythonPath
      },
      set (val) {
        this.$store.commit('setPythonPath', val)
      }
    },
    systemPython: {
      get () {
        return !this.$store.state.config.useRenpyPython
      },
      set (val) {
        this.$store.commit('setUseRenpyPython', !val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .settings-modal {
    position: absolute;
    top: 25px;
    width: 500px;
    margin-left: 50%;
    transform: translateX(-50%);
    z-index: 1;

    .overlay {
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      position: absolute;
    }

    .settings {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: auto;
      background-color: rgb(19, 23, 29);
      padding: 15px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
      
      .block {
        display: inline-flex;
        margin-top: 10px;
        width: 100%;

        &.version {
          margin-bottom: 15px;
          a {
            color: #4eb72d;
          }
        }

        div:nth-child(1) {
          margin-right: 15px;
          width: 50%;
          text-align: right;
        }
      }

      .buttons {
        margin-top: 20px;
        align-self: flex-end;

        button {
          background-color: transparent;
          border: 1px solid;
          padding: 5px;
          color: #ffffff;
          border-radius: 2px;
          cursor: pointer;
          font-weight: bold;
        }
      }
    }
  }
</style>

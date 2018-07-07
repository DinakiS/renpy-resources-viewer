<template>
  <div id="app">
    <titlebar id="titlebar"/>
    <toolbar id="toolbar"/>
    <left-menu id="left-menu"></left-menu>
    <page-content id="content"></page-content>
    <log :errors="errors" @hide="showLog = false" v-show="showLog"/>
    <settings v-if="$store.state.config.showSettings"/>
  </div>
</template>

<script>
  import Titlebar from './components/TitleBar.vue'
  import Toolbar from './components/Toolbar.vue'
  import LeftMenu from './components/LeftMenu.vue'
  import PageContent from './components/PageContent.vue'
  import Log from './components/Log.vue'
  import Settings from './components/Settings.vue'

  export default {
    name: 'renpy-reader-electron',
    components: { LeftMenu, PageContent, Titlebar, Toolbar, Log, Settings },
    data () {
      return {
        showLog: false,
        errors: []
      }
    },
    mounted () {
      window.onerror = err => {
        this.errors.push(err)
        this.showLog = true
      }

      this.$store.dispatch('defaultPythonPath')
    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
  }
  ::-webkit-scrollbar {
    background: transparent;
    width: 11px;
    height: 11px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  #app {
    display: grid;
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #28282f;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 25px 45px auto;

    color: #fff;

    #titlebar {
      grid-row: 1;
      grid-column: 1/3;
    }
    #toolbar {
      grid-row: 2;
      grid-column: 1/3;
    }
    #left-menu {
      grid-column: 1;
      grid-row: 3;
    }
    #content {
      grid-column: 2;
      grid-row: 3;
    }
  }

  input {
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.11);
    border: 2px solid #7b7b7b;
    color: #fff;
    border-radius: 5px;
  }
</style>

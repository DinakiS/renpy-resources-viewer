<template>
  <div id="app">
    <titlebar />
    <left-menu></left-menu>
    <page-content></page-content>
  </div>
</template>

<script>
  import LeftMenu from './components/LeftMenu.vue'
  import PageContent from './components/PageContent.vue'
  import Titlebar from './components/TitleBar.vue'

  export default {
    name: 'renpy-reader-electron',
    components: { LeftMenu, PageContent, Titlebar }
  }
</script>

<style>
  body {
    margin: 0;
  }
  #app {
    display: grid;
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #28282f;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 25px auto;

    color: #fff;
  }
</style>

<template>
  <div class="log">
    <div class="close" @click="hide">&times;</div>

    <div v-for="err in errors" :key="err.msg">{{err}}</div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      default: []
    }
  },
  methods: {
    hide () {
      this.$emit('hide')
    }
  }
}
</script>


<style lang="scss" scoped>
  .log {
    grid-row: 3;
    grid-column: 2;
    position: absolute;
    bottom: 0;
    width: calc(100% - 20px);
    padding: 10px;
    min-height: 100px;
    max-height: 400px;
    overflow-y: auto;
    color: #ff6969;
    background-color: #212127;
    box-shadow: 1px -2px 2px rgba(0, 0, 0, 0.3);

    .close {
      position: absolute;
      top: 0;
      right: 5px;
      padding: 5px;
      color: #fff;
      font-weight: bold;
      font-family: monospace;
      font-size: 1.5rem;
      cursor: pointer;
  }
  }
</style>

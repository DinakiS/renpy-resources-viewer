<template>
  <div class='wrap'>
    <button class='selectDir' @click="selectGameDir">Choose game folder</button>
  </div>
</template>

<script>
  export default {
    methods: {
      selectGameDir () {
        this.$store.dispatch('changeGameDir')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }
  button.selectDir {
    background-color: transparent;
    border: 1px solid;
    padding: 15px 20px;
    color: #4eb72d;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      color: #8cec6f;
    }
  }
</style>

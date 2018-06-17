<template>
  <div class='toolbar'>
    <button class='btn open' @click="selectGameDir" title="Select game folder"></button>
    <button class='btn save' @click="extractFile" title="Extract file"></button>
  </div>
</template>

<script>
export default {
  methods: {
    selectGameDir () {
      this.$store.dispatch('changeGameDir')
    },
    extractFile () {
      this.$store.dispatch('extractFile')
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
        background-image: url('~@/assets/toolbar/save.png');
      }
    }
  }
</style>

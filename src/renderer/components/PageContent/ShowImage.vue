<template>
  <div class='img-container'>
    <img :src="'file:///' + file" alt="">
  </div>
</template>

<script>
export default {
  props: ['file']
}
</script>

<style lang="scss" scoped>
  .img-container {
    display: flex;
    height: 100%;

    img {
      display: block;
      margin: auto;
    }
  }
</style>

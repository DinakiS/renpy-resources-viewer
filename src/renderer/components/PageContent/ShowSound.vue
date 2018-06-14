<template>
  <div>
    <audio :src="'file:///' + file" controls autoplay></audio>
  </div>
</template>

<script>
export default {
  props: ['file']
}
</script>

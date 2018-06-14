<template>
  <div>
    <h2 style='font-family: demoFont;'>{{file}}</h2>
  </div>
</template>

<script>
export default {
  props: ['file'],
  watch: {
    file (val) {
      if (val) {
        this.removeCss()
        this.addCss()
      }
    }
  },
  methods: {
    removeCss () {
      document.querySelector('#demoFont').remove()
    },
    addCss () {
      const style = document.createElement('style')
      const css = `
        @font-face {
          font-family: demoFont;
          src: url("file:///${this.file}");
        }
      `

      style.type = 'text/css'
      style.id = 'demoFont'
      style.appendChild(document.createTextNode(css))

      document.head.appendChild(style)
    }
  },
  mounted () {
    this.addCss()
  },
  beforeDestroy () {
    this.removeCss()
  }
}
</script>

<template>
  <div class='show-font'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor diam. Nullam at orci commodo, pulvinar velit at, semper elit.
    Ut porta tincidunt magna, quis commodo elit tristique in. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
    Quisque varius odio faucibus felis varius vulputate. Sed molestie tempor sem, et eleifend ipsum imperdiet vel. Curabitur massa massa, malesuada quis accumsan at,
    eleifend ut erat. Vestibulum nec euismod mi, ac tincidunt leo. Sed nisi nibh, blandit sed dolor varius, dignissim pretium sapien. Praesent in velit tempor, congue ex ac,
    eleifend justo. Pellentesque varius eget mauris vitae laoreet.
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

<style lang="scss" scoped>
  .show-font {
    font-family: demoFont;
    padding: 20px;
    line-height: 1.8rem;
    font-size: 1.5rem;
  }
</style>

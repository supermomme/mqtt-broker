<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
const requireLayoutComponents = require.context(
  './layouts', false, /.\.vue/
)
const LayoutComponents = requireLayoutComponents.keys()
  .map(filename => requireLayoutComponents(filename).default)
export default {
  name: 'App',
  computed: {
    layout () {
      return LayoutComponents.find(component => component.name === this.$route.meta.layout) || 'div'
    }
  }
}
</script>

<style>
</style>

<template>
  <v-app id="inspire">
    <component :is="layout">
      <router-view />
    </component>
    <v-snackbar
      v-model="snackbar"
      bottom
      right
      :color="$store.state.snackbar.color"
    >
      {{ $store.state.snackbar.text }}
    </v-snackbar>
  </v-app>
</template>

<script>
const requireLayoutComponents = require.context(
  '@/layouts', false, /.\.vue/
)
const LayoutComponents = requireLayoutComponents.keys()
  .map(filename => requireLayoutComponents(filename).default)
export default {
  name: 'App',
  computed: {
    layout () {
      return LayoutComponents.find(component => component.name === this.$route.meta.layout) || 'div'
    },
    snackbar: {
      get () {
        return this.$store.getters.isSnackbarOpened
      },
      set (n) {
        if (!n) this.$store.commit('closeSnackbar')
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <v-navigation-drawer
    v-model="sidebarOpened"
    app
    :clipped="$vuetify.breakpoint.lgAndDown"
  >
    <v-list
      dense
      nav
      class="py-0"
    >
      <v-list-item
        link
        @click="$store.commit('openDialog', 'TestDialog')"
      >
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>test</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  computed: {
    sidebarOpened: {
      get () {
        return this.$store.state.sidebarOpened
      },
      set (value) {
        if (this.$store.state.sidebarOpened === value) return
        this.$store.commit('setSidebar', value)
      }
    }
  }
}
</script>

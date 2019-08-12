<template>
  <v-navigation-drawer
    v-model="sidebarOpened"
    app
    :clipped="$vuetify.breakpoint.lgAndUp"
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
          <v-icon>mdi-test-tube</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Test Dialog</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :to="{ name: 'Dashboard' }"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        :to="{ name: 'UserList' }"
      >
        <v-list-item-icon>
          <v-icon>mdi-account-group</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Benutzer</v-list-item-title>
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

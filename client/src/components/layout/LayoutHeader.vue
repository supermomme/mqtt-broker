<template>
  <v-app-bar
    color="deep-purple accent-4"
    dark
    app
    :clipped-left="$vuetify.breakpoint.lgAndUp"
  >
    <v-app-bar-nav-icon @click="toggleSidebar()" />

    <v-toolbar-title>MQTT Broker</v-toolbar-title>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          @click="() => {}"
        >
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu
      v-if="me"
      :close-on-content-click="false"
      :nudge-width="200"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-avatar
            color="deep-purple accent-3"
          >
            <template v-if="me.avatarUrl">
              <img
                :src="me.avatarUrl"
                :alt="me.firstname + ' ' + me.lastname"
              >
            </template>
            <template v-else>
              {{ me.firstname[0] }}{{ me.lastname[0] }}
            </template>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar
              size="48"
              color="grey lighten-2"
            >
              <template v-if="me.avatarUrl">
                <img
                  :src="me.avatarUrl"
                  :alt="me.firstname + ' ' + me.lastname"
                >
              </template>
              <template v-else>
                {{ me.firstname[0] }}{{ me.lastname[0] }}
              </template>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ me.firstname }} {{ me.lastname }}</v-list-item-title>
              <v-list-item-subtitle>{{ me.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="logout"
          >
            Ausloggen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    me () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    ...mapMutations([
      'toggleSidebar'
    ]),
    async logout () {
      await this.$store.dispatch('auth/logout')
      await this.$router.push({ name: 'Login' })
    }
  }
}
</script>

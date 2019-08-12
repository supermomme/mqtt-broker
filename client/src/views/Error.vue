<template>
  <v-card
    width="250"
    raised
  >
    <v-card-title>Fehler {{ code }}</v-card-title>

    <v-card-text>{{ message }}</v-card-text>
    <v-card-actions>
      <v-btn
        text
        @click="back()"
      >
        Zurück zum {{ backText }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Error',
  computed: {
    code () {
      return this.$route.params.errorCode
    },
    message () {
      switch (this.code) {
        case '404':
          return 'Seite nicht gefunden!'

        default:
          return 'Unbekannter Fehler!'
      }
    },
    backText () {
      return this.$store.state.auth.user ? 'Dashboard' : 'Login'
    }
  },
  methods: {
    back () {
      this.$router.push({ name: this.$store.state.auth.user ? 'Dashboard' : 'Login' })
    }
  }
}
</script>

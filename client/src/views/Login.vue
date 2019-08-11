<template>
  <v-flex
    xs12
    sm8
    md4
  >
    <v-card class="elevation-12">
      <v-toolbar
        color="primary"
        dark
        flat
      >
        <v-toolbar-title>Login</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="username"
            label="Benutzername"
            name="username"
            prepend-icon="mdi-account"
            type="text"
            @keyup.enter="login()"
          />

          <v-text-field
            v-model="password"
            label="Password"
            name="password"
            prepend-icon="mdi-lock"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @keyup.enter="login()"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          large
          @click="login()"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    username: '',
    password: '',
    showPassword: false
  }),
  methods: {
    async login () {
      if (this.username !== '' && this.password !== '') {
        try {
          await this.$store.dispatch('auth/authenticate', {
            strategy: 'local',
            username: this.username,
            password: this.password
          })
          await this.$router.push({ name: 'Dashboard' })
        } catch (error) {
          if ((error.code === 401 && error.message === 'Invalid login') || error.code === 403) {
            this.$store.commit('openSnackbar', { color: 'error', text: 'Der Benutzername oder das Passwort ist falsch!' })
          } else {
            this.$store.commit('openSnackbar', { color: 'error', text: 'Ein Unerwarteter Fehler ist aufgetreten!' })
            console.error(error)
          }
        }
      } else {
        this.$store.commit('openSnackbar', { color: 'warning', text: 'Nicht alle Felder sind ausgefüllt!' })
      }
    }
  }
}
</script>

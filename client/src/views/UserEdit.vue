<template>
  <v-layout
    wrap
    column
  >
    <v-flex pa-1>
      <v-card>
        <v-layout
          align-center
        >
          <v-flex>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline mb-0">
                  Benutzer {{ $route.meta.isCreate ? 'Erstellen' : 'Bearbeiten' }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <basic-breadcrumbs :items="breadcrumb" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-flex>
          <v-flex shrink>
            <v-btn
              v-if="$route.meta.isCreate"
              color="error"
              class="mr-2"
              @click="reset"
            >
              Zurücksetzen
            </v-btn>
            <v-btn
              color="success"
              class="mr-4"
              @click="save"
            >
              {{ $route.meta.isCreate ? 'Erstellen' : 'Speichern' }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider />
        <v-container v-if="!$store.state.isLoading">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <v-layout :column="$vuetify.breakpoint.mdAndDown">
              <v-flex>
                <v-text-field
                  v-model="user.firstname"
                  label="Vorname"
                  :rules="[rules.required]"
                />
              </v-flex>

              <v-flex>
                <v-text-field
                  v-model="user.lastname"
                  label="Lastname"
                  :rules="[rules.required]"
                />
              </v-flex>
            </v-layout>
            <v-layout :column="$vuetify.breakpoint.mdAndDown">
              <v-flex>
                <v-text-field
                  v-model="user.username"
                  :rules="[rules.required]"
                  label="Benutzername"
                />
              </v-flex>
              <v-flex>
                <v-text-field
                  v-model="user.email"
                  :rules="[rules.emailOrNothing]"
                  label="E-mail"
                />
              </v-flex>
            </v-layout>
            <v-layout :column="$vuetify.breakpoint.mdAndDown">
              <v-flex>
                <v-select
                  v-model="user.role"
                  :items="roleOptions"
                  label="Rolle"
                />
              </v-flex>
            </v-layout>
            <v-layout :column="$vuetify.breakpoint.mdAndDown">
              <v-flex>
                <v-text-field
                  v-model="user.password"
                  :rules="[rules.requiredIfCreate]"
                  label="Neues Passwort"
                />
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex pa-1>
      <dev
        :data="{user}"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import BasicBreadcrumbs from '@/components/BasicComponents/BasicBreadcrumbs'
import Dev from '@/components/Dev'
export default {
  name: 'UserList',
  components: {
    BasicBreadcrumbs,
    Dev
  },
  data: () => ({
    roleOptions: [
      { text: 'Administator', value: 'ADMIN' },
      { text: 'MQTT-Benutzer', value: 'USER' }
    ],
    user: null,
    isFormValid: false,
    fields: [
      { text: 'Benutzername', value: 'username' },
      { text: 'Vorname', value: 'firstname' },
      { text: 'Nachname', value: 'lastname' },
      { text: 'email', value: 'email' }
    ]
  }),
  computed: {
    rules () {
      return {
        required: value => !!value || 'Das Feld ist benötigt!',
        requiredIfCreate: value => {
          if (this.$route.meta.isCreate) return (!!value) || 'Das Feld ist benötigt!'
          else return true
        },
        emailOrNothing: value => {
          if (!value || value.length === 0) return true
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Diese E-Mail ist nicht gültig.'
        }
      }
    },
    breadcrumb () {
      return [
        { text: 'Dashboard', to: { name: 'Dashboard' } },
        { text: 'Benutzer', to: { name: 'UserList' } },
        { text: this.$route.meta.isCreate ? 'Erstellen' : 'Bearbeiten' }
      ]
    }
  },
  watch: {
    '$route': {
      handler: 'fetchData',
      immediate: true
    }
  },
  methods: {
    async save () {
      try {
        this.$refs.form.validate()
        if (!this.isFormValid) return
        if (this.user.password === '') delete this.user.password
        if (this.$route.meta.isCreate) {
          await this.user.create()
        } else {
          await this.user.save()
        }
      } catch (error) {
        if (error.code === 409) {
          let errors = Object.keys(error.errors)
          let text = `${errors} existier${errors.length === 1 ? 't' : 'en'} schon`
          this.$store.commit('openSnackbar', { color: 'error', text })
        } else {
          this.$store.commit('openSnackbar', { color: 'error', text: 'Ein Unerwarteter Fehler ist aufgetreten!' })
          console.error(error)
        }
      }
    },
    async reset () {
      this.user.reset()
    },
    async fetchData () {
      try {
        await this.$store.commit('setLoading', true)
        if (this.$route.meta.isCreate) {
          this.user = new this.$FeathersVuex.User()
        } else {
          this.user = (await this.$store.dispatch('user/get', this.$route.params.userId)).clone()
        }
      } catch (error) {
        if (error.code.toString()[0] === '4') this.$router.push({ name: 'Error', params: { errorCode: '404' } })
        else {
          this.$store.commit('openSnackbar', { color: 'error', text: 'Ein Unerwarteter Fehler ist aufgetreten!' })
          console.error(error)
        }
      } finally {
        await this.$store.commit('setLoading', false)
      }
    }
  }
}
</script>

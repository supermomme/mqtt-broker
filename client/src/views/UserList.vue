<template>
  <v-layout column>
    <v-flex>
      <v-card>
        <v-layout
          align-center
        >
          <v-flex>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline mb-0">
                  Benutzer
                </v-list-item-title>
                <v-list-item-subtitle>
                  <basic-breadcrumbs :items="breadcrumb" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-flex>
          <v-flex shrink>
            <v-btn
              color="primary"
              class="mr-4"
              :to="{ name: 'UserCreate' }"
            >
              Erstellen
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider />
        <v-container>
          <basic-table
            :fields="fields"
            service="user"
            @rowClicked="$router.push({ name: 'UserEdit', params: { userId: $event._id }})"
          />
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import BasicTable from '@/components/BasicComponents/BasicTable.vue'
import BasicBreadcrumbs from '@/components/BasicComponents/BasicBreadcrumbs.vue'
export default {
  name: 'UserList',
  components: {
    BasicTable,
    BasicBreadcrumbs
  },
  data: () => ({
    breadcrumb: [
      { text: 'Dashboard', to: { name: 'Dashboard' } },
      { text: 'Benutzer', to: { name: 'UserList' } }
    ],
    fields: [
      { text: 'Benutzername', value: 'username' },
      { text: 'Vorname', value: 'firstname' },
      { text: 'Nachname', value: 'lastname' },
      { text: 'email', value: 'email' }
    ]
  })
}
</script>

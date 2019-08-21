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
                  Clients
                </v-list-item-title>
                <v-list-item-subtitle>
                  <basic-breadcrumbs :items="breadcrumb" />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-flex>
        </v-layout>
        <v-divider />
        <v-container>
          <basic-table
            :fields="fields"
            service="retained-message"
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
  name: 'ClientList',
  components: {
    BasicTable,
    BasicBreadcrumbs
  },
  data: () => ({
    breadcrumb: [
      { text: 'Dashboard', to: { name: 'Dashboard' } },
      { text: 'Retained', to: { name: 'ClientList' } }
    ],
    fields: [
      { text: 'Topic', value: 'topic' },
      { text: 'Payload', value: 'payload' }
    ]
  })
}
</script>

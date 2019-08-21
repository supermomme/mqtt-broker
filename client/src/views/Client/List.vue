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
          <v-data-iterator
            :items="data"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            hide-default-footer
          >
            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item._id"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                >
                  <v-card>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="headline font-weight-bold">
                          {{ item.clientId }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider />

                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content>Status:</v-list-item-content>
                        <v-list-item-content
                          class="align-end"
                          :class="statusClass(item.status)"
                        >
                          {{ status(item.status) }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>Last User:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.user.username }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>Bytes send:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.totalStats.bytesSend }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>Bytes recieved:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.totalStats.bytesRecieved }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>Messages send:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.totalStats.messagesSend }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-content>Messages recieved:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.totalStats.messagesRecieved }}
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-group
                        v-model="subActive"
                        no-action
                      >
                        <template v-slot:activator>
                          <v-list-item-content>
                            Subscriptions:
                          </v-list-item-content>
                        </template>

                        <v-list-item
                          v-for="subItem in item.subscriptions"
                          :key="subItem._id"
                        >
                          <v-list-item-content>
                            <v-list-item-title v-text="subItem.topic" />
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-group>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <v-row
                class="mt-2"
                align="center"
                justify="center"
              >
                <div class="flex-grow-1" />

                <span class="mr-4 grey--text">
                  Page {{ page }} of {{ Math.ceil(total / itemsPerPage) }}
                </span>
                <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="mr-1"
                  @click="previosPage"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="ml-1 mr-3"
                  @click="nextPage"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import BasicBreadcrumbs from '@/components/BasicComponents/BasicBreadcrumbs.vue'
export default {
  name: 'ClientList',
  components: {
    BasicBreadcrumbs
  },
  data: () => ({
    subActive: false,
    loading: true,
    page: 1,
    itemsPerPage: 3,
    total: 0,
    breadcrumb: [
      { text: 'Dashboard', to: { name: 'Dashboard' } },
      { text: 'Clients', to: { name: 'ClientList' } }
    ]
  }),
  computed: {
    status () {
      return (value) => {
        switch (value) {
          case 'CONNECTED':
            return 'Connected'
          case 'DISCONNECTED':
            return 'Disconnected'

          default:
            return ''
        }
      }
    },
    statusClass () {
      return (value) => {
        switch (value) {
          case 'CONNECTED':
            return 'green--text'
          case 'DISCONNECTED':
            return 'red--text'

          default:
            return 'white--text'
        }
      }
    },
    data () {
      let response = this.$store.getters[`client/find`]({ query: this.query }).data
      return response
    },
    query () {
      let query = {
        $limit: this.itemsPerPage,
        $skip: (this.page - 1) * this.itemsPerPage
      }
      return query
    }
  },
  watch: {
    '$route': {
      handler: 'fetchData',
      immediate: true
    },
    'query': 'fetchData'
  },
  methods: {
    previosPage () {
      if (this.page > 1) this.page--
    },
    nextPage () {
      if (this.page < Math.ceil(this.total / this.itemsPerPage)) this.page++
    },
    async fetchData () {
      try {
        this.loading = true
        let res = await this.$store.dispatch(`client/find`, { query: this.query })
        this.total = res.total
      } catch (error) {
        console.error(error)
        this.$store.commit('openSnackbar', { color: 'error', text: 'Ein Unerwarteter Fehler ist aufgetreten!' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

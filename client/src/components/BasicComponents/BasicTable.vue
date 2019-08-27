<template>
  <v-layout column>
    <v-flex>
      <v-data-table
        :headers="fields"
        :page.sync="page"
        :items="data"
        :items-per-page.sync="itemsPerPage"
        :loading="loading"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :server-items-length="total"
        :footer-props="{
          'disable-items-per-page': true
        }"
        @click:row="$emit('rowClicked', $event)"
      >
        <template
          v-for="field in formattedFields"
          :slot="'item.'+field.value"
          scope="{ item }"
        >
          <span :key="field.value">{{ field.formatter(item[field.value]) }}</span>
        </template>
      </v-data-table>
    </v-flex>
    <v-flex><dev :data="{data}" /></v-flex>
  </v-layout>
</template>

<script>
import Dev from '@/components/Dev'
export default {
  name: 'BasicTable',
  components: {
    Dev
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    service: {
      type: String,
      required: true
    },
    toName: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: true,
    page: 1,
    itemsPerPage: 15,
    sortBy: [],
    sortDesc: [],
    total: 0
  }),
  computed: {
    formattedFields () {
      return this.fields.filter(v => !!v.formatter)
    },
    data () {
      let response = this.$store.getters[`${this.service}/find`]({ query: this.query })
      return response.data
    },
    query () {
      let query = {
        $limit: this.itemsPerPage,
        $skip: (this.page - 1) * this.itemsPerPage
      }
      if (this.sortBy.length !== 0) {
        query.$sort = {}
        for (let i = 0; i < this.sortBy.length; i++) {
          query.$sort[this.sortBy[i]] = this.sortDesc[i] ? 1 : -1
        }
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
    async fetchData () {
      console.log('fetch')
      try {
        this.loading = true
        let res = await this.$store.dispatch(`${this.service}/find`, { query: this.query })
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

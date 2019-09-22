<template>
  <section class="container">
    <h1>Dashboard</h1>
    <query-builder
      :cubejs-api="cubejsApi"
      :query="query"
    >
      <template v-slot="{ timeDimensions, resultSet }">
        <cube-commit-heatmap :result-set="resultSet" />
      </template>
    </query-builder>
  </section>
</template>

<script>
import { QueryBuilder } from '@cubejs-client/vue'

import cubejsApi from '@/cubejs'
import CubeCommitHeatmap from '@/components/cubejs/CubeCommitHeatmap.vue'

export default {
  name: 'Home',
  components: {
    QueryBuilder,
    CubeCommitHeatmap
  },
  data () {
    return {
      cubejsApi,
      query: {
        'measures': [
          'Messages.dd'
        ],
        'timeDimensions': [
          {
            "dimension": "Messages.createdat",
            "granularity": "hour"
          }
        ],
        'filters': [
          {
            "dimension": "Messages.topic",
            "operator": "equals",
            "values": [
              "barne/solar/I"
            ]
          }
        ]
      }
    }
  }

}
</script>

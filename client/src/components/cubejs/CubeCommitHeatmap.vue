<template>
  <div>
    <vuejs-heatmap
      :entries="entries"
      tooltip-unit="commit"
      :color-range="['#eee', '#3f616f']"
      :max="90"
    />
  </div>
</template>

<script>
import VuejsHeatmap from 'vuejs-heatmap'
import dayjs from 'dayjs'

export default {
  components: {
    VuejsHeatmap
  },
  props: ['resultSet'],
  computed: {
    entries () {
      if (!this.resultSet) {
        return []
      }
      return this.resultSet.loadResponse.data.map(day => {
        return {
          'created_at': dayjs(day['Commit.commitAuthorDate']).format('YYYY-MM-DD'),
          'counting': day['Commit.count']
        }
      })
    }
  }
}
</script>

<style>
.vuejs-heatmap .calendar-heatmap {
  overflow: visible
}
</style>

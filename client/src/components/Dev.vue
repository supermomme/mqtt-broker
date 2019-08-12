<template>
  <v-card>
    <v-card-title>Development Information</v-card-title>
    <v-card-text max-width="300">
      <details
        v-for="(item, key) in data"
        :key="key"
      >
        <summary>{{ key }}</summary>
        <pre>{{ item }}</pre>
      </details>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Dev',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

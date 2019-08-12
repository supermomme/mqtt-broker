<template>
  <v-breadcrumbs
    class="py-0 px-0"
    :items="items"
  >
    <template v-slot:divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
    <template v-slot:item="props">
      <v-breadcrumbs-item
        :to="props.item.to"
        exact
      >
        {{ props.item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'BasicBreadcrumbs',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

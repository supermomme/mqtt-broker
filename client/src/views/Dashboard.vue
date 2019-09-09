<template>
  <div @click="clikc">
    dashboard
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  methods: {
    clikc () {
      console.log(this.$cube)
    }
  }
}
</script>

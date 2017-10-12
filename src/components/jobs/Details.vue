<template>
  <div class="hello">
    <h2>Job {{id}} Details</h2>
  </div>
</template>

<script>
export default {
  name: 'job-details',

  props: ['id'],

  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
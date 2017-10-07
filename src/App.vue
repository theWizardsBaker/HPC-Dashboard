<template>
  <v-app toolbar dark>
    <main-nav :showDrawer="drawer" />
    <v-toolbar dark fixed>
      <v-btn flat @click.stop="drawer = !drawer">
        <v-icon left dark medium>fa-bars</v-icon> Menu
      </v-btn>
    </v-toolbar>
    <main>
      <v-container fluid >
        <v-flex xs12>
          <router-view></router-view>
        </v-flex>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import Nav from '@/components/navigation/MainNav'
export default {
  name: 'app',
  components: { mainNav: Nav },
  data(){
    return {
      drawer: true
    }
  }
}
</script>

<style>

</style>

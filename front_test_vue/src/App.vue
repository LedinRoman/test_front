<template>
<v-app
    id="app"
  >
    <notifications />
    <v-main>
      <CustomerList />
    </v-main>
  </v-app>
</template>

<script>
import CustomerList from './components/CustomersList.vue';

export default {
  name: 'App',
  components: {
    CustomerList,
  },
};
</script>

<style lang="scss">
@import '~@/assets/scss/main.scss';
</style>

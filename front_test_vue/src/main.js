import Vue from 'vue';
import App from './App.vue';

import vuetify from './plugins/vuetify/vuetify';
import vueAxios from './plugins/axios/axios';

Vue.config.productionTip = false;
new Vue({
  vuetify,
  vueAxios,
  render: (h) => h(App),
}).$mount('#app');

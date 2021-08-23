import Vue from 'vue';
import Vuetify from 'vuetify';
import Notifications from 'vue-notification';

import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);
Vue.use(Notifications);

export default new Vuetify({
  theme: {
    dark: (() => false
    // if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {

    // }
    // return window.matchMedia('(prefers-color-scheme: dark)').matches;

    )(),
  },
  icons: {
    iconfont: 'mdi',
  },
});

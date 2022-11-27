import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
//import JsonCSV from 'vue-json-csv'

// Import Bootstrap an BootstrapVue CSS files (order is important)


// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

//Vue.use(JsonCSV)

import './assets/scss/app.scss'
//import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false


Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('YYYY-MM-DD HH:mm:ss');
  }
})

Vue.filter("formatNumber", function (value) {
  if (!value) {
    value = 0
  }
 const decimals = 2;

  value = value * 100
  value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
  value = value + '%'
  return value
});

Vue.mixin({
  methods: {
    getImage(object) {
      var tmp = ""
      try {
          tmp = object.type + '';
      } catch (error) {
          tmp = object['subtype'] + '';
      }
      if (tmp+''.startsWith("SA")) {
          return require("@/assets/img/galaxy.jpg")
      }
      return require("@/assets/img/all.jpeg")
  },
  },
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

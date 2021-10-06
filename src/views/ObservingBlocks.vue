<template>
  <div class="home">
    <TopNav/>
    <b-container fluid="md" class="p-1">
      <b-row align-content="center">
        <b-col cols="4" offset="4">
          <h2> Observing Blocks </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12" order-md="1" order-sm="2"  order="2">
          <div style="">
            <ul class="list-unstyled h-75" style="display: flex; flex-direction: column;">
              <PetitionList />
            </ul>
          </div>
        </b-col>
        <b-col md="5" offset-md="1" offset-sm="1" sm="10" order-sm="1" order-xs="1" class="rounded p-3 text-center" style="background-color:#6ABEA7">
          <div>
            <b-calendar v-model="value" :date-info-fn="dateClass" locale="en"></b-calendar>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
  
</template>

<script>

import TopNav from '@/components/TopNav.vue'
import PetitionList from '@/components/PetitionList.vue'

export default {
    components: {
      TopNav,
      PetitionList
    },
    data() {
      return {
      }
    },
    methods: {
      dateClass(ymd, date) {
        const day = date.getDate()
        return day >= 10 && day <= 20 ? 'table-info' : ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

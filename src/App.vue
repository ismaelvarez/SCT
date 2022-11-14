<template>
    <div id="app">
      <div id="nav">
        <SideNav v-if="showNav"></SideNav>
        <router-view/>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import SideNav from '@/components/SideNav'
export default {
  components: {
    SideNav
  },
  computed: {
    ...mapState(['userProfile']),
    showNav() {
      return Object.keys(this.userProfile).length > 1 || localStorage.getItem("user") != null
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");

* {
  font-family: "Quicksand", sans-serif;
}
.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}
.link-light {
  color: #fff;
}
</style>
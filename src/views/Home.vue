<template>
  <div class="home">
    <TopNav/>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import TopNav from '@/components/TopNav.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    TopNav
  }
}
</script>

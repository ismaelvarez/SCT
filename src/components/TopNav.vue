<template>
<div class="w-100">
  <b-navbar type="dark" variant="info" class="w-100">

    
    <b-button v-b-toggle.sidebar class="m-2">
        <b-icon-list></b-icon-list>
    </b-button>

    <b-navbar-brand href="#">
        <b-container>
            <b-row>
                <b-col cols="3">
                    <img src="@/assets/img/gtc_logo.png" class="img-fluid rounded-sm rounded-circle w-100"/>
                </b-col>
                
                <b-col cols="3">
                    <h3 class="align-middle" style="margin-top:15px;margin-bottom:auto">SCT</h3>
                </b-col>
            </b-row>
        </b-container>
    </b-navbar-brand>
    <div class="text-align:right">
        <p>Welcome, SCTMASTER</p>
    </div>
  </b-navbar>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
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

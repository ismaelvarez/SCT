<template>
  <header>
    <section>
      <div>
        <b-sidebar id="sidebar" title="SCT" no-header shadow backdrop visible width="260px">
          <template #default="{ hide }">
            <b-container class="p-4">
              <b-row>
                <b-col cols="2">
                  <b-button size="sm" @click="hide" style="margin-top:15px;margin-bottom:auto"><b-icon-list></b-icon-list></b-button>
                </b-col>
                <b-col cols="4" offset="1">
                  <img src="@/assets/img/gtc_logo.png" class="img-fluid rounded-sm rounded-circle w-100"/>
                </b-col>
                <b-col cols="4" class="align-middle" >
                  <h3 id="sidebar" class="align-middle" style="margin-top:15px;margin-bottom:auto">SCT</h3>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <h5 id="sidebar" class="align-middle" style="margin-top:15px;margin-bottom:auto">Small Canary Telescope</h5>
                </b-col>
              </b-row>
              <hr/>
              <b-row class="mb-3">
                <b-col align="left">
                  <b-nav vertical align="start" class="w-100">
                    <li class="nav-item" v-if="telemetry">
                      <router-link to="/">Telemetry</router-link>
                    </li>
                    <li class="nav-item" v-if="history">
                      <router-link to="/">Observation History</router-link>
                    </li>
                    <li class="nav-item" v-if="blocks">
                      <router-link to="/blocks">Observation Blocks</router-link>
                    </li>
                    
                    <li class="nav-item" v-if="petition">
                      <router-link to="/petition">Observing Petition</router-link>
                    </li>
                    
                    <li class="nav-item" v-if="optics">
                      <router-link to="/optics">Telescope Optics</router-link>
                    </li>
                  </b-nav>
                </b-col>
              </b-row>
            </b-container>
          </template>
          <template #footer="{  }"> 
            <b-container>
              <b-row class="d-flex bg-dark text-light align-items-center px-3 py-2 justify-content-md-center">
                <b-col cols="6">
                  <b-button size="md" @click="logout()">Log Out</b-button>
                </b-col>             
              </b-row>
            </b-container>
            </template>
        </b-sidebar>
      </div>
    </section>
  </header>
</template>

<script>

export default {
  data() {
    return {
      telemetry: false,
      history : false,
      blocks : false,
      petition : true,
      optics : false
    }
  },
  mounted() {
    const role = JSON.parse(localStorage.getItem("user")).role;
    if (role == 'sctmaster') {
      this.telemetry = true;
      this.history = true;
      this.blocks = true;
      this.optics = true;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
    }
  }
}
</script>
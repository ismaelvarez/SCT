<template>
  <div>
    <b-container class="bv-example-row" style="margin-top:150px">
      <b-overlay :show="loading" rounded="sm">
        <b-form @submit="login" @reset="onReset" v-if="show">
          <b-row>
            <b-col class="text-center">
              <h1>SCT - Small Canary Telescope</h1>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="3" offset="1">
              <img class="img-fluid rounded-sm rounded-circle w-100" src="@/assets/img/gtc_logo.png"/>
            </b-col>
            <b-col cols="5" offset="1">
              <b-row style="margin-top:40px">
                <b-col>
                  <b-form-group id="input-group-1" label="Email address:" label-for="input-1">
                    <b-form-input
                      id="input-1"
                      v-model="form.email"
                      type="email"
                      placeholder="Enter email"
                      required>
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group id="input-group-2" label="Password" label-for="input-2">
                    <b-form-input
                      type="password"
                      id="input-2"
                      v-model="form.password"
                      placeholder="Enter password"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row style="margin-top:50px">
                <b-col class="text-center">
                  <b-button type="submit" :disabled="loading" squared variant="primary">Log in</b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          
        
          <b-row v-if="error.show">
            <b-col class="text-center mt-5">
              <b-alert show variant="danger">{{ error.message }}</b-alert>
            </b-col>
          </b-row>
        </b-form>
      </b-overlay>
    </b-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        error: {
          show : false,
          message : ""
        },
        show: true,
        loading : false
      }
    },
    methods: {
      login(event) {
        this.loading = true;
        this.$store.dispatch('login', {
          email: this.form.email,
          password: this.form.password
        }).then(() => {

        }).catch((error) => {
            this.error.message = error;
            this.error.show = true;
        }).finally(()=> {
          this.loading = false;
        })
        event.preventDefault()
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.password = ''
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
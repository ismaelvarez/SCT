<template>
  <div class="home">
    <TopNav/>

    <b-container fluid="md" class="p-5">
      <b-row align-content="center" class="justify-content-md-center text-center">
        <b-col md="4" sm="12" >
          <h2> Telescope Optics </h2>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center optics-container">
        <b-col md="6" sm="12" order-md="1" order-sm="2">
          <h3>Optics list</h3>
          <div class="overflow-auto" style="max-height: 600px">
            <ul class="list-unstyled">
              <OpticList/>
            </ul>
          </div>
        </b-col>
        <b-col md="4" offset-md="1" offset-sm="1" sm="10" order-sm="1">
            <h3>New Optic</h3>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show"  class="mt-5">
              <b-form-group id="input-group-1" label="Optic name:" 
                label-for="name">
                    <b-form-input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    placeholder="Optic name"
                    required
                    ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2" label="Object Type:" 
                label-for="optic-type">
                    <b-form-select
                    id="optic-type"
                    v-model="formData.type"
                    :options="types"
                    required
                    ></b-form-select>
              </b-form-group>

              <b-form-group id="input-group-3" class="mt-2" :label="formData.type == 'barlow' ? 'Magnification' : 'Diameter'"
                  label-for="misc-number">
                    <b-form-input
                    id="misc-number"
                    v-model="formData.magnitude"
                    type="text"
                    required
                    ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Optic description:" label-for="description">
                    <b-form-textarea
                      id="description"
                      v-model="formData.description"
                      placeholder="Description..."
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                </b-form-group>
                <div class="mt-3 text-center">
                  <b-button type="submit" variant="primary" >Submit</b-button>
                  <b-button type="reset" variant="danger" class="m-2">Reset</b-button>
                </div>
            </b-form>
            <div v-if="error.show">
              <b-alert show variant="danger">{{ error.message }}</b-alert>
            </div>
        </b-col>
      </b-row>
      
    </b-container>
  </div>
</template>

<script>

import TopNav from '@/components/TopNav.vue'
import OpticList from '@/components/OpticList.vue'
export default {
    components: {
      TopNav,
      OpticList
    },
    data() {
      return {
        formData: {
          name: null,
          type : null,
          magnitude: null,
          description : ''
        },
        optics : [],
        error : {
          message : "",
          show : false
        },
        miscLabel : "Magnification",
        types: [{ text: 'Select One', value: null }, {text : 'Barlow', value : 'Barlow'}, {text : 'Eyepiece', value : 'Eyepiece'}, 'Filter'],
        show: true
      }
    },
    methods: {
      onSubmit(event) {
        event.preventDefault()
        this.$store.dispatch('addOptics', this.formData).then(() => {
            
        }).catch((error) => {
            this.error.message = error;
            this.error.show = true;
        }).finally(()=> {
          this.show = true;
          this.optics.push(this.formData)
          this.onReset(event)
        })
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.formData.name = ''
        this.formData.magnitude = null
        this.formData.description = null
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
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

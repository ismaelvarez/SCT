<template>
  <div class="home">
    <TopNav/>
    <b-container fluid="md" class="p-1">
      <b-row align-content="center">
        <b-col cols="4" offset="4">
          <h2> New observing petition </h2>
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
        <b-col md="5" offset-md="1" offset-sm="1" sm="10" order-sm="1" order-xs="1" class="rounded p-3" style="background-color:#6ABEA7">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-overlay :show="overlay" rounded="sm">
              <b-form-group id="ig1" label="Search:"  
                label-for="name" label-class="font-weight-bold pt-0"
              >
                <b-container>
                  <b-row>
                    <b-col cols="10">
                      <b-form-input
                        id="name"
                        v-model="simbad.name"
                        type="text"
                      ></b-form-input>
                    </b-col>
                    <b-col cols="2">
                      <b-button variant="primary" id="show-btn" class="rounded" @click="search" pill> <b-icon icon="search"></b-icon></b-button>
                    </b-col>
                  </b-row>
                </b-container>
              </b-form-group>
            </b-overlay>

            <b-container v-if="formData.object" class="rounded p-3" style="background-color: white">
              <b-row>
                <b-col class="text-center">
                  <h6 class="font-weight-bold mt-0" > Object Data </h6>
                  <hr/>
                </b-col>
                <b-col cols="2">
                  <b-button variant="danger" id="show-btn" pill class="delete-object" @click="deleteObject()"><b-icon icon="trash"></b-icon></b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">Name: </p>
                </b-col>
                <b-col>
                  {{ formData.object.name }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">Type: </p>
                </b-col>
                <b-col>
                  {{ formData.object.subtype }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">RA:  </p>
                </b-col>
                <b-col>
                  {{ formData.object.ra }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">DEC: </p>
                </b-col>
                <b-col>
                  {{ formData.object.dec }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">Magnitude:  </p>
                </b-col>
                <b-col>
                  {{ formData.object.magnitude }}
                </b-col>
              </b-row>
            </b-container>

            <b-alert v-if="simbad.error" show variant="danger"> {{ simbad.error }}</b-alert>

            <hr/>

            <b-form-group id="input-group-2" label="Observation Description:"
              label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                <b-form-textarea
                  id="textarea"
                  v-model="formData.description"
                  placeholder="Enter something..."
                  rows="3"
                  max-rows="6"
                  required
                ></b-form-textarea>
            </b-form-group>

            <hr/>

            <div class="mt-1" style="display:inline">
              <b-row align-v="center">
                <b-col cols="10">
                  <h6 class="m-0 font-weight-bold">Telescope Optics:</h6>
                </b-col>
                <b-col>
                  <b-button variant="success" id="show-btn" pill @click="showModal"><b-icon icon="plus-circle"></b-icon></b-button>
                </b-col>
              </b-row>
            </div>

            <div style="min-height:100px; overflow:auto;" class="mt-1 observing-petition-optics rounded p-1">
              <ul class="list-unstyled w-75" style=" margin:auto">
                  <b-media v-for="optic in selectedOptics" :key="optic.id" v-bind:id="optic.id" :ref="optic.id" class=""  tag="li" style="display:inline" vertical-align="center">
                    <OpticItem :optic="optic"/>
                    <b-button variant="danger" id="show-btn" pill class="delete-optic" @click="deleteOptic(optic)"><b-icon icon="trash"></b-icon></b-button>

                  </b-media>
              </ul>
            </div>
              
            <div class="mt-3  text-center">
              <b-button type="submit" variant="primary">Submit</b-button>
              <b-button type="reset" variant="danger" class="m-2">Reset</b-button>
            </div>
            <div class="mt-3  text-center" v-if="error.show">
              <b-alert show variant="danger">{{ error.message }}</b-alert>
            </div>
          </b-form>
        </b-col>
      </b-row>
    </b-container>

    <div class="w-100">
          <b-modal ref="optics-modal" id="lloremos" size="lg" title="Extra Large Modal"  @ok="handleOk" @hide="hideModal">
            <b-container fluid>
              <b-row class="justify-content-md-center optics-container">
                <b-col md="12" sm="12" order-md="1" order-sm="2">
                  <h3>Optics list</h3>
                  <div>
                    <ul class="list-unstyled">
                      <OpticList @opticSelected="onOpticSelected($event)" @onOpticUnselected="onOpticUnselected($event)"/>
                    </ul>
                  </div>
                </b-col>
              </b-row>
            </b-container>
            
          </b-modal>
        </div>
  </div>
  
</template>

<script>

import TopNav from '@/components/TopNav.vue'
import OpticList from '@/components/OpticList.vue'
import PetitionList from '@/components/PetitionList.vue'
import OpticItem from '@/components/OpticItem.vue'
import {SimbadAPI} from '@/axios/SimbadAPI';

export default {
    components: {
      TopNav,
      OpticList,
      OpticItem,
      PetitionList
    },
    data() {
      return {
        formData: {
          description: '',
          object : null,
          name : null
        },
        simbad : {
          name : null,
          error : null
        },
        show: true,
        selectedOptics : [],
        opticsTmp : [],
        overlay : false,
        error : {
          show : false,
          message : ''
        }
      }
    },
    methods: {
      search() {
        if (this.simbad.name != null && this.simbad.name.length > 0) {
          const apiService = new SimbadAPI();
          
          this.overlay = true;
          const object = apiService.getObject(this.simbad.name);
          object
          .then(result => {
            const status = result.status;
              if (status == 200) {
                this.formData.object = result.data
                this.simbad.error = null
              } else if (status == 204) {
                this.formData.object = null
                this.simbad.error = "No objects with name " + this.simbad.name
              }
          }).catch(error => {
            console.log(error);
          }).finally(() => this.overlay = false)
          
        }
        else
          this.simbad.error = "Fill the name input "
      },
      onSubmit(event) {
        event.preventDefault()

        if (this.selectedOptics.length == 0 || !this.formData.object) {
          this.error.show = true;
          this.error.message = "Add object or optics";
          return;
        }
        
        this.error.show = false;

        this.$store.dispatch('addObservingPetition', {petition : this.formData, optics : this.selectedOptics}).then(() => {
          this.onReset(event)
        }).finally(()=> {
          this.show = true;
        })
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.formData.description = '',
        this.formData.objectType = null,
        this.formData.object = null,
        this.selectedOptics = [],
        this.simbad.name = ''
        // Trick to reset/clear native browser form validation state
        this.show = false

        this.$nextTick(() => {
          this.show = true
        })
      },
      showModal() {
        this.$refs['optics-modal'].show()
      },
      hideModal() {
        //this.$refs['optics-modal'].hide()
        this.opticsTmp = []
      },
      toggleModal() {
        // We pass the ID of the button that we want to return focus to
        // when the modal has hidden
        this.$refs['optics-modal'].toggle('#toggle-btn')
        this.opticsTmp = []
      },
      handleOk(event) {
        if (this.opticsTmp.length > 0) {
          this.selectedOptics = this.opticsTmp;
          this.opticsTmp = []
        } else {
          event.preventDefault()
        }
      },
      onOpticSelected(optic) {
        this.opticsTmp.push(optic)
        //this.toggleModal()
      },
      onOpticUnselected(optic) {
        this.opticsTmp.splice(this.opticsTmp.indexOf(optic), 1)
        //this.toggleModal()
      },
      deleteOptic(optic) {
        this.selectedOptics.splice(optic, 1);
      },
      deleteObject() {
        this.formData.object = null
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

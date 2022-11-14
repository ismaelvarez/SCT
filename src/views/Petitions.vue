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
          <div style="overflow-y:auto;overflow-x: hidden;height:500px">
            <ul class="list-unstyled h-75" style="display: flex; flex-direction: column;">
              <div v-if="petitions">
                <b-media v-for="petition in petitions" :key="petition.id" tag="li" style="display:inline" vertical-align="center" v-on:click="petitionSelected(petition)">
                  <PetitionItem :petition="petition" :mustDrag="false"/>
                </b-media>
              </div>
            </ul>
          </div>
        </b-col>
        <b-col md="5" offset-md="1" offset-sm="1" sm="10" order-sm="1" order-xs="1" class="rounded p-3 petition-form" style="">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-overlay :show="overlay" rounded="sm" bg-color="#207241">
              <b-form-group id="ig1" label="Search:"  
                label-for="name" label-class="font-weight-bold pt-0"
              >
                <b-container>
                  <b-row>
                    <b-col cols="10">
                      <b-form-input
                        id="name"
                        v-model="searcher.name"
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
                <b-col>
                  <h6 class="font-weight-bold mt-0" > Object Information </h6>
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
                  {{ formData.object.rightAscension }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">DEC: </p>
                </b-col>
                <b-col>
                  {{ formData.object.declination }}
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <p class="font-weight-bold m-0">Constellation:  </p>
                </b-col>
                <b-col>
                  {{ formData.object.constellation }}
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

            <b-alert v-if="searcher.error" show variant="danger"> {{ searcher.error }}</b-alert>

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

            <b-form-group id="input-group-2" label="Observation Slots (One slot = 30min): "
              label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                <b-form-input 
                  id="numBlocks"
                  v-model="formData.blocks"
                  type="number"
                  min="2"
                  max="10"
                  value="2"
                  required
                  >

                </b-form-input>
            </b-form-group>
            <hr/>
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
  </div>
  
</template>

<script>

import TopNav from '@/components/TopNav.vue'
import {SimbadAPI} from '@/axios/SimbadAPI';
import PetitionItem from '@/components/PetitionItem.vue'



export default {
    components: {
      TopNav,
      PetitionItem
    },
    data() {
      return {
        petitions : [],
        id : null,
        formData: {
          description: 'Just a description',
          blocks : 2,
          object : null,
          status: ""
        },
        searcher : {
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
    
  
    beforeCreate () {
        this.$store.dispatch('getPetitions', {status: "*"}).then(() => {
            this.petitions = this.$store.state.petitions;
        })
    },
    methods: {
      isSelected(petition) {
        if (petition.id == this.id)
          return "overlay-petition"
        return ""
      },
      search() {
        if (this.searcher.name != null && this.searcher.name.length > 0) {
          this.overlay = true;

          const apiService = new SimbadAPI();
          const object = apiService.getObject(this.searcher.name);
          object.then(result => {
            const status = result.status;
              if (status == 200) {
                this.formData.object = result.data
                this.searcher.error = null
              } else if (status == 204) {
                this.formData.object = null
                this.searcher.error = "No objects with name " + this.searcher.name
              }
          }).catch(error => {
            console.log(error);
          }).finally(() => this.overlay = false)
          
        }
        else
          this.searcher.error = "Fill the name input "
      },
      onSubmit(event) {
        //event.preventDefault()

        if (!this.formData.object) {
          this.onReset(event)
          this.error.show = true;
          this.error.message = "No object has been selected";
          return;
        }
        
        this.error.show = false;

        this.formData.status = "Created";

        if (this.id == null) {
          this.$store.dispatch('addObservingPetition', {petition : this.formData}).then(() => {
            //this.onReset(event)
          }).finally(()=> {
            this.show = true;

          })
        }
        else {
          this.$store.dispatch('updateObservingPetition', {petition : this.formData, id: this.id}).then(() => {
            //this.onReset(event)
          }).finally(()=> {
            //this.show = true;
          })
        }
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.formData.description = 'Just a description',
        this.formData.object = null,
        this.formData.blocks = 2,
        this.searcher.name = ''
        this.id = null;
        // Trick to reset/clear native browser form validation state
        this.show = false

        this.$nextTick(() => {
          this.show = true
        })
      },
      petitionSelected(petition, event) {
        console.log(JSON.stringify(event))
        this.id = petition.id;
        this.formData.blocks = petition.blocks,
        this.formData.description = petition.description,
        this.formData.object = petition.object
        this.searcher.name = petition.object.name
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

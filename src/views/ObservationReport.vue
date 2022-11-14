<template>
  <div class="home">
    <TopNav/>
    <b-container fluid="md" class="p-1 w-100 mt-1 h-75" >
      <b-row class="text-align" style="background-color:#6ABEA7;font-size: 12px;margin-top:15px">
        <b-col cols="5">
          <b-row align-v="center">
            <b-col cols="2">
              <img src="@/assets/img/sun_set.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4">
            </b-col>
            <b-col cols="2">
              <img src="@/assets/img/sun_rise.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4" variant="danger">
            </b-col>
          </b-row>
        </b-col>

        <b-col>
          <b-row align-v="center" style="text-align:center">
            <b-col cols="2">
              <img src="@/assets/img/moon_rise.png" blank-color="#abc" width="48"  class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4" class="m-0">
              <b-alert show  width="100%" class="m-0 p-0">text</b-alert>
            </b-col>
            <b-col cols="2">
              <img src="@/assets/img/moon_set.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row align-h="center" class="p-1" style="background-color:#6ABEA7;">
        
        <b-col cols="3" >
         <b-button-group>
            <b-button variant="danger">
              <b-icon icon="trash" ></b-icon> Reset
            </b-button>
            <b-button variant="success">
              <b-icon icon="server"></b-icon> Save
            </b-button>
          </b-button-group>
        </b-col>
        <b-col cols="5" offset="2">
         <b-button-group>
            <b-button variant="primary">
              <b-icon icon="clock"></b-icon> Optimize
            </b-button>
            <b-button variant="primary">
              <b-icon icon="inbox-fill"></b-icon> To onStep
            </b-button>
            <b-button variant="primary" v-b-modal.modal-lg>
              <b-icon icon="person-fill"></b-icon> Add Observation
            </b-button>
          </b-button-group>
        </b-col>
        <b-col>
          <b-input-group prepend="PlanID">
          <b-form-input
              id="name"
              type="text"
            ></b-form-input>
            </b-input-group>
        </b-col>
      </b-row>
      <b-row>
      
        <b-col md="5"  sm="10" order-sm="1" order-xs="1" class="p-3 text-center block_height" style="background-color:#6ABEA7">
          <b-container fluid="md" class="p-1">
            <b-row class="mb-3">
              <b-col cols="12">
                <div>
                  <b-calendar v-model="value" :date-disabled-fn="dateDisabled" @context="onContext"></b-calendar>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
        <b-col md="7" sm="12" order-md="1" order-sm="2"  order="2" class='drop-zone block_height overflow'>
          
          <b-overlay :show="overlay" rounded="sm">
            <div v-if="plan">
              <b-media v-for="block in plan.blocks" :key="block.name" style="display:inline" vertical-align="center">
                <div v-if="!loading">
                  <b-container class="p-2 pt-0 mt-0">
                    <b-row class="mt-0">
                      <b-col>
                          <p class="mt-0">{{ block.startTime }}</p>
                      </b-col>
                    </b-row>
                    <b-row align-v="center" class="mt-1" v-if="block.petition">
                        <b-col>
                            <p class="mt-0 mb-1"><strong>{{ block.petition.object.name + " " + block.petition.object.type}}</strong></p>
                        </b-col>
                        <b-col cols="2" class="text-center">
                          <b-button variant="success" id="show-btn" pill v-b-modal.modal-lg><b-icon icon="pencil-square"></b-icon></b-button>
                        </b-col>
                    </b-row>
                  </b-container>
                  <hr/>
                </div>
              </b-media>
            </div>
            <template #overlay>
              <div class="text-center" style="margin-top:650px">
                <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
                <p id="cancel-label">Please wait...</p>
              </div>
            </template>
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
    <div>
      <b-modal id="modal-lg" size="lg" title="Large Modal" >
        <b-container>
          <b-row>
            <b-col>
              <p class="mt-0 mb-1"><strong>M31 Test</strong></p>
              <p class="mb-0 small-font">Right Ascension: sadasdsad</p>
              <p class="mb-0 small-font">Declination: asdasdsa</p>
              <p class="mb-0 ">Another desciprtion</p>
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col>
               <b-form-textarea
                id="textarea"
                placeholder="The description of the observation..."
                rows="3"
                max-rows="6"
                disabled
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-container>

        <template #modal-footer>
          
          <div class="w-100">
            <p class="float-left"></p>
            <b-button
              variant="primary"
              size="sm"
              class="float-right"
              @click="bodySelection=false"
            >
              Close
            </b-button>
          </div>
        </template>
      </b-modal>
      <b-modal id="modal-1" title="OnStep Value">
        <b-form-textarea
                id="textarea"
                placeholder="Description..."
                rows="3"
                max-rows="6"
                disabled
              ></b-form-textarea>
      </b-modal>
    </div>
  </div>
  
</template>

<script>

import TopNav from '@/components/TopNav.vue'
import moment from 'moment'
    
export default {
    components: {
      TopNav
    },
    data() {
      return {
        overlay : false,
        plan : null,
        value : '',
        loading : false,
        selectedDate : "",
        petitionName : "",
      }
    },
    created () {
      //this.createBlocks();
      //this.$store.dispatch('getPetitions', {status: "Created"}).then(() => {
      //    this.petitions = this.$store.state.petitions;
      //})

    },
    methods: {
      save() {
        /*var plan = {}
        plan['date'] = moment(String(this.selectedDate)).format('YYYY-MM-DD')
        plan['startTime'] = this.observation_start_date
        plan['endTime'] = this.observation_end_date
        plan['name'] = this.planName
        plan['blocks'] = []
        for (var i = 0; i < 8; i++) {
          if (this.blocks[i].petition && !this.blocks[i].isContinuation) {
            this.blocks[i].petition.status = "Assigned"
            var block = {
              startTime : this.printDate(i).format('YYYY-MM-DD HH:mm'),
              petition : this.blocks[i].petition
            };
            plan['blocks'].push(block)
          }
        }
        
        this.$store.dispatch('saveObservingPlan', plan).then(() => {
            console.log("Updating pending petitions")
            for (i = 0; i < this.petitions.length; i++) {
              if (this.petitions[i].status == "Assigned") {
                this.petitions[i].status = "Created"
                this.$store.dispatch('updateObservingPetition', {petition : this.petitions[i], id : this.petitions[i].id}).then()
              }
            }
        }).finally(() => {
          if (this.$store.state.planAdded) {
            this.showMsgBoxTwo("Saving observing plan", "Observing plan saved correctly! Clear skies!")
          } else {
            this.showMsgBoxTwo("Saving observing plan", "Han error has ocurred...")
          }
        })
      },
      filteredData() {
        if (this.petitions.length > 0) {
           return this.petitions
            .filter(
              (entry) => { 
                return entry != undefined && (entry.object.name.toLowerCase().includes(this.petitionName.toLowerCase()) || entry.object.constellation.toLowerCase().includes(this.petitionName.toLowerCase()))
              }
            );
        }
        return this.petitions*/
        
      },
      printDate(index) {
        if (this.selectedDate)
          return moment(this.selectedDate.setHours(20, 0)).add(index, 'hours')
        else 
          return ''
      },
      format(date) {
        if (date)
          return date.format("YYYY-MM-DD HH:mm")
        return ""
      },
      dateDisabled(ymd, date) {
        const weekday = date.getDay()
        return weekday != 6 && weekday != 5 
      },
      
      showMsgBoxTwo(title, message, variant="danger") {
        this.boxTwo = ''
        this.$bvModal.msgBoxOk(message, {
          title: title,
          size: 'sm',
          buttonSize: 'sm',
          okVariant: variant,
          headerClass: 'p-2 border-bottom-0 white-space: pre-line;',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
          .then()
          .catch(err => {
            console.log(err)
          })
      },
      onContext(ctx) {
        if (ctx.selectedDate) {
          this.loading = true;
          this.selectedDate = Object.assign(ctx.selectedDate);

          
          var now = moment(String(this.selectedDate)).format('YYYY-MM-DD')

          this.$store.dispatch('getObservingPlan', now).then(() => {
              if (this.$store.state.observationPlan) {
                this.plan = this.$store.state.observationPlan
              }
            }).finally( () => {
            this.overlay = false;
            this.loading = false;
          });
        
        }
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

.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}

.block_height {
  height: 700px;
}

.petitions {
  height: 290px;
}

.overflow {
  overflow: auto;
}
</style>



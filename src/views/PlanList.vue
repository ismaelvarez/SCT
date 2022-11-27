<template>
  <div class="home">
    <TopNav/>
    <b-container fluid="md" class="w-100 h-75" >
      <b-row class="text-align" style="background-color:#6ABEA7"  align-h="center">
        
        <b-col cols="4">
          <h3>Observation plans</h3>
        </b-col>

      </b-row>
      <b-row class="text-align p-3" style="background-color:#6ABEA7"  align-h="center">
        
        <b-col cols="6">
          <b-input-group prepend="Observation date "  class="">
            <b-form-datepicker id="example-datepicker" v-model="date"></b-form-datepicker>
          </b-input-group>
        </b-col>
        
        <b-col cols="2">
          <b-button variant="outline-primary" @click="search()" >Search</b-button>
        </b-col>

      </b-row>
      
      <b-row>
    
        <b-col md="12" sm="12" order-md="1" order-sm="2"  order="2" class='drop-zone block_height overflow'>
          
          <b-overlay :show="overlay" rounded="sm">
            <div v-if="plans.length > 0">
              <b-media v-for="plan in plans" :key="plan.name" style="display:inline" vertical-align="center" @click="goTo(plan.id)">
                <div v-if="!loading">
                  <b-container class="p-2 pt-0 mt-0" >
                    <b-row class="mt-0">
                      <b-col cols="2">
                          <img src="https://www.space4ourplanet.org/wp-content/uploads/2021/05/sdg10_02.jpg" blank-color="#abc" width="80"  class="img-fluid rounded-sm rounded-circle"/>
                      </b-col>
                      <b-col  cols="2">
                          <p class="mt-0">Plan ID: <strong> {{ plan.name }} </strong></p>
                          <p class="mt-0">N of Petitions: {{ plan.blocks.length }}</p>
                      </b-col>
                      <b-col cols="4">
                          <p class="mt-0">Date: {{ plan.date }}</p>
                          <p class="mt-0">From <strong>{{ plan.startTime }}</strong> to <strong>{{ plan.endTime }}</strong></p>
                      </b-col>
                      <b-col v-if="plan.hasOwnProperty('incidences')">
                          <p class="mt-0"> Incidences: {{ plan.incidences.length }}</p>
                      </b-col>
                      
                      <b-col offset="2">
                          <router-link :to="'/plan/' + plan.id">Plan Report  <b-icon icon="box-arrow-up-right" font-scale="1"></b-icon></router-link>
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
        plans: [],
        value : '',
        loading : false,
        selectedDate : "",
        petitionName : "",
        date : ""
      }
    },
    created () {
      //this.createBlocks();
      //this.$store.dispatch('getPetitions', {status: "Created"}).then(() => {
      //    this.petitions = this.$store.state.petitions;
      //})
      this.$store.dispatch('getObservingPlans').then(() => {
          if (this.$store.state.observationPlans) {
            this.plans = this.$store.state.observationPlans
          }
        }).finally( () => {
        this.overlay = false;
        this.loading = false;
      });

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
      goTo(id) {
        console.log(id)
      },
      search() {
        this.loading = true;
        this.selectedDate = Object.assign(this.date);
      
        var now = moment(String(this.selectedDate)).format('YYYY-MM-DD')
        console.log(now)

        this.$store.dispatch('getObservingPlan', now).then(() => {
          if (this.$store.state.observationPlan) {
              this.plans = [this.$store.state.observationPlan]
            }
          }).finally( () => {
          this.overlay = false;
          this.loading = false;
        });
          
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



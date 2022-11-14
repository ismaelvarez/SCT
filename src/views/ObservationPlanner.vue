<template>
  <div class="home">
    <TopNav/>
    <b-container fluid="md" class="p-1 w-100 mt-1 h-75" >
      <b-row >
      </b-row>
      <b-row v-if="observation_start_date" class="text-align" style="background-color:#6ABEA7;font-size: 12px;margin-top:15px">
        <b-col cols="5">
          <b-row align-v="center">
            <b-col cols="2">
              <img src="@/assets/img/sun_set.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4">
              {{ times.sun_set | formatDate }}
            </b-col>
            <b-col cols="2">
              <img src="@/assets/img/sun_rise.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4" variant="danger">
              {{ times.sun_rise | formatDate }}
            </b-col>
          </b-row>
        </b-col>

        <b-col>
          <b-row align-v="center" style="text-align:center">
            <b-col cols="2">
              <img src="@/assets/img/moon_rise.png" blank-color="#abc" width="48"  class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4" class="m-0">
              <b-alert v-if="times.moon_rise" show :variant="moon_rise_danger" width="100%" class="m-0 p-0">{{ times.moon_rise | formatDate }}</b-alert>
            </b-col>
            <b-col cols="2">
              <img src="@/assets/img/moon_set.png" blank-color="#abc" width="48" class="img-fluid rounded-sm rounded-circle"/>
            </b-col>
            <b-col cols="4" style="white-space: pre-line;">
              <b-alert v-if="times.moon_set" show :variant="moon_set_danger" width="100%" class="m-0 p-0">{{ times.moon_set | formatDate }}</b-alert>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row v-if="observation_start_date" align-h="center" class="p-1" style="background-color:#6ABEA7;">
        
        <b-col cols="3" >
         <b-button-group>
            <b-button variant="danger" @click="resetBlockValues">
              <b-icon icon="trash" ></b-icon> Reset
            </b-button>
            <b-button variant="success" @click="save">
              <b-icon icon="server"></b-icon> Save
            </b-button>
            <b-button variant="success">
              <b-icon icon="server"></b-icon> Move
            </b-button>
          </b-button-group>
        </b-col>
        <b-col cols="5" offset="2">
         <b-button-group>
            <b-button variant="primary" @click="optimizeObservingPlan()">
              <b-icon icon="clock"></b-icon> Optimize
            </b-button>
            <b-button variant="primary" @click="toOnStep()">
              <b-icon icon="inbox-fill"></b-icon> To onStep
            </b-button>
            <b-button variant="primary" v-b-modal.modal-lg @click="bodySelection=true">
              <b-icon icon="person-fill"></b-icon> Add Observation
            </b-button>
          </b-button-group>
        </b-col>
        <b-col>
          <b-input-group prepend="PlanID">
          <b-form-input
              id="name"
              type="text"
              v-model="planName"
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
            <b-row class="overflow">
              <b-col >
                <div style="" class='drop-zone '>
                  <b-input-group prepend="Search" class="mt-3">
                    <b-form-input
                        id="name"
                        type="text"
                        v-model="petitionName"
                        value="f"
                      ></b-form-input>
                  </b-input-group>
                </div>
              </b-col>
            </b-row>
            <b-row class="petitions overflow">
              
              <b-col  v-if="petitions.length > 0" >
                <div style="" class='drop-zone '>
                  <ul class="list-unstyled h-50 " style="display: flex; flex-direction: column;">
                    <b-media v-for="petition in filteredData()" :key="petition.id" tag="li" style="display:inline" vertical-align="center">
                      <PetitionItem :petition="petition" :mustDrag="true" :simple="true"/>
                    </b-media>
                  </ul>
                </div>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
        <b-col md="7" sm="12" order-md="1" order-sm="2"  order="2" class='drop-zone block_height overflow'>
          
          <b-overlay :show="overlay" rounded="sm">
            <b-media v-for="index in 8" :key="index" style="display:inline" vertical-align="center" @drop='onPetitionDrop($event, index)' @dragover.prevent @dragenter.prevent >
              <div v-if="!loading && observation_start_date">
                <b-alert show :variant="blocks[index-1].constraint.code" width="100%" class="m-0 p-0">
                  <b-container class="p-2 pt-0 mt-0" draggable="false" >
                    <b-row class="mt-0">
                      <b-col>
                          <p class="mt-0">{{ printDate(index-1).format('YYYY-MM-DD HH:mm') }} {{  blocks[index-1].constraint.message }}</p>
                      </b-col>
                    </b-row>
                    <b-row align-v="center" class="mt-1" v-if="blocks[index-1].petition">
                        <b-col v-if="blocks[index-1].petition && blocks[index-1].petition.object && blocks[index-1].petition.object.name">
                            <p class="mt-0 mb-1"><strong>{{ blocks[index-1].petition.object.name + " " + blocks[index-1].petition.object.type}}</strong></p>
                            <p class="mb-0 ">{{ blocks[index-1].petition.description }}</p>
                            <p class="mb-0 small-font">Right Ascension: {{ blocks[index-1].petition.object.rightAscension }}</p>
                            <p class="mb-0 small-font">Declination: {{ blocks[index-1].petition.object.declination }}</p>
                        </b-col>
                        <b-col cols="2" class="text-center" v-if="!blocks[index-1].isContinuation">
                          <b-button variant="danger" id="show-btn" pill @click="deletePetition(blocks[index-1].petition, index-1)"><b-icon icon="trash"></b-icon></b-button>
                        </b-col>
                    </b-row>
                  </b-container>
                  
                </b-alert>
                <hr/>
              </div>
            </b-media>
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
      <b-modal id="modal-lg" size="lg" title="Large Modal"  @click="bodySelection=true" v-model="bodySelection">
        <b-container>
          <b-row>
            <b-col>
              <b-input-group prepend="Number of slots" class="mt-3">
                <b-form-input id="name" type="number" v-model="planetSlots" value="2"></b-form-input>
                
                <b-button type="submit" variant="primary" @click="addBodiesToPetitions">Add petition</b-button>
                    
              </b-input-group>
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col>
              <b-form-textarea
                id="textarea"
                v-model="description"
                placeholder="Description..."
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-col>
          </b-row>
        </b-container>
        
        <b-table ref="bodyTable" striped hover :items="planets" :fields="fields" selectable @row-selected="onPlanetSetected" select-mode="multi">
          <template v-slot:cell(image)="row">
            <img :src="row.item.image" blank-color="#abc" width="48"  class="img-fluid rounded-sm rounded-circle"/>
          </template>
          <template v-slot:cell(name)="row">
            {{ row.item.name }}
          </template>
        </b-table>
        <div class="w-100">
            <div class="mt-3  text-center" v-if="bodyPetitionError">
              <b-alert show variant="danger">Empty description?</b-alert>
            </div>
            <div class="mt-3  text-center" v-if="bodyPetitionAdded">
              <b-alert show variant="primary">Petition added</b-alert>
            </div>
          </div>
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
                v-model="onStepValue"
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
import PetitionItem from '@/components/PetitionItem.vue'
import {AstroPlan} from '@/axios/AstroPlan';
import moment from 'moment'

const OK = "transparent"
const WARNING = "warning"
const DANGER = "danger"
    
export default {
    components: {
      TopNav,
      PetitionItem
    },
    data() {
      return {
        overlay : false,
        petitionsAssigned: [],
        petitions : [],
        blocks : {},
        value : '',
        times : {
          sun_rise : '',
          sun_set : '',
          moon_rise : '',
          moon_set : '',
          moon_bright : ''
        },
        moon : {
          start_bright : 0,
          end_bright : 0
        },
        observation_start_date : null,
        observation_end_date : '',
        moon_rise_danger : 'transparent',
        moon_set_danger : 'transparent',
        selected_date : 'transparent',
        loading : false,
        selectedDateString : "",
        petitionName : "",
        planName: "OB",
        bodySelection: false,
        description: "",
        planetSlots: 2,
        bodiesSelected: [],
        bodyPetitionAdded: false,
        bodyPetitionError: false,
        onStepValue: "",
        planets : [
          {
            image: "https://cloudfront-us-east-1.images.arcpublishing.com/copesa/AIX2U2CRCRBIFCZOKNP36DTUNY.jpg",
            name: "Mars",
            slots: 2
          },
          {
            image: "https://www.nationalgeographic.com.es/medio/2021/09/28/jupiter-junto-a-una-de-sus-lunas-europa_505f4f1d_1663x1375.jpg",
            name: "Jupiter",
            slots: 2
          },
          {
            image: "https://starwalk.space/gallery/images/saturn-planet-guide/1920x1080.jpg",
            name: "Saturn",
            slots: 2
          },
          {
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Full_Moon_Luc_Viatour.jpg/1015px-Full_Moon_Luc_Viatour.jpg",
            name: "Moon",
            slots: 2
          }
        ],
        fields : ["Image", "Name"]
      }
    },
    created () {
      this.createBlocks();
      this.$store.dispatch('getPetitions', {status: "Created"}).then(() => {
          this.petitions = this.$store.state.petitions;
      })

    },
    methods: {
      save() {
        var plan = {}
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
        return this.petitions
        
      },
      onPlanetSetected(items) {
        items.forEach(item => {
          if (!this.bodiesSelected.includes(item)) {
          this.bodiesSelected.push(item)
          }
        });
        
      },
      addBodiesToPetitions() {
        try {
          if (parseInt(this.planetSlots) && this.description.length > 0 && this.bodiesSelected.length > 0) {
            this.bodiesSelected.forEach(item => {
              const petition = {
                id: item.name + this.planetSlots,
                blocks: this.planetSlots,
                description: this.description,
                object: {
                  constellation: "None",
                  declination: "NaN",
                  rightAscension: "NaN",
                  subtype: "",
                  type: "Body",
                  name: item.name,
                  magnitude: 1.0
                },
                status: "Created"
              };
              this.petitions.push(petition)
            });
            this.bodyPetitionAdded = true;
            this.bodyPetitionError = false;
          }
          else {
            this.bodyPetitionError = true;
            this.bodyPetitionAdded = false;

          }
        } catch (error) {
          this.bodyPetitionError = true;
          this.bodyPetitionAdded = false;
        }
      

        this.bodiesSelected.splice(0,this.bodiesSelected.length)
        this.$refs.bodyTable.clearSelected()
      },
      toOnStep() {
        var plan = {}
        plan.startTime = this.observation_start_date
        plan.endTime = this.observation_end_date
        plan.name = this.planName
        plan.objects = []
        for (var i = 0; i < 8; i++) {
          if (this.blocks[i].petition && !this.blocks[i].isContinuation) {
            console.log(this.blocks[i].petition.object.name)
            plan.objects.push(this.blocks[i].petition.object.name)
          }
        }

        const apiService = new AstroPlan();
        const optimizedPlan = apiService.toOnStep(plan);
          
        optimizedPlan.then((response) => {
          console.log(response.data)
          this.onStepValue = response.data;
          this.$bvModal.show("modal-1")
        }).catch(error => {
          console.log(error);
        })
      },
      optimizeObservingPlan() {
        var plan = {}
        plan.startTime = this.observation_start_date
        plan.endTime = this.observation_end_date
        plan.objects = []
        for (var i = 0; i < 8; i++) {
          if (this.blocks[i].petition) {
            plan.objects.push(this.blocks[i].petition.object.name)
          }
        }
        
        const apiService = new AstroPlan();
        const optimizedPlan = apiService.optimizeObservingPlan(plan);
          
        optimizedPlan.then(result => {
          const status = result.status;
            if (status == 200) {
              this.showMsgBoxTwo("OnStep", result.data, "primary")
            } 
        }).catch(error => {
          console.log(error);
        })


      },
      resetBlockValues() {
        //Delete petitions from blocks
        for (var i = 0; i < 8;i++) {
          if (this.blocks[i].petition) {
            this.blocks[i].petition = null
          }
        }

        //Add to petition list the petitions assigned
        for (i = 0; i< this.petitionsAssigned.length;i++) {
          this.petitions.push(this.petitionsAssigned[i])
        }

        this.petitionsAssigned.splice(0)
      },
      emptyBlock() {
        return {
                startTime : null,                   // Start time
                constraint : {
                  code : OK,                        // OK, WARNING, DANGER
                  message : ''},                    // constraint message
                petition :  null,                   // Petition
                isContinuation : false              // Petition with blocks > 1
              }
      },
      createBlocks() {
        
        var now = moment(String(this.selectedDate)).format('YYYY-MM-DD')
        console.log(now)
        for (var i = 0; i< 8;i++)
              this.blocks[i] = this.emptyBlock()

        this.$store.dispatch('getObservingPlan', now).then(() => {
            if (this.$store.state.observationPlan) {
              this.planName = this.$store.state.observationPlan.name
              for (i = 0; i< 8;i++) {
                for (var j = 0; j<this.$store.state.observationPlan.blocks.length; j++) {
                  if (String(this.format(this.printDate(i))) == this.$store.state.observationPlan.blocks[j].startTime) {
                    this.blocks[i].startTime = this.$store.state.observationPlan.blocks[j].startTime
                    var petition = this.$store.state.observationPlan.blocks[j].petition
                    for (var z = 0; z < petition.blocks; z++) {
                      this.blocks[i+z].petition = this.$store.state.observationPlan.blocks[j].petition
                      this.blocks[i+z].isContinuation = petition.blocks > 1 && z > 0
                    }
                    i += petition.blocks - 1
                    break
                  }
                }
              }
            }
          })
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
      startDrag: (evt, item) => {
          evt.dataTransfer.dropEffect = 'move'
          evt.dataTransfer.effectAllowed = 'move'
          evt.dataTransfer.setData('itemID', item.id)
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
      onPetitionDrop (evt, index) {
        const apiService = new AstroPlan();
        const itemID = evt.dataTransfer.getData('itemID')
        const item = this.petitions.find(item => item.id == itemID)

        if (this.petitionsAssigned.indexOf(item) == -1) {
          if (this.blocks[index-1].isContinuation) {
            this.showMsgBoxTwo('Slots already asigned','The slot selected is a continuation of a petition')
            return
          }
          this.loading = true;
          this.overlay = true;

          var type = "deepObject";

          if (item.object.type == "Body")
            type = "Planet";

          const objectVisible = apiService.isObjectVisible(this.format(this.printDate(index-1)), this.format(this.printDate(index)), item.object.name, type)
          objectVisible.then(result => {
          const status = result.status;
              if (status == 200 && result.data) {

                  if (item.blocks > 1 && !this.fillPetitionSlot(item, index, item.blocks-1)) {
                    this.unfillPetitionSlot(index, item.blocks-1);
                  }

                  this.petitionsAssigned.push(item);
                  if (this.blocks[index-1].petition != null) {
                    this.petitions.push(this.blocks[index-1].petition)
                    this.petitionsAssigned.splice(this.petitionsAssigned.indexOf(this.blocks[index-1].petition), 1)
                  }

                  this.blocks[index-1].petition = item
                  this.petitions.splice(this.petitions.indexOf(item), 1)
                
              } else {
                  this.showMsgBoxTwo('Object not visible','The object selected is not visible in that date')
                }
          }).catch(error => {
            console.log(error);
          }).finally( () => {
            this.overlay = false;
            this.loading = false;
          })

          
        }
      },
      fillPetitionSlot(petition, index, slotsLeft) {
        while (slotsLeft > 0) {
          if (Object.keys(this.blocks).length == index) {
            this.showMsgBoxTwo('Slots overflow ','The petition selected has ' + petition.blocks + ' blocks asigned');
            return false;
          }
          if (this.blocks[index].petition != null) {
            this.petitions.push(this.blocks[index].petition)
            this.petitionsAssigned.splice(this.petitionsAssigned.indexOf(this.blocks[index].petition), 1)
          }

          this.blocks[index].petition = petition;
          this.blocks[index].isContinuation = true;
          index++;
          slotsLeft--;
        }
        return true;
      },
      unfillPetitionSlot(index, slotsLeft) {
        while (slotsLeft > 0) {
          this.blocks[index].petition = null
          this.blocks[index].isContinuation = false;
          index++;
          slotsLeft--;
        }
      },
      allPetitions (petitions) {
        this.petitions = petitions
      },
      deletePetition(petition, index) {
        this.blocks[index].petition = null
        this.petitionsAssigned.splice(this.petitionsAssigned.indexOf(petition), 1)
        this.petitions.push(petition);
        if (petition.blocks > 1) {
          this.unfillPetitionSlot(index+1, petition.blocks-1);
        }
      },
      checkMoon() {
        const max = Math.max(this.moon.start_bright, this.moon.end_bright);
        this.moon_rise_danger = OK
        this.moon_set_danger = OK

        if (this.times.moon_rise > this.observation_start_date) {
          if (max < 0.3)
            this.moon_rise_danger = WARNING
          else
            this.moon_rise_danger = DANGER
        }
        if (this.times.moon_set < this.observation_end_date) {
          if (max < 0.3)
            this.moon_set_danger = WARNING
          else
            this.moon_set_danger = DANGER
        }
      },
      checkMoonTimes(index) {
        return this.times.moon_rise < this.printDate(index).format('YYYY-MM-DD HH:mm') && this.times.moon_set > this.printDate(index).format('YYYY-MM-DD HH:mm') ||
          this.times.moon_rise < this.printDate(index+1).format('YYYY-MM-DD HH:mm') && this.times.moon_set > this.printDate(index).format('YYYY-MM-DD HH:mm');
      },
      checkBlocks() {
        const max = Math.max(this.moon.start_bright, this.moon.end_bright);
        
        
        for (var i = 0; i < 8; i++) {
          if (this.checkMoonTimes(i)) {
            if (max < 0.3) {
              this.blocks[i].constraint.code = WARNING
              this.blocks[i].constraint.message = 'Small Moon Brightness Constraint: '+ this.$options.filters.formatNumber(max)
            }
            else {
              this.blocks[i].constraint.code = DANGER
              this.blocks[i].constraint.message = 'Moon Brightness Constraint: '+ this.$options.filters.formatNumber(max)
            }
          }
        }
      },
      onContext(ctx) {
        if (ctx.selectedDate) {
          this.loading = true;
          for (var i = 0; i < this.petitionsAssigned.length; i++) {
            this.petitions.push(this.petitionsAssigned[i])
          }
          this.petitionsAssigned.splice(0)
          this.selectedDate = Object.assign(ctx.selectedDate);
          this.selectedDateString = String(moment(String(ctx.selectedDate)).format('YYYY-MM-DD'))

          
          this.createBlocks();
          
          this.observation_start_date = moment(String(ctx.selectedDate)).format('YYYY-MM-DD') + ' 22:00'
          ctx.selectedDate.setDate(ctx.selectedDate.getDate() + 1)
          this.observation_end_date = moment(String(ctx.selectedDate)).format('YYYY-MM-DD')  + ' 06:00'
          //ctx.selectedDate.setDate(ctx.selectedDate.getDate() - 1)
          const apiService = new AstroPlan();
          const info = apiService.getDayInfo(this.observation_start_date, this.observation_end_date);

          
          this.overlay = true;
          info.then(result => {
            const status = result.status;
              if (status == 200) {
                this.times.sun_rise = result.data.sunrise
                this.times.sun_set = result.data.sunset
                this.times.moon_rise = moment(String(result.data.moonrise)).format('YYYY-MM-DD HH:mm')
                this.times.moon_set = moment(String(result.data.moonset)).format('YYYY-MM-DD HH:mm')
                this.moon.start_bright = result.data.moon_illumination[0]
                this.moon.end_bright = result.data.moon_illumination[1]
                this.checkMoon();
                this.checkBlocks();
              } 
          }).catch(error => {
            console.log(error);
          }).finally(() => {
            this.overlay = false;
            this.loading = false;
          })

          ctx.selectedDate.setDate(ctx.selectedDate.getDate() - 1)
        
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



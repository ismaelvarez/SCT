<template>
  <div class="home">
    <link rel="stylesheet" href="https://aladin.u-strasbg.fr/AladinLite/api/v2/latest/aladin.min.css" />
 
    <!-- you can skip the following line if your page already integrates the jQuery library -->
    <script type="application/javascript" src="https://code.jquery.com/jquery-1.12.1.min.js" charset="utf-8"></script>
    <TopNav/>
    <b-container fluid="md" class="p-1 w-100 mt-1 h-75" >
      <b-row class="text-align p-2" style="background-color:#6ABEA7;" v-if="plan" align-h="center">
        <b-col cols="2" class="text-align">
          <h5><strong>{{ plan.name }}</strong></h5>
        </b-col>
      </b-row>
      <b-row class="p-3" style="background-color:#6ABEA7;" align-h="center" align-v="center" v-if="plan" >
        
        <b-col cols="2"  >
          <p>Date: {{ plan.date }}</p>
        </b-col>
        
        <b-col cols="3">
          <p> <b-icon icon="chevron-double-right" font-scale="1"></b-icon>Start: {{ plan.startTime }}</p>
        </b-col>
        
        <b-col cols="3">
          <p><b-icon icon="chevron-double-right" font-scale="1"></b-icon>End: {{ plan.endTime }}</p>
        </b-col>
        
        <b-col cols="3">
         <b-button-group>
            <b-button variant="primary" v-b-modal.onStepConf>
              <b-icon icon="card-list" ></b-icon> Setup
            </b-button>
            <b-button variant="danger">
              <b-icon icon="card-list" ></b-icon> Incidences
            </b-button>
          </b-button-group>
        </b-col>

      </b-row>
      
      <b-row>
    
        <b-col md="12" sm="12" order-md="1" order-sm="2"  order="2" class='drop-zone block_height overflow'>
          
          <b-overlay :show="overlay" rounded="sm">
            <div v-if="plan">
              <b-media v-for="block in plan.blocks" :key="block.name" style="display:inline" vertical-align="center">
                <div>
                  <b-container class="p-2 pt-0 mt-0" >
                    <b-row class="mt-0" align-v="center">
                      <b-col cols="1">
                          <b-img :src="getImage(block.petition.object)" blank-color="#abc" width="64" alt="placeholder" class="img-fluid rounded-sm rounded-circle"></b-img>
                      </b-col>
                      <b-col cols="1">
                          <p class="mt-0">{{ block.petition.object.name }}</p>
                      </b-col>
                      <b-col cols="2">
                          <p class="mt-0"> Type: {{ block.petition.object.type }}</p>
                      </b-col>
                      <b-col cols="3">
                          <p class="mt-0"> Constellation: {{ block.petition.object.constellation }}</p>
                      </b-col>
                      
                      <b-col>
                          <p class="mt-0">RA: {{ block.petition.object.rightAscension }}</p>
                          <p class="mt-0">DEC: {{ block.petition.object.declination }}</p>
                      </b-col>
                      <b-col cols="2" align-self="start" offset="1">
                        <b-button-group>
                          <b-button class="m-1"  @click="showReport(block.petition.object)">
                            <b-icon icon="chat-left-text" ></b-icon>
                          </b-button>
                          <b-button class="m-1">
                            <b-icon icon="camera" ></b-icon>
                          </b-button>
                          <b-button class="m-1" v-b-modal.configuration>
                            <b-icon icon="gear" ></b-icon>
                          </b-button>
                        </b-button-group>
                      </b-col>
                      
                    </b-row>
                    <b-row class="mt-0">
                      <b-col v-if="block.petition.hasOwnProperty('telescopeConfiguration')">
                          <p class="mt-0">Telescope Configuration: {{ block.petition.telescopeConfiguration }}</p>
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
      <b-modal id="reportModal" ref="reportModal" size="lg" title="Report view">
        <b-container>
          <b-row>
            <b-col>
              <b-form-group id="input-group-2" label="Temperature "
                label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                  <b-form-input 
                    id="numBlocks"
                    type="number"
                    min="2"
                    max="10"
                    value="2"
                    required
                    > </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-2" label="Humidity "
                label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                  <b-form-input 
                    id="numBlocks"
                    type="number"
                    min="2"
                    max="10"
                    value="2"
                    required
                    ></b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-2" label="Seeing "
                label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                  <b-form-input 
                    id="numBlocks"
                    type="number"
                    min="2"
                    max="10"
                    value="2"
                    required
                    ></b-form-input>
                </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-textarea
                id="textarea"
                placeholder="Description..."
                rows="6"
                max-rows="6">
              </b-form-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-file v-model="file" ref="file-input" class="mb-2 mt-2"></b-form-file>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6" sm="12" order-md="1" order-sm="2"  order="2"  style="height:300px">
              <div id="aladin-lite-div" ></div>
            </b-col>
            <b-col md="6" sm="12" order-md="1" order-sm="2"  order="2" style="height:300px">
              <b-img style="height:300px" src="https://static.vecteezy.com/system/resources/thumbnails/005/337/799/small_2x/icon-image-not-found-free-vector.jpg" fluid alt="Responsive image"></b-img>
            </b-col>
          </b-row>
        </b-container>
        
        
        <script type="application/javascript">
            var aladin = A.aladin('#aladin-lite-div', {
              survey: "P/DSS2/color",
              fov:4,
              target: {{ "'" + target + "'"}},
              reticleColor: "#ff89ff",
              reticleSize: 64 
            });
        </script>
      </b-modal>
      <b-modal id="configuration" title="Telescope configuration">
        <b-container>
          <b-row>
            <b-col>
              <b-form-group id="input-group-2" label="Barlow" 
                label-for="input-2" label-class="font-weight-bold pt-0">
                <b-form-select v-model="selected" :options="options"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-2" label="Focal Length "
                label-for="input-2"  label-class="font-weight-bold pt-0">
                  <b-form-input 
                    id="numBlocks"
                    type="number"
                    min="2"
                    max="10"
                    value="2"
                    required
                    >
                  </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group id="input-group-2" label="Filter "
                label-for="input-2"  label-class="font-weight-bold pt-0">
                <b-form-select v-model="selected" :options="filters"></b-form-select>
            </b-form-group>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>
      <b-modal id="onStepConf" ref="onStepConf" size="lg" title="OnStep configuration">
        <b-container>
          <b-row>
            <b-col>
              <b-form-group
                label="Telescope Setup"
              >
                <b-form-checkbox-group
                  :options="telescopeSetup"
                  switches
                  stacked
                ></b-form-checkbox-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="input-group-2" label="Number of Star Alignment "
                label-for="input-2" class="mt-2"  label-class="font-weight-bold pt-0">
                  <b-form-input 
                    id="numBlocks"
                    type="number"
                    min="2"
                    max="10"
                    value="2"
                    required
                    ></b-form-input>
                </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-textarea
                id="textarea"
                placeholder="Stars used for alignment..."
                rows="6"
                max-rows="6">
              </b-form-textarea>
            </b-col>
          </b-row>
        </b-container>
      </b-modal>
    </div>
    
    <script type="application/javascript" src="https://aladin.u-strasbg.fr/AladinLite/api/v2/latest/aladin.min.js" charset="utf-8"></script>
  </div>
  
</template>

<script>

import TopNav from '@/components/TopNav.vue'
    
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
        date : "",
        target: "",
        options: [
          { value: "x0", text: 'X0' },
          { value: "x1", text: 'X1' },
          { value: 'x2', text: 'X2' }
        ],
        filters: [
          { value: null, text: 'None' },
          { value: '8', text: '#8: Light Yellow' },
          { value: '11', text: '#11: Yellow-Green' },
          { value: '12', text: '#12: Yellow' },
          { value: '21', text: '#21: Orange' },
          { value: '23', text: '#23A: Light Red' },
          { value: '25', text: '#25A: Red' },
          { value: '38', text: '#38A: Dark Blue' },
          { value: '47', text: '#47: Violet' },
          { value: '56', text: '#56: Light Green' },
          { value: '58', text: '#58: Green' },
          { value: '80', text: '#80A: Blu' },
          { value: '82', text: '#82A: Light Blue' },
        ],
        telescopeSetup:  [
          { text: 'Collimation', value: "collima" }
        ]
      }
    },
    created () {
      this.$store.dispatch('getObservingPlanById', this.$route.params.id).then(() => {
        if (this.$store.state.observationPlan) {
          this.plan = this.$store.state.observationPlan
        }
      }).finally( () => {
        this.overlay = false;
        this.loading = false;
      });

    },
    methods: {
      save() {
        
      },
      showReport(object) {
        console.log(object)
        this.target = object.name
        this.$refs['reportModal'].show()
      },
      search() {
          
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



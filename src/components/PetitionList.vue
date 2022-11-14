<template>
    <div v-if="petitionList">
        <b-media v-for="petition in petitionList" :key="petition.id" :class="isSelected(petition)"  tag="li" style="display:inline" vertical-align="center" v-on:click="setSelectedPetition($event, petition)">
          <PetitionItem :petition="petition" :mustDrag="isDraggable"/>
        </b-media>
    </div>
</template>

<script>
import PetitionItem from '@/components/PetitionItem.vue'

export default {
  components: {
      PetitionItem
  },
  props: {
    petitions: {
        type: Array
    },
    mustDrag : {
        type : Boolean
    }
  },
  data() {
    return {
      selectedPetitions : [],
      petitionList : this.petitions,
      isDraggable : this.mustDrag
    }
  },
  
  created () {
    if (!this.petitionList)
      this.$store.dispatch('getPetitions').then(() => {
          this.petitionList = this.$store.state.petitions;
          this.$emit('allPetitions', this.petitionList);
      })
  },
  beforeUnmount() {
    //alert("lll")
  },
  methods: {
      setSelectedPetition(ev, petition) {
        console.log(petition);
        this.$emit('onPetitionselected', petition);
        /*var element = document.getElementById(petition.id);
        if (element.classList.value.includes('selected')) {
          element.classList.remove('selected');
          //this.selectedOptics.splice(this.selectedOptics.indexOf(optic), 1)
          
        } else{
          element.classList.add('selected');
          //this.selectedOptics.push(optic);
          //this.$emit('opticSelected', optic);
        }*/
        
      },
      isSelected(optic) {
        return this.selectedPetitions.includes(optic) ? 'selected' : '';
      }
  }
}
</script>
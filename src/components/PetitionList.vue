<template>
    <div v-if="petitionList">
        <b-media v-for="petition in petitionList" :key="petition.id" :class="isSelected(petition)"  tag="li" style="display:inline" vertical-align="center" v-on:click="setSelectedOptic($event, petition)">
          <PetitionItem :petition="petition"/>
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
        type: Object
    }
  },
  data() {
    return {
      selectedPetitions : [],
      petitionList : this.petitions
    }
  },
  
  created () {
    if (!this.petitionList)
      this.$store.dispatch('getPetitions').then(() => {
          this.petitionList = this.$store.state.petitions;
      })
  },
  beforeUnmount() {
    //alert("lll")
  },
  methods: {
      setSelectedOptic(ev, optic) {
          console.log(optic);
        /*var element = document.getElementById(optic.id);
        if (element.classList.value.includes('selected')) {
          element.classList.remove('selected');
          this.selectedOptics.splice(this.selectedOptics.indexOf(optic), 1)
          this.$emit('onOpticUnselected', optic);
        } else{
          element.classList.add('selected');
          this.selectedOptics.push(optic);
          this.$emit('opticSelected', optic);
        }*/
        
      },
      isSelected(optic) {
        return this.selectedPetitions.includes(optic) ? 'selected' : '';
      }
  }
}
</script>
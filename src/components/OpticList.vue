<template>
    <div>
        <b-media v-for="optic in opticList" :key="optic.id" :class="isSelected(optic)"  tag="li" style="display:inline" vertical-align="center" v-on:click="setSelectedOptic($event, optic)" class=" overflow-auto">
          <OpticItem :optic="optic"/>
        </b-media>
    </div>
</template>

<script>
import OpticItem from '@/components/OpticItem.vue'

export default {
  components: {
      OpticItem
  },
  props: {
    optics: {
        type: Object
    }
  },
  data() {
    return {
      selectedOptics : [],
      opticList : this.optics
    }
  },
  
  created () {
    if (!this.opticList)
      this.$store.dispatch('getOptics').then(() => {
          this.opticList = this.$store.state.optics;
      })
  },
  beforeUnmount() {
    //alert("lll")
  },
  methods: {
      setSelectedOptic(ev, optic) {
        var element = document.getElementById(optic.id);
        if (element.classList.value.includes('selected')) {
          element.classList.remove('selected');
          this.selectedOptics.splice(this.selectedOptics.indexOf(optic), 1)
          this.$emit('onOpticUnselected', optic);
        } else{
          element.classList.add('selected');
          this.selectedOptics.push(optic);
          this.$emit('opticSelected', optic);
        }
        
      },
      isSelected(optic) {
        return this.selectedOptics.includes(optic) ? 'selected' : '';
      }
  }
}
</script>
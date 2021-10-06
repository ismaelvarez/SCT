<template>
    <b-container :id="optic.id" class="optic-item p-3 rounded">
        <b-row align-v="center">
            <b-col cols="2">
            <b-img :src="image(item)" blank-color="#abc" width="64" alt="placeholder" class="img-fluid rounded-sm rounded-circle w-100"></b-img>
            </b-col>
            <b-col>
                <h5 class="mt-0 mb-1">{{ item.name + ' ' + magnitude(item) + ' ' + item.type }}</h5>
                <p class="mb-0">{{ item.description }}</p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

export default {
    props: {
        optic: {
            type: Object
        }   
    },
    data() {
        return {
            item : this.optic
        }
    },
    methods: {
      magnitude(optic) {
        var units = 'mm'
        if (optic.type == 'Barlow')  units =  'x'
        return optic.type == 'Filter' ? '' : optic.magnitude + units 
      },
      image(optic) {
        return optic.type == 'Barlow' ? 
        'https://nimax-img.de/Produktbilder/big/24891_1/Celestron-X-Cel-LX-1-25-2X-Barlow-lens.jpg' :
        'https://m.media-amazon.com/images/I/61Jmu-uthLL._AC_SL1200_.jpg'
      }
  }
}
</script>
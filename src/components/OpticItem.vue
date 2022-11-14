<template>
    <b-container :id="optic.id" class="optic-item p-3 rounded m-1">
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
        if (optic.type == 'Filter')
            return 'https://www.ubuy.com.py/productimg/?image=aHR0cHM6Ly9tLm1lZGlhLWFtYXpvbi5jb20vaW1hZ2VzL0kvNzFaMjRzTDV6dkwuX0FDX1NMMTUwMF8uanBn.jpg'
        return optic.type == 'Barlow' ? 
        'https://www.amaina.com/546-thickbox_default2x/barlow-celestron-x-cel-lx-2x-125-c93529.jpg' :
        'https://www.collinsdictionary.com/images/full/eyepiece_438364027.jpg'
      }
  }
}
</script>
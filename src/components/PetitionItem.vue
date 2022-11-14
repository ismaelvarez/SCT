<template>
    <b-container :id="petition.id" class=" p-3 rounded drag-el petition-item m-1" :draggable="mustDraga" @dragstart='startDrag($event, petition)' >
        <b-row align-v="center" v-if="simple==false">
            <b-col cols="2">
                <b-img :src="getImage(item.object)" blank-color="#abc" width="64" alt="placeholder" class="img-fluid rounded-sm rounded-circle"></b-img>
            </b-col>
            <b-col>
                <h5 class="mt-0 mb-1">{{ item.object.name}}</h5>
                <p class="mb-0">{{ item.description }}</p>
                <p class="mb-0">{{ item.object.rightAscension + " " +  item.object.declination }}</p>
                <p class="mb-0">{{ item.blocks }} slots</p>
            </b-col>
            <b-col cols="2" class="text-center">
                <p class="mb-0 font-weight-bold">{{ item.status }} <b-icon icon="box-arrow-in-right"></b-icon></p>
            </b-col>
        </b-row>
        <b-row v-else align-v="center" class="small-font">
            <b-col cols="2">
                 <p class="mt-0 mb-1"><strong>{{ item.object.name}}</strong></p>
            </b-col>
            <b-col cols="2">
                <p class="mb-0 f-5">{{ item.blocks }} slots</p>
            </b-col>
            <b-col cols="4">
                <p class="mb-0">{{ item.object.rightAscension + " " +  item.object.declination }}</p>
            </b-col>

            <b-col cols="2" class="text-center">
                <p class="mb-0 font-weight-bold">{{ item.status }} <b-icon icon="box-arrow-in-right"></b-icon></p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>

export default {
    props: {
        petition: {
            type: Object,
        },
        mustDrag : {
            type : Boolean
        },
        simple : {
            type : Boolean
        }
    },
    data() {
        return {
            item : this.petition,
            mustDraga : this.mustDrag
        }
    },
    methods: {
        getImage(object) {
            var tmp = ""
            try {
                tmp = object.type + '';
            } catch (error) {
                tmp = object['subtype'] + '';
            }
            if (tmp+''.startsWith("SA")) {
                return require("@/assets/img/galaxy.jpg")
            }
            return require("@/assets/img/all.jpeg")
        },
        startDrag: (evt, item) => {
            evt.dataTransfer.dropEffect = 'move'
            evt.dataTransfer.effectAllowed = 'move'
            evt.dataTransfer.setData('itemID', item.id)
        },
        onDrop() {
            alert("fdsfsd");
        }
    }
}
</script>
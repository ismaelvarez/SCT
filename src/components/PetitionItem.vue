<template>
    <b-container :id="petition.id" class="optic-item p-3 rounded">
        <b-row align-v="center">
            <b-col cols="2">
                <b-img  :src="getImage(item.object)" blank-color="#abc" width="64" alt="placeholder" class="img-fluid rounded-sm rounded-circle"></b-img>
            </b-col>
            <b-col>
                <h5 class="mt-0 mb-1">{{ item.object.name + " " + item.object.type + " " + item.object.subtype}}</h5>
                <p class="mb-0">{{ item.description }}</p>
                <p class="mb-0">{{ item.object.ra + " " +  item.object.dec }}</p>
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
            type: Object
        }   
    },
    data() {
        return {
            item : this.petition
        }
    },
    methods: {
        getImage(object) {
            const tmp = object['type'] + '';
            if (tmp+''.startsWith("SA")) {
                return require("@/assets/img/galaxy.jpg")
            }
            return require("@/assets/img/all.jpeg")
        }
    }
}
</script>
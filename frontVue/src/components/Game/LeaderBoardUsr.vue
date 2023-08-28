<script setup lang="ts">
import {type LeaderBoardUserInfo} from '@/types'
import {ref} from 'vue'
import LeaderBoard from './LeaderBoard.vue';

const props = defineProps<{
    index: number;
    user : LeaderBoardUserInfo
}>()

const profilePicture = ref();
// if (props.user.photo == "no photo yet") {
//     profilePicture.value = "../../assets/placeholder_avatar_white.png"
// }
// else {
    profilePicture.value = props.user.photo;
// }

let statusImage: string;
switch(props.index) {
    case 0 :
        statusImage = "../../assets/TrophyLeaderBoard/gold.png"
        break;
    case 1:
        statusImage = "../../assets/TrophyLeaderBoard/silver.png"
        break;
    case 2 :
        statusImage= "../../assets/TrophyLeaderBoard/bronze.png"
        break;
    default:
        statusImage = ""
}
</script>

<template>
    <div class="card-body p-0 m-3" style="text-align: center;">
        <div class="row">
            <div class="col-2"> 
                <router-link 
                :to="{
                    name:'profile',
                    params: {
                        username: props.user.username
                    }
                }"
                >
                <img class="profileImg" :src="profilePicture">
                </router-link>
            </div>
            <div class="col-1" style="margin: auto;" > 
                <img v-if="statusImage.length != 0" class="profileImg" :src="statusImage">
            </div>
            <div class="col-3 textDisplay">
                <p> {{ user.username }} </p>
            </div>
            <div class="col-3 textDisplay">
                <p> elo : {{ Math.ceil(user.elo) }} </p>
            </div> 
            <div class="col-3 textDisplay">
                <p> Games : {{ user.win}}w / {{ user.loss }}l</p>
            </div> 
        </div>
    </div>
</template>


<style scoped>
.profileImg {
    height: fit-content;
    width: 3vw;
    border-radius: 10%;
    display: block;
    text-align: center;
    margin: auto;
    margin-top: 1em;
}

.textDisplay {
    margin: auto;
    font-size: 1.1em;
}
</style>
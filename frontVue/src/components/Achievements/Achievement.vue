<script setup lang="ts">
import {computed} from 'vue'
import { type Achievement, type UserInfo } from '@/types';

const props = defineProps<{
    achievId : number
    achievementProp : Achievement
    achievProgress: number
    extendable: boolean
}>()

const emit = defineEmits(['toggleAchDisplay']);

let toggleAchiev = (async () => {
    if (props.extendable) {
        emit('toggleAchDisplay');
    }
});

const completed = computed(()=> {
    return (props.achievProgress == 1)
})
const barColor = computed(() => { 
    let progressVal: number = props.achievProgress*1;
    if (progressVal < 0.25) {
        return ("bg-danger")
    }
    else if ( 0.25 <= progressVal && progressVal < 0.5) {
        return("bg-warning")
    }
    else if (0.5 <= progressVal && progressVal < 0.75) {
        return("bg-info")
    }
    else {
       return ("bg-success")
    }
})


const displayProgress = computed(() => { 
        return (props.achievProgress * 100)
})
</script>

<template>
    <div class="card-body textDisplay p-0 m-3" :class="[completed ? 'AchievCompleted' : 'AchievUncompleted']">
        <div class="row">
            <div class="col-1">
                <template v-if="props.extendable"> 
                    <img class="HoverAch" :src="props.achievementProp.imageUrl"  @click="toggleAchiev">
                </template>
                <template v-else> 
                    <img :src="props.achievementProp.imageUrl">
                </template>
            </div>
            <div class="col-5 px-4">
                <p class="m-0"> {{ props.achievementProp.name }} </p>
                <p class="m-0"  style="color: grey;">  {{ props.achievementProp.description }} </p>               
            </div>
            <div class="col-6" style="margin: auto;"> 
                <div class="progress" >
                    <div class="progress-bar" 
                    role="progressbar" 
                    :style="{width: displayProgress +  '%'}"
                    :class="barColor"
                    ></div>
                </div>
                <div v-if="props.achievementProp.current !== -1" class="row" style="justify-content: space-between;"> 
                    <div class="col-4" style="text-align: left;"> {{ props.achievementProp.current }} </div>
                    <div v-if="props.achievementProp.max != 1" class="col-4" style="text-align: center;"> {{ Math.ceil(props.achievProgress * 100) }}% </div>
                    <div class="col-4" style="text-align: right;"> {{ props.achievementProp.max }} </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.HoverAch:hover {
    opacity: 1;
}

img {
    width: 50px;
    height: 50px;
}
.AchievCompleted {
    opacity: 1;
}

.AchievUncompleted {
    opacity: 0.5;
}
</style>
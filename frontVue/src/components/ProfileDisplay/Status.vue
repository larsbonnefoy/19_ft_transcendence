<script setup lang="ts">
//probably have to make this prop reactive
const props = defineProps<{
    status : string
}>()

let statusImg: string;

switch(props.status) {
    case"online":
        statusImg = "../../../assets/presence_available.png";
        break;
    case"offline":
        statusImg = "../../../assets/presence_offline.png";
        break;
    case "ingame":
        statusImg = "../../../assets/presence_busy.png";
        break;
    default:
        statusImg = "../../../assets/presence_offline.png";
}

</script>


<template>
    <div>
    <img class="statusImg" :src="statusImg">
    </div>
</template>

<style>
.statusImg{
    height: 15px;
    width: auto;
}
</style>
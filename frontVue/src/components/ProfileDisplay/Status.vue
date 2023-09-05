<script setup lang="ts">
//probably have to make this prop reactive
const props = defineProps<{
    status : string
}>()

let color: string;

switch(props.status) {
    case"online":
        color = "circle-green"
        break;
    case"offline":
        color = "circle-grey"
        break;
    case "ingame":
        color = "circle-blue"
        break;
    default:
        color = "circle-grey"
}
</script>


<template>
    <div :class="color" data-toggle="tooltip" data-placement="bottom" :title="props.status">
    </div>
</template>

<style>
.circle-blue {
    height: 0.8vw;
    width: 0.8vw;
    border-radius: 50%;
    background-color: #108fe3;
    margin: auto;
}

.circle-green {
    height: 0.8vw;
    width: 0.8vw;
    border-radius: 50%;
    background-color: #41952e;
    margin: auto;
}

.circle-grey {
    height: 0.8vw;
    width: 0.8vw;
    border-radius: 50%;
    background-color: #bdbfbb;
    margin: auto;
}</style>
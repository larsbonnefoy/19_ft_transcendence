<script setup lang="ts">
import Friend from '../Socials/Friend.vue';
import { computed } from 'vue';

const emit = defineEmits(['toggleFriendDisplay']);

let toggleFriends = (() => {
        emit('toggleFriendDisplay');
});

const props = defineProps<{
    useFriendList: Array<string>
}>()

// console.log(props.useFriendList);

const hasFriends = computed(() => {
	return (props.useFriendList.length != 0);
})

// console.log(hasFriends.value);


</script>

<template>
    <h2 style="text-align: center; " class="m-5 HoverTitle" @click.prevent="toggleFriends"> Friends </h2>
    <div v-if="hasFriends">
        <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-height: 70vh;">
            <div class="card-body">
            <h5 class="card-title">Friends</h5>
                <template v-for="(friend, index) in props.useFriendList" :key="index">
                    <Friend :login42="friend"></Friend>
                </template>
            </div>
        </div>
    </div>
    <div v-else> 
        <h3 style="text-align: center;"> No Friends </h3>
    </div>
</template>

<style scoped>

.HoverTitle:hover {
    cursor: pointer;
    text-decoration: underline;
}
</style>
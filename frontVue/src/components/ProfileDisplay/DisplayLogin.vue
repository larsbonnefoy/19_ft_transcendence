<script setup lang="ts">
import {ref} from 'vue'
import { useUserStore } from '@/stores/user';

const store = useUserStore();
console.log(store.getDisplayLogin);
const displayLogin = ref(store.getDisplayLogin);

</script>


<template>
   <div class="row" style="margin: auto;"> 
        <div class="col-6 textDisplay"> 
            Google 2FA
        </div>
        <div class="col-3 m-0">
            <input type="radio" class="btn-check" name="options-outlined" id="success-outlined" autocomplete="off" :checked="TwoFactor" @click="toggle">
            <label class="btn btn-outline-success" for="success-outlined">On</label>
        </div>
        <div class="col-3 m-0"> 
            <input type="radio" class="btn-check" name="options-outlined" id="danger-outlined" autocomplete="off" :checked="!TwoFactor" @click="toggle">
            <label class="btn btn-outline-danger" for="danger-outlined">Off</label>
        </div>
</template>
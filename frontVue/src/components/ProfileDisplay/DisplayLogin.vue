<script setup lang="ts">
import {ref} from 'vue'
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const displayLogin = ref(store.getDisplayLogin);

async function toggle(value: boolean) {
    try {
        await store.changeDisplayLogin(value);
    }
    catch(error: any) {
        console.log(error.message);
    }
}

</script>


<template>
    <div class="row" style="margin: auto;"> 
        <div class="col-6 textDisplay"> 
            Display 42 Login
        </div>
        <div class="col-3 m-0">
            <input type="radio" class="btn-check" name="displayLogin" id="DispayLoginOn" autocomplete="off" :checked="displayLogin" @click="toggle(true)">
            <label class="btn btn-outline-success" for="DispayLoginOn">On</label>
        </div>
        <div class="col-3 m-0"> 
            <input type="radio" class="btn-check" name="displayLogin" id="DisplayLoginOff" autocomplete="off" :checked="!displayLogin" @click="toggle(false)">
            <label class="btn btn-outline-danger" for="DisplayLoginOff">Off</label>
        </div>
    </div>
</template>

<style scoped> 
.textDisplay {
    text-align: left;
    margin: auto;
}

</style>
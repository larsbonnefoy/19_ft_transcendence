<script setup lang="ts">
import {ref, watch} from 'vue'

//get info from user store;
const TwoFactor = ref(false);
const defaultState = ref(true);
const messageDisplay = ref("");

/* Do nothing when default state is loaded */
function toggle() {
    if (TwoFactor.value == false) {
        messageDisplay.value = "Generate QR";
    }
    else {
        messageDisplay.value = "Destroy QR and stuff";
    }
    TwoFactor.value = !TwoFactor.value;
    defaultState.value = false;
}

</script>

<template>
    <div class="row"> 
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
            <div v-if="!defaultState">
                <p> {{ messageDisplay }} </p>
            </div>
    </div>
</template>

<style scoped>
.textDisplay {
    text-align: left;
    margin: auto;
}
</style>
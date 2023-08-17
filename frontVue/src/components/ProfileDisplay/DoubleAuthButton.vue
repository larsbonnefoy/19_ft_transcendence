<script setup lang="ts">
import axios from 'axios'
import DoubleAuthValidation from './DoubleAuthValidation.vue';
import {ref, watch} from 'vue'

//get info from user store;
const TwoFactor = ref(false);
const defaultState = ref(true);
const messageDisplay = ref("");
const QrCode = ref("");
/* Do nothing when default state is loaded */
async function toggle() {
    if (TwoFactor.value == false) {
        try {
            await getQR();
        }
        catch (error) {

        }
        messageDisplay.value = "Generate QR";
    }
    //Disable twofa
    else {
        try {
            const data = await axios.post('http://localhost:3000/twofa/disable/', {token: sessionStorage.getItem('jwt_token')});
            console.log(data.data);
        }
        catch (error) {

        }
    }
    TwoFactor.value = !TwoFactor.value;
    defaultState.value = false;
}

async function getQR() {
    try { 
        const data = await axios.post('http://localhost:3000/twofa/create/', {token: sessionStorage.getItem('jwt_token')});
        QrCode.value = data.data;
    }
    catch (error) { 
        console.error(error);
    }
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
                <div v-if="TwoFactor"> 
                <img class="QrImg my-5" :src="QrCode">
                <DoubleAuthValidation></DoubleAuthValidation>
                </div>
            </div>
    </div>
</template>

<style scoped>
.textDisplay {
    text-align: left;
    margin: auto;
}

.QrImg {
    height: 300px;
    width: 300px;
}
</style>
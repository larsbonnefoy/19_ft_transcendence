<script setup lang="ts">
import axios from 'axios'
import {ref, watch} from 'vue'
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const TwoFactor = ref(store.get2fa);

const defaultState = ref(true);
const QrCode = ref("");

//2fa validation
const max = 6
const digits2fa = ref();
const success2fa = ref();
const display2faFailed = ref(false);

function isDigit(e: any) {
    let char = String.fromCharCode(e.keyCode);
        if(/^[0-9]+$/.test(char)) {
            return true;
        }
        else {
            e.preventDefault();
        }
}


/* check if code is valid, if yes, enable 2fa*/
let submit = (async () => {
        try {
            const data = await axios.post('http://localhost:3000/twofa/verify/', {token: sessionStorage.getItem('jwt_token'), code: digits2fa.value});
            if (data.data == true) {
                success2fa.value = true;
                defaultState.value = true;
                store.change2fa(true);
            }
            else {
                display2faFailed.value = true;
                success2fa.value = false; 
            }
        }
        catch (error:any) {
            console.log(error);
        }
})

/* Do nothing when default state is loaded */
async function toggle() {
    if (TwoFactor.value == false) {
        try {        
            const data = await axios.post('http://localhost:3000/twofa/create/', {token: sessionStorage.getItem('jwt_token')});
            QrCode.value = data.data;
        }
        catch (error) { 
            console.error(error);
        }
    }
    else {
        store.change2fa(false);
    }
    TwoFactor.value = !TwoFactor.value;
    defaultState.value = false;
}

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
        <div v-if="!defaultState">
            <div v-if="TwoFactor"> <!-- Generate qr code when 2fa is enabled-->
                <img class="QrImg my-5" :src="QrCode">
                <input type="text" class="form-control codeInput" :maxlength="max" v-model="digits2fa" @keypress="isDigit" @keyup.enter="submit"/>
                <div  v-if="display2faFailed && !success2fa" class="alert alert-danger p-0" role="alert">
                        <p style="margin: auto;"> 2fa failed </p>
                </div>
            </div>
        </div>
        <div  v-if="success2fa" class="alert alert-success p-0" role="alert">
            <p style="margin: auto;"> 2fa ok </p>
        </div>
    </div>
</template>

<style scoped>
.textDisplay {
    text-align: left;
    margin: auto;
}

.QrImg {
    height: 200px;
    width: 200px;
}
</style>
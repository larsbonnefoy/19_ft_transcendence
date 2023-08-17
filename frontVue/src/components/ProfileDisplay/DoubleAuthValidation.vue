<script setup lang="ts">
import {ref} from 'vue'
import axios from 'axios';
const max = 6
const digits2fa = ref();
const success2fa = ref(false);
function isDigit(e: any) {
    let char = String.fromCharCode(e.keyCode);
        if(/^[0-9]+$/.test(char)) {
            return true;
        }
        else {
            e.preventDefault();
        }
}

let submit = (async () => {
        try {
            const data = await axios.post('http://localhost:3000/twofa/verify/', {token: sessionStorage.getItem('jwt_token'), code: digits2fa.value});
            
            console.log(data.data);
        }
        catch (error:any) {

        }
})
</script>

<template>
    <input type="text" class="form-control codeInput" :maxlength="max" v-model="digits2fa" @keypress="isDigit" @keyup.enter="submit"/>
</template>

<style>
.codeInput {
    width: 300px;
    text-align: center;
    margin: auto;
}
</style>
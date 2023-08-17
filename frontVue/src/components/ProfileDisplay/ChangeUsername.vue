<script setup lang="ts">
import {ref, computed} from 'vue'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useUserStore();
const username: any = ref(store.getUserName);
const max: number = 12;
const changedUsername = ref(false);
const changeSuccess = ref(false);
const textDisplay = ref("");
/*
Should set max lenght of username here
+ display error if call to change failed
*/
let submit = (async () => {
    if (username.value == "") {
        changeSuccess.value = false;
        textDisplay.value = "Username cannot be empty"
        
    }
    else { 
        try {
            const ret = await store.setName(username.value);
            router.push({ name: 'profile', params: { username: username.value } })//pt un pb avec le reload ici
            changeSuccess.value = true;
            textDisplay.value = "Username Changed!"
        }
        catch (error:any) {
            changeSuccess.value = false;
            textDisplay.value = "Username already in use!"
        }
    }
    changedUsername.value = true;
    setTimeout(() => changedUsername.value = false, 3000);
})

/* si le username contient _ ou - backi envoie une erreur*/
function isAlphaNum(e: any) {
    let char = String.fromCharCode(e.keyCode);
        if(/^[A-Za-z0-9_-]+$/.test(char)) {
            return true;
        }
        else {
            e.preventDefault();
        }
}

const lenLeft = computed(() => max - username.value.length);

</script>

<template>
    <div class="col-6 textDisplay"> 
        Change Username:
    </div>
    <div class="col-6">
        <div class="form-group">
            <div class="input-group">
                <input type="text" class="form-control" :maxlength="max" v-model="username" @keypress="isAlphaNum" @keyup.enter="submit"/>
                <div class="input-group-append">
                    <span class="input-group-text"> {{ lenLeft }}</span>
                </div>
            </div>
            <Transition name="slide-fade"> 
                <div  v-if="changedUsername" :class="changeSuccess ? 'alert-success' : 'alert-danger'" class="alert p-0" role="alert">
                    {{ textDisplay }}
                </div>
            </Transition>
        </div>
    </div>

</template>

<style scoped>
.textDisplay {
    text-align: left;
    margin: auto;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
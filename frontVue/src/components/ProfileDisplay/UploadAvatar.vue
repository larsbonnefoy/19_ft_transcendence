<script setup lang="ts">
//check if uploaded file is a png file (and if not too big)

import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useUserStore();

const file = ref(null);
let image : any = null;

const showMessage = ref(false);
const changeSuccess = ref(false);
const textDisplay = ref("");

let uploadFile = (async (e : any) => {
	image = file.value;
	// console.log("update image");
	// console.log(image.files[0]);
});

let submitFile = (async () => {
	showMessage.value = true;
	setTimeout(() => showMessage.value = false, 3000);
	if (image === null) {
		// console.log("can't upload empty file");
		changeSuccess.value = false;
		textDisplay.value = "You must select a file";
		return ;
	}
	console.log(image.files[0]);
	try {
		await store.setAvatar(image.files[0]);
        // router.push({ name: 'profile', params: { username: store.getUserName } });
		changeSuccess.value = true;
		textDisplay.value = "Avatar changed !";
		store.fetchUser();
        // console.log("submiting file");
    }
    catch (error:any) {
		// console.log(error);
		changeSuccess.value = false;
		textDisplay.value = "Avatar update failed (check size)";
        // console.log("submit file failed");
    }
	image = null;
});


// onMounted(() => {
//   file.value = null;
// });
</script>

<template>
<div class="my-3">
  <!-- <label for="formFileSm" class="form-label">Upload Avatar</label>
  <input class="form-control form-control-sm" id="formFileSm" type="file" accept="image/*"> -->

        <input type="file" @change="uploadFile" ref="file" accept="image/*">
        <button type="button" class="btn btn-outline-secondary" @click="submitFile">Upload!</button>
		<Transition name="slide-fade">
			<div v-if="showMessage" :class="changeSuccess ? 'alert-success' : 'alert-danger'" class="alert p-0" role="alert">
				{{ textDisplay }}
			</div>
		</Transition>
  <!-- <label>
    <button></button>
    <input @change="submit" type="file" ref="file" accept="image/gif, 
      image/jpeg, image/png" hidden/>
  </label> -->


  <!-- <input type="file" id="upload-file" name="upload-file" hidden>
  <label for="upload-file" refs="upload-file" class="file-btn">Choose a file</label> -->
</div>
</template>
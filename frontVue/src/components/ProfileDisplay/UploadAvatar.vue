<script setup lang="ts">
//check if uploaded file is a png file (and if not too big)

import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useUserStore();

const file = ref(null);
let image : any = null;

let uploadFile = (async (e : any) => {
	image = file.value;
	console.log("update image");
	// console.log(image.files[0]);
});

let submitFile = (async () => {
	if (image === null) {
		console.log("can't upload empty file");
		return ;
	}
	console.log(image.files[0]);
	try {
        const ret = await store.setAvatar(image.files[0]);
        router.push({ name: 'profile', params: { username: store.getUserName } });
        console.log("submiting file");
    }
    catch (error:any) {
        console.log("submit file failed");
    }
});


// onMounted(() => {
//   file.value = null;
// });
</script>

<template>
<div class="my-3">
  <!-- <label for="formFileSm" class="form-label">Upload Avatar</label>
  <input class="form-control form-control-sm" id="formFileSm" type="file" accept="image/*"> -->

        <input type="file" @change="uploadFile" ref="file">
        <button @click="submitFile">Upload!</button>

  <!-- <label>
    <button></button>
    <input @change="submit" type="file" ref="file" accept="image/gif, 
      image/jpeg, image/png" hidden/>
  </label> -->


  <!-- <input type="file" id="upload-file" name="upload-file" hidden>
  <label for="upload-file" refs="upload-file" class="file-btn">Choose a file</label> -->
</div>
</template>
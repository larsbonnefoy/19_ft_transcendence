<script setup lang="ts">
import {useRouter} from 'vue-router'
const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;
if (urlParams.has('code')) {
	code = urlParams.get('code');
}
else {
  router.push("/");
}
const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
console.log("ayo");

const jwtToken : string = (await response.json())['jwt_token']
console.log(jwtToken)
//  get user id.
sessionStorage.setItem('jwt_token', jwtToken);
console.log("ended");


router.push('/home');

</script>

<template>
    <p> auth </p>
	<!-- <span>code: {{ code }}</span> -->
	<!-- <span> status: {{ response.status }} </span> -->
</template> 


<style>
</style>

<script setup lang="ts">
import {useRouter} from 'vue-router'
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;
if (urlParams.has('code'))
{
	code = urlParams.get('code');
}
else 
{
	code = "yo"; 
}
const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
console.log("ayo");
// const resJson : any = await response.json();
// console.log(resJson);
const jwtToken : string = (await response.json())['jwt_token']
console.log(jwtToken)
sessionStorage.setItem('jwt_token', jwtToken);
console.log("ended");

const router = useRouter();
router.push('/showUsers');

</script>

<template>
    <p> auth </p>
	<!-- <span>code: {{ code }}</span> -->
	<!-- <span> status: {{ response.status }} </span> -->
</template> 


<style>
</style>

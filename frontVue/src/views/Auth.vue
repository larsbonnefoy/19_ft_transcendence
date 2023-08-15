<script setup lang="ts">
import {useRouter} from 'vue-router'
const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;
try
{
 	if (!urlParams.has('code'))
		throw "node code in query";
	code = urlParams.get('code');
	const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
	if (response.status != 200 && response.status != 201)
		throw "getToken failed";
	console.log("ayo");

	const jwtToken : string = (await response.json())['jwt_token'];
	// const jwtToken : string = "badToken" 
	console.log(jwtToken)
	//  get user id.
	sessionStorage.setItem('jwt_token', jwtToken);
	console.log("ended");
    router.push('/home');
}
catch (error)
{
  console.log("yooo : "+ error);
  router.push("/");
}

</script>

<template>
    <p> auth </p>
	<!-- <span>code: {{ code }}</span> -->
	<!-- <span> status: {{ response.status }} </span> -->
</template> 


<style>
</style>

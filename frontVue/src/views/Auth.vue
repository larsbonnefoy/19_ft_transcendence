<script setup lang="ts">
import axios from "axios"
import {useRouter} from 'vue-router'

const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;

//TODO check error throws here, display right information (=> reload right page)
try
{
 	if (!urlParams.has('code'))
		throw "node code in query";
	code = urlParams.get('code');
	const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
	if (response.status != 200 && response.status != 201)
		throw "getToken failed";

	const jwtToken : string = (await response.json())['jwt_token'];
	sessionStorage.setItem('jwt_token', jwtToken);

	const res = await axios.post('http://localhost:3000/twofa/status/', {token: sessionStorage.getItem('jwt_token')});
	if (res.data == true) {
		router.push('/home');
	}
	else {
		router.push('/home');
	};
}
catch (error)
{
  console.log("yooo : "+ error);
  router.push("/");
}

</script>

<template>
	<!-- Could display loading state here -->
    <p> auth </p>
	<!-- <span>code: {{ code }}</span> -->
	<!-- <span> status: {{ response.status }} </span> -->
</template> 


<style>
</style>

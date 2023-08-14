<script setup lang="ts">
import {useRouter} from 'vue-router'
const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;
if (urlParams.has('code')) {
	code = urlParams.get('code');
	try {
		const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
		const jwtToken : string = (await response.json())['jwt_token']
		console.log(jwtToken)
		//  get user id.
		sessionStorage.setItem('jwt_token', jwtToken);
		console.log("auth ended, going to home");
		router.push('/home');
	}
	catch {
		router.push("/");
	}
}
else {
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

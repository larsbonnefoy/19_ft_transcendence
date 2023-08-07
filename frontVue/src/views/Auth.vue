<script setup lang="ts">
const urlParams = new URLSearchParams(window.location.search)
// const response : Response = await fetch(`http://localhost:3000/getToken?{this.$route.query.test}`);
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
const resJson : any = await response.json();
// if (response.ok)
console.log(resJson['access_token']);
</script>

<template>
    <h1> auth </h1>
	<span>code: {{ code }}</span>
	<span> status: {{ response.status }} </span>
</template> 


<style>
</style>

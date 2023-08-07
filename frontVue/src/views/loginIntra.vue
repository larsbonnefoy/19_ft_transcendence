<script setup lang="ts">

</script>

<template>
    <h1> LoginIntra view </h1>
</template> 
export default {

  created() {
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2f106f36bdac3ac02f5555c178177423c9af72f59dc797d1fd439cdec8ca9985&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi42%2FgetToken&response_type=code";
  },

};
<style>
</style>

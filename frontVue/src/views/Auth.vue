<script setup lang="ts">
import axios from "axios"
import {ref} from 'vue'
import {useRouter} from 'vue-router'


/* ON SETUP */
const router = useRouter();
const urlParams = new URLSearchParams(window.location.search);
let code : string | null;

const max: number = 6;
const digits2fa = ref();
const has2fa = ref(false);
const success2fa = ref(true);

//TODO check error throws here, display right information (=> reload right page)
try
{
 	if (!urlParams.has('code'))
		throw "node code in query";
	code = urlParams.get('code');

	//create tmp token here {sub:login42 , isAuth=False}
	const response : Response = await fetch(`http://localhost:3000/api42/getToken?code=${code}`);
	if (response.status != 200 && response.status != 201)
		throw "getToken failed";

	const jwtToken : string = (await response.json())['jwt_token'];
	sessionStorage.setItem('jwt_token', jwtToken);
 
	const res = await axios.post('http://localhost:3000/twofa/status/', {token: sessionStorage.getItem('jwt_token')});
	if (res.data == true) {
		has2fa.value = true;
		//If 2fa valid create real token, if note reroute 
		//create real token here {sub:login42 , isAuth=True}

	}
	else {
		//create real token here {sub:login42 , isAuth=True}

		router.push('/home');
	};
}
catch (error)
{
  console.log("yooo : "+ error);
  router.push("/");
}

/* FUNCTIONS */
function isDigit(e: any) {
    let char = String.fromCharCode(e.keyCode);
        if(/^[0-9]+$/.test(char)) {
            return true;
        }
        else {
            e.preventDefault();
        }
}

let submit = (async () => {
        try {
            const data = await axios.post('http://localhost:3000/twofa/verify/', {token: sessionStorage.getItem('jwt_token'), code: digits2fa.value});
            console.log(data.data);
            if (data.data == true) {
				router.push("/home")
            }
            else {
				success2fa.value = false;
            }
        }
        catch (error:any) {
            console.log(error);
        }
})

</script>

<template>
	<div v-if="has2fa"> 
		<div class="container mt-5">
			<div class="row justify-content-center">
				<div class="col-md-6">
					<div class="card">
						<div class="card-header">
						Enter 2fa
						</div>
						<div class="card-body">
							<form>
							<div class="d-flex justify-content-between">
								<input type="text" class="form-control codeInput" :maxlength="max" v-model="digits2fa" @keypress="isDigit" @keyup.enter="submit"/>
								<button @click.prevent="submit" type="submit" class="btn btn-outline-info">Auth</button>
							</div>
							<Transition name="slide-fade">
							<div  v-if="!success2fa" class="alert p-0 alert-danger m-1" role="alert" style="text-align: center;">
									<p> Wrong 2fa code </p>
							</div>
							</Transition>
							</form>
						</div>
					</div>
				</div>
			</div>
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

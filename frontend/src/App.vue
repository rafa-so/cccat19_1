
<script setup lang="ts">
import { ref } from 'vue';

  const accountId = ref("");

  const form = ref({
    name: "",
    email: "",
    cpf: "",
    password: "",
    isPassenger: false
  });

  function fill() {
    form.value.name = "John Doe";
    form.value.email = `john.doe${Math.random()}@gmail.com`;
    form.value.cpf = "97456321558";
    form.value.password = "123456";
    form.value.isPassenger = true;
  }

  async function signup() {
      console.log("signup function")
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form.value)
      });

      const output = await response.json();
      accountId.value = output.accountId;

    }

</script>

<template>
  <div>
    <input type="text" placeholder="Name" v-model="form.name"/>
  </div>
  <div>
    <input type="text" placeholder="Email" v-model="form.email"/>
  </div>
  <div>
    <input type="text" placeholder="Cpf" v-model="form.cpf"/>
  </div>
  <div>
    <input type="text" placeholder="Password" v-model="form.password"/>
  </div>
  <div>
    <input type="checkbox" v-model="form.isPassenger" /> Passenger
  </div>
  <br />
  {{ form }}
  <br />
  {{ accountId }}
  <br />
  <div>
    <button @click="signup()">Signup</button>
    <button @click="fill()">Fill</button>
  </div>
</template>

<style scoped></style>

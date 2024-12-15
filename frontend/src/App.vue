<script setup lang="ts">
  import { ref } from 'vue';
 
  const form = ref({
    name: "",
    email: "",
    cpf: "",
    password: "",
    isPassenger: false
  });
  const accountId = ref("");

  function fill() {
    form.value.name = "John Doe";
    form.value.email = `john.doe.${Math.random()}@gmail.com`;
    form.value.cpf = "74582712053";
    form.value.password = '123456';
    form.value.isPassenger = true;
  }

  async function signup() {
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(form.value)
    });

    const output = await response.json();
    accountId.value = output.accountId;
  }
</script>

<template>
  <div>
    <input type="text" placeholder="name" v-model="form.name"/>
  </div>
  <div>
    <input type="text" placeholder="email" v-model="form.email"/>
  </div>
  <div>
    <input type="text" placeholder="cpf" v-model="form.cpf"/>
  </div>
  <div>
    <input type="text" placeholder="password" v-model="form.password"/>
  </div>
  <div>
    <input type="checkbox" v-model="form.isPassenger"/> Passenger
  </div>
  {{ form }}
  <br />
  {{ accountId }}
  <br />
  <div>
    <button @click="signup()">Signup</button>
    <button @click="fill()">Fill</button>
  </div>
</template>

<style scoped>
</style>

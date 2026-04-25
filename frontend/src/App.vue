
<script setup lang="ts">
import { ref } from 'vue';

  const accountId = ref("");
  const status = ref("");
  const message = ref("");

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
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form.value)
      });

      const output = await response.json();
      if (output.accountId) {
        accountId.value = output.accountId;
        status.value = "success";
        message.value = output.message;
      } else {
        status.value = "Error";
        message.value = output.message;
      }
    }

</script>

<template>
  <div>
    <input type="text" class="input-name" placeholder="Name" v-model="form.name"/>
  </div>
  <div>
    <input type="text" class="input-email" placeholder="Email" v-model="form.email"/>
  </div>
  <div>
    <input type="text" class="input-cpf" placeholder="Cpf" v-model="form.cpf"/>
  </div>
  <div>
    <input type="text" class="input-password" placeholder="Password" v-model="form.password"/>
  </div>
  <div>
    <input type="checkbox" class="input-is-passenger" v-model="form.isPassenger" /> Passenger
  </div>
  <br />
  {{ form }}
  <br />
  <span class="span-status">{{ status }}</span>
  <br />
  <span class="span-message">{{ message }}</span>
  <br />
  <div>
    <button class="button-signup" @click="signup()">Signup</button>
    <button @click="fill()">Fill</button>
  </div>
</template>

<style scoped></style>

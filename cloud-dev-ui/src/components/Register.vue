<template>
  <v-card width="100%" height="100%" class="d-flex justify-center align-center">
    <v-card class="pa-4">
      <v-card-title>Registration</v-card-title>
      <v-card-subtitle class="pb-8">
        Please register with a valid email and password.
      </v-card-subtitle>
      <v-form :on-submit="register">
        <v-text-field
          :rules="emailRules"
          v-model="email"
          label="Email"
          required
          outlined
        ></v-text-field>
        <v-text-field
          :rules="passwordRules"
          v-model="password"
          label="Password"
          required
          outlined
          type="password"
          @keyup.enter="register"
        ></v-text-field>
        <v-btn @click="register" color="primary" width="100%">Register</v-btn>
      </v-form>
    </v-card>

    <v-btn
      class="position-absolute top-0 left-0 ma-5"
      icon="mdi-arrow-left"
      slim
      v-tooltip="'Back to Login'"
      @click="emit('back')"
    />
    <v-btn
      class="position-absolute top-0 right-0 ma-5"
      :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
      slim
      v-tooltip="'Toggle Theme'"
      @click="appStore.toggleTheme()"
    />

    <v-alert
      v-if="error"
      closable
      type="error"
      class="position-absolute bottom-0 ma-5 slide-y-transition"
      >{{ error }}
    </v-alert>
  </v-card>
</template>

<script lang="ts" setup>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

const emit = defineEmits(["back"]);

const auth = useFirebaseAuth();

const emailRules = [
  (value: any) => {
    if (value) return true;

    return "E-mail is required.";
  },
  (value: any) => {
    if (/.+@.+\..+/.test(value)) return true;

    return "E-mail must be valid.";
  },
];
const passwordRules = [
  (value: any) => {
    if (value) return true;
    return "Password is required.";
  },
  (value: any) => {
    if (value.length >= 6) return true;
    return "Password must be at least 6 characters.";
  },
];
const email = ref("");
const password = ref("");

const error = ref(null);

function register() {
  error.value = null;
  createUserWithEmailAndPassword(auth!, email.value, password.value).catch(
    (err) => {
      error.value = err.message;
    },
  );
}
</script>

<style scoped>
/* Optional: Add styles as needed */
</style>

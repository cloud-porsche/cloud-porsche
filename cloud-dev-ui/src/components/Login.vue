<template>
  <v-card width="100%" height="100%" class="d-flex justify-center align-center">
    <v-card class="pa-4">
      <v-card-title>Authentication</v-card-title>
      <v-card-subtitle class="pb-8">
        You need to be authenticated to access this page.
      </v-card-subtitle>
      <v-form :on-submit="signIn">
        <v-text-field
          :rules="emailRules"
          v-model="email"
          label="Email"
          required
          outlined
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          required
          outlined
          type="password"
        ></v-text-field>
        <v-btn @click="signIn" color="primary" width="100%">Confirm</v-btn>
      </v-form>
      <v-divider class="ma-4"></v-divider>
      <v-btn-group
        class="d-flex justify-center align-center"
        rounded
        variant="outlined"
        divided
      >
        <v-btn
          v-if="allowGoogle"
          class="pa-2"
          icon="mdi-google"
          @click="signinPopup(googleProvider)"
          v-tooltip:bottom="'Sign in with Google'"
        >
        </v-btn>
        <v-btn
          v-if="allowGithub"
          class="pa-2"
          icon="mdi-github"
          @click="signinPopup(githubProvider)"
          v-tooltip:bottom="'Sign in with Github'"
        >
        </v-btn>
      </v-btn-group>
    </v-card>

    <v-btn
      class="position-absolute top-0 right-0 ma-5"
      :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
      slim
      v-tooltip="'Toggle Theme'"
      @click="appStore.toggleTheme()"
    />

    <v-alert v-if="error" type="error" class="position-absolute bottom-0 ma-5"
      >{{ error }}
    </v-alert>
  </v-card>
</template>

<script lang="ts" setup>
import { useFirebaseAuth } from "vuefire";
import {
  AuthProvider,
  getRedirectResult,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

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
const email = ref("");
const password = ref("");

const allowGoogle = import.meta.env.VITE_DISABLE_OAUTH_GOOGLE !== "true";
const googleProvider = new GoogleAuthProvider();
const allowGithub = import.meta.env.VITE_DISABLE_OAUTH_GITHUB !== "true";
const githubProvider = new GithubAuthProvider();

const error = ref(null);

function signIn() {
  error.value = null;
  signInWithEmailAndPassword(auth!, email.value, password.value).catch(
    (reason) => {
      console.error("Failed sign", reason);
      error.value = reason;
    },
  );
}

onMounted(() => {
  getRedirectResult(auth!).catch((reason) => {
    console.error("Failed redirect result", reason);
    error.value = reason;
  });
});

function signinPopup(provider: AuthProvider) {
  error.value = null;
  signInWithPopup(auth!, provider).catch((reason) => {
    console.error("Failed sign", reason);
    error.value = reason;
  });
}
</script>

<style scoped>
/* Optional: Add styles as needed */
</style>

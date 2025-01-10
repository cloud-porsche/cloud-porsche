<template>
  <v-card width="100%" height="100%" class="d-flex justify-center align-center">
    <v-card class="pa-4" :loading="appStore.authLoading">
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
          @keyup.enter="signIn"
        ></v-text-field>
        <v-btn @click="signIn" color="primary" width="100%">Confirm</v-btn>
      </v-form>
      <v-card-text class="w-100 text-center text-grey">
        <span v-if="tenantId === (isProd ? 'free-tier' : 'free')"
          >No Account yet? Register
          <a class="register-link text-accent" @click="openRegister"
            >here</a
          ></span
        >
        <br /><br /><small
          >Forgot your Password?<br />
          Enter your email and click
          <a class="register-link text-accent" @click="resetPassword"
            >Reset Password</a
          ></small
        >
      </v-card-text>
      <v-divider
        class="ma-4"
        v-if="tenantId === (isProd ? 'free-tier' : 'free')"
      ></v-divider>
      <v-btn-group
        v-if="tenantId === (isProd ? 'free-tier' : 'free')"
        class="d-flex justify-center align-center"
        rounded
        variant="outlined"
        divided
      >
        <v-btn
          v-if="allowGoogle"
          class="pa-2"
          icon="mdi-google"
          @click="signInPopup(googleProvider)"
          v-tooltip:bottom="'Sign in with Google'"
        >
        </v-btn>
        <v-btn
          v-if="allowGithub"
          class="pa-2"
          icon="mdi-github"
          @click="signInPopup(githubProvider)"
          v-tooltip:bottom="'Sign in with GitHub'"
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

    <v-alert
      v-if="error"
      closable
      type="error"
      class="position-absolute bottom-0 ma-5 slide-y-transition"
      >{{ error }}
    </v-alert>

    <v-alert
      v-if="successMessage"
      closable
      type="success"
      class="position-absolute bottom-0 ma-5"
      >{{ successMessage }}
    </v-alert>
  </v-card>

  <v-bottom-sheet v-model="registerSheet" fullscreen retain-focus :scrim="true">
    <Register
      @back="registerSheet = false"
      @verificationSend="
        successMessage = 'Verification Email sent to your email adress.'
      "
    />
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import { useFirebaseAuth } from "vuefire";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useAppStore } from "@/stores/app";

const isProd = import.meta.env.PROD;

const appStore = useAppStore();
const isDark = computed(() => appStore.isDark);

const auth = useFirebaseAuth();

const route = useRoute();
const tenantId = computed(() => (route.params as any)["tenantId"]);

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

const error = ref<string | null>(null);
const successMessage = ref("");

const registerSheet = ref(false);

function signIn() {
  error.value = null;
  signInWithEmailAndPassword(auth!, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user.emailVerified) {
        error.value =
          "Email not verified. Please check your inbox to verify your email before logging in.";
      } else {
        successMessage.value = "Successfully logged in!";
      }
    })
    .catch((reason) => {
      console.error("Failed sign-in", reason);
      error.value = reason;
    });
}

function signInPopup(provider: AuthProvider) {
  error.value = null;
  signInWithPopup(auth!, provider).catch((reason) => {
    console.error("Failed sign", reason);
    error.value = reason;
  });
}

function openRegister() {
  registerSheet.value = true;
}

function resetPassword() {
  error.value = null;
  sendPasswordResetEmail(auth!, email.value)
    .then(() => {
      successMessage.value = "Password reset email sent.";
    })
    .catch((reason) => {
      console.error("Failed reset", reason);
      error.value = "Please enter a valid email address.";
    });
}
</script>

<style scoped>
.register-link {
  cursor: pointer;
  text-decoration: underline;
}
</style>

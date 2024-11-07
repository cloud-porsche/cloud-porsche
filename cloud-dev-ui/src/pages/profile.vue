<template>
  <v-toolbar v-if="user">
    <v-toolbar-title>
      Logged in as
      {{ user?.displayName ?? "Anonymous" }}
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      class="me-4"
      variant="tonal"
      append-icon="mdi-logout"
      color="error"
      @click="signOut(auth!)"
      text="Sign Out"
    >
    </v-btn>
  </v-toolbar>
  <v-responsive v-if="user">
    <v-card>
      <v-card-item v-for="entry of Object.entries(user!)">
        <v-card-title>{{ entry[0] }}</v-card-title>
        <v-card-text>{{ entry[1] }}</v-card-text>
      </v-card-item>
    </v-card>
  </v-responsive>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth();
const user = useCurrentUser();
</script>
<style scoped></style>

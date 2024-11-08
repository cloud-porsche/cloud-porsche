<template>
  <v-container v-if="user" class="pt-4">
    <!-- Profile Card -->
    <v-card class="mt-4">
      <!-- Profile Picture Section -->
      <v-card-item class="d-flex justify-center">
        <v-avatar size="150" class="mt-4">
          <!-- Check if userPhoto exists, otherwise show user icon -->
          <v-img 
            v-if="userPhoto"
            :src="userPhoto"
            alt="User Photo"
          >
            <template v-slot:error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon color="error" icon="mdi-image-broken-variant"></v-icon>
              </div>
            </template>
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  size="24"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
          <!-- Placeholder icon if no userPhoto -->
          <v-icon v-else color="primary" background-color="secondary" size="40">mdi-account</v-icon>
        </v-avatar>
      </v-card-item>

      <!-- Profile Details Section -->
      <v-card-item>
        <v-row justify="space-between">
          <v-col align="right">Display Name</v-col>
          <v-col>{{ user?.displayName ?? "Anonymous" }}</v-col>
        </v-row>
      </v-card-item>
         
      <v-card-item>
        <v-row justify="space-between">
          <v-col align="right">Emailadress</v-col>
          <v-col>{{ user?.email ?? "No Email" }}</v-col>
        </v-row>
      </v-card-item>

      <!-- Profile Actions Section -->
      <v-card-actions>
        <v-btn color="error" @click="signOut(auth!)" class="me-4" variant="tonal" append-icon="mdi-logout">Log Out</v-btn>
        <v-spacer/>
        <v-btn color="primary" @click="openEditDialog" class="me-4" variant="tonal" append-icon="mdi-pencil">Edit</v-btn>
      </v-card-actions>
    
    <v-alert
      v-if="successMessage"
      closable
      type="success"
      class="position-absolute top-0 ma-5 slide-y-transition"
    >{{ successMessage }}
    </v-alert>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="400">
      <v-card>
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="formValid">
            <v-text-field
              label="Display Name"
              v-model="editData.displayName"
              :rules="[v => !!v || 'Display name is required']"
              required
            ></v-text-field>
            <v-file-input
              label="Profile Photo"
              v-model="editData.photo"
              accept="image/*"
              prepend-icon="mdi-camera"
              max-width="400"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text="true" @onclick="resetPassword">Reset Password</v-btn>
          <v-spacer />
          <v-btn color="error" text="true" @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="primary" text="true" :disabled="!formValid" @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { signOut, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { get, post } from "@/http/http";

const auth = useFirebaseAuth();
const user = useCurrentUser();

const editDialog = ref(false);
const editData = ref({
  displayName: user.value?.displayName ?? "",
  photo: null as File | null,
});
const formValid = ref(false);
const userPhoto = ref(null);

const successMessage = ref("");

const openEditDialog = () => {
  editData.value.displayName = user.value?.displayName ?? "";
  editData.value.photo = null;
  editDialog.value = true;
};

const closeEditDialog = () => {
  editDialog.value = false;
};

const saveChanges = async () => {
  try {
    if (user.value && auth) {
      let fileName = "";
      if (editData.value.photo) {
        fileName = user.value.uid + "." + editData.value.photo.name.split('.').pop();
        const newFile = new File([editData.value.photo], fileName, { type: editData.value.photo.type });
        console.log("Uploading photo:", newFile);
        await uploadPhoto(newFile);
      }
      // Update profile in Firebase
      await updateProfile(user.value, {
        displayName: editData.value.displayName,
        photoURL: fileName !== "" ? fileName : user.value.photoURL
      });
      if (fileName) userPhoto.value = await fetchImage(fileName);
    }
    editDialog.value = false;
    successMessage.value = "Profile updated!";
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

onMounted(async () => {
  if (user.value?.photoURL) {
    userPhoto.value = await fetchImage(user.value.photoURL);
  }
});

async function fetchImage(fileName: string) {
  if (!fileName) return "";
  try {
    const response = await get(`/v1/storage/${fileName}`);
    if (!response.ok) throw new Error("Failed to fetch signed URL");
    const { signedUrl } = await response.json();
    return signedUrl;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    return "";
  }
}

const uploadPhoto = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    await post("/v1/storage/upload", formData);
  } catch (error) {
    console.error("Failed to upload photo:", error);
  }
};

const resetPassword = () => {
  if (user.value?.email) {
    sendPasswordResetEmail(auth!, user.value.email)
      .then(() => {
        ("Password reset email sent!");
      })
      .catch((error) => {
        console.error("Error sending reset email:", error);
      });
  }
  successMessage.value = "Password reset email sent!";
};
</script>

<template>
  <div>
    <v-progress-linear
      v-if="appStore.authLoading"
      indeterminate
      color="primary"
    />
    <v-container v-else-if="user" class="d-flex justify-center align-center">
      <!-- Profile Card -->
      <v-card
        class="pa-4"
        width="fit-content"
        min-width="50%"
        :loading="appStore.authLoading"
      >
        <!-- Profile Picture Section -->
        <v-card-item class="d-flex justify-center">
          <label for="pb-upload">
            <v-avatar
              id="pb"
              class="rounded-circle bg-primary"
              size="120"
              text="User Photo"
              rounded
              border
            >
              <!-- Check if userPhoto exists, otherwise show user icon -->
              <v-img v-if="userPhoto" :src="userPhoto" alt="User Photo" cover>
                <template v-slot:error>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon
                      color="error"
                      icon="mdi-image-broken-variant"
                    ></v-icon>
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
              <v-icon v-else class="opacity-80" color="background" size="80"
                >mdi-account
              </v-icon>
            </v-avatar>
          </label>

          <v-file-input
            id="pb-upload"
            class="d-none"
            v-model="editData.photo"
            accept="image/*"
            prepend-icon="mdi-camera"
            max-width="400"
            @update:modelValue="saveChanges"
          ></v-file-input>
        </v-card-item>

        <v-divider class="ma-4"></v-divider>

        <v-card-item>
          <!-- Profile Details Section -->
          <div class="card-grid">
            <span class="text-end">Display Name:</span>
            <span
              class="d-flex align-center"
              v-tooltip:bottom="
                user?.displayName
                  ? {
                      text: user?.displayName,
                      openOnClick: true,
                      persistent: false,
                    }
                  : undefined
              "
              >{{ user?.displayName ?? "Anonymous" }}
              <v-btn
                class="ms-2"
                color="primary"
                @click="openEditDialog"
                size="x-small"
                icon="mdi-pencil"
                variant="tonal"
              >
              </v-btn>
            </span>
            <span class="text-end">Email:</span>
            <span
              v-tooltip:bottom="
                user?.email
                  ? {
                      text: user?.email,
                      openOnClick: true,
                      persistent: false,
                    }
                  : undefined
              "
              >{{ user?.email ?? "No Email" }}</span
            >
          </div>
        </v-card-item>

        <v-divider class="ma-4"></v-divider>

        <!-- Profile Actions Section -->
        <v-card-actions>
          <v-row>
            <v-col class="text-end">
              <v-btn color="warn" variant="tonal" @click="resetPassword"
                >Reset Password
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="error"
                @click="signOut(auth!)"
                variant="tonal"
                append-icon="mdi-logout"
                >Log Out
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

        <div v-if="!['free', 'free-tier'].includes(tenantId)">
          <v-divider class="ma-4"></v-divider>

          <span class="d-flex justify-center text-center pa-2 text-body-2">
            <v-btn
              text="Delete Account"
              variant="text"
              size="8"
              color="error"
              flat
              @click="openDeleteDialog"
            ></v-btn>
          </span>
        </div>
      </v-card>

      <v-dialog
        v-model="deleteDialogOpen"
        max-width="fit-content"
        @afterLeave="closeDeleteDialog"
      >
        <v-card class="pa-4">
          <v-card-title
            >Delete
            {{
              appStore.hasAdminAccess &&
              !["free", "free-tier"].includes(tenantId)
                ? "Tenant"
                : "Account"
            }}
          </v-card-title>
          <v-divider class="pb-4"></v-divider>
          <v-card-subtitle>
            <p class="text-body-1">
              {{
                appStore.hasAdminAccess &&
                !["free", "free-tier"].includes(tenantId)
                  ? "WARNING! You are about to delete your whole Subscription and all associated data with it!"
                  : "Are you sure you want to delete your account?"
              }}
              <br />
              <br />
              This action cannot be undone.
              <br />
              Confirm key: <b>{{ tenantId }}</b>
            </p>
          </v-card-subtitle>
          <v-card-text>
            <v-form ref="deleteForm" v-model="deleteFormValid">
              <v-text-field
                label="Confirm deletion"
                v-model="deleteConfirm"
                variant="outlined"
                :rules="[
                  (v) => !!v || 'Confirm deletion needed',
                  (v) => v === tenantId || 'Confirm key is incorrect',
                ]"
                required
              ></v-text-field>
              <v-divider class="pa-2 mt-4" />
              <v-btn
                color="error"
                text="true"
                class="w-100"
                @click="confirmDelete"
                >Delete
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-alert
        v-if="successMessage"
        closable
        type="success"
        class="position-absolute bottom-0 ma-16"
        >{{ successMessage }}
      </v-alert>

      <!-- Edit Dialog -->
      <v-dialog
        v-model="editDialog"
        max-width="400"
        @afterLeave="closeEditDialog"
      >
        <v-card>
          <v-card-title>Edit Profile</v-card-title>
          <v-card-text>
            <v-form ref="editForm" v-model="formValid">
              <v-text-field
                label="Display Name"
                v-model="editData.displayName"
                :rules="[(v) => !!v || 'Display name is required']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" text="true" @click="closeEditDialog"
              >Cancel
            </v-btn>
            <v-btn
              color="primary"
              text="true"
              :disabled="!formValid"
              @click="saveChanges"
              >Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { sendPasswordResetEmail, signOut, updateProfile } from "firebase/auth";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { del, get, post } from "@/http/http";
import { useAppStore } from "@/stores/app";
import router from "@/router";

const appStore = useAppStore();
const auth = useFirebaseAuth();
const user = useCurrentUser();

const tenantId = computed(
  () => (router.currentRoute.value.params as any).tenantId,
);

const editDialog = ref(false);
const editData = ref({
  displayName: user.value?.displayName ?? "",
  photo: null as File | null,
});
const formValid = ref(false);
const deleteFormValid = ref(false);
const userPhoto = ref(null);

if (user.value?.photoURL) {
  userPhoto.value = await fetchImage(user.value.photoURL);
}
watch(user, async (newUser) => {
  if (newUser) {
    userPhoto.value = newUser.photoURL
      ? await fetchImage(newUser.photoURL)
      : null;

    const redirectRoute = router.currentRoute.value.query.redirect;
    if (redirectRoute) router.push({ path: redirectRoute as string });
  }
});

const successMessage = ref("");

const openEditDialog = () => {
  editDialog.value = true;
};

const closeEditDialog = () => {
  editDialog.value = false;
  editData.value.displayName = user.value?.displayName ?? "";
};

const saveChanges = async () => {
  try {
    if (user.value && auth) {
      let fileName = "";
      let newFileType = "";
      if (editData.value.photo) {
        newFileType += editData.value.photo.name.split(".").pop();
        fileName = user.value.uid + "." + newFileType;
        const newFile = new File([editData.value.photo], fileName, {
          type: editData.value.photo.type,
        });
        await uploadPhoto(newFile);
        if (
          userPhoto.value &&
          user.value.photoURL?.split(".").pop() != newFileType &&
          !user.value.photoURL?.startsWith("http")
        ) {
          await del("/v1/storage/" + user.value.photoURL);
        }
      }
      // Update profile in Firebase
      await updateProfile(user.value, {
        displayName: editData.value.displayName,
        photoURL: fileName !== "" ? fileName : user.value.photoURL,
      });
      if (fileName) userPhoto.value = await fetchImage(fileName);
    }
    editDialog.value = false;
    successMessage.value = "Profile updated!";
  } catch (error) {
    console.error("Failed to update profile:", error);
  }
};

async function fetchImage(fileName: string) {
  if (!fileName) return "";
  if (fileName.startsWith("http")) return fileName;
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

function resetPassword() {
  if (user.value?.email) {
    sendPasswordResetEmail(auth!, user.value.email)
      .then(() => {
        successMessage.value = "Password reset email sent!";
      })
      .catch((error) => {
        console.error("Error sending reset email:", error);
      });
  }
}

const deleteDialogOpen = ref(false);
const deleteConfirm = ref("");
const confirmDelete = async () => {
  if (
    deleteConfirm.value === tenantId.value &&
    !["free", "free-tier"].includes(tenantId.value)
  ) {
    if (appStore.hasAdminAccess) {
      await del(`/v1/tenants/${tenantId.value}`, undefined, "tenantManagement");
    } else {
      await del(
        `/v1/tenants/${tenantId.value}/users/${auth?.currentUser?.uid}`,
        undefined,
        "tenantManagement",
      );
    }
    await signOut(auth!);
    deleteDialogOpen.value = false;
    deleteConfirm.value = "";
  }
};

function openDeleteDialog() {
  deleteDialogOpen.value = true;
}

function closeDeleteDialog() {
  deleteDialogOpen.value = false;
  deleteConfirm.value = "";
}
</script>

<style lang="scss">
.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  align-items: center;

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
  }
}

#pb {
  cursor: pointer;

  &:hover {
    &::after {
      content: "Change Photo";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      animation: fade-in 0.25s linear;

      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    }
  }
}
</style>

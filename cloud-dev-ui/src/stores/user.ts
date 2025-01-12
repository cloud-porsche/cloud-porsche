import { defineStore } from "pinia";
import { get, postJSON, del } from "@/http/http";
import { useAppStore } from "@/stores/app";

interface UserStoreState {
  users: Array<{ email: string; uid: string; role: string }>;
  loading: boolean;
  error: any;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState =>
    <UserStoreState>{
      users: {},
      loading: false,
      error: null,
    },
  actions: {
    async fetchUsers(tenantId: string, adminUid: string) {
      this.$state.loading = true;
      this.$state.error = null;
      try {
        const response = await get(
          `/v1/tenants/${tenantId}/users/${adminUid}`,
          undefined,
          "tenantManagement",
        );
        const fetchedUsers = await response.json();
        if (Array.isArray(fetchedUsers)) {
          this.$state.users = fetchedUsers.map((user) => ({
            email: user.email,
            uid: user.uid,
            role: user.customClaims?.role,
          }));
        } else {
          this.$state.error = "Fetched users data is not an array.";
        }
      } catch (err) {
        this.$state.error = "Error fetching users.";
        console.error(err);
      } finally {
        this.$state.loading = false;
      }
    },
    async addUser(tenantId: string, email: string, role: string) {
      console.log("addUsers", email, role);
      this.$state.error = null;
      try {
        const newUser = { email, role };
        console.log("newUser", newUser);
        await postJSON(
          `/v1/tenants/${tenantId}/users`,
          newUser,
          undefined,
          "tenantManagement",
        );
        await this.fetchUsers(tenantId, useAppStore().currUser.uid);
      } catch (err) {
        this.$state.error = "Error adding user.";
        console.error(err);
      }
    },
    async updateUserRole(tenantId: string, uid: string, role: string) {
      this.$state.error = null;
      try {
        const updatedUser = { uid, role };
        await postJSON(
          `/v1/tenants/${tenantId}/users/setRole`,
          updatedUser,
          undefined,
          "tenantManagement",
        );
        await this.fetchUsers(tenantId, useAppStore().currUser.uid);
      } catch (err) {
        this.$state.error = "Error updating user role.";
        console.error(err);
      }
    },

    async deleteUser(tenantId: string, uid: string) {
      this.$state.error = null;
      try {
        await del(
          `/v1/tenants/${tenantId}/users/${uid}`,
          undefined,
          "tenantManagement",
        );
        await this.fetchUsers(tenantId, useAppStore().currUser.uid);
      } catch (err) {
        this.$state.error = "Error deleting user.";
        console.error(err);
      }
    },
  },
});

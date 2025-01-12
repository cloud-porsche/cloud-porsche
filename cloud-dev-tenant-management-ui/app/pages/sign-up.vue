<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

const toast = useToast();

const router = useRouter();
const initialPlan = computed(
  () => router.currentRoute.value.query.plan || "pro",
);

const state = reactive({
  plan: initialPlan.value,
  name: undefined,
  email: undefined,
  location: "europe-west4",
  confirmEmail: undefined,
  acceptTerms: false,
  password: undefined,
});

watch(state, (_) => {
  if (state.plan)
    router.replace({
      query: { ...router.currentRoute.value.query, plan: state.plan },
    });
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.plan) errors.push({ path: "plan", message: "Required" });
  if (!state.name) errors.push({ path: "name", message: "Required" });
  if (!state.location) errors.push({ path: "location", message: "Required" });
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  if (!state.acceptTerms)
    errors.push({ path: "acceptTerms", message: "Terms need to be accepted" });
  if (!state.confirmEmail)
    errors.push({ path: "confirmEmail", message: "Required" });
  if (state.email !== state.confirmEmail)
    errors.push({ path: "confirmEmail", message: "Emails do not match" });
  if (state.password?.length < 6)
    errors.push({
      path: "password",
      message: "Password must be at least 6 characters",
    });

  if (!/^[a-zA-Z][a-zA-Z0-9- ]{3,19}$/.test(state.name))
    errors.push({
      path: "name",
      message:
        "Invalid name, must start with a letter and only consist of lowercase letters, digits and hyphens with 4-20 characters",
    });
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.email))
    errors.push({ path: "email", message: "Not a valid email address" });
  return errors;
};

const loading = ref(false);

async function onSubmit(_: FormSubmitEvent<any>) {
  loading.value = true;
  try {
    const res = await (
      await fetch(
        (import.meta.dev ? "http://localhost:8082" : "") + "/v1/tenants/",
        {
          method: "POST",
          body: JSON.stringify(state),
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    ).json();
    if (!res.res.tenantId)
      throw new Error("Tenant creation failed, missing or wrong tenant id.");
    await router.push(
      `/sign-up-done?plan=${state.plan}&tenantId=${res.res.tenantId}&badgeUrl=${res.ghResponse.data.badge_url}`,
    );
    loading.value = false;
  } catch (e) {
    console.error(e);
    toast.add({
      color: "red",
      title: "Error",
      description: "Something went wrong, please try again later.",
      timeout: 15000,
    });
    loading.value = false;
  }
}

const locations = [
  { value: "europe-north1", label: "Finland" },
  { value: "europe-west1", label: "Belgium" },
  { value: "europe-west4", label: "Netherlands" },
  { value: "asia-east1", label: "Taiwan" },
  { value: "us-west1", label: "Oregon" },
  { value: "us-west4", label: "Las Vegas" },
  { value: "us-east1", label: "South Carolina" },
  { value: "us-east4", label: "Northern Virginia" },
  { value: "us-central1", label: "Iowa" },
  { value: "northamerica-northeast1", label: "Montreal" },
  { value: "northamerica-northeast2", label: "Toronto" },
];

watch(
  () => state.plan,
  (newVal) => {
    if (newVal === "pro") {
      state.location = "europe-west4";
    }
  },
  { deep: true },
);
</script>

<template>
  <ULandingSection
    title="Sign Up"
    description="We'll help you put everything on track for success."
    align="center"
    :ui="{
      title:
        'text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl',
      description: 'mt-4 text-md text-gray-600 dark:text-gray-300',
      container: 'max-w-2xl',
      wrapper: 'py-12 sm:py-12',
    }"
  >
    <UCard>
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Plan" name="plan" class="py-4" required>
          <USelect
            :options="[
              { value: 'pro', label: 'Pro' },
              { value: 'enterprise', label: 'Enterprise' },
            ]"
            v-model="state.plan"
            option-attribute="label"
            required
          ></USelect>
        </UFormGroup>

        <UFormGroup label="Company Name" name="name" required>
          <UInput v-model="state.name" required />
        </UFormGroup>

        <UFormGroup label="Location" name="location" required>
          <USelect
            :disabled="state.plan !== 'enterprise'"
            v-model="state.location"
            required
            :options="locations"
            option-attribute="label"
          />
        </UFormGroup>

        <UFormGroup label="Email" name="email" required>
          <UInput v-model="state.email" required />
        </UFormGroup>

        <UFormGroup label="Confirm Email" name="confirm-email" required>
          <UInput v-model="state.confirmEmail" required />
        </UFormGroup>

        <UFormGroup label="Password" name="password" required>
          <UInput v-model="state.password" required type="password" />
        </UFormGroup>
        <UDivider></UDivider>
        <span class="flex justify-center">
          <UCheckbox
            input-class="hover:cursor-pointer"
            v-model="state.acceptTerms"
            label="I agree to the terms and conditions"
            required
          ></UCheckbox>
        </span>
        <span class="flex justify-center">
          <UButton
            type="submit"
            padded
            block
            class="disabled:opacity-50"
            :disabled="validate(state).length > 0"
            :loading="loading"
          >
            Submit
          </UButton></span
        >
      </UForm>
    </UCard>
  </ULandingSection>
</template>

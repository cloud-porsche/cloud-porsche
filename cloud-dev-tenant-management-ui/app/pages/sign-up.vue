<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

const router = useRouter();
const initialPlan = computed(
  () => router.currentRoute.value.query.plan || "free",
);

const state = reactive({
  plan: initialPlan.value,
  name: undefined,
  email: undefined,
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
  if (!state.email) errors.push({ path: "email", message: "Required" });

  if (!/^[a-z][a-z0-9-]{3,19}$/.test(state.name))
    errors.push({
      path: "name",
      message:
        "Invalid name, must start with a letter and only consist of lowercase letters, digits and hyphens with 4-20 characters",
    });
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(state.email))
    errors.push({ path: "email", message: "Not a valid email address" });

  return errors;
};

async function onSubmit(_: FormSubmitEvent<any>) {
  const res = await fetch(
    (import.meta.dev ? "http://localhost:8081" : "") + "/v1/tenants/",
    {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  console.log(res);
}
</script>

<template>
  <UContainer class="flex flex-col justify-center items-center p-12 m-12">
    <UCard class="min-w-96 p-4">
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Plan" name="plan">
          <USelect
            :options="['free', 'pro', 'enterprise']"
            v-model="state.plan"
            required
          ></USelect>
        </UFormGroup>

        <UFormGroup label="Company Name" name="name">
          <UInput v-model="state.name" required />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" required />
        </UFormGroup>

        <UButton type="submit" :disabled="validate(state).length > 0"
          >Submit
        </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

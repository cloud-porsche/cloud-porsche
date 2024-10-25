<template>
  <v-responsive>
    <h1>Cloud Porsche</h1>
    <p>Cloud Application Development at HTWG Konstanz</p>

    <!-- File input and upload button -->
    <div>
      <input type="file" @change="onFileChange" accept="image/*" />
      <v-btn @click="uploadFile" color="primary" :disabled="!selectedFile">
        Upload Image
      </v-btn>
    </div>
    
    <!-- Optionally show the selected file name -->
    <p v-if="selectedFile">{{ selectedFile.name }}</p>
  </v-responsive>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedFile = ref<File | null>(null);

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]; // Store the selected file
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  console.log(formData.get('file'));

  try {
    const response = await fetch('http://localhost:8080/v1/storage/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) { 
      throw new Error('File upload failed');
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    // Handle success (e.g., show a message, reset file input, etc.)
  } catch (error) {
    console.error('Error uploading file');
    // Handle error (e.g., show an error message)
  }
};
</script>

<style scoped>
/* Optional: Add styles as needed */
</style>

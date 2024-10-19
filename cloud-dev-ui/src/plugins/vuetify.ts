/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
// Imports
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";

// Vuetify icons (optional)
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { md1, md2, md3 } from "vuetify/blueprints";

export enum MaterialVersion {
  NONE = "Default Vuetify",
  MD1 = "Material Design 1",
  MD2 = "Material Design 2",
  MD3 = "Material Design 3",
}

function getTheme(material: MaterialVersion) {
  switch (material) {
    case MaterialVersion.MD1:
      return md1;
    case MaterialVersion.MD2:
      return md2;
    case MaterialVersion.MD3:
      return md3;
    default:
      return undefined;
  }
}

// Create Vuetify theme configuration
const vuetify = createVuetify({
  blueprint: getTheme(localStorage.getItem("material") as MaterialVersion),
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1976D2", // Blue
          secondary: "#424242", // Dark gray
          accent: "#82B1FF", // Light blue
          error: "#FF5252", // Red
          info: "#2196F3", // Blue
          success: "#4CAF50", // Green
          warning: "#FB8C00", // Orange
        },
      },
      dark: {
        colors: {
          primary: "#BB86FC", // Purple
          secondary: "#03DAC6", // Teal
          accent: "#82B1FF",
          error: "#CF6679", // Pinkish-red
          info: "#2196F3",
          success: "#03DAC6", // Teal
          warning: "#FBC02D", // Yellow
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components: {
    VDateInput,
  },
});

export default vuetify;

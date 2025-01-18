// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_BASE_URL ?? "/",
    appType: "spa",
    plugins: [
      VueRouter({
        dts: "src/typed-router.d.ts",
      }),
      AutoImport({
        imports: [
          "vue",
          {
            "vue-router/auto": ["useRoute", "useRouter"],
          },
        ],
        dts: "src/auto-imports.d.ts",
        eslintrc: {
          enabled: true,
        },
        vueTemplate: true,
      }),
      Components({
        dts: "src/components.d.ts",
      }),
      Vue({
        template: { transformAssetUrls },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/settings.scss",
        },
      }),
      Fonts({
        google: {
          families: [
            {
              name: "Roboto",
              styles: "wght@100;300;400;500;700;900",
            },
          ],
        },
      }),
      VitePWA({
        disable: mode !== "production",
        registerType: "autoUpdate",
        devOptions: {
          enabled: false,
        },
        manifest: {
          name: "Cloud Porsche",
          short_name: "Cloud",
          lang: "en",
          start_url: process.env.VITE_BASE_URL ?? "/",
          description: "HTWG Cloud SaaS Project of Group 'Porsche'",
          icons: [
            {
              src: "favicon.svg",
              sizes: "1000x1000",
              type: "image/svg",
              purpose: "any",
            },
            {
              src: "web-app-manifest-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "web-app-manifest-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
        },
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
      port: process.env.VITE_PORT ?? 3000,
    },
    optimizeDeps: {
      include: ["@cloud-porsche/types"],
    },
    build: {
      rollupOptions: {
        cache: false,
      },
      chunkSizeWarningLimit: 2048,
      commonjsOptions: {
        include: [/types/, /@cloud-porsche/, /node_modules/],
      },
    },
  });
};

import md from "unplugin-vue-markdown/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import { resolve } from "path";
import UnoCSS from "unocss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vike(),
    UnoCSS(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    md({}),
  ],
  build: {
    target: "es2022",
  },
});

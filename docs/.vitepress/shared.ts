import { defineConfig } from "vitepress";
import { search as zhSearch } from "./zh-CN";
import { search as esSearch } from "./es-ES";

export const shared = defineConfig({
  base: "/infernus/",
  title: "Infernus",
  lastUpdated: true,

  themeConfig: {
    outline: "deep",
    socialLinks: [
      { icon: "github", link: "https://github.com/dockfries/infernus" },
    ],
    search: {
      provider: "local",
      options: {
        locales: { ...zhSearch, ...esSearch },
      },
    },
  },
});

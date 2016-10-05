System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "app": {
      "main": "httpClient",
      "defaultExtension": "ts"
    }
  },

  map: {
    "typescript": "npm:typescript@1.7.5"
  }
});

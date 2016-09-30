System.config({
  baseURL: "",
  defaultJSExtensions: true,
  transpiler: "typescript",
  paths: {
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "app": {
      "main": "bootstrap",
      "defaultExtension": "ts"
    }
  },

  map: {
    "typescript": "npm:typescript@1.7.5"
  }
});

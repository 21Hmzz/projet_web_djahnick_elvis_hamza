import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // schema: "https://nestapp-j6j9.onrender.com/graphql",
  schema: "http://backend:3000/graphql",
  documents: ["src/**/*.tsx"],
  generates: {
    "./src/__generated__/": {
      preset: "client",
    },
  },
};

export default config;

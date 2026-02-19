module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  env: {
    test: {
      plugins: [
        function replaceImportMeta() {
          return {
            visitor: {
              MetaProperty(path) {
                if (
                  path.node.meta.name === "import" &&
                  path.node.property.name === "meta"
                ) {
                  path.replaceWithSourceString(
                    JSON.stringify({
                      env: {
                        VITE_API_URL: "http://localhost:8080",
                        VITE_WS_URL: "ws://localhost:8080/ws",
                      },
                    }),
                  );
                }
              },
            },
          };
        },
      ],
    },
  },
};

module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ["eslint-config-react-app/base", "prettier"],
  plugins: ["react", "react-hooks", "import", "prettier"],
  rules: {
    "import/no-anonymous-default-export": "off",
    "react/jsx-pascal-case": "off",
  },
};

// .eslintrc.js
module.exports = {
  extends: ["next/core-web-vitals"],
  plugins: ["./eslint-plugin-mui-design-system"],
  ignorePatterns: [
    ".next/**",
    "node_modules/**",
    "eslint-plugin-mui-design-system.js"
  ],
  rules: {
    // Enforce MUI design system compliance
    "no-restricted-properties": [
      "error",
      // Block direct color values - force use of theme colors
      {
        object: "*",
        property: "color",
        message: "Use theme colors from appColors instead of hardcoded colors. Import { appColors } from '../lib/ui/theme/muiTheme'"
      },
      {
        object: "*", 
        property: "backgroundColor",
        message: "Use theme colors from appColors instead of hardcoded colors. Import { appColors } from '../lib/ui/theme/muiTheme'"
      },
      {
        object: "*",
        property: "borderColor", 
        message: "Use theme colors from appColors instead of hardcoded colors. Import { appColors } from '../lib/ui/theme/muiTheme'"
      }
    ],
    
    // Block hardcoded color values
    "no-restricted-syntax": [
      "error",
      {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message: "Hardcoded hex colors are not allowed. Use appColors from theme instead."
      },
      {
        selector: "Literal[value=/^rgb\\(/]",
        message: "Hardcoded RGB colors are not allowed. Use appColors from theme instead."
      },
      {
        selector: "Literal[value=/^rgba\\(/]", 
        message: "Hardcoded RGBA colors are not allowed. Use appColors from theme instead."
      },
      {
        selector: "Literal[value=/^hsl\\(/]",
        message: "Hardcoded HSL colors are not allowed. Use appColors from theme instead."
      },
      // Block non-MUI typography variants
      {
        selector: "JSXAttribute[name.name='variant'][value.value!=/^(h1|h2|h3|body1|body2|caption|button)$/]",
        message: "Only allowed typography variants: h1, h2, h3, body1, body2, caption, button"
      },
      // Block inline fontSize in sx prop
      {
        selector: "Property[key.name='fontSize']",
        message: "Use Typography variants instead of custom fontSize. Allowed variants: h1, h2, h3, body1, body2, caption, button"
      }
    ],

    // Custom MUI design system rules
    "./eslint-plugin-mui-design-system/enforce-app-colors": "error",
    "./eslint-plugin-mui-design-system/no-inline-styles": "error", 
    "./eslint-plugin-mui-design-system/require-mui-imports": "warn",

    // Enforce MUI components over HTML elements
    "no-restricted-globals": [
      "error",
      {
        name: "div",
        message: "Use MUI Box component instead of div"
      }
    ]
  },
  
  overrides: [
    {
      // Allow theme files to define colors
      files: ["**/theme/**", "**/muiTheme.js"],
      rules: {
        "no-restricted-syntax": "off",
        "no-restricted-properties": "off"
      }
    }
  ]
};
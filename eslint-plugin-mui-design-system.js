// eslint-plugin-mui-design-system.js
// Custom ESLint plugin to enforce MUI design system

const allowedColors = [
  '#020202',  // primary
  '#6F00FF',  // accent  
  '#6b7280',  // neutral
  '#10b981',  // success
  '#f59e0b',  // warning
  '#ef4444',  // error
  '#ffffff'   // background
];

const allowedTypographyVariants = [
  'h1', 'h2', 'h3', 'body1', 'body2', 'caption', 'button'
];

module.exports = {
  rules: {
    'enforce-app-colors': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce use of appColors instead of hardcoded colors',
          category: 'Design System',
        },
        schema: [],
      },
      create(context) {
        return {
          // Check for hardcoded colors in sx prop
          JSXExpressionContainer(node) {
            if (node.parent?.name?.name === 'sx') {
              const sourceCode = context.getSourceCode();
              const text = sourceCode.getText(node);
              
              // Check for hex colors
              const hexPattern = /#[0-9a-fA-F]{3,8}/g;
              const hexMatches = text.match(hexPattern);
              
              if (hexMatches) {
                hexMatches.forEach(color => {
                  if (!allowedColors.includes(color.toLowerCase())) {
                    context.report({
                      node,
                      message: `Hardcoded color "${color}" is not allowed. Use appColors.${getColorName(color)} instead.`
                    });
                  }
                });
              }
            }
          },

          // Check Typography variants
          JSXAttribute(node) {
            if (node.name.name === 'variant' && 
                node.parent.name.name === 'Typography') {
              const value = node.value?.value;
              if (value && !allowedTypographyVariants.includes(value)) {
                context.report({
                  node,
                  message: `Typography variant "${value}" is not allowed. Use one of: ${allowedTypographyVariants.join(', ')}`
                });
              }
            }
          },

          // Check for style objects with forbidden properties
          Property(node) {
            if (node.key.name === 'fontSize' && isInSxProp(node)) {
              context.report({
                node,
                message: 'Custom fontSize not allowed. Use Typography variants: h1, h2, h3, body1, body2, caption, button'
              });
            }
          }
        };
      },
    },

    'no-inline-styles': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent inline styles, encourage sx prop or theme usage',
          category: 'Design System',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'style') {
              context.report({
                node,
                message: 'Inline styles not allowed. Use sx prop with theme values instead.'
              });
            }
          }
        };
      },
    },

    'require-mui-imports': {
      meta: {
        type: 'problem', 
        docs: {
          description: 'Require importing appColors when using colors',
          category: 'Design System',
        },
        schema: [],
      },
      create(context) {
        let hasAppColorsImport = false;
        let usesColors = false;

        return {
          ImportDeclaration(node) {
            if (node.source.value.includes('muiTheme') && 
                node.specifiers.some(spec => spec.imported?.name === 'appColors')) {
              hasAppColorsImport = true;
            }
          },

          JSXExpressionContainer(node) {
            const text = context.getSourceCode().getText(node);
            if (text.includes('color') || text.includes('background')) {
              usesColors = true;
            }
          },

          'Program:exit'() {
            if (usesColors && !hasAppColorsImport) {
              context.report({
                node: context.getSourceCode().ast,
                message: 'When using colors, import { appColors } from theme'
              });
            }
          }
        };
      },
    }
  }
};

// Helper functions
function getColorName(hex) {
  const colorMap = {
    '#020202': 'primary',
    '#6F00FF': 'accent', 
    '#6b7280': 'neutral',
    '#10b981': 'success',
    '#f59e0b': 'warning',
    '#ef4444': 'error',
    '#ffffff': 'background'
  };
  return colorMap[hex.toLowerCase()] || 'unknown';
}

function isInSxProp(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'JSXExpressionContainer' && 
        parent.parent?.name?.name === 'sx') {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}
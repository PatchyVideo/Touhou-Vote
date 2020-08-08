/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        base: {
          black: '#000000',
          white: '#FFFFFF',
          green: '#38B2AC',
          error: '#E53E3E',
        },
        light: {
          black: '#1A202C',
          green: '#81E6D9',
        },
        dark: {
          white: '#F7FAFC',
          green: '#285E61',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      zIndex: {
        '-1': '-1',
      },
      opacity: {
        '90': '0.90',
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(56, 178, 172, 0.75)',
      },
    },
  },
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue', 'plugins/**/*.js', 'nuxt.config.js'],
  },
}

/** @type { import('@storybook/nextjs').StorybookConfig } */
const config: import('@storybook/nextjs').StorybookConfig = {
  stories: [
    // "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    // "@components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook-addon-sass-postcss",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    //👇 See the table below for the list of supported options
    autodocs: true,
    // defaultName: 'components/forms',
  },
};
export default config;

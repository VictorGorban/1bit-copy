import type { Meta, StoryObj } from "@storybook/react";

import Component, { ComponentProps } from "./TextInput";

const meta = {
  component: Component,
  title: "components/forms/TextInput",
  parameters: {},
  decorators: [
    (Story) => (
      <div className="content form d-flex flex-wrap pt-30 pb-40">
        <div className="input-wrapper">
          {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value: "",
  } as ComponentProps,
};

export const Filled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Со значением",
      },
    },
  },
  args: {
    ...Primary.args,
    value: "текст текст текст",
  } as ComponentProps,
};

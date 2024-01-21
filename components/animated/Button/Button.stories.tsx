import type { Meta, StoryObj } from "@storybook/react";

import Component, { ComponentProps } from "./index";

const meta = {
  component: Component,
  title: "components/animated/Button",
  argTypes: {
    variant: {
      options: ['none', 'default', 'green', 'danger'],
      
    },
  },
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
    children: 'Текст кнопки'
  } as ComponentProps,
};

export const Themed: Story = {
  parameters: {
    docs: {
      description: {
        story: "Другая цветовая тема",
      },
    },
  },
  args: {
    ...Primary.args,
    variant: 'green',
  } as ComponentProps,
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: "Состояние загрузки",
      },
    },
  },
  args: {
    ...Primary.args,
    isLoading: true,
  } as ComponentProps,
};

export const Scaled: Story = {
  parameters: {
    docs: {
      description: {
        story: "При наведении и при фокусе увеличивается сильнее.",
      },
    },
  },
  args: {
    ...Primary.args,
    scalingMultiplier: 5,
  } as ComponentProps,
};

export const IsButtonHtml: Story = {
  parameters: {
    docs: {
      description: {
        story: "В html рендерится не button, а div. Не забудьте стилизовать под кнопку с помощью className",
      },
    },
  },
  args: {
    ...Primary.args,
    isButtonHtml: false,
    className: 'btn'
  } as ComponentProps,
};
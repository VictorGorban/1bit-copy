import type { Meta, StoryObj } from "@storybook/react";

import Component, { ComponentProps } from "./index";
import * as formComponents from "@components/forms";
import * as animatedFormComponents from "@components/animated/forms";

const meta = {
  component: Component,
  title: "components/animated/FormBlock",
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      controls: { exclude: ["children"] },
    },
  },
  decorators: [
    (Story) => (
      <div className="content form d-flex flex-wrap pt-30 pb-40">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  
  args: {
    className: "form-group w-100",
    style: { minWidth: 300 },
    children: (
      <>
        <span className="label weight-600">Название *</span>

        <div className="input-wrapper">
          <formComponents.TextInput value={"Пример текста"} placeholder="" />
        </div>
      </>
    ),
  } as ComponentProps,
};

export const AnimatedFormField: Story = {
  parameters: {
    docs: {
      description: {
        story: "Анимированное поле внутри анимированного блока",
      },
    },
  },
  args: {
    ...Primary.args,
    children: (
      <>
        <span className="label weight-600">Название *</span>

        <div className="input-wrapper">
          <animatedFormComponents.TextInput
            value={"Пример текста"}
            placeholder=""
          />
        </div>
      </>
    ),
  } as ComponentProps,
};

export const AnimatedFormSelect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Анимированный select тоже работает внутри анимированного блока. Параметры настроены так, чтобы всё работало без дополнительной настройки.",
      },
    },
  },
  args: {
    ...Primary.args,
    children: (
      <>
        <span className="label weight-600">Выбор *</span>

        <div className="input-wrapper">
          <animatedFormComponents.SelectInput />
        </div>
      </>
    ),
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

export const HtmlElement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Можно выбрать html элемент, который будет рендериться. Примеры: div, article, button... Без ограничений",
      },
    },
  },
  args: {
    ...Primary.args,
    htmlElement: "article",
  } as ComponentProps,
};

export const AppearanceCustomizing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Внешний вид можно дополнительно настроить параметрами className и style",
      },
    },
  },
  args: {
    ...Primary.args,
    className: "form-group w-100 bg-gray2",
    style: { height: 200 },
  } as ComponentProps,
};

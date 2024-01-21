"use client";
//* секция Библиотеки c функциями
import React from "react";
import _ from "lodash";
import { motion } from "framer-motion";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты

//* endof  Наши компоненты

//* секция Стили компонента

//* endof  Стили компонента

export type ComponentProps = {
  /** Вариант цветового дизайна. Фактически ставится одноименный класс. */
  variant?: "none" | "default" | "green" | "danger" | string;
  isLoading?: boolean;
  /** Дополнительные классы для стилизации */
  className?: string;
  /** Если true, то рендерится html button, иначе рендерится обычный div */
  isButtonHtml?: boolean;
  /** Насколько сильно увеличивать или уменьшать кнопку при взаимодействии с ней */
  scalingMultiplier?: number;
  /** Любое содержимое, которое понимает React. В том числе текст и числа */
  children: React.ReactNode;
  /** Другие свойства html-элемента */
  [key: string]: any;
};

/**
 * Анимированная кнопка
 * @returns TSX Компонент
 */
const Button = React.forwardRef<React.ReactNode, ComponentProps>(function Component(
  {
    variant = "default", // default, green, danger
    isLoading = false,
    className = "",
    isButtonHtml = true,
    scalingMultiplier = 1,
    children,
    ...otherProps
  }: ComponentProps,
  elRef
) {
  let buttonType = null;
  const MotionComponent = isButtonHtml ? motion.button : motion.div;
  if (isButtonHtml) {
    className = `btn ${className}`;
    buttonType = "button";
  }

  return (
    <MotionComponent
      //   ref={elRef}
      type={buttonType}
      className={`style-${variant} ${className} ${isLoading && "loading"}`}
      whileHover={{ scale: 1 + 0.06 * scalingMultiplier }}
      whileFocus={{ scale: 1 + 0.06 * scalingMultiplier }}
      whileTap={{ scale: 1 - 0.06 * scalingMultiplier }}
      transition={{ duration: 0 }}
      {...otherProps}
    >
      {children}
      <div className="loader lds-ring color-brand1">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </MotionComponent>
  );
}) as React.ForwardRefExoticComponent<
  ComponentProps & React.RefAttributes<React.ReactNode>
>;
// сложная типизация нужна для Storybook, иначе она не определяет аргументы.

export default Button;

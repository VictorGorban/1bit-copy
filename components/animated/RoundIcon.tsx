//* секция Библиотеки c функциями
import React from "react";
import _ from "lodash";
//* endof  Библиотеки c функциями

//* секция Наши хелперы

//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Button from "@components/animated/Button";
//* endof  Наши компоненты

//* секция Стили компонента
//* endof  Стили компонента

export type ComponentProps = {
  /** Вариант цветового дизайна */
  variant?: string;
  /** Дополнительные свойства html-элемента кнопки */
  buttonProps?: Record<string, any>;
  /** Цвет иконки */
  color: string;
  /** Название иконки в fontAwesome */
  iconName: string;
  /** Дополнительные классы для стилизации кнопки */
  additionalClasses?: string;
  /** Размер в пикселях */
  size: number;
  /** Другие свойства html-элемента */
  [key: string]: any;
};

/**
 * Анимированная круглая иконка
 * @returns TSX Компонент
 */
export default React.forwardRef(function Component(
  {
    variant = "icon", // default, green, danger
    buttonProps = {},
    color,
    iconName,
    additionalClasses = "",
    size = 35,
    ...otherProps
  }: ComponentProps,
  elRef
) {
  let DisplayBlock = variant == "button" ? Button : "div";
  buttonProps = variant == "button" ? buttonProps : {};

  return (
    <DisplayBlock
      ref={elRef}
      className={`d-flex all-center border-${color} color-${color} border-width-1 ${additionalClasses} `}
      style={{ width: size, height: size, borderRadius: "50%" }}
      {...buttonProps}
      {...otherProps}
    >
      {/* тут должна быть иконка инфо */}
      <i className={`fa fa-${iconName}`} style={{ fontSize: 0.857 * size }}></i>
    </DisplayBlock>
  );
});

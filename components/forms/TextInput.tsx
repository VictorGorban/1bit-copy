//* секция Библиотеки c функциями
import React from "react";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты
export type ComponentProps = {
  /** Значение поля */
  value?: string;
  /** Дополнительные классы */
  className?: string;
  /** Другие свойства html-элемента */
  [key: string]: any;
};

/**
 * Компонент для форм
 * @returns TSX Компонент
 */
export default function TextInput({
  value,
  className="",
  ...otherProps
}: ComponentProps): React.JSX.Element {
  //* секция глобальное состояние из context
  //* endof глобальное состояние из context

  //* секция состояние

  //* endof состояние

  //* секция вычисляемые переменные, изменение состояния
  //* endof вычисляемые переменные, изменение состояния

  //* секция эффекты
  //* endof эффекты

  //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ
  //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ

  //* секция обработчики
  //* endof обработчики

  return (
    <>
      <input
        type="text"
        maxLength={500}
        className={`form-control ${className}`}
        placeholder=""
        value={value}
        {...otherProps}
      />
    </>
  );
}

//* секция Библиотеки c функциями
import React from "react";
import { motion, useAnimation } from "framer-motion";
// import { useIsFirstRender } from "@uidotdev/usehooks";
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
  /** Насколько сильно увеличивать или уменьшать этот компонент формы при взаимодействии с ним */
  scalingMultiplier?: number;
  /** Выставляемый z-index для компонента при наведении или при открытом меню
   * (например, в случае работы в формах с анимированным select нужно будет использовать blockRef.externalSetStayActive.
   * Примеры можно найти в коде форм, в документации это так не покажешь).
   * Нужен для того, чтобы находиться над другими компонентами с нестандартным z-index */
  activeZIndex?: number;
  /** Выставляемый z-index для компонента по умолчанию (с закрытым меню) */
  inactiveZIndex?: number;
  /** Классы, применяемые к компоненту */
  className?: string;
  /** Стиль, применяемый к компоненту */
  style?: Record<string, any>;
  /** Название html-элемента, который будет здесь использоваться для рендера */
  htmlElement?: string;
  /** Содержимое блока */
  children: React.ReactNode;
  /** Другие свойства html-элемента */
  [key: string]: any;
};

const FormBlock = React.forwardRef(function Component(
  {
    scalingMultiplier = 1,
    activeZIndex = 2,
    inactiveZIndex = 1,
    className,
    htmlElement = "label",
    style,
    children,
    ...otherProps
  }: ComponentProps,
  elRef
) {
  //* библиотеки и неизменяемые значения
  const MotionComponent = motion[htmlElement];
  const defaultState = { scale: 1, zIndex: inactiveZIndex, boxShadow: "0" };
  const activeState = {
    scale: 1 + 0.02 * scalingMultiplier,
    zIndex: activeZIndex,
    boxShadow: "0 7px 10px rgba(0, 0, 0, 0.15)",
  };
  const pressedState = { scale: 1 - 0.02 * scalingMultiplier };
  //* endof библиотеки и неизменяемые значения

  //* контекст
  //* endof контекст

  //* состояние
  const [mustStayActive, setStayActive] = React.useState(false);
  const animationControls = useAnimation();

  //* endof состояние

  //* секция вычисляемые переменные, изменение состояния

  //* endof вычисляемые переменные, изменение состояния

  //* эффекты
  // FIXME компоненты с useImperativeHandle показываю какую-то херню в типах, а также отображается ошибка TS. Значит подобная ошибка будет и в модалах
  React.useImperativeHandle(elRef, () => ({
    externalSetStayActive(isActive: boolean) {
      console.log("externalSetStayActive called", isActive);
      setStayActive(isActive);
    },
  }));

  React.useEffect(() => {
    if (mustStayActive) {
      animationControls.set(activeState);
    } else {
    }
  }, [mustStayActive]);

  //* endof эффекты

  //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ

  //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ

  //* обработчики

  //* endof обработчики

  return (
    <>
      {/* TODO перенести классы из scss в локальные классы. Возможно, styled-components подойдут. Мне нужен класс, свойства которого я могу задавать в реалтайме - вроде бы он это умеет (No class name bugs). */}
      <MotionComponent
        animate={animationControls}
        onHoverStart={() => animationControls.start(activeState)}
        onHoverEnd={() => animationControls.start(defaultState)}
        whileFocus={activeState}
        // whileTap={pressedState}
        transition={{ duration: 0 }}
        className={`form-block ${
          mustStayActive && "active"
        } scalingMultiplier-${scalingMultiplier} activeZIndex-${activeZIndex} inactiveZIndex-${inactiveZIndex} ${className}`}
        style={style}
        {...otherProps}
      >
        {children}
      </MotionComponent>
    </>
  );
}) as React.ForwardRefExoticComponent<
  ComponentProps & React.RefAttributes<React.ReactNode>
>;
// сложная типизация нужна для Storybook, иначе она не определяет аргументы.

export default FormBlock;

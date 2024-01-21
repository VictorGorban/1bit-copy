'use client'
//* секция Библиотеки c функциями
import React from 'react';
import Tippy from '@tippyjs/react';
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

const defaultProps = {
    animation: 'fade',
    arrow: true,
    delay: 0,
    trigger: 'mouseenter', //mouseenter
    theme: 'light',
    placement: 'auto'
}

const Tooltip = ({ children, ...rest }) => (

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

    <Tippy {...defaultProps} className={'bg-white color-black weight-500 size-14 border-gray2 border-radius-6'} {...rest}>{/* Сначала указываются дефолтные свойства, потом {...rest}. Потому что {...rest} переписывает дефолтные свойства своими. */}
        {children}
    </Tippy>
);

export default Tooltip;

//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Виджеты
//* endof  Виджеты

//* секция Наши компоненты
import Menu from "./Menu";
//* endof  Наши компоненты


export default function Component({ }) {
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
        <div className="pt-25 pt-md-0 pb-25 pb-md-35 px-15 px-md-0">
            <Menu />
        </div>
    )
}

'use client'
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as clientHelpers from '@clientHelpers'
//* endof  Наши хелперы

//* секция Контекст и store
import { $userData, $isGlobalsLoaded } from '@clientHelpers/stores'
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Виджеты
//* endof  Виджеты

//* секция Наши компоненты
//* endof  Наши компоненты

async function setIntervalAndExecute(fn, t) {
    // Error в асинхронной функции в setImmediate или setInterval крашит приложение
    // setImmediate(fn)
    await fn();
    return setInterval(fn, t);
}

export default function Component() {

    // обновление глобальных данных приложения. Это все можно делать и в layout где-то, и в отдельном клиентском компоненте где можно юзать useEffect.
    React.useEffect(() => {
        Promise.all([
        ]).then(()=>null)
    }, []); // runs once on component mount


    return <></>;
}
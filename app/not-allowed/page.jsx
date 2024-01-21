// то есть никакой оптимизации в случае даже с обычным прикреплением юзера тут не будет. Нафига тогда нужны серверные компоненты, непонятно.
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import middlewares from './middlewares'
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
import PageContent from './PageContent'
//* endof  Наши компоненты

export const metadata = {
  title: 'Пользователи'
}




export default async function Page(pageParams) {
  
  //* библиотеки и неизменяемые значения
  let params = await getPageData(pageParams);
  //* endof библиотеки и неизменяемые значения


  //* контекст

  //* endof контекст

  //* состояние

  //* endof состояние

  //* вычисляемые переменные, изменение состояния

  //* endof вычисляемые переменные, изменение состояния

  //* эффекты

  //* endof эффекты

  //* функции-хелперы, НЕ ОБРАБОТЧИКИ

  //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ


  //* обработчики

  //* endof обработчики

  return (
    <PageContent {...params} />
  );
}


export async function getPageData(pageParams) {
  let data = {};
  await middlewares(pageParams, data);

  let propUser = data.user || null;

  return {
    user: EJSON.stringify(propUser)
  }
}

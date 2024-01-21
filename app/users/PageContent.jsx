'use client'
// то есть никакой оптимизации в случае даже с обычным прикреплением юзера тут не будет. Нафига тогда нужны серверные компоненты, непонятно.
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
import { ObjectProvider as UserProvider } from '@components/providers/User'
import { ObjectProvider as PageDataProvider } from '@components/providers/PageData'
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты

import Main from './components/Main'
//* endof  Наши компоненты

export default function PageContent(pageParams) {
  //* библиотеки и неизменяемые значения
  //* endof библиотеки и неизменяемые значения


  //* контекст
  // кажется тут придется возвращаться к useMemo и тд, и юзать use client, снова.
  let { user, pageData } = pageParams;
  user = EJSON.parse(user || 'null');
  pageData = EJSON.parse(pageData || 'null');
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
    <>
      <UserProvider initValue={user}>
        
        <PageDataProvider initValue={pageData}>
          <Main />

        </PageDataProvider>
      </UserProvider>
    </>
  );
}


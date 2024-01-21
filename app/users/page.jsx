// 'use client'
// то есть никакой оптимизации в случае даже с обычным прикреплением юзера тут не будет. Нафига тогда нужны серверные компоненты, непонятно.
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
import { redirect } from 'next/navigation'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as serverHelpers from '@serverHelpers'
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
  // если здесь произойдет ошибка, то будет показана эта ошибка.
  const sortConfig = { field: 'tokens', direction: 'asc' };
  const page = 1;
  const search = ""; // как я вижу, search у них ищет не по одному полю, а как минимум по email и name.
  const requestResult = await serverHelpers.submitObject(`${process.env.NEXT_PUBLIC_API_PREFIX}/user/list?search=${search}&page=${page}&orderBy=${sortConfig.field}:${sortConfig.direction}`, {}, { method: 'get' });
  const dataLength = requestResult.data?.length || 0;
  const pageNumbersToShow = Array.from({
    length: requestResult.pages
  }, (unused, index) => index + 1);
  const firstPage = _.first(pageNumbersToShow);
  const lastPage = _.last(pageNumbersToShow);
  const selectedPage = 1;

  const pageData = {
    sortConfig, page, dataLength,
    pageNumbersToShow, selectedPage,
    search, firstPage, lastPage,
    pageRows: requestResult.data
  }

  return {
    pageData: EJSON.stringify(pageData),
  }
}
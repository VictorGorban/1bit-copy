//* секция Библиотеки c функциями
import { NextRequest, NextResponse } from 'next/server'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
// import {logUserError, logAction} from './logActions'
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export function error(message = 'error', data = {}, statusCode = 200) {
  return new NextResponse(JSON.stringify({
    status: 'error',
    message,
    data,
  }), {
    status: statusCode
  })
}

export function success(message = 'success', data = {}, statusCode = 200) {
  return new NextResponse(JSON.stringify({
    status: 'success',
    message,
    data,
  }), {
    status: statusCode
  })
}

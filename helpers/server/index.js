//* секция Библиотеки c функциями
import _ from "lodash";
import convertRu from "convert-layout/ru";
// import nodemailer from "nodemailer";
import uniqid from "uniqid";

import crypto from "crypto";

//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

// let transporter = nodemailer.createTransport({
//   service: "Yandex", // no need to set host or port etc.
//   auth: {
//     user: "victorgorban2@ya.ru",
//     pass: "1999Gorban",
//   },
// });

export { default as submitObject } from "./submitObject";
export * as licenseKeys from './licenseKeys'
export * as users from './users'
export * as oplog from './oplog'

export function validateEmail(email) {
  if (!email) return true;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
}

export function validateUrl(url) {
  if (!url) return true;

  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
}

export async function sendMail(options) {
  console.log("in sendMail", options.to, options.subject, options.html.length);
  let defaultOptions = { from: "victorgorban2@ya.ru" };
  let mailOptions = {
    ...defaultOptions,
    ...options,
  };
  // console.log('mailOptions', mailOptions)
  let mailResult = await transporter.sendMail(mailOptions);

  return mailResult;
}

let simpleSchemaOptions = {
  clean: {
    // clean нужен в основном для преобразования типов. Лишние поля не убираю.
    mutate: true,
    filter: false, // убрать поля, которых нет в определении - нет, оставить на валидацию
    autoConvert: true,
    removeEmptyStrings: false,
    removeNullsFromArrays: false,
    trimStrings: true, // теперь мне не нужно триммить логин и пароль вручную
  },
  requiredByDefault: false,
};

export { simpleSchemaOptions };

// смотрим на поля в query. Берем их из prevState, возвращаем
export function revertUpdateQuery(query, prevState) {
  // console.log('revertUpdateQuery, prevState', prevState)

  let keysToCopy = [];

  for (let actionKey of Object.keys(query)) {
    if (actionKey == "$or") {
      let array = query[actionKey];
      for (let obj of array) {
        for (let key of Object.keys(obj)) {
          keysToCopy.push(key);
        }
      }
    } else {
      for (let key of Object.keys(query[actionKey])) {
        keysToCopy.push(key);
      }
    }
  }

  keysToCopy = _.uniq(keysToCopy);
  let result = {};
  for (let key of keysToCopy) {
    result[key] = prevState[key];
  }

  return { $set: result };
}

export async function parseJsonBody(req) {
  try {
    return await req.json();
  } catch (e) {
    // скорее всего, req.body не в формате json
    console.log('cannot parse request as json', req.url)
  } finally {
  }
}

export async function tableFilterAndSort({
  collectionClass,
  defaultSortField = 'createdAt',
  defaultSortDirection = 'desc',
  data = {},
}) {
  let {
    projection = {},
    isArchived = false,
    filter = {},
    sortConfig = {},
    selectedPage = 1,
    pageSize = 50,
    search,
    searchField = 'name'
  } = data;

  if (selectedPage < 1) {
    selectedPage = 1;
  }

  let query = { ...filter };
  if (!isArchived) {
    query.isArchived = { $ne: true };
  } else {
    query.isArchived = true
  }
  // ищем по названию
  if (search) {
    _.set(query, searchField, new RegExp(search, 'i'))
  }

  // console.log("search", search, query);

  let cursor = collectionClass.find(query);
  if (!sortConfig.field) {
    sortConfig.field = defaultSortField;
    sortConfig.direction = defaultSortDirection;
  }
  if (sortConfig.direction == "desc") {
    sortConfig.direction = -1;
  } else {
    sortConfig.direction = 1;
  }

  cursor = cursor.sort({ [sortConfig.field]: sortConfig.direction });
  let skip = (selectedPage - 1) * pageSize;
  if (skip < 0) skip = 0;
  let limit = pageSize;
  cursor = cursor.skip(skip).limit(limit);

  let pageRows = [];
  let filteredCount = 0;
  await cursor.projection(projection).then((rows) => {
    pageRows = rows;
  });

  await Promise.all([
    collectionClass
      .count(query)
      .then((count) => (filteredCount = count)),
  ]);

  // console.log("after Promise.all", pageRows.length);

  let firstPage = 1;
  let remainder = filteredCount % pageSize;
  // если пагинация серверная, то firstPage, lastPage, pageNumbersToShow ставится именно там. А вообще, в случае серверной пагинации
  // нужно просто скрыть блок пагинации, и делать все это в родительском компоненте: TemplateTable оставить только для показа строк.
  let lastPage = Math.floor(filteredCount / pageSize);
  if (remainder) lastPage++;
  if (selectedPage > lastPage) selectedPage = lastPage; // такая ситуация может возникнуть при смене кол-ва строк

  let pageNumbersToShow = [
    selectedPage - 2,
    selectedPage - 1,
    selectedPage,
    selectedPage + 1,
    selectedPage + 2,
  ].filter((item) => item >= firstPage && item <= lastPage);

  let result = {
    pageRows,
    pageSize,
    firstPage,
    lastPage,
    selectedPage,
    pageRows,
    pageNumbersToShow,
    dataLength: filteredCount,
    filter,
    isArchived,
    search, 
    searchField,
    projection,
    isArchived
  };

  return result;
}

export async function setIntervalAndExecuteOnceGlobal(token, fn, t) {
  // суть в том что если сразу из нескольких файлов будет приказ поставить задачу, например "Удалять старые файлы каждые 5 часов", то из них нужен только один, а остальные посланы явно по ошибке.
  if (global[token]) return;
  global[token] = true;
  // Error в асинхронной функции в setImmediate или setInterval крашит приложение
  // setImmediate(fn) 
  await fn();
  return setInterval(fn, t);
}
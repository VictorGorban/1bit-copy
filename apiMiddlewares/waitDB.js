//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import { getDBInitialized } from "@src/ORM/mongoSetupDB";
//* endof  Наши хелперы

// тут лучше чтобы была подготовка БД, хотя бы чтобы были все страницы из БД наготове, и таким образом даже кэширование было мгновенным.
export default async function (req) {
  await getDBInitialized();
}
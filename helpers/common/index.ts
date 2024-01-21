//* секция Библиотеки c функциями
import _ from "lodash";
import convertRu from "convert-layout/ru";
import uniqid from "uniqid";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);

//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export { dayjs };

export * as licenseKeys from "./licenseKeys";
export * as users from "./users";

export function validateEmail(email?: string): boolean {
  if (!email) return true;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
}

export function validateUrl(url?: string): boolean {
  if (!url) return true;

  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
}

export function randomInt(min = 0, max = 1_000_000_000): number {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function randomString(): string {
  // случайное число от min до (max+1)
  let rand = uniqid.process();
  return rand;
}

export function randomStringProcess(): string {
  // случайное число от min до (max+1)
  let rand = uniqid.process();
  return rand;
}

export function randomStringFull(): string {
  // случайное число от min до (max+1)
  let rand = uniqid();
  return rand;
}

export function randomIntString(length = 10, min = 0, max = 9): string {
  // случайное число от min до (max+1)
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomInt(min, max);
  }
  return result;
}

export function dateDiff(
  date1: string | Date,
  date2: string | Date,
  unit: dayjs.QUnitType | dayjs.OpUnitType = "years"
) {
  let result = dayjs(date1).diff(date2 || new Date(), unit || "years");
  return result;
}

export function formatDate(date: string | Date, format: string): string {
  if (!date) return "";
  let result = dayjs(date).format(format || "DD.MM.YYYY");
  if (result == "Invalid Date") {
    return date.toString();
  }
  return result;
}

export function formatDateFull(date: string | Date, format?: string): string {
  if (!date) return "";
  let result = dayjs(date).format(format || "DD.MM.YYYY HH:mm:ss");
  if (result == "Invalid Date") {
    return date.toString();
  }
  return result;
}

export function parseDate(string: string | Date, format?: string): Date {
  let result = dayjs(string, format || "DD.MM.YYYY").toDate();
  // console.log('in commonHelpers.parseDate', string, result, dayjs(string).toDate())
  return result;
}

export function parseTime(string: string | Date, format: string): Date {
  let result = dayjs(string, format || "DD.MM.YYYY HH:mm").toDate();

  return result;
}

export function formatTime(date: string | Date, format: string): string {
  if (!date) return "";
  let result = dayjs(date).format(format || "HH:mm:ss");

  return result;
}

export function formatBool(bool: boolean): string {
  return bool ? "Да" : "Нет";
}

export function ruToEn(value: string): string {
  let converted = value;
  const cyrillicPattern = /[а-яА-ЯЁё]/;
  let isRussian = cyrillicPattern.test(value);
  if (isRussian) {
    converted = convertRu.toEn(value);
  }

  return converted;
}

export function formatCompanyName(company: {
  fullName: string;
  shortName: string;
}): string {
  let result = company.fullName;
  if (company.shortName) {
    result += ` (${company.shortName})`;
  }

  return result;
}

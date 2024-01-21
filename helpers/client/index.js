//* секция Библиотеки c функциями
import _ from "lodash";

import dayjs from 'dayjs'
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

export { default as submitObject } from "./submitObject";

export * as loadOptions from "./loadOptions";

export function preventTab(e) {
  // console.log("preventTab", e);
  if (e.keyCode == 9 && !e.shiftKey) {
    e?.preventDefault();
    e?.stopPropagation();
    return false;
  }
  return e.keyCode;
}

export function preventShiftTab(e) {
  // console.log("preventTab", e);
  if (e.keyCode == 9 && e.shiftKey) {
    e?.preventDefault();
    e?.stopPropagation();
    return false;
  }
  return e.keyCode;
}

export function readFileText(file) {
  console.log("in readFileText");
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

export function handleChangeItem(e, item, field, type = "text", itemFunction) {
  let el = e.currentTarget;
  let value;
  if (field == "email") {
    value = el.value.toLowerCase();
  } else {
    value = el.value;
  }
  // console.log('el', el)
  if (el.options) {
    value = el.options[el.selectedIndex];
  }

  value = `${value}`.trim();

  if (type == "float") {
    value = parseFloat(value);
  } else if (type == "int") {
    value = parseInt(value);
  } else if (type == "bool") {
    value = value == "true";
  } else if (type == "bool-null") {
    value = value == "null" ? null : value == "true";
  } else if (type == "date") {
    value = parseDate(value);
    value = dayjs(value).format("YYYY-MM-DD");
  } else {
    // value = value;
  }
  // console.log('handleChangeItem', field, value)

  _.set(item, field, value);

  // console.log("handleChangeItem", item);

  itemFunction?.(_.clone(item));
}

export function handleChangeItemSelect(
  option,
  item,
  field,
  type = "text",
  itemFunction
) {
  let value = option.value;
  // console.log('handleChangeItemSelect', value);

  if (type == "float") {
    value = parseFloat(value);
  } else if (type == "int") {
    value = parseInt(value);
  } else if (type == "bool") {
    value = value == "true";
  } else if (type == "bool-null") {
    value = value == "null" ? null : value == "true";
  } else if (type == "date") {
    value = parseDate(value);
    value = dayjs(value).format("YYYY-MM-DD");
  } else {
    // value = value;
  }

  _.set(item, field, value);
  // console.log("handleChangeItemSelect", item);
  itemFunction?.(_.clone(item));
}

export function handleChangeItemEditor(value, item, field, itemFunction) {
  _.set(item, field, value);

  itemFunction?.(_.clone(item));
}

export function download(dataUrl, filename) {
  let a = document.createElement("a");
  a.href = dataUrl;
  a.setAttribute("download", filename);
  a.click();

  setTimeout(() => a.remove(), 10_000) // 10с хватит для скачивания даже большого файла. 
  // Большие файлы вообще-то должны скачиваться по ссылке с сервера, то есть когда сам элемент DOM уже не нужен.
}

//* секция Библиотеки c функциями
import { NextResponse } from 'next/server'
import { cookies as nextCookies } from 'next/headers';
import _ from "lodash";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as Collections from "@src/ORM/Collections";
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export default async function Middleware(req, data){
  let cookies = nextCookies();
  let { user_id, token } = data?.auth || {};

  if (!user_id && !token) {
    user_id = cookies.get('user_id')?.value
    token = cookies.get('token')?.value
  }

  // console.log("withUser, cookies", { user_id, token });

  if (user_id && token) {
    let foundUser = await Collections.users.findOne({
      _id: user_id,
      loginTokens: token,
    });
    if (foundUser) {
      let userData = foundUser;
      delete userData.password;
      data.user = userData || null;
    }
  } else {
    //Если пользователь не авторизован, то в getPageData data.user == undefined и EJSON не может его сериализовать
    data.user = null;
  }

  delete data?.auth;
}

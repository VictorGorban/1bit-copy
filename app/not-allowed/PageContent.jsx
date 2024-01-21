'use client'
// то есть никакой оптимизации в случае даже с обычным прикреплением юзера тут не будет. Нафига тогда нужны серверные компоненты, непонятно.
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
import {usePathname, useRouter} from 'next/navigation'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
import { ObjectProvider as UserProvider } from '@components/providers/User'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import AnimatedLink from '@root/components/animated/Link'
import AnimatedButton from '@root/components/animated/Button'
//* endof  Компоненты из библиотек

//* секция Наши компоненты

//* endof  Наши компоненты

export default function PageContent(pageParams) {
  //* библиотеки и неизменяемые значения
  //* endof библиотеки и неизменяемые значения


  //* контекст
  // кажется тут придется возвращаться к useMemo и тд, и юзать use client, снова.
  let { user } = pageParams;
  console.log('login pageContent, user', user)
  user = EJSON.parse(user || 'null');
  //* endof контекст

  //* состояние
  const router = useRouter();
  const pathname = usePathname();
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
        

        <section style={{ marginBottom: '-10px' }}>
          <div className="container">
            <div className="mx-auto py-30 px-30 size-14">
              <h1 className="heading mb-60">Нет доступа.</h1>
              <p className="subheading mb-60">У вас нет доступа к странице, на которую вы пытались попасть. Возможно, вы не вошли в систему?</p>
              <p className="subheading mb-60">
                <AnimatedButton className="btn style-default link" onClick={e => router.back()}>
                  Вернуться назад
                </AnimatedButton>
              </p>
              <p className="subheading mb-60">
                <AnimatedLink href="/" isButtonHtml={true}
                  className="btn style-default link"
                >
                  Перейти на главную
                </AnimatedLink>
              </p>
              <p className="subheading mb-60">
                <AnimatedLink href="/login" isButtonHtml={true}
                  className="btn style-default link"
                >
                  Логин
                </AnimatedLink>
              </p>

              <div className="d-flex justify-content: center;">
                <div className="w-100 w-md-33 w-lg-50 mx-auto mt-30 mb-100">
                  {/* <Image
                                className="image-404"
                                src="/assets/img/404-image.png"
                                alt=""
                                width={920}
                                height={390}
                            /> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </UserProvider>
    </>
  );
}


'use client'
//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import { useRouter, usePathname } from 'next/navigation'
import AnimatedLink from '@root/components/animated/Link'
import AnimatedButton from '@root/components/animated/Button'
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты

export const metadata = {
    title: 'Страница не найдена'
}

export default function Page() {
    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние

    const router = useRouter();
    const pathname = usePathname();

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты

    //* endof эффекты

    //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* секция обработчики

    //* endof обработчики


    return (
        <section style={{ marginBottom: '-10px' }}>
            <div className="container">
                <div className="mx-auto py-30 px-30 size-14">
                    <h1 className="heading mb-60">404 Страница не найдена.</h1>
                    <p className="subheading mb-60">Возможно, вы ошиблись ссылкой?</p>
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
    );
};

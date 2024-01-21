//* секция Библиотеки c функциями
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
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
        <>
            <section className="loading w-100 h-maxcontent d-flex all-center">
                <div className="loader size-36 lds-ring page color-green">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </section>
        </>
    );
};

//* секция Библиотеки c функциями
import React from "react";
//* endof  Библиотеки c функциями

//* секция Наши хелперы
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Image from 'next/image'
//* endof  Компоненты из библиотек

//* секция Наши компоненты

//* endof  Наши компоненты

export default function Component({
    selectedPage,
    firstPage,
    lastPage,
    handleSetPage,
    pageNumbersToShow = [],
}) {

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
            {/* пагинация */}
            <div className={`w-100 mt-10 d-flex justify-content-center justify-content-lg-end align-items-center`}>
                <div className={`w-100 w-lg-50 d-flex flex-wrap justify-content-center justify-content-lg-end table-pagination numbers `}>
                    <span className={`item ${selectedPage == firstPage && 'disabled'}`} disabled={lastPage == 1} onClick={() => handleSetPage(selectedPage - 1)}>
                        <Image src="/assets/img/icons/arrow-narrow-left" width={10} height={6} alt="" />
                    </span>

                    {/* Просто буду отображать от 1 до n. Все равно здесь нет достаточного кол-ва страниц, чтобы проверить работу 1..2345..n. К тому же в дизайне и в задании об этом ни слова. */}

                    {pageNumbersToShow.map(pageNumber =>
                        <span key={pageNumber} className={`item ${selectedPage == pageNumber && 'active'}`} disabled={selectedPage == pageNumber} onClick={() => handleSetPage(pageNumber)}>{pageNumber}</span>
                    )}

                    <span className={`item ${selectedPage == lastPage && 'disabled'}`} disabled={lastPage == 1} onClick={() => handleSetPage(selectedPage + 1)}>
                        <Image src="/assets/img/icons/arrow-narrow-right" width={10} height={6} alt="" />
                    </span>

                </div>


                <div className="d-none d-lg-block ml-10" style={{ width: '100px' }}>

                </div>
            </div>
        </>
    )

}
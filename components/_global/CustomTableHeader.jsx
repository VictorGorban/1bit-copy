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
import Button from '@components/animated/Button'
import AnimatedLink from '@root/components/animated/Link'
import AnimatedFormBlock from '@root/components/animated/FormBlock'
import * as animatedFormComponents from '@components/animated/forms'
import * as formComponents from '@components/forms'
//* endof  Наши компоненты

export default function Component({
    tableSettings, refreshTable,
    isTableRefreshing, dataLength,
    TooltipBlock = null,
    isActions = true,
    isSearch = false, handleInputSearch = null,
    text, handleSelectNewObject
}) {
    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние
    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    let isArchivedForSelect = [
        { value: false, label: 'Актуальные' },
        { value: true, label: 'Архив' }
    ]
    //* endof вычисляемые переменные, изменение состояния


    //* секция эффекты


    //* endof эффекты


    //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ


    //* секция обработчики
    function handleSetArchived(value) {
        if (value == tableSettings.isArchived) return;
        tableSettings.isArchived = value;
        refreshTable();
    }
    //* endof обработчики

    return (
        <>
            <div className="page-header w-100 color-white" style={{ zIndex: 1 }}>
                <h2 className={`weight-600 size-18 size-md-24 d-flex align-items-center ${isTableRefreshing && 'loading'}`}>
                    {text}
                    {/* ({dataLength}) */}
                    {TooltipBlock && <>
                        <div className="pl-05"></div>
                        <TooltipBlock />
                    </>}
                    <div className="loader lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </h2>

                {isSearch &&
                    // TODO тут нужен FormBlock c обычным TextInput
                    <AnimatedFormBlock htmlElement="label" className={`form-group w-100 p-0 mb-0 mt-25`} scalingMultiplier={0.3}>
                        <div className="input-wrapper position-relative">
                            <div className="icon-block color-white h-100 position-absolute d-flex all-center ml-08" style={{ zIndex: 1}}>
                                <Image
                                    width={16}
                                    height={16}
                                    src="/assets/img/icons/search-circle.svg"
                                    alt=""
                                />
                            </div>
                            <formComponents.TextInput
                                onChange={handleInputSearch}
                                placeholder="Поиск"
                                className="bg-brand border-color-gray2 color-white border-width-1 pl-30"
                            />
                        </div>
                        {/* <span className="field-error">{error?.message}</span> */}
                    </AnimatedFormBlock>
                }

                <div className={`actions d-flex`}>
                </div>
            </div>
        </>
    )

}
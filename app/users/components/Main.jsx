//* секция Библиотеки c функциями
import * as React from "react";
import dayjs from "dayjs";
import _ from 'lodash'
import debounce from 'debounce-promise'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@commonHelpers'
import * as clientHelpers from '@clientHelpers'
import * as notifications from '@clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as PageDataContext } from '@components/providers/PageData'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Head from 'next/head'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation';

//* endof  Компоненты из библиотек

//* секция Наши компоненты
import TemplateTable from '@components/_global/TemplateTable'
import CustomTableFooter from '@components/_global/CustomTableFooter'
import CustomTableHeader from '@components/_global/CustomTableHeader'
import AnimatedButton from '@root/components/animated/Button'
//* endof  Наши компоненты

export default function Main() {
    //* библиотеки и неизменяемые значения
    //* endof библиотеки и неизменяемые значения


    //* контекст
    let { state: pageData } = React.useContext(PageDataContext);
    //* endof контекст

    //* состояние
    let [tableSettings, setTableSettings] = React.useState(_.pick(pageData, ['pageNumbersToShow', 'sortConfig', 'dataLength', 'search', 'firstPage', 'lastPage', 'selectedPage', 'pageRows']))
    const [isTableRefreshing, setTableRefreshing] = React.useState(false)
    //* endof состояние

    //* вычисляемые переменные, изменение состояния
    let { pageNumbersToShow, firstPage, lastPage, selectedPage, pageRows, dataLength } = tableSettings;
    //* endof вычисляемые переменные, изменение состояния

    //* эффекты
    //* endof эффекты

    //* функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ


    //* обработчики
    const debounceHandleInputSearch = debounce((e) => {
        let inputValue = e.target.value;
        tableSettings.search = inputValue || '';
        refreshTable();
    }, 300)

    async function handleSetPage(value) {
        tableSettings.selectedPage = value;
        await refreshTable()
    }

    async function refreshTable() {
        try {
            setTableRefreshing(true)
            const { field, direction } = tableSettings.sortConfig;

            const requestResult = await clientHelpers.submitObject(`${process.env.NEXT_PUBLIC_API_PREFIX}/user/list?search=${tableSettings.search}&page=${tableSettings.selectedPage}&orderBy=${field}:${direction}`, {}, { method: 'get' });

            setTableSettings({ ...tableSettings, pageRows: requestResult.data })
        } catch (e) {
            notifications.showSystemError(e.message)
        } finally {
            setTableRefreshing(false)
        }
    }

    async function handleRequestsSortCustom(field, direction) {
        tableSettings.sortConfig = { field, direction };
        await refreshTable()
    }

    //* endof обработчики

    //* данные для TemplateTable
    let tableHeaders = [
        {
            key: "email",
            isSortable: false,
            title: "Email",
        },
        {
            key: "name",
            isSortable: false,
            title: "Имя"

        },
        {
            key: "role",
            isSortable: false,
            title: "Роль"

        },
        {
            key: "subscription",
            isSortable: false,
            title: "Подписка"
        },
        {
            key: "tokens",
            isSortable: true,
            title: "Токены",
            isDefaultSort: true,
        },
    ];

    let tableFields = React.useMemo(() => [
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.email}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.name}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.role}
                </td>
        },

        {
            render: (item, idx) =>
                <td className="td name">
                    {item.subscription?.plan?.type ?? 'FREE'}
                </td>
        },

        {
            render: (item, idx) =>
                <td className="td name">
                    {item.subscription ? item.subscription.tokens : 0} TKN
                </td>
        },
    ], [])

    let tableActions = React.useMemo(() => function TableActions(row, idx) {
        return (
            <>
                <AnimatedButton className="mx-05 bg-none border-none">
                    <Image
                        width={16}
                        height={16}
                        src="/assets/img/icons/edit.svg"
                        alt=""
                    />
                </AnimatedButton>
                <AnimatedButton className="mx-05 bg-none border-none">
                    <Image
                        width={16}
                        height={16}
                        src="/assets/img/icons/trash.svg"
                        alt=""
                    />
                </AnimatedButton>
            </>
        );
    }, [])
    //* endof данные для TemplateTable

    return (
        <>
            <div className="bg-brand w-100 px-0 px-18 px-md-40 px-lg-25 py-18 py-md-25 border-radius-0 border-radius-md-18 position-relative">
                <div className="w-100 color-white size-18 size-md-24 weight-600 pb-18 pb-md-25">
                    Моя организация
                </div>
                <div className="bg-gray2 position-absolute w-100" style={{height: 1, left: 0}}></div>

                <div className="d-flex justify-content-between w-100 w-100">
                    <div className="w-100 pt-25 pt-md-29 d-flex flex-column align-items-center form">
                        <CustomTableHeader {...{ tableSettings, refreshTable, isTableRefreshing, isSearch: true, handleInputSearch: debounceHandleInputSearch, dataLength, text: 'Пользователи' }} />

                        <div className="w-100 d-flex flex-column align-items-center form mt-18">

                            <TemplateTable
                                edit={false}
                                isSequenceNumber={false}
                                headers={tableHeaders}
                                fields={tableFields}
                                rows={pageRows || []}
                                keyField="id"
                                emptyField="id"
                                isAddEmptyTableItem={false}
                                showByDefault={true}
                                isActions={true}
                                actions={tableActions}
                                actionsHeader="Действия"
                                isBatchActions={false}
                                isRefreshTable={false}
                                isCustomSort={true}
                                requestSortCustom={handleRequestsSortCustom}
                                tableClasses="table w-100"
                                pageSizeDefault={999} // 999 - значит пагинация нестандартная, контролируется вне TemplateTable
                                isTopPages={false}
                                isBottomPages={false}
                            />

                            <CustomTableFooter
                                {...
                                {
                                    selectedPage,
                                    firstPage,
                                    lastPage,
                                    isTableRefreshing,
                                    handleSetPage,
                                    pageNumbersToShow,
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}
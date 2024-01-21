'use client'
//* секция Библиотеки c функциями
import * as React from "react";
import _ from 'lodash'
import EJSON from 'ejson'
import { useRouter, usePathname } from 'next/navigation'
import { motion, usePresence, AnimatePresence } from "framer-motion";
import { useStore } from 'effector-react'
import { Line } from 'react-chartjs-2';

import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import ruLocale from 'dayjs/locale/ru';
import enLocale from 'dayjs/locale/en';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@commonHelpers'
import * as clientHelpers from '@clientHelpers'
import * as notifications from '@clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
import { ReactContext as UserContext } from '@components/providers/User'
import { $userData } from '@clientHelpers/stores'
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Link from 'next/link'
import Image from 'next/image'
//* endof  Компоненты из библиотек

//* секция Виджеты
//* endof  Виджеты

//* секция Наши компоненты
import AnimatedLink from '@root/components/animated/Link'
import AnimatedButton from '@root/components/animated/Button'
import TemplateTable from '@components/_global/TemplateTable'
//* endof  Наши компоненты

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const chartOptions = {
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'hour',
            }
        }
    },
    fill: true,
    interaction: {
        intersect: false
    },
    radius: 0,
    title: {
        display: false,
    },
    legend: {
        display: false,
    }
};

export default function Component({ }) {
    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние
    const [isSidebarOpen, setSidebarOpen] = React.useState(false)
    let [transactionsData, setTransactionsData] = React.useState([])
    const [isDataRefreshing, setDataRefreshing] = React.useState(false)
    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния

    const dataChart = {
        responsive: true,
        // labels: labels,
        datasets: [
            {
                fill: true,
                label: "Transactions amount",
                backgroundColor: "rgba(28, 100, 242, 0.3)",
                borderColor: "rgba(28, 100, 242, 1)",
                borderWidth: 1,
                data: transactionsData.map(item => ({ x: item.created_at, y: item.amount })), // Я не вижу здесь возможности привязки к дате.
                // spanGaps: true
            }
        ],
        options: chartOptions
    };
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты
    React.useEffect(() => {
        // При открытии сайдбара, обновляем данные
        if (isSidebarOpen && !transactionsData.length) {
            refreshData();
        }
    }, [isSidebarOpen])
    //* endof эффекты

    //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ
    function hideSidebar(e) {
        e?.preventDefault();
        setSidebarOpen(false)
        document.body.classList.remove('sidebar-open')
    }

    //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* секция обработчики
    function openSidebar(e) {
        e?.preventDefault();
        setSidebarOpen(true)
        document.body.classList.add('sidebar-open')
    }

    function toggleSidebar(e) {
        e?.preventDefault();
        isSidebarOpen ? hideSidebar(e) : openSidebar(e)
    }

    async function refreshData() {
        try {
            setDataRefreshing(true)

            const requestResult = await clientHelpers.submitObject(`${process.env.NEXT_PUBLIC_API_PREFIX}/user/25794e91-e70b-4553-bdb1-ce3d689b5f02/transactions`, {}, { method: 'get' });
            console.log('requestResult', requestResult);

            setTransactionsData(requestResult)
        } catch (e) {
            notifications.showSystemError(e.message)
        } finally {
            setDataRefreshing(false)
        }
    }

    //* endof обработчики

    //* данные для TemplateTable
    let tableHeaders = [
        {
            key: "type",
            isSortable: false,
            title: "Тип",
        },
        {
            key: "amount",
            isSortable: false,
            title: "Сумма"

        },
        {
            key: "created_at",
            isSortable: false,
            title: "Дата"

        },
    ];

    let tableFields = React.useMemo(() => [
        {
            render: (item, idx) =>
                <td className="td name">
                    {item.type}
                </td>
        },
        {
            render: (item, idx) =>
                <td className={`td name color-${item.amount < 0 ? 'red' : 'green'}`}>
                    {item.amount}
                </td>
        },
        {
            render: (item, idx) =>
                <td className="td name">
                    {commonHelpers.formatDate(item.created_at, 'DD.MM.YYYY, HH:mm:ss')}
                </td>
        },
    ], [])

    let tableActions = React.useMemo(() => function TableActions(row, idx) {
        return (
            <>

            </>
        );
    }, [])
    //* endof данные для TemplateTable

    return (
        <>
            <nav
                className={`navbar p-0 d-flex align-items-center px-15 px-md-18 py-10 py-md-15 color-white bg-brand border-gray2 border-radius-10 border-radius-md-18`}
            >
                <div className="menu-overlay">
                </div>

                <div className="mobile-block w-100 d-flex justify-content-between align-items-center d-md-none">
                    <div className="size-22">BitTest</div>
                    <AnimatedButton className="size-14 size-lg-16 bg-none border-none h-fit-content color-white" onTap={openSidebar}>
                        <Image
                            width={24}
                            height={24}
                            src="/assets/img/icons/organization.svg"
                            className="mr-10"
                            alt=""
                        />
                        Моя организация
                    </AnimatedButton>
                </div>

                <div className="desktop-block w-100 d-none d-md-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="size-22 mr-55">BitTest</div>
                        <div className="size-14 size-lg-16">
                            <Image
                                width={24}
                                height={24}
                                src="/assets/img/icons/organization.svg"
                                className="mr-10"
                                alt=""
                            />
                            Моя организация
                        </div>
                    </div>

                    <AnimatedButton className="user-block d-flex justify-content-between px-15 py-10 bg-none border-gray2 border-radius-6 h-fit-content" onTap={openSidebar}>
                        <Image
                            width={24}
                            height={24}
                            src="/assets/img/icons/organization.svg"
                            alt=""
                        />
                        <div className="user-text ml-10">
                            <div className="color-gray size-12">Вы авторизованы</div>
                            <div className="color-white size-14">Администратор</div>
                        </div>
                    </AnimatedButton>
                </div>


                {/* Блок правого меню, который выезжает при клике на кнопку меню */}
                <div id="rightNav" className={`right-menu-wrapper py-30 py-md-55 pl-15 pl-md-20 pr-20 pr-md-45 overflow-y-scroll ${isSidebarOpen && 'open'}`}
                >
                    <div className="menu-content w-100 h-100">
                        <div className={`d-flex justify-content-between ${isDataRefreshing && 'loading'}`}>
                            <div className="size-18 weight-600 size-md-20">testmail@gmail.com</div>
                            {/* TODO показать лоудер для isLoading */}
                            <div className="loader lds-ring color-white">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                            <AnimatedButton className="bg-none border-none p-0" onTap={hideSidebar}>
                                <Image
                                    width={24}
                                    height={24}
                                    src="/assets/img/icons/close.svg"
                                    alt=""
                                />
                            </AnimatedButton>
                        </div>
                        <div className="size-20 weight-600 mt-15 mt-md-18 mt-lg-20">Использование токенов</div>
                        <div className="graph mt-15 mt-md-18 mt-lg-20">
                            <Line data={dataChart} options={chartOptions} />
                        </div>
                        <div className="bg-gray2 w-100 mt-15 mt-md-18 mt-lg-20" style={{ height: 1 }}></div>
                        <div className="weight-600 mt-15 mt-md-18 mt-lg-20">
                            История операций
                        </div>
                        <div className="w-100 mt-15 mt-md-18 mt-lg-20">
                            <TemplateTable
                                tableHeadClasses="without-bottom-rounding"
                                edit={false}
                                isSequenceNumber={false}
                                headers={tableHeaders}
                                fields={tableFields}
                                rows={transactionsData?.slice(0, 20) || []}
                                keyField="id"
                                emptyField="id"
                                isAddEmptyTableItem={false}
                                showByDefault={true}
                                isActions={false}
                                actions={tableActions}
                                isBatchActions={false}
                                isRefreshTable={false}
                                isCustomSort={true}
                                tableClasses="table w-100"
                                pageSizeDefault={999} // 999 - значит пагинация нестандартная, контролируется вне TemplateTable
                                isTopPages={false}
                                isBottomPages={false}
                            />
                        </div>
                    </div>
                </div>
            </nav >

        </>
    )
}

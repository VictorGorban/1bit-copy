'use client'
//* секция Библиотеки c функциями
import React from 'react';
import _ from 'lodash';
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@commonHelpers'
import * as clientHelpers from '@clientHelpers'

//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
import Modal from 'react-modal';
//* endof  Компоненты из библиотек

//* секция Наши компоненты
import Button from '@components/animated/Button'
//* endof  Наши компоненты

//* секция Стили компонента
//* endof  Стили компонента

Modal.setAppElement('#pageRoot');

export default React.forwardRef(function Component({ objectName }, elRef) {

    //* секция глобальное состояние из context
    //* endof глобальное состояние из context

    //* секция состояние
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [promiseActions, setPromiseActions] = React.useState(null);

    //* endof состояние


    //* секция вычисляемые переменные, изменение состояния
    //* endof вычисляемые переменные, изменение состояния

    //* секция эффекты
    React.useImperativeHandle(elRef, () => ({
        setModalOpen,
        setPromiseActions,
    }))

    //* endof эффекты

    //* секция функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* endof функции-хелперы, НЕ ОБРАБОТЧИКИ

    //* секция обработчики
    function handleYes() {
        promiseActions.resolve(true)
        setModalOpen(false);
    }

    function handleNo() {
        promiseActions.resolve(false)
        setModalOpen(false);
    }

    //* endof обработчики
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleNo}
                overlayClassName={{
                    base: 'modal-overlay-base',
                    afterOpen: 'modal-overlay-after',
                    beforeClose: 'modal-overlay-before'
                }}
                className={{
                    base: 'modal-content-base w-100',
                    afterOpen: 'modal-content-after',
                    beforeClose: 'modal-content-before'
                }}
                closeTimeoutMS={500}
            >
                <div className="w-100 h-100 bg-brand5 p-10">
                    <div className="w-100 h-100 bg-white position-relative">
                        <Button
                            variant="modal-close"
                            onClick={handleNo}
                        >
                            <i className="fa fa-close size-36"></i>
                        </Button>
                        <div className="bg-white px-40 py-30 border-radius-5">
                            <div className="header d-flex align-items-center justify-content-center mb-10">
                                <h5 className="modal-heading">Объект архивирован: {objectName}</h5>
                            </div>
                            <div className="content form w-100 d-flex justify-content-center flex-wrap mt-10">
                                <p className="size-20">Этот объект архивирован. Отменить архивацию?</p>
                            </div>

                            <div className="footer d-flex justify-content-center align-items-center mt-30">
                                <Button
                                    variant="green"
                                    className={`mx-05 py-20 px-20 size-16 weight-500`}
                                    onClick={handleYes}
                                >
                                    Отменить архивацию
                                </Button>

                                <Button
                                    variant="default"
                                    className={`mx-05 py-20 px-20 size-16 weight-500`}
                                    onClick={handleNo}
                                >
                                    Закрыть это окно
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
})
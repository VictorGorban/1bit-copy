export let protectionTypesForSelect = [
    { value: 'none', label: 'Без защиты', tooltip: 'Нет дополнительной защиты ключа. Имеет смысл только для full-online активации в окружениях где точно нет прослушки сети. Изначально применялся для регистрации приложений-компаньонов по appID этого приложения.' },
    { value: 'rsa', label: 'Асинхронная подпись RSA', tooltip: 'Предполагается активация приложений с функцией работы в оффлайне. Генерируется дополнительный защитный токен, который шифруется по методу RSA (пара публичный+приватный ключ). Публичный ключ будет храниться у клиента. Публичный ключ служит для проверки актуальности данных в оффлайне. Скачиваемым здесь публичным ключом активируются устройства конечных пользователей.' },
    // { value: 'aes', label: 'Синхронное шифрование AES', tooltip: 'Предполагается активация только full-online приложений и других программ. Т.к. один и тот же секрет используется для шифрования и расшифрования, для активации/проверки в оффлайне нужно хранить этот ключ внутри приложения, что небезопасно. Если и использовать этот вариант, то только для онлайн-проверок или вебсерверов.' },
]

export let statusesForSelect = [
    { value: 'active', label: 'Активный' },
    { value: 'disabled', label: 'Неактивный' },
]

export let deactivationMethodsForSelect = [
    { value: 'manual', label: 'Только ручное', tooltip: 'Отключение выставлением поля Статус в "Неактивный"' },
    { value: 'validUntil', label: 'Время отключения', tooltip: 'Время отключения, одинаковое для всех устройств' },
    { value: 'perDevice', label: 'Срок с начала использования', tooltip: 'Устройство отключится, когда истечет указанный период. Период начинается в момент активации ключа. Пример: ключ с периодом 7 дней, на устройстве 1 активировали в среду, а на устройстве 2 в четверг; устройство 1 отключится в следующую среду, а устройство 2 в четверг.' },
]

export let activationScopesForSelect = [
    { value: 'project', label: 'Весь проект', tooltip: 'Нет привязки к компании или пользователю.' },
    { value: 'company', label: 'Компания', tooltip: 'Информация о привязанной компании отображается в окне лицензии. ' },
    { value: 'personal', label: 'Персональный', tooltip: 'Информация о привязанном пользователе отображается в окне лицензии. Эта возможность была нужна для пользователей, которые самостоятельно зарегистрировались в системе. В этом проекте персональность означает только то, что email и имя пользователя отображаются в окне лицензии.' },
]

export function protectionTypeTooltip(value) {
    let protectionType = protectionTypesForSelect.find(obj => obj.value == value);
    if (protectionType) return protectionType.tooltip
    else return 'Нет информации' || 'Нет информации'
}

export function activationScopeTooltip(value) {
    let activationScope = activationScopesForSelect.find(obj => obj.value == value);
    if (activationScope) return activationScope.tooltip || 'Нет информации'
    else return 'Нет информации'
}

export function deactivationMethodTooltip(value) {
    let deactivationMethod = deactivationMethodsForSelect.find(obj => obj.value == value);
    if (deactivationMethod) return deactivationMethod.tooltip || 'Нет информации'
    else return 'Нет информации'
}
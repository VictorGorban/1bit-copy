export let rolesForSelect = [
    { value: 'globalAdmin', label: 'Админ системы' },
    { value: 'companyAdmin', label: 'Админ компании' },
    { value: 'user', label: 'Отдельный пользователь' },
]

export function getRussianRole(roleValue) {
    let role = rolesForSelect.find(obj => obj.value == roleValue);
    if (role) return role.label
    else return roleValue;
}

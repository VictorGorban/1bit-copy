import dayjs from 'dayjs'
import debounce from 'debounce-promise'
import * as commonHelpers from '@commonHelpers'
import * as notifications from '@clientHelpers/notifications'
import * as clientHelpers from './index'

export async function loadCompanyById(companyId, callback) {
  try {
    if (!companyId) return;
    let company = await clientHelpers.submitObject("/api/companies/getOne", { _id: companyId });
    callback(company)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export async function loadProjectById(projectId, callback) {
  try {
    if (!projectId) return;
    let project = await clientHelpers.submitObject("/api/projects/getOne", { _id: projectId });
    callback(project)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export async function loadUserById(userId, callback) {
  try {
    if (!userId) return;
    let project = await clientHelpers.submitObject("/api/users/getOne", { _id: userId });
    callback(project)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export async function loadCompaniesOptions(inputValue, callback) {
  try {
    let { pageRows } = await clientHelpers.submitObject("/api/companies/tableFilterAndSort", { search: inputValue, pageSize: 20, selectedPage: 1 });
    let pageRowsForSelect = pageRows.map(obj => ({ value: obj._id, label: commonHelpers.formatCompanyName(obj) }))
    callback(pageRowsForSelect)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export let debounceLoadCompaniesOptions = debounce(loadCompaniesOptions, 300);

export async function loadProjectsOptions(inputValue, callback) {
  try {
    let { pageRows } = await clientHelpers.submitObject("/api/projects/tableFilterAndSort", { search: inputValue, pageSize: 20, selectedPage: 1 });
    let pageRowsForSelect = pageRows.map(obj => ({ value: obj._id, appId: obj.appId, label: obj.name }))
    
    callback(pageRowsForSelect)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export let debounceLoadProjectsOptions = debounce(loadProjectsOptions, 300);

export async function loadUsersOptions(inputValue, callback) {
  try {
    let { pageRows } = await clientHelpers.submitObject("/api/users/tableFilterAndSort", { search: inputValue, pageSize: 20, selectedPage: 1 });
    let pageRowsForSelect = pageRows.map(obj => ({ value: obj._id, appId: obj.appId, label: obj.name }))
    callback(pageRowsForSelect)
  } catch (e) {
    notifications.showSystemError(e.message)
  }
}

export let debounceLoadUsersOptions = debounce(loadUsersOptions, 300);
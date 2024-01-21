'use client'
//* секция Библиотеки c функциями
import React from "react";
import _ from 'lodash'
import Image from 'next/image'
import { motion } from 'framer-motion'
//* endof  Библиотеки c функциями

//* секция Наши хелперы
import * as commonHelpers from '@commonHelpers'
import * as notifications from '@clientHelpers/notifications'
//* endof  Наши хелперы

//* секция Контекст и store
//* endof  Контекст и store

//* секция Компоненты из библиотек
//* endof  Компоненты из библиотек

//* секция Наши компоненты
//* endof  Наши компоненты


const RowContentMemo = ({ row, rowIndex, fields, tdNoContent }) => {
  // console.log('RowMemo renders');
  return <>{fields.map((field, fieldIndex) =>
    <React.Fragment key={fieldIndex}>{field.render(row, rowIndex) || tdNoContent} </React.Fragment>
  )}</>
}

//emptyField: по какому полю определять что это пустой элемент. Если не указано, то сравнивается весь объект !item. Также используется как row.key
//fields: ключи для вывода в таблице, например ['name', 'fio.name', 'contacts.email']
//searchFields: ключи для поиска по ним
//headers: заголовки таблицы: {title, isSortable, key||sortKey||valueFunction}
//actions: действия
//параметры с суффиксом -custom нужны в основной при серверной пагинации и сортировки.
//* memo убрал, т.к. в компонентах отдаваемые параметры не запоминаются вообще нигде
export default function TemplateTable({
  isRowPaddingY = false,
  id = "",
  errorRowId = null,
  edit = false,
  headers = [],
  beforeHeaders = null,
  searchFields = [],
  fields = [],
  selectedRows = [],
  setSelectedRows = () => null,
  getRowClasses = () => null,
  rows = [],
  tdNoContent = <td className="td"></td>,
  tableClasses = "",
  showByDefault = false,
  emptyField = "_id",
  keyField,
  isSequenceNumber = true,
  sequenceHeader = "№",
  isActions = true,
  actionsWidth = '40px', // для ячейки таблицы значение >0 но меньше фактического аналогично 'fit-content для блока'
  actions = (e, item) => null,
  actionsHeader = "Действие",
  isBatchActions = true,
  batchActions = (e, items) => null,
  forcePages = true,
  pageSizeDefault = 10,
  tableHeadClasses = '',
  beforeTable = null,
  setPageSizeCustom,
  setPageCustom,
  isCustomSort = false,
  requestSortCustom = (item, sortConfig) => null,
}) {
  if (!keyField) keyField = emptyField
  //*библиотеки и неизменяемые данные
  let elRef = React.useRef();
  //*endof библиотеки и переменные общего назначения

  //*глобальное состояние
  //*endof глобальное состояние

  //*состояние
  const [isTableLoaded, setTableLoaded] = React.useState(showByDefault);
  const [isTableRefreshing, setTableRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState(getDefaultSortConfig(headers)); // функция getDefaultSortConfig вызывается каждый рендер, и даже с useMemo(headers)
  const [customSortConfig, setCustomSortConfig] = React.useState({});
  let [pageSize, setPageSize] = React.useState(pageSizeDefault)
  let [page, setPage] = React.useState(1)
  //*endof состояние

  //*вычисляемые переменные, изменение состояния
  let pageSizeOptions = [3, 10, 15, 25, 50].map(v => ({ value: v, label: `${v}` }))

  let filteredRows = rows

  if (!isCustomSort) {
    if (sortConfig.item?.valueFunction) {
      filteredRows = _.orderBy(filteredRows, [o => sortConfig.item?.valueFunction(o)], [sortConfig.direction])
    } else if (sortConfig.item?.key) {
      filteredRows = _.orderBy(filteredRows, [o => _.get(o, sortConfig.item?.key)], [sortConfig.direction])
    }
    else if (sortConfig.item?.sortKey) {
      filteredRows = _.orderBy(filteredRows, [o => _.get(o, sortConfig.item?.sortKey)], [sortConfig.direction])
    } else {
      // сортировка по самому элементу, например по числу
      // уберем пока сортировку, сортировать обычные массивы не стоит
      // filteredRows = _.orderBy(filteredRows, [o => o], [sortConfig.direction])
    }

    // customSortConfig Кастомная сортировка по строкам
    if (customSortConfig.item?.sortFunction) {
      filteredRows = customSortConfig.item?.sortFunction({ array: filteredRows, key: customSortConfig.item?.key, direction: customSortConfig.direction })
    }

    if (search && searchFields.length) {
      let lowerCasedSearch = search.toLowerCase();
      filteredRows = filteredRows.filter(row => {
        if (typeof row == 'object' && !_.get(row, emptyField, undefined)) return true; // пустое, значит только что добавленное
        if (typeof row != 'object' && !row) {
          return true;
        }

        for (let sf of searchFields) {
          let header = headers.find(item => item.key == sf.key)
          let value = `${_.get(row, sf.key, '')}`
          if (header) {
            if (header.valueFunction) {
              value = header.valueFunction(row)
            }
          }
          //Поиск просто на совпадение в любом месте строки
          if (!sf?.isFromStart && `${value}`.toLowerCase().includes(lowerCasedSearch)) {
            return true
          }
          //Поиск с начала строки
          else if (sf?.isFromStart && `${value}`.toLowerCase().startsWith(lowerCasedSearch)) {
            return true
          } else {
            return false
          }

        }
        return false;
      })
    }

    if (filteredRows.length && typeof filteredRows[0] == 'object') {
      filteredRows = _.orderBy(filteredRows, [o => o['isArchive']], ['up'])
    }
  }


  let filteredCount = filteredRows.length;

  let firstPage = 1;
  let remainder = filteredCount % pageSize
  //* Если пагинация серверная, то firstPage, lastPage, pageNumbersToShow ставится именно там. А вообще, в случае серверной пагинации 
  //* нужно просто скрыть блок пагинации, и делать все это в родительском компоненте: TemplateTable оставить только для показа строк.
  let lastPage = Math.floor(filteredCount / pageSize)
  if (remainder) lastPage++
  if (page > lastPage) page = lastPage; // такая ситуация может возникнуть при смене кол-ва строк

  let pageInterval = [(page - 1) * pageSize, page * pageSize]
  if (pageInterval[1] > filteredCount) {
    pageInterval[1] = filteredCount
  }

  let pageRows = filteredRows.slice(pageInterval[0], pageInterval[1])

  let pageNumbersToShow = [page - 2, page - 1, page, page + 1, page + 2].filter(item => item >= firstPage && item <= lastPage)

  //*endof вычисляемые переменные, изменение состояния

  //*эффекты
  React.useEffect(() => {
    let defaultSortConfig = getDefaultSortConfig(headers);
    // console.log('defaultSortConfig', defaultSortConfig, sortConfig)
    if (!_.isEqual(sortConfig, defaultSortConfig)) {
      setSortConfig(defaultSortConfig)
    }
  }, [])

  React.useEffect(() => { setSelectedRows([]) }, [page])

  React.useEffect(() => {
    if (!pageRows.length) return;
    if (!isTableLoaded) return;

  }, [pageRows, isTableLoaded])
  //*endof эффекты

  //*функции-хелперы, НЕ ОБРАБОТЧИКИ
  function getDefaultSortConfig(headers) {
    let defaultSortHeader = headers.find(h => h.isDefaultSort);
    if (defaultSortHeader) {
      return { item: defaultSortHeader, direction: defaultSortHeader.defaultDirection || 'asc' }
    }
    return {}
  }

  //*endof функции-хелперы, НЕ ОБРАБОТЧИКИ

  //*обработчики
  async function handleSetPage(value) {
    if (errorRowId) {
      notifications.showUserError('Сначала исправьте ошибки на этой странице')
      return;
    }
    let totalCount = rows.length
    let lastPage = Math.floor(totalCount / pageSize)
    console.log('lastPage', lastPage)
    if (value > lastPage + 1) {
      value = lastPage + 1;
    }

    // перейдем на следующую страницу. Если данные к тому времени обновятся, мы это увидим.
    setPage(value)
    if (setPageCustom) {
      setTableRefreshing(true)
      await setPageCustom(value)
      setTableRefreshing(false)
    }
  }

  // если isCustomSort, то тут у нас setCustomSortConfig, customSortFunction
  async function requestSort(item) {
    let direction = 'asc'
    if (sortConfig.item?.key == item.key) {
      direction = sortConfig.direction == 'asc' ? 'desc' : 'asc';
    }
    let field = item.key;
    if (isCustomSort) {
      // console.log('requestSortCustom', item, sortConfig)
      requestSortCustom(field, direction)
      // console.log('end of requestSortCustom', direction)
    }
    setSortConfig({ item, direction });
  };

  function requestCustomSort(item, direction) {
    setCustomSortConfig({ item, direction });
  };

  function selectRow(e, row) {
    // e?.preventDefault();
    e?.stopPropagation();
    let checked = e.currentTarget.checked
    if (checked) {
      selectedRows.push(row)
    } else {
      selectedRows = selectedRows.filter(item => item != row)
    }

    setSelectedRows([...selectedRows])
  };

  function selectAllRows(e) {
    let checked = e.currentTarget.checked
    if (checked) {
      selectedRows = filteredRows.filter(row => !row.isArchive);
    } else {
      selectedRows = [];
    }

    setSelectedRows([...selectedRows])
  }

  //*endof обработчики

  return (
    <form className="form w-100" ref={elRef}>

      <div className="table-wrapper">
        <div id="scrollWrapper" data-id={id} className="table-scroll-wrapper">
          <table className={tableClasses}>
            <Thead />
            <tbody className="tbody">
              {
                isTableLoaded && pageRows.map((row, rowIndex) =>
                  <Row {...{ row, rowIndex }} key={_.get(row, keyField, row)} />
                )
              }

              {isRowPaddingY ? <tr className="tr"></tr> : null}
            </tbody>
            {/* Дублирование заголовков снизу*/}
            {pageSize > 20 && filteredRows.length > 20 && isTableLoaded &&
              <Thead />
            }
          </table>
        </div>


      </div>
    </form>
  );

  //* секция компоненты, работающие с вычисленными переменными из более глобальной области видимости
  function Thead() {
    return (
      <thead className={"thead " + tableHeadClasses}>
        {(beforeHeaders || null) && beforeHeaders}
        <tr className="tr">
          {isSequenceNumber && <th className="th table-header" style={{ width: '40px' }}>{sequenceHeader}</th>}
          {headers.map(header =>
            <th key={`${header.key}`} className={`th table-header ${header.isSortable ? 'hover-pointer' : ''}`} onMouseDown={header.isSortable ? () => requestSort(header) : null}>
              <div className="table-header">
                <div className="d-inline-flex align-items-center" style={{ minHeight: '25px' }}>
                  {header.titleHtml ? header.titleHtml : <span className="table-span">{header.title}</span>}
                  &nbsp;
                  {sortConfig.item?.key == header.key && (sortConfig.direction == 'asc' ? '↑' : '↓')}
                </div>
              </div>
            </th>
          )}
          {isActions &&
            <th className="th table-header" style={{ width: actionsWidth }}>
              <div className="d-inline-flex">
                {isBatchActions &&
                  <label className="btn">
                    <input spellCheck="false" type="checkbox" style={{ width: '15px', height: '15px' }} checked={selectedRows.length && selectedRows.length == filteredRows.length && selectedRows[0] == filteredRows[0]}
                      onChange={e => selectAllRows(e)} />
                  </label>
                }
                {isBatchActions && batchActions(selectedRows)}
                {!isBatchActions && actionsHeader}
              </div>
            </th>}
        </tr>
      </thead>
    )
  }

  function Pagination() {
    return (
      <span className={`table-pagination numbers ${!forcePages && pageSize >= filteredCount && 'd-none'}`}>
        <span className={`item bordered ${page == firstPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(page - 1)}>
          &#60;
        </span>

        {lastPage >= 5 && page >= firstPage + 3 &&
          <>
            <span className={`item ${page == firstPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(firstPage)}>{firstPage}</span>
            {page > firstPage + 3 && <span className="item empty">...</span>}
          </>
        }
        {pageNumbersToShow.map(pageNumber =>
          <span key={pageNumber} className={`item ${page == pageNumber && 'active'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(pageNumber)}>{pageNumber}</span>
        )}
        {lastPage >= 5 && page <= lastPage - 3 &&
          <>
            {page < lastPage - 3 && <span className="item empty">...</span>}
            <span className={`item ${page == lastPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(lastPage)}>{lastPage}</span>
          </>
        }

        <span className={`item bordered ${page == lastPage && 'disabled'}`} disabled={isTableRefreshing} onClick={() => handleSetPage(page + 1)}>
          &#62;
        </span>

      </span>
    )
  }

  function Row({ row, rowIndex, ...otherProps }) {
    return (
      <motion.tr
        className={`${getRowClasses(row) || 'tr'}`}
        whileHover={{ scale: 0.99 }}
        transition={{ duration: 0 }}
      >
        {isSequenceNumber && <td className="td index">{(page - 1) * pageSize + rowIndex + 1}</td>}
        <RowContentMemo {...{ row, rowIndex, fields, tdNoContent }} />
        {isActions &&
          <td className={`td actions ${errorRowId == _.get(row, keyField, row) && 'error'}`} style={{ width: actionsWidth }}>
            <div className="d-inline-flex">
              {row && !row.isArchive && isBatchActions &&
                <label className="btn">
                  <input spellCheck="false" type="checkbox" style={{ width: '15px', height: '15px' }} checked={selectedRows.includes(row)} onChange={e => selectRow(e, row)} />
                </label>
              }
              {actions(row)}
            </div>
          </td>
        }
      </motion.tr>
    )
  }
  //* endof компоненты, работающие с вычисленными переменными из более глобальной области видимости
}

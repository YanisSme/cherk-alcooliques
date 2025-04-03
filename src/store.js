import {ViewType} from './config.js'
import {getCurrentMonthIndex, getCurrentYear} from './utils/dateUtils.js'

const subscribers = []

export const subscribeStore = (callback) => {
  subscribers.push(callback)
  return true
}

export const unsubscribeStore = (callback) => {
  const foundCBIndex = subscribers.findIndex(cb => cb === callback)
  if (foundCBIndex !== -1) {
    subscribers.splice(foundCBIndex, 1)
    return true
  }

  return false
}

const sendUpdates = () => {
  subscribers.forEach(cb => cb(store))
}

const createStore = (val) => {
  return new Proxy(val, {
    get(target, p) {
      return target[p]
    },
    set(target, p, value) {
      target[p] = value

      if (p === 'viewType')
        saveViewType(value)

      if (target?.__proto__?.name === 'checkedDates') {
        saveCheckedDates(target)
      }

      sendUpdates()
      return true
    },
  })
}

const saveViewType = (value) => {
  localStorage.setItem('viewType', value)
}

const saveCheckedDates = (value) => {
  localStorage.setItem('checkedDates', JSON.stringify(value))
}

const getSavedStore = () => {
  const viewType = localStorage.getItem('viewType')
  let checkedDates = localStorage.getItem('checkedDates')
  if (checkedDates) checkedDates = JSON.parse(checkedDates)

  return {
    viewType, checkedDates
  }
}

const initStore = () => {
  const savedStore = getSavedStore()

  const arr = savedStore.checkedDates || []
  arr.__proto__.name = 'checkedDates'

  const _store = {
    viewType: savedStore.viewType || ViewType.Year,

    currentYear: getCurrentYear(),
    currentMonth: getCurrentMonthIndex(),

    checkedDates: createStore(arr),
  }

  return createStore(_store)
}

export const store = initStore()

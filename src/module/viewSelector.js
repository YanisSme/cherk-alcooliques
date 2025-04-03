import {store} from '../store.js'
import {DOM, ViewType} from '../config.js'

const renderView = () => {
  // month
  if (store.viewType === ViewType.Month) {
    // if month tab doesn't have Active class
    if (!DOM.tabViewTypeMonth.classList.contains('active'))
      // set Active class to month tab
      DOM.tabViewTypeMonth.classList.add('active')
    // if year tab has Active class
    if (DOM.tabViewTypeYear.classList.contains('active'))
      // remove Active class from year tab
      DOM.tabViewTypeYear.classList.remove('active')
  }

  // year
  if (store.viewType === ViewType.Year) {
    // if year tab doesn't have Active class
    if (!DOM.tabViewTypeYear.classList.contains('active'))
      // set Active class to year tab
      DOM.tabViewTypeYear.classList.add('active')
    // if month tab has Active class
    if (DOM.tabViewTypeMonth.classList.contains('active'))
      // remove Active class from month tab
      DOM.tabViewTypeMonth.classList.remove('active')
  }
}

export const handleClickTabMonth = () => {
  store.viewType = ViewType.Month
  renderView()
}

export const handleClickTabYear = () => {
  store.viewType = ViewType.Year
  renderView()
}

export const initViewSelector = () => {
  renderView()

  DOM.tabViewTypeMonth.addEventListener('click', handleClickTabMonth)
  DOM.tabViewTypeYear.addEventListener('click', handleClickTabYear)
}

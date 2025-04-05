import {DOM, ViewType} from '../config.js'
import {store, subscribeStore} from '../store.js'
import {getCurrentMonthIndex, getCurrentYear, getNextDate, getPrevDate} from '../utils/dateUtils.js'
import {handleClickTabMonth} from './viewSelector.js'
import { saveCalendarData } from './database.js';
import { auth } from '../main.js'; // Laissez cette ligne pour importer auth
// Supprimez toute autre importation de 'app' si vous l'avez ajoutée ici par erreur

const dayTime = 24*60*60*1000

const handleCellClick = (event) => {
  console.log('test')
  const time = event.target.getAttribute('data-time')
  const foundTimeIndex = store.checkedDates.findIndex(t => t === time)

  if (foundTimeIndex !== -1) {
    store.checkedDates.splice(foundTimeIndex, 1)
  } else {
    store.checkedDates.push(time)
  }
}

const renderCalendar = () => {
  console.log('renderCalendar called'); // Ajoutez cette ligne pour le débogage
  const container = DOM.calendarContainer

  if (store.viewType !== ViewType.Month) {
    if (!container.classList.contains('hidden'))
      container.classList.add('hidden')

    return false
  }

  const totalDays = []
  const drinkingDays = []

  if (container.classList.contains('hidden'))
    container.classList.remove('hidden')

  container.innerHTML = ""

  const currentDate = new Date(store.currentYear, store.currentMonth, 1)
  const localeCurrentDate = new Date()
  localeCurrentDate.setHours(0,0,0, 0)

  let date = new Date(currentDate)

  let day = date.getDay()
  if (day === 0) day = 7

  if (day > 1) {
    date = new Date(date.getTime() - (day-1) * dayTime)
  }

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement('div')
      cell.classList.add('cell')

      const time = date.getTime().toString()

      let isStored = store.checkedDates.includes(time)

      cell.setAttribute('data-time', time)

      cell.innerText = date.toLocaleDateString('ru-RU', { day: '2-digit' })

      if (isStored) {
        cell.classList.add('full')
      } else {
        cell.classList.add('empty')
      }

      // if other month
      if (date.getMonth() !== store.currentMonth) {
        cell.classList.add('other-month')
        if (date.getTime() > localeCurrentDate.getTime()) {
          cell.classList.add('not-come')
        }
      } else if (date.getTime() > localeCurrentDate.getTime()) {
        cell.classList.add('not-come')
      } else {
        if (isStored)
          drinkingDays.push(time)
        totalDays.push(time)

        cell.addEventListener('click', handleCellClick)
      }

      // if today
      if (date.getTime() === localeCurrentDate.getTime()) {
        cell.classList.add('today')
      }

      container.appendChild(cell)

      date = new Date(date.getTime() + dayTime)
    }
  }

  DOM.statistic.totalDays.innerText = totalDays.length.toString()
  DOM.statistic.drinking.innerText = drinkingDays.length.toString()
  DOM.statistic.notDrinking.innerText = (totalDays.length - drinkingDays.length).toString()

   // Calculer et afficher la proportion
   const progressElement = document.getElementById('drinking-progress');
   const percentage = totalDays.length > 0 ? (drinkingDays.length / totalDays.length) * 100 : 0;
   progressElement.style.width = `${percentage}%`;
 
   // Afficher le pourcentage
   const percentageElement = document.getElementById('drinking-percentage');
   percentageElement.textContent = `${Math.round(percentage)}%`; // On arrondit le pourcentage pour l'affichage
}

const renderYearCalendar = () => {
  const container = DOM.yearCalendarContainer

  if (store.viewType !== ViewType.Year) {
    if (!container.classList.contains('hidden'))
      container.classList.add('hidden')

    return false
  }

  if (container.classList.contains('hidden'))
    container.classList.remove('hidden')

  const totalDays = []
  const drinkingDays = []

  const localeCurrentDate = new Date()
  localeCurrentDate.setHours(0,0,0, 0)

  container.innerHTML = ""

  for (let i = 0; i < 12; i++) {
    let date = new Date(store.currentYear, i)
    const currentMonthIndex = date.getMonth()
    const currentMonthName = date.toLocaleDateString('fr-FR', { month: 'long' })

    const monthEl = document.createElement('div')
    monthEl.classList.add('year-month')

    monthEl.addEventListener('click', () => {
      handleClickTabMonth()
      viewSelectedMonth(i)
    })

    const monthText = document.createElement('div')
    monthText.classList.add('title')
    monthText.textContent = currentMonthName

    let day = date.getDay()
    if (day === 0) day = 7

    if (day > 1) {
      date = new Date(date.getTime() - (day-1) * dayTime)
    }

    const monthCellsEl = document.createElement('div')
    monthCellsEl.classList.add('month-cells')

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('div')
        cell.classList.add('month-cell')

        const time = date.getTime().toString()

        if (date.getMonth() !== currentMonthIndex) {
          cell.classList.add('other-day')
        } else if (date.getTime() > localeCurrentDate.getTime()) {
          cell.classList.add('not-come')
        } else {
          if (store.checkedDates.includes(time)) {
            cell.classList.add('full')
            drinkingDays.push(time)
          }

          totalDays.push(time)
        }

        monthCellsEl.appendChild(cell)

        date = new Date(date.getTime() + dayTime)
      }
    }

    monthEl.append(monthText, monthCellsEl)
    container.appendChild(monthEl)
  }

  DOM.statistic.totalDays.innerText = totalDays.length.toString()
  DOM.statistic.drinking.innerText = drinkingDays.length.toString()
  DOM.statistic.notDrinking.innerText = (totalDays.length - drinkingDays.length).toString()

   // Calculer et afficher la proportion
   const progressElement = document.getElementById('drinking-progress');
   const percentage = totalDays.length > 0 ? (drinkingDays.length / totalDays.length) * 100 : 0;
   progressElement.style.width = `${percentage}%`;
 
   // Afficher le pourcentage
   const percentageElement = document.getElementById('drinking-percentage');
   percentageElement.textContent = `${Math.round(percentage)}%`; // On arrondit le pourcentage pour l'affichage
}

const renderSelector = () => {
  if (store.viewType === ViewType.Month)
    DOM.selector.item.innerText = `${(new Date(store.currentYear, store.currentMonth)).toLocaleDateString('fr', { month: 'long' })} ${store.currentYear}`
  else if (store.viewType === ViewType.Year)
    DOM.selector.item.innerText = store.currentYear
}

const renderTodayButton = () => {
  DOM.todayButton.hidden = !(store.currentMonth !== getCurrentMonthIndex() || store.currentYear !== getCurrentYear());
}

const listenStore = () => {
  console.log('listenStore called, viewType:', store.viewType); // Ajoutez cette ligne
  renderSelector()
  renderCalendar()
  renderYearCalendar()
  renderTodayButton()

    // Ajoutez l'appel à saveCalendarData ici
    if (auth.currentUser) { // Assurez-vous que l'utilisateur est connecté
      saveCalendarData(auth.currentUser.uid, store.checkedDates);
    }
}

const handleClickPrevButton = () => {
  if (store.viewType === ViewType.Month) {
    const prevDate = getPrevDate(store.currentYear, store.currentMonth)
    store.currentYear = prevDate.getFullYear()
    store.currentMonth = prevDate.getMonth()
  } else {
    store.currentYear = store.currentYear - 1
  }
}

const handleClickNextButton = () => {
  if (store.viewType === ViewType.Month) {
    const nextDate = getNextDate(store.currentYear, store.currentMonth)
    store.currentYear = nextDate.getFullYear()
    store.currentMonth = nextDate.getMonth()
  } else {
    store.currentYear = store.currentYear + 1
  }
}

const handleClickTodayButton = () => {
  store.currentYear = getCurrentYear()
  store.currentMonth = getCurrentMonthIndex()
}

const viewSelectedMonth = (month) => {
  store.currentMonth = month
}

export const initCalendar = () => {
  listenStore()

  DOM.selector.arrowPrev.addEventListener('click', handleClickPrevButton)
  DOM.selector.arrowNext.addEventListener('click', handleClickNextButton)
  DOM.todayButton.addEventListener('click', handleClickTodayButton)

  subscribeStore(listenStore)
}

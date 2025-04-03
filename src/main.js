import { initViewSelector } from './module/viewSelector.js'
import {initCalendar} from './module/calendar.js'

const init = () => {
  initViewSelector()
  initCalendar()
}

const main = () => {
  try {
    // Проверка того, что наш браузер поддерживает Service Worker API.
    console.log('serviceWorker' in navigator)
    if ('serviceWorker' in navigator) {
      // Весь код регистрации у нас асинхронный.
      navigator.serviceWorker.register('./sw.js')
        .then(() => navigator.serviceWorker.ready.then(() => {
          console.log('registered')
        }))
        .catch((err) => console.error(err));
    }
  } catch (err) {
    console.error(err)
  }

  init()
}

main()

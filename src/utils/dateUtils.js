export const getCurrentYear = () => (new Date()).getFullYear()

export const getCurrentMonthIndex = () => (new Date()).getMonth()

export const getPrevDate = (year, month) => {
  // const date = new Date(year, month)
  if (month === 1) {
    year--
    month = 12
  } else {
    month--
  }

  return new Date(year, month)
}

export const getNextDate = (year, month) => {
  if (month === 12) {
    year++
    month = 1
  } else {
    month++
  }

  return new Date(year, month)
}


export const DOM = {
  tabViewTypeMonth: document.getElementById('tab-month'),
  tabViewTypeYear: document.getElementById('tab-year'),

  calendarContainer: document.getElementById('calendar-root'),
  yearCalendarContainer: document.getElementById('year-calendar-root'),

  todayButton: document.getElementById('button-go-today'),

  statistic: {
    drinking: document.getElementById('statistic-value-drinking'),
    notDrinking: document.getElementById('statistic-value-not-drink'),
    totalDays: document.getElementById('statistic-value-total-days'),
  },

  selector: {
    arrowPrev: document.querySelector('.selector--arrow[data-arrow-mode="prev"]'),
    arrowNext: document.querySelector('.selector--arrow[data-arrow-mode="next"]'),
    item: document.querySelector('.selector--item')
  }
}

export const ViewType = {
  Month: 'Month',
  Year: 'Year'
}

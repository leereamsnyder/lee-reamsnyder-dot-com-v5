import { MONTH_NAMES } from '$lib/constants'
import { getChildFiles } from '$lib/data/index'
import getArchivesYearsAndMonths from '../getArchivesYearsAndMonths'

/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ params, fetch }) {
  const [paramYear, paramMonth] = params.dateParts.split('/')

  let monthName = ''
  let postsForMonth = []
  let months = []
  if (paramMonth) {
    monthName = MONTH_NAMES[paramMonth]

    postsForMonth = await getChildFiles('/blog', {
      limit: 0,
      filter: ({ date, title }) => {
        const [year, month] = date.toISOString().substring(0, 7).split('-')

        return year === paramYear && month === paramMonth
      },
    })

    postsForMonth = postsForMonth.map(({ date, title, path }) => {
      return {
        date,
        title,
        path,
      }
    })
  } else {
    const years = await getArchivesYearsAndMonths()
    months = years.find((yearData) => yearData.year === paramYear)?.months
  }

  return {
    year: paramYear,
    month: paramMonth,
    monthName,
    postsForMonth,
    months,
  }
}

import { getChildFiles } from '$lib/data/index'
import { MONTH_NAMES } from '$lib/constants'

export default async function getArchivesYearsAndMonths() {
  const allBlogPosts = await getChildFiles('/blog', { limit: 0 })

  const years = []

  for (const { date } of allBlogPosts) {
    const [year, month] = date.toISOString().substring(0, 7).split('-')

    const existingYear = years.find((yearData) => yearData.year === year)
    if (existingYear) {
      const existingMonth = existingYear.months.find((monthData) => monthData.number === month)
      if (!existingMonth) {
        existingYear.months = [
          {
            name: MONTH_NAMES[month],
            number: month,
            path: `/${year}/${month}`,
          },
          ...existingYear.months,
        ]
      }
    } else {
      years.push({
        year,
        months: [
          {
            name: MONTH_NAMES[month],
            number: month,
            path: `/${year}/${month}`,
          },
        ],
      })
    }
  }

  return years
}

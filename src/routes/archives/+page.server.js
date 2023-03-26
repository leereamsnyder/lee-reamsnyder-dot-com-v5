import getArchivesYearsAndMonths from './getArchivesYearsAndMonths'

/**
 * @type {import('@sveltejs/kit').PageServerLoad}
 */
export async function load({ params }) {
  const years = await getArchivesYearsAndMonths()

  return { years }
}

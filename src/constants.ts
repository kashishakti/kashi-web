export const BASE_URL = 'https://productive-breeze-327fa74162.strapiapp.com/api'

// In dev: cache forever (never re-hit the prod API during a session).
// In prod: revalidate every 10 minutes.
export const REVALIDATE: number | false = process.env.NODE_ENV === 'development' ? false : 600
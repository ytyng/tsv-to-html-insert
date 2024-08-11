import type { Handle } from '@sveltejs/kit'

export const handle = (async ({ event, resolve }) => {
  const lang = event.url.pathname.startsWith('/ja') ? 'ja' : 'en'
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang)
  })
}) satisfies Handle

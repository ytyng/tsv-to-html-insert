import type {LayoutLoad} from './$types'

export const load: LayoutLoad = async ({params}) => {
  return {
    lang: params.lang
  }
}
export const prerender = true;
export const trailingSlash = 'always';

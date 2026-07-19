export function getLinkFromType(type: string, slug: string): string {
  switch (type) {
    case 'Vrat Katha':  return `/vrat-katha/${slug}`
    case 'Temple':      return `/temple/${slug}`
    case 'Festival':    return `/festival/${slug}`
    case 'Puja Vidhi':  return `/puja-vidhi/${slug}`
    case 'Purnima':     return `/purnima/${slug}`
    case 'Pradosh':     return `/pradosh/${slug}`
    case 'Ekadashi':    return `/ekadashi/${slug}`
    case 'Amavasya':    return `/amavasya/${slug}`
    case 'Blog':        return `/blogs/${slug}`
    default:            return '/'
  }
}

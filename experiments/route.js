let routes = {
  // Regular JS regex over cleaned up URL.
  'book/(\\d+)?/edit': (id) => console.log('handleBookEdit', id),
  'book/(\\d+)?/.+': (_id, _) => console.log('noSuchBookOperation'),
  'book/(\\d+)?': (id) => console.log('getBook', id),

  'shop/(\\d+)?/(\\d+)?': (a, b) => console.log('showSecretShopPage', a, b),
  'shop/index': () => console.log('showShoppingPage'),
  'shop/(.+)': (rest) => console.log('nestedMatch', rest),
  'shop': () => console.log('showShoppingPage'),

  '.+': (_) => console.log('showNotFoundPage'),
  '': () => console.log('showMainPage'),
}

matchRoute(routes, 'book/12/edit') // edit book
matchRoute(routes, 'book/10/oops') // invalid operation
matchRoute(routes, 'shop/13/54') // show secret
matchRoute(routes, 'shop/bla/blabla/10') // nested match
matchRoute(routes, 'bla') // 404
matchRoute(routes, '') // main page

function matchRoute(cases, url) {
  for (let regexString in cases) {
    let match = url.match(new RegExp(regexString))
    if (match != null) {
      cases[regexString](...match.slice(1))
      break
    }
  }
}

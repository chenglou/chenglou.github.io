// To run: node route.js
let routes = {
  // Regular JS regex over cleaned up URL.
  'book/(\\d+)/edit': (id) => console.log('edit book', id),
  'book/(\\d+)/.+': (_id, _) => console.log('invalid book operation'),
  'book/(\\d+)': (id) => console.log('show book', id),

  'shop/(\\d+)/(\\d+)': (a, b) => console.log('show secret shop', a, b),
  'shop/index': () => console.log('show shop'),
  'shop/(.+)': (rest) => console.log('get the rest of the url', rest),
  'shop': () => console.log('show shop'),

  '.+': (_) => console.log('show 404'),
  '': () => console.log('show main page'),
}

matchRoute(routes, 'book/12/edit') // edit book
matchRoute(routes, 'book/10/oops') // invalid operation
matchRoute(routes, 'shop/13/54') // show secret
matchRoute(routes, 'shop/bla/blabla/10') // nested match
matchRoute(routes, 'shop') // main shop page
matchRoute(routes, 'bla') // 404
matchRoute(routes, '') // main page

function matchRoute(cases, url) {
  for (let regexString in cases) {
    let match = url.match(new RegExp(regexString))
    if (match != null) {
      cases[regexString](...match.slice(1)) // Example: 'book/13/54' -> f('13', '54')
      break
    }
  }
}

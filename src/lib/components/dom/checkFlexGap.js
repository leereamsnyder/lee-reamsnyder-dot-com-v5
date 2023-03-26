// checks for proper support of gap for display:flex containers
// you can't quite use @supports (gap: 10px) {} because Safari <=14 and others don't support gap on flex containers
// but they DO support gap on grid containers, so that test doesn't work
// this is essentially https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/flexgap.js
// via https://ishadeed.com/article/flexbox-gap/
export default function checkFlexGap() {
  // create flex container with row-gap set
  const flex = document.createElement('div')
  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
  flex.style.rowGap = '1px'

  // create two, elements inside it
  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))

  // append to the DOM (needed to obtain scrollHeight)
  document.body.appendChild(flex)
  const isSupported = flex.scrollHeight === 1 // flex container should be 1px high from the row-gap
  flex.parentNode.removeChild(flex)

  return isSupported
}

export default function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el)
  wrapper.appendChild(el)
}

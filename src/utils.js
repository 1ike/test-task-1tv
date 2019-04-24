import { namespace, active } from './constants';

export const wrapElem = (element, wrapper) => {
  // eslint-disable-next-line no-param-reassign
  wrapper.className = namespace;
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
};

export const setAttributes = (element, attrs) => {
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });
};

export const show = (element) => {
  element.classList.add(active);
};
export const hide = (element) => {
  element.classList.remove(active);
};

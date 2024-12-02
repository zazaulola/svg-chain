/** @format */


/** 
 * Creates a proxy object that wraps the provided DOM element and provides a chainable API for interacting with it. 
 * The proxy handles various types of property access, including attributes, 
 * styles, and methods, and returns the proxy object itself or the result of the operation, 
 * depending on the property being accessed.
*/
const createChainProxy = element => {
  const convertCamelCaseToProps = name =>
    name.replace(/(?<=[a-z0-9])[A-Z](?=[a-z0-9])/g, char => `-${char.toLowerCase()}`);

  const forceReturnProxy = /(?:^(?:add|remove|toggle|set|scroll|replace|attach))|append|prepend|before|after|(?:Child$)|/;
  const forceReturnResult = /(?:^get)|(?:^has)|(?:^check)|(?:querySelector(?:All)?)|(?:^request)/;
  const forceAttr = /d|r|[xy][12]|[crfd][xy]|offset|(?:^area)|(?:^data)|(?:^on\w+)/;
  const backwardMethod = /^(append|prepend|before|after)To$/;

  const proxy = new Proxy(element, {
    get(element, property) {
      if (property === 'self') {
        return element;
      }

      let match;
      if ((match = property.match(backwardMethod))) {
        return value => {
          if (typeof value == 'string') {
            value = document.querySelector(value);
          }
          value[match[1]](element);
          return proxy;
        };
      }

      const attrCb = (value = null) => {
        if (value !== null) {
          element.setProperty(convertCamelCaseToProps(property), value);
          return proxy;
        }
        return element.getAttribute(convertCamelCaseToProps(property));
      };

      const propertyCb = (value = null) => {
        if (value !== null) {
          element[property] = value;
          return proxy;
        }
        return element[property];
      };

      const methodCb = (...attrs) => {
        const result = element[property](...attrs);
        if (forceReturnProxy) return proxy;
        if (forceReturnResult) return result;
        return result ? result : proxy;
      };

      const styleCb = (value = null) => {
        if (value !== null) {
          element.style[property] = value;
          return proxy;
        }
        return element.style[property];
      };

      if (forceAttr.test(property)) {
        return attrCb;
      }
      if (property in element) {
        return typeof element[property] === 'function' ? methodCb : propertyCb;
      }
      if (property in element.style) {
        return styleCb;
      }
      return attrCb;
    },
  });
};


/**
 * Creates a new SVG element and wraps it in a proxy object for chaining method calls.
 * @param {string} element - The name of the SVG element to create.
 * @returns {object} A proxy object that allows chaining method calls on the created SVG element.
 */
export const _ = element => createChainProxy(document.createElementNs('http://www.w3.org/2000/svg', element));

/**
 * Creates a new proxy object that wraps a DOM element selected by the provided CSS selector.
 * The proxy object allows chaining method calls on the selected element.
 * @param {string} selector - The CSS selector to use for selecting the DOM element.
 * @returns {object} A proxy object that allows chaining method calls on the selected DOM element.
 */
export const $ = selector => createChainProxy(document.querySelector(selector));
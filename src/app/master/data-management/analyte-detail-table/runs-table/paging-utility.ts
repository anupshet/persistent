const cache = {};
const testStyle = document.createElement('div').style;
const prefix = (function () {
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/))[1];
  const dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];

  return {
    dom,
    lowercase: pre,
    css: `-${pre}-`,
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

export function getVendorPrefixedName(property: string) {
  const name = camelCase(property);

  if (!cache[name]) {
    if (testStyle[prefix.css + property] !== undefined) {
      cache[name] = prefix.css + property;
    } else if (testStyle[property] !== undefined) {
      cache[name] = property;
    }
  }

  return cache[name];
}

export function camelCase(str: string): string {
  // Replace special characters with a space
  str = str.replace(/[^a-zA-Z0-9 ]/g, ' ');
  // put a space before an uppercase letter
  str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');

  // Lower case first character and some other stuff
  str = str.replace(/([^a-zA-Z0-9 ])|^[0-9]+/g, '').trim().toLowerCase();

  // uppercase characters preceded by a space or number
  str = str.replace(/([ 0-9]+)([a-zA-Z])/g, function (a, b, c) {
    return b.trim() + c.toUpperCase();
  });

  return str;
}

// browser detection and prefixing tools
const transform = getVendorPrefixedName('transform');
const backfaceVisibility = getVendorPrefixedName('backfaceVisibility');
const hasCSSTransforms = !!getVendorPrefixedName('transform');
const hasCSS3DTransforms = !!getVendorPrefixedName('perspective');
const ua = window.navigator.userAgent;
const isSafari = (/Safari\//).test(ua) && !(/Chrome\//).test(ua);
// Get Prefix
// http://davidwalsh.name/vendor-prefix


export function translateXY(styles: any, x: number, y: number) {
  if (hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      styles[transform] = `translate3d(${x}px, ${y}px, 0)`;
      styles[backfaceVisibility] = 'hidden';
    } else {
      styles[camelCase(transform)] = `translate(${x}px, ${y}px)`;
    }
  } else {
    styles.top = `${y}px`;
    styles.left = `${x}px`;
  }
}

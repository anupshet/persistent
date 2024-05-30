import { BrowserPlatform } from '../../contracts/models/shared/browser-platform.model';
import {browsers} from '../config/constants/general.const';

export function getBrowserDetails() {
  const userAgent = navigator.userAgent;
  let tempObj = null;
  let match = userAgent.match(/(chrome|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(match[1])) {
    tempObj = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
    return { name: browsers.IE, version: (tempObj[1] || '') };
  }
  if (match[1] === browsers.Chrome) {
    tempObj = userAgent.match(/\bEdge\/(\d+)/);
    if (tempObj != null) {
      return { name: browsers.Edge, version: tempObj[1] };
    }
  }
  match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tempObj = userAgent.match(/version\/(\d+)/i)) != null) { match.splice(1, 1, tempObj[1]); }

const browserDetailsObj = new BrowserPlatform(match[0], match[1]);
  return browserDetailsObj;
}

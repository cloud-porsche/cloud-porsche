/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-86c9b217'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "assets/_...path_-DR6WsVye.js",
    "revision": null
  }, {
    "url": "assets/_id_-9yaKboVv.css",
    "revision": null
  }, {
    "url": "assets/_id_-b_2o9LjS.css",
    "revision": null
  }, {
    "url": "assets/_id_-B4DkVZQ6.js",
    "revision": null
  }, {
    "url": "assets/_id_-D-XTBLrE.js",
    "revision": null
  }, {
    "url": "assets/index-9WrTN1Ev.js",
    "revision": null
  }, {
    "url": "assets/index-B-zxCRnT.js",
    "revision": null
  }, {
    "url": "assets/index-BfOFdoXM.css",
    "revision": null
  }, {
    "url": "assets/index-BsXROqW_.js",
    "revision": null
  }, {
    "url": "assets/index-DIzVoQOD.css",
    "revision": null
  }, {
    "url": "assets/index-DZVE8zpk.css",
    "revision": null
  }, {
    "url": "assets/index-fUuoYNPw.js",
    "revision": null
  }, {
    "url": "assets/ParkingSpotComponent-Dig-y0S2.js",
    "revision": null
  }, {
    "url": "assets/ParkingSpotComponent-fg3jnu13.css",
    "revision": null
  }, {
    "url": "assets/profile-2i62Ype7.css",
    "revision": null
  }, {
    "url": "assets/profile-BXB22W4G.js",
    "revision": null
  }, {
    "url": "assets/ProTier-BrOU4x1Z.css",
    "revision": null
  }, {
    "url": "assets/ProTier-CE6MILfU.js",
    "revision": null
  }, {
    "url": "assets/settings-Cbn6FGsH.css",
    "revision": null
  }, {
    "url": "assets/settings-sHfA7jgP.js",
    "revision": null
  }, {
    "url": "assets/VChip-D4sclpbQ.js",
    "revision": null
  }, {
    "url": "assets/VChip-DsRJUznz.css",
    "revision": null
  }, {
    "url": "assets/VDataTable-De4YzEB4.js",
    "revision": null
  }, {
    "url": "assets/VDataTable-DXmHtqsb.css",
    "revision": null
  }, {
    "url": "assets/VFileInput-CdScEAjv.css",
    "revision": null
  }, {
    "url": "assets/VFileInput-IXkzaXfL.js",
    "revision": null
  }, {
    "url": "assets/VPagination-C25dc1D4.js",
    "revision": null
  }, {
    "url": "assets/VPagination-osFSi_du.css",
    "revision": null
  }, {
    "url": "assets/VRow-BtE0aTqm.js",
    "revision": null
  }, {
    "url": "assets/VSelect-CgvyrPNl.css",
    "revision": null
  }, {
    "url": "assets/VSelect-CW528sZX.js",
    "revision": null
  }, {
    "url": "assets/VTextarea-BAE0bsJs.css",
    "revision": null
  }, {
    "url": "assets/VTextarea-CRIN8sQx.js",
    "revision": null
  }, {
    "url": "assets/VWindowItem-ByIod57Y.css",
    "revision": null
  }, {
    "url": "assets/VWindowItem-Dm9wXBZT.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-B9K5rw8f.js",
    "revision": null
  }, {
    "url": "index.html",
    "revision": "d75490b75b27c10dfa31bb5e47d659c9"
  }, {
    "url": "favicon.svg",
    "revision": "93434ac9fdc9203e9c79d229226edd0d"
  }, {
    "url": "web-app-manifest-192x192.png",
    "revision": "605c151f2c69472b0b21011475b5bc0f"
  }, {
    "url": "web-app-manifest-512x512.png",
    "revision": "bf948668339975149f87c695397cf8fa"
  }, {
    "url": "manifest.webmanifest",
    "revision": "50fcec94b7d1df97b802b90a04b4d45a"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));

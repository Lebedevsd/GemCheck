/* GemCheck – fetch interceptor (runs in MAIN world, declared in manifest).
 * Hooks window.fetch to capture poe.ninja's own API calls and relay them to
 * the content script via postMessage. This is the fallback for when the
 * content script's direct API requests return empty data. */
(function () {
  if (window.__gc_hooked) return;
  window.__gc_hooked = true;
  var _orig = window.fetch.bind(window);
  window.fetch = function (resource, opts) {
    var url = typeof resource === 'string' ? resource
            : (resource instanceof URL ? resource.href : (resource && resource.url) || '');
    var result = _orig(resource, opts);
    var isGem      = url.indexOf('item/overview') !== -1 && url.indexOf('SkillGem') !== -1;
    var isExchange = url.indexOf('exchange/current/overview') !== -1;
    if (isGem || isExchange) {
      result.then(function (r) { return r.clone().json(); })
            .then(function (d) { window.postMessage({ __gc: 1, url: url, data: d }, '*'); })
            .catch(function () {});
    }
    return result;
  };
})();

/*!
 * Réseau Ohmycad : envoi des demandes de contact vers HubSpot (portail 8764694)
 * Version 1.0 (16/11/2026)
 *
 * Usage : <script src="/js/lead-form.js" defer></script>, puis dans le JS du site :
 *   const ok = await window.omcLead.submit('<guid du formulaire>', { email, firstname, lastname, company, phone, message });
 * Renvoie true si HubSpot a accepté la demande. En cas d'échec, le site garde son repli (mailto).
 *
 * Le formulaire HubSpot notifie le partner par email à chaque demande.
 * Le cookie hubspotutk n'est transmis que s'il existe, c'est-à-dire si le visiteur a accepté les cookies.
 */
(function () {
  'use strict';
  var PORTAL = '8764694';

  function readCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }

  function splitName(full) {
    var parts = (full || '').trim().split(/\s+/);
    if (!parts[0]) return { firstname: '', lastname: '' };
    return { firstname: parts.shift(), lastname: parts.join(' ') };
  }

  function submit(guid, data) {
    var fields = [];
    Object.keys(data || {}).forEach(function (k) {
      var v = (data[k] == null ? '' : String(data[k])).trim();
      if (v) fields.push({ objectTypeId: '0-1', name: k, value: v });
    });
    var context = { pageUri: location.href, pageName: document.title };
    var hutk = readCookie('hubspotutk');
    if (hutk) context.hutk = hutk;
    return fetch('https://api.hsforms.com/submissions/v3/integration/submit/' + PORTAL + '/' + guid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields, context: context })
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  window.omcLead = { submit: submit, splitName: splitName };
})();

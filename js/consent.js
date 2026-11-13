/*!
 * Réseau Ohmycad : bannière de consentement + code HubSpot (Buyer Intent)
 * Version 1.0 (13/11/2026)
 *
 * Usage, juste avant </body> :
 *   <script src="/js/consent.js" data-hubspot="8764694" data-lang="fr" data-privacy="/confidentialite/" defer></script>
 * Lien pour rouvrir le choix (pied de page) :
 *   <a href="#" data-consent-open>Gérer les cookies</a>
 *
 * Règles : rien de HubSpot n'est chargé avant « Accepter ». « Refuser » est au même niveau qu'« Accepter ».
 * Choix gardé 6 mois (cookie first-party omc_consent), puis redemandé. Retrait : revokeCookieConsent HubSpot
 * et suppression des cookies HubSpot du domaine.
 */
(function () {
  'use strict';
  var me = document.currentScript || document.querySelector('script[data-hubspot]');
  var HS_ID = (me && me.getAttribute('data-hubspot')) || '8764694';
  var LANG = ((me && me.getAttribute('data-lang')) || document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  var PRIVACY = (me && me.getAttribute('data-privacy')) || '';
  var COOKIE = 'omc_consent';
  var MAX_AGE = 60 * 60 * 24 * 182; // 6 mois

  var T = {
    fr: { title: 'Cookies', text: "Nous utilisons des cookies de mesure d'audience pour comprendre l'intérêt pour nos offres. Ils ne sont déposés qu'avec votre accord.", accept: 'Accepter', refuse: 'Refuser', more: 'En savoir plus' },
    en: { title: 'Cookies', text: 'We use analytics cookies to understand interest in our offers. They are only set with your consent.', accept: 'Accept', refuse: 'Decline', more: 'Learn more' },
    es: { title: 'Cookies', text: 'Utilizamos cookies analíticas para entender el interés por nuestras ofertas. Solo se instalan con su consentimiento.', accept: 'Aceptar', refuse: 'Rechazar', more: 'Más información' },
    pt: { title: 'Cookies', text: 'Utilizamos cookies analíticos para perceber o interesse nas nossas ofertas. Só são instalados com o seu consentimento.', accept: 'Aceitar', refuse: 'Recusar', more: 'Saber mais' },
    nl: { title: 'Cookies', text: 'Wij gebruiken analytische cookies om de interesse in ons aanbod te begrijpen. Ze worden alleen geplaatst met uw toestemming.', accept: 'Accepteren', refuse: 'Weigeren', more: 'Meer informatie' }
  };
  var t = T[LANG] || T.en;

  function read() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE + '=(yes|no)'));
    return m ? m[1] : null;
  }
  function write(v) {
    document.cookie = COOKIE + '=' + v + '; Max-Age=' + MAX_AGE + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  }

  function loadHubSpot() {
    if (document.getElementById('hs-script-loader')) return;
    var s = document.createElement('script');
    s.id = 'hs-script-loader'; s.async = true; s.defer = true;
    s.src = 'https://js.hs-scripts.com/' + HS_ID + '.js';
    document.body.appendChild(s);
  }
  function revokeHubSpot() {
    (window._hsq = window._hsq || []).push(['revokeCookieConsent']);
    ['__hstc', '__hssc', '__hssrc', 'hubspotutk', 'messagesUtk'].forEach(function (n) {
      var host = location.hostname, parts = host.split('.');
      var domains = ['', host, '.' + host];
      if (parts.length > 1) domains.push('.' + parts.slice(-2).join('.'));
      domains.forEach(function (d) {
        document.cookie = n + '=; Max-Age=0; Path=/' + (d ? '; Domain=' + d : '');
      });
    });
  }

  var css =
    '#omc-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin-left:auto;' +
    'background:#fff;color:#0B0D2A;border:1px solid rgba(11,13,42,.14);border-radius:14px;box-shadow:0 24px 60px -20px rgba(11,13,42,.28);' +
    'padding:18px 20px;font:14px/1.5 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif}' +
    '#omc-consent p{margin:0 0 14px}#omc-consent strong{display:block;margin-bottom:4px;font-size:15px}' +
    '#omc-consent a{color:inherit;text-decoration:underline}' +
    '#omc-consent .omc-row{display:flex;gap:10px;flex-wrap:wrap}' +
    '#omc-consent button{flex:1 1 140px;cursor:pointer;border-radius:10px;padding:10px 16px;font:600 14px/1.2 inherit;' +
    'border:1px solid #2A2D8F;background:#fff;color:#2A2D8F}' +
    '#omc-consent button.omc-yes{background:#2A2D8F;color:#fff}' +
    '#omc-consent button:focus-visible{outline:3px solid #00AEEF;outline-offset:2px}';

  function show() {
    if (document.getElementById('omc-consent')) return;
    if (!document.getElementById('omc-consent-css')) {
      var st = document.createElement('style'); st.id = 'omc-consent-css'; st.textContent = css;
      document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.id = 'omc-consent'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', t.title);
    box.innerHTML = '<p><strong>' + t.title + '</strong>' + t.text +
      (PRIVACY ? ' <a href="' + PRIVACY + '">' + t.more + '</a>' : '') + '</p>' +
      '<div class="omc-row"><button type="button" class="omc-no">' + t.refuse + '</button>' +
      '<button type="button" class="omc-yes">' + t.accept + '</button></div>';
    document.body.appendChild(box);
    box.querySelector('.omc-yes').addEventListener('click', function () { decide('yes'); });
    box.querySelector('.omc-no').addEventListener('click', function () { decide('no'); });
  }
  function hide() { var b = document.getElementById('omc-consent'); if (b) b.remove(); }

  function decide(v) {
    var before = read();
    write(v); hide();
    if (v === 'yes') loadHubSpot();
    else if (before === 'yes') revokeHubSpot();
  }

  function init() {
    var c = read();
    if (c === 'yes') loadHubSpot();
    else if (c === null) show();
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-consent-open]');
      if (a) { e.preventDefault(); show(); }
    });
  }

  window.omcConsent = { open: show, status: read };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

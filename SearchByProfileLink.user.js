// ==UserScript==
// @name         Search By Profile Link
// @namespace    https://stackoverflow.com/users/5299236/kevin-guan
// @author       Kevin
// @description  Enable use the user profile link in SE chat search "when said by" instead of user id
// @include      /https?:\/\/chat\.stackoverflow\.com\/search.*/
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

document.getElementsByClassName('button')[0].addEventListener('click', event => {
    const user = document.getElementById('user');
    if (user.value.indexOf('/users/') > -1) user.value = /users\/(\d+)/.exec(user.value)[1];
});

/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */

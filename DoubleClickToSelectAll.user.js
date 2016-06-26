// ==UserScript==
// @name         Double-click a code block to select all
// @namespace    https://stackoverflow.com/users/5299236/kevin-guan
// @author       Kevin
// @description  Code is based on the "double-click to select all" feature of https://github.com/calraith/gm_scripts/raw/master/se_like_I_like_it.user.js
// @version      1.0
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser.min.js
// @match		 *://*/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
/* jshint esnext: true */

const selectAll = (node) => {
    node.addEventListener('dblclick', () => {
        const range = document.createRange();
        range.selectNodeContents(node);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });
};


for (const node of document.getElementsByTagName('code')) {
    if (node.parentNode.tagName.toLowerCase() !== 'pre') selectAll(node);
}

for (const node of document.getElementsByTagName('pre')) {
    selectAll(node);
}

/* jshint ignore:start */
]]></>).toString();
var c = babel.transform(inline_src);
eval(c.code);
/* jshint ignore:end */

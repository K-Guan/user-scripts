// ==UserScript==
// @name         cv-pls preview
// @namespace    https://stackoverflow.com/users/5299236/kevin-guan
// @author       Kevin
// @description  Preview every `cv-pls` requests in SOCVR; the code is based on stackapps.com/q/6737
// @include      /https?:\/\/chat\.stackoverflow\.com\/rooms\/41570.*/
// @version      2.6
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==


unsafeWindow.sp_load = GM_getValue;
unsafeWindow.sp_save = GM_setValue;

var lastUser;
var target = document.getElementById('chat');

var msgGroupObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.addedNodes.length > 0) {
            processMessageNode(mutation.addedNodes[0]);
        }
    });
});

var newMsgObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        try {
            // the last group is not interesting anymore since there is a new group
            msgGroupObserver.disconnect();
        } catch(e) {}
        // process the new message
        processNewMessage(mutation);
        var messageList = target.getElementsByClassName("messages");
        var lastMessage = messageList[messageList.length - 1];
        msgGroupObserver.observe(lastMessage, observerConfig);
    });
});

function processNewMessage(mutation) {
    try {
        lastUser = mutation.addedNodes[0].getElementsByClassName("username")[0].innerHTML;
        var message = mutation.addedNodes[0].getElementsByClassName("content")[0];
        onMessage(lastUser, message);
    } catch(e) {}
}

function processMessageNode(node) {
    try {
        var message = node.getElementsByClassName("content")[0];
        onMessage(lastUser, message);
    } catch(e) {}
}

function onMessage(user, msg) {
    if(msg.innerHTML.indexOf('stackoverflow.com/questions/tagged/cv-pls') > -1 && /<a href="https?:\/\/stackoverflow\.com\/q(uestions)?\/\d+.*"/.test(msg.innerHTML)) {
        var post = Array.prototype.slice.call(msg.getElementsByTagName("a")).filter(function(link) {
            return /^https?:\/\/stackoverflow\.com\/q(uestions)?\/\d+.*/.test(link.href);
        })[0].href;

        var id = post.split('/')[4];
        var tag = '<div id="cvpls' + id + '" class="onebox ob-post" style="overflow-y:auto; max-height:150px; margin-bottom:2em"></div>';

        if(document.getElementById('cvpls' + id) === null) {
            msg.innerHTML += tag;
        }

        loadPreview(id);
    }
}



function loadPreview(id) {
    // var url = "https://api.stackexchange.com/2.2/questions/" + id + "?site=stackoverflow&filter=!)Q2B(_XXTIbbJYp7Ko8L)eSx";
    var url = "https://api.stackexchange.com/2.2/questions/" + id + "?site=stackoverflow&filter=!)Q2B(_XXTIbbJYp7Ko8L)eSx&key=4JvEOlgm0aIgrcmo2hsbng((";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = showPreview;
    xhr.id = id;
    xhr.send();
}

function showPreview(response) {
    var resp = JSON.parse(this.response);
    if(resp.items.length === 0) {
        var elem = document.getElementById("cvpls" + this.id);
        elem.style.display = "none";
        elem.parentNode.style.opacity = 0.5;
    } else {
        var post = resp.items[0];
        var tags = '<div class="ob-post-tags">';
        post.tags.forEach(function(tag) {
            tags += '<a href="//stackoverflow.com/questions/tagged/' + tag +
            '"> <span class="ob-post-tag" style="background-color: #E0EAF1; ' +
            'color: #3E6D8E; border-color: #3E6D8E; border-style: solid;">' + tag + '</span></a>';
        });
        tags += '</div>';

        document.getElementById("cvpls" + this.id).innerHTML =
            '<div title="This question has a score of ' + post.score +
            '." class="ob-post-votes">' + post.score + '</div><img width="20' +
            '" height="20" class="ob-post-siteicon" src=' +
            '"//cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png' +
            '" title="Stack Overflow"> <div class="ob-post-title"> Q: <a href="' + post.link +
            '" style="color: #4E82C2;">' + post.title + '</a></div><p class="ob-post-body"><img width="32' +
            '" height="32" alt="' + post.owner.display_name +
            '" title="' + post.owner.display_name + '" src="' + post.owner.profile_image +
            '" class="user-gravatar32">' + post.body + '</p>' + tags;
    }
}

// setup the observer configuration
var observerConfig = { attributes: true, childList: true, characterData: true };

window.addEventListener('load', function() {
    var messageList = target.getElementsByClassName("messages");
    var lastMessage = messageList[messageList.length - 1];
    msgGroupObserver.observe(lastMessage, observerConfig);
    newMsgObserver.observe(target, observerConfig);

    var nick = target.getElementsByClassName("username");
    lastUser = nick.length > 0
        ? nick[nick.length - 1].innerHTML
        : "unknown";

        // parse existing messages
        var messageBlocks = target.getElementsByClassName("user-container");
        for(var i = 0, messageBlocksLength = messageBlocks.length; i < messageBlocksLength; i++) {
            var user = messageBlocks[i].getElementsByClassName("username")[0].innerHTML;
            var messages = messageBlocks[i].getElementsByClassName("message");
            for(var j = 0, messagesLength = messages.length; j < messagesLength; j++) {
                var message = messages[j].getElementsByClassName("content")[0];
                onMessage(user, message);
            }
        }
}, false);

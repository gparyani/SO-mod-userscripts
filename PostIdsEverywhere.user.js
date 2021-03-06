// ==UserScript==
// @name         Post Ids Everywhere
// @description  Inserts post IDs everywhere where there's a post or post link
// @homepage     https://github.com/samliew/SO-mod-userscripts
// @author       @samliew
// @version      1.4
//
// @match        https://stackoverflow.com/*
// @match        https://serverfault.com/*
// @match        https://superuser.com/*
// @match        https://askubuntu.com/*
// @match        https://mathoverflow.net/*
//
// @match        https://meta.stackoverflow.com/*
// @match        https://meta.serverfault.com/*
// @match        https://meta.superuser.com/*
// @match        https://meta.askubuntu.com/*
// @match        https://meta.mathoverflow.net/*
// @match        https://meta.stackexchange.com/*
//
// @match        *.stackexchange.com/*
// ==/UserScript==

(function() {
    'use strict';


    // See also https://github.com/samliew/dynamic-width
    $.fn.dynamicWidth = function () {
        var plugin = $.fn.dynamicWidth;
        if (!plugin.fakeEl) plugin.fakeEl = $('<span>').hide().appendTo(document.body);

        function sizeToContent (el) {
            var $el = $(el);
            var cs = getComputedStyle(el);
            plugin.fakeEl.text(el.value || el.innerText || el.placeholder).css('font', $el.css('font'));
            $el.css('width', plugin.fakeEl.width() + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight));
        }

        return this.each(function (i, el) {
            sizeToContent(el);
            $(el).on('change keypress keyup blur', evt => sizeToContent(evt.target));
        });
    };


    function insertPostIds() {

        // Lists
        $('a.answer-hyperlink').each((i,el) => $('<input class="post-id" value="'+el.href.match(/(?<=[/#])(\d+)/g).pop()+'" readonly />').insertAfter(el));
        $('a.question-hyperlink').each((i,el) => $('<input class="post-id" value="'+el.href.match(/(?<=[/#])(\d+)/g).shift()+'" readonly />').insertAfter(el));

        // Q&A
        $('[data-questionid], [data-answerid]').not('.close-question-link').each((i,el) => $('<input class="post-id" value="'+(el.dataset.answerid||el.dataset.questionid)+'" readonly />').prependTo(el));

        // Remove duplicates if necessary
        $('.post-id ~ .post-id').remove();

        $('.post-id').dynamicWidth();
    }


    function doPageLoad() {
        $(document).ajaxComplete(insertPostIds);
        insertPostIds();

        // Select when focused
        $(document).on('click', 'input.post-id', function() { this.select(); });
    }


    function appendStyles() {

        const styles = `
<style>
[class*='link'],
[data-questionid],
[data-answerid],
[data-post-id],
.count-cell + td,
.user-tab-content td,
.user-tab-content h3,
.summary h3,
.top-posts .post-container,
.mod-section table.table td {
    position: relative;
}
.popup[data-questionid],
.popup[data-answerid] {
    position: absolute;
}
.flagged-post-row .answer-link {
    float: none;
}

.post-id {
    position: absolute;
    top: 0;
    right: 0;
    width: 5rem;
    min-width: 36px;
    margin: 0;
    padding: 3px 0;
    font-size: 1rem;
    font-family: monospace;
    font-weight: 600;
    text-align: right;
    color: #222;
    background: rgba(255,255,255,0.8);
    border: none;
    opacity: 0.15;
    z-index: 1;
}
.post-id + a {
    display: inline !important;
}
#question .post-id,
#answers .post-id {
    position: relative;
}
.question:not(#question) > .post-id {
    top: -20px;
}
#question .post-id,
#answers .post-id,
#user-tab-questions .post-id,
#user-tab-answers .post-id,
#user-tab-activity .post-id,
*:hover > .post-id {
    display: inline-block;
    opacity: 1;
}
#sidebar .post-id,
#question-header .post-id {
    display: none;
}
.post-list .revision-comment {
    position: relative;
    display: block;
}
</style>
`;
        $('body').append(styles);
    }


    // On page load
    appendStyles();
    doPageLoad();

})();

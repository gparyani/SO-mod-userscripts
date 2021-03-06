// ==UserScript==
// @name         Hover Expand Navigation Links
// @description  On pagination dots "..." mouseover, adds more page links (max 30 per hover)
// @homepage     https://github.com/samliew/SO-mod-userscripts
// @author       @samliew
// @version      1.4
//
// @include      https://*stackoverflow.com/*
// @include      https://*serverfault.com/*
// @include      https://*superuser.com/*
// @include      https://*askubuntu.com/*
// @include      https://*mathoverflow.net/*
// @include      https://*stackexchange.com/*
// ==/UserScript==

(function() {
    'use strict';


    function doPageload() {

        $('.page-numbers.dots').on('click mouseover', null, function() {

            let prevNum = +(this.previousElementSibling.innerText);
            let nextNum = +(this.nextElementSibling.innerText);
            let removeWhenDone = true;
            if(nextNum - prevNum > 30) {
                nextNum = prevNum + 30;
                removeWhenDone = false;
            }

            for(let i = prevNum + 1; i < nextNum; i++) {
                $(`<a href="?page=${i}" title="go to page ${i}"> <span class="page-numbers">${i}</span> </a>`).insertBefore(this);
            }

            if(removeWhenDone) $(this).remove();
        });
    }


    // On page load
    doPageload();

})();

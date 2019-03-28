(function($) {
  'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function helloImport() {
    document.getElementsByClassName('hello-import')[0].textContent =
      'Hello example import!';
  }

  $(function() {
    document.getElementsByClassName('hello-rollup')[0].textContent =
      'Hello rollup!';
    helloImport();

    var helloBabel = function helloBabel() {
      document.getElementsByClassName('hello-babel')[0].textContent =
        'Hello babel!';
    };

    helloBabel();
    $('.hello-jquery-external').text('Hello jquery external!');
  });
})($);

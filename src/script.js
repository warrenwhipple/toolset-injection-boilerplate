import $ from 'jquery';
import { helloImport } from './exampleImport';

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('hello-rollup')[0].textContent =
    'Hello rollup!';
  helloImport();
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementsByClassName('hello-babel')[0].textContent =
    'Hello babel!';
});

$(function() {
  $('.hello-jquery-external').text('Hello jquery external!');
  $('.hello-bootstrap-external').append(
    'Hello bootstrap external! <div class="spinner-border"></div>'
  );
});

import $ from 'jquery';
import { helloImport } from './exampleImport';

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('hello-webpack')[0].textContent =
    'Hello webpack!';
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

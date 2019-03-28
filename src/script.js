import $ from 'jquery';
import { helloImport } from './exampleImport';

$(function() {
  document.getElementsByClassName('hello-rollup')[0].textContent =
    'Hello rollup!';

  helloImport();

  const helloBabel = () => {
    document.getElementsByClassName('hello-babel')[0].textContent =
      'Hello babel!';
  };
  helloBabel();

  $('.hello-jquery-external').text('Hello jquery external!');
});

import helloMyImport from './myImport'
import $ from 'jquery';

export function helloWebpack() {
  document.getElementsByClassName('hello-webpack')[0].textContent =
    'Hello webpack!';

  helloMyImport();

  const helloBabel = () => {
    document.getElementsByClassName('hello-babel')[0].textContent =
      'Hello babel!';
  };
  helloBabel();

  $('.hello-jquery-external').text('Hello jquery external!');
}

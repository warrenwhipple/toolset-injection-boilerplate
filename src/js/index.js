import helloMyImport from './myImport'
// import $ from 'jquery';

export function helloRollup() {
  document.getElementsByClassName('hello-rollup')[0].textContent =
    'Hello rollup!';

  // helloMyImport();

  // const helloBabel = () => {
  //   document.getElementsByClassName('hello-babel')[0].textContent =
  //     'Hello babel!';
  // };
  // helloBabel();

  // $('.hello-jquery-external').text('Hello jquery external!');
}

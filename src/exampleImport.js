export function helloImport() {
  document.getElementsByClassName('hello-import')[0].textContent =
    'Hello example import!';
}

export function doNotImportMe() {
  console.log('Opps! doNotImportMe did import and execute!');
}

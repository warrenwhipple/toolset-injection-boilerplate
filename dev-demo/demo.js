'use strict'

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('hello-demo-js')[0].textContent =
    'Hello demo js!'
})

$(function() {
  console.log(utils.postFake)
  utils.postFake('.faker', 10)
})

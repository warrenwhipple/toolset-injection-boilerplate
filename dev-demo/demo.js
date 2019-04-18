'use strict'

document.addEventListener('DOMContentLoaded', function() {
  document.getElementsByClassName('hello-demo-js')[0].textContent =
    'Hello demo js!'
})

$(function() {
  utils.postFake('.faker', 10)
})

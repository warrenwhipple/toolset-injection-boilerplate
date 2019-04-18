import faker from 'faker'
import $ from 'jquery'

export function postFake(selector, count = 1) {
  const $selector = $(selector).first()
  for (let i = 0; i < count; i++)
    $selector.append(
      '<div class="grid-item"><img src="' +
        faker.image.abstract() +
        '?=' +
        i +
        '"><h2 class="title">' +
        faker.company.catchPhrase() +
        '</h2><p class="excerpt">' +
        faker.lorem.paragraph() +
        '</p></div>'
    )
}

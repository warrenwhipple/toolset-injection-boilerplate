# WordPress Toolset Injection Boilerplate

Develop an HTML + CSS + JS feature with third party JS dependencies. Bundle everything into a single importable WordPress [Toolset](https://toolset.com/) XML file for easy distribution.

_Deploying to WordPress requires at least an [entry level purchase](https://toolset.com/buy/) of the Toolset plugin._

## Features

- [Gulp](https://gulpjs.com/) for automating development and production
- [Sass](https://sass-lang.com/guide) for styling
- [Webpack](https://webpack.js.org/) for tree shaking and compressing imported JS libraries
- [Babel](https://babeljs.io/) for transpiling modern JavaScript
- [jQuery](https://jquery.com/) and [Bootstrap](https://getbootstrap.com/) as external peer dependencies
- [Browsersync](https://www.browsersync.io/) for quick development iteration
- [Faker](https://github.com/Marak/Faker.js) for dummy posts
- SASS and JS development sourcemaps

## Install

```bash
git clone https://github.com/warrenwhipple/toolset-injection-boilerplate.git

cd toolset-injection-boilerplate

npm i
```

## Develop

```bash
npm run dev
```

## Import

```bash
npm run build
```

Navigate to your `WordPress Dashboard` > `Toolset Export/Import` > `Views` > `Import Views`

Import `dist/toolset-import.xml`

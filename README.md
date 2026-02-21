🚀 VGG Language (Very Good Game)

VGG — это самый легкий и быстрый язык разметки для создания веб-страниц. Забудь про тяжелый HTML, гору скобок и путаницу в тегах.

Разработано под эгидой AAZERONE. Это будущее, где твой код выглядит чисто, а работает мощно.

💎 Почему VGG?

Zero HTML: Тебе не нужно знать HTML, чтобы создавать страницы.

Ultra Light: Синтаксис, который понятен человеку, а не роботу.

Ready for Deployment: Идеально подходит для GitHub Pages и персональных сайтов.

🛠️ Синтаксис

Пример файла main.vgg:

!vgg = start
open:web
  title of page: AAZERONE LEGACY
  font: Dela Gothic One Regular
  fontlink: [https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap](https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap)
close:web

open:label
  text: VGG IS LIVE (close=text) color: white (close=color) font: Dela Gothic One Regular (close=font)
close:label

open:label
  text: Создано на языке VGG. (close=text) color: gray (close=color)
close:label
end


🚀 Как запустить (Для разрабов)

Установи Node.js.

Скачай файл vgg_core.js в папку с твоим проектом.

Создай файл main.vgg.

Запусти локальный сервер:

node vgg_core.js


Открой в браузере: http://localhost:3000

🌐 Деплой на GitHub (Для всех)

Чтобы твой сайт работал на yourname.github.io или на твоем домене:

Создай репозиторий на GitHub.

Положи туда свой файл main.vgg.

Создай путь .github/workflows/deploy.yml и вставь туда:

name: VGG_RENDER
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Compile VGG
        run: |
          curl -s [https://raw.githubusercontent.com/AAZERONE/VGG-Standard/main/vgg_core.js](https://raw.githubusercontent.com/AAZERONE/VGG-Standard/main/vgg_core.js) -o engine.js
          node engine.js compile_all
      - name: Deploy to GH Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist


🎨 Подсветка синтаксиса

Для корректной работы GitHub Linguist добавь файл .gitattributes:

*.vgg linguist-language=VGG


STAY TECH. STAY AAZERONE. 🍌🐵🔥

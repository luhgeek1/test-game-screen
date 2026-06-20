Для решения задачи я использовал тесты. Они помогали мне понимать, насколько мой вариант отличается от эталона, и доводить мою вёрстку до максимального совпадения.

## Как запустить проект

```bash
npm start
```

Затем открыть в браузере: http://localhost:8731/index.html

## Тесты

В `tests/main-screen.spec.ts` — тест на Playwright, который:

1. открывает `index.html` в браузере и ждёт построения сцены;
2. делает скриншот текущего варианта страницы;
3. сравнивает его попиксельно с `reference_screenshot.png` (через `pixelmatch`);
4. сохраняет в `test-results/main-screen/` три файла — `actual.png` (мой вариант), `expected.png` (эталон) и `diff.png` (разница, несовпадающие пиксели подсвечены).

## Как запустить

```bash
npm install
npx playwright install chromium   # один раз, если браузер ещё не скачан
npm test
```

В консоли после прогона будет процент несовпадающих пикселей и пути к трём файлам:

```
pixel diff: <n>/<total> (<percent>%)
actual:   test-results/main-screen/actual.png
expected: test-results/main-screen/expected.png
diff:     test-results/main-screen/diff.png
```

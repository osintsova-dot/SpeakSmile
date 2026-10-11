---
name: gmf1-home-lesson-recipe
description: "Рецепт «Урок дома» для Lesson 1 (Vocabulary) любого юнита GMF1 — по образцу выложенного U2 L1 Toys; что взять, где лежит, что заменить, грабли"
metadata:
  node_type: memory
  type: project
  originSessionId: cfe96385-e618-41fd-872b-64db7752bcd7
  modified: 2026-10-11T10:52:24.001Z
---

# Рецепт: «Урок дома» · GMF1 · Unit N · Lesson 1 (Vocabulary)

Эталон: `speak-smile-site/gmf1/home/u2-l1/` (index.html + audio/ + img/) → speakandsmile.ru/gmf1/home/u2-l1/. Структура Lesson 1 у всех юнитов GMF1 одинаковая: 10 слов → песня юнита → чант со словами → наклейки в PB → AB стр. (раскрась + поезд слов) → Spelling в AB. Поэтому новый юнит = **копия папки u2-l1 → u{N}-l1 и замена данных**, движок не трогать.

## 1. Исходники
- **Pupil's Book стр. Lesson 1** (скрин из Teacher's Digital Pupil's Book на macmillaneducationeverywhere.com): 10 слов в кружках-наклейках, текст песни, номера треков (CD1·NN у «Listen and point. Sing» = песня, у «Listen and say the chant» = чант).
- **Activity Book стр. Lesson 1** (Digital Activity Book там же): №1 «Read, find and colour» (список «a blue ball…»), №2 «Circle and write» (поезд букв = слова подряд без пробелов, два поезда по 3 слова). Spelling-страница — из «Learning to learn» внизу PB.
- **Аудио**: Оксана скачивает в приложении Macmillan «Level 1 Audio» по юниту → iCloud `Downloads/GMF L1 U{N}.zip`. Внутри: `HFNE_PK1_U0{N}_<слово>.mp3` (слова по одному), `HFNE1_PK_CD1_NN.mp3` песня, `HFNE_PK1_CD1_NN_karaoke.mp3` минусовка, `HFNE_PK1_CD1_NN.mp3` чант, остальное — другие уроки юнита (dialog/part — Lesson 2–8). Переложить весь zip в Методбазу (пока лежит только U2).
- **Картинки слов**: сначала из игр курса — `gmf1/games/<тема>-memo.html` → `const ASSETS = {...}` → `items[].img` base64 (210px, плоский вектор; поле `word`). Чего нет — Canva MCP `generate-image` (промпт «flat vector cartoon, thick outlines, teal/orange/yellow, white background, sticker-like», 200px) → убрать белый фон (PIL: r,g,b>242 → alpha 0). Спики: `ASSETS.speaky` из того же memo.
- **План урока** в Хабе `speak-smile-hub/app/plans/GMF1-U{N}-L1.html` — страницы PB/AB, звук фоники (в домашку не кладём), но список слов там может отличаться от 2-го издания учебника — **истина = скрин страницы PB**.

## 2. Сборка (порядок)
1. `cp -r u2-l1 u{N}-l1`; в index.html заменить: `LESSON`, заголовок/`<title>`/sub (Unit N «Название»), «стр. NN» PB, массив `WORDS` (id = имя файла без пробелов, en, ru), `CHANT` (id+секунды), `SONG` (строки+секунды+картинка-слово), задания слайда «В учебнике» (PB №1–2, AB стр. №1 со списком цветов, №2, Spelling стр.), `TRAINS` (letters без пробелов, words = id-шники), `TR_IDS`.
2. Аудио → `audio/<id>.mp3`, `song.mp3`, `karaoke.mp3`, `chant.mp3`; все через `loudnorm=I=-16:TP=-1.5:LRA=11`, 44.1 kHz, 96k. Если какого-то слова нет в zip (в U2 не было `ball`) — Gemini TTS **через VPS** (ssh `~/.ssh/aeza_tools root@109.172.94.35`, python с KEY из `~/.gemini_key` в env; с Мака напрямую 400), голос Kore, STYLE «clear warm British English for young children… say only this word», затем `silenceremove` + loudnorm. Вырезать слово из чанта НЕ пытаться (бит под голосом, whisper путает).
3. Таймкоды: `faster_whisper` small, `word_timestamps=True` по song.mp3 и chant.mp3 → строки песни (старт строки) и моменты слов в чанте; `SONG_END`/`CHANT_END` = конец последнего слова +2–3 с. Караоке-минусовка считается с теми же таймами.
4. Картинки → `img/<id>.png` (+ `speaky.png`).
5. Проверка: локально `python3 -m http.server 8765`, headless Chrome `--window-size=500,900` (минимум 500 px — не баг вёрстки); для слайда N — probe-копия с `deck.scrollLeft=N*deck.clientWidth` и вызовом нужной функции (`memoStart()`, `tPick('X')`, `kStart()`, `sStart()`, `trCheck(...)`); `node -e new Function(script)` на синтаксис.
6. Деплой: в репо сайта `git add gmf1/home/` (НЕ -A), commit, push main; ссылка с `?v=N`, кэш GH Pages ~10 мин.
7. Воркер: ничего менять не надо — `/home-done?l=gmf1-u{N}-l1&n=&s=&m=&f=&d=` принимает любой урок; итоги `do=homedonelist`.

## 3. Что в колоде (12 слайдов, 10 шагов)
обложка → 1 слова (все 10 прослушать) → 2 послушай и найди (≥8/10) → 3 чант с подсветкой → 4 песня караоке + минусовка + темп → 5 знаю/не знаю (как chinese/cards, ≥8 с первого раза) → 6 мемо слово↔картинка (рубашки: картинка жёлтая 🎁, слово сине-бирюзовая «Aa»; звук на каждое открытие) → 7 крестики-нолики «Я vs Спики» (выбор X/O, фигурки с глазами из toys-ttt) → 8 сложи слово из букв → 9 поезд слов (AB №2, палец по буквам) → 10 в учебнике (чекбоксы, ≥4 из 5) → финиш «Я сделал» (имя → пинг Наталье 116 + Оксане 115).

## 4. Грабли
- `[hidden]{display:none!important}` обязателен при `.btn{display:inline-flex}`.
- iOS: Audio играет только после касания; на первое касание страницы — muted play→pause всех элементов (`unlock()`); на карточке «знаю/не знаю» кнопка «Послушать» и спереди.
- Гейта пока нет (только noindex). Когда уроков станет несколько — гейт по коду семьи как `chinese/gate.js` + `lessons.json` с датами.
- Длинные слова (computer game) в мемо: `word-break:keep-all`, перенос только по пробелу.
- Следующий шаг после 2–3 уроков руками — генератор: `lessons/u{N}-l1.json` → index.html (данные уже вынесены в константы в начале `<script>`).

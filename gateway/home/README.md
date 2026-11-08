# «Урок дома» · Gateway to the World B2

Самостоятельные уроки для пропустивших (телефон, 30–40 минут), 14–16 лет. Движок — копия GIA2 (`home-lesson-tools/gateway/common.py`), тема `home-lesson-tools/gw_theme.css` (тёмный индиго + коралл, Rubik), `/home-done`, `const LESSON='gw-…'` (вводные `gw-st-l1…l3`, юниты `gw-u1-l1…`). Сетка — КТП `Методбаза/курсы/GatewayB2/КТП-GatewayB2-НОВАЯ-2026-08-23.txt`: 3 вводных + юниты U1–U5 по 7 уроков (L1 Vocabulary, L2 Reading, L3 Grammar 1 + Vocabulary, L4 Listening + Grammar 2, L5 Speaking + Writing, L6 повторение, L7 тест = `uN-test`). Student’s Book и Workbook pdf: страница pdf = страница книги (сканы, текста нет). Ответы — TB (стр. 12–23 для U1), SB/WB answer keys, Test answer key.

**Медиа — оригинал Macmillan** (`GatewayB2/media-macmillan/`): SB треки 1–4, WB треки 1–6 нарезаны по словам/постам/репликам (whisper `ws.py` → `home-lesson-tools/gateway/ws/all.txt`, выравнивание + silencedetect, проверка `gateway/verify.py`); Flipped classroom video U1 (present perfect) — `u1-l3/video.mp4` (h264 960×540, faststart, 7 МБ, постер `img/flip_poster.jpg`); тест — `B2_U1_Test.mp3` целиком. Edge TTS — только чего нет в записях: вводные уроки целиком, Higher education + Culture exchange, примеры грамматики, вопросы для говорения. Тренажёры курса (`gateway/lex/u1*.html`) не дублируются — ссылки на слайде «В учебнике и тетради».

Сборка: `~/Проекты с Claude/home-lesson-tools/gateway/` — `st_l1…st_l3.py`, `u1_l1…u1_l6.py`, `u1_test.py`, `build.py [модули] --tts --cut`, `verify.py`, `index_gen.py` (главная: перестраивает только плашки `st` и `u1`). Проверка: `COURSE=gateway node chinese-course/tools/gia_check.mjs <port> <страницы> --shots`.

- **st-l1** Welcome back: How was your summer? (4 монолога), вопросы для знакомства, ответы с деталями, B2/ЕГЭ, цели, класс-контракт, карта 10 юнитов, About me.
- **st-l2** B1 vocabulary: word maps (5 тем), определения, collocations, рассказ, словообразование, квиз, правописание.
- **st-l3** B1 grammar: времена + объяснение, conditionals, passive, reported speech, auction, Find someone who, срез 12 (s/m в /home-done = результат среза).
- **u1-l1** (SB 6, WB 4): School life (трек 1), case study Эммы, Culture exchange, Higher education, Use it, WB 1–4. Тренажёры u1voc1, u1voc.
- **u1-l2** (SB 7, WB 5): форум (трек 2, по постам), клубы, Which person (цитаты), слова, Critical thinkers, WB-статья (WB трек 1). Тренажёр u1read.
- **u1-l3** (SB 8–9, WB 6–7): видео Grammar with Dave + 7 вопросов, present tenses, Kigu, present perfect, for/since…, 12 исправлений, do/make, блог, WB. Тренажёры u1gram, u1voc2.
- **u1-l4** (SB 12–13, WB 7–8): интервью Poppy & Harry (трек 3, части + 9 кусков-доказательств), gerunds/infinitives, Language focus, New kid at school, подкаст Gaokao (WB трек 2), WB 8. Тренажёр u1gram.
- **u1-l5** (SB 14–15, WB 9–10): пять учеников (трек 4), Speaking bank, формы, Practice makes perfect (ответ вслух + отметка), диалоги WB (треки 3, 5, 6), письмо Фрейи, Writing bank, WB 10, свой ответ по полям. Тренажёр u1speak.
- **u1-l6** (SB 16–17): Grammar reference, Test yourself (40 баллов, ключ TB), слова на слух (звук из u1-l1), правописание, типичные ошибки, все тренажёры.
- **u1-test** Unit 1 Test Standard: Vocabulary 20 · Grammar 25 · Use of English 8 · Listening 12 · Reading 15 · Writing 10 = 90 онлайн; Speaking 10 — на уроке. Reading 13 и Writing — заполненные поля засчитываются, текст смотрит учитель. `/home-done?l=gw-u1-test&s=…&m=90&f=<по заданиям>`.
- Unit 2–3 — отдельная сборка (плашки `id="u2"` / `id="u3"`, маркеры `<!--U2-ITEMS-->`, `<!--U3-ITEMS-->`).

## Unit 4 + Unit 5 L1–L2 (декабрь 2026)

Сборка: `~/Проекты с Claude/home-lesson-tools/gateway/u45/` — копия движка u23 (`common.py` собирается `src/patch_common.py` из u23 + `src/common_tail.py`; тема `gw_theme.css`) + игры на запоминание **memo** (пары слово ↔ значение) и **ttt** (крестики-нолики против компьютера; движок из `prepare/extra_p5_dec.py`), `note()` — короткое объяснение нового материала с 1–2 примерами из книги со звуком. `python3 build.py <урок…> [--media]`, проверка нарезки `venv/bin/python vcheck.py u4_l1 …`, плашки — `python3 index_cards.py` (блоки `id="u4"`, `id="u5"`, маркеры `<!--U4-ITEMS-->`, `<!--U5-ITEMS-->`).
Тексты книги не набирались вручную: OCR страниц (macOS Vision, `src/ocr`) через `bt.py` → `src/ocr_*.txt`, тексты с пропусками — `texts_u4.py`, `texts_u5.py` (якоря + ответы по ключам); аудиоскрипты — из TB (`scripts_as.py`), тест — из `B2_U4_Test_Standard.docx`.
Медиа (Resource Centre, 08.11): SB треки 15–26, WB 15–22, Flipped classroom video U4 → `Методбаза/курсы/GatewayB2/media-macmillan/`; тест U4 — из `тесты/progress Tests`.

- **u4-l1** (SB 44, WB 30): Personality adjectives 1–3 (треки 15–17), Big Five OCEAN, similar/opposite, идиомы (трек 18), Memory, WB 1–4 (What makes a good pilot?).
- **u4-l2** (SB 45, WB 31): Lucy’s reflections (трек 19, по абзацам), multiple choice, подчёркнутые слова, Tanya’s blog (WB трек 15), Fact/Opinion, Memory.
- **u4-l3** (SB 46–47, WB 32–33): Flipped video (comparatives), правила, ошибки, Happiness is a pencil!, as … as / the … the …, noun suffixes, Do nothing!, ttt, WB 32 + WB 33 ex. 1–2.
- **u4-l4** (SB 50–51, WB 33–34): подкаст о Леонардо (трек 20 + реплики), articles, Isaac Newton, ability, Belzoni, WB listening (трек 16), WB 34, ttt.
- **u4-l5** (SB 52–53, WB 35–36): presentation (трек 21), Speaking bank, Amal Clooney (WB трек 17), pronunciation (WB трек 18), статья о Klopp, Writing bank, Greta Thunberg, ttt, план.
- **u4-l6** (SB 54–55): Grammar reference и Vocabulary (страницы книги), Test yourself 40, правописание, ошибки, самооценка, тренажёры.
- **u4-test** Unit 4 Test Standard: Listening 12 · Vocabulary 20 · Grammar 25 · Use of English 8 · Reading 15 · Writing 10 = 90 онлайн; Speaking 10 — голосом (speak_rec). `/home-done?l=gw-u4-test…`.
- **u5-l1** (SB 58, WB 40): Spending and saving money 1–2 (треки 22–23), US teens and money, идиомы, Memory, WB 1–5.
- **u5-l2** (SB 59, WB 41): Without a penny in their pockets + Unusual tax facts (трек 24), вопросы, слова, The richest kids around (WB трек 19), Memory.

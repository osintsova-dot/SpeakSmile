# -*- coding: utf-8 -*-
"""Каркас посадочных страниц Speak & Smile: head, микроразметка, шапка, форма, подвал."""
import json

SITE  = "https://speakandsmile.ru"
PHONE = "+7 995 124-21-12"
TEL   = "+79951242112"
ADDR  = "ул. Богдана Хмельницкого, 19, офис 26"
CITY  = "Норильск"

NAV = [
    ("/kursy-angliyskogo-norilsk/", "Курсы"),
    ("/angliyskiy-doshkolniki/",    "Дошкольники"),
    ("/angliyskiy-dlya-detey/",     "Дети"),
    ("/angliyskiy-podrostki/",      "Подростки"),
    ("/oge-angliyskiy/",            "ОГЭ"),
    ("/ege-angliyskiy/",            "ЕГЭ"),
]

ORG = {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": SITE + "/#org",
    "name": "Speak & Smile",
    "alternateName": "Школа современного английского Speak & Smile",
    "description": ("Школа английского языка в Норильске с 2013 года. Дети от 3,5 лет, "
                    "подростки, подготовка к ОГЭ и ЕГЭ. Методика Cooperative Learning."),
    "url": SITE + "/",
    "logo": SITE + "/assets/web/logo.png",
    "image": SITE + "/assets/web/bg_splash.jpg",
    "telephone": TEL,
    "foundingDate": "2013",
    "priceRange": "₽₽",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": ADDR,
        "addressLocality": CITY,
        "addressRegion": "Красноярский край",
        "addressCountry": "RU",
    },
    "areaServed": {"@type": "City", "name": CITY},
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "bestRating": "5",
        "reviewCount": "44",
    },
    "sameAs": [
        "https://vk.ru/speaksmile2013",
        "https://2gis.ru/norilsk/geo/70000001077240935",
        "https://t.me/SPeakSmilebot",
    ],
    "hasMap": "https://2gis.ru/norilsk/geo/70000001077240935",
}


def jsonld(page):
    """@graph: организация + хлебные крошки + описание страницы + FAQ."""
    url = SITE + page["path"]
    graph = [ORG]

    graph.append({
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Главная", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": page["crumb"], "item": url},
        ],
    })

    graph.append({
        "@type": "WebPage",
        "@id": url + "#page",
        "url": url,
        "name": page["title"],
        "description": page["desc"],
        "inLanguage": "ru-RU",
        "isPartOf": {"@type": "WebSite", "name": "Speak & Smile", "url": SITE + "/"},
        "about": {"@id": SITE + "/#org"},
        "primaryImageOfPage": SITE + "/assets/web/" + page["hero"],
    })

    if page.get("course"):
        c = page["course"]
        graph.append({
            "@type": "Course",
            "name": c["name"],
            "description": c["desc"],
            "inLanguage": "ru-RU",
            "teaches": "Английский язык",
            "provider": {"@id": SITE + "/#org"},
            "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "onsite",
                "courseWorkload": c["workload"],
                "location": {
                    "@type": "Place",
                    "name": "Speak & Smile",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": ADDR,
                        "addressLocality": CITY,
                        "addressCountry": "RU",
                    },
                },
            },
        })

    if page.get("faq"):
        graph.append({
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in page["faq"]
            ],
        })

    return json.dumps({"@context": "https://schema.org", "@graph": graph},
                      ensure_ascii=False, indent=1)


def faq_html(faq):
    if not faq:
        return ""
        
    items = "\n".join(
        '  <details>\n    <summary>{}</summary>\n    <p>{}</p>\n  </details>'.format(q, a)
        for q, a in faq
    )
    return '\n<h2>Частые вопросы</h2>\n' + items + '\n'


def also_html(links):
    if not links:
        return ""
    cards = "\n".join(
        '    <a href="{}">{}<span>{}</span></a>'.format(href, t, s)
        for href, t, s in links
    )
    return ('\n<h2>Другие программы</h2>\n<div class="also">\n' + cards + '\n</div>\n')


def lead_html(path):
    return '''
<section class="lead" id="zapis">
  <h2>Запишитесь на бесплатную диагностику</h2>
  <p>Посмотрим уровень ребёнка, поговорим о том, что не получается,
     и подберём группу по возрасту и расписанию. Без обязательств.</p>
  <form class="leadform" id="leadform" data-page="{path}" novalidate>
    <div>
      <label for="f-name">Ваше имя</label>
      <input id="f-name" type="text" placeholder="Мария" autocomplete="name">
    </div>
    <div>
      <label for="f-phone">Телефон</label>
      <input id="f-phone" type="tel" placeholder="+7 (___) ___-__-__" autocomplete="tel" inputmode="tel">
    </div>
    <div>
      <label for="f-age">Возраст ребёнка</label>
      <select id="f-age">
        <option>3–6 лет (дошкольник)</option>
        <option>7–10 лет (1–4 класс)</option>
        <option>11–13 лет (5–7 класс)</option>
        <option>14–18 лет (ОГЭ / ЕГЭ)</option>
        <option>Взрослый</option>
      </select>
    </div>
    <button type="submit" class="btn" id="f-btn">Перезвоните мне</button>
    <p class="leadmsg" id="f-msg" hidden></p>
    <p class="consent">Нажимая «Перезвоните мне», вы соглашаетесь с
      <a href="/privacy.html" target="_blank" rel="noopener">Политикой обработки персональных данных</a>
      и <a href="/oferta.html" target="_blank" rel="noopener">офертой</a>.</p>
  </form>
  <div class="alt">
    <a class="ghost" href="tel:{tel}">{phone}</a>
    <a class="ghost" href="https://t.me/SPeakSmilebot" target="_blank" rel="noopener">Написать в Telegram</a>
  </div>
</section>
'''.format(path=path, tel=TEL, phone=PHONE)


def render(page):
    url = SITE + page["path"]
    nav = "\n".join(
        '      <a href="{}"{}>{}</a>'.format(
            h, ' aria-current="page"' if h == page["path"] else "", t)
        for h, t in NAV
    )
    return '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="geo.region" content="RU-KYA">
<meta name="geo.placename" content="Норильск">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Speak &amp; Smile">
<meta property="og:locale" content="ru_RU">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{site}/assets/web/{hero}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/web/logo_sm.png">
<link rel="apple-touch-icon" href="/assets/web/logo_sm.png">
<link rel="stylesheet" href="/assets/seo.css">
<script type="application/ld+json">
{ld}
</script>
<!-- METRIKA -->
</head>
<body>

<header class="top">
  <div class="wrap">
    <a class="brand" href="/"><img src="/assets/web/logo_sm.png" alt="Speak &amp; Smile" width="26" height="26">Speak&nbsp;&amp;&nbsp;Smile</a>
    <nav>
{nav}
      <a class="tel" href="tel:{tel}">{phone}</a>
    </nav>
  </div>
</header>

<div class="hero">
  <img class="bgimg" src="/assets/web/{hero}" alt="{heroalt}" loading="eager" fetchpriority="high">
  <div class="wrap">
    <p class="crumbs"><a href="/">Speak &amp; Smile</a> · {crumb}</p>
    <h1>{h1}</h1>
    <p class="hsub">{sub}</p>
    <div class="badges">{badges}</div>
  </div>
</div>

<main class="wrap">
{body}
{faq}
{also}
{form}
</main>

<footer>
  <div class="wrap">
    <div class="fgrid">
      <div>
        <b>Speak &amp; Smile</b>
        Школа современного английского<br>в Норильске, с 2013 года
      </div>
      <div>
        <b>Адрес</b>
        {addr}<br>{city}
      </div>
      <div>
        <b>Связаться</b>
        <a href="tel:{tel}">{phone}</a><br>
        <a href="https://vk.ru/speaksmile2013" target="_blank" rel="noopener">ВКонтакте</a> ·
        <a href="https://t.me/SPeakSmilebot" target="_blank" rel="noopener">Telegram</a>
      </div>
      <div>
        <b>Программы</b>
        <a href="/angliyskiy-doshkolniki/">Дошкольники</a><br>
        <a href="/angliyskiy-dlya-detey/">Дети 7–10 лет</a><br>
        <a href="/angliyskiy-podrostki/">Подростки</a><br>
        <a href="/oge-angliyskiy/">ОГЭ</a> · <a href="/ege-angliyskiy/">ЕГЭ</a>
      </div>
    </div>
    <div class="cp">
      © 2013–2026 Speak&amp;Smile · Школа Современного Английского ·
      <a href="/oferta.html">Оферта</a> ·
      <a href="/privacy.html">Политика обработки персональных данных</a>
    </div>
  </div>
</footer>

<script src="/assets/seo.js" defer></script>
</body>
</html>
'''.format(
        title=page["title"], desc=page["desc"], url=url, site=SITE,
        hero=page["hero"], heroalt=page["heroalt"], ld=jsonld(page),
        nav=nav, tel=TEL, phone=PHONE, crumb=page["crumb"], h1=page["h1"],
        sub=page["sub"],
        badges="".join("<span>{}</span>".format(b) for b in page["badges"]),
        body=page["body"].strip(),
        faq=faq_html(page.get("faq")),
        also=also_html(page.get("also")),
        form=lead_html(page["path"]),
        addr=ADDR, city=CITY,
    )

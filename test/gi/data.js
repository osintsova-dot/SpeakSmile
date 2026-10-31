/* Get Involved! diagnostic tests (Macmillan, Teacher's Resource Centre) — interactive version.
   Keys = Teacher's Notes. Only auto-checkable sections (Vocabulary, Grammar, Reading, Listening).
   types: box (slots + word box, each word once) · pick (inline:true → in-text toggles; else option list)
          type (typed answer, a = accepted variants) · multi (tick N) · tf (True/False[/NI]) */
window.GI_TESTS = {
  a1: {
    key: 'A1+', title: 'Get Involved! A1+', pass: 0.7,
    sections: [
      { id: 'voc', ru: 'лексика', en: 'Vocabulary', ex: [
        { n: 1, type: 'box', tag: 'personal objects', ru: 'Зачем нужны эти вещи? Нажми на пропуск, потом на слово.',
          en: 'Match the things in the box with why you use them.',
          box: ['books', 'chair', 'keys', 'mobile phone', 'money'],
          items: [
            { q: 'To call my friends. ___', a: 'mobile phone' },
            { q: 'To open doors. ___', a: 'keys' },
            { q: 'To read a story. ___', a: 'books' },
            { q: 'To sit on. ___', a: 'chair' },
            { q: 'To buy my lunch. ___', a: 'money' } ] },
        { n: 2, type: 'type', tag: 'days of the week; numbers', ru: 'Впиши пропущенное слово.',
          en: 'Write the missing words.',
          items: [
            { q: 'Monday, Tuesday, ___', a: ['wednesday'] },
            { q: 'Thursday, ___ , Saturday', a: ['friday'] },
            { q: 'seven, ___ , nine', a: ['eight', '8'] },
            { q: '___ , twelve, thirteen', a: ['eleven', '11'] },
            { q: 'twenty, thirty, ___', a: ['forty', '40'] } ] },
        { n: 3, type: 'type', tag: 'countries; nationalities', ru: 'Впиши страну или национальность.',
          en: 'Complete the sentences with names of countries or nationalities.',
          items: [
            { q: 'She’s from Mexico. She’s ___ .', a: ['mexican'] },
            { q: 'I’m Chinese. I’m from ___ .', a: ['china'] },
            { q: 'They’re from Spain. They’re ___ .', a: ['spanish'] },
            { q: 'We’re Turkish. We’re from ___ .', a: ['turkey', 'türkiye', 'turkiye'] },
            { q: 'She’s from Japan. She’s ___ .', a: ['japanese'] } ] },
        { n: 4, type: 'box', tag: 'family', ru: 'Заполни таблицу словами из рамки.',
          en: 'Complete the table with the words in the box.',
          box: ['brother', 'daughter', 'father', 'sister', 'uncle'],
          table: { head: ['Female', 'Male'], rows: [['mother', 0], ['aunt', 1], [2, 'son'], [3, 4]] },
          items: [ { a: 'father' }, { a: 'uncle' }, { a: 'daughter' }, { a: 'sister' }, { a: 'brother' } ] }
      ] },
      { id: 'gr', ru: 'грамматика', en: 'Grammar', ex: [
        { n: 5, type: 'pick', inline: true, tag: 'this, that, these, those', ru: 'Выбери правильный вариант.',
          en: 'Choose the correct option.',
          items: [
            { q: '[[]] are your shoes.', o: ['Those', 'That'], a: 'Those' },
            { q: '[[]] is your book.', o: ['These', 'This'], a: 'This' },
            { q: '[[]] is our homework.', o: ['Those', 'That'], a: 'That' },
            { q: '[[]] are my friends. They’re here with us today.', o: ['These', 'Those'], a: 'These' },
            { q: '[[]] is my sister. She’s over there in the next class.', o: ['This', 'That'], a: 'That' } ] },
        { n: 6, type: 'type', tag: 'be, present simple', ru: 'Впиши правильную форму глагола be. (not) — отрицание.',
          en: 'Complete the sentences with the correct form of be.',
          items: [
            { q: 'I ___ from Brazil.', a: ['am', '\'m'] },
            { q: 'My name ___ Leon.', a: ['is', '\'s'] },
            { q: 'We ___ from India.', a: ['are', '\'re'] },
            { q: 'They ___ Mexican. (not)', a: ['are not', 'aren\'t', '\'re not'] },
            { q: 'Tania ___ here today. (not)', a: ['is not', 'isn\'t', '\'s not'] } ] },
        { n: 7, type: 'type', tag: 'have got', ru: 'Одно слово в каждый пропуск.',
          en: 'Complete the dialogue with one word in each gap.',
          tpl: '<p><b>Jani</b> Have you [[0]] any brothers or sisters?</p><p><b>Leon</b> No, I [[1]] . But I [[2]] got lots of cousins. How about you?</p><p><b>Jani</b> I’ve [[3]] one sister. She’s always busy, and she [[4]] got time for me!</p>',
          items: [ { a: ['got'] }, { a: ['haven\'t', 'have not'] }, { a: ['have', '\'ve'] }, { a: ['got'] }, { a: ['hasn\'t', 'has not'] } ] },
        { n: 8, type: 'pick', inline: true, tag: 'some, any, a lot of', ru: 'Выбери правильный вариант.',
          en: 'Choose the correct option.',
          tpl: '<p>Here’s my lunch box for school today. I’ve got <sup>1</sup>[[0]] bread and <sup>2</sup>[[1]] cheese. I haven’t got <sup>3</sup>[[2]] milk or juice, but I’ve got <sup>4</sup>[[3]] tomatoes and <sup>5</sup>[[4]] bananas.</p>',
          items: [
            { o: ['some', 'a'], a: 'some' }, { o: ['any', 'some'], a: 'some' }, { o: ['some', 'any'], a: 'any' },
            { o: ['a lot of', 'any'], a: 'a lot of' }, { o: ['two', 'any'], a: 'two' } ] }
      ] },
      { id: 'rd', ru: 'чтение', en: 'Reading', ex: [
        { n: 9, type: 'tf', text: 'a1', tag: 'main idea / detail', ru: 'Прочитай объявления. Верно или неверно?',
          en: 'Read the advertisements. Are the sentences T (true) or F (false)?',
          items: [
            { q: 'The advertisements are for places to live.', a: 'F' },
            { q: 'Both advertisements describe their school.', a: 'F' },
            { q: 'Both advertisements mention interesting things to do.', a: 'T' },
            { q: 'The advertisement says that Manchester is a good place for swimming.', a: 'F' },
            { q: 'The beach at Cagnes-sur-Mer isn’t quiet in the summer.', a: 'T' } ] },
        { n: 10, type: 'pick', text: 'a1', tag: 'specific information', ru: 'В каком объявлении это упоминается?',
          en: 'Which advertisement mentions … ? Write M (Manchester) or C (Cagnes-sur-Mer).', row: true,
          items: [
            { q: 'Transport', o: ['M', 'C'], a: 'M' },
            { q: 'Food', o: ['M', 'C'], a: 'C' },
            { q: 'Sport', o: ['M', 'C'], a: 'M' },
            { q: 'New buildings', o: ['M', 'C'], a: 'C' },
            { q: 'Restaurants', o: ['M', 'C'], a: 'C' } ],
          labels: { M: 'M · Manchester', C: 'C · Cagnes' } }
      ] },
      { id: 'ls', ru: 'аудирование', en: 'Listening', ex: [
        { n: 11, type: 'multi', audio: 'a1_t1', max: 5, tag: 'detail', ru: 'Послушай разговор друзей. Отметь 5 вещей в сумке Руни.',
          en: 'Listen to a conversation between two friends. Tick five things in Runi’s bag.',
          opts: ['books', 'chocolate', 'clock', 'computer', 'keys', 'mobile phone', 'money', 'notebooks', 'pencil case', 'poster'],
          a: ['books', 'keys', 'mobile phone', 'notebooks', 'pencil case'] },
        { n: 12, type: 'pick', audio: 'a1_t2', tag: 'main idea / detail / inference', ru: 'Послушай разговор. Выбери правильный ответ.',
          en: 'Listen to the conversation. Choose the correct answer.',
          items: [
            { q: 'The two people are in a ___ .', o: ['shop', 'restaurant'], a: 'shop' },
            { q: 'The woman wants ___ bananas.', o: ['three', 'four'], a: 'four' },
            { q: 'The woman wants a small piece of ___ .', o: ['cheese', 'fish'], a: 'cheese' },
            { q: 'The woman wants ___ tea bags.', o: ['25', '50'], a: '50' },
            { q: 'The cost of the shopping is ___ .', o: ['£8.20', '£18.12'], a: '£8.20' } ] }
      ] }
    ]
  },

  a2: {
    key: 'A2', title: 'Get Involved! A2', pass: 0.7,
    sections: [
      { id: 'voc', ru: 'лексика', en: 'Vocabulary', ex: [
        { n: 1, type: 'box', tag: 'adjectives (places)', ru: 'Подбери противоположное по смыслу.',
          en: 'Match adjectives 1–5 with their opposites a–e.',
          box: ['dirty', 'ugly', 'noisy', 'safe', 'interesting'],
          items: [
            { q: 'quiet ↔ ___', a: 'noisy' }, { q: 'boring ↔ ___', a: 'interesting' }, { q: 'beautiful ↔ ___', a: 'ugly' },
            { q: 'clean ↔ ___', a: 'dirty' }, { q: 'dangerous ↔ ___', a: 'safe' } ] },
        { n: 2, type: 'box', tag: 'family members', ru: 'Заполни таблицу словами из рамки.',
          en: 'Complete the table with the words in the box.',
          box: ['aunt', 'granddaughter', 'grandfather', 'nephew', 'niece'],
          table: { head: ['Male', 'Female'], rows: [['grandson', 0], ['uncle', 1], [2, 'grandmother'], [3, 4]] },
          items: [ { a: 'granddaughter' }, { a: 'aunt' }, { a: 'grandfather' }, { a: 'nephew' }, { a: 'niece' } ] },
        { n: 3, type: 'box', tag: 'daily routine', ru: 'Дополни текст словами из рамки.',
          en: 'Complete the text with the words in the box.',
          box: ['breakfast', 'homework', 'play', 'start', 'up'],
          tpl: '<p>I get <sup>1</sup>[[0]] at 7:00 am and have a shower. I always have <sup>2</sup>[[1]] because I get very hungry! I <sup>3</sup>[[2]] school at 8:30 am. After school, I sometimes do <sup>4</sup>[[3]] or I relax and <sup>5</sup>[[4]] video games.</p>',
          items: [ { a: 'up' }, { a: 'breakfast' }, { a: 'start' }, { a: 'homework' }, { a: 'play' } ] },
        { n: 4, type: 'type', tag: 'months; ordinals', ru: 'Впиши пропущенное слово.',
          en: 'Write the missing words.',
          items: [
            { q: '___ , March, April', a: ['february'] },
            { q: 'July, ___ , September', a: ['august'] },
            { q: 'November, December, ___', a: ['january'] },
            { q: 'the first of May, the second of May, the ___ of May', a: ['third', '3rd'] },
            { q: 'the seventh of October, the eighth of October, the ___ of October', a: ['ninth', '9th'] } ] },
        { n: 5, type: 'pick', inline: true, tag: 'transport', ru: 'Выбери правильный вариант.',
          en: 'Choose the correct option.',
          items: [
            { q: 'take a [[]]', o: ['lorry', 'taxi'], a: 'taxi' },
            { q: 'get on a [[]]', o: ['bus', 'car'], a: 'bus' },
            { q: 'go on [[]]', o: ['foot', 'journey'], a: 'foot' },
            { q: 'ride a [[]]', o: ['bike', 'plane'], a: 'bike' },
            { q: 'go on a [[]]', o: ['passenger', 'tour'], a: 'tour' } ] }
      ] },
      { id: 'gr', ru: 'грамматика', en: 'Grammar', ex: [
        { n: 6, type: 'box', tag: 'present simple', ru: 'Дополни диалоги словами из рамки.',
          en: 'Complete the dialogues with the words in the box.',
          box: ['are', 'do', 'doesn’t', 'is', 'it’s'],
          items: [
            { q: 'A: What ___ your best friend’s name?<br>B: Her name is Teresa.', a: 'is' },
            { q: 'A: ___ you from Australia?<br>B: No, I’m not. I’m from New Zealand.', a: 'are' },
            { q: 'A: When is your birthday?<br>B: ___ on Saturday!', a: 'it’s' },
            { q: 'A: Who ___ you live with?<br>B: With my mum, dad and my brother.', a: 'do' },
            { q: 'A: Does your brother like doing sport?<br>B: No, he ___ . He hates it.', a: 'doesn’t' } ] },
        { n: 7, type: 'pick', inline: true, tag: 'have got', ru: 'Выбери правильный вариант.',
          en: 'Choose the correct option.',
          items: [
            { q: 'I [[]] two brothers.', o: ['’ve got', 'has got'], a: '’ve got' },
            { q: 'Liam [[]] got blue eyes. He’s got green eyes.', o: ['has', 'hasn’t'], a: 'hasn’t' },
            { q: '[[]] you got a laptop?', o: ['Have', 'Has'], a: 'Have' },
            { q: 'Lucy and Eve [[]] got new shoes.', o: ['has', 'have'], a: 'have' },
            { q: 'We [[]] got a big garden.', o: ['hasn’t', 'haven’t'], a: 'haven’t' } ] },
        { n: 8, type: 'pick', tag: 'a, an, some', ru: 'Куда слово: a, an или some? Образец: a biscuit · an apple · some soup.',
          en: 'Complete the table with the words in the box.', row: true,
          items: [
            { q: 'meat', o: ['a', 'an', 'some'], a: 'some' },
            { q: 'orange', o: ['a', 'an', 'some'], a: 'an' },
            { q: 'peas', o: ['a', 'an', 'some'], a: 'some' },
            { q: 'rice', o: ['a', 'an', 'some'], a: 'some' },
            { q: 'sandwich', o: ['a', 'an', 'some'], a: 'a' } ] },
        { n: 9, type: 'type', tag: 'present continuous', ru: 'Одно слово в каждый пропуск.',
          en: 'Complete the dialogue with one word in each gap.',
          tpl: '<p><b>Joe</b> Where [[0]] you? Are you at home?</p><p><b>Arif</b> No, I’m not. I’m at the sports shop. I [[1]] buying some trainers. What are you [[2]] ?</p><p><b>Joe</b> I’m [[3]] shopping – I don’t like it! I’m at home and I’m [[4]] TV.</p>',
          items: [ { a: ['are'] }, { a: ['\'m', 'am'] }, { a: ['doing'] }, { a: ['not'] }, { a: ['watching'] } ] },
        { n: 10, type: 'pick', inline: true, tag: 'can; past simple; was/were', ru: 'Выбери правильный вариант.',
          en: 'Choose the correct option.',
          items: [
            { q: 'My cousin [[]] run fast, but he can’t swim.', o: ['can', 'can’t'], a: 'can' },
            { q: 'I can speak English, but I [[]] speak Japanese.', o: ['can', 'can’t'], a: 'can’t' },
            { q: 'She [[]] cycling yesterday.', o: ['goes', 'went'], a: 'went' },
            { q: 'What [[]] your favourite toys when you were young?', o: ['was', 'were'], a: 'were' },
            { q: 'Were you at the cinema last night? Yes, I [[]].', o: ['was', 'were'], a: 'was' } ] }
      ] },
      { id: 'rd', ru: 'чтение', en: 'Reading', ex: [
        { n: 11, type: 'pick', text: 'a2', tag: 'main idea / detail', ru: 'Прочитай статью. Выбери правильный вариант.',
          en: 'Read the article about technology. Choose the correct option.',
          items: [
            { q: 'The article is about why it’s good to …', o: ['read messages', 'turn off technology', 'use your phone in bed'], a: 'turn off technology' },
            { q: 'If you live in the ‘present moment’, you …', o: ['look at your screen', 'go out', 'look at and listen to things around you'], a: 'look at and listen to things around you' },
            { q: 'If you don’t look at your phone in bed, …', o: ['it’s easier to sleep', 'you’re tired the next day', 'you can’t sleep'], a: 'it’s easier to sleep' },
            { q: 'When you don’t use technology, …', o: ['you have less free time', 'you have more free time', 'you don’t see friends and family'], a: 'you have more free time' },
            { q: 'The writer thinks that technology makes our lives …', o: ['busy', 'important', 'different'], a: 'busy' } ] },
        { n: 12, type: 'tf', ni: true, text: 'a2', tag: 'true / false / no information', ru: 'Верно, неверно или в тексте этого нет (NI)?',
          en: 'Read the article again. Are the sentences T (true), F (false) or is there NI (no information)?',
          items: [
            { q: 'More than 50% of us go to sleep with our phones next to our beds.', a: 'NI' },
            { q: 'It’s difficult to sleep with your phone in your bedroom.', a: 'T' },
            { q: 'The writer thinks it’s a good idea to leave your phone in the kitchen at night.', a: 'T' },
            { q: 'You can’t see family and friends without technology.', a: 'F' },
            { q: 'The writer thinks technology is bad.', a: 'F' } ] },
        { n: 13, type: 'pick', text: 'a2', tag: 'specific information', ru: 'Ответь на вопросы по статье.',
          en: 'Read the article again. Answer the questions.',
          items: [
            { q: 'What adjective in paragraph 1 describes some of the readers of the article?', o: ['busy', 'worried', 'tired'], a: 'worried' },
            { q: 'How many main reasons does the writer give for turning off technology?', o: ['two', 'three', 'four'], a: 'three' },
            { q: 'What reasons does the writer give for not sleeping well?', o: ['you read messages and play games until late', 'the blue light from your phone is bad for sleep; calls and messages can wake you up', 'the kitchen is noisy at night'], a: 'the blue light from your phone is bad for sleep; calls and messages can wake you up' },
            { q: 'What three things can you do if you turn off technology?', o: ['watch films, read messages, play video games', 'sleep, cook dinner, go shopping', 'see friends and family, learn to play a musical instrument, do sport'], a: 'see friends and family, learn to play a musical instrument, do sport' },
            { q: 'What does the writer want us to try at the end of the article?', o: ['a new phone', '‘screen-free’ time', 'a musical instrument'], a: '‘screen-free’ time' } ] }
      ] },
      { id: 'ls', ru: 'аудирование', en: 'Listening', ex: [
        { n: 14, type: 'pick', audio: 'a2_t1', tag: 'listening to complete sentences', ru: 'Послушай интервью о центре для слонов. Выбери правильный вариант.',
          en: 'Listen to an interview about an elephant care-centre in Asia. Choose the correct option.',
          items: [
            { q: 'The care-centre is in …', o: ['India', 'Thailand', 'Japan'], a: 'Thailand' },
            { q: 'The volunteers …', o: ['feed and wash the elephants', 'can ride the elephants', 'sleep with the elephants'], a: 'feed and wash the elephants' },
            { q: 'The elephants sleep …', o: ['at the centre', 'in the forest', 'in their shelters'], a: 'in the forest' },
            { q: 'The volunteers get fruit for the elephants from …', o: ['the beach', 'the forest', 'local farms'], a: 'local farms' },
            { q: 'The centre is …', o: ['very close to Bangkok', 'in a beautiful place', 'a long way from the beach'], a: 'in a beautiful place' } ] },
        { n: 15, type: 'pick', audio: 'a2_t1', tag: 'detail / specific information', ru: 'Послушай ещё раз. Ответь на вопросы.',
          en: 'Listen to the interview again. Answer the questions.',
          items: [
            { q: 'What is the care-centre looking for?', o: ['volunteers to work in the centre', 'money for a new centre', 'new elephants'], a: 'volunteers to work in the centre' },
            { q: 'What does the money pay for?', o: ['the volunteers’ holidays', 'the cost of looking after the elephants', 'a new river'], a: 'the cost of looking after the elephants' },
            { q: 'How long do the volunteers work in the centre?', o: ['between one and three weeks', 'one month', 'between two and four weeks'], a: 'between one and three weeks' },
            { q: 'What do the volunteers clean?', o: ['the beach', 'the farms', 'the elephants’ shelters'], a: 'the elephants’ shelters' },
            { q: 'How often do the volunteers get fruit for the elephants?', o: ['every morning', 'twice a week', 'once a week'], a: 'twice a week' } ] },
        { n: 16, type: 'tf', ni: true, audio: 'a2_t1', tag: 'true / false / no information', ru: 'Послушай ещё раз. Верно, неверно или этого нет (NI)?',
          en: 'Listen to the interview again. Are the sentences T (true) or F (false) or is there NI (no information)?',
          items: [
            { q: 'The volunteers work hard.', a: 'NI' },
            { q: 'The elephants don’t eat much fruit.', a: 'F' },
            { q: 'The centre is in the south of Thailand.', a: 'T' },
            { q: 'The interviewer thinks the centre sounds fantastic.', a: 'T' },
            { q: 'Emily worked in the centre last year.', a: 'NI' } ] }
      ] }
    ]
  }
};

window.GI_TEXTS = {
  a1: '<h4>Summer language courses</h4>' +
    '<div class="ad"><p><b>Visit Manchester this summer and learn English!</b></p><p>Manchester is a great place to study. It’s a big city with lots of shops and parks. There are two famous football clubs, too. It’s easy to get around the city. There are a lot of buses, and there’s an electric tram network called Metrolink.</p><p>Come and study with us this summer. It’s a great chance to learn English and make friends!</p><p class="sig">Manchester City Language Schools</p></div>' +
    '<div class="ad"><p><b>Come to France this summer and practise your French!</b></p><p>Our school is in Cagnes-sur-Mer. It is a small town in the south of France. There are some modern hotels, but a lot of the houses are old. There are a lot of beautiful trees and flowers. The beach is great, but it is very crowded in the summer. This town is quiet, but it’s friendly and there are a lot of places to eat out.</p><p>Study French with us and have a great summer holiday!</p><p class="sig">Provence Language Study Holidays</p></div>',
  a2: '<h4>Why ‘screen-free’ time is a good idea</h4>' +
    '<p>Do you spend a lot of time looking at your phone, laptop or tablet screen? Do you read messages on your phone at night? Are you worried about how often you look at your phone? If you are, add some ‘screen-free’ time to your weekly routine.</p>' +
    '<p>Sometimes it’s good to turn off technology. First, it makes you live in the ‘present moment’. This means that you look up from your screen and really see what’s happening around you. Who or what can you see? What can you hear? How do you feel? Take some time to enjoy the moment without a screen.</p>' +
    '<p>Second is sleep. The blue light from your phone screen is bad for sleep. And when you do sleep, messages and calls can wake you up. It isn’t a surprise that you feel tired the next day! So, put your phone on the charger in the kitchen, not your bedroom, when you go to bed.</p>' +
    '<p>Third, we all have busy lives and technology makes it busy, too. When you spend less time with technology, you have more time to do other things. For example, you can see your friends and family, learn to play a musical instrument or do sport.</p>' +
    '<p>Technology is an important part of our lives, but it isn’t everything. It’s good to take a break from it – there are a lot of other interesting and different things we can do. So, try some ‘screen-free’ time!</p>'
};

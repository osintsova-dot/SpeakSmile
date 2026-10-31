/* Тест на уровень для 1–4 классов: данные диагностических тестов Give Me Five! (Macmillan) L2–L5.
   Diagnostic Test Level N = что ребёнок должен знать ДО курса GMF N (материал GMF N−1).
   Каждое задание: пример (item 0, уже решён, без баллов) + 5 заданий × 2 балла = 10.
   Ключи — из официальных Answer Key (L2, L3, L4, L5). Переделанные из письменных — помечены conv:true.
   Формат вопроса: {a:'аудио', q:'текст', img:'картинка', o:[варианты: строка или {i:'картинка'}], k:индекс верного}
*/
window.KT = (function () {
  var T = 'true', F = 'false';
  function tf(q, a, ok) { return { a: a, q: q, o: [T, F], k: ok ? 0 : 1 }; }
  function yn(q, ok) { return { q: q, o: ['yes', 'no'], k: ok ? 0 : 1 }; }
  function pics(a, list, k, q) { return { a: a, q: q, o: list.map(function (x) { return { i: x }; }), k: k }; }

  var L2 = {
    lv: 2, course: 'GMF 2', title: 'Тест к Give Me Five! 2',
    ex: [
      { skill: 'listening', ru: 'Послушай и выбери картинку', en: 'Listen and tick.', shuffle: true,
        items: [1, 2, 3, 4, 5, 6].map(function (n) {
          var k = [0, 1, 0, 0, 0, 1][n - 1];
          return pics('l2a1_' + n, ['l2_t1_' + n + 'a', 'l2_t1_' + n + 'b'], k);
        }) },
      { skill: 'listening', ru: 'Послушай: про кого это — Билл или Боб?', en: 'Listen and circle.', shared: ['l2_clowns'],
        items: ['Bob', 'Bob', 'Bill', 'Bill', 'Bill', 'Bob'].map(function (w, i) {
          return { a: 'l2a2_' + (i + 1), o: ['Bill', 'Bob'], k: w === 'Bill' ? 0 : 1 };
        }) },
      { skill: 'reading', ru: 'Посмотри на картинку и выбери слово', en: 'Read and circle.',
        items: [
          { img: 'l2_r1', q: 'There’s a ___ .', o: ['supermarket', 'toyshop'], k: 0 },
          { img: 'l2_r2', q: 'I’m wearing ___ .', o: ['shoes', 'trainers'], k: 1 },
          { img: 'l2_r3', q: 'There’s a ___ .', o: ['motorbike', 'boat'], k: 0 },
          { img: 'l2_r4', q: 'I’m wearing ___ .', o: ['shorts', 'a skirt'], k: 0 },
          { img: 'l2_r5', q: 'There’s a ___ .', o: ['cinema', 'bookshop'], k: 1 },
          { img: 'l2_r6', q: 'There’s a ___ .', o: ['shirt', 'swimsuit'], k: 1 }
        ] },
      { skill: 'grammar', ru: 'Смайлик подскажет: 😍 — love, 🙂 — like, 🙁 — don’t like. Выбери предложение', en: 'Look and write.', conv: true,
        items: [
          { img: 'l2_f_eggs', face: 'dont', o: ['I don’t like eggs.', 'I like eggs.', 'I don’t like rice.'], k: 0 },
          { img: 'l2_f_chicken', face: 'like', o: ['I don’t like chicken.', 'I like chicken.', 'I like chips.'], k: 1 },
          { img: 'l2_f_cake', face: 'like', o: ['I like salad.', 'I don’t like cake.', 'I like cake.'], k: 2 },
          { img: 'l2_f_salad', face: 'love', o: ['I love salad.', 'I love rice.', 'I don’t like salad.'], k: 0 },
          { img: 'l2_f_rice', face: 'dont', o: ['I like rice.', 'I don’t like rice.', 'I don’t like eggs.'], k: 1 },
          { img: 'l2_f_chips', face: 'like', o: ['I like chicken.', 'I don’t like chips.', 'I like chips.'], k: 2 }
        ] },
      { skill: 'vocabulary', ru: 'Что на картинке? Выбери слово', en: 'Look and write.', conv: true,
        items: [
          { img: 'l2_w_flowers', o: ['flowers', 'trees', 'flags'], k: 0 },
          { img: 'l2_w_skirt', o: ['shirt', 'skirt', 'shorts'], k: 1 },
          { img: 'l2_w_sheep', o: ['ship', 'shop', 'sheep'], k: 2 },
          { img: 'l2_w_pear', o: ['pear', 'peach', 'bear'], k: 0 },
          { img: 'l2_w_butterflies', o: ['birds', 'butterflies', 'flowers'], k: 1 },
          { img: 'l2_w_scooter', o: ['skates', 'computer', 'scooter'], k: 2 }
        ] }
    ]
  };

  var GRID3 = ['l3_n_a', 'l3_n_b', 'l3_n_c', 'l3_n_d', 'l3_n_e', 'l3_n_f'];
  var ANS3 = ['a  I’m playing football.', 'b  It’s History.', 'c  It’s twenty cents.', 'd  I play volleyball and basketball.', 'e  It’s on the twelfth of July.', 'f  They’re ten cents.'];
  var L3 = {
    lv: 3, course: 'GMF 3', title: 'Тест к Give Me Five! 3',
    ex: [
      { skill: 'listening', ru: 'Послушай и найди картинку', en: 'Listen and number.', grid: true,
        items: [4, 2, 0, 3, 1, 5].map(function (k, i) { return pics('l3a1_' + (i + 1), GRID3, k); }) },
      { skill: 'listening', ru: 'Послушай и выбери картинку', en: 'Listen and tick.',
        items: [1, 1, 0, 1, 0, 1].map(function (k, i) { var n = i + 1; return pics('l3a2_' + n, ['l3_t_' + n + 'a', 'l3_t_' + n + 'b'], k); }) },
      { skill: 'reading', ru: 'Прочитай вопрос и выбери ответ', en: 'Match the questions and answers.',
        items: [
          ['What’s your favourite subject?', 1], ['When’s your birthday?', 4], ['Do you play any sports?', 3],
          ['How much are these apples?', 5], ['How much is this sandwich?', 2], ['What are you doing?', 0]
        ].map(function (x) { return { q: x[0], o: ANS3, k: x[1], list: true }; }) },
      { skill: 'reading', ru: 'Посмотри на два дома. Про какой это — A или B?', en: 'Look, read and write A or B.', shared: ['l3_houseA', 'l3_houseB'], sharedLabels: ['A', 'B'],
        items: [
          ['There are four bedrooms.', 0], ['There isn’t a garden.', 1], ['There are two bathrooms.', 0],
          ['There’s a garage.', 0], ['There are three bedrooms.', 1], ['It’s a house. It isn’t a flat.', 0]
        ].map(function (x) { return { q: x[0], o: ['A', 'B'], k: x[1] }; }) },
      { skill: 'grammar', ru: 'Что они делают? Выбери предложение', en: 'What are they doing? Look and write.', conv: true,
        items: [
          { img: 'l3_d1', o: ['They’re skating on the ice.', 'They’re swimming.', 'They’re skiing.'], k: 0 },
          { img: 'l3_d2', o: ['They’re playing football.', 'They’re playing tennis.', 'They’re swimming.'], k: 1 },
          { img: 'l3_d3', o: ['They’re singing.', 'They’re watching TV.', 'They’re listening to music.'], k: 2 },
          { img: 'l3_d4', o: ['They’re taking photos.', 'They’re painting pictures.', 'They’re reading books.'], k: 0 },
          { img: 'l3_d5', o: ['They’re running.', 'They’re dancing.', 'They’re skating.'], k: 1 },
          { img: 'l3_d6', o: ['They’re drinking juice.', 'They’re eating pizza.', 'They’re eating apples.'], k: 2 }
        ] }
    ]
  };

  function t4(n) { return ['l4_t_' + n + 'a', 'l4_t_' + n + 'b', 'l4_t_' + n + 'c']; }
  var L4 = {
    lv: 4, course: 'GMF 4', title: 'Тест к Give Me Five! 4',
    ex: [
      { skill: 'listening', ru: 'Прочитай вопрос, послушай и выбери картинку', en: 'Listen and tick.',
        items: [
          ['What’s Ben’s favourite school subject?', 1], ['How does Daisy help at home?', 0], ['What’s the matter?', 2],
          ['What did they do yesterday?', 1], ['Where’s Sarah’s watch?', 2], ['Which is the heaviest sea animal?', 2]
        ].map(function (x, i) { return pics('l4a1_' + (i + 1), t4(i + 1), x[1], x[0]); }) },
      { skill: 'listening', ru: 'Прочитай, послушай про Джона и выбери: true (правда) или false (неправда)', en: 'Read, listen and circle.',
        items: [
          tf('John and his friends like skateboarding.', 'l4a2_1', 1),
          tf('In summer, John looks for starfish on the beach.', 'l4a2_2', 0),
          tf('He thinks tigers are very strong animals.', 'l4a2_3', 1),
          tf('His favourite school subject is ICT.', 'l4a2_4', 1),
          tf('Every week, John hoovers the floor.', 'l4a2_5', 0),
          tf('He prefers sweet food to savoury food.', 'l4a2_6', 0)
        ] },
      { skill: 'reading', ru: 'Посмотри на картинку и выбери: yes или no', en: 'Look, read and write yes or no.', shared: ['l4_parade'],
        items: [
          yn('The people are watching a parade.', 1), yn('There’s a whale on the girl’s T-shirt.', 1),
          yn('The older boy is eating cake.', 0), yn('There are six men playing instruments in the band.', 1),
          yn('The woman is wearing a bracelet.', 1), yn('It’s half past four.', 0)
        ] },
      { skill: 'reading', ru: 'Прочитай и выбери правильный конец', en: 'Read and circle.',
        items: [
          { q: 'My dad loves swimming underwater and taking photos of fish. His favourite hobby is …', o: ['windsurfing.', 'snorkelling.', 'water-skiing.'], k: 1 },
          { q: 'George looked under the sofa for his keys, then he looked behind the fridge, but he didn’t find them. Then, he found them under his wardrobe. George’s keys were in the …', o: ['bedroom.', 'living room.', 'kitchen.'], k: 0 },
          { q: 'On Monday, Wednesday and Friday, I lay the table. On Tuesday, I dust. I lay the table …', o: ['every day.', 'twice a week.', 'three times a week.'], k: 2 },
          { q: 'At the moment, Emma can play computer games and board games, but she can’t walk or ride a bike. She can eat and drink. She hasn’t got a temperature. She’s got …', o: ['a cough.', 'a broken leg.', 'the flu.'], k: 1 },
          { q: 'It’s bigger than an octopus and sometimes it’s dangerous. It’s got big teeth. It’s a …', o: ['shark.', 'dolphin.', 'seahorse.'], k: 0 },
          { q: 'Last night, we watched a TV programme about a funny starfish. He lives in a shell in a big city. He likes playing cards and eating pizza. This TV programme is a …', o: ['documentary.', 'sports programme.', 'cartoon.'], k: 2 }
        ] },
      { skill: 'grammar', ru: 'Посмотри на картинку и выбери ответ', en: 'Look, read and write.', conv: true,
        items: [
          { img: 'l4_w1', q: 'Is Michael good at Arts and Crafts?', o: ['Yes, he is.', 'No, he isn’t.', 'Yes, he does.'], k: 0 },
          { img: 'l4_w2', q: 'What time does the Music lesson begin?', o: ['It begins at nine o’clock.', 'It begins at half past nine.', 'It begins at half past six.'], k: 1 },
          { img: 'l4_w3', q: 'What do they sometimes do at the weekend?', o: ['They sometimes go shopping.', 'They sometimes ride their bikes.', 'They sometimes wash the car.'], k: 2 },
          { img: 'l4_w4', q: 'What’s the matter?', o: ['She’s got a temperature.', 'She’s got a broken arm.', 'She’s hungry.'], k: 0 },
          { img: 'l4_w5', q: 'What would they like on their pizza?', o: ['They would like cheese and tomatoes.', 'They would like mushrooms and peppers.', 'They would like ham and pineapple.'], k: 1 },
          { img: 'l4_w6', q: 'What are they going to do?', o: ['They’re going to play tennis.', 'They’re going to go windsurfing.', 'They’re going to go kayaking.'], k: 2 }
        ] }
    ]
  };

  var FUT = 'What will your life be like in the future? What will your city be (1) ___? Imagine your town fifty years from now. There will probably be more people and (2) ___ tall buildings, but I don’t think we (3) ___ travel in the same way. Cars will have (4) ___ and fly through the air, and people will drive across the city above the buildings. School will be different, too. I don’t think children will go to school. They will study on computers and see their teachers online. I think teachers (5) ___ be robots, not real people. In fifty years there (6) ___ be more robots to do everything; a robot to do your homework, a robot to clean your bedroom and a robot to do the chores. So, you will have more time to study!';
  var L5 = {
    lv: 5, course: 'Get Involved A1+', title: 'Тест к следующему курсу после GMF 4',
    ex: [
      { skill: 'listening', ru: 'Прочитай вопрос, послушай и выбери ответ', en: 'Listen and circle.', tts: true,
        items: [
          { a: 'l5a1', q: 'What do they need a lot of in this recipe?', o: ['flour', 'chocolate', 'butter'], k: 1 },
          { a: 'l5a2', q: 'When did velociraptors live?', o: ['50 million years ago', '60 million years ago', '70 million years ago'], k: 2 },
          { a: 'l5a3', q: 'Which is the smallest planet?', o: ['Mercury', 'Pluto', 'Jupiter'], k: 0 },
          { a: 'l5a4', q: 'Which musical instrument would Josh rather play?', o: ['piano', 'drums', 'electric guitar'], k: 1 },
          { a: 'l5a5', q: 'What job does Mr Robson do?', o: ['dentist', 'nurse', 'doctor'], k: 0 },
          { a: 'l5a6', q: 'What are washing machines used for?', o: ['washing dishes', 'washing animals', 'washing clothes'], k: 2 }
        ] },
      { skill: 'listening', ru: 'Послушай Марка и выбери: true (правда) или false (неправда)', en: 'Listen and write true or false.', tts: true,
        items: [
          tf('Mark is 11 years old.', 'l5b1', 0),
          tf('Mark was very confident when he was young.', 'l5b1', 0),
          tf('Mark met his best friend Jason when he was five.', 'l5b2', 1),
          tf('Mark’s favourite position in the football team is number nine.', 'l5b3', 1),
          tf('Mark and Jason don’t have to wear a school uniform.', 'l5b4', 0),
          tf('Mark hasn’t been to London on holiday before.', 'l5b5', 1)
        ] },
      { skill: 'reading', ru: 'Прочитай и выбери правильный конец', en: 'Read and circle.',
        items: [
          { q: 'A recipe is something that you use when …', o: ['you’re cooking.', 'you’re at the chemist’s.', 'you’re at a supermarket.'], k: 0 },
          { q: 'A mechanic is a person who …', o: ['works in a school.', 'works in a garage.', 'works in a clinic.'], k: 1 },
          { q: 'A vet is a person who …', o: ['works in a hospital and looks after patients.', 'works in a clinic and looks after people’s teeth.', 'works in a clinic and looks after animals.'], k: 2 },
          { q: 'An observatory is a place where you study …', o: ['rockets.', 'planets and stars.', 'people and animals.'], k: 1 },
          { q: 'A xylophone is …', o: ['a machine used for making phones.', 'the name of a new planet.', 'a musical instrument.'], k: 2 },
          { q: 'A sweater is made of …', o: ['wool.', 'leather.', 'plastic.'], k: 0 }
        ] },
      { skill: 'grammar', ru: 'Прочитай текст и выбери слово для пропуска', en: 'Read and circle.', text: FUT, textTitle: 'A look into the future',
        items: [
          ['like', 'as', 'likes', 0], ['much', 'more', 'any', 1], ['are', 'won’t', 'will', 2],
          ['wings', 'arms', 'wheels', 0], ['will', 'aren’t', 'are', 0], ['won’t', 'were', 'will', 2]
        ].map(function (x, i) { return { q: 'Gap (' + (i + 1) + ')', gap: i + 1, o: x.slice(0, 3), k: x[3] }; }) }
    ]
  };
  return { 2: L2, 3: L3, 4: L4, 5: L5 };
})();

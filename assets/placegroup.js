/* Тест на уровень: какую ГРУППУ советовать — по знаниям И по возрасту (01.11.2026, Оксана:
   «Результат трактовать по знаниям, группу предлагать с учетом возраста и уровня»).
   Шкала знаний K = курс, к которому ребёнок готов:
   0 с нуля · 1 GMF 1 · 2 GMF 2 · 3 GMF 3 · 4 GMF 4 · 5 GIA1 (Get Involved A1+) · 6 GIA2 (A2) · 7 Prepare 3 · 8 Prepare 4 · 9 Prepare 5 · 10 Gateway B2.
   RANGE[класс] = группы, где учатся дети этого возраста (подправить здесь — меняется во всех трёх тестах). */
(function () {
  var NAME = ['с нуля', 'Give Me Five! 1', 'Give Me Five! 2', 'Give Me Five! 3', 'Give Me Five! 4',
    'Get Involved A1+ (GIA1)', 'Get Involved A2 (GIA2)', 'Prepare 3', 'Prepare 4', 'Prepare 5', 'Gateway B2'];
  var RANGE = { 1: [1, 1], 2: [1, 2], 3: [2, 3], 4: [3, 4], 5: [5, 5], 6: [5, 6], 7: [6, 7], 8: [7, 8], 9: [7, 9], 10: [8, 10], 11: [9, 10] };
  function name(k) { return NAME[Math.max(0, Math.min(10, Math.round(k)))]; }
  /* k — знания (может быть дробным: 4.5 = «между»), grade — класс в школе, o.strong — уверенно (для линии 🚀 GIA1) */
  function group(k, grade, o) {
    o = o || {};
    var r = RANGE[+grade] || [1, 10], lo = r[0], hi = r[1], g, parent = '', admin = '';
    var kk = Math.floor(k);
    if (kk < lo) {
      g = lo;
      if ((kk === 0 && lo === 1) || lo === 5) { parent = ''; admin = lo === 5 ? 'по знаниям — ' + name(kk) + ', для этого и есть линия «с нуля»' : ''; } // GIA1 🐣 — группа как раз для новичков 5 класса
      else {
        parent = 'Знаний пока меньше, чем в группе для этого возраста. Предложим группу по возрасту с поддержкой («Урок дома», отработки) или индивидуальные занятия — администратор обсудит с вами.';
        admin = 'знания ниже возраста (по знаниям — ' + name(kk) + '): группа по возрасту с поддержкой или индивидуально';
      }
    } else if (kk > hi) {
      g = hi;
      parent = 'Знаний больше, чем у сверстников. Можно в группу по возрасту сильным учеником или в более сильную группу — обсудим с вами.';
      admin = 'знания выше возраста: по уровню подошёл бы ' + name(kk) + ', по возрасту — ' + name(hi);
    } else g = kk;
    var gname = name(g);
    if (g === 0 || (g === 1 && kk === 0)) gname = 'Give Me Five! 1 · с нуля';
    if (g === 5) gname = kk < 5 ? 'Get Involved A1+ · группа «с нуля» 🐣' : (o.strong ? 'Get Involved A1+ · продолжающие 🚀' : 'Get Involved A1+');
    return { k: g, group: gname, parent: parent, admin: admin, knowledge: name(kk) };
  }
  window.SSGroup = { group: group, name: name, RANGE: RANGE };
})();

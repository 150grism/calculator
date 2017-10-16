var button = document.querySelectorAll('button');
var displayInput = document.getElementById('display-input');
var displayResult = document.getElementById('display-result');
var upToAlert = document.getElementById('alert');
var time = document.getElementById('time');
// console.log('butt');


var text = '';
var fSize = 0;
var dot = false;
var cv, qw;
var d = new Date();
var timer;

lastCharacter = (index) => text.charAt(text.length - index);

//таймер для предупреждения о превышении допустимого количества символов
endAndStartTimer = () => {
  window.clearTimeout(timer);
  //var millisecBeforeRedirect = 10000; 
  timer = window.setTimeout(function() {upToAlert.style.display = 'none';}, 3000); 
}

commaEvery3 = (string, cv, qwLast, checkIfInitialComma = false) => {
  var zx = 0;
  if (qwLast < 3) {return string;}
  for (qw = qwLast; qw > cv; qw--) {
    // console.log(qw + ' ' + text.charAt(qw) + ' ' + zx);
    console.log(qw);
    zx++;
    zx = zx % 3;
    if (zx === 0) {
      console.log('zx ' + qw + ' ' + cv);
      if (checkIfInitialComma === true) {
        console.log('checkIfInitialComma');
        if (['+', '-', '\u00D7', '\u00F7', '%'].indexOf(string.charAt(qw - 1)) < 0) {
          console.log('return');
          string = string.slice(0, qw) + "," + string.slice(qw);
          // console.log('-> ' + text);
        } else {
          string = string;
        }
      } else {
        string = string.slice(0, qw) + "," + string.slice(qw);
      }
    }
  }
  return string;
}

//время в строке состояния
var hours = d.getHours(), minutes = d.getMinutes();
if (hours < 10) {
  hours = '0' + hours;
} 
if (minutes < 10) {
  minutes = '0' + minutes;
} 
time.innerHTML = hours + ':' + minutes;

//функционал кнопок:
document.onclick = function () {

  if (event.target.tagName == 'BUTTON') {
    theButton = event.target;
    val = event.target.value;
    //при превышении 35 символов, вывести предупреждение (исчезнет по таймеру) и удалить последний введенный символ
    if (text.replace(/,/g,'').length > 35) {
      upToAlert.style.display = 'block';
      endAndStartTimer();
      // setTimeout(function() {upToAlert.style.display = 'none';}, 3000);
      text = text.slice(0, -1);
    }
    //если на момент нажатия кнопки на экране был выведен результат вычесления, стереть результат и стереть инпут юзера
    if (displayResult.innerHTML !== '') {
      text = '';
      displayResult.innerHTML = '';
    }
    //если нажата кнопка "backspace" (если значение кнопки = "backspace"), 
    //стереть последний символ и еще стереть запятую, если она повиснет в конце инпута
    if (val === 'backspace') {
      if (lastCharacter(2) === ',') {
        if (text.lastIndexOf('.') + 1 > text.length - 2) {
          dot = false;
        }
        text = text.slice(0, -2);
      } else {
        if (text.lastIndexOf('.') + 1 > text.length - 1) {
          dot = false;
        }
        text = text.slice(0, -1);
      }
    //если кнопка - "AC", стереть результат + стереть весь инпут
    } else if (val === 'clear') {
      text = '';
      displayResult.innerHTML = '';
    //если кнопка выполняет одну из операций (сложение, вычитание, деление, умножение), и 
    //последний символ в инпуте = одна из этих операций, заменить этот последний символ новой операцией
    } else if (['+', '-', '\u00D7', '\u00F7'].indexOf(val) > -1 && ['+', '-', '\u00D7', '\u00F7'].indexOf(lastCharacter(1)) > -1) {
      text = text.slice(0, -1);
      text += val;
    //если кнопка - "точка", и последний символ инпута - %, запрещаем ставить еще точки (dot = true;) и в инпут приписываем "x0."
    } else if (val === '.' && lastCharacter(1) === '%') {
      dot = true;
      text = text + '\u00D7' + '0' + val;
    //умножение, деление и процента первым в инпуте быть не могут - инпут не меняется
    } else if (['\u00D7', '\u00F7', '%'].indexOf(val) > -1 && text.length === 0) {
    //если кнопка - знак процента, и предыдущий символ в инпуте - операция, то заменяем операцию на знак процента
    } else if (val === '%' && ['+', '-', '\u00D7', '\u00F7'].indexOf(lastCharacter(1)) > -1) {
      if (lastCharacter(2) !== '%') {
        text = text.slice(0, -1);
        text += val;
      } else {
        //если перед операцией уже стоит знак процента, то просто удаляем знак операции (чтобы знак процента не задваивался)
        text = text.slice(0, -1);
      }
    //несколько знаков процента подряд быть не может
    } else if (val === '%' && val === lastCharacter(1)) {
    //в любом другом случае, если кнопка - ни "равно", ни точка и не цифра - просто приписываем значение кнопки
    } else if (val !== '=' && val !== '.' && theButton.className !== 'numbers') {
      text += val;
    }
    //если кнопка - цифра:
    if (theButton.className == 'numbers') {
      if (val !== '.') {
        if (lastCharacter(1) === '%') {
          //"\u00D7" - умножение
          text = text + '\u00D7' + val;
        } else {
          text += val;
        }
        //Добавление запятых каждые 3 цифры
        //находим первую цифру последнего числа в инпуте (cv) и удаляем из этого числа запятые
        for (cv = text.length - 1; ['+', '-', '\u00D7', '\u00F7', '%', '.'].indexOf(text.charAt(cv)) < 0 && cv > 0; cv--) {console.log(cv);}
        text = text.slice(0, cv) + text.slice(cv).replace(/,/g, '');
        console.log(text);
        //через каждые три цифры в последнем числе инпута ставим запятую, если эта цифра в числе не первая
        // var zx = 0;
        // for (qw = text.length - 1; qw > cv; qw--) {
        //   // console.log(qw + ' ' + text.charAt(qw) + ' ' + zx);
        //   zx++;
        //   zx = zx % 3;
        //   if (zx === 0 && ['+', '-', '\u00D7', '\u00F7', '%'].indexOf(text.charAt(qw - 1)) < 0) {
        //     text = text.slice(0, qw) + "," + text.slice(qw);
        //     // console.log('-> ' + text);
        //   }
        // }
        text = commaEvery3(text, cv, text.length - 1, true);
        // console.log(commaEvery3(text, cv, text.length - 1, true));
        //Удяление запятых после "точки"
        qw = text.lastIndexOf('.');
        if (qw >= cv) {
          //если точка в последнем числе найдена, запрещаем ставить еще точки и удаляем запятые
          dot = true;
          console.log(qw + ' --- ' + cv);
          text = text.slice(0, qw) + text.slice(qw).replace(/,/g, '');
        } else {dot = false;}
      //если кнопка - "точка", добавляем её в инпут и запрещаем ставить еще точки
      } else {
        if (dot === false) {
          text += val;
          dot = true;
        }
      }
    }
    //Изменяем размер текста на дисплее в зависимости от количества символов
    if (text.length < 17) {
      if (fSize != 1) {
        displayInput.style.fontSize = 31;
        displayResult.style.fontSize = 31;
        fSize = 1;
      }
    }
    if (text.length >= 17 && text.length < 20) {
      if (fSize != 2) {
        displayInput.style.fontSize = 27;
        displayResult.style.fontSize = 27;
        fSize = 2;
      }
    }
    if (text.length >= 20) {
      if (fSize != 3) {
        displayInput.style.fontSize = 24;
        displayResult.style.fontSize = 24;
        fSize = 3;
      }
    }
    displayInput.innerHTML = text;
    console.log(text);

    //если кнопка - "равно", запускаем функцию вычисления результата
    if (val === '=') {
      Calculate();
    }
    // console.log(openParenthesesCount);
  }

  Calculate = () => {
    text = text.replace(/,/g, '');
    text = text.replace(/\u00F7/g, '/');
    text = text.replace(/\u00D7/g, '*');
    // console.clear();
    // console.log(eval(text));
    //Вычисление процентных значений
    for (let i = 0; i < text.length; i++) {
      //находим последний символ числа с процентом
      if (text.charAt(i) === '%') {
        console.log('i:' + i);
        let k = 0, j;
        let percentText;
        //находим первый символ числа с процентом
        for (j = i-1; ['+', '-', '*', '/', '%'].indexOf(text[j]) < 0 && j >= 0; j--) {}
        console.log('j:' + j);
        percentText = text.substring(j + 1, i);
        // console.log(percentText);
        // percentText = percentText.slice(0, -1);
        console.log(percentText);
        text = text.replace(percentText + '%',parseFloat(percentText) / 100);
        console.log(text);
      }
    }
    //удаляем неиспользуемые знаки операций в конце инпута
    while (['+', '-', '*', '/'].indexOf(lastCharacter(1)) > -1) {
      text = text.slice(0, -1);
      console.log(text);
    }
    //вычисляем результат
    result = eval(text).toString();
    let i;
    //Добавляем в результат запятые
    //начиная либо с позиции символа "точки", либо с конца ...
    if (result.indexOf('.') > 0) {
      i = result.lastIndexOf('.');
      //сокращаем результат то 10 знаков после запятой (чтобы горизонтальный скроллбар не появлялся в некоторых случаях)
      if (result.lastIndexOf('e') < 1) {
        result = result.substr(0, i + 10);
      };
    } else {
      i = result.length;
    }
    //... раставляем запятые, если в результате не используется "e"
    if (result.indexOf('e') < 1) {
      var zx = 0;
      for (qw = i - 1; qw > 0; qw--) {
        zx++;
        zx = zx % 3;
        if (zx === 0) {
          result = result.slice(0, qw) + "," + result.slice(qw);
          console.log('-> ' + result);
        }
      }
    }
    //удалем запятую в самом начале числа, если число отрицательное
    if (result.charAt(0) === '-' && result.charAt(1) === ',') {
      result = result.slice(0, 1) + result.slice(2, result.length);
    }
    //выводим результат на дисплей
    result = '=' + result; 
    //ограничение длины результата в зависимости от размера шрифта в инпуте
    // if (fSize === 1) {
    //   result = result.slice(0, 16);
    // }
    // if (fSize === 2) {
    //   result = result.slice(0, 17);
    // }
    // if (fSize === 3) {
    //   result = result.slice(0, 20);
    // }
    displayResult.innerHTML = result;  
  }
}
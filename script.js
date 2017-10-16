var button = document.querySelectorAll('button');
var displayInput = document.getElementById('display-input');
var displayResult = document.getElementById('display-result');
var upToAlert = document.getElementById('alert');
var time = document.getElementById('time');
// console.log('buttd');


var text = '';
var fSize = 0;
var dot = false;
var lastCharacter = (index) => text.charAt(text.length - index);
var cv, qw;
var d = new Date();
var timer;

//таймер для предупреждения о превышении допустимого количества символов
function endAndStartTimer() {
  window.clearTimeout(timer);
  //var millisecBeforeRedirect = 10000; 
  timer = window.setTimeout(function() {upToAlert.style.display = 'none';}, 3000); 
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

//функционал кнопок
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
    //если кнопка выполняет одну из операций (сложение, вычитание, деление, умножение), в то время как 
    //последний символ в инпуте = одна из этих операций, заменить этот последний символ новой операцией
    } else if (['+', '-', '\u00D7', '\u00F7'].indexOf(val) > -1 && ['+', '-', '\u00D7', '\u00F7'].indexOf(lastCharacter(1)) > -1) {
      text = text.slice(0, -1);
      text += val;
    //если кнопка - "точка", и последний символ инпута - %, 
    } else if (val === '.' && lastCharacter(1) === '%') {
      // ... начиная с конца, ищем позицию последнего символа, который является операцией. Это будет, фактически, конец предпоследнего числа в инпуте
      for (cv = text.length - 1; ['+', '-', '\u00D7', '\u00F7', '%', '.'].indexOf(text.charAt(cv)) < 0 && cv > 0; cv--) {console.log(cv);}
      // ... находим позицию последней точки в инпуте. 
      qw = text.lastIndexOf('.');
      // ... если точка в инпуте позже предпоследнего числа в инпуте, значит точка находится где-то в последнем числе.
      //тогда 
      // if ((qw >= cv && dot === false) || qw === -1) {
        //dot = true - значит, что точка в числе уже есть - значит новую точку в число ставить запрещено
        dot = true;
        text = text + '\u00D7' + '0' + val;
      // }
    } else if (['\u00D7', '\u00F7', '%'].indexOf(val) > -1 && text.length === 0) {
    } else if (val === '%' && ['+', '-', '\u00D7', '\u00F7'].indexOf(lastCharacter(1)) > -1) {
      if (lastCharacter(2) !== '%') {
        text = text.slice(0, -1);
        text += val;
      } else {
        text = text.slice(0, -1);
      }
    } else if (['+', '-', '\u00D7', '\u00F7', '%'].indexOf(lastCharacter(1)) > -1 && val === lastCharacter(1)) {
    } else if (val !== '=' && val !== '.' && theButton.className !== 'numbers') {
      text += val;
    }
    if (theButton.className == 'numbers') {
      if (val !== '.') {
        if (lastCharacter(1) === '%') {
          text = text + '\u00D7' + val;
        } else {
          text += val;
        }
        for (cv = text.length - 1; ['+', '-', '\u00D7', '\u00F7', '%', '.'].indexOf(text.charAt(cv)) < 0 && cv > 0; cv--) {console.log(cv);}
        text = text.slice(0, cv) + text.slice(cv).replace(/,/g, '');
        console.log(text);
        var zx = 0;
        for (qw = text.length - 1; qw > cv; qw--) {
          // console.log(qw + ' ' + text.charAt(qw) + ' ' + zx);
          zx++;
          zx = zx % 3;
          if (zx === 0 && ['+', '-', '\u00D7', '\u00F7', '%'].indexOf(text.charAt(qw - 1)) < 0) {
            text = text.slice(0, qw) + "," + text.slice(qw);
            // console.log('-> ' + text);
          }
        }
        qw = text.lastIndexOf('.');
        if (qw >= cv) {
          dot = true;
          console.log(qw + ' --- ' + cv);
          text = text.slice(0, qw) + text.slice(qw).replace(/,/g, '');
        } else {dot = false;}
      } else {
        if (dot === false) {
          text += val;
          dot = true;
        }
      }
    }
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

    if (val === '=') {
      SchitaiBatika();
    }
    // console.log(openParenthesesCount);
  }

  SchitaiBatika = () => {
    text = text.replace(/,/g, '');
    text = text.replace(/\u00F7/g, '/');
    text = text.replace(/\u00D7/g, '*');
    // console.clear();
    // console.log(eval(text));
    for (let i = 0; i < text.length; i++) {
      if ( text.charAt(i) === '%') {
        console.log('i:' + i);
        let k = 0, j;
        let percentText;
        for (j = i-1; ['+', '-', '*', '/', '%'].indexOf(text[j]) < 0 && j >= 0; j--) { 
          k++;
        }
        console.log('j:' + j);
        console.log('k:' + k);
        percentText = text.substring(i - k, i + 1);
        console.log(percentText);
        percentText = percentText.slice(0, -1);
        console.log(percentText);
        text = text.replace(percentText + '%',parseFloat(percentText) / 100);
        console.log(text);
      }
    }
    while (['+', '-', '*', '/'].indexOf(lastCharacter(1)) > -1) {
      text = text.slice(0, -1);
      console.log(text);
    }
    result = eval(text).toString();
    let i;
    if (result.indexOf('.') > 0) {
      for (i = result.length - 1; result.charAt(i) !== '.'; i--) {}
    } else {
      i = result.length;
    }
      var zx = 0;
      for (qw = i - 1; qw > 0; qw--) {
        zx++;
        zx = zx % 3;
        if (zx === 0) {
          result = result.slice(0, qw) + "," + result.slice(qw);
          console.log('-> ' + result);
        }
      }
    result = '=' + result; 
    if (fSize = 1) {
      result = result.slice(0, 16);
    }
    if (fSize = 2) {
      result = result.slice(0, 17);
    }
    if (fSize = 3) {
      result = result.slice(0, 20);
    }
    displayResult.innerHTML = result;  
  }
}

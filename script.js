var button = document.querySelectorAll('button');
var displayInput = document.getElementById('display-input');
var displayResult = document.getElementById('display-result');
var upToAlert = document.getElementById('alert');
// console.log('butt');


var text = '';
var fSize = 0;

document.onclick = function () {
  let lastCharacter = text.charAt(text.length - 1);
  let secondLastCharacter = text.charAt(text.length - 2);
  if (event.target.tagName == 'BUTTON') {
    theButton = event.target;
    val = event.target.value;
    // if (typeof val = 'number')
    if (theButton.className === 'number') {
      console.log('ye');
    }
    if (val === 'backspace') {
      text = text.slice(0, -1);
    } else if (val === 'clear') {
      text = '';
    } else if (['+','-','*','/'].indexOf(val) > -1 && ['+','-','*','/'].indexOf(lastCharacter) > -1) {
      text = text.slice(0, -1);
      text += val;
    } else if (val === '%' && ['+','-','*','/'].indexOf(lastCharacter) > -1) {
      if (!secondLastCharacter === '%') {
        text = text.slice(0, -1);
        text += val;
      } else {
        text = text.slice(0, -1);
      }
    } else if (['+','-','*','/','%'].indexOf(lastCharacter) > -1 && val === lastCharacter) {
    } else if (val !== '=') {
      text += val;
    }
    if (text.length < 17) {
      if (fSize != 1) {
        displayInput.style.fontSize = 31;
        fSize = 1;
      }
    }
    if (text.length >= 17 && text.length < 20) {
      if (fSize != 2) {
        displayInput.style.fontSize = 27;
        fSize = 2;
      }
    }
    if (text.length >= 20) {
      if (text.length > 130) {
        upToAlert.style.opacity = 1;
        text=text.substring(0,88);
      } else {
        upToAlert.style.opacity = 0;
      }
      if (fSize != 3) {
        displayInput.style.fontSize = 24;
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
    console.clear();
    // console.log(eval(text));
    for (let i = 0; i < text.length; i++) {
      if ( text.charAt(i) === '%') {
        console.log(i);
        let k = 0, j;
        let percentText;
        for (j = i-1; ['+','-','*','/','%'].indexOf(text[j]) < 0; j--) { 
          k++;
        }
        console.log(j);
        percentText = text.substring(i-k, i+1);
        console.log(percentText);
        percentText = percentText.slice(0, -1);
        console.log(percentText);
        text = text.replace(percentText + '%',parseFloat(percentText)/100)
        console.log(text);
      }
    }
    result = parseFloat(eval(text).toFixed(2));
    displayResult.innerHTML = '=' + result;  
  }
}
var text = '12345,6789,52%1231,51215+123,16+72,5235,23-112314';
// var text = '12123124134'
var text = '8888';

text = text.replace(/,/g,'');

var zx = 0;
for (let qw = text.length - 1; qw > 0; qw--) {
  console.log(qw + ' ' + text.charAt(qw) + ' ' + zx);
  zx++;
  zx = zx % 3;
  if (['+','-','*','/','%'].indexOf(text.charAt(qw)) > -1) {
    zx=3;
    console.log('|-->' + qw + ' ' + zx)
  }
  if (zx === 0 && ['+','-','*','/','%'].indexOf(text.charAt(qw-1)) < 0) {
    text = text.slice(0, qw) + "," + text.slice(qw);
    console.log('-> ' + text);
  }
}
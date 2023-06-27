function isDigit(s: any) {
  return  /^\d+$/.test(s)
}

function isLetter(str: any): boolean {
  if (!str) return false
  return str.length === 1 && str.match(/[a-z]/i);
}

function isLetterOrDigit(str: any): boolean {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

export default {
  isDigit,
  isLetter,
  isLetterOrDigit,
}

import "./styles.css";

var bday_input = document.querySelector("#bday-input");
var chk_btn = document.querySelector("#chk-btn");
var result = document.querySelector("#output-div");
var gif = document.querySelector(".loading-gif");

function reverseString(text) {
  let reversedStr = text.split("").reverse().join("");
  return reversedStr;
}

function checkifPalindrome(text) {
  let reversedText = reverseString(text);
  return text === reversedText;
}

function correctDateFormat(date) {
  let dateformat = { day: "", month: "", year: "" };
  if (date.day < 10) {
    dateformat.day = "0" + date.day;
  } else {
    dateformat.day = date.day.toString();
  }
  if (date.month < 10) {
    dateformat.month = "0" + date.month;
  } else {
    dateformat.month = date.month.toString();
  }

  dateformat.year = date.year.toString();

  return dateformat;
}

function checkAllDateFormats(date) {
  let dateStr = correctDateFormat(date);
  var ddmmyyyy = dateStr.day + dateStr.month + dateStr.year;
  var mmddyyyy = dateStr.month + dateStr.day + dateStr.year;
  var yyyymmdd = dateStr.year + dateStr.month + dateStr.day;
  var ddmmyy = dateStr.day + dateStr.month + dateStr.year.slice(-2);
  var mmddyy = dateStr.month + dateStr.day + dateStr.year.slice(-2);
  var yymmdd = dateStr.year.slice(-2) + dateStr.month + dateStr.day;
  return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];
}

function checkIfPalindromeForAllDates(date) {
  var dateList = checkAllDateFormats(date);
  var flag = false;

  for (var i = 0; i < dateList.length; i++) {
    if (checkifPalindrome(dateList[i])) {
      flag = true;
      break;
    }
  }
  return flag;
}

function checkIfLeapYear(year) {
  if (year % 400 === 0) {
    return true;
  }
  if (year % 100 === 0) {
    return false;
  }
  if (year % 4 === 0) {
    return true;
  }
  return false;
}

function getNextDate(date) {
  var day = date.day + 1;
  var month = date.month;
  var year = date.year;

  var listOfDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2) {
    if (checkIfLeapYear(year)) {
      if (day > 29) {
        day = 1;
        month = 3;
      }
    } else {
      if (day > 28) {
        day = 1;
        month = 3;
      }
    }
  } else {
    if (day > listOfDates[month - 1]) {
      day = 1;
      month++;
    }
  }
  if (month > 12) {
    month = 1;
    year++;
  }
  return {
    day: day,
    month: month,
    year: year
  };
}

function getPrevDate(date) {
  var day = date.day - 1;
  var month = date.month;
  var year = date.year;

  var listOfDates = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (day === 0) {
    month--;
    if (month === 0) {
      day = 31;
      month = 12;
      year--;
    } else if (month === 2) {
      if (checkIfLeapYear(year)) {
        day = 29;
      } else {
        day = 28;
      }
    } else {
      day = listOfDates[month - 1];
    }
  }
  return {
    day: day,
    month: month,
    year: year
  };
}

function getPrevPalindromeDate(date) {
  var prevDate = getPrevDate(date);
  var counter = 0;

  while (1) {
    counter++;
    var isPalindrome = checkIfPalindromeForAllDates(prevDate);
    if (isPalindrome) {
      break;
    }
    prevDate = getNextDate(prevDate);
  }
  return [counter, prevDate];
}

function getNextPalindromeDate(date) {
  var nextDate = getNextDate(date);
  var counter = 0;

  while (1) {
    counter++;
    var isPalindrome = checkIfPalindromeForAllDates(nextDate);
    if (isPalindrome) {
      break;
    }
    nextDate = getNextDate(nextDate);
  }
  return [counter, nextDate];
}

function gifLoader() {
  gif.style.display = "block";
}

function clickHandler(e) {
  var bdayStr = bday_input.value;
  if (bdayStr !== "") {
    var listOfDate = bdayStr.split("-");
    setTimeout(gifLoader(), 4000);

    var date = {
      day: Number(listOfDate[2]),
      month: Number(listOfDate[1]),
      year: Number(listOfDate[0])
    };

    var isPalindrome = checkIfPalindromeForAllDates(date);

    if (isPalindrome) {
      chk_btn.style.display = "none";
      gif.style.display = "block";
      setTimeout(function () {
        result.innerText = `Yayy! \nYou're bday is a Palindrome! \n 🥳! `;
        gif.style.display = "none";
        chk_btn.style.display = "block";
      }, 7000);
    } else {
      var [prevCtr, prevDate] = getPrevPalindromeDate(date);
      var [futureCtr, nextDate] = getNextPalindromeDate(date);
      var minCtr = Math.min(prevCtr, futureCtr);
      chk_btn.style.display = "none";
      gif.style.display = "block";
      setTimeout(function () {
        if (minCtr === prevCtr) {
          var dayFormat_p = prevCtr === 1 ? "day" : "days";
          result.innerText = `Sorry! Try landing at ${prevDate.day}-${prevDate.month}-${prevDate.year} next time \n🤪,
      you missed it by ${prevCtr} ${dayFormat_p}!\n😶👉👈🥺`;
        } else if (minCtr === futureCtr) {
          var dayFormat_f = futureCtr === 1 ? "day" : "days";
          result.innerText = `Sorry! Next life, try landing at ${nextDate.day}-${nextDate.month}-${nextDate.year},
      you missed it by ${futureCtr} ${dayFormat_f}!`;
        }
        gif.style.display = "none";
        chk_btn.style.display = "block";
      }, 7000);
    }
  } else {
    result.innerText = `Come On!\n Put in a date at least first \n😤 `;
  }
}

chk_btn.addEventListener("click", clickHandler);

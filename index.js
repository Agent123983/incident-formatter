/**
 * Generates list from initial data pull from ServiceNow
 */
function getList() {
  var input = document.getElementById("initialText");
  var output = document.getElementById("listText");
  output.value = "";

  var initialUnfilteredLines = input.value.split("\n");
  var initialLines = initialUnfilteredLines.filter(function (el) {
    return el != "";
  });

  var inputList = new Array();
  var regexINC = /INC[0-9]{7}/g;
  var regexSO = /[0-9]{5}\-?[0-9]{9}/g;

  for (i = 0; i < initialLines.length; i++) {
    var incMatch = regexINC.exec(initialLines[i]);
    while (incMatch != null) {
      inputList.push(incMatch);
      incMatch = regexINC.exec(initialLines[i]);
    }

    var soMatch = regexSO.exec(initialLines[i]);
    while (soMatch != null) {
      inputList.push(soMatch);
      soMatch = regexSO.exec(initialLines[i]);
    }
  }

  inputList.forEach(function (item) {
    output.value = output.value + item + "\n";
  });

  var successListNotification = document.getElementById(
    "successListNotification"
  );
  var successFormatNotification = document.getElementById(
    "successFormatNotification"
  );
  successListNotification.innerHTML = "List Successfully Generated!";
  setTimeout(function () {
    successListNotification.innerHTML = "";
  }, 3000);
  successFormatNotification.innerHTML = "Generating Formatted List....";
  setTimeout(function () {
    getFormatting();
    successFormatNotification.innerHTML = "Successfully Formatted!";
    setTimeout(function () {
      successFormatNotification.innerHTML = "";
    }, 3000);
  }, 3000);
}

/**
 * Generates desired formatted list from input list
 */
function getFormatting() {
  var input = document.getElementById("listText");
  var output = document.getElementById("outputText");
  var outputNoSO = document.getElementById("outputTextNoSO");
  output.value = "";
  outputNoSO.value = "";

  var incidentMap = new Map();
  var unfiltered = input.value.split("\n");
  var lines = unfiltered.filter(function (el) {
    return el != "";
  });

  var currentKey = lines[0];
  incidentMap.set(currentKey, new Array());

  for (i = 1; i < lines.length; i++) {
    if (lines[i].startsWith("INC")) {
      currentKey = lines[i];
      if (!incidentMap.has(currentKey)) {
        incidentMap.set(currentKey, new Array());
      }
    } else {
      var array = incidentMap.get(currentKey);
      if (!array.includes(lines[i])) {
        array.push(lines[i]);
      }
    }
  }

  incidentMap.forEach((values, keys) => {
    if (values.length == 0) {
      outputNoSO.value = outputNoSO.value + keys + "\n";
    } else {
      values.forEach(function (order) {
        output.value = output.value + order + "\t" + keys + "\n";
      });
    }
  });

  if (outputNoSO.value === "") {
    outputNoSO.value = "No missing service orders!";
  }

  var successNotification = document.getElementById(
    "successFormatNotification"
  );
  successNotification.innerHTML = "Successfully formatted!";
  setTimeout(function () {
    successNotification.innerHTML = "";
  }, 3000);

  console.log(incidentMap.get("INC8652200"));
}

/**
 * Copy to Clipboard
 */
function copyToClipboard() {
  var copyText = document.getElementById("outputText");
  copyText.select();
  document.execCommand("copy");
  var notifications = document.getElementById("copyNotification");
  notifications.innerHTML = "Copied to Clipboard";
  setTimeout(function () {
    notifications.innerHTML = "";
  }, 3000);
}

/**
 * Clear Text Fields
 */

function clearTextFields() {
  document.getElementById("initialText").value = " ";
  document.getElementById("listText").value = " ";
  document.getElementById("outputText").value = " ";
  document.getElementById("outputTextNoSO").value = " ";
}

/**
 * Dark Mode/Theme Changer
 * */

function changeTheme(objButton) {
  button = document.getElementById("theme");
  navigation = document.getElementById("navigation");
  var element = document.body;
  element.classList.toggle("dark-mode");

  if (objButton.value == "light") {
    //changing to Light Mode but making button say Dark
    button.value = "dark";

    btnDark = document.querySelectorAll(".btn-dark");
    btnDark.forEach(function (btn) {
      btn.className = btn.className.replace("btn-dark", "btn-light");
    });

    textDark = document.querySelectorAll(".text-white, .bg-dark");
    textDark.forEach(function (txt) {
      txt.className = txt.className.replace("text-white", "text-dark");
      txt.className = txt.className.replace("bg-dark", "bg-light");
    });

    button.className = button.className.replace("btn-light", "btn-dark");
    navigation.className = navigation.className.replace(
      "navbar-dark bg-dark",
      "navbar-light bg-light"
    );
    $("#theme").html("Dark Mode");
  } else {
    //changing to Dark Mode but making button say Light
    button.value = "light";

    btnLight = document.querySelectorAll(".btn-light");
    btnLight.forEach(function (btn) {
      btn.className = btn.className.replace("btn-light", "btn-dark");
    });

    textLight = document.querySelectorAll(".text-dark, .bg-light");
    textLight.forEach(function (txt) {
      txt.className = txt.className.replace("text-dark", "text-white");
      txt.className = txt.className.replace("bg-light", "bg-dark");
    });

    button.className = button.className.replace("btn-dark", "btn-light");
    navigation.className = navigation.className.replace(
      "navbar-light bg-light",
      "navbar-dark bg-dark"
    );
    $("#theme").html("Light Mode");
  }
}

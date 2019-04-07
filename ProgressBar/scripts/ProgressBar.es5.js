"use strict";

var api_URL = "http://pb-api.herokuapp.com/bars";

function getInputValues() {
    "use strict";
    var bars, buttons, limit, element;
    element = document.getElementById("dvNoResult");
    fetch(api_URL).then(function (response) {
        return response.json();
    }).then(function (result) {
        bars = filterOnlyNumbers(result.bars);
        buttons = filterOnlyNumbers(result.buttons);
        limit = result.limit;
        if (limit && bars.length > 0) {
            element.classList.add("hide");
            element.classList.remove("show");
            createProgressBar(bars, limit);
            if (buttons.length > 0) {
                createButtons(buttons);
            }
        } else {
            element.classList.add("show");
            element.classList.remove("hide");
        }
    });
}

function filterOnlyNumbers(buttonList) {
    return buttonList.map(function (value) {
        if (isNaN(Number(value))) {
            console.warn("It is not a number: \"" + value + "\"");
            return null;
        }
        return value;
    }).filter(function (value) {
        return value !== null;
    });
}

function createProgressBar(bars, limit) {
    "use strict";
    var htmlString = "",
        selectString = "",
        currentElement,
        selectElement,
        count,
        applyClass;
    for (var i = 0; i < bars.length; i++) {
        count = bars[i] >= 0 ? bars[i] : 0;
        applyClass = bars[i] >= limit ? "class ='highlight-color'" : "";
        htmlString += "<progress id='prg_" + i + "' max='" + limit + "'" + applyClass + "  value='" + count + "' data-value='" + count + "'  data-label='" + count + "%'></progress>";
        selectString += "<option value='" + i + "' >Progress Bar " + parseInt(i + 1) + " </option>";
    }

    currentElement = document.getElementById('dvProgressContainer');
    currentElement.innerHTML = htmlString;
    selectElement = document.getElementById('dvSelectContainer');
    selectElement.innerHTML = "<select id='ddlOptions'>" + selectString + "</select>";
}

function createButtons(buttons) {
    "use strict";
    var newButtons = "",
        currentElement;
    for (var i = 0; i < buttons.length; i++) {
        newButtons += "<input type='button' class='info-button' value='" + buttons[i] + "' id='btnAction_" + i + "' onclick='action(this)' />";
    }

    currentElement = document.getElementById('dvButtonContainer');
    currentElement.innerHTML = newButtons;
}

function action(element) {
    "use strict";
    var currentValue, progressValue, optionElement, selectedBar, actionElement, maxValue;
    currentValue = parseInt(element.value);
    optionElement = document.getElementById("ddlOptions");
    selectedBar = optionElement.options[optionElement.selectedIndex].value;
    actionElement = document.getElementById('prg_' + selectedBar);
    progressValue = parseInt(actionElement.getAttribute("data-value")) + currentValue;
    progressValue = progressValue > 0 ? progressValue : 0;
    actionElement.value = progressValue;
    actionElement.setAttribute("data-label", progressValue + "%");
    actionElement.setAttribute("data-value", progressValue);
    maxValue = actionElement.max;
    if (progressValue >= maxValue) {
        actionElement.classList.add("highlight-color");
    } else {
        actionElement.classList.remove("highlight-color");
    }
}

getInputValues();


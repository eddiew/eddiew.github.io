// This file handles responsive stylesheet switching
// NOTE: JQuery and DOM are not yet loaded!

// TODO: lazy stylesheet link creation

var activeLayout = 'pc';

// Hash all layouts to eliminate DOM search time
layouts = (function () {
        var layoutTable = {},
            layoutsArray = document.getElementsByClassName("screenSpecific"),
            i,
            layout;
        for(i = 0; layout = layoutsArray[i]; i++) // Can't use a for each loop here for some reason
            layoutTable[layout.id] = layout;
        return layoutTable;
    }());

// getBrowserWidth is adapted from The Man in Blue Resolution Dependent Layout Script
// http://www.themaninblue.com/experiment/ResolutionLayout/
function getBrowserWidth() {
    if (window.innerWidth)
        return window.innerWidth;
    else if (document.documentElement && document.documentElement.clientWidth != 0)
        return document.documentElement.clientWidth;
    else if (document.body)
        return document.body.clientWidth;
    return 0;
}

function changeLayout() {
    var newLayout = chooseLayout();
    if (newLayout === activeLayout)
        return;
    layouts[newLayout].disabled = false;
    layouts[activeLayout].disabled = true;
    activeLayout = newLayout;
}

function chooseLayout() {
    var browserWidth = getBrowserWidth();
    if (browserWidth > 540)
        return 'pc';
    else
        return 'mobile';
}

// addEvent() by John Resig
function addEvent(obj, type, fn) {
    if (obj.addEventListener)
        obj.addEventListener(type, fn, false);
    else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj[type+fn] = function() {
            obj["e"+type+fn](window.event);
        }
        obj.attachEvent("on"+type, obj[type+fn]);
    }
}

// TODO: legacy support
function triggerEvent(obj, type) {
    obj.dispatchEvent(new Event(type));
}

// Initialize correct stylesheet
addEvent(window, 'load', changeLayout);

// Run changeLayout function when page resizes.
addEvent(window, 'resize', changeLayout);
function getBrowserWidth(){return window.innerWidth?window.innerWidth:document.documentElement&&0!=document.documentElement.clientWidth?document.documentElement.clientWidth:document.body?document.body.clientWidth:0}function changeLayout(){var t=chooseLayout();t!==activeLayout&&(layouts[t].disabled=!1,layouts[activeLayout].disabled=!0,activeLayout=t)}function chooseLayout(){var t=getBrowserWidth();return t>=1024?"pc":360>=t?"phone":"tablet"}function addEvent(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent&&(t["e"+e+n]=n,t[e+n]=function(){t["e"+e+n](window.event)},t.attachEvent("on"+e,t[e+n]))}function triggerEvent(t,e){t.dispatchEvent(new Event(e))}layouts=function(){var t,e,n={},o=document.getElementsByClassName("screenSpecific");for(t=0;e=o[t];t++)n[e.id]=e;return n}(),activeLayout="pc",addEvent(window,"load",changeLayout),addEvent(window,"resize",changeLayout);
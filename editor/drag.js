
'use strict';

trjs.drag = {};

trjs.drag.drag_start = function(event) {
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + '<' + (parseInt(style.getPropertyValue("top"),10) - event.clientY)+ ',' + event.target.id;
    event.dataTransfer.setData("text/html",str);
}

trjs.drag.drag_over = function(event) {
    event.preventDefault();
    return false;
}

trjs.drag.drop = function(event) {
    var offset = event.dataTransfer.getData("text/html").split(',');
    var dm = document.getElementById('testdrag');
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

    var dm2 = document.getElementById('testdrag2');
    dm2.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm2.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}

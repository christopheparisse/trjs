/**
 * logs.js
 * @author Christophe Parisse
 * sets of utilities to display messages on the screen
 * Date: mai 2014
 * @module logs
 * @author Christophe Parisse
 */


trjs.log = ( function() {

	/**
	 * class that allows to create display messages
	 * A pointer to the number of messages stored
	 * A pointer to the current message displayed
	 * All temporary messages are stored
	 */
	
	var elem = null;
	var nbInfoMsg = 0;
	var dispInfoMsg = 0;
	var arrayLogMsg = new Array();
	var arrayInfoMsg = new Array();
	var arrayInfoMsgStyle = new Array();
	var arrayInfoMsgDuration = new Array();
	var hInfoMsg = null;

	var infoMsgDisplay = function() {
	    if (nbInfoMsg > dispInfoMsg) {
	    	if (arrayInfoMsgStyle[dispInfoMsg] === 'high') {
	    		elem.attr('class', 'bb-alert alert alert-info high');
				elem.find("span").html(arrayInfoMsg[dispInfoMsg]);
	    	}
			else {
	    		elem.attr('class', 'bb-alert alert alert-info normal');
				elem.find("span").html(arrayInfoMsg[dispInfoMsg]);
			}
			elem.delay(200).fadeIn().delay(arrayInfoMsgDuration[dispInfoMsg]).fadeOut();
			dispInfoMsg++;
		}
		if (dispInfoMsg >= nbInfoMsg && hInfoMsg != null) {
			clearInterval(hInfoMsg);
			hInfoMsg = null;
		}
	};	

    var init = function(s) {
	    elem = $("#bb-info");
    };

	var infoMsgShow = function(text, style, duration) {
		arrayInfoMsg.push(text);
		arrayInfoMsgStyle.push(style);
		arrayInfoMsgDuration.push(duration);
		nbInfoMsg++;
		if (hInfoMsg == null)
			hInfoMsg = setTimeout(infoMsgDisplay, 500);
	};
	
	var infoMsgClear = function() {
		nbInfoMsg = 0;
		dispInfoMsg = 0;
		delete arrayInfoMsg;
		delete arrayInfoMsgDuration;
		arrayInfoMsg = new Array();
	};
	
	return {
		init: function() { init(); },
		/**
		 * display a permanent alert message
		 * this windows can be displayed or hidden at will
		 * @method trjs.log.alert
		 * @param {string} msg message to be displayed
		 * @param {int} duration in millisecond
		 */
		alert: function(msg, style, duration) {
			if (duration === undefined)
				duration = 2000;
			if (style === undefined)
				style = 'normal';
			infoMsgShow(msg, style, duration);
		},
		/**
		 * clear permanent alert message
		 * @method clear
		 */
		clear: function() {
			infoMsgClear();
		},
		/**
		 * show permanent alert message
		 * @method show
		 */
		show: function() {
			bootbox.alert('All messages: <br/>' + arrayInfoMsg.join('<br/>'), function() {});
		},
		
		/**
		 * displays a message
		 * @method trjs.log.boxalert
		 * @param {string} message to be displayed
		 */
		boxalert: function(msg) {
			bootbox.alert(msg, function() {});
			infoMsgShow(msg, 1000);
		},
		log: function(m) {
			arrayLogMsg.push(m);
		},
		resetLog: function() {
			arrayLogMsg = new Array();
		},
		resultLog: function() {
			if (arrayLogMsg.length>0)
				bootbox.alert('Log messages: <br/>' + arrayLogMsg.join('<br/>'), function() {});
		},
	};
	
})();

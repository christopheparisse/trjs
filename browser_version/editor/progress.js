/**
 * progress.js
 * @author Christophe Parisse
 * handling socket and progress bar
 * Date: mai 2014
 * @module progress
 * @author Christophe Parisse
 */

trjs.progress = ( function() {

	var NBPROGRESSBOX = 12;
	var pgBox = [];
	var actionBox = [];
	
	/**
	 * create a progress box
	 * @method progressBox
	 * @param {string} id of box to be displayed
	 */                              
	function box(idbox)
	{
	    var s = '<div class="progress-box" id="progress-' + idbox + '">';
	    s += '<div class="progress-left" id="progress-left-' + idbox + '"></div>';
	    s += '<div class="progress-right" id="progress-right-' + idbox + '"></div>';
	    s += '<div class="progress-text" id="progress-text-' + idbox + '">x</div></div>';
	    $(s).appendTo('#progress');
	}
	
	/**
	 * set value of a progress box
	 * @method progressBoxSet
	 * @param {string} id of box to be displayed
	 * @param {int} value to be displayed
	 */                              
	function setnth(idbox, nth)
	{
		show(idbox); 	
	    var a = $('#progress-'+idbox);
	    // console.log(idbox + '=' + nth);
	    //a.find('progress-left-'+idbox).css('width', 150 * ((nth)/100) ); //nth+'%');
	    //a.find('progress-right-'+idbox).css('width', 150 * ((100-nth)/100) ); // (100-nth)+'%');
	    a.find('#progress-left-'+idbox).width(nth+'%'); // ', 150 * ((nth)/100) ); //);
	    a.find('#progress-right-'+idbox).width((100-nth)+'%'); // ', 150 * ((100-nth)/100) ); // );
	}
	
	/**
	 * set message of a progress box
	 * @method progressBoxSet
	 * @param {string} id of box to be displayed
	 * @param {string} value to be displayed
	 */                              
	function setmsg(idbox, msg)
	{
	    $('#progress-text-'+idbox).text(msg);
	}
	
	/**
	 * initializa all the progress box (static boxes)
	 * @method initProgressBox
	 */
	function init() {
		trjs.progress.closeaction = null;
		pgBox = new Array(NBPROGRESSBOX);
		actionBox = new Array(NBPROGRESSBOX);
		for (var i=0; i<NBPROGRESSBOX; i++) {
		    box(i);
		    setmsg(i, 'starting...');
			pgBox[i] = false;
			actionBox[i] = null;
		}
	}
	
	/**
	 * find a free progress box
	 * @method initProgressBox
	 * @return [int] id of box
	 */
	function find() {
		for (var i=0; i<NBPROGRESSBOX; i++) {
			if (pgBox[i] === false) {
				pgBox[i] = '...';
				actionBox[i] = null;
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * closes a progress box
	 * @method closePgBox
	 * @param [int] id of box
	 */
	function close(idbox) {
		pgBox[idbox] = false;
		hide(idbox);
		setmsg(idbox, 'starting...');
	}
	
	/**
	 * hides a progress box
	 * @method progressBoxHide
	 * @param [int] id of box
	 */
	function hide(idbox) {
		$('#progress-'+idbox).hide();
		var found = false;
		for (var i=0; i<NBPROGRESSBOX; i++) {
			if (pgBox[i]) {
				found = true;
				break;
			}
		}
		if (found === false) {
			$('#progress').hide();
			trjs.editor.resizeTranscript();
		}
	}
	
	/**
	 * displays a progress box
	 * @method progressBoxShow
	 * @param [int] id of box
	 */
	function show(idbox) {
		$('#progress').show();
		$('#progress-'+idbox).show();
		trjs.editor.resizeTranscript();
	}
	
	/**
	 * sets the socket of a progress box
	 * @method setIOPgBox
	 * @param [int] id of box
	 * @param [int] id of message
	 */
	function setIO(idbox) {
		setnth(idbox, 0);
		console.log("set box: " + idbox);
		var a = trjs.progress.socket.on(idbox, function(data) {
			// data --> start end processed+name
			console.log('DATA: ' + data.toString());
			if (data.start) {
				console.log("START: " + data.start);
				trjs.log.alert(data.start); // attention à l'empilement des alertes
			} else if (data.end) {
				console.log("END: " + data.end);
				close(idbox);
				trjs.log.alert(data.end);
				closework(idbox);
			} else {
				console.log("PC: " + data.processed + ' ' + data.name);
				setnth(data.box, data.processed);
			    setmsg(data.box, data.name + ' ' + data.processed + '%');
			}
		});
		console.log('setIO Ok: ' + a);
	}
	
	function closework(idbox) {
		if (actionBox[idbox] !== null) {
			actionBox[idbox]();
			actionBox[idbox] = null;
		}
	}
	
	function closeallwork() {
		for (var i=0; i<NBPROGRESSBOX; i++) {
			if (pgBox[i]) {
				actionBox[i]();
				actionBox[i] = null;
			}
		}
	}
	
	function closedefine(idbox, action) {
			actionBox[idbox] = action;
	}
	
	/**
	 * set the function that displayed end of socket messages
	 * @method setSocketOutput
	 */
	function setSocketOutput() {
		trjs.progress.socket.on('delete', function(data) {
			trjs.log.alert(data.msg);
			trjs.progress.closeallwork();
		});
	}
		
	return {
		setIO: function(p) { return setIO(p); },
		box: function(p) { return box(p); },
		setnth: function(id, n) { return setnth(id, n); },
		setmsg: function(id, s) { return setmsg(id, n); },
		close: function(p) { return close(p); },
		show: function(p) { return show(p); },
		hide: function(p) { return hide(p); },
		find: function() { return find(); },
		init: function() { 
			init();
			setSocketOutput();
		},
		closework: function(p) { return closework(p); },
		closeallwork: function() { return closeallwork(); },
		closedefine: function(p, action) { return closedefine(p, action); },
	};
	
})();

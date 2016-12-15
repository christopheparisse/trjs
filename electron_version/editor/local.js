/*
 * handles the storage of information in the localStorage (or which ever evolution of the tools to store data locally)
 * 
 * local.js
 */

trjs.local = {
	/*
	 * all data stored in a local object point to trjs.local.current
	 */
	id: null, // name of the data stored in localStorage
	checkTimeLength: 30000, // length of time between update of data in memory
	update: function() { // sets time stamps to know which local data are alive and running
		var currenttime = new Date();
		if (!trjs.local.id) trjs.local.init();
		trjs.local.put('stamp', currenttime.getTime());
	},
	/*
	 * creates variables for the very first time
	 */
	init: function() {
		trjs.local.id = 'trjsdefault';
		trjs.local.names(trjs.local.id);
	},
	/*
	 * sets a variable in long term memory
	 */
	put: function(name, value) {
		//console.log('put> ' + this.id + ' ' + name + ' ' + value);
		localStorage.setItem(this.id + '_' + name, value);
	},
	/*
	 * retrieves a variable in long term memory
	 */
	get: function(name) {
		//console.log('get> ' + this.id + ' ' + name + ' ' + localStorage.getItem(this.id + '_' + name));
		return localStorage.getItem(this.id + '_' + name);
	},
	/*
	 * stores the names of the files processed
	 */
	names: function(name) {
		localStorage['trjsnames_' + name] = name;
	},
};

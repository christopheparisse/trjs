var _ = require('underscore');
var EventEmitter = require('events');
var SKIP_WORDS = require('./skipWords');
var spellchecker = require('spellchecker');
var util = require('util');

/**
 * Creates a spell-check provider to be passed to `webFrame.setSpellCheckProvider`.
 *
 * @param {String} language - The language that is being spell-checked. 'en-US'
 *   is the only supported value at present.
 *
 * @return {SpellCheckProvider}
 */
var SpellCheckProvider = function(language) {
  EventEmitter.call(this);

  this._language = language;
};

util.inherits(SpellCheckProvider, EventEmitter);

_.extend(SpellCheckProvider.prototype, {
  spellCheck: function(text) {
    var skipWords = SKIP_WORDS[this._language];
    if (_.contains(skipWords, text)) return true;

    var textIsMisspelled = spellchecker.isMisspelled(text);
    if (textIsMisspelled) {
      this.emit('misspelling', spellchecker.getCorrectionsForMisspelling(text));
    }
    return !textIsMisspelled;
  }
});

module.exports = SpellCheckProvider;

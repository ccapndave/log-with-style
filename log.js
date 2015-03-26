(function() {
	"use strict";

	var formats, getOrderedMatches, hasMatches, makeArray, stringToArgs, outputMessage;
	var log, info, debug, warn, error;

	if (typeof window === "undefined" || !(window.console && window.console.log)) {
		return;
	}

	outputMessage = function(level, logArgs) {
		var args = [];
		makeArray(logArgs).forEach(function(arg) {
			if (typeof arg === 'string') {
				return args = args.concat(stringToArgs(arg));
			} else {
				return args.push(arg);
			}
		});

		return console[level].apply(console, makeArray(args));
	};

	makeArray = function(arrayLikeThing) {
		return Array.prototype.slice.call(arrayLikeThing);
	};

	formats = [
		{
			regex: /\*([^\*]+)\*/,
			replacer: function(m, p1) {
				return "%c" + p1 + "%c";
			},
			styles: function() {
				return ['font-style: italic', ''];
			}
		}, {
			regex: /\_([^\_]+)\_/,
			replacer: function(m, p1) {
				return "%c" + p1 + "%c";
			},
			styles: function() {
				return ['font-weight: bold', ''];
			}
		}, {
			regex: /\`([^\`]+)\`/,
			replacer: function(m, p1) {
				return "%c" + p1 + "%c";
			},
			styles: function() {
				return ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', ''];
			}
		}, {
			regex: /\[c\=(?:\"|\')?((?:(?!(?:\"|\')\]).)*)(?:\"|\')?\]((?:(?!\[c\]).)*)\[c\]/,
			replacer: function(m, p1, p2) {
				return "%c" + p2 + "%c";
			},
			styles: function(match) {
				return [match[1], ''];
			}
		}
	];

	hasMatches = function(str) {
		var _hasMatches;
		_hasMatches = false;
		formats.forEach(function(format) {
			if (format.regex.test(str)) {
				return _hasMatches = true;
			}
		});
		return _hasMatches;
	};

	getOrderedMatches = function(str) {
		var matches;
		matches = [];
		formats.forEach(function(format) {
			var match;
			match = str.match(format.regex);
			if (match) {
				return matches.push({
					format: format,
					match: match
				});
			}
		});
		return matches.sort(function(a, b) {
			return a.match.index - b.match.index;
		});
	};

	stringToArgs = function(str) {
		var firstMatch, matches, styles;
		styles = [];
		while (hasMatches(str)) {
			matches = getOrderedMatches(str);
			firstMatch = matches[0];
			str = str.replace(firstMatch.format.regex, firstMatch.format.replacer);
			styles = styles.concat(firstMatch.format.styles(firstMatch.match));
		}
		return [str].concat(styles);
	};

	var exports = {
		log: function() { return outputMessage.apply(this, ["log", arguments]); },
		debug: function() { return outputMessage.apply(this, ["debug", arguments]); },
		info: function() { return outputMessage.apply(this, ["info", arguments]); },
		warn: function() { return outputMessage.apply(this, ["warn", arguments]); },
		error: function() { return outputMessage.apply(this, ["error", arguments]); }
	};

	if (typeof define === 'function' && define.amd) {
		define(function defineLog() {
			return exports;
		});
	} else if (typeof exports !== 'undefined') {
		module.exports = exports;
	}

}).call(this);

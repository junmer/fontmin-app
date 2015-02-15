/* global node */
'use strict';

var assign = node('object-assign');
var drop = require('component/drop-anywhere');
var each = node('each-async');
var Fontmin = node('fontmin');
var path = node('path');
var Spinner = require('component/spinner');

/**
 * Minify fonts
 *
 * @param {Object} file
 * @param {Object} options
 * @param {Function} cb
 * @api private
 */

function minify(file, options, cb) {

    options = options || {};
    options.clone = true;

    var fontmin = new Fontmin()
        .src(file.path)
        .dest(path.join(path.dirname(file.path), 'build'))
        .use(Fontmin.glyph(options))
        .use(Fontmin.ttf2svg(options))
        .use(Fontmin.ttf2eot(options))
        .use(Fontmin.ttf2woff(options))
        .use(Fontmin.css());

    fontmin.run(function (err, files) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, assign(files[0]));
    });

}

/**
 * Create spinner
 *
 * @api private
 */

function spin() {
    var w = document.body.offsetWidth;
    var h = document.body.offsetHeight;
    var s = new Spinner()
        .size(w / 4)
        .light();

    s.el.style.position = 'absolute';
    s.el.style.top = h / 2 - (w / 4) / 2 + 'px';
    s.el.style.left = w / 2 - (w / 4) / 2 + 'px';

    document.body.style.backgroundColor = '#1C83C0';
    spin.remove = function () {
        document.body.style.backgroundColor = '';
        document.body.removeChild(s.el);
    };

    window.addEventListener('resize', function () {
        w = document.body.offsetWidth;
        h = document.body.offsetHeight;
    });

    document.body.appendChild(s.el);
    return s;
}

/**
 * Toggle display
 *
 * @param {Element} el
 * @api private
 */

function toggle(el) {
    el = document.querySelector(el);

    if (el.style.display === 'none') {
        el.style.display = 'block';
        return;
    }

    el.style.display = 'none';
}

/**
 * Run
 */
function minifyFiles(e, options) {
    var files = [];

    toggle('#drop-anywhere');
    spin();

    each(e.items, function (item, i, done) {
        minify(item, options, function (err, file) {
            if (err) {
                done(err);
                return;
            }

            files.push(file);
            done();
        });
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        toggle('#drop-anywhere');
        spin.remove();
        files = [];
    });
}


var textEl = document.querySelector('#glyph-textarea');

var submitEl = document.querySelector('#submit-button');

var dropItem;

submitEl.addEventListener('click', function() {
    toggle('#output-config');
    minifyFiles(dropItem, {
        text: textEl.value
    });
    textEl.value = '';
});

var cancelEl = document.querySelector('#cancel-button');

cancelEl.addEventListener('click', function() {
    toggle('#output-config');
    textEl.value = '';
});

drop(function(e) {
    toggle('#output-config');
    dropItem = e;
});

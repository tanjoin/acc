/** <div> 作成 */
module.exports.div = function(opt_className, opt_id, opt_text) {
  var element = document.createElement("div");
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  return element;
};

/** <a> 作成 */
module.exports.a = function(href, opt_text, target, opt_className, opt_id) {
  if (typeof target === 'undefined') { // 未定義の場合は target="_blank"
    opt_target = '_blank';
  }
  if (typeof href === 'undefined') {
    href = 'https://tanjoin.github.io';
  }
  var element = document.createElement("a");
  if (href) {
    element.href = href;
  }
  if (target) {
    element.target = target;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <p> 作成 */
module.exports.p = function(opt_className, opt_id, opt_text) {
  var element = document.createElement("p");
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  return element;
};

/** <img> 作成 */
module.exports.img = function(src, width, height, className, opt_id) {
  if (typeof src === 'undefined') {
    src = 'https://tanjoin.github.io/acc/img/404.png';
  }
  if (typeof width === 'undefined') {
    width = "100%";
  }
  if (typeof height === 'undefined') {
    height = "100%";
  }
  if (typeof className === 'undefined') {
    className = 'materialboxed';
  }
  var element = document.createElement("img");
  if (src) {
    element.src = src;
  }
  if (width) {
    element.width = width;
  }
  if (height) {
    element.height = height;
  }
  if (className) {
    element.className = className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <i> 作成 */
module.exports.i = function(type, className, opt_id) {
  if (typeof type === 'undefined') {
    type = "";
  }
  if (typeof className === 'undefined') {
    className = "material-icons";
  }
  var element = document.createElement("i");
  if (type) {
    element.type = type;
  }
  if (className) {
    element.className = className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <tbody> 作成 */
module.exports.tbody = function(opt_className, opt_id) {
  var element = document.createElement('tbody');
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <td> 作成 */
module.exports.td = function(opt_colspan, opt_className, opt_id) {
  var element = document.createElement('td');
  if (opt_colspan) {
    td.colspan = opt_colspan;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <tr> 作成 */
module.exports.tr = function(opt_className, opt_id) {
  var element = document.createElement('tr');
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <h1> 作成 */
module.exports.h1 = function(text, opt_className, opt_id) {
  if (typeof text === 'undefined') {
    text = "";
  }
  var element = document.createElement('h1');
  if (text) {
    element.text = text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <h4> 作成 */
module.exports.h4 = function(text, opt_className, opt_id) {
  if (typeof text === 'undefined') {
    text = "";
  }
  var element = document.createElement('h4');
  if (text) {
    element.innerText = text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

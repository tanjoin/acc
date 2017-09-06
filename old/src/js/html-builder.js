/** @constructor */
var HtmlBuilder = function(element) {
  if (typeof element === "string") {
    this.element = document.getElementById(element);
  } else if (typeof element === "object") {
    this.element = element;
  }
  this.paragraph = [];
};

HtmlBuilder.prototype = {
  then : function(conditoin, callback) {
    if (callback && conditoin) {
      var result = callback(this);
      if (result) {
        return result;
      }
    }
    return this;
  },
  ifElse : function(conditoin, trueCallback, falseCallback) {
    if (conditoin) {
      if (trueCallback) {
        var trueResult = rueCallback(this);
        if (trueResult) {
          return trueResult;
        }
      }
    } else {
      if (falseCallback) {
        var falseResult = falseCallback(this);
        if (falseResult) {
          return falseResult;
        }
      }
    }
    return this;
  },
  clean : function() {
    var element = this.toElement();
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return this;
  },
  intercept : function(callback) {
    callback(this.toElement(), this);
    return this;
  },
  toElement : function() {
    if (this.paragraph.length > 0) {
      return this.paragraph[this.paragraph.length - 1];
    } else if (this.element) {
      return this.element;
    }
    return null;
  },
  build : function() {
    for (var i = 0; i < this.paragraph.length; i++) {
      if (i === 0) {
        if (this.element) {
          this.element.appendChild(this.paragraph[i]);
        } else {
          this.element = this.paragraph[i];
        }
      } else {
        this.paragraph[i - 1].appendChild(this.paragraph[i]);
      }
    }
    this.paragraph = [];
    return this;
  },
  div : function(opt_className, opt_id) {
    var element = document.createElement("div");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  text : function(text) {
    this.paragraph.push(document.createTextNode(text));
    return this.build();
  },
  a : function(href, opt_className, opt_id, opt_onclick) {
    if (href) {
      var element = document.createElement("a");
      element.href = href;
      if (opt_className) {
        element.className = opt_className;
      }
      if (opt_id) {
        element.id = opt_id;
      }
      if (opt_onclick) {
        element.onclick = opt_onclick;
      }
      this.paragraph.push(element);
    }
    return this;
  },
  p : function(opt_innerText, opt_className, opt_id) {
    var element = document.createElement("p");
    if (opt_innerText) {
      element.innerText = opt_innerText;
    }
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  img : function(src, opt_className, opt_id) {
    var element = document.createElement("img");
    element.src = src;
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this.build();
  },
  i : function(opt_className, opt_id) {
    var element = document.createElement("i");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  tbody : function(opt_className, opt_id) {
    var element = document.createElement("tbody");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  tr : function(opt_className, opt_id) {
    var element = document.createElement("tr");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  td : function(opt_className, opt_id, opt_colSpan) {
    var element = document.createElement("td");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    if (opt_colSpan) {
      element.colSpan = opt_colSpan;
    }
    this.paragraph.push(element);
    return this;
  },
  h1 : function(opt_className, opt_id) {
    var element = document.createElement("h1");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h2 : function(opt_className, opt_id) {
    var element = document.createElement("h2");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h3 : function(opt_className, opt_id) {
    var element = document.createElement("h3");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h4 : function(opt_className, opt_id) {
    var element = document.createElement("h4");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  }
};

module.exports = HtmlBuilder;

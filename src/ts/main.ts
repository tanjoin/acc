"use strict";

import LocalStorageUtils from "./util/local_storage_util";

window.onload = function() {
  var lastViewedId = LocalStorageUtils.getLastViewedId();
  if (lastViewedId === null) {
    console.log(lastViewedId);
  }
};

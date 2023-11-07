const Campaign = require('./_campaign.js');

let ACC = {};

window.onload = async () => {
    ACC = await Campaign.loadAcc();
}

/**
 * Clipboard JS
 */ 
if (ClipboardJS) {
    new ClipboardJS('.clipboard');
}

/**
 * Materialize
 */
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, options);
});
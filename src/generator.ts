export default class Generator {

  onload() {
    this.applyAutoResize();
    this.applyCreateJson();
    this.applyCheckBoxSettings();
  }

  private applyCheckBoxSettings() {
    var labels = document.querySelectorAll('label.mdl-checkbox');
    var checkboxes = document.querySelectorAll('input.mdl-checkbox__input');
    for (var i = 0; i < checkboxes.length; i++) {
      var checkbox = checkboxes[i];
      checkbox.addEventListener('change', function(event) {
        console.log('change');
        if (this.checked) {
          if (this.id === 'checkbox-on__all') {
            Array.from(checkboxes)
              .filter((checkbox, index, array) => checkbox.id !== 'checkbox-on__all')
              .forEach((checkbox, index, array) => (<HTMLInputElement>checkbox).checked = false);
            Array.from(labels)
              .filter((label, index, array) => (<any>label).getAttribute('for') !== 'checkbox-on__all')
              .forEach((label, index, array) => (<any>label).MaterialCheckbox.uncheck());
          } else {
            (<any>document.getElementById('checkbox-on__all')).checked = false;
            (<any>document.querySelector('label[for=checkbox-on__all]')).MaterialCheckbox.uncheck();
          }
        }
      });
    }
  }

  private applyCreateJson() {
    var createBtn = document.getElementById('create_btn');
    createBtn.addEventListener('click', function(event) {
      document.getElementById('result_json').style.visibility = 'visible';
    });
  }

  private applyAutoResize() {
    var textarea = document.getElementById('content_description');
    textarea.addEventListener('focus', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
    textarea.addEventListener('blur', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
    textarea.addEventListener('input', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
  }
}

window.onload = function() {
  new Generator().onload();
};

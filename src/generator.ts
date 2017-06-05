export default class Generator {

  onload() {
    this.autoResize();

    var createBtn = document.getElementById('create_btn');
    createBtn.addEventListener('click', function(event) {
      document.getElementById('result_json').style.visibility = 'visible';
    });
  }

  private autoResize() {
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

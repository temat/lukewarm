var lukewarmSettings = {
  'baseUrl': '/',
  'language': 'ru'
};

$(document).ready(function() {  
  // Create Profile object.
  lukewarmProfile().init({
    language: lukewarmSettings.language,
    success_callback: 'lukewarmLoaded',
    error_callback: 'lukewarmError',
    model_update_callback: 'lukewarmModelUpdated'
  });
});

// Profile loading success callback. 
function lukewarmLoaded() {
  // Build questions.
  preloader('show');
  $.ajax({
    url: lukewarmSettings.baseUrl + 'tpl/question.tpl',
    success: function(qTemplate) {
      preloader('hide');
      lukewarmProfile().buildQuestions('#questions', qTemplate);
      
      // Answer buttons mouseover event.
      $('.btn-answer-hot').mouseover(function() {
        // Add tooltips to the buttons.
        // $(this).popover('show');
      });
      
      // Answer buttons click event.
      $('.btn-answer-cold').click(function() {
        registerAnswer($(this).data('qid'), 1);
      });
      
      $('.btn-answer-lukewarm').click(function() {
        registerAnswer($(this).data('qid'), 2);
      });
      
      $('.btn-answer-hot').click(function() {
        registerAnswer($(this).data('qid'), 3);
      });
      
      // Build tabs.
      preloader('show');
      $.ajax({
        url: lukewarmSettings.baseUrl + 'tpl/tabs.tpl',
        success: function(tTemplate) {
          preloader('hide');
          lukewarmProfile().buildTabs('#pagination', tTemplate);
          $('#pagination a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
          })
          $('#versesTab li:first').addClass('active');
          $('#questions .question:first').addClass('in active');          
        }
      });     
      
    }
  });
}

// "Model updated" callback.
function lukewarmModelUpdated(model, delta) {
  
  // Colorize the tabs.
  for(var qid in delta) {
    var q = delta[qid];
    var className = '';
    switch (q.code) {
      case 1: className = 'badge-info'; break;
      case 2: className = 'badge-warning'; break;
      case 3: className = 'badge-important'; break;
    }
    $('#badge' + q.qid).removeClass('badge-info badge-empty badge-warning badge-error');
    $('#badge' + q.qid).addClass(className);
  }
  
  // Switch to the next question.
  $('#page' + (q.qid + 1)).tab('show');
  
  // Update the address bar.
  updateUri();
}

// Register the answer.
function registerAnswer(qid, code) {
  var answer = {};
  answer['q' + qid] = {qid: qid, code: code};
  lukewarmProfile().modelUpdate(answer);
}

// Render ajax errors. 
function lukewarmError(jqXHR, textStatus, errorThrown, customText) {
  customText = typeof customText !== 'undefined' ? customText : '';
  if (typeof console !== 'undefined') {
    if (customText.length) {
      console.error(customText);
    }    
    console.error(textStatus);
  }
}

// Translates the strings to current language.
function t(stringToTranslate) {
  return stringToTranslate;
}

// Update current URI based on the data in the model.
function updateUri() {
  var uri = '#ggg';
  var model = lukewarmProfile().model;
  document.location = '#d';
}

// Show/hide ajax preloader.
function preloader(state) {
  if (state == 'show') {
    $('#preloader').show();
  } else {
    $('#preloader').hide();
  }
}

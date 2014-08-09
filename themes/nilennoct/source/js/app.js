require.config({
  paths: {
    jquery: '/lib/jquery/dist/jquery',
    underscore: '/lib/underscore-amd/underscore',
    backbone: '/lib/backbone-amd/backbone',
    'jquery.fancybox': '/lib/fancybox/source/jquery.fancybox.pack'
  },
  shim: {
    'jquery.fancybox': {
      deps: ['jquery'],
      exports: 'jQuery.fn.fancybox'
    }
  }
});

require(['jquery'], function($) {
  $(function() {
    wrapImg('article');

    $('#header-control').on('click', function() {
      $('#header').toggleClass('open');
    });

    $('#main-nav').on('click', 'a', function() {
      $('#header').removeClass('open');
    });

    if (typeof history.pushState !== 'undefined') {
      var $main = $('#main');
      var $mask = $('#loadingMask');
      var initState = {
        title: document.title,
        content: $main.html()
      };

      $('body').on('click', 'a', function(event) {
        var url = '';
        if (event.target.tagName === 'A') {
          url = event.target.href;
        }
        else {
          url = $(event.target).parents('a')[0].href;
        }
        if ( ! new RegExp(location.host).test(url)) {
          return;
        }
        if (location.href !== url) {
          $mask.addClass('show');
          $.get(url, function(html) {
            var $head = $(html.match(/<head[^>]*>[\s\S]*<\/head>/)[0]);
            var $body = $(html.match(/<body[^>]*>[\s\S]*<\/body>/)[0]);
            var state = {
              title: $head.filter('title').text(),
              content: $body.filter('#main').html()
            };
            $main.html(state.content).scrollTop(0);
            document.title = state.title;
            history.pushState(state, state.title, url);
            $mask.removeClass('show');
            wrapImg('article');
          });
        }

        event.preventDefault();
      });

      $(window).on('popstate', function(event) {
        var state = event.originalEvent.state || initState;
        $main.html(state.content).scrollTop(0);
        document.title = state.title;
      });
    }
  });
});

require(['jquery', 'jquery.fancybox'], function($) {
  $('.fancybox').fancybox();
});

function wrapImg(selector) {
  $(selector).find('img').each(function(index, element) {
    var $img = $(element);
    $img.wrap('<a class="fancybox" href="' + element.src + '" title="' + element.alt + '"></a>');
  });
}

if (false) {
  require(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    console.log("All scripts loaded.");

  });
}

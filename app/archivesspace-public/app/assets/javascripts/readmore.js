$.fn.readmore = function(idealCharCount) {
  var idealCharCount = idealCharCount || 300;
  var counter = 0;
  var offsetMinus = 0;
  var graphs = $("p", $(this));
  var breakPoint;

  var $that = $(this);

  if(graphs.length < 1)
    graphs = $(this);

  $that.addClass("readmore");

  $that.on("click", "a.expander", function(e) {
    e.preventDefault();
    var $a = $(e.target);
    var $elipses = $('.elipses', $that);

    $that.toggleClass("expanded");
    if($that.hasClass("expanded")) {
      $a.html("See less");
      $a.detach().appendTo($that);
      $elipses.empty();
    } else {
      $a.html("See more <i class='fa fa-chevron-right'></i>");
      $elipses.html("...");
    }
  });


  function parseGraphContent(innerHtml, result) {
    var match = innerHtml.match(/^([^<]+)</);
    if(match) {
      return parseGraphContent(innerHtml.replace(/^[^<]+</, '<'), result.concat([match[1]]));
    }

    match = innerHtml.match(/^(<[^>]+>[^<]+<\/[^>]+>)(.*)/)
    if(match) {
      return parseGraphContent(match[2], result.concat([match[1]]));
    }

    return result.concat([innerHtml]);
  }

  function findBreakPoint(innerHtml) {
    var niceBreakPoint;
    var offsetPlus = 0;

    if(counter + innerHtml.length < idealCharCount) {
      // no breakpoint here
      counter += innerHtml.length;
      return undefined;
    } else {
      var chunkedContent = parseGraphContent(innerHtml, []);
      _.forEach(chunkedContent, function(chunk) {
        if(chunk.match(/^</)) {
          if(!chunk.match(/>$\s*/))
             throw("bad markup in mixed content");

          var contentCount = chunk.replace(/^<[^>]+>/, '').replace(/<\/[^>]+>/, '').length
          offsetPlus += chunk.length - contentCount;
          counter += contentCount;
        } else if (counter + chunk.length < idealCharCount) {
          counter += chunk.length;
        } else {
          var bp = idealCharCount+offsetPlus-offsetMinus;
          niceBreakPoint = bp + innerHtml.substr(bp).split(" ")[0].length;
          return false;
        }
      });
    }

    return niceBreakPoint;
  }


  _.forEach(graphs, function(p) {
    offsetMinus = counter+0;;
    if(_.isUndefined(breakPoint)) {
      breakPoint = findBreakPoint($(p).html());
      if(breakPoint) {
        var origHtml = $(p).html();
        $(p).html("<span class='less'>"+origHtml.substr(0, breakPoint)+"<span class='elipses'>...</span></span><span class='more'>"+origHtml.substr(breakPoint)+"</span>");
        $that.append("<a href='#' class='expander'>See more <i class='fa fa-chevron-right'></i></a>");
      } else {
        $(p).addClass("less");
      }
    } else {
      $(p).addClass("more");
    }
  });

}

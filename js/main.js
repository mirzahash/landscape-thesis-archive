(function(){
  // reveal on scroll — safe default: content is visible unless JS adds .pre AND observes it
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.remove('pre'); });
  }

  // chapter rail active state
  var links = document.querySelectorAll('.rail a');
  var sections = Array.prototype.map.call(links, function(a){
    return document.getElementById(a.dataset.target);
  });
  if('IntersectionObserver' in window && links.length){
    var railIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var idx = sections.indexOf(entry.target);
        if(idx > -1 && entry.isIntersecting){
          links.forEach(function(l){ l.classList.remove('active'); });
          links[idx].classList.add('active');
        }
      });
    }, {rootMargin:'-40% 0px -50% 0px'});
    sections.forEach(function(s){ if(s) railIO.observe(s); });
  }

  // compare slider
  var range = document.getElementById('compareRange');
  var proposed = document.getElementById('compareProposed');
  var handle = document.getElementById('compareHandle');
  if(range){
    range.addEventListener('input', function(){
      var v = range.value;
      proposed.style.clipPath = 'inset(0 0 0 ' + v + '%)';
      handle.style.left = v + '%';
    });
  }
})();

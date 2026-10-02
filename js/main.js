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

  // Accessible image viewer, shared by thesis figures and comparison images.
  var images = document.querySelectorAll('.plate-img');
  if(images.length && typeof HTMLDialogElement !== 'undefined'){
    var viewer = document.createElement('dialog');
    viewer.className = 'image-viewer';
    viewer.setAttribute('aria-label', 'Enlarged image');
    viewer.innerHTML = '<div class="viewer-toolbar"><button type="button" class="viewer-close" autofocus>Close ×</button></div><div class="viewer-stage"><img class="viewer-image" alt="" role="button" tabindex="0" aria-pressed="false"></div><p class="viewer-caption"></p>';
    document.body.appendChild(viewer);
    var largeImage = viewer.querySelector('.viewer-image');
    var stage = viewer.querySelector('.viewer-stage');
    var caption = viewer.querySelector('.viewer-caption');
    var opener;
    var previousOverflow;
    function openImage(img, trigger){
      opener = trigger;
      largeImage.src = img.currentSrc || img.src;
      largeImage.alt = img.alt;
      var figure = img.closest('figure');
      var label = figure && figure.querySelector('figcaption');
      caption.textContent = label ? label.innerText : img.alt;
      stage.classList.remove('is-zoomed');
      largeImage.setAttribute('aria-label', img.alt + ' — click to zoom in');
      largeImage.setAttribute('aria-pressed', 'false');
      largeImage.title = 'Click to zoom in';
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      stage.scrollTop = stage.scrollLeft = 0;
    }
    viewer.querySelector('.viewer-close').addEventListener('click', function(){ viewer.close(); });
    viewer.addEventListener('click', function(e){
      if(e.target === viewer || e.target === stage) viewer.close();
    });
    viewer.addEventListener('close', function(){
      document.body.style.overflow = previousOverflow;
      if(opener) opener.focus({preventScroll:true});
    });
    function toggleZoom(){
      var expanded = stage.classList.toggle('is-zoomed');
      var action = expanded ? 'Click to zoom out' : 'Click to zoom in';
      largeImage.title = action;
      largeImage.setAttribute('aria-label', largeImage.alt + ' — ' + action);
      largeImage.setAttribute('aria-pressed', String(expanded));
      if(!expanded) stage.scrollTop = stage.scrollLeft = 0;
    }
    largeImage.addEventListener('click', toggleZoom);
    largeImage.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleZoom();
      }
    });
    images.forEach(function(img){
      var comparison = img.closest('.compare');
      if(comparison){
        var controls = comparison.nextElementSibling;
        if(!controls || !controls.classList.contains('compare-enlarge')){
          controls = document.createElement('div');
          controls.className = 'compare-enlarge';
          comparison.insertAdjacentElement('afterend', controls);
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = img.closest('.existing') ? 'Enlarge 2026 view' : 'Enlarge 2100 view';
        button.setAttribute('aria-label', 'Enlarge: ' + img.alt);
        button.setAttribute('aria-haspopup', 'dialog');
        button.addEventListener('click', function(){ openImage(img, button); });
        controls.appendChild(button);
      } else {
        var art = img.closest('.plate-art');
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'image-enlarge';
        button.setAttribute('aria-label', 'Enlarge: ' + img.alt);
        button.setAttribute('aria-haspopup', 'dialog');
        button.innerHTML = '<span aria-hidden="true">Enlarge ↗</span>';
        button.addEventListener('click', function(){ openImage(img, button); });
        art.appendChild(button);
      }
    });
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

(function(){
  var d=document;

  // menu mobilne
  var burger=d.getElementById('burger'), menu=d.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');d.body.style.overflow=''}
  if(burger){
    burger.addEventListener('click',function(){
      var otw=!menu.classList.contains('otw');
      menu.classList.toggle('otw',otw);burger.setAttribute('aria-expanded',String(otw));d.body.style.overflow=otw?'hidden':'';
    });
    menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij()});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});
  }

  // aktywna pozycja menu = bieżąca sekcja (tylko na stronie głównej)
  var linki=[].slice.call(menu.querySelectorAll('a[href^="#"]'));
  if(linki.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(wp){
      wp.forEach(function(w){
        var id=w.target.id==='o-mnie'||w.target.id==='kontakt'?w.target.id:w.target.id;
        if(w.isIntersecting){linki.forEach(function(a){if(a.getAttribute('href')==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    linki.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
    var hero=d.querySelector('.hero');
    if(hero)new IntersectionObserver(function(wp){if(wp[0].isIntersecting)linki.forEach(function(a){a.removeAttribute('aria-current')})},{rootMargin:'-40% 0px -55% 0px'}).observe(hero);
  }

  // przeciąganie myszą (palec działa natywnie przez przewijanie)
  function przeciagaj(el,klasaNa){
    var x0=0,s0=0,ciag=false,ruch=false;
    el.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button'))return;ciag=true;ruch=false;x0=e.clientX;s0=el.scrollLeft});
    window.addEventListener('pointermove',function(e){if(!ciag)return;var dx=e.clientX-x0;if(Math.abs(dx)>4){ruch=true;klasaNa.classList.add('ciag')}if(ruch){el.scrollLeft=s0-dx;e.preventDefault()}});
    window.addEventListener('pointerup',function(){
      if(!ciag)return;ciag=false;klasaNa.classList.remove('ciag');
      if(ruch&&el._snap)el._snap();
    });
    el.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false}},true);
    el.addEventListener('dragstart',function(e){e.preventDefault()});
  }

  // karuzele w kartach
  d.querySelectorAll('[data-kar]').forEach(function(k){
    var tor=k.querySelector('.tor'), n=tor.children.length, licz=k.querySelector('.licznik');
    var bl=k.querySelector('.kar-btn.l'), bp=k.querySelector('.kar-btn.p');
    function idx(){return Math.round(tor.scrollLeft/tor.clientWidth)}
    function idz(i){i=Math.max(0,Math.min(n-1,i));tor.scrollTo({left:i*tor.clientWidth,behavior:'smooth'})}
    function stan(){var i=idx();if(licz)licz.textContent=(i+1)+'/'+n;if(bl)bl.disabled=i===0;if(bp)bp.disabled=i===n-1}
    tor._snap=function(){idz(idx())};
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(stan)},{passive:true});
    k.querySelectorAll('.kar-btn').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();idz(idx()+ +b.dataset.k)})});
    k.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(idx()+1)}if(e.key==='ArrowLeft'){e.preventDefault();idz(idx()-1)}});
    przeciagaj(tor,k);
    stan();
  });

  // galeria
  var gal=d.getElementById('gal');
  if(gal){
    przeciagaj(gal,gal);
    function krok(k){var f=gal.querySelector('figure');gal.scrollBy({left:k*(f?f.getBoundingClientRect().width+16:320),behavior:'smooth'})}
    d.querySelectorAll('[data-gal]').forEach(function(b){b.addEventListener('click',function(){krok(+b.dataset.gal)})});
    gal.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();krok(1)}if(e.key==='ArrowLeft'){e.preventDefault();krok(-1)}});
  }

  // kraje: filtr kontynentów + zwijana lista krajów bez wpisów
  var bez=d.getElementById('kafleBez');
  if(bez){
    var btn=d.createElement('button');btn.className='btn-obrys';btn.type='button';btn.setAttribute('aria-controls','kafleBez');
    var ileBez=bez.children.length;
    function opis(){var z=bez.classList.contains('zwin');btn.textContent=z?'Pokaż wszystkie kraje z listy':'Zwiń listę';btn.setAttribute('aria-expanded',String(!z))}
    bez.classList.add('zwin');bez.parentNode.insertBefore(btn,bez.nextSibling);opis();
    btn.addEventListener('click',function(){bez.classList.toggle('zwin');opis()});
    d.querySelectorAll('.filtr').forEach(function(f){
      f.addEventListener('click',function(){
        var k=f.dataset.f;
        d.querySelectorAll('.filtr').forEach(function(x){x.setAttribute('aria-pressed',String(x===f))});
        d.querySelectorAll('.kafel').forEach(function(t){t.hidden=!!k&&t.dataset.k!==k});
        var widoczne=[].filter.call(bez.children,function(t){return !t.hidden}).length;
        if(k){bez.classList.remove('zwin');btn.hidden=true}else{bez.classList.add('zwin');btn.hidden=false;opis()}
        bez.hidden=widoczne===0;
        var ma=d.getElementById('kafleMa');ma.hidden=![].some.call(ma.children,function(t){return !t.hidden});
      });
    });
  }

  // formularz pokazowy, bez wysyłki
  var f=d.getElementById('form');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();d.getElementById('formInfo').hidden=false});

  var rok=d.getElementById('rok');if(rok)rok.textContent=new Date().getFullYear();
})();

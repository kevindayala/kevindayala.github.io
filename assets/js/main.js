(function ($) {
  'use strict';

  /*
  |--------------------------------------------------------------------------
  | Template Name: Partosa
  | Author: Laralink
  | Version: 1.0.0
  |--------------------------------------------------------------------------
  |--------------------------------------------------------------------------
  | TABLE OF CONTENTS:
  |--------------------------------------------------------------------------
  |
  | 1. Preloader
  | 2. Mobile Menu
  | 3. Sticky Header
  | 4. Dynamic Background
  | 5. Modal Video
  | 6. Review
  | 7. Hobble Effect
  | 8. Portfolio Modal
  | 9. Scroll Progress Bar
  | 10. Counters
  | 11. Timeline Progress
  | 12. Hero Title Reveal
  | 13. Cursor Animation
  |
  */

  // Respeta la preferencia del sistema de movimiento reducido (WCAG 2.3.3)
  var reducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Solo punteros finos: evita efectos inútiles o erráticos en táctil
  var finePointer =
    window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /*--------------------------------------------------------------
    Scripts initialization
  --------------------------------------------------------------*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on('load', function () {
    preloader();
  });

  $(function () {
    mainNav();
    stickyHeader();
    dynamicBackground();
    modalVideo();
    review();
    hobbleEffect();
    portfolioModal();
    scrollProgress();
    counters();
    timelineProgress();
    heroTitleReveal();
    stackMarquee();
    revealWhatsApp();
    revealEmail();
    heroAurora();
    heroParallax();
    scrollReveal();
    if ($.exists('.wow') && !reducedMotion) {
      new WOW().init();
    }
  });

  $(window).on('resize', function () {
    clearTimeout(window._stackMarqueeTimer);
    window._stackMarqueeTimer = setTimeout(stackMarquee, 200);
  });

  /*--------------------------------------------------------------
    1. Preloader
  --------------------------------------------------------------*/
  function preloader() {
    $('.cs_preloader_in').fadeOut();
    $('.cs_preloader').delay(150).fadeOut('slow');
  }

  /*--------------------------------------------------------------
    2. Mobile Menu
  --------------------------------------------------------------*/
  function mainNav() {
    $('.cs_nav').append('<span class="cs_menu_toggle"><span></span></span>');
    $('.menu-item-has-children').append(
      '<span class="cs_menu_dropdown_toggle"><span></span></span>',
    );
    function setNavOpen(isOpen) {
      $('body').toggleClass('cs_nav_open', isOpen);
    }
    $('.cs_menu_toggle').on('click', function () {
      $(this)
        .toggleClass('cs_toggle_active')
        .siblings('.cs_nav_list')
        .toggleClass('cs_active');
      setNavOpen($(this).hasClass('cs_toggle_active'));
    });
    $('.cs_nav_list a').on('click', function () {
      $('.cs_nav_list').removeClass('cs_active');
      $('.cs_menu_toggle').removeClass('cs_toggle_active');
      setNavOpen(false);
    });
    $('.cs_menu_toggle')
      .parents('body')
      .find('.cs_side_header')
      .addClass('cs_has_main_nav');
    $('.cs_menu_dropdown_toggle').on('click', function () {
      $(this).toggleClass('active').siblings('ul').slideToggle();
      $(this).parent().toggleClass('active');
    });
  }

  /*--------------------------------------------------------------
    3. Sticky Header
  --------------------------------------------------------------*/
  function stickyHeader() {
    var $window = $(window);
    var lastScrollTop = 0;
    var $header = $('.cs_sticky_header');
    var headerHeight = $header.outerHeight() + 30;

    $window.scroll(function () {
      var windowTop = $window.scrollTop();

      if (windowTop >= headerHeight) {
        $header.addClass('cs_gescout_sticky');
      } else {
        $header.removeClass('cs_gescout_sticky');
        $header.removeClass('cs_gescout_show');
      }

      if ($header.hasClass('cs_gescout_sticky')) {
        if (windowTop < lastScrollTop) {
          $header.addClass('cs_gescout_show');
        } else {
          $header.removeClass('cs_gescout_show');
        }
      }

      lastScrollTop = windowTop;
    });
  }

  /*--------------------------------------------------------------
    4. Dynamic Background
  --------------------------------------------------------------*/
  function dynamicBackground() {
    $('[data-src]').each(function () {
      var src = $(this).attr('data-src');
      $(this).css({
        'background-image': 'url(' + src + ')',
      });
    });
  }

  /*--------------------------------------------------------------
    5. Modal Video
  --------------------------------------------------------------*/
  function modalVideo() {
    if ($.exists('.cs_video_open')) {
      $('body').append(`
        <div class="cs_video_popup">
          <div class="cs_video_popup-overlay"></div>
          <div class="cs_video_popup-content">
            <div class="cs_video_popup-layer"></div>
            <div class="cs_video_popup_container">
              <div class="cs_video_popup-align">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="about:blank"></iframe>
                </div>
              </div>
              <div class="cs_video_popup_close"></div>
            </div>
          </div>
        </div>
      `);
      $(document).on('click', '.cs_video_open', function (e) {
        e.preventDefault();
        var video = $(this).attr('href');

        $('.cs_video_popup_container iframe').attr('src', `${video}`);

        $('.cs_video_popup').addClass('active');
      });
      $('.cs_video_popup_close, .cs_video_popup-layer').on(
        'click',
        function (e) {
          $('.cs_video_popup').removeClass('active');
          $('html').removeClass('overflow-hidden');
          $('.cs_video_popup_container iframe').attr('src', 'about:blank');
          e.preventDefault();
        },
      );
    }
  }

  /*--------------------------------------------------------------
    6. Review
  --------------------------------------------------------------*/
  function review() {
    $('.cs_rating').each(function () {
      var review = $(this).data('rating');
      var reviewVal = review * 20 + '%';
      $(this).find('.cs_rating_percentage').css('width', reviewVal);
    });
  }

  /*--------------------------------------------------------------
    7. Hobble Effect
  --------------------------------------------------------------*/
  function hobbleEffect() {
    if (!finePointer || reducedMotion) return;
    $(document)
      .on('mousemove', '.cs_hobble', function (event) {
        var halfW = this.clientWidth / 2;
        var halfH = this.clientHeight / 2;
        var coorX = halfW - (event.pageX - $(this).offset().left);
        var coorY = halfH - (event.pageY - $(this).offset().top);
        var degX1 = (coorY / halfH) * 8 + 'deg';
        var degY1 = (coorX / halfW) * -8 + 'deg';
        var degX3 = (coorY / halfH) * -15 + 'px';
        var degY3 = (coorX / halfW) * 15 + 'px';

        $(this)
          .find('.cs_hover_layer_1')
          .css('transform', function () {
            return (
              'perspective( 800px ) translate3d( 0, 0, 0 ) rotateX(' +
              degX1 +
              ') rotateY(' +
              degY1 +
              ')'
            );
          });
        $(this)
          .find('.cs_hover_layer_2')
          .css('transform', function () {
            return (
              'perspective( 800px ) translateX(' +
              degX3 +
              ') translateY(' +
              degY3 +
              ') scale(1.04)'
            );
          });
      })
      .on('mouseout', '.cs_hobble', function () {
        $(this).find('.cs_hover_layer_1').removeAttr('style');
        $(this).find('.cs_hover_layer_2').removeAttr('style');
      });
  }

  /*--------------------------------------------------------------
    8. Portfolio project modal
  --------------------------------------------------------------*/
  function portfolioModal() {
    var modal = document.getElementById('cs_project_modal');
    if (!modal) return;

    var titleEl = document.getElementById('cs_project_modal_title');
    var taglineEl = document.getElementById('cs_project_modal_tagline');
    var galleryEl = document.getElementById('cs_project_modal_gallery');
    var bodyEl = document.getElementById('cs_project_modal_body');
    var dialog = modal.querySelector('.cs_project_modal_dialog');
    var fs = document.getElementById('cs_project_fs');
    var fsImg = document.getElementById('cs_project_fs_img');
    var fsCounter = document.getElementById('cs_project_fs_counter');
    var lastFocus = null;
    var slideIndex = 0;
    var slideTotal = 0;
    var slideSources = [];
    var fsOpen = false;

    function setSlide(index) {
      if (!slideTotal) return;
      slideIndex = (index + slideTotal) % slideTotal;

      var track = galleryEl.querySelector('.cs_project_slider_track');
      var dots = galleryEl.querySelectorAll('.cs_project_slider_dot');
      var thumbs = galleryEl.querySelectorAll('.cs_project_slider_thumb');
      var counter = galleryEl.querySelector('.cs_project_slider_counter');

      if (track) {
        track.style.transform = 'translate3d(' + (-slideIndex * 100) + '%,0,0)';
      }
      Array.prototype.forEach.call(dots, function (dot, i) {
        dot.classList.toggle('is-active', i === slideIndex);
        dot.setAttribute('aria-current', i === slideIndex ? 'true' : 'false');
      });
      Array.prototype.forEach.call(thumbs, function (thumb, i) {
        thumb.classList.toggle('is-active', i === slideIndex);
      });
      if (counter) {
        counter.textContent = slideIndex + 1 + ' / ' + slideTotal;
      }
    }

    function openFullscreen(index) {
      if (!fs || !fsImg || !slideSources.length) return;
      slideIndex = (index + slideTotal) % slideTotal;
      setSlide(slideIndex);
      fsImg.src = slideSources[slideIndex].src;
      fsImg.alt = slideSources[slideIndex].alt || '';
      if (fsCounter) {
        fsCounter.textContent = slideIndex + 1 + ' / ' + slideTotal;
        fsCounter.hidden = slideTotal < 2;
      }
      fs.classList.toggle('is-single', slideTotal < 2);
      fs.hidden = false;
      fs.setAttribute('aria-hidden', 'false');
      fsOpen = true;
    }

    function closeFullscreen() {
      if (!fs || !fsOpen) return;
      fs.hidden = true;
      fs.setAttribute('aria-hidden', 'true');
      fsOpen = false;
      if (fsImg) {
        fsImg.removeAttribute('src');
        fsImg.alt = '';
      }
    }

    function buildSlider(images) {
      galleryEl.innerHTML = '';
      slideTotal = images.length;
      slideIndex = 0;
      slideSources = images.map(function (img) {
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' };
      });
      if (!slideTotal) {
        galleryEl.hidden = true;
        return;
      }
      galleryEl.hidden = false;

      var slider = document.createElement('div');
      slider.className = 'cs_project_slider' + (slideTotal === 1 ? ' is-single' : '');

      var viewport = document.createElement('div');
      viewport.className = 'cs_project_slider_viewport';

      var track = document.createElement('div');
      track.className = 'cs_project_slider_track';

      images.forEach(function (img, i) {
        var slide = document.createElement('div');
        slide.className = 'cs_project_slider_slide';
        var clone = img.cloneNode(true);
        clone.loading = i === 0 ? 'eager' : 'lazy';
        clone.draggable = false;
        clone.style.cursor = 'zoom-in';
        clone.setAttribute('role', 'button');
        clone.setAttribute('tabindex', '0');
        clone.setAttribute('aria-label', 'Ver en pantalla completa');
        clone.addEventListener('click', function () {
          openFullscreen(i);
        });
        clone.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFullscreen(i);
          }
        });
        slide.appendChild(clone);
        track.appendChild(slide);
      });
      viewport.appendChild(track);
      slider.appendChild(viewport);

      if (slideTotal > 1) {
        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'cs_project_slider_nav cs_project_slider_prev';
        prev.setAttribute('aria-label', 'Imagen anterior');
        prev.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
        prev.addEventListener('click', function () {
          setSlide(slideIndex - 1);
        });

        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'cs_project_slider_nav cs_project_slider_next';
        next.setAttribute('aria-label', 'Imagen siguiente');
        next.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';
        next.addEventListener('click', function () {
          setSlide(slideIndex + 1);
        });

        var counter = document.createElement('div');
        counter.className = 'cs_project_slider_counter';
        counter.textContent = '1 / ' + slideTotal;

        var dots = document.createElement('div');
        dots.className = 'cs_project_slider_dots';
        images.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'cs_project_slider_dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
          if (i === 0) dot.setAttribute('aria-current', 'true');
          dot.addEventListener('click', function () {
            setSlide(i);
          });
          dots.appendChild(dot);
        });

        var thumbs = document.createElement('div');
        thumbs.className = 'cs_project_slider_thumbs';
        images.forEach(function (img, i) {
          var thumb = document.createElement('button');
          thumb.type = 'button';
          thumb.className = 'cs_project_slider_thumb' + (i === 0 ? ' is-active' : '');
          thumb.setAttribute('aria-label', 'Miniatura ' + (i + 1));
          var thumbImg = img.cloneNode(true);
          thumbImg.loading = 'lazy';
          thumbImg.alt = '';
          thumb.appendChild(thumbImg);
          thumb.addEventListener('click', function () {
            setSlide(i);
          });
          thumbs.appendChild(thumb);
        });

        slider.appendChild(prev);
        slider.appendChild(next);
        slider.appendChild(counter);
        slider.appendChild(dots);
        galleryEl.appendChild(slider);
        galleryEl.appendChild(thumbs);

        var startX = 0;
        var deltaX = 0;
        viewport.addEventListener(
          'touchstart',
          function (e) {
            startX = e.touches[0].clientX;
            deltaX = 0;
          },
          { passive: true }
        );
        viewport.addEventListener(
          'touchmove',
          function (e) {
            deltaX = e.touches[0].clientX - startX;
          },
          { passive: true }
        );
        viewport.addEventListener('touchend', function () {
          if (Math.abs(deltaX) < 40) return;
          if (deltaX < 0) setSlide(slideIndex + 1);
          else setSlide(slideIndex - 1);
        });
      } else {
        galleryEl.appendChild(slider);
      }

      setSlide(0);
    }

    function openModal(projectId) {
      var tpl = document.getElementById('project-' + projectId);
      if (!tpl) return;

      var meta = tpl.content.querySelector('[data-title]');
      var gallery = tpl.content.querySelector('[data-gallery]');
      var body = tpl.content.querySelector('[data-body]');

      titleEl.textContent = meta ? meta.getAttribute('data-title') : '';
      taglineEl.textContent = meta ? meta.getAttribute('data-tagline') || '' : '';

      buildSlider(gallery ? Array.prototype.slice.call(gallery.querySelectorAll('img')) : []);

      bodyEl.innerHTML = '';
      if (body) {
        Array.prototype.forEach.call(body.children, function (node) {
          bodyEl.appendChild(node.cloneNode(true));
        });
      }

      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('cs_project_modal_open');
      if (dialog) dialog.focus();
    }

    function closeModal() {
      closeFullscreen();
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('cs_project_modal_open');
      galleryEl.innerHTML = '';
      bodyEl.innerHTML = '';
      slideTotal = 0;
      slideIndex = 0;
      slideSources = [];
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.cs_portfolio_trigger');
      if (trigger) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-project'));
        return;
      }
      if (e.target.closest('[data-project-close]')) {
        closeModal();
        return;
      }
      if (e.target.closest('[data-fs-close]') && !e.target.closest('#cs_project_fs_img')) {
        closeFullscreen();
        return;
      }
      if (e.target.closest('[data-fs-prev]')) {
        openFullscreen(slideIndex - 1);
        return;
      }
      if (e.target.closest('[data-fs-next]')) {
        openFullscreen(slideIndex + 1);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (fsOpen) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          closeFullscreen();
          return;
        }
        if (slideTotal > 1) {
          if (e.key === 'ArrowLeft') openFullscreen(slideIndex - 1);
          if (e.key === 'ArrowRight') openFullscreen(slideIndex + 1);
        }
        return;
      }
      if (modal.hidden) return;
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (slideTotal < 2) return;
      if (e.key === 'ArrowLeft') setSlide(slideIndex - 1);
      if (e.key === 'ArrowRight') setSlide(slideIndex + 1);
    });
  }
  /*--------------------------------------------------------------
    9. Scroll Progress Bar
  --------------------------------------------------------------*/
  function scrollProgress() {
    var $bar = $('.cs_scroll_progress span');
    if (!$bar.length) return;
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      $bar.css('width', pct + '%');
      ticking = false;
    }

    $(window).on('scroll resize', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });
    update();
  }

  /*--------------------------------------------------------------
    10. Counters
  --------------------------------------------------------------*/
  function counters() {
    var nodes = document.querySelectorAll('.cs_counter');
    if (!nodes.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      var duration = 1600;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // easeOutExpo: arranca rapido y frena, se lee mejor
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, run);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          io.unobserve(entry.target); // una sola vez
        });
      },
      { threshold: 0.6 },
    );
    Array.prototype.forEach.call(nodes, function (n) {
      io.observe(n);
    });
  }

  /*--------------------------------------------------------------
    11. Timeline Progress
  --------------------------------------------------------------*/
  function timelineProgress() {
    var $timelines = $('.cs_timeline');
    if (!$timelines.length || reducedMotion) return;
    $timelines.addClass('cs_timeline_active');
    var ticking = false;

    function update() {
      $timelines.each(function () {
        var rect = this.getBoundingClientRect();
        var trigger = window.innerHeight * 0.75;
        // 0 cuando el bloque entra por abajo, 1 cuando termina de pasar
        var pct = ((trigger - rect.top) / rect.height) * 100;
        pct = Math.max(0, Math.min(100, pct));
        this.style.setProperty('--cs-timeline-progress', pct + '%');
      });
      ticking = false;
    }

    $(window).on('scroll resize', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });
    update();
  }

  /*--------------------------------------------------------------
    12. Hero Title Reveal
  --------------------------------------------------------------*/
  function heroTitleReveal() {
    var el = document.querySelector('.cs_split_text');
    if (!el || reducedMotion || typeof gsap === 'undefined') return;

    // Envuelve cada palabra en dos spans: mascara + contenido
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var mask = document.createElement('span');
      mask.className = 'cs_word_mask';
      var inner = document.createElement('span');
      inner.className = 'cs_word';
      inner.textContent = w;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });

    // GSAP guarda "y" (px) y "yPercent" por separado. Al leer el
    // translateY(110%) del CSS lo interpreta como y=118px, asi que hay que
    // fijar y:0 explicitamente o el desplazamiento inicial nunca se deshace.
    gsap.fromTo(
      el.querySelectorAll('.cs_word'),
      { yPercent: 110, y: 0, opacity: 0 },
      {
        yPercent: 0,
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.25,
      },
    );
  }

  /*--------------------------------------------------------------
    14b. WhatsApp ofuscado (evita scrapers de números en HTML)
  --------------------------------------------------------------*/
  // El correo va en base64 para que los scrapers simples no lo lean del HTML.
  // Sin JS queda visible como "kevin... (arroba) gmail.com": legible por una
  // persona, pero no como un mailto listo para recolectar.
  function revealEmail() {
    if (!$.exists('.js-mail')) return;

    $('.js-mail').each(function () {
      var $el = $(this);
      var encoded = $el.attr('data-mail');
      if (!encoded) return;

      try {
        var mail = atob(encoded);
        $el.attr('href', 'mailto:' + mail);
        $el.find('.js-mail-text').text(mail);
      } catch (e) {
        $el.attr('href', '#contact');
      }
    });
  }

  function revealWhatsApp() {
    if (!$.exists('.js-whatsapp')) return;

    $('.js-whatsapp').each(function () {
      var $el = $(this);
      var encoded = $el.attr('data-wa');
      if (!encoded) return;

      try {
        var number = atob(encoded);
        var url = 'https://wa.me/' + number;
        $el.attr('href', url);
        $el.attr('target', '_blank');
      } catch (e) {
        $el.attr('href', '#contact');
      }
    });
  }

  /*--------------------------------------------------------------
    14. Stack Marquee (loop continuo sin cortes)
  --------------------------------------------------------------*/
  function stackMarquee() {
    if (!$.exists('.cs_stack_slider')) return;

    $('.cs_stack_slider').each(function () {
      var $slider = $(this);
      var $track = $slider.find('.cs_stack_slider_in').first();
      if (!$track.length) return;

      var $source = $track.children('.cs_moving_text').first();
      if (!$source.length) return;

      // Restaura el set original (sin clones previos de JS)
      if ($source.data('stack-original')) {
        $source.html($source.data('stack-original'));
      } else {
        $source.data('stack-original', $source.html());
      }

      $track.children('.cs_moving_text').slice(1).remove();

      var originalHtml = $source.data('stack-original');
      var containerW = $slider.width();
      var guard = 0;

      // Repite ítems hasta llenar al menos el ancho del contenedor
      while ($source.outerWidth(true) < containerW + 40 && guard < 12) {
        $source.append(originalHtml);
        guard++;
      }

      // Segundo set idéntico → el -50% del CSS hace el loop sin saltos
      $source.clone().attr('aria-hidden', 'true').appendTo($track);
    });
  }

  /*--------------------------------------------------------------
    14. Hero Aurora (canvas)
  --------------------------------------------------------------*/
  function heroAurora() {
    var wrap = document.querySelector('.cs_hero_aurora');
    var canvas = wrap && wrap.querySelector('.cs_hero_aurora_canvas');
    if (!wrap || !canvas || reducedMotion) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var mqMobile = window.matchMedia('(max-width: 991px)');

    var ribbonsDesktop = [
      { y: 0.16, amp: 0.12, thick: 0.24, speed: 0.216, phase: 0.0, hue: [62, 207, 106], alpha: 0.42 },
      { y: 0.26, amp: 0.15, thick: 0.2, speed: 0.168, phase: 1.7, hue: [168, 240, 184], alpha: 0.34 },
      { y: 0.2, amp: 0.11, thick: 0.28, speed: 0.132, phase: 3.2, hue: [31, 163, 74], alpha: 0.38 },
      { y: 0.36, amp: 0.14, thick: 0.18, speed: 0.24, phase: 4.8, hue: [105, 229, 132], alpha: 0.3 },
      { y: 0.12, amp: 0.1, thick: 0.16, speed: 0.108, phase: 2.4, hue: [13, 107, 50], alpha: 0.32 },
    ];
    /* Menos cintas y m?s visibles en mobile */
    var ribbonsMobile = [
      { y: 0.14, amp: 0.14, thick: 0.28, speed: 0.18, phase: 0.0, hue: [62, 207, 106], alpha: 0.5 },
      { y: 0.24, amp: 0.16, thick: 0.22, speed: 0.14, phase: 1.7, hue: [168, 240, 184], alpha: 0.42 },
      { y: 0.18, amp: 0.12, thick: 0.3, speed: 0.11, phase: 3.2, hue: [31, 163, 74], alpha: 0.46 },
      { y: 0.32, amp: 0.13, thick: 0.2, speed: 0.2, phase: 4.8, hue: [105, 229, 132], alpha: 0.36 },
    ];

    var ribbons = ribbonsDesktop;
    var dpr = 1;
    var w = 0;
    var h = 0;
    var running = false;
    var visible = true;
    var raf = 0;
    var start = performance.now();
    var timeScale = 1;

    function applyProfile() {
      if (mqMobile.matches) {
        ribbons = ribbonsMobile;
        timeScale = 0.85;
      } else {
        ribbons = ribbonsDesktop;
        timeScale = 1;
      }
    }

    function resize() {
      var rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, mqMobile.matches ? 1.25 : 1.75);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawRibbon(r, t) {
      var baseY = h * r.y + Math.sin(t * 0.55 + r.phase) * h * 0.035;
      var amp = h * r.amp;
      var thick = h * r.thick;
      var steps = Math.max(mqMobile.matches ? 32 : 48, Math.floor(w / (mqMobile.matches ? 16 : 12)));
      var pulse = 0.75 + 0.25 * Math.sin(t * 1.1 + r.phase);
      var alpha = r.alpha * pulse;
      var drift = t * r.speed * 0.35;
      var grad = ctx.createLinearGradient(0, baseY - thick, 0, baseY + thick);
      var c = r.hue;
      grad.addColorStop(0, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');
      grad.addColorStop(0.35, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')');
      grad.addColorStop(0.55, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha * 0.85 + ')');
      grad.addColorStop(1, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');

      ctx.beginPath();
      for (var i = 0; i <= steps; i++) {
        var x = (i / steps) * w;
        var nx = i / steps;
        var wave =
          Math.sin(nx * Math.PI * 2.6 + t * r.speed + r.phase + drift) * amp +
          Math.sin(nx * Math.PI * 5.2 - t * r.speed * 1.35 + r.phase) * amp * 0.45 +
          Math.sin(t * 0.9 + r.phase + nx * 2) * amp * 0.35;
        var y = baseY + wave;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (var j = steps; j >= 0; j--) {
        var x2 = (j / steps) * w;
        var nx2 = j / steps;
        var wave2 =
          Math.sin(nx2 * Math.PI * 2.6 + t * r.speed + r.phase + drift) * amp +
          Math.sin(nx2 * Math.PI * 5.2 - t * r.speed * 1.35 + r.phase) * amp * 0.45 +
          Math.sin(t * 0.9 + r.phase + nx2 * 2) * amp * 0.35;
        var y2 = baseY + wave2 + thick * (0.55 + 0.28 * Math.sin(nx2 * 3.4 + t * 0.85));
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function frame(now) {
      if (!running) return;
      var t = ((now - start) / 1000) * timeScale;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < ribbons.length; i++) {
        drawRibbon(ribbons[i], t);
      }
      ctx.globalCompositeOperation = 'source-over';

      var veil = ctx.createLinearGradient(0, 0, 0, h);
      veil.addColorStop(0, 'rgba(105, 229, 132, 0.05)');
      veil.addColorStop(0.45, 'rgba(0, 0, 0, 0)');
      veil.addColorStop(1, 'rgba(21, 21, 21, 0.15)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (running || !visible) return;
      running = true;
      start = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stopLoop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function syncMode() {
      applyProfile();
      resize();
      if (visible && !document.hidden) startLoop();
    }

    syncMode();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncMode, 120);
    });
    if (mqMobile.addEventListener) {
      mqMobile.addEventListener('change', syncMode);
    } else if (mqMobile.addListener) {
      mqMobile.addListener(syncMode);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          visible = entries[0] && entries[0].isIntersecting;
          if (visible) startLoop();
          else stopLoop();
        },
        { threshold: 0.05 }
      );
      io.observe(wrap.closest('.cs_hero') || wrap);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopLoop();
      else if (visible) startLoop();
    });
  }

  /*--------------------------------------------------------------
    15. Hero Parallax (scroll)
  --------------------------------------------------------------*/
  function heroParallax() {
    if (reducedMotion) return;
    var hero = document.querySelector('.cs_hero.cs_style_1');
    if (!hero) return;

    var aurora = hero.querySelector('.cs_hero_aurora');
    var text = hero.querySelector('.cs_hero_text');
    var imgWrap = hero.querySelector('.cs_hero_img');
    var light = hero.querySelector('.cs_hero_light');
    var social = hero.querySelector('.cs_hero_social_btns');
    var ticking = false;
    var mq = window.matchMedia('(min-width: 1200px)');

    function clear() {
      if (aurora) aurora.style.transform = '';
      if (text) {
        text.style.transform = '';
        text.style.opacity = '';
      }
      if (imgWrap) imgWrap.style.transform = '';
      if (light) light.style.transform = '';
      if (social) social.style.transform = '';
    }

    function update() {
      if (!mq.matches) {
        clear();
        ticking = false;
        return;
      }

      var rect = hero.getBoundingClientRect();
      var progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.85, 1)));

      // Capas a distinta velocidad = profundidad
      if (aurora) {
        aurora.style.transform = 'translate3d(0,' + (progress * 120) + 'px,0) scale(' + (1 + progress * 0.06) + ')';
      }
      if (text) {
        text.style.transform = 'translate3d(0,' + (progress * 55) + 'px,0)';
        text.style.opacity = String(1 - progress * 0.65);
      }
      if (imgWrap) {
        imgWrap.style.transform =
          'translate3d(0,' + (progress * 140) + 'px,0) scale(' + (1 - progress * 0.04) + ')';
      }
      if (light) {
        light.style.transform =
          'translateX(-50%) translate3d(0,' + (progress * 90) + 'px,0) scale(' + (1 + progress * 0.1) + ')';
      }
      if (social) {
        social.style.transform =
          'translateY(-50%) translate3d(0,' + (progress * 40) + 'px,0)';
        social.style.opacity = String(1 - progress * 0.8);
      }

      ticking = false;
    }

    $(window).on('scroll resize', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });
    update();
  }

  /*--------------------------------------------------------------
    16. Scroll Reveal
  --------------------------------------------------------------*/
  function scrollReveal() {
    var nodes = document.querySelectorAll('.cs_reveal, .cs_reveal_media');
    if (!nodes.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );

    Array.prototype.forEach.call(nodes, function (el) {
      io.observe(el);
    });
  }

  /*--------------------------------------------------------------
    13. Cursor Animation
    Solo en punteros finos: en tactil no aporta nada y en movimiento
    reducido resulta molesto.
  --------------------------------------------------------------*/
  $(function () {
    if (!finePointer || reducedMotion || typeof gsap === 'undefined') return;

    $('body').append('<span class="cs_cursor_lg"></span>');
    $('body').append('<span class="cs_cursor_sm"></span>');

    var hoverTargets =
      '.cs_text_btn, .cs_site_header, .cs_down_btn, .cs_social_btns a, .cs_menu_widget';
    $(document)
      .on('mouseenter', hoverTargets, function () {
        $('.cs_cursor_lg, .cs_cursor_sm').addClass('opacity-0');
      })
      .on('mouseleave', hoverTargets, function () {
        $('.cs_cursor_lg, .cs_cursor_sm').removeClass('opacity-0');
      });

    document.addEventListener('mousemove', function (event) {
      gsap.to('.cs_cursor_lg', {
        x: event.clientX,
        y: event.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.35,
        ease: 'power2.out',
      });
      gsap.to('.cs_cursor_sm', {
        x: event.clientX,
        y: event.clientY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.12,
        ease: 'power2.out',
      });
    });
  });
})(jQuery); // End of use strict

// Переключение темы (выполняется сразу, до готовности DOM, чтобы меньше мигало)
(function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

$(document).ready(function() {

    // Переключатель темы
    function applyThemeIcon(theme) {
        $('#themeToggle').html(theme === 'dark' ? '&#9728;' : '&#9789;');
    }

    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyThemeIcon(currentTheme);

    $('.js-theme-toggle').click(function() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        applyThemeIcon(currentTheme);
    });

    // Выпадающее меню
    $('.js-nav-toggle').click(function() {
        $('.js-nav-list').slideToggle();
    });

    // скролл и подсветка активного пункта меню
    $('.js-nav-link').click(function(e) {
        e.preventDefault();
        let target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 60
        }, 600);

        if ($(window).width() < 768) {
            $('.js-nav-list').slideUp();
        }
    });

    $(window).scroll(function() {
        let scrollPos = $(window).scrollTop();

        // Кнопка наверх
        if (scrollPos > 300) {
            $('#backToTop').fadeIn();
        } else {
            $('#backToTop').fadeOut();
        }

        // Подсветка меню
        $('.js-section').each(function() {
            let top = $(this).offset().top - 100;
            let bottom = top + $(this).outerHeight();
            if (scrollPos >= top && scrollPos <= bottom) {
                $('.js-nav-link').removeClass('nav__link--active');
                $('.js-nav-link[href="#' + $(this).attr('id') + '"]').addClass('nav__link--active');
            }
        });
    });

    // Кнопка Вверх
    $('#backToTop').click(function() {
        $('html, body').animate({scrollTop: 0}, 600);
    });

    // динамическая галерея
    $.getJSON('data/portfolio.json', function(data) {
        let html = '';
        $.each(data, function(index, item) {
            html += `
            <div class="portfolio-card" style="display:none;">
                <img class="portfolio-card__image" src="${item.img}" alt="${item.title}">
                <div class="portfolio-card__body">
                    <h3 class="portfolio-card__title">${item.title}</h3>
                    <p class="portfolio-card__text">${item.desc}</p>
                </div>
            </div>`;
        });
        $('#portfolio-container').html(html);
        $('.portfolio-card').fadeIn(1000); // Анимация появления
    }).fail(function() {
        $('#portfolio-container').html('<p>Ошибка загрузки данных портфолио.</p>');
    });

    // Модальное окно
    $('#openModalBtn').click(function() {
        $('#contactModal').fadeIn();
    });

    $('.js-modal-close, #contactModal').click(function(e) {
        if (e.target === this) {
            $('#contactModal').fadeOut();
            $('#contactForm')[0].reset();
            $('.js-form-message').text('');
        }
    });

    // Валидация и симуляция отправки формы AJAX
    $('#contactForm').submit(function(e) {
        e.preventDefault();

        let name = $('#name').val().trim();
        let email = $('#email').val().trim();
        let msg = $('#message').val().trim();
        let $msgBox = $('.js-form-message');
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === '' || email === '' || msg === '') {
            $msgBox.text('Заполните все поля').removeClass('form__message--success').addClass('form__message--error');
            return;
        }

        if (!emailRegex.test(email)) {
            $msgBox.text('Введите корректный Email').removeClass('form__message--success').addClass('form__message--error');
            return;
        }

        $msgBox.text('Отправка...').removeClass('form__message--error form__message--success');
        let $btn = $('.js-submit-btn');
        $btn.prop('disabled', true);

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            data: { name: name, email: email, message: msg },
            success: function() {
                $msgBox.text('Успешно отправлено!').removeClass('form__message--error').addClass('form__message--success');
                $('#contactForm')[0].reset();
            },
            error: function() {
                $msgBox.text('Ошибка сервера.').removeClass('form__message--success').addClass('form__message--error');
            },
            complete: function() {
                $btn.prop('disabled', false);
                setTimeout(() => { $('#contactModal').fadeOut(); $msgBox.text(''); }, 3000);
            }
        });
    });

    // Карусель навыков
    let currentSlide = 0;

    function updateCarousel() {
        let slideWidth;
        if ($(window).width() >= 1024) slideWidth = 4;
        else if ($(window).width() >= 768) slideWidth = 2;
        else slideWidth = 1;

        let totalCards = $('.js-skill-card').length;
        let maxSlide = totalCards - slideWidth;

        if (currentSlide > maxSlide) currentSlide = 0;
        if (currentSlide < 0) currentSlide = maxSlide;

        let percentage;
        if (slideWidth === 1) {
            percentage = -(currentSlide * 100);
        } else if (slideWidth === 2) {
            percentage = -(currentSlide * 50);
        } else {
            percentage = -(currentSlide * 25);
        }

        $('.js-carousel-track').css('transform', `translateX(${percentage}%)`);
    }

    $(window).resize(updateCarousel);

    $('.js-carousel-next').click(function() {
        currentSlide++;
        updateCarousel();
    });

    $('.js-carousel-prev').click(function() {
        currentSlide--;
        updateCarousel();
    });

    setInterval(function() {
        currentSlide++;
        updateCarousel();
    }, 4000);
});

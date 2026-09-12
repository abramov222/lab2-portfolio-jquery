$(document).ready(function() {
    
    // Выпадающее меню
    $('.mobile-toggle').click(function() {
        $('.nav-list').slideToggle();
    });

    // скролл и подсветка активного пункта меню
    $('.nav-list a').click(function(e) {
        e.preventDefault();
        let target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 60
        }, 600);
        
        if ($(window).width() <= 767) {
            $('.nav-list').slideUp();
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
        $('.section').each(function() {
            let top = $(this).offset().top - 100;
            let bottom = top + $(this).outerHeight();
            if (scrollPos >= top && scrollPos <= bottom) {
                $('.nav-list a').removeClass('active');
                $('.nav-list a[href="#' + $(this).attr('id') + '"]').addClass('active');
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
                <img src="${item.img}" alt="${item.title}">
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
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

    $('.close-btn, .modal-overlay').click(function(e) {
        if (e.target === this) {
            $('#contactModal').fadeOut();
            $('#contactForm')[0].reset();
            $('.form-msg').text('');
        }
    });

    // Валидация и симуляция отправки формы AJAX
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        let name = $('#name').val().trim();
        let email = $('#email').val().trim();
        let msg = $('#message').val().trim();
        let $msgBox = $('.form-msg');
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === '' || email === '' || msg === '') {
            $msgBox.text('Заполните все поля').removeClass('success').addClass('error');
            return;
        }

        if (!emailRegex.test(email)) {
            $msgBox.text('Введите корректный Email').removeClass('success').addClass('error');
            return;
        }

        $msgBox.text('Отправка...').removeClass('error success');
        let $btn = $('.submit-btn');
        $btn.prop('disabled', true);

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            data: { name: name, email: email, message: msg },
            success: function() {
                $msgBox.text('Успешно отправлено!').removeClass('error').addClass('success');
                $('#contactForm')[0].reset();
            },
            error: function() {
                $msgBox.text('Ошибка сервера.').removeClass('success').addClass('error');
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
        if ($(window).width() > 1023) slideWidth = 4;
        else if ($(window).width() > 767) slideWidth = 2;
        else slideWidth = 1;

        let totalCards = $('.skill-card').length;
        let maxSlide = totalCards - slideWidth;
        
        if (currentSlide > maxSlide) currentSlide = 0;
        if (currentSlide < 0) currentSlide = maxSlide;

        let percentage = -(currentSlide * (100 / slideWidth));
        
        if(slideWidth === 1) {
            percentage = -(currentSlide * 100);
        } else if (slideWidth === 2) {
             percentage = -(currentSlide * 50);
        } else {
             percentage = -(currentSlide * 25);
        }
        
        $('.carousel-track').css('transform', `translateX(${percentage}%)`);
    }

    $(window).resize(updateCarousel);

    $('.next-btn').click(function() {
        currentSlide++;
        updateCarousel();
    });

    $('.prev-btn').click(function() {
        currentSlide--;
        updateCarousel();
    });

    setInterval(function() {
        currentSlide++;
        updateCarousel();
    }, 4000);
});
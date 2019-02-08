/* Slider */

$(function() {
	var $slideNow = 1,
		$slideCount = $('.slider__cards').length,
		$dotId = 1,
		$translateWidth = 0;

	function dotNow() {
		$('.slider__dots__dot').removeClass('slider__dots__dot--active').eq($slideNow - 1).addClass('slider__dots__dot--active');
		$('.slider__cards').removeClass('--active').eq($slideNow - 1).addClass('--active');

	}

	function nextSlide() {
		if ($slideNow === $slideCount || $slideNow <= 0 || $slideNow > $slideCount) { // возврат к первому слайду
			$slideNow = 1;
			dotNow();
		}
		else {
			$slideNow++;
			dotNow();
		}

	}

	function prevSlide() {
		if ($slideNow === 1 || $slideNow <= 0 || $slideNow > $slideCount) { // переход к последнему слайду
			$slideNow = $slideCount;
			dotNow();
		}
		else {
			$slideNow--;
			dotNow();
		}

	}

	$('.slider__btn--next').on('click', function() {
		nextSlide();
	});

	$('.slider__btn--prev').on('click', function() {
		prevSlide();
	});

	$('.slider__dots__dot').on('click', function() {
		$dotId = $(this).index();

		$('.slider__dots__dot').removeClass('slider__dots__dot--active');
		$(this).addClass('slider__dots__dot--active');

		if ($dotId + 1 !== $slideNow) {
			$('.slider__cards').removeClass('--active').eq($dotId).addClass('--active');
			$slideNow = $dotId + 1;
		}
	});

});
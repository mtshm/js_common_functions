'use strict';

// =======================
//　ドロワーメニュー
// =======================
(function () {

  const jsToggleSm = document.getElementById('js-toggle-sm');
  const jsToggleSmTarget = document.getElementById('js-toggle-sm-target');

  jsToggleSm.addEventListener('click', function () {
    jsToggleSmTarget.classList.toggle('active');
    this.classList.toggle('active');
  });
}());

// =======================
// アコーディオンメニュー
// =======================
(function () {

  const accordionElement = document.getElementsByClassName('js-accordion-element');

  // 開閉動作
  const accordion = (element) => {
    let isShow = false;
    const headerNavLink = element;
    headerNavLink.addEventListener('click', function () {
      const headerSubNav = this.nextElementSibling;

      if (isShow) {
        headerSubNav.classList.remove('active');
        headerSubNav.style.height = 0;
        isShow = false;
      } else {
        headerSubNav.classList.add('active');
        headerSubNav.style.height = headerSubNav.scrollHeight + 'px';
        isShow = true;
      }
    });
  }

  for (let i = 0; i < accordionElement.length; i++) {
    accordion(accordionElement[i])
  }

}());


// =======================
// スライダー
// =======================
// スライドを帯状に並べて、左右にアニメーションするようにしています。

(function () {
  // 定数
  const slider = document.getElementById('js-slider');
  const slidesContainer = document.getElementById('js-slide-container');
  const slides = document.getElementsByClassName('js-slide');
  const arraySlides = Array.from(slides);
  const totalSlideNum = slides.length;

  // 最初と最後のスライドをcloneNode()してそれぞれ末尾と頭に配置することでループさせています。
  const firstSlideClone = document.querySelector('.js-slide:first-child').cloneNode(true);
  const lastSlideClone = document.querySelector('.js-slide:last-child').cloneNode(true);

  const thumb = document.getElementById('js-thumb');
  const sliderNexts = document.getElementsByClassName('js-slider-next');
  const arraySliderNexts = Array.from(sliderNexts);
  const sliderPlay = document.getElementById('js-slider-play');
  const sliderPause = document.getElementById('js-slider-pause');

  // 変数
  let sliderWidth = slider.clientWidth;
  let slideNumCounter = 0;
  let timeoutId;

  firstSlideClone.style.left = sliderWidth * totalSlideNum + 'px';
  lastSlideClone.style.left = -sliderWidth + 'px';

  slidesContainer.appendChild(firstSlideClone);
  slidesContainer.appendChild(lastSlideClone);

  // 初期表示
  arraySlides.forEach((slide, i) => {

    // スライドを帯状に配置
    slide.style.left = sliderWidth * [i] + 'px';

    // インジケーターの配置
    const thumbButton = document.createElement('a');
    thumbButton.className = 'thumb__button';
    thumbButton.innerHTML = [i];
    if (i === slideNumCounter) {
      thumbButton.classList.add('current');
    }

    // インジケーターのクリックイベント
    thumbButton.addEventListener('click', () => {
      toggleCurrentClass(slideNumCounter);
      slideNumCounter = i;
      toggleCurrentClass(slideNumCounter);
      slidesContainer.style.left = -sliderWidth * slideNumCounter + 'px';
    })

    thumb.appendChild(thumbButton);
  });


  // currentクラスの着脱
  function toggleCurrentClass(i) {
    const currentThumb = document.getElementsByClassName('thumb__button')[i];
    if (currentThumb.classList.contains('current')) {
      currentThumb.classList.remove('current');
    } else {
      currentThumb.classList.add('current');
    }
  }

  // スライドの遷移
  function goToSlide(i) {
    slidesContainer.style.left = -sliderWidth * [i] + 'px';

    // 最初のスライドに戻る
    if (i === totalSlideNum) {
      const loopSlide = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            slidesContainer.style.left = 'unset';
            resolve();
          }, 500);
        })
      }
      loopSlide().then(
        resolve => {
          setTimeout(() => {
            slidesContainer.style.left = '0px';
          }, 10)
        }
      );

      i = 0;

      // 最後のスライドに戻る
    } else if (i < 0) {
      setTimeout(function () {
        slidesContainer.style.left = 'unset';

        setTimeout(function () {
          slidesContainer.style.left = -sliderWidth * (totalSlideNum - 1) + 'px';
        }, 10)

      }, 500)
      i = totalSlideNum - 1;
    }

    slideNumCounter = i;
    toggleCurrentClass(slideNumCounter);
  }

  // 左右のボタンのクリック操作
  let movingSlide = (sliderNext) => {
    sliderNext.addEventListener('click', () => {
      toggleCurrentClass(slideNumCounter);
      if (sliderNext.classList.contains('js-slider-prev')) {
        goToSlide(slideNumCounter - 1);
      } else {
        goToSlide(slideNumCounter + 1);
      }
    });
  };

  arraySliderNexts.forEach((sliderNext) => {
    movingSlide(sliderNext);
  });

  // 再生機能
  function slideShow() {
    timeoutId = setTimeout(() => {
      arraySliderNexts[1].click();
      slideShow();
    }, 1001);
  }

  sliderPlay.addEventListener('click', () => {
    sliderPlay.classList.add('hidden');
    sliderPause.classList.remove('hidden');
    slideShow();
  });

  // 停止機能
  sliderPause.addEventListener('click', () => {
    sliderPlay.classList.remove('hidden');
    sliderPause.classList.add('hidden');
    clearTimeout(timeoutId);
  });

  // レスポンシブ対応
  const fitSliderSize = () => {
    sliderWidth = slider.clientWidth;
    const slidesContainClone = document.getElementsByClassName('js-slide');
    const arraySlidesContainClone = Array.from(slidesContainClone);

    arraySlidesContainClone.forEach((slide, i) => {
      slide.style.width = sliderWidth + 'px';
      slide.style.left = sliderWidth * [i] + 'px';
    });
    slidesContainer.style.left = -sliderWidth * [slideNumCounter] + 'px';
    slider.style.height = slides[slideNumCounter].clientHeight + 'px';
  };

  window.addEventListener('resize', () => {
    fitSliderSize();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fitSliderSize();
    });
  }

}());

// =======================
// タブメニュー
// =======================
(function () {
  const tabMenuButton = document.getElementsByClassName('js-tab-button');
  const tabContentsList = document.getElementsByClassName('js-tab-contents');

  // 各ボタンのクリック時の処理設定
  for (let i = 0; i < tabMenuButton.length; i++) {
    tabMenuButton[i].addEventListener('click', function (e) {
      e.preventDefault();

      // タブメニュー
      for (let i = 0; i < tabMenuButton.length; i++) {
        tabMenuButton[i].classList.remove('active');
      }
      this.classList.add('active');

      // コンテンツ
      for (let i = 0; i < tabContentsList.length; i++) {
        tabContentsList[i].classList.remove('active');
      }
      document.getElementById(this.dataset.id).classList.add('active');
    })
  }
}());



// =======================
// モーダルウィンドウ
// =======================
(function () {

  const modalOpen = document.getElementsByClassName('js-modal-open');
  const modalMask = document.getElementById('js-modal-mask');
  const modalClose = document.getElementById('js-modal-close');
  const modalImg = document.getElementById('js-modal-img');

  // モーダルの表示
  for (let i = 0; i < modalOpen.length; i++) {
    modalOpen[i].addEventListener('click', function (e) {
      e.preventDefault();
      modalImg.src = this.src;
      modalImg.onload = () => {
        modalMask.classList.remove('hidden');
      };
    });
  }

  // モーダルの非表示(closeボタン)
  modalClose.addEventListener('click', (e) => {
    e.preventDefault();
    modalMask.classList.add('hidden');
  });

  // モーダルの非表示(モーダルのクリック時)
  modalMask.addEventListener('click', () => {
    modalClose.click();
  });
}());
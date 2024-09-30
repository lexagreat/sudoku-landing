(function isWebP() {
   function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height == 2);
      };
      webP.src =
         "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }
   testWebP(function (support) {
      if (support == true) {
         document.querySelector("html").classList.add("webp");
      } else {
         document.querySelector("html").classList.add("no-webp");
      }
   });
})();
const maskOptions = {
   mask: "+{7} (000) 000-00-00",
   // lazy: false,  // make placeholder always visible
   // placeholderChar: '0'     // defaults to '_'
};
if (document.querySelectorAll("[data-phone]").length) {
   document.querySelectorAll("[data-phone]").forEach((item) => {
      const mask = IMask(item, maskOptions);
   });
}

// Popup
const popupLinks = document.querySelectorAll(".modal__link");
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");
const popupCloseIcon = document.querySelectorAll(".modal__close");

let unlock = true;

const timeout = 500;

if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
         const popupName = popupLink.getAttribute("href").replace("#", "");
         const curentPopup = document.getElementById(popupName);
         popupOpen(curentPopup);
         e.preventDefault();
      });
   }
}

if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
         popupClose(el.closest(".modal"));
         e.preventDefault();
      });
   }
}

function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      const popupActive = document.querySelector(".modal.open");
      if (popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      curentPopup.classList.add("open");
      curentPopup.addEventListener("click", function (e) {
         if (!e.target.closest(".modal__content")) {
            popupClose(e.target.closest(".modal"));
         }
      });
   }
}
function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove("open");
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

function bodyLock() {
   const lockPaddingValue =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

   if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];
         el.style.paddingRight = lockPaddingValue;
      }
   }
   body.style.paddingRight = lockPaddingValue;
   body.classList.add("lock");

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

function bodyUnLock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = "0px";
         }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("lock");
   }, timeout);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

document.addEventListener("keydown", function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector(".modal.open");
      popupClose(popupActive);
   }
});

function makeHeader() {
   const header = document.querySelector(".header");
   let oldScrollTopPosition = 0;
   const animateHeaderDown = () => {
      let scrollTopPosition = document.documentElement.scrollTop;
      if (scrollTopPosition <= 0) {
         return;
      }
      let scrollDown = oldScrollTopPosition < scrollTopPosition;
      if (scrollDown) {
         header.classList.contains("hidden")
            ? ""
            : header.classList.add("hidden");
      } else {
         header.classList.remove("hidden");
      }

      oldScrollTopPosition = scrollTopPosition;
   };
   animateHeaderDown();
   window.addEventListener("scroll", () => {
      animateHeaderDown();
   });
}

function initGamesSlider() {
   let slider = new Swiper(".games__slider .swiper", {
      slidesPerView: 1,
      spaceBetween: 15,
      grid: {
         rows: 2,
      },
      mousewheel: {
         enabled: true,
         forceToAxis: true,
      },
      breakpoints: {
         1025: {
            slidesPerView: "auto",
            spaceBetween: 20,
            grid: {
               rows: 1,
            },
         },
      },
   });
}
document.addEventListener("DOMContentLoaded", () => {
   makeHeader();
   initGamesSlider();
});

// Smooth Scroll
const lenis = new Lenis({
   duration: 2, // продолжительность скролла (в секундах)
   smooth: true, // включить плавный скролл
   direction: "vertical", // направление скролла
});
function raf(time) {
   lenis.raf(time);
   requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
   anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      lenis.scrollTo(targetElement); // Используем метод lenis для плавной прокрутки
   });
});

var form = document.getElementById("my-form");

async function handleSubmit(event) {
   event.preventDefault();
   var data = new FormData(event.target);
   fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
         Accept: "application/json",
      },
   })
      .then((response) => {
         if (response.ok) {
            form.reset();
            popupOpen(document.querySelector("#contactModal"));
         }
      })
      .catch((error) => {});
}
form.addEventListener("submit", handleSubmit);

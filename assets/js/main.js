/*//= components/nazv_failu.js*/
// header ====================================
document.addEventListener("DOMContentLoaded", function () {
    const burgerBtn = document.querySelector(".icon-menu");
    const menuBody = document.querySelector(".nav__body");
    const dropdownToggles = document.querySelectorAll(".dropdown__toggle");
    const navItems = document.querySelectorAll(".nav__item");

    // 1. Логіка для кліку по бургеру
    if (burgerBtn && menuBody) {
        burgerBtn.addEventListener("click", function () {
            burgerBtn.classList.toggle("active");
            menuBody.classList.toggle("active");
        });
    }

    // 2. Логіка для кліку по dropdown__toggle на мобільних пристроях
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
            // Перевіряємо, чи ми зараз на мобільному екрані (< 768px)
            if (window.innerWidth < 829.98) {
                e.preventDefault(); // Скасовуємо перехід по посиланню/хрестику

                const parentItem = this.closest(".dropdown");

                // Якщо потрібно, щоб при відкритті одного дропдауна інший закривався — розкоментуй код нижче:

                document.querySelectorAll(".dropdown").forEach((item) => {
                    if (item !== parentItem) item.classList.remove("open");
                });

                // Перемикаємо клас для відкриття/закриття
                if (parentItem) {
                    parentItem.classList.toggle("open");
                }
            }
        });
    });
    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            if (window.innerWidth <= 829.98) {
                // Зупиняємо спливання події, якщо клікнули на вкладені посилання в підменю,
                // щоб рамка не перескакувала і не зникала при кліках всередині дропдауна
                if (e.target.closest(".dropdown-menu")) {
                    return;
                }

                // Якщо клікнули на той самий пункт, який вже активний — знімаємо рамку
                if (this.classList.contains("is-selected")) {
                    this.classList.remove("is-selected");
                } else {
                    // Спочатку прибираємо рамку з усіх інших пунктів меню
                    navItems.forEach((el) => el.classList.remove("is-selected"));
                    // Додаємо рамку на поточний клікнутий пункт
                    this.classList.add("is-selected");
                }
            }
        });
    });
});

const swiper = new Swiper(".swiper", {
    // Нескінченне гортання
    loop: true,
    speed: 800,
    // ДОДАЄМО АВТОПЕРЕГОРТАННЯ
    autoplay: {
        delay: 3000, // затримка в мілісекундах (3000 мс = 3 секунди)
        disableOnInteraction: false, // автоперегортання НЕ вимкнеться, якщо користувач сам клікне на слайд
    },
    // Вмикаємо пагінацію (крапочки)
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    // Вмикаємо стрілки
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

const isGitHubPages = window.location.hostname.includes("github.io");
const basePath = isGitHubPages ? "/test-college" : "";

// 2. Динамічний шлях до JSON-файлу новин
const newsJsonUrl = `${basePath}/assets/data/news.json`;

// Спільні елементи модального вікна (потрібні для обох сторінок)
const modal = document.getElementById("news-modal");
const modalImg = document.getElementById("modal-img");
const modalDate = document.getElementById("modal-date");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalClose = document.getElementById("modal-close");

// Функція для очищення шляхів картинки (захист від подвійного //)
function getFullImgUrl(imagePath) {
    if (!imagePath) return "";
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${basePath}/${cleanPath}`;
}

// Функція для відкриття модального вікна з даними
function openNewsModal(newsItem) {
    if (!modal) return;

    modalImg.src = getFullImgUrl(newsItem.image);
    modalImg.alt = newsItem.title;
    modalDate.textContent = newsItem.date;
    modalTitle.textContent = newsItem.title;
    modalText.textContent = newsItem.text;

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden"; // Блокуємо скролл сайту
}

// Функція для закриття модального вікна
function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = ""; // Повертаємо скролл
}

// Налаштування загальних обробників подій для модалки (запускається один раз)
if (modal) {
    if (modalClose) modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
}

// === СТОРІНКА ВСІХ НОВИН ===
async function loadNews() {
    const container = document.getElementById("news-page-container");
    if (!container) return;

    try {
        const response = await fetch(newsJsonUrl);
        if (!response.ok) throw new Error("Не вдалося завантажити файл новин");

        const newsList = await response.json();
        container.innerHTML = "";

        // Беремо новини (до 100 штук)
        const latestNews = newsList.slice(0, 100);

        latestNews.forEach((news) => {
            const newsCard = document.createElement("article");
            newsCard.className = "news-page-card";

            const fullImg = getFullImgUrl(news.image);

            newsCard.innerHTML = `
                <div class="news-page-card__card">
                    <div class="news-page-card__img">
                        <img src="${fullImg}" alt="${news.title}" class="news-page-card__img-settings" />
                    </div>
                    <div class="news-page-card__content">
                        <div class="news-page-card__date">
                            <span class="news-page-card__date">
                                <svg width="25px" height="25px" viewBox="-1 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                    <path d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z" transform="translate(-309.000000, -359.000000)"></path>
                                </svg>
                                ${news.date}
                            </span>
                        </div>
                        <h2 class="news-page-card__title">${news.title}</h2>
                        <p class="news-page-card__text">${news.text}</p>
                    </div>
                </div>
            `;

            newsCard.addEventListener("click", () => openNewsModal(news));
            container.appendChild(newsCard);
        });
    } catch (error) {
        console.error("Помилка:", error);
        container.innerHTML = '<p class="error-message">Вибачте, не вдалося завантажити новини. Спробуйте пізніше.</p>';
    }
}

// === ГОЛОВНА СТОРІНКА ===
async function loadNewsMainPage() {
    const containerMain = document.getElementById("news-container");
    if (!containerMain) return;

    try {
        const response = await fetch(newsJsonUrl);
        if (!response.ok) throw new Error("Не вдалося завантажити файл новин");

        const newsList = await response.json();
        containerMain.innerHTML = "";

        // Беремо перші 6 новин
        const latestNews = newsList.slice(0, 6);

        latestNews.forEach((news) => {
            const newsCard = document.createElement("article");
            newsCard.className = "news-card";

            const fullImg = getFullImgUrl(news.image);

            newsCard.innerHTML = `
                <div class="news-grid__card card">
                    <div class="card__img">
                        <img src="${fullImg}" alt="${news.title}" class="card__img-settings" />
                    </div>
                    <div class="card__content">
                        <div class="card__date">
                            <span class="card__date">
                                <svg width="25px" height="25px" viewBox="-1 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                                    <path d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z" transform="translate(-309.000000, -359.000000)"></path>
                                </svg>
                                ${news.date}
                            </span>
                        </div>
                        <h2 class="card__title">${news.title}</h2>
                        <p class="card__text">${news.text}</p>
                    </div>
                </div>
            `;

            newsCard.addEventListener("click", () => openNewsModal(news));
            containerMain.appendChild(newsCard);
        });
    } catch (error) {
        console.error("Помилка:", error);
        containerMain.innerHTML =
            '<p class="error-message">Вибачте, не вдалося завантажити новини. Спробуйте пізніше.</p>';
    }
}

// Запуск при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
    loadNews();
    loadNewsMainPage();
});

// 1. Автоматично визначаємо, чи ми на GitHub Pages, і формуємо префікс
// const isGitHubPages = window.location.hostname.includes("github.io");
// const basePath = isGitHubPages ? "/test-college" : "";

// 2. Динамічний шлях до JSON-файлу адміністрації
const dataUrl = `${basePath}/assets/data/administration.json`;

// Функція для створення HTML-карток
function renderCards(cardsArray) {
    const container = document.getElementById("administration-content");
    if (!container) return;

    // Очищаємо контейнер перед рендером
    container.innerHTML = "";

    cardsArray.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("administration__card", "card-ad");

        // Перевірка на порожній текст
        const textHtml = item.text ? `<p class="card-ad__desc">${item.text}</p>` : "";

        // ДИНАМІЧНЕ КОРЕГУВАННЯ ШЛЯХУ ДО ЗОБРАЖЕННЯ:
        // Видаляємо початковий слеш у шляху з JSON (якщо він є), щоб уникнути подвійного //
        const cleanImageUrl = item.image.startsWith("/") ? item.image.slice(1) : item.image;
        // Додаємо базовий шлях (на GitHub це буде /test-college/assets/..., локально — assets/...)
        const fullImageUrl = `${basePath}/${cleanImageUrl}`;

        // Наповнюємо картку контентом
        card.innerHTML = `
            <div class="card-ad__img">
                <img src="${fullImageUrl}" alt="${item.name}" />
            </div>
            <div class="card-ad__text">
                <h2 class="card-ad__position">${item.position}</h2>
                <h3 class="card-ad__name">${item.name}</h3>
                ${textHtml}
            </div>
        `;

        container.appendChild(card);
    });
}

// Асинхронна функція для завантаження даних із JSON-файлу
async function loadTeachersData() {
    try {
        const response = await fetch(dataUrl);

        // Перевіряємо, чи файл успішно знайдено і завантажено
        if (!response.ok) {
            throw new Error(`Помилка завантаження файлу: ${response.status} ${response.statusText}`);
        }

        // Перетворюємо отриманий результат у масив об'єктів
        const data = await response.json();

        // Запускаємо рендеринг карток із отриманими даними
        renderCards(data);
    } catch (error) {
        console.error("Не вдалося завантажити дані викладачів:", error);

        // Виводимо повідомлення для користувача на сторінці у разі помилки
        const container = document.getElementById("administration-content");
        if (container) {
            container.innerHTML = `<p style="color: red; padding: 20px;">Помилка завантаження даних. Будь ласка, спробуйте пізніше.</p>`;
        }
    }
}

// Запускаємо завантаження після того, як DOM повністю готовий
document.addEventListener("DOMContentLoaded", () => {
    loadTeachersData();
});

// 1. Автоматично визначаємо, чи ми на GitHub Pages, і формуємо префікс
// const isGitHubPages = window.location.hostname.includes("github.io");
// const basePath = isGitHubPages ? "/test-college" : "";

// 2. Динамічний шлях до JSON-файлу
const docUrl = `${basePath}/assets/data/documents.json`;

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("documents-list");
    if (!container) return;

    // Дізнаємося, яку категорію документів потрібно показати на ЦІЙ сторінці
    const currentCategory = container.getAttribute("data-page-category");

    fetch(docUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Помилка завантаження JSON");
            return response.json();
        })
        .then((data) => {
            // Фільтруємо масив за категорією
            const filteredDocuments = data.filter((doc) => doc.category === currentCategory);

            // Виводимо відфільтровані документи
            renderDocuments(filteredDocuments);
        })
        .catch((error) => {
            console.error("Помилка:", error);
            container.innerHTML = `<p class="error-message">Не вдалося завантажити документи.</p>`;
        });

    function renderDocuments(documents) {
        if (documents.length === 0) {
            container.innerHTML = "<p>У цьому розділі поки немає документів.</p>";
            return;
        }

        const htmlContent = documents
            .map((doc) => {
                // Очищаємо fileUrl від початкового слешу, якщо він є,
                // щоб уникнути подвійного слешу // при склеюванні
                const cleanFileUrl = doc.fileUrl.startsWith("/") ? doc.fileUrl.slice(1) : doc.fileUrl;

                // Формуємо повний коректний шлях до PDF-файлу
                const fullFileUrl = `${basePath}/${cleanFileUrl}`;

                return `
                    <div class="document-card">
                        <svg width="32px" height="32px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                        <a href="${fullFileUrl}" class="document-card__link" target="_blank" rel="noopener noreferrer">
                            ${doc.title}
                        </a>
                    </div>
                `;
            })
            .join("");

        container.innerHTML = htmlContent;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // 1. Перевіряємо, чи кнопка відкриття відео є на цій сторінці
    if (document.getElementById("openVideoBtn")) {
        initVideoModal();
    }
});

function initVideoModal() {
    const openBtn = document.getElementById("openVideoBtn");
    const closeBtn = document.getElementById("closeVideoBtn");
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("modalYoutube");
    const overlay = modal.querySelector(".video-modal__overlay");

    // Скопіюйте посилання "Embed" з ютубу (через кнопку Поділитися -> Вбудувати)
    const youtubeUrl = "https://www.youtube.com/embed/rjyHsiuKGAQ?si=F-E-R6G9fPIWFnNO";

    openBtn.addEventListener("click", () => {
        modal.classList.add("is-open");
        iframe.setAttribute("src", youtubeUrl); // Додаємо src і відео грає
        document.body.style.overflow = "hidden"; // Блокуємо скролл самого сайту на фоні
    });

    const closeModal = () => {
        modal.classList.remove("is-open");
        iframe.setAttribute("src", ""); // Очищуємо src і відео повністю зупиняється
        document.body.style.overflow = ""; // Повертаємо скролл сайту
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    window.addEventListener("keydown", (event) => {
        // Перевіряємо, чи натиснута клавіша Escape ТА чи модальне вікно зараз відкрите
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Відстежуємо подію прокрутки (scroll)
window.addEventListener("scroll", () => {
    // Якщо прокрутили більше ніж на 500 пікселів, показуємо кнопку
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

// Обробка кліку на кнопку
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Плавна прокрутка
    });
});


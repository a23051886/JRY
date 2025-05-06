document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    // 在 CSS 中靜態設置 section 的 padding-top


        // 節流函數
        function throttle(func, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall >= delay) {
                    func.apply(this, args);
                    lastCall = now;
                }
            };
        }


    // 平滑滾動函數 (修改版)
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            // 直接使用 CSS 的 padding-top 補償，不再減去 navbarHeight
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // 導航鏈接事件
    document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            if (window.innerWidth <= 992) {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const scrollHandler = () => {
                        smoothScroll(target);
                        navbarCollapse.removeEventListener('hidden.bs.collapse', scrollHandler);
                    };
                    navbarCollapse.addEventListener('hidden.bs.collapse', scrollHandler);
                    new bootstrap.Collapse(navbarCollapse).hide();
                    return;
                }
            }
            smoothScroll(target);
        });
    });


        // 滾動監測 - 一開始先出現，向下後隱藏，當向上滾動時再度出現 
    navbar.classList.add("visible");
    
    const handleWheel = throttle((event) => {
        if (event.deltaY < 0 && window.scrollY > navbarHeight) {
            navbar.classList.add("visible");
        } else {
            navbar.classList.remove("visible");
        }
    }, 100); // 100毫秒節流
    window.addEventListener("wheel", handleWheel);

    
    /*
        // 滾動監測 - 確保導航時刻隱藏，唯向上滾動時會出現 
    window.addEventListener("wheel", (event) => {
        if (event.deltaY < 0 && window.scrollY > navbarHeight) {
            navbar.classList.add("visible");
        } else {
            navbar.classList.remove("visible");
        }
    });
    */


});
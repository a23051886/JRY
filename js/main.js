// 頁面加載時執行
document.addEventListener('DOMContentLoaded', () => {

    // 初始化 AOS（滾動動畫）
    AOS.init({
        once: false,
        anchorPlacement: 'top-center', // 全局定位
        duration: 1000,
        easing: 'ease-out-quart'
    });

    // 初始化 Fancybox（燈箱效果）
    Fancybox.bind("[data-fancybox]", {
        // 自定義選項
    });
});

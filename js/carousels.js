const CAROUSEL_CONFIG = [
    { type: 'intro', containerId: 'introCarouselInner', carouselId: 'introCarousel' },
    { type: 'nearby', containerId: 'nearbyCarouselInner', carouselId: 'nearbyCarousel' },
    { type: 'gallery', containerId: 'galleryCarouselInner', carouselId: 'galleryCarousel' },
    { type: 'fp', containerId: 'fpCarouselInner', carouselId: 'fpCarousel' },

];





async function loadCarousel(supabaseClient, carouselType, containerId, carouselId) {
  console.log(`正在加载 ${carouselType} 灯箱数据...`);

  try {
      const { data, error } = await supabaseClient
          .from('carousel_images')
          .select('*')
          .eq('carousel_type', carouselType)
          .order('display_order', { ascending: true });

      if (error) throw error;
      if (!data?.length) throw new Error(`沒有找到 ${carouselType} 類型的數據`);

      const container = document.getElementById(containerId);
      if (!container) throw new Error(`找不到容器元素: ${containerId}`);

      container.innerHTML = data.map((img, i) => `
          <div class="carousel-item h-100 ${i === 0 ? 'active' : ''}">
              <a href="${img.image_url}" data-fancybox="${carouselType}-group" data-caption="${img.caption}">
                  <div class="h-100 position-relative">
                      <picture>
                          <source 
                              media="(max-width: 768px)" 
                              srcset="${img.mobile_image_url || img.image_url}"
                              class="w-100 h-100 object-fit-cover">
                          <img
                              src="${img.image_url}"
                              class="w-100 h-100 object-fit-cover"
                              alt="${img.caption}"
                              loading="lazy">
                      </picture>
                      <div class="watermark position-absolute bottom-0 start-0 p-2 bg-dark bg-opacity-75 text-white w-100">
                          ${img.caption}
                      </div>
                  </div>
              </a>
          </div>
      `).join('');

      // 获取轮播元素
      const carouselElement = document.getElementById(carouselId);
      
      // 先销毁已有的轮播实例
      const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
      if (existingCarousel) {
          existingCarousel.dispose();
      }

      // 初始化新轮播
      const carousel = new bootstrap.Carousel(carouselElement, {
          interval: 2500, // 2.5秒间隔
          ride: 'carousel' // 确保自动播放
      });

      console.log(`${carouselType} 燈箱初始化完成`);

  } catch (error) {
      console.error(`${carouselType} 燈箱加載失敗:`, error);
      const container = document.getElementById(containerId) || document.body;
      container.innerHTML = `
          <div class="alert alert-danger">
              <h4>${carouselType} 加載失敗</h4>
              <p>${error.message}</p>
          </div>`;
  }
}




function initAllCarousels() {
  if (!window.supabase) {
    console.error('Supabase 未初始化');
    return;
  }

  CAROUSEL_CONFIG.forEach(config => {
    loadCarousel(window.supabase, config.type, config.containerId, config.carouselId);
  });
}

// 等待 DOM 和 Supabase 都準備好
function checkAndInit() {
  if (document.readyState === 'complete' && window.supabase) {
    initAllCarousels();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.supabase) {
        initAllCarousels();
      } else {
        const checkSupabase = setInterval(() => {
          if (window.supabase) {
            clearInterval(checkSupabase);
            initAllCarousels();
          }
        }, 100);
      }
    });
  }
}

checkAndInit();
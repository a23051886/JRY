// 管理後台初始化
function initAdminPanel() {
  try {
    // 檢查 supabase 是否可用
    if (typeof supabase === 'undefined' || !supabase.createClient) {
      throw new Error('Supabase 庫未正確加載');
    }

    // 配置 Supabase 客戶端 (使用 service_role key)
    const supabaseUrl = 'https://curnwqgxvinolwjysekv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cm53cWd4dmlub2x3anlzZWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzc1MTEzOSwiZXhwIjoyMDU5MzI3MTM5fQ.dGDF52kep-ZY0iHrrb_Cc9PTeVXULw7bwvosTkTVzu8';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    console.log('管理後台 Supabase 客戶端初始化成功');

    // 上傳按鈕事件
    document.getElementById('uploadBtn').addEventListener('click', async function() {
      const desktopInput = document.getElementById('desktopImage');
      const mobileInput = document.getElementById('mobileImage');
      const caption = document.getElementById('caption').value.trim();
      const carouselType = document.getElementById('carouselType').value;
      const statusEl = document.getElementById('status');
    
      // 驗證輸入
      if (!desktopInput.files || desktopInput.files.length === 0) {
        statusEl.innerHTML = '<div class="alert alert-warning">請至少上傳電腦版圖片</div>';
        return;
      }
      if (!caption) {
        statusEl.innerHTML = '<div class="alert alert-warning">請輸入圖片標題</div>';
        return;
      }
    
      statusEl.innerHTML = '<div class="alert alert-info">圖片上傳中，請稍候...</div>';
    
      try {
        // 1. 上傳電腦版圖片
        const desktopFile = desktopInput.files[0];
        const desktopExt = desktopFile.name.split('.').pop();
        const desktopFileName = `${carouselType}-desktop-${Date.now()}.${desktopExt}`;
        const desktopPath = `${carouselType}/${desktopFileName}`;
    
        const { error: desktopError } = await supabaseClient.storage
          .from('jry-supabase')
          .upload(desktopPath, desktopFile, {
            cacheControl: 'public, max-age=604800'
          });
    
        if (desktopError) throw desktopError;
    
        // 2. 上傳手機版圖片 (如果有的話)
        let mobileUrl = null;
        if (mobileInput.files && mobileInput.files.length > 0) {
          const mobileFile = mobileInput.files[0];
          const mobileExt = mobileFile.name.split('.').pop();
          const mobileFileName = `${carouselType}-mobile-${Date.now()}.${mobileExt}`;
          const mobilePath = `${carouselType}/${mobileFileName}`;
    
          const { error: mobileError } = await supabaseClient.storage
            .from('jry-supabase')
            .upload(mobilePath, mobileFile, {
              cacheControl: 'public, max-age=604800'
            });
    
          if (mobileError) throw mobileError;
          mobileUrl = supabaseClient.storage.from('jry-supabase').getPublicUrl(mobilePath).data.publicUrl;
        }
    
        // 3. 獲取公開URL
        const desktopUrl = supabaseClient.storage.from('jry-supabase').getPublicUrl(desktopPath).data.publicUrl;
        
        // 4. 保存到數據庫
        const { error: dbError } = await supabaseClient
          .from('carousel_images')
          .insert([{
            carousel_type: carouselType,
            image_url: desktopUrl,
            mobile_image_url: mobileUrl || desktopUrl, // 如果沒傳手機版就用電腦版
            caption: caption,
            display_order: 999
          }]);
    
        if (dbError) throw dbError;
    
        // 上傳成功
        statusEl.innerHTML = `
          <div class="alert alert-success">
            <h4>上傳成功！</h4>
            <p>電腦版: <a href="${desktopUrl}" target="_blank">查看</a></p>
            ${mobileUrl ? `<p>手機版: <a href="${mobileUrl}" target="_blank">查看</a></p>` : ''}
          </div>
        `;
    
        // 清空表單
        desktopInput.value = '';
        mobileInput.value = '';
        document.getElementById('caption').value = '';
    
      } catch (error) {
        console.error('上傳失敗:', error);
        statusEl.innerHTML = `
          <div class="alert alert-danger">
            <h4>上傳失敗</h4>
            <p>${error.message}</p>
            ${error.stack ? `<pre>${error.stack}</pre>` : ''}
          </div>
        `;
      }
    });

    console.log('管理後台初始化完成');

  } catch (error) {
    console.error('管理後台初始化失敗:', error);
    document.getElementById('status').innerHTML = `
      <div class="alert alert-danger">
        <h4>系統初始化錯誤</h4>
        <p>${error.message}</p>
        <p>請確保 Supabase 庫已正確加載</p>
      </div>
    `;
  }
}

// 啟動管理後台
if (document.readyState === 'complete') {
  initAdminPanel();
} else {
  document.addEventListener('DOMContentLoaded', initAdminPanel);
}
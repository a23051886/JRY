function setupFormSubmission() {
  // 加強元素存在性檢查
  const form = document.getElementById('form1');
  if (!form) {
    console.error('錯誤: 找不到表單元素 #form1');
    return;
  }

  const errorDisplay = form.querySelector('.msgerror');
  if (!errorDisplay) {
    console.error('錯誤: 找不到錯誤顯示元素 .msgerror');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDisplay.textContent = '';

    // 檢查 Supabase 是否初始化
    if (!window.supabase) {
      console.log(window.supabase);
      errorDisplay.textContent = '系統初始化中，請稍後再試'; 
      return;
    }

    // 加強表單數據收集
    const formData = {
      project: form.querySelector('[name="project"]')?.value || '未知專案',
      name: form.user_name.value.trim(),
      gender: form.user_gender.value,
      phone: form.user_phone.value.trim(),
      email: form.user_email.value.trim(),
      message: form.message.value.trim(),
      created_at: new Date().toISOString()
    };

    // 驗證必填字段
    if (!formData.name || !formData.phone ) {
      errorDisplay.textContent = '請填寫所有必填欄位';
      return;
    }

    try {
      console.log('Submitting to Supabase', formData); // 加這行看看有沒有被印出
      const { error } = await window.supabase
        .from('signups')
        .insert([formData]);       

      if (error) throw error;
      
      alert('成功送出！');
      form.reset();
    } catch (error) {
        errorDisplay.textContent = `提交失敗: ${(error && error.message) || '未知錯誤'}`;
        alert('送出失敗！');
    }
  });
}

// 安全的初始化方式
function initForm() {
  if (document.readyState === 'complete') {
    setupFormSubmission();
  } else {
    document.addEventListener('DOMContentLoaded', setupFormSubmission);
  }
}

// 啟動表單初始化
initForm();
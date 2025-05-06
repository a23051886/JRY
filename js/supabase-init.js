// 初始化 Supabase 並暴露到全局, 使用anon key
window.supabase = supabase.createClient(
    'https://curnwqgxvinolwjysekv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cm53cWd4dmlub2x3anlzZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NTExMzksImV4cCI6MjA1OTMyNzEzOX0.-G2FwxEi9sIScuF3Act4tuyeGhyvJ-Ree7uW0QsWAIg'
  );
  
  console.log('Supabase 初始化完成');






  
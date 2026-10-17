import { supabase } from './lib/supabaseClient'; // .js হলেও সমস্যা নাই

export async function sendMessageWithAI(threadId: string, message: string, userId: string) {
  
  // 1. Customer এর মেসেজ
  await supabase.from('chat_messages').insert({
    thread_id: threadId,
    sender_type: 'user',
    sender_id: userId,
    body: message
  });

  // 2. 3 সেকেন্ড পর AI Reply
  setTimeout(async () => {
    await supabase.from('chat_messages').insert({
      thread_id: threadId,
      sender_type: 'admin',
      sender_id: '00000-0000-0000-0000-000001',
      body: `আসালামু আলাইকুম! আপনার মেসেজ: "${message}" পেয়েছি। আমরা দ্রুত রিপ্লাই দিবো।`
    });
  }, 3000);
}
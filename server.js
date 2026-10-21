const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = '-1002214347613';
const PUBLIC_URL = process.env.PUBLIC_URL; // مثال https://your-domain.com بدون / بالنهاية
const PORT = process.env.PORT || 3000;
const links = new Map(); // للإنتاج استخدم قاعدة بيانات دائمة بدل الذاكرة

function token() { return crypto.randomBytes(18).toString('hex'); }
async function tg(method, body) {
  const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body)
  });
  const j = await r.json(); if (!j.ok) throw new Error(j.description || 'Telegram error'); return j.result;
}

app.get('/api/link/start', (req,res) => {
  const device = String(req.query.device || ''); if (!device) return res.status(400).json({error:'device required'});
  const t = token(); links.set(t, {device, userId:null, created:Date.now()});
  res.json({token:t});
});

app.post('/telegram/webhook', async (req,res) => {
  try {
    const m=req.body.message; const text=m?.text || '';
    if (m && text.startsWith('/start ')) {
      const t=text.slice(7).trim(); const row=links.get(t);
      if (row) { row.userId=m.from.id; links.set(t,row); await tg('sendMessage',{chat_id:m.chat.id,text:'تم ربط حسابك. اشترك في القناة ثم ارجع للتطبيق واضغط تحقق.'}); }
    }
  } catch(e) {}
  res.sendStatus(200);
});

app.get('/api/link/verify', async (req,res) => {
  const device=String(req.query.device || '');
  const row=[...links.values()].reverse().find(x=>x.device===device && x.userId);
  if(!row) return res.json({subscribed:false,message:'افتح البوت واضغط Start أولاً'});
  try {
    const m=await tg('getChatMember',{chat_id:CHANNEL_ID,user_id:row.userId});
    const ok=['creator','administrator','member'].includes(m.status);
    res.json({subscribed:ok,message:ok?'OK':'أنت غير مشترك بالقناة'});
  } catch(e) { res.status(502).json({subscribed:false,message:'فشل التحقق من Telegram'}); }
});

app.get('/health',(req,res)=>res.json({ok:true}));
app.listen(PORT, async()=>{
  if(BOT_TOKEN && PUBLIC_URL) {
    try { await tg('setWebhook',{url:`${PUBLIC_URL}/telegram/webhook`}); console.log('Webhook ready'); }
    catch(e){ console.error(e.message); }
  }
  console.log(`Listening on ${PORT}`);
});

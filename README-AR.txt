بوابة اشتراك Telegram

القناة: https://t.me/SD_7kT
Channel ID: -1002214347613
Bot: @il298bot

مهم: لا تضع BOT_TOKEN داخل تطبيق Android.

1) ارفع هذا المجلد إلى سيرفر Node.js يدعم HTTPS.
2) عرّف متغيرات البيئة:
   BOT_TOKEN = توكن البوت الخاص بك
   PUBLIC_URL = رابط السيرفر مثل https://example.com
3) شغل: npm install ثم npm start
4) اجعل @il298bot مشرفاً في القناة.
5) افتح app/src/main/java/com/test/TelegramGateClient.java
   واستبدل https://YOUR-SERVER.example.com برابط السيرفر.
6) ابنِ المشروع في AndroidIDE.

طريقة العمل:
بعد نجاح مفتاح الدخول تظهر بوابة Telegram. زر فتح البوت يربط حساب Telegram بالجهاز، ثم زر تحقق يطلب من السيرفر getChatMember. لا تظهر الشاشة الرئيسية إلا إذا كانت الحالة member/administrator/creator.

تنبيه: لا يمكن ضمان منع شخص يعدّل APK نفسه؛ التحقق الحساس يجب أن يبقى على السيرفر، كما في هذا التصميم.

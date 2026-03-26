// server.js - خادم واتساب + الذكاء الاصطناعي
// تشغيل: npm install && node server.js

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// === الإعدادات ===
const CONFIG = {
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "test123",
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
};

// طباعة الإعدادات عند التشغيل للتأكد
console.log("═══════════════════════════════");
console.log("🚀 إعدادات الخادم:");
console.log("VERIFY_TOKEN:", CONFIG.VERIFY_TOKEN);
console.log("WHATSAPP_TOKEN:", CONFIG.WHATSAPP_TOKEN ? "✅ موجود" : "❌ مفقود");
console.log("CLAUDE_API_KEY:", CONFIG.CLAUDE_API_KEY ? "✅ موجود" : "❌ مفقود");
console.log("SUPABASE_URL:", CONFIG.SUPABASE_URL ? "✅ موجود" : "❌ مفقود");
console.log("═══════════════════════════════");

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ==========================================
// === بروم شركة نجوم العمران (OStar) ===
// ==========================================
const SYSTEM_PROMPT = `
أنت مساعد ذكي لشركة نجوم العمران (OStar) عبر واتساب.
ردودك دائماً بالعربية، بأسلوب ودي ومحترف ومختصر لا يتجاوز 4 أسطر.
ابدأ دائماً بـ "أهلاً بك في نجوم العمران 🌟"

═══════════════════════════════════
معلومات الشركة الأساسية
═══════════════════════════════════
الاسم: شركة نجوم العمران للمقاولات — علامة OStar
التأسيس: 2011
الموقع الإلكتروني: ostar.com.sa
التواصل المباشر: 00966148666667
رقم الواتساب: 966543659921
ساعات العمل: 8 صباحاً حتى 12 منتصف الليل — يومياً بدون إجازة
التوصيل: لجميع أنحاء المملكة العربية السعودية
التركيب: داخل المدينة المنورة فقط

═══════════════════════════════════
الفروع — المدينة المنورة (6 فروع)
═══════════════════════════════════
1. فرع السلام
2. فرع شوران
3. فرع حي الفتح — تكييف مركزي
4. فرع الدائري — تكييف مركزي
5. فرع سوق الكهرباء — تكييف مركزي
6. فرع قباء — تكييف مركزي
+ فرع متخصص لقطع غيار التكييف والتبريد

ملاحظة: الأسعار على الموقع مخصصة للشراء الإلكتروني فقط وقد لا تتوفر في المعرض.

═══════════════════════════════════
المنتجات والخدمات الكاملة
═══════════════════════════════════

【 أجهزة التكييف 】
- مكيفات سبليت (جميع الأحجام)
- مكيفات شباك
- مكيفات دكت سبليت
- مكيفات مركزية
- مكيفات دولابي
- مراوح وستائر هوائية
- مجاري هواء دكت
- غرف تبريد وتجميد

【 الماركات المتوفرة 】
- General Supreme (الماركة الرئيسية)
- ميديا
- LG
- باناسونيك
- وماركات أخرى متعددة

【 الأجهزة المنزلية الكبيرة 】
- غسالات، ثلاجات، مجففات
- أفران ومايكروويف

【 الأجهزة المنزلية الصغيرة 】
- عصارات وخلاطات
- أجهزة المطبخ المتنوعة
- أجهزة العناية الشخصية

【 الشاشات والإلكترونيات 】
- شاشات تلفزيون
- جوالات وتابلت ولابتوب

【 مواد التكييف 】
- مواسير نحاسية
- قطع غيار تكييف وتبريد
- توصيلات كهربائية

【 الخدمات 】
- توريد تكييف بجميع الأنواع
- تأسيس نحاس ومواسير
- تركيب وتشغيل تكييف (داخل المدينة فقط)
- دراسة وتنفيذ مشاريع التكييف المركزي
- صيانة وإصلاح الأجهزة
- توريد قطع الغيار

═══════════════════════════════════
أرقام وكلاء الصيانة المعتمدين
═══════════════════════════════════
- ميديا وبيكو: 920005637 / 8002440247
- تمكين: 920009257 / 8002444464
- باناسونيك وLG وميديا (مجموعة شاكر): 8002445454
- TCL ومولينكس وتيفال (العيسائي): 8002440305
- فيليبس (انشور): 8007526666
- الزامل: 920000468
- هيتاشي وجيبسون (حمد العيسى): 920015511

═══════════════════════════════════
العروض والخصومات
═══════════════════════════════════
- كود خصم VIP5 = خصم 5% على جميع المشتريات
- يطبق على: مدى، فيزا، ماستركارد، آبل باي
- عروض شهرية متجددة على الموقع

═══════════════════════════════════
سياسة التوصيل
═══════════════════════════════════
- مدة التوصيل: 3 إلى 7 أيام عمل (لا تشمل الجمعة)
- قد تصل لـ 15 يوم في حالات استثنائية
- التوصيل داخل المدينة: للعنوان مباشرة
- التوصيل خارج المدينة: استلام من فرع شركة الشحن

═══════════════════════════════════
سياسة الاسترجاع والاستبدال
═══════════════════════════════════
✅ يحق للعميل الاسترجاع أو الاستبدال خلال 7 أيام من الاستلام
✅ شرط: المنتج بحالته الأصلية غير مستخدم مع الكرتون وجميع الملحقات
❌ لا يمكن استرجاع أو استبدال المكيف بعد التركيب
❌ الشركة غير مسؤولة عن تمديد التغذية الكهربائية للمكيف
❌ الشركة لا ترفع الأجهزة للأدوار العلوية

═══════════════════════════════════
الضمان
═══════════════════════════════════
- ضمان المنتجات: سنتان من تاريخ الشراء
- بعد التوريد: الضمان على عاتق الوكيل المعتمد
- لتقديم بلاغ عطل: عبر الموقع ostar.com.sa

═══════════════════════════════════
قواعد صارمة جداً — لا استثناء
═══════════════════════════════════

🚫 ممنوع منعاً باتاً:
- أي رد خارج نطاق شركة نجوم العمران
- الحديث عن المواعيد أو حجزها أو مناقشتها
- التفاوض أو النقاش مع العميل
- إعطاء خصومات غير كود VIP5
- الحديث عن المنافسين
- ذكر أسعار غير موجودة في بياناتك

✅ إذا سأل عن موعد أو تركيب أو صيانة:
رد فقط بـ: "للحجز والمواعيد تواصل معنا مباشرة على 00966148666667 أو عبر موقعنا ostar.com.sa 😊"

✅ إذا سألك عن أي شيء لا تعرفه:
رد فقط بـ: "سأحوّل سؤالك لأحد مختصينا الآن 🙏"

✅ ردودك دائماً:
- مختصرة لا تتجاوز 3 أسطر
- واضحة ومباشرة
- ذكّر بكود VIP5 عند كل استفسار عن الشراء
`;

// ==========================================
// 1. التحقق من Webhook
// ==========================================
app.get("/webhook", (req, res) => {
  console.log("🔍 طلب تحقق وصل");
  console.log("Query params:", JSON.stringify(req.query));

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("Mode:", mode);
  console.log("Token المُرسل من Meta:", token);
  console.log("Token المتوقع في الخادم:", CONFIG.VERIFY_TOKEN);
  console.log("متطابق؟", token === CONFIG.VERIFY_TOKEN);

  if (mode === "subscribe" && token === CONFIG.VERIFY_TOKEN) {
    console.log("✅ Webhook verified بنجاح!");
    res.status(200).send(challenge);
  } else {
    console.log("❌ فشل التحقق — Token غير متطابق");
    res.sendStatus(403);
  }
});

// ==========================================
// 2. استقبال الرسائل من واتساب
// ==========================================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const body = req.body;
    console.log("📦 رسالة واردة:", JSON.stringify(body, null, 2));

    if (body.object !== "whatsapp_business_account") {
      console.log("⚠️ ليس حساب واتساب بيزنس");
      return;
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages?.length) {
      console.log("⚠️ لا توجد رسائل في الطلب");
      return;
    }

    const msg = messages[0];
    const from = msg.from;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const text = msg.text?.body;

    console.log(`📩 رسالة من ${from}: ${text}`);
    console.log(`📱 Phone Number ID: ${phoneNumberId}`);

    if (!text) {
      console.log("⚠️ الرسالة ليست نصية");
      return;
    }

    if (!phoneNumberId) {
      console.log("❌ Phone Number ID مفقود!");
      return;
    }

    await saveMessage(from, text, "user", phoneNumberId);
    const history = await getConversationHistory(from);
    const aiReply = await getAIResponse(history, text);
    const finalReply = await processSpecialCommands(aiReply, from);

    await sendWhatsAppMessage(from, finalReply, phoneNumberId);
    await saveMessage(from, finalReply, "assistant", phoneNumberId);

  } catch (err) {
    console.error("❌ خطأ:", err.message);
    if (err.response) {
      console.error("تفاصيل الخطأ:", JSON.stringify(err.response.data, null, 2));
    }
  }
});

// ==========================================
// 3. الذكاء الاصطناعي (Claude)
// ==========================================
async function getAIResponse(history, newMessage) {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage }
  ];

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    },
    {
      headers: {
        "x-api-key": CONFIG.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
    }
  );

  const reply = response.data.content[0].text;
  console.log(`🤖 رد الذكاء: ${reply}`);
  return reply;
}

// ==========================================
// 4. معالجة الأوامر الخاصة
// ==========================================
async function processSpecialCommands(reply, customerPhone) {
  const bookMatch = reply.match(/\[BOOK_APPOINTMENT:(.+?):(.+?):(.+?):(.+?)\]/);
  if (bookMatch) {
    const [_, name, date, time, service] = bookMatch;
    await bookAppointment({ name, date, time, service, phone: customerPhone });
    return reply.replace(/\[BOOK_APPOINTMENT:.*?\]/, "").trim();
  }
  return reply;
}

async function bookAppointment({ name, date, time, service, phone }) {
  const { error } = await supabase.from("appointments").insert({
    customer_name: name,
    customer_phone: phone,
    date,
    time,
    service,
    status: "confirmed",
    booked_via: "whatsapp_ai",
    created_at: new Date().toISOString(),
  });
  if (error) console.error("❌ خطأ في حجز الموعد:", error);
  else console.log(`✅ موعد محجوز: ${name} - ${date} ${time}`);
}

// ==========================================
// 5. إرسال رسالة واتساب
// ==========================================
async function sendWhatsAppMessage(to, text, phoneNumberId) {
  console.log(`📤 إرسال رد إلى ${to}...`);
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(`✅ رد أُرسل بنجاح إلى ${to}`);
  return response.data;
}

// ==========================================
// 6. قاعدة البيانات
// ==========================================
async function saveMessage(phone, content, role, phoneNumberId) {
  const { error } = await supabase.from("messages").insert({
    customer_phone: phone,
    content,
    role,
    whatsapp_number_id: phoneNumberId,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("❌ خطأ في حفظ الرسالة:", error.message);
}

async function getConversationHistory(phone) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: true })
    .limit(20);
  if (error) console.error("❌ خطأ في جلب التاريخ:", error.message);
  return data || [];
}

// ==========================================
// 7. API للداشبورد
// ==========================================
app.get("/api/conversations", async (req, res) => {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  res.json(data || []);
});

app.get("/api/appointments", async (req, res) => {
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true });
  res.json(data || []);
});

// صفحة رئيسية للتأكد
app.get("/", (req, res) => {
  res.json({ status: "✅ الخادم يعمل", time: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log("🚀 الخادم يعمل على المنفذ 3000");
  console.log("🌐 Webhook URL: http://localhost:3000/webhook");
});
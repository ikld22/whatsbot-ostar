// server.js - نجوم العمران — مع دعم التذاكر والصور والقوالب
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// ── CORS ──────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const CONFIG = {
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || "ostar2024secret",
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
};

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
ساعات العمل: 8 صباحاً حتى 12 منتصف الليل — يومياً
التوصيل: لجميع أنحاء المملكة العربية السعودية
التركيب: داخل المدينة المنورة فقط

═══════════════════════════════════
الفروع — المدينة المنورة
═══════════════════════════════════
1. فرع السلام
2. فرع شوران
3. فرع حي الفتح — تكييف مركزي
4. فرع الدائري — تكييف مركزي
5. فرع سوق الكهرباء — تكييف مركزي
6. فرع قباء — تكييف مركزي
+ فرع قطع غيار التكييف والتبريد

═══════════════════════════════════
المنتجات والخدمات
═══════════════════════════════════
- مكيفات سبليت، شباك، دكت، مركزية، دولابي
- غرف تبريد وتجميد
- أجهزة منزلية كبيرة وصغيرة
- شاشات وإلكترونيات وجوالات
- تأسيس نحاس، تركيب، صيانة وإصلاح
- دراسة مشاريع التكييف المركزي
- الماركات: General Supreme، ميديا، LG، باناسونيك

═══════════════════════════════════
العروض والخصومات
═══════════════════════════════════
- كود خصم VIP5 = 5% على جميع المشتريات
- يطبق على: مدى، فيزا، ماستركارد، آبل باي

═══════════════════════════════════
سياسة الاسترجاع والضمان
═══════════════════════════════════
- استرجاع واستبدال خلال 7 أيام من الاستلام
- ضمان سنتان من تاريخ الشراء
- لا يمكن استرجاع المكيف بعد التركيب

═══════════════════════════════════
قواعد صارمة
═══════════════════════════════════
🚫 ممنوع:
- أي رد خارج نطاق الشركة
- الحديث عن المواعيد أو حجزها
- إعطاء خصومات غير VIP5
- الحديث عن المنافسين

✅ إذا سأل عن موعد أو صيانة أو تركيب:
رد: "للحجز تواصل على 00966148666667 أو ostar.com.sa 😊"
وأنشئ تذكرة تلقائياً بـ [CREATE_TICKET:نوع_المشكلة]

✅ إذا أرسل صورة:
رد: "شكراً، تم استلام الصورة وإضافتها لطلبك 📸 سيتواصل معك فريقنا قريباً"

✅ إذا لم تعرف الجواب:
رد: "سأحوّل سؤالك لأحد مختصينا الآن 🙏"
وأنشئ تذكرة بـ [CREATE_TICKET:استفسار]

✅ ردودك: مختصرة، واضحة، لا تتجاوز 3 أسطر
✅ ذكّر بكود VIP5 عند كل استفسار عن الشراء
`;

// ==========================================
// 1. التحقق من Webhook
// ==========================================
app.get("/webhook", (req, res) => {
  console.log("🔍 طلب تحقق وصل");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  console.log("Token المُرسل:", token, "| المتوقع:", CONFIG.VERIFY_TOKEN, "| متطابق؟", token === CONFIG.VERIFY_TOKEN);
  if (mode === "subscribe" && token === CONFIG.VERIFY_TOKEN) {
    console.log("✅ Webhook verified بنجاح!");
    res.status(200).send(challenge);
  } else {
    console.log("❌ فشل التحقق");
    res.sendStatus(403);
  }
});

// ==========================================
// 2. استقبال الرسائل
// ==========================================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") return;

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    if (!messages?.length) return;

    const msg = messages[0];
    const from = msg.from;
    const phoneNumberId = value?.metadata?.phone_number_id;
    const msgType = msg.type;

    console.log(`📩 رسالة من ${from} — النوع: ${msgType}`);

    // معالجة حسب نوع الرسالة
    if (msgType === "text") {
      await handleTextMessage(from, msg.text.body, phoneNumberId);
    } else if (msgType === "image" || msgType === "video" || msgType === "document" || msgType === "audio") {
      await handleMediaMessage(from, msg, msgType, phoneNumberId);
    } else {
      console.log("⚠️ نوع رسالة غير مدعوم:", msgType);
    }

  } catch (err) {
    console.error("❌ خطأ:", err.message);
    if (err.response) console.error("تفاصيل:", JSON.stringify(err.response.data, null, 2));
  }
});

// ==========================================
// 3. معالجة الرسائل النصية
// ==========================================
async function handleTextMessage(from, text, phoneNumberId) {
  await saveMessage(from, text, "user", phoneNumberId);
  const history = await getConversationHistory(from);
  const aiReply = await getAIResponse(history, text);
  const finalReply = await processSpecialCommands(aiReply, from, phoneNumberId);
  await sendWhatsAppMessage(from, finalReply, phoneNumberId);
  await saveMessage(from, finalReply, "assistant", phoneNumberId);
}

// ==========================================
// 4. معالجة الصور والوسائط
// ==========================================
async function handleMediaMessage(from, msg, mediaType, phoneNumberId) {
  const mediaObj = msg[mediaType];
  const mediaId = mediaObj?.id;
  const caption = mediaObj?.caption || "";
  const mimeType = mediaObj?.mime_type || "";

  // جلب رابط الصورة من Meta
  let mediaUrl = null;
  try {
    const urlRes = await axios.get(
      `https://graph.facebook.com/v19.0/${mediaId}`,
      { headers: { Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}` } }
    );
    mediaUrl = urlRes.data.url;
  } catch (e) {
    console.error("❌ خطأ في جلب رابط الوسائط:", e.message);
  }

  // إيجاد أو إنشاء تذكرة للعميل
  const ticket = await getOrCreateTicket(from, "صيانة", caption || "أرسل العميل وسائط");

  // حفظ الوسائط
  await supabase.from("media").insert({
    ticket_id: ticket.id,
    customer_phone: from,
    media_type: mediaType,
    media_id: mediaId,
    media_url: mediaUrl,
    caption,
    mime_type: mimeType,
    created_at: new Date().toISOString(),
  });

  console.log(`📸 وسائط محفوظة للتذكرة: ${ticket.ticket_number}`);

  // إرسال رد للعميل
  const reply = `شكراً، تم استلام ${mediaType === "image" ? "الصورة" : "الملف"} وإضافتها لطلبك رقم ${ticket.ticket_number} 📸\nسيتواصل معك فريقنا قريباً 🌟`;
  await sendWhatsAppMessage(from, reply, phoneNumberId);
  await saveMessage(from, reply, "assistant", phoneNumberId);
}

// ==========================================
// 5. الذكاء الاصطناعي
// ==========================================
async function getAIResponse(history, newMessage) {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage }
  ];
  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    { model: "claude-sonnet-4-20250514", max_tokens: 500, system: SYSTEM_PROMPT, messages },
    { headers: { "x-api-key": CONFIG.CLAUDE_API_KEY, "anthropic-version": "2023-06-01", "Content-Type": "application/json" } }
  );
  const reply = response.data.content[0].text;
  console.log(`🤖 رد الذكاء: ${reply}`);
  return reply;
}

// ==========================================
// 6. معالجة الأوامر الخاصة
// ==========================================
async function processSpecialCommands(reply, from, phoneNumberId) {
  // كشف إنشاء تذكرة
  const ticketMatch = reply.match(/\[CREATE_TICKET:(.+?)\]/);
  if (ticketMatch) {
    const type = ticketMatch[1];
    const ticket = await getOrCreateTicket(from, type);
    console.log(`🎫 تذكرة منشأة: ${ticket.ticket_number}`);
    return reply.replace(/\[CREATE_TICKET:.*?\]/, "").trim();
  }
  return reply;
}

// ==========================================
// 7. إدارة التذاكر
// ==========================================
async function getOrCreateTicket(phone, type = "أخرى", description = "") {
  // تحقق من وجود تذكرة مفتوحة للعميل
  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("customer_phone", phone)
    .in("status", ["جديد", "قيد المعالجة"])
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) return existing[0];

  // إنشاء تذكرة جديدة
  const ticketNumber = `OST-${Date.now().toString().slice(-6)}`;
  const { data: newTicket } = await supabase
    .from("tickets")
    .insert({
      ticket_number: ticketNumber,
      customer_phone: phone,
      type,
      status: "جديد",
      priority: "متوسط",
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log(`🎫 تذكرة جديدة: ${ticketNumber} للعميل: ${phone}`);
  return newTicket;
}

// ==========================================
// 8. إرسال رسالة واتساب
// ==========================================
async function sendWhatsAppMessage(to, text, phoneNumberId) {
  console.log(`📤 إرسال رد إلى ${to}...`);
  await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    { messaging_product: "whatsapp", to, type: "text", text: { body: text } },
    { headers: { Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
  );
  console.log(`✅ رد أُرسل بنجاح إلى ${to}`);
}

// ==========================================
// 9. قاعدة البيانات
// ==========================================
async function saveMessage(phone, content, role, phoneNumberId) {
  const { error } = await supabase.from("messages").insert({
    customer_phone: phone, content, role,
    whatsapp_number_id: phoneNumberId,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("❌ خطأ في حفظ الرسالة:", error.message);
}

async function getConversationHistory(phone) {
  const { data } = await supabase
    .from("messages").select("role, content")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: true }).limit(20);
  return data || [];
}

// ==========================================
// 10. API للداشبورد
// ==========================================
app.get("/api/conversations", async (req, res) => {
  const { data } = await supabase.from("messages").select("*")
    .order("created_at", { ascending: false }).limit(100);
  res.json(data || []);
});

app.get("/api/tickets", async (req, res) => {
  const { data } = await supabase.from("tickets").select("*")
    .order("created_at", { ascending: false });
  res.json(data || []);
});

app.get("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single();
  const { data: media } = await supabase.from("media").select("*").eq("ticket_id", id);
  const { data: msgs } = await supabase.from("messages").select("*").eq("customer_phone", ticket?.customer_phone).order("created_at");
  res.json({ ticket, media: media || [], messages: msgs || [] });
});

app.patch("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };
  const { data } = await supabase.from("tickets").update(updates).eq("id", id).select().single();
  res.json(data);
});

app.get("/api/templates", async (req, res) => {
  const { data } = await supabase.from("templates").select("*").eq("is_active", true);
  res.json(data || []);
});

app.post("/api/templates", async (req, res) => {
  const { data } = await supabase.from("templates").insert(req.body).select().single();
  res.json(data);
});

app.get("/api/appointments", async (req, res) => {
  const { data } = await supabase.from("appointments").select("*").order("date", { ascending: true });
  res.json(data || []);
});

app.get("/api/stats", async (req, res) => {
  const { count: totalMsgs } = await supabase.from("messages").select("*", { count: "exact", head: true });
  const { count: openTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true }).in("status", ["جديد", "قيد المعالجة"]);
  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true });
  const { count: totalMedia } = await supabase.from("media").select("*", { count: "exact", head: true });
  res.json({ totalMsgs, openTickets, totalTickets, totalMedia });
});

// ── تلخيص المحادثة بالذكاء ──
app.post("/api/summarize", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages?.length) return res.json({ summary: "" });

    const conv = messages.map(m =>
      `${m.role === "user" ? "العميل" : "البوت"}: ${m.content}`
    ).join("\n");

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{
          role: "user",
          content: `لخص هذه المحادثة بإيجاز شديد (3 أسطر فقط):\n📋 ما أراده العميل:\n✅ ما تم:\n😊 الرضا: [ممتاز/جيد/متوسط/سيء]\n\n${conv}`
        }]
      },
      {
        headers: {
          "x-api-key": CONFIG.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        }
      }
    );
    res.json({ summary: response.data.content[0].text });
  } catch (err) {
    console.error("❌ خطأ في التلخيص:", err.message);
    res.json({ summary: "" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "✅ الخادم يعمل", time: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log("🚀 الخادم يعمل على المنفذ 3000");
  console.log("🌐 Webhook URL: http://localhost:3000/webhook");
});

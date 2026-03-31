// ==========================================
// نجوم العمران - نظام الرد الآلي عبر واتساب
// النسخة الكاملة مع دعم الصور والتذاكر والتعليمات الكاملة
// ==========================================

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
console.log("🚀 تشغيل خادم نجوم العمران");
console.log("VERIFY_TOKEN:", CONFIG.VERIFY_TOKEN);
console.log("WHATSAPP_TOKEN:", CONFIG.WHATSAPP_TOKEN ? "✅ موجود" : "❌ مفقود");
console.log("CLAUDE_API_KEY:", CONFIG.CLAUDE_API_KEY ? "✅ موجود" : "❌ مفقود");
console.log("SUPABASE_URL:", CONFIG.SUPABASE_URL ? "✅ موجود" : "❌ مفقود");
console.log("═══════════════════════════════");

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ==========================================
// === البرومت الرسمي المعتمد (دمج التعليمات) ===
// ==========================================
const SYSTEM_PROMPT = `
أنت مساعد ذكي لشركة **نجوم العمران ** عبر واتساب.
**ردودك:** باللهجة السعودية الودودة، بسيطة، محترمة، ومختصرة لا تتجاوز 4 أسطر.
**أسلوبك:** يا هلا والله، حياك الله، شرفتنا، أستخدم عبارات يومية بسيطة.

═══════════════════════════════════
معلومات الشركة الأساسية
═══════════════════════════════════
الاسم: شركة نجوم العمران للتجارة والمقاولات — العلامة التجارية: OStar (أوستار)
التأسيس: منذ أكثر من 10 سنوات
الموقع الإلكتروني: ostar.com.sa
التواصل المباشر: 966920015574+
ساعات العمل: 8 صباحاً حتى 4 عصراً (للتركيبات) / المتجر متاح يومياً
التوصيل: لجميع أنحاء المملكة العربية السعودية
التركيب: داخل المدينة المنورة فقط
الفروع (المدينة المنورة): السلام، شوران، حي الفتح، الدائري، سوق الكهرباء، قباء، وفرع قطع الغيار.

═══════════════════════════════════
المنتجات والخدمات
═══════════════════════════════════
- أنظمة التكييف: شباك، سبليت، مخفي (كونسيلد)، مركزي (بكج)، VRF، تشيلرات، تبريد صحراوي.
- غرف تبريد وتجميد.
- أجهزة منزلية: ثلاجات، غسالات، مجففات، شاشات، أفران.
- خدمات: تأسيس نحاس، تركيب، صيانة، دراسة مشاريع.
- الماركات: General Supreme، ميديا، LG، باناسونيك، TCL، AUX.

═══════════════════════════════════
العروض والخصومات
═══════════════════════════════════
- كود الخصم الوحيد: VIP5 (خصم 5% على إجمالي الطلب).
- يطبق فقط عند الدفع بـ: فيزا، مدى، ماستركارد، آبل باي، أو التحويل البنكي.
- ممنوع منعاً باتاً إعطاء أي خصم أو كود آخر غير VIP5.

═══════════════════════════════════
سياسة الضمان
═══════════════════════════════════
- الأجهزة المنزلية: سنتان (24 شهراً) على الأعطال المصنعية حسب فاتورة الشراء.
- المكيفات: سنتان شامل + 5 سنوات على الكومبريسور (تصل لـ 10 لبعض الموديلات مثل AUX, TCL).
- الضمان على وكيل المنتج ويعتمد على الفاتورة الرسمية.

═══════════════════════════════════
قواعد صارمة (التعليمات التي لا تُخالف)
═══════════════════════════════════
🚫 **ممنوع تماماً:**
- تحديد أو تأكيد أي موعد للتركيب أو الصيانة. (الرد: "سيتم تحويل طلبك لقسم المواعيد وسنفيدك بأقرب فرصة").
- اختراع أسعار أو خصومات غير VIP5.
- الحديث عن المنافسين أو ماركات خارج نطاق الشركة.
- الرد في مواضيع خارج الأجهزة الكهربائية والتكييف (شعر، طب، دين).

✅ **عند سؤال عن موعد/صيانة/تركيب:**
رد: "شكراً لتواصلك 🌿 سيتم تحويل طلبك للقسم المختص لمراجعة الطلب، وسيتم إفادتك فور استلامنا للرد. نرجو تزويدنا برقم الجوال أو الفاتورة."

✅ **عند سؤال عن صيانة أو عطل:**
رد: "نعتذر للمشكلة، تم تحويل بلاغك لقسم الصيانة. يرجى تزويدنا برقم الفاتورة ووصف المشكلة."

✅ **عند سؤال عن التقسيط:**
رد: "متوفر تقسيط عبر تابي، تمارا، مدفوع، وإمكان. أطلب الآن واستمتع بالخدمة."

✅ **عند سؤال عن مكيف GREE:**
لا تذكر السعر حتى يحدد العميل: (نوع: شباك/سبليت، المقاس، بارد/حار).

✅ **إذا لم تعرف الجواب:**
رد: "المعذرة، المعلومة اللي طلبتها غير مضافة عندي حالياً، بسأل الفريق المختص وأعاود لك التواصل 🙏"

✅ **إذا أرسل صورة:**
رد: "شكراً، تم استلام الصورة وإضافتها لطلبك 📸 سيتواصل معك فريقنا قريباً"
وأنشئ تذكرة.
`;

// ==========================================
// 1. التحقق من Webhook
// ==========================================
app.get("/webhook", (req, res) => {
  console.log("🔍 طلب تحقق وصل");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
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

    if (msgType === "text") {
      await handleTextMessage(from, msg.text.body, phoneNumberId);
    } else if (msgType === "image" || msgType === "video" || msgType === "document" || msgType === "audio") {
      await handleMediaMessage(from, msg, msgType, phoneNumberId);
    }

  } catch (err) {
    console.error("❌ خطأ:", err.message);
  }
});

// ==========================================
// 3. معالجة الرسائل النصية
// ==========================================
async function handleTextMessage(from, text, phoneNumberId) {
  await saveMessage(from, text, "user", phoneNumberId);
  
  let finalReply = await getDirectReply(text);
  
  if (!finalReply) {
    const history = await getConversationHistory(from);
    const aiReply = await getAIResponse(history, text);
    finalReply = await processSpecialCommands(aiReply, from, phoneNumberId, text);
  }
  
  await sendWhatsAppMessage(from, finalReply, phoneNumberId);
  await saveMessage(from, finalReply, "assistant", phoneNumberId);
}

// ==========================================
// 4. الردود المباشرة
// ==========================================
async function getDirectReply(text) {
  const appointmentKeywords = /(موعد|تعديل موعد|تغيير موعد|حجز موعد|ابغى موعد|احتاج موعد|الموعد|المواعيد)/i;
  if (appointmentKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
نعتذر منكم، وسيتم تحويل طلبكم إلى القسم المختص بجدولة المواعيد لمراجعة الطلب،
وسيتم إفادتكم فور استلامنا للرد بإذن الله بأقرب فرصة متاحة.`;
  }
  
  const maintenanceKeywords = /(عطل|خراب|خربان|ما يشتغل|صيانة|تصليح|صلح|مشكلة|توقف|تعطل)/i;
  if (maintenanceKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
نعتذر منكم للمشكلة الحاصلة معكم، وسيتم تحويل طلبكم إلى القسم المختص بالصيانة لمراجعة البلاغ.`;
  }
  
  const discountKeywords = /(خصم|كود خصم|كوبون|VIP)/i;
  if (discountKeywords.test(text)) {
    return `نعم متوفر كود خصم على المتجر الإلكتروني VIP5، يخصم لك 5% من إجمالي الطلب.`;
  }
  
  const installmentKeywords = /(تقسيط|تابي|تمارا|مدفوع|إمكان|بالشهر|شهري)/i;
  if (installmentKeywords.test(text)) {
    return `راحة بالك تهمنا — وفرنا لك خيارات تقسيط مرنة وسهلة الدفع!
متوفر: تابي (4 دفعات بدون فوائد)، تمارا (حتى 24 شهر)، مدفوع، وإمكان.`;
  }
  
  const warrantyKeywords = /(ضمان|صيانة ضمان|ضمان الجهاز)/i;
  if (warrantyKeywords.test(text)) {
    return `ضمان الأجهزة الكهربائية المنزلية سنتان (24 شهراً) من تاريخ الشراء حسب تعليمات وزارة التجارة.`;
  }
  
  const greeKeywords = /(جري|قري|GREE)/i;
  if (greeKeywords.test(text)) {
    return `بخصوص استفسارك عن مكيف GREE (جري)، هل ترغب في معرفة السعر لـ مكيف شباك جري أم سبليت جري؟`;
  }
  
  const samsungKeywords = /(سامسونج|سمسونج|Samsung)/i;
  if (samsungKeywords.test(text)) {
    return `ثلاجات سامسونج تجمع بين التصميم العصري وتقنية التبريد الذكي. لدينا مجموعة من ثلاجات سامسونج بمقاسات متنوعة.`;
  }
  
  const mobileKeywords = /(جوال|جوالات|ايفون|آيفون)/i;
  if (mobileKeywords.test(text)) {
    return `تتوفر لدينا جوالات في فرع السلام والمتجر الإلكتروني www.ostar.com.sa`;
  }
  
  const hrKeywords = /(وظيفة|توظيف|شغل|وظايف|انضمام)/i;
  if (hrKeywords.test(text)) {
    return `شكراً لتواصلك معنا. يرجى إرسال سيرتك الذاتية على البريد: CEO@OSTAR.SA`;
  }
  
  const outOfScope = /(شعر|طب|دكتور|علاج|فتوى|دين|صلاة|زكاة|حج|عمرة)/i;
  if (outOfScope.test(text)) {
    return `نعتذر، لست مختصاً في هذا المجال. أنا متواجد لخدمة العملاء فقط في مجال الأجهزة الكهربائية والمنزلية.`;
  }
  
  return null;
}

// ==========================================
// 5. معالجة الصور والوسائط
// ==========================================
async function handleMediaMessage(from, msg, mediaType, phoneNumberId) {
  const mediaObj = msg[mediaType];
  const mediaId = mediaObj?.id;
  const caption = mediaObj?.caption || "";
  const mimeType = mediaObj?.mime_type || "";

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

  const ticket = await getOrCreateTicket(from, "صيانة", caption || "أرسل العميل وسائط");

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

  const reply = `شكراً، تم استلام ${mediaType === "image" ? "الصورة" : "الملف"} وإضافتها لطلبك رقم ${ticket.ticket_number} 📸\nسيتواصل معك فريقنا قريباً 🌟`;
  await sendWhatsAppMessage(from, reply, phoneNumberId);
  await saveMessage(from, reply, "assistant", phoneNumberId);
}

// ==========================================
// 6. الذكاء الاصطناعي (كلود) - للواتساب
// ==========================================
async function getAIResponse(history, newMessage) {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: newMessage }
  ];
  
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages
      },
      {
        headers: {
          "x-api-key": CONFIG.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        }
      }
    );
    const reply = response.data.content[0].text;
    console.log(`🤖 رد الذكاء: ${reply}`);
    return reply;
  } catch (error) {
    console.error("❌ خطأ في الذكاء الاصطناعي:", error.message);
    return "المعذرة، المعلومة اللي طلبتها غير مضافة عندي حالياً. بسأل الفريق المختص وأعاود لك التواصل 🙏";
  }
}

// ==========================================
// 7. API للذكاء الاصطناعي من الواجهة (Frontend)
// ==========================================
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !messages.length) {
      return res.status(400).json({ error: "لا توجد رسائل" });
    }

    console.log(`🤖 طلب ذكاء اصطناعي من الواجهة: ${messages.length} رسائل`);

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      },
      {
        headers: {
          "x-api-key": CONFIG.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.content[0].text;
    console.log(`✅ رد الذكاء للواجهة: ${reply.substring(0, 100)}...`);
    res.json({ reply });
    
  } catch (error) {
    console.error("❌ خطأ في Claude API (واجهة):", error.message);
    if (error.response) {
      console.error("تفاصيل الخطأ:", error.response.data);
    }
    res.status(500).json({ error: "حدث خطأ في معالجة الطلب", details: error.message });
  }
});

// ==========================================
// 8. معالجة الأوامر الخاصة
// ==========================================
async function processSpecialCommands(reply, from, phoneNumberId, text) {
  const needsTicket = /(صيانة|عطل|موعد|تغيير|شكوى|مشكلة|تركيب)/i.test(text);
  
  if (needsTicket && !reply.includes("تم تحويل طلبكم")) {
    await getOrCreateTicket(from, "استفسار", text);
  }
  
  return reply;
}

// ==========================================
// 9. إدارة التذاكر
// ==========================================
async function getOrCreateTicket(phone, type = "أخرى", description = "") {
  const { data: existing } = await supabase
    .from("tickets")
    .select("*")
    .eq("customer_phone", phone)
    .in("status", ["جديد", "قيد المعالجة"])
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) return existing[0];

  const ticketNumber = `OST-${Date.now().toString().slice(-6)}`;
  const { data: newTicket } = await supabase
    .from("tickets")
    .insert({
      ticket_number: ticketNumber,
      customer_phone: phone,
      type: type,
      status: "جديد",
      priority: "متوسط",
      description: description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log(`🎫 تذكرة جديدة: ${ticketNumber}`);
  return newTicket;
}

// ==========================================
// 10. إرسال رسالة واتساب
// ==========================================
async function sendWhatsAppMessage(to, text, phoneNumberId) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text }
      },
      {
        headers: { Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}` }
      }
    );
  } catch (error) {
    console.error("❌ خطأ في إرسال الرسالة:", error.message);
  }
}

// ==========================================
// 11. حفظ الرسائل
// ==========================================
async function saveMessage(phone, content, role, phoneNumberId) {
  await supabase.from("messages").insert({
    customer_phone: phone,
    content: content,
    role: role,
    whatsapp_number_id: phoneNumberId,
    created_at: new Date().toISOString(),
  });
}

// ==========================================
// 12. جلب سجل المحادثة
// ==========================================
async function getConversationHistory(phone) {
  const { data } = await supabase
    .from("messages")
    .select("role, content")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: true })
    .limit(20);
  return data || [];
}

// ==========================================
// 13. APIs للداشبورد
// ==========================================
app.get("/api/conversations", async (req, res) => {
  const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100);
  res.json(data || []);
});

app.get("/api/tickets", async (req, res) => {
  const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
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
  const { data } = await supabase.from("tickets").update({ ...req.body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
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

app.get("/api/stats", async (req, res) => {
  const { count: totalMsgs } = await supabase.from("messages").select("*", { count: "exact", head: true });
  const { count: openTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true }).in("status", ["جديد", "قيد المعالجة"]);
  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true });
  const { count: totalMedia } = await supabase.from("media").select("*", { count: "exact", head: true });
  res.json({ totalMsgs, openTickets, totalTickets, totalMedia });
});

// ==========================================
// 14. تلخيص المحادثة
// ==========================================
app.post("/api/summarize", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages?.length) return res.json({ summary: "" });

    const conv = messages.map(m => `${m.role === "user" ? "العميل" : "البوت"}: ${m.content}`).join("\n");

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: `لخص هذه المحادثة بإيجاز شديد:\n📋 ما أراده العميل:\n✅ ما تم:\n😊 الرضا: [ممتاز/جيد/متوسط/سيء]\n\n${conv}` }]
      },
      { headers: { "x-api-key": CONFIG.CLAUDE_API_KEY, "anthropic-version": "2023-06-01" } }
    );
    res.json({ summary: response.data.content[0].text });
  } catch (err) {
    res.json({ summary: "" });
  }
});

// ==========================================
// 15. الصفحة الرئيسية
// ==========================================
app.get("/", (req, res) => {
  res.json({ status: "✅ خادم نجوم العمران يعمل", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 خادم نجوم العمران يعمل على المنفذ ${PORT}`);
  console.log(`🌐 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🤖 AI Chat API: /api/ai/chat`);
});

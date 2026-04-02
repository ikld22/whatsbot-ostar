// ============================================================
// server.js — نجوم العمران (OStar) WhatsApp AI Server
// الإصدار: 2.0 | يشمل: بوت، تذاكر، قوالب، زد، سجل نشاطات
// تشغيل: npm install && node server.js
// ============================================================

require("dotenv").config();
const express = require("express");
const axios   = require("axios");
const cors    = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());
app.use(cors());

// ============================================================
// الإعدادات
// ============================================================
const CONFIG = {
  WHATSAPP_TOKEN : process.env.WHATSAPP_TOKEN,
  VERIFY_TOKEN   : process.env.VERIFY_TOKEN || "ostar2025",
  CLAUDE_API_KEY : process.env.CLAUDE_API_KEY,
  SUPABASE_URL   : process.env.SUPABASE_URL,
  SUPABASE_KEY   : process.env.SUPABASE_KEY,
  ZID_API_KEY    : process.env.ZID_API_KEY,
  ZID_STORE_URL  : process.env.ZID_STORE_URL || "https://api.zid.sa/v1",
  PORT           : process.env.PORT || 3000,
};

console.log("═══════════════════════════════════════════");
console.log("🌟 نجوم العمران — WhatsApp AI Server v2.0");
console.log("VERIFY_TOKEN  :", CONFIG.VERIFY_TOKEN);
console.log("WHATSAPP_TOKEN:", CONFIG.WHATSAPP_TOKEN  ? "✅" : "❌ مفقود");
console.log("CLAUDE_API_KEY:", CONFIG.CLAUDE_API_KEY  ? "✅" : "❌ مفقود");
console.log("SUPABASE_URL  :", CONFIG.SUPABASE_URL    ? "✅" : "❌ مفقود");
console.log("ZID_API_KEY   :", CONFIG.ZID_API_KEY     ? "✅" : "⚠️  اختياري");
console.log("═══════════════════════════════════════════");

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ============================================================
// System Prompt — نجوم العمران
// ============================================================
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

// ============================================================
// HELPERS — سجل النشاطات
// ============================================================
async function logActivity({ action, details, phone = null, agent = "system" }) {
  try {
    await supabase.from("activity_logs").insert({
      action,
      details,
      customer_phone: phone,
      performed_by: agent,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("⚠️ logActivity error:", e.message);
  }
}

// ============================================================
// 1. Webhook — التحقق
// ============================================================
app.get("/webhook", (req, res) => {
  const mode      = req.query["hub.mode"];
  const token     = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("🔍 Webhook verify — token:", token, "| match:", token === CONFIG.VERIFY_TOKEN);

  if (mode === "subscribe" && token === CONFIG.VERIFY_TOKEN) {
    console.log("✅ Webhook verified!");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Webhook verify failed");
    res.sendStatus(403);
  }
});

// ============================================================
// 2. Webhook — استقبال الرسائل
// ============================================================
app.post("/webhook", async (req, res) => {
  res.sendStatus(200); // رد فوري لواتساب

  try {
    const body = req.body;
    if (body.object !== "whatsapp_business_account") return;

    const entry         = body.entry?.[0];
    const changes       = entry?.changes?.[0];
    const value         = changes?.value;
    const messages      = value?.messages;
    const phoneNumberId = value?.metadata?.phone_number_id;

    if (!messages?.length) return;

    const msg  = messages[0];
    const from = msg.from;

    // ── رسائل نصية فقط ──
    if (msg.type !== "text" || !msg.text?.body) {
      console.log(`⚠️ رسالة غير نصية من ${from} (${msg.type})`);
      // رد بمحتوى مناسب
      await sendWhatsAppMessage(
        from,
        "أهلاً بك في نجوم العمران 🌟\nنأسف، ندعم الرسائل النصية فقط حالياً. تفضل بكتابة استفسارك 😊",
        phoneNumberId
      );
      return;
    }

    const text = msg.text.body.trim();
    console.log(`📩 [${from}]: ${text}`);

    // ── حفظ رسالة العميل ──
    await saveMessage(from, text, "user", phoneNumberId);
    await logActivity({ action: "incoming_message", details: text, phone: from });

    // ── التحقق من وضع التحويل للدعم البشري ──
    const humanMode = await isHumanMode(from);
    if (humanMode) {
      console.log(`👤 ${from} في وضع الدعم البشري — تخطي الذكاء`);
      await notifyAgents(from, text); // إشعار الوكلاء (Supabase Realtime)
      return;
    }

    // ── الرد بالذكاء الاصطناعي ──
    const history    = await getConversationHistory(from);
    const aiReply    = await getAIResponse(history, text);
    const finalReply = await processSpecialCommands(aiReply, from);

    await sendWhatsAppMessage(from, finalReply, phoneNumberId);
    await saveMessage(from, finalReply, "assistant", phoneNumberId);
    await logActivity({ action: "ai_reply", details: finalReply, phone: from });

    // ── كشف الحاجة لتذكرة تلقائية ──
    await autoCreateTicketIfNeeded(from, text);

  } catch (err) {
    console.error("❌ webhook error:", err.message);
    if (err.response) console.error("API error:", JSON.stringify(err.response.data));
  }
});

// ============================================================
// 3. الذكاء الاصطناعي (Claude)
// ============================================================
async function getAIResponse(history, newMessage) {
  // جلب قوالب الردود من Supabase لإضافتها للـ context
  const { data: templates } = await supabase
    .from("reply_templates")
    .select("name, content")
    .limit(10);

  let templatesContext = "";
  if (templates?.length) {
    templatesContext = "\n\nقوالب ردود مُعتمدة يمكن استخدامها:\n" +
      templates.map(t => `• ${t.name}: ${t.content}`).join("\n");
  }

  const messages = [
    ...history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: newMessage },
  ];

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model      : "claude-sonnet-4-20250514",
      max_tokens : 500,
      system     : SYSTEM_PROMPT + templatesContext,
      messages,
    },
    {
      headers: {
        "x-api-key"          : CONFIG.CLAUDE_API_KEY,
        "anthropic-version"  : "2023-06-01",
        "Content-Type"       : "application/json",
      },
    }
  );

  const reply = response.data.content[0].text;
  console.log(`🤖 AI reply: ${reply}`);
  return reply;
}

// ============================================================
// 4. معالجة الأوامر الخاصة
// ============================================================
async function processSpecialCommands(reply, customerPhone) {
  // حجز موعد: [BOOK_APPOINTMENT:الاسم:التاريخ:الوقت:الخدمة]
  const bookMatch = reply.match(/\[BOOK_APPOINTMENT:(.+?):(.+?):(.+?):(.+?)\]/);
  if (bookMatch) {
    const [, name, date, time, service] = bookMatch;
    await bookAppointment({ name, date, time, service, phone: customerPhone });
    return reply.replace(/\[BOOK_APPOINTMENT:.*?\]/, "").trim();
  }

  // تحويل لبشري: [TRANSFER_TO_HUMAN]
  if (reply.includes("[TRANSFER_TO_HUMAN]")) {
    await setHumanMode(customerPhone, true);
    await logActivity({ action: "transfer_to_human", details: "تحويل تلقائي من الذكاء", phone: customerPhone });
    return reply.replace("[TRANSFER_TO_HUMAN]", "").trim();
  }

  return reply;
}

async function bookAppointment({ name, date, time, service, phone }) {
  const { error } = await supabase.from("appointments").insert({
    customer_name  : name,
    customer_phone : phone,
    date,
    time,
    service,
    status         : "confirmed",
    booked_via     : "whatsapp_ai",
    created_at     : new Date().toISOString(),
  });
  if (error) console.error("❌ bookAppointment:", error);
  else {
    console.log(`✅ موعد محجوز: ${name} — ${date} ${time}`);
    await logActivity({ action: "appointment_booked", details: `${name} | ${service} | ${date} ${time}`, phone });
  }
}

// كشف تلقائي للرسائل التي تحتاج تذكرة (عطل، صيانة، شكوى)
async function autoCreateTicketIfNeeded(phone, text) {
  const keywords = ["عطل", "خراب", "مشكلة", "شكوى", "مو شغال", "ما يبرد", "ضجيج", "صوت", "تسريب", "ضمان"];
  const needs = keywords.some(k => text.includes(k));
  if (!needs) return;

  const { data: existing } = await supabase
    .from("tickets")
    .select("id")
    .eq("customer_phone", phone)
    .eq("status", "open")
    .single();

  if (existing) return; // تذكرة مفتوحة بالفعل

  await supabase.from("tickets").insert({
    customer_phone : phone,
    issue_text     : text,
    priority       : "high",
    status         : "open",
    source         : "auto_whatsapp",
    created_at     : new Date().toISOString(),
  });

  await logActivity({ action: "ticket_auto_created", details: text, phone });
  console.log(`🎫 تذكرة تلقائية أُنشئت لـ ${phone}`);
}

// ============================================================
// 5. إرسال رسالة واتساب
// ============================================================
async function sendWhatsAppMessage(to, text, phoneNumberId) {
  if (!CONFIG.WHATSAPP_TOKEN || !phoneNumberId) {
    console.warn("⚠️ WHATSAPP_TOKEN أو phoneNumberId مفقود، تخطي الإرسال");
    return;
  }
  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      messaging_product : "whatsapp",
      to,
      type              : "text",
      text              : { body: text },
    },
    {
      headers: {
        Authorization  : `Bearer ${CONFIG.WHATSAPP_TOKEN}`,
        "Content-Type" : "application/json",
      },
    }
  );
  console.log(`✅ رد أُرسل إلى ${to}`);
  return response.data;
}

// ============================================================
// 6. وضع الدعم البشري (Human Takeover)
// ============================================================
async function isHumanMode(phone) {
  const { data } = await supabase
    .from("conversations")
    .select("human_mode")
    .eq("customer_phone", phone)
    .single();
  return data?.human_mode === true;
}

async function setHumanMode(phone, enabled) {
  await supabase
    .from("conversations")
    .upsert({ customer_phone: phone, human_mode: enabled, updated_at: new Date().toISOString() });
}

async function notifyAgents(phone, text) {
  // يُحدّث جدول conversations لتظهر في لوحة التحكم بـ Supabase Realtime
  await supabase
    .from("conversations")
    .upsert({
      customer_phone : phone,
      last_message   : text,
      human_mode     : true,
      updated_at     : new Date().toISOString(),
    });
}

// ============================================================
// 7. قاعدة البيانات — رسائل
// ============================================================
async function saveMessage(phone, content, role, phoneNumberId) {
  const { error } = await supabase.from("messages").insert({
    customer_phone     : phone,
    content,
    role,
    whatsapp_number_id : phoneNumberId,
    created_at         : new Date().toISOString(),
  });
  if (error) console.error("❌ saveMessage:", error.message);
}

async function getConversationHistory(phone) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("customer_phone", phone)
    .order("created_at", { ascending: true })
    .limit(20);
  if (error) console.error("❌ getHistory:", error.message);
  return data || [];
}

// ============================================================
// 8. API للداشبورد — محادثات
// ============================================================
app.get("/api/conversations", async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const from = (page - 1) * limit;

    let query = supabase
      .from("messages")
      .select("customer_phone, content, role, created_at, whatsapp_number_id")
      .order("created_at", { ascending: false })
      .range(from, from + Number(limit) - 1);

    if (status) query = query.eq("role", status);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// آخر رسالة لكل عميل (للقائمة الجانبية)
app.get("/api/conversations/summary", async (req, res) => {
  try {
    const { data, error } = await supabase.rpc("get_conversation_summary");
    if (error) {
      // fallback بدون RPC
      const { data: msgs } = await supabase
        .from("messages")
        .select("customer_phone, content, role, created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      const map = {};
      (msgs || []).forEach(m => {
        if (!map[m.customer_phone]) map[m.customer_phone] = m;
      });
      return res.json(Object.values(map));
    }
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/conversations/:phone", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("customer_phone", req.params.phone)
      .order("created_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// تحويل محادثة لدعم بشري
app.post("/api/conversations/:phone/transfer", async (req, res) => {
  try {
    await setHumanMode(req.params.phone, true);
    await logActivity({ action: "transfer_to_human", details: "تحويل يدوي من الداشبورد", phone: req.params.phone, agent: req.body.agent || "dashboard" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// إعادة المحادثة للذكاء
app.post("/api/conversations/:phone/revert-ai", async (req, res) => {
  try {
    await setHumanMode(req.params.phone, false);
    await logActivity({ action: "revert_to_ai", details: "إعادة للذكاء من الداشبورد", phone: req.params.phone, agent: req.body.agent || "dashboard" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// إرسال رد يدوي من الداشبورد
app.post("/api/conversations/:phone/reply", async (req, res) => {
  try {
    const { text, phoneNumberId, agent } = req.body;
    if (!text) return res.status(400).json({ error: "text مطلوب" });

    await sendWhatsAppMessage(req.params.phone, text, phoneNumberId);
    await saveMessage(req.params.phone, text, "assistant", phoneNumberId);
    await logActivity({ action: "manual_reply", details: text, phone: req.params.phone, agent: agent || "dashboard" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 9. API — التذاكر
// ============================================================
app.get("/api/tickets", async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = supabase.from("tickets").select("*").order("created_at", { ascending: false });
    if (status)   query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const { customer_phone, customer_name, issue_text, priority, assigned_to } = req.body;
    const { data, error } = await supabase.from("tickets").insert({
      customer_phone, customer_name, issue_text,
      priority : priority || "medium",
      status   : "open",
      assigned_to,
      source   : "dashboard",
      created_at: new Date().toISOString(),
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "ticket_created", details: issue_text, phone: customer_phone });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/api/tickets/:id", async (req, res) => {
  try {
    const { status, assigned_to, notes } = req.body;
    const { data, error } = await supabase
      .from("tickets")
      .update({ status, assigned_to, notes, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "ticket_updated", details: `تذكرة ${req.params.id} → ${status}` });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 10. API — قوالب الردود
// ============================================================
app.get("/api/templates", async (req, res) => {
  try {
    const { data, error } = await supabase.from("reply_templates").select("*").order("created_at");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/templates", async (req, res) => {
  try {
    const { name, category, content } = req.body;
    if (!name || !content) return res.status(400).json({ error: "name و content مطلوبان" });
    const { data, error } = await supabase.from("reply_templates").insert({
      name, category, content, created_at: new Date().toISOString()
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "template_created", details: name });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/templates/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("reply_templates").delete().eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "template_deleted", details: `id: ${req.params.id}` });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 11. API — تكامل متجر زد
// ============================================================
app.get("/api/zid/products", async (req, res) => {
  try {
    if (!CONFIG.ZID_API_KEY) {
      // بيانات تجريبية إذا لم يُضف مفتاح زد
      return res.json([
        { id: 1, name: "مكيف سبليت General Supreme 1.5 طن", price: 1890, sale_price: null,    sku: "GS-18T",   category: "تكييف سبليت" },
        { id: 2, name: "مكيف سبليت ميديا 2 طن",             price: 2600, sale_price: 2350,    sku: "MD-24T",   category: "تكييف سبليت" },
        { id: 3, name: "مكيف شباك LG 1 طن",                 price: 1150, sale_price: null,    sku: "LG-W12",   category: "تكييف شباك"  },
        { id: 4, name: "ثلاجة باناسونيك 18 قدم",            price: 3100, sale_price: 2700,    sku: "PN-18FR",  category: "أجهزة منزلية" },
        { id: 5, name: "غسالة LG 7 كيلو أوتوماتيك",         price: 1600, sale_price: null,    sku: "LG-WM7",   category: "أجهزة منزلية" },
        { id: 6, name: "شاشة 55 بوصة 4K سامسونج",           price: 2995, sale_price: 2495,    sku: "SS-55UK",  category: "شاشات"        },
      ]);
    }

    const { data: cached } = await supabase
      .from("zid_products_cache")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(100);

    // إذا الكاش أحدث من ساعة، رجّع منه
    if (cached?.length && new Date() - new Date(cached[0].updated_at) < 3600000) {
      return res.json(cached);
    }

    // جلب من زد API
    const zidRes = await axios.get(`${CONFIG.ZID_STORE_URL}/products`, {
      headers: { "Authorization": `Bearer ${CONFIG.ZID_API_KEY}`, "Accept-Language": "ar" }
    });

    const products = zidRes.data?.products || [];

    // حفظ في الكاش
    await supabase.from("zid_products_cache").upsert(
      products.map(p => ({
        zid_id    : p.id,
        name      : p.name,
        price     : p.price,
        sale_price: p.sale_price || null,
        sku       : p.sku,
        category  : p.category?.name || "عام",
        updated_at: new Date().toISOString(),
      }))
    );

    await logActivity({ action: "zid_sync", details: `${products.length} منتج مزامن` });
    res.json(products);

  } catch (e) {
    console.error("❌ Zid API error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// مزامنة يدوية
app.post("/api/zid/sync", async (req, res) => {
  try {
    await supabase.from("zid_products_cache").delete().neq("id", 0);
    res.json({ success: true, message: "تم مسح الكاش، ستتم المزامنة عند الطلب التالي" });
    await logActivity({ action: "zid_manual_sync", details: "مزامنة يدوية من الداشبورد" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 12. API — سجل النشاطات
// ============================================================
app.get("/api/activity", async (req, res) => {
  try {
    const { limit = 100, phone } = req.query;
    let query = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit));
    if (phone) query = query.eq("customer_phone", phone);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 13. API — المستخدمين
// ============================================================
app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("id, name, email, role, is_active, created_at");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: "name و email مطلوبان" });
    const { data, error } = await supabase.from("users").insert({
      name, email, role: role || "agent",
      is_active: true, created_at: new Date().toISOString()
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "user_created", details: `${name} (${role})` });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("users").update({ is_active: false }).eq("id", req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    await logActivity({ action: "user_deactivated", details: `id: ${req.params.id}` });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 14. API — الإحصائيات
// ============================================================
app.get("/api/stats", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [msgs, tickets, aiMsgs] = await Promise.all([
      supabase.from("messages").select("id", { count: "exact" }).gte("created_at", today),
      supabase.from("tickets").select("id", { count: "exact" }).eq("status", "open"),
      supabase.from("messages").select("id", { count: "exact" }).eq("role", "assistant").gte("created_at", today),
    ]);

    const total    = msgs.count    || 0;
    const aiCount  = aiMsgs.count  || 0;
    const aiPct    = total ? Math.round((aiCount / total) * 100) : 0;

    res.json({
      messages_today    : total,
      ai_replies_today  : aiCount,
      ai_percentage     : aiPct,
      open_tickets      : tickets.count || 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// 15. Health check
// ============================================================
app.get("/", (req, res) => {
  res.json({
    status  : "✅ نجوم العمران Server يعمل",
    version : "2.0",
    time    : new Date().toISOString(),
    endpoints: [
      "GET  /webhook",
      "POST /webhook",
      "GET  /api/conversations",
      "GET  /api/conversations/summary",
      "GET  /api/conversations/:phone",
      "POST /api/conversations/:phone/reply",
      "POST /api/conversations/:phone/transfer",
      "POST /api/conversations/:phone/revert-ai",
      "GET  /api/tickets",
      "POST /api/tickets",
      "PATCH /api/tickets/:id",
      "GET  /api/templates",
      "POST /api/templates",
      "DELETE /api/templates/:id",
      "GET  /api/zid/products",
      "POST /api/zid/sync",
      "GET  /api/activity",
      "GET  /api/users",
      "POST /api/users",
      "DELETE /api/users/:id",
      "GET  /api/stats",
    ]
  });
});

// ============================================================
// تشغيل السيرفر
// ============================================================
app.listen(CONFIG.PORT, () => {
  console.log(`\n🚀 السيرفر يعمل على المنفذ ${CONFIG.PORT}`);
  console.log(`🌐 Health: http://localhost:${CONFIG.PORT}/`);
  console.log(`📡 Webhook: http://localhost:${CONFIG.PORT}/webhook\n`);
});

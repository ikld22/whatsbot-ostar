// ==========================================
// نجوم العمران - نظام الرد الآلي عبر واتساب
// يتضمن: دعم الصور، التذاكر، التعليمات الرسمية، اللهجة السعودية
// ==========================================

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// ── إعدادات CORS ──────────────────────────────────────────────
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ── متغيرات البيئة ────────────────────────────────────────────
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
console.log("═══════════════════════════════");

const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

// ==========================================
// === البرومت الرسمي - تعليمات الرد (المدمجة بالكامل) ===
// ==========================================
const SYSTEM_PROMPT = `
أنت مساعد شركة نجوم العمران للتجارة والمقاولات (OStar).

═══════════════════════════════════════════════════════════
📌 **الهوية والأسلوب**
═══════════════════════════════════════════════════════════
- الاسم: شركة نجوم العمران - مستشار تكييف وتوزيع أجهزة منزلية
- أكبر شركة في المملكة العربية السعودية في بيع وتوزيع وتركيب المكيفات والأجهزة المنزلية
- الردود باللهجة السعودية الودودة (نجدية أو حجازية)
- عبارات مستخدمة: "يا هلا والله"، "شرفتنا"، "حياك الله"، "يسعد مساك"، "إن شاء الله أقدر أساعدك"
- أسلوب ودود، محترف، خفيف الظل، مبتسم
- الردود مختصرة، واضحة، لا تتجاوز 4 أسطر

═══════════════════════════════════════════════════════════
🏢 **معلومات الشركة**
═══════════════════════════════════════════════════════════
الاسم: شركة نجوم العمران للتجارة (Nojoom Al-Omran Trading Company)
العلامة التجارية: أوستار (OSTAR)
التأسيس: منذ أكثر من 10 سنوات
المقر الرئيسي: المدينة المنورة، حي السلام
الرقم الضريبي: 311522003200003
ساعات العمل: 8 صباحاً حتى 4 عصراً (فريق التركيبات)
التواصل: 966920015574+ | crm@ostar.sa | ostar.com.sa

═══════════════════════════════════════════════════════════
📍 **الفروع (المدينة المنورة)**
═══════════════════════════════════════════════════════════
1. فرع السلام - شركة نجوم العمران للأجهزة الكهربائية والمنزلية
2. فرع شوران - شركة نجوم العمران للأجهزة الكهربائية والمنزلية
3. فرع حي الفتح - نجوم العمران للتكييف المركزي
4. فرع الدائري - نجوم العمران للتكييف المركزي
5. فرع سوق الكهرباء - شركة نجوم العمران للتكييف المركزي
6. فرع قباء - شركة نجوم العمران للتكييف المركزي
7. فرع قطع غيار التكييف والتبريد - شركة نجوم العمران

═══════════════════════════════════════════════════════════
🛠️ **الخدمات المقدمة**
═══════════════════════════════════════════════════════════
- دراسة وتصميم مشاريع التكييف
- أعمال تأسيس النحاس
- أعمال التوريد والتركيب
- تصنيع مجاري الهواء
- الأجهزة المنزلية والإلكترونيات
- الصيانة والضمان وخدمات ما بعد البيع

═══════════════════════════════════════════════════════════
❄️ **أنظمة التكييف**
═══════════════════════════════════════════════════════════
- تكييف سبليت (اسبلت)
- تكييف مخفي منفصل (كونسيلد)
- تكييف مركزي (بكج)
- وحدات مناولة الهواء (VRF SYSTEM)
- نظام التشيلرات
- أنظمة التبريد الصحراوي
- غرف التبريد والتجميد

═══════════════════════════════════════════════════════════
🏷️ **العلامات التجارية المتوفرة**
═══════════════════════════════════════════════════════════
- أوستار (OSTAR) - العلامة الخاصة للشركة
- General Supreme
- ميديا (Media)
- LG (ال جي)
- باناسونيك (Panasonic)
- TCL (تي سي إل)
- AUX (أوكس)
- جري (GREE)

═══════════════════════════════════════════════════════════
💰 **الخصومات والعروض**
═══════════════════════════════════════════════════════════
- كود الخصم الوحيد: VIP5
- نسبة الخصم: 5% على إجمالي الطلب
- يُطبق فقط عند الدفع بـ: فيزا، مدى، ماستركارد، آبل باي، أو التحويل البنكي
- ممنوع منعاً باتاً إعطاء أي كود أو خصم آخر غير VIP5

═══════════════════════════════════════════════════════════
💳 **وسائل التقسيط**
═══════════════════════════════════════════════════════════
- تابي (Tabby) - 4 دفعات بدون فوائد
- تمارا (Tamara) - حتى 24 شهر ولحد 50,000 ريال
- ام آي اس باي (MISPay) - تقسيط فوري ومرن
- إمكان (EMKAN) - حتى 5 دفعات
- مدفوع (Madfu) - من 4 إلى 6 دفعات

═══════════════════════════════════════════════════════════
🔧 **الضمان**
═══════════════════════════════════════════════════════════
الأجهزة الكهربائية المنزلية:
- سنتان (24 شهراً) من تاريخ الشراء حسب تعليمات وزارة التجارة
- يشمل الأعطال المصنعية فقط
- الضمان بفاتورة الشراء

المكيفات:
- سنتان ضمان شامل على الجهاز كاملاً
- 5 سنوات ضمان على الكومبريسور
- قد يصل إلى 10 سنوات لبعض الموديلات (AUX، TCL)

═══════════════════════════════════════════════════════════
🚫 **الممنوعات (قواعد صارمة جداً)**
═══════════════════════════════════════════════════════════
- لا تحدد أو تؤكد أي موعد للتركيب أو الصيانة أبداً
- لا تعطي العميل أي مواعيد أو أوقات محددة بنفسك
- لا تخترع أسعاراً أو خصومات غير VIP5
- لا تذكر أي ماركات أخرى غير الموجودة في القائمة
- لا ترد على أسئلة خارج نطاق الأجهزة الكهربائية والتكييف (شعر، طب، دين، فتاوى)
- لا تعطي أي معلومات عن التوظيف (يتم التحويل إلى CEO@OSTAR.SA)
- لا تعطي معلومات الحساب البنكي إلا بعد التحقق من الفاتورة

═══════════════════════════════════════════════════════════
✅ **الردود الرسمية المعتمدة**
═══════════════════════════════════════════════════════════

**عند سؤال عن موعد أو تعديل موعد:**
"شكراً لتواصلك معنا 🌿
نعتذر منكم، وسيتم تحويل طلبكم إلى القسم المختص بجدولة المواعيد لمراجعة الطلب،
وسيتم إفادتكم فور استلامنا للرد بإذن الله بأقرب فرصة متاحة.

لخدمتك بشكل أسرع، نرجو تزويدنا بأحد البيانات التالية:
- رقم الجوال المسجل بالنظام
- أو رقم الفاتورة
- أو رقم الطلب على المتجر الإلكتروني

كما نرجو منك تزويدنا بالساعات المناسبة لك ضمن ساعات العمل الرسمية لفريق التركيبات، وهي من 🕗 الساعة 8 صباحاً حتى 4 عصراً."

**عند سؤال عن صيانة أو عطل:**
"شكراً لتواصلك معنا 🌿
نعتذر منكم للمشكلة الحاصلة معكم، وسيتم تحويل طلبكم إلى القسم المختص بالصيانة لمراجعة البلاغ،
وسيتم إفادتكم فور استلامنا للرد بإذن الله بأقرب فرصة ممكنة.

لخدمتك بشكل أسرع، نرجو تزويدنا بأحد البيانات التالية:
- رقم الجوال المسجل بالنظام
- أو رقم الفاتورة
- أو رقم الطلب على المتجر الإلكتروني

كما نرجو منك تزويدنا بوصف مختصر للمشكلة أو العطل ومتى تم ملاحظته."

**عند سؤال عن خصم أو كود خصم:**
"نعم متوفر كود خصم على المتجر الإلكتروني VIP5،
يخصم لك 5% من إجمالي الطلب،
والخصم يُطبّق فقط عند استخدام الدفع بفيزا، مدى، ماستركارد، آبل باي أو التحويل البنكي."

**عند سؤال عن التقسيط:**
"راحة بالك تهمنا — وفرنا لك خيارات تقسيط مرنة وسهلة الدفع!
متوفر: تابي (4 دفعات بدون فوائد)، تمارا (حتى 24 شهر)، مدفوع، وإمكان.
أطلب الآن واستمتع بخدمات التقسيط من نجوم العمران!"

**عند سؤال عن الضمان:**
"ضمان الأجهزة الكهربائية المنزلية سنتان (24 شهراً) من تاريخ الشراء حسب تعليمات وزارة التجارة، ويشمل أعطال المصنعية فقط.
الضمان يكون معتمد فقط بناءً على فاتورة الشراء."

**عند سؤال عن مكيف GREE:**
لا تذكر السعر حتى يحدد العميل النوع والمقاس. اسأل أولاً:
"هل ترغب في معرفة السعر لـ:
- مكيف شباك جري؟
- أم مكيف سبليت جري؟
فضلًا حدد النوع المطلوب حتى أقدر أفيدك بشكل أدق ✅"

**عند سؤال عن ثلاجات سامسونج:**
"ثلاجات سامسونج تجمع بين التصميم العصري وتقنية التبريد الذكي للحفاظ على الطعام طازجًا لفترة أطول.
لدينا مجموعة من ثلاجات سامسونج بمقاسات متنوعة لتناسب كل الاحتياجات والمساحات."

**عند سؤال عن جوالات:**
"تتوفر لدينا جوالات في فرع السلام والمتجر الإلكتروني، تفضل بزيارة معرض نجوم العمران في حي السلام او زيارة متجرنا الإلكتروني www.ostar.com.sa"

**عند سؤال عن التوظيف:**
"شكراً لتواصلك معنا واهتمامك بالانضمام إلى فريق شركة نجوم العمران 🌿
نود إبلاغك بأن كافة ما يخص التوظيف يتم عبر إدارة الموارد البشرية.
يرجى إرسال سيرتك الذاتية ومؤهلاتك على البريد التالي: CEO@OSTAR.SA"

**عند سؤال خارج نطاق العمل:**
"نعتذر، لست مختصاً في هذا المجال. أنا متواجد لخدمة العملاء فقط في مجال الأجهزة الكهربائية والمنزلية، والتكييف، وغرف التبريد، والنحاس."

**عند عدم معرفة الإجابة:**
"المعذرة، المعلومة اللي طلبتها غير مضافة عندي حالياً. بسأل الفريق المختص وأعاود لك التواصل 🙏"

**عند إرسال صورة:**
"شكراً، تم استلام الصورة وإضافتها لطلبك 📸 سيتواصل معك فريقنا قريباً 🌟"

═══════════════════════════════════════════════════════════
📞 **وسائل التواصل**
═══════════════════════════════════════════════════════════
واتساب: https://wa.me/966920015574
هاتف: 966920015574+
بريد إلكتروني: crm@ostar.sa
موقع: ostar.com.sa
فيسبوك: facebook.com/omranstar.sa
انستقرام: instagram.com/omranstars.sa
تويتر: twitter.com/omranstars
سناب شات: snapchat.com/add/omranstars_0
تيك توك: tiktok.com/@omranstars
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
// 2. استقبال الرسائل (النقطة الرئيسية)
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
  }
});

// ==========================================
// 3. معالجة الرسائل النصية مع التصنيف المسبق
// ==========================================
async function handleTextMessage(from, text, phoneNumberId) {
  await saveMessage(from, text, "user", phoneNumberId);
  
  // التحقق من الكلمات المفتاحية لتطبيق الردود الرسمية المباشرة
  let finalReply = await getDirectReply(text);
  
  // إذا لم يتم العثور على رد مباشر، استخدم الذكاء الاصطناعي
  if (!finalReply) {
    const history = await getConversationHistory(from);
    const aiReply = await getAIResponse(history, text);
    finalReply = await processSpecialCommands(aiReply, from, phoneNumberId, text);
  }
  
  await sendWhatsAppMessage(from, finalReply, phoneNumberId);
  await saveMessage(from, finalReply, "assistant", phoneNumberId);
}

// ==========================================
// 4. الردود المباشرة حسب الكلمات المفتاحية (توفير للوقت)
// ==========================================
async function getDirectReply(text) {
  const lowerText = text.toLowerCase();
  
  // كلمات المواعيد
  const appointmentKeywords = /(موعد|تعديل موعد|تغيير موعد|حجز موعد|ابغى موعد|احتاج موعد|الموعد|المواعيد)/i;
  if (appointmentKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
نعتذر منكم، وسيتم تحويل طلبكم إلى القسم المختص بجدولة المواعيد لمراجعة الطلب،
وسيتم إفادتكم فور استلامنا للرد بإذن الله بأقرب فرصة متاحة.

لخدمتك بشكل أسرع، نرجو تزويدنا بأحد البيانات التالية:
- رقم الجوال المسجل بالنظام
- أو رقم الفاتورة
- أو رقم الطلب على المتجر الإلكتروني

كما نرجو منك تزويدنا بالساعات المناسبة لك ضمن ساعات العمل الرسمية لفريق التركيبات، وهي من 🕗 الساعة 8 صباحاً حتى 4 عصراً.`;
  }
  
  // كلمات الصيانة والأعطال
  const maintenanceKeywords = /(عطل|خراب|خربان|ما يشتغل|صيانة|تصليح|صلح|مشكلة|توقف|تعطل)/i;
  if (maintenanceKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
نعتذر منكم للمشكلة الحاصلة معكم، وسيتم تحويل طلبكم إلى القسم المختص بالصيانة لمراجعة البلاغ،
وسيتم إفادتكم فور استلامنا للرد بإذن الله بأقرب فرصة ممكنة.

لخدمتك بشكل أسرع، نرجو تزويدنا بأحد البيانات التالية:
- رقم الجوال المسجل بالنظام
- أو رقم الفاتورة
- أو رقم الطلب على المتجر الإلكتروني

كما نرجو منك تزويدنا بوصف مختصر للمشكلة أو العطل ومتى تم ملاحظته.`;
  }
  
  // كلمات الخصم والكوبون
  const discountKeywords = /(خصم|كود خصم|كوبون|VIP)/i;
  if (discountKeywords.test(text)) {
    return `نعم متوفر كود خصم على المتجر الإلكتروني VIP5،
يخصم لك 5% من إجمالي الطلب،
والخصم يُطبّق فقط عند استخدام الدفع بفيزا، مدى، ماستركارد، آبل باي أو التحويل البنكي.`;
  }
  
  // كلمات التقسيط
  const installmentKeywords = /(تقسيط|تابي|تمارا|مدفوع|إمكان|بالشهر|شهري)/i;
  if (installmentKeywords.test(text)) {
    return `راحة بالك تهمنا — وفرنا لك خيارات تقسيط مرنة وسهلة الدفع!
في شركة نجوم العمران صار بإمكانك تشتري اللي تحتاجه بدون ضغط مالي.

💳 وسائل التقسيط المتاحة لدينا:
- تابي (Tabby) — تقسيط مريح حتى 4 دفعات بدون فوائد
- تمارا (Tamara) — تقسيط حتى 24 شهر ولحد 50,000 ريال
- ام آي اس باي (MISPay) — تقسيط فوري ومرن
- إمكان (EMKAN) — تقدر تقسط حتى 5 دفعات
- مدفوع (Madfu) — خيارات سداد متنوعة تبدأ من 4 دفعات وتصل إلى 6 دفعات

أطلب الآن واستمتع بخدمات تقسيط مرنة من نجوم العمران!`;
  }
  
  // كلمات الضمان
  const warrantyKeywords = /(ضمان|صيانة ضمان|ضمان الجهاز)/i;
  if (warrantyKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
نود التوضيح بأن ضمان الأجهزة الكهربائية يتم وفق تعليمات وزارة التجارة في المملكة العربية السعودية:

🔹 ضمان الأجهزة الكهربائية المنزلية (ثلاجات - غسالات - فريزرات - شاشات - أفران):
✅ مدة الضمان: سنتان (24 شهراً) من تاريخ الشراء ويكون على وكيل المنتج
✅ الضمان يشمل الأعطال المصنعية فقط

🔹 ضمان المكيفات:
- سنتان ضمان شامل على الجهاز كاملاً
- 5 سنوات ضمان على الكومبريسور
- وقد يصل الضمان حتى 10 سنوات للكومبريسور في بعض الشركات ولموديلات محددة

📌 الضمان يكون معتمد فقط بناءً على فاتورة الشراء.`;
  }
  
  // كلمات مكيف جري
  const greeKeywords = /(جري|قري|GREE)/i;
  if (greeKeywords.test(text)) {
    return `شكراً لتواصلك معنا 🌿
بخصوص استفسارك عن مكيف GREE (جري)،
هل ترغب في معرفة السعر لـ:
- مكيف شباك جري؟
- أم مكيف سبليت جري؟

فضلًا حدد النوع المطلوب حتى أقدر أفيدك بشكل أدق ✅`;
  }
  
  // كلمات ثلاجات سامسونج
  const samsungKeywords = /(سامسونج|سمسونج|Samsung)/i;
  if (samsungKeywords.test(text)) {
    return `ثلاجات سامسونج تجمع بين التصميم العصري وتقنية التبريد الذكي للحفاظ على الطعام طازجًا لفترة أطول.
لدينا مجموعة من ثلاجات سامسونج بمقاسات متنوعة لتناسب كل الاحتياجات والمساحات.
يمكنك معرفة الأسعار والعروض الحالية على ثلاجات سامسونج عبر زيارة المتجر الإلكتروني ostar.com.sa`;
  }
  
  // كلمات الجوالات
  const mobileKeywords = /(جوال|جوالات|ايفون|آيفون)/i;
  if (mobileKeywords.test(text)) {
    return `نشكركم على تواصلكم.
نود الإفادة بأنه تتوفر لدينا جوالات في فرع السلام والمتجر الإلكتروني، تفضل بزيارة معرض نجوم العمران في حي السلام او زيارة متجرنا الإلكتروني www.ostar.com.sa`;
  }
  
  // كلمات التوظيف
  const hrKeywords = /(وظيفة|توظيف|شغل|وظايف|انضمام|توظيف)/i;
  if (hrKeywords.test(text)) {
    return `شكراً لتواصلك معنا واهتمامك بالانضمام إلى فريق شركة نجوم العمران 🌿
نود إبلاغك بأن كافة ما يخص التوظيف يتم عبر إدارة الموارد البشرية.
يرجى إرسال سيرتك الذاتية ومؤهلاتك على البريد التالي: CEO@OSTAR.SA

مع خالص الشكر والتقدير.`;
  }
  
  // كلمات خارج نطاق العمل
  const outOfScope = /(شعر|طب|دكتور|علاج|فتوى|دين|صلاة|زكاة|حج|عمرة|طبي|صحي)/i;
  if (outOfScope.test(text)) {
    return `نعتذر، لست مختصاً في هذا المجال. أنا متواجد لخدمة العملاء فقط في مجال الأجهزة الكهربائية والمنزلية، والتكييف، وغرف التبريد، والنحاس.`;
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
// 6. الذكاء الاصطناعي (كلود)
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
// 7. معالجة الأوامر الخاصة (التذاكر)
// ==========================================
async function processSpecialCommands(reply, from, phoneNumberId, text) {
  // إنشاء تذكرة إذا كان الطلب يتطلب متابعة بشرية
  const needsTicket = /(صيانة|عطل|موعد|تغيير|شكوى|مشكلة|تركيب)/i.test(text);
  
  if (needsTicket && !reply.includes("تم تحويل طلبكم")) {
    const ticket = await getOrCreateTicket(from, "استفسار", text);
    console.log(`🎫 تذكرة منشأة: ${ticket.ticket_number}`);
  }
  
  return reply;
}

// ==========================================
// 8. إدارة التذاكر
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
      type: type,
      status: "جديد",
      priority: "متوسط",
      description: description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log(`🎫 تذكرة جديدة: ${ticketNumber} للعميل: ${phone}`);
  return newTicket;
}

// ==========================================
// 9. إرسال رسالة واتساب
// ==========================================
async function sendWhatsAppMessage(to, text, phoneNumberId) {
  console.log(`📤 إرسال رد إلى ${to}...`);
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
        headers: {
          Authorization: `Bearer ${CONFIG.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(`✅ رد أُرسل بنجاح إلى ${to}`);
  } catch (error) {
    console.error("❌ خطأ في إرسال الرسالة:", error.message);
  }
}

// ==========================================
// 10. حفظ الرسائل في قاعدة البيانات
// ==========================================
async function saveMessage(phone, content, role, phoneNumberId) {
  const { error } = await supabase.from("messages").insert({
    customer_phone: phone,
    content: content,
    role: role,
    whatsapp_number_id: phoneNumberId,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("❌ خطأ في حفظ الرسالة:", error.message);
}

// ==========================================
// 11. جلب سجل المحادثة
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
// 12. APIs للداشبورد
// ==========================================
app.get("/api/conversations", async (req, res) => {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  res.json(data || []);
});

app.get("/api/tickets", async (req, res) => {
  const { data } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });
  res.json(data || []);
});

app.get("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single();
  const { data: media } = await supabase.from("media").select("*").eq("ticket_id", id);
  const { data: msgs } = await supabase
    .from("messages")
    .select("*")
    .eq("customer_phone", ticket?.customer_phone)
    .order("created_at");
  res.json({ ticket, media: media || [], messages: msgs || [] });
});

app.patch("/api/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date().toISOString() };
  const { data } = await supabase
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  res.json(data);
});

app.get("/api/templates", async (req, res) => {
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true);
  res.json(data || []);
});

app.post("/api/templates", async (req, res) => {
  const { data } = await supabase.from("templates").insert(req.body).select().single();
  res.json(data);
});

app.get("/api/appointments", async (req, res) => {
  const { data } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true });
  res.json(data || []);
});

app.get("/api/stats", async (req, res) => {
  const { count: totalMsgs } = await supabase.from("messages").select("*", { count: "exact", head: true });
  const { count: openTickets } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .in("status", ["جديد", "قيد المعالجة"]);
  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true });
  const { count: totalMedia } = await supabase.from("media").select("*", { count: "exact", head: true });
  res.json({ totalMsgs, openTickets, totalTickets, totalMedia });
});

// ==========================================
// 13. تلخيص المحادثة بالذكاء
// ==========================================
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

// ==========================================
// 14. الصفحة الرئيسية
// ==========================================
app.get("/", (req, res) => {
  res.json({
    status: "✅ خادم نجوم العمران يعمل",
    version: "2.0",
    time: new Date().toISOString(),
    company: "شركة نجوم العمران للتجارة والمقاولات"
  });
});

// ==========================================
// تشغيل الخادم
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 خادم نجوم العمران يعمل على المنفذ ${PORT}`);
  console.log(`🌐 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`📊 Dashboard APIs متاحة على /api/...`);
});

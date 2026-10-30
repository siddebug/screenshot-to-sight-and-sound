export type CourierId = "bluedart" | "delhivery" | "dtdc" | "indiapost" | "dhl" | "fedex";

export const COURIERS: Record<CourierId, { name: string; short: string; url: (awb: string) => string }> = {
  bluedart: { name: "Blue Dart", short: "BD", url: (a) => `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(a)}` },
  delhivery: { name: "Delhivery", short: "DL", url: (a) => `https://www.delhivery.com/track/package/${encodeURIComponent(a)}` },
  dtdc: { name: "DTDC", short: "DT", url: (a) => `https://www.dtdc.in/tracking.asp?trknbr=${encodeURIComponent(a)}` },
  indiapost: { name: "India Post Speed Post", short: "IP", url: () => "https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx" },
  dhl: { name: "DHL Express", short: "DHL", url: (a) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(a)}` },
  fedex: { name: "FedEx", short: "FX", url: (a) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(a)}` },
};

export const ORDER_STAGES = ["Dispensed", "Dispatched", "In Transit", "Delivered"] as const;

export const CONDITIONS = [
  { id: "paediatrics", name: "Paediatrics", emoji: "🧸", blurb: "Recurrent colds, tonsillitis, teething, bedwetting, low immunity.", helps: ["Recurrent coughs & colds", "Teething & colic", "Bedwetting, picky eating"], refer: ["High fever above 103°F lasting 48h+", "Breathing difficulty, dehydration", "Missed vaccinations — see your paediatrician"] },
  { id: "skin", name: "Skin", emoji: "🌿", blurb: "Eczema, acne, psoriasis, urticaria — healing from within.", helps: ["Chronic eczema & acne", "Urticaria, warts", "Hair fall linked to stress"], refer: ["Rapidly spreading infection", "Changing moles — dermatologist check", "Severe allergic swelling"] },
  { id: "hormones", name: "Hormones", emoji: "🌸", blurb: "PCOS, thyroid balance, menstrual irregularities.", helps: ["PCOS with irregular cycles", "Menstrual pain, PMS", "Supporting thyroid alongside medicine"], refer: ["Never stop prescribed thyroxine", "Heavy bleeding — gynaec review", "Pregnancy complications"] },
  { id: "anxiety", name: "Anxiety & Depression", emoji: "🕊️", blurb: "Gentle support for anxiety, sleep and low mood.", helps: ["Exam & performance anxiety", "Mild-moderate low mood", "Sleep disturbances"], refer: ["Thoughts of self-harm — call emergency now", "Don't stop psychiatric medicines abruptly", "Severe depression needs psychiatric care"] },
  { id: "acute", name: "Acute Illnesses", emoji: "🌡️", blurb: "Fevers, flu, injuries, digestive upsets.", helps: ["Common cold & flu", "Minor injuries, bruises", "Acidity, mild gastritis"], refer: ["Chest pain, stroke signs — go to ER", "Fractures, deep wounds", "Dengue / malaria — needs tests"] },
  { id: "lifestyle", name: "Lifestyle & Dietetics", emoji: "🥗", blurb: "Weight, diabetes support, gut health and personalised diet.", helps: ["Weight management", "Gut health, IBS", "Diet plans with doshas in mind"], refer: ["Uncontrolled blood sugar", "Eating disorders — specialist team", "Continue diabetes medicines"] },
];

export const TIPS = [
  { title: "Morning remedies", tag: "Routine", body: "Take remedies on a clean tongue, 30 minutes before or after food. Start the day with warm water and five minutes of slow breathing." },
  { title: "Kids immunity", tag: "Paediatrics", body: "Regular sleep, seasonal fruit, outdoor play and fewer packaged snacks do more for immunity than any tonic." },
  { title: "Skin from within", tag: "Skin", body: "Hydrate, reduce sugar and fried food, and note flare triggers in a diary to share at your follow-up." },
  { title: "Diet & doshas", tag: "Dietetics", body: "Eat your largest meal at midday when digestion is strongest. Keep dinners light and early." },
];

export const PRESCRIPTION = {
  id: "RX-2026-1048",
  date: "Oct 28, 2026",
  patient: "Aarav Mehta",
  diagnosis: "Recurrent allergic rhinitis",
  remedies: [
    { name: "Pulsatilla 200", dose: "4 globules 3 times daily before meals", duration: "14 days" },
    { name: "Arnica Montana 30C", dose: "4 globules twice daily", duration: "7 days" },
    { name: "Natrum Mur 6X", dose: "2 tablets at bedtime", duration: "21 days" },
  ],
  precautions: ["Avoid camphor & menthol balms", "No coffee during the course", "Avoid strong raw onions & garlic", "No mint toothpaste 30 min around doses"],
};

export const REPORTS = [
  { id: "r1", name: "CBC Blood Report.pdf", date: "Oct 12, 2026", size: "240 KB" },
  { id: "r2", name: "Thyroid Profile (T3/T4/TSH).pdf", date: "Sep 3, 2026", size: "180 KB" },
  { id: "r3", name: "Allergy Panel IgE.pdf", date: "Jul 21, 2026", size: "310 KB" },
];

export const HISTORY = [
  { date: "Oct 28, 2026", type: "Follow-up · Video", note: "Sneezing reduced by ~60%. Continued Pulsatilla." },
  { date: "Sep 30, 2026", type: "Comprehensive · Video", note: "Detailed intake. Started constitutional remedy." },
  { date: "Jun 14, 2026", type: "Acute · In-person", note: "Viral fever, resolved in 4 days." },
];

export const QUEUE_SEED = [
  { id: "q1", time: "10:00", patient: "Priya Nair", country: "🇦🇪 UAE", reason: "PCOS follow-up", kind: "Follow-up", status: "Completed" },
  { id: "q2", time: "11:30", patient: "Aarav Mehta", country: "🇮🇳 India", reason: "Allergic rhinitis", kind: "Follow-up", status: "In Progress" },
  { id: "q3", time: "14:00", patient: "Sarah Collins", country: "🇬🇧 UK", reason: "Eczema — first visit", kind: "Comprehensive", status: "Upcoming" },
  { id: "q4", time: "16:15", patient: "Rohan D'Souza", country: "🇮🇳 Goa clinic", reason: "Child's recurrent cough", kind: "Comprehensive", status: "Upcoming" },
  { id: "q5", time: "19:00", patient: "Meera Iyer", country: "🇺🇸 US", reason: "Anxiety & sleep", kind: "Follow-up", status: "Upcoming" },
] as const;

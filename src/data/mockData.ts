import { CourierProvider, CourierConfig, ClinicalSpecialty, WellnessTip, Prescription, Appointment } from "../types";

export const COURIERS: Record<CourierProvider, CourierConfig> = {
  bluedart: {
    name: "Blue Dart",
    short: "BD",
    getUrl: (awb: string) => `https://www.bluedart.com/tracking?trackNumber=${encodeURIComponent(awb)}`,
  },
  delhivery: {
    name: "Delhivery",
    short: "DL",
    getUrl: (awb: string) => `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`,
  },
  dtdc: {
    name: "DTDC",
    short: "DT",
    getUrl: (awb: string) => `https://www.dtdc.in/tracking.asp?trknbr=${encodeURIComponent(awb)}`,
  },
  indiapost: {
    name: "India Post Speed Post",
    short: "IP",
    getUrl: () => "https://www.indiapost.gov.in/_layouts/15/dpt.cept.tracking/trackconsignment.aspx",
  },
  dhl: {
    name: "DHL Express",
    short: "DHL",
    getUrl: (awb: string) => `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(awb)}`,
  },
  fedex: {
    name: "FedEx",
    short: "FX",
    getUrl: (awb: string) => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(awb)}`,
  },
};

export const COURIER_CONFIGS = COURIERS;

export const ORDER_STAGES = ["Dispensed", "Dispatched", "In Transit", "Delivered"] as const;

export const CLINICAL_SPECIALTIES: ClinicalSpecialty[] = [
  {
    id: "womens-health",
    name: "Women's Health",
    emoji: "🌸",
    blurb: "PMOS, menopause, menstrual irregularities, and holistic infertility care.",
    helps: [
      "PMOS (Polycystic Morphologic Ovaries) & hormonal rebalance",
      "Menopause support & perimenopausal hot flushes",
      "Menstrual irregularities, dysmenorrhea & PMS",
      "Infertility & constitutional preconception care",
    ],
    refer: [
      "Severe acute pelvic hemorrhage or suspected ectopic pregnancy",
      "Suspected gynecological malignancy requiring urgent biopsy",
      "Acute obstetric emergencies requiring hospital care",
    ],
  },
  {
    id: "endocrinology",
    name: "Endocrinology",
    emoji: "⚖️",
    blurb: "Diabetes, under active thyroid (hypothyroidism), and hyper-thyroidism.",
    helps: [
      "Diabetes mellitus metabolic & lifestyle support",
      "Under active thyroid (Hypothyroidism / Hashimoto's)",
      "Hyper-thyroidism symptom management & autonomic stabilization",
      "Constitutional vitality & metabolic harmonization",
    ],
    refer: [
      "Diabetic Ketoacidosis (DKA) or hyperosmolar state — immediate ER",
      "Thyroid storm or severe thyrotoxic crisis requiring ICU care",
      "Never abruptly discontinue prescribed insulin or essential hormone replacement",
    ],
  },
  {
    id: "gastro-intestinal",
    name: "Gastro-Intestinal Diseases",
    emoji: "🥣",
    blurb: "Acidity, GERD, IBS, IBD, gastritis, chronic constipation, piles, and fissures.",
    helps: [
      "Acidity, heartburn & GERD (acid reflux)",
      "IBS (Irritable Bowel Syndrome) & IBD supportive care",
      "Gastritis, dyspepsia & chronic indigestion",
      "Chronic constipation, piles (hemorrhoids) & painful anal fissures",
    ],
    refer: [
      "Acute gastrointestinal bleeding (hematemesis, black tarry stools) — ER",
      "Suspected bowel obstruction, perforation, or acute abdomen",
      "Rapid unexplained weight loss or symptoms requiring urgent colonoscopy",
    ],
  },
  {
    id: "auto-immune",
    name: "Auto-Immune Diseases",
    emoji: "🛡️",
    blurb: "Urticaria, psoriasis, psoriatic arthritis, lichen planus, cancer support, and rheumatoid arthritis.",
    helps: [
      "Chronic urticaria flares & allergic angioedema",
      "Psoriasis & psoriatic arthritis systemic inflammation modulation",
      "Lichen planus (cutaneous & mucosal involvement)",
      "Rheumatoid arthritis joint stiffness & autoimmune modulation",
      "Complementary palliative constitutional care alongside oncology protocols",
    ],
    refer: [
      "Severe anaphylaxis or acute throat/airway compromise — call 112 / ER",
      "Active oncological staging, surgical resection & primary oncology protocols",
      "Acute multi-organ autoimmune crises requiring hospital immunosuppression",
    ],
  },
  {
    id: "arthritis-joint-pain",
    name: "Arthritis & Joint Pain",
    emoji: "🦴",
    blurb: "Osteoarthritis, rheumatoid arthritis, cervical spondylosis, lumbar spondylosis, gout, and sciatica.",
    helps: [
      "Osteoarthritis degenerative joint pain & morning stiffness",
      "Rheumatoid arthritis inflammatory modulation",
      "Cervical spondylosis & neck / radiating shoulder pain",
      "Lumbar spondylosis & chronic back stiffness",
      "Gout & acute uric acid flare prevention",
      "Sciatica & radiating nerve pain along the lower limb",
    ],
    refer: [
      "Septic arthritis with high fever and sudden swollen joint — urgent allopathy",
      "Cauda equina syndrome (loss of bowel/bladder control) — emergency spinal surgery",
      "Sudden acute motor paralysis or progressive neurological deficit",
    ],
  },
  {
    id: "respiratory",
    name: "Respiratory Diseases",
    emoji: "🫁",
    blurb: "Chronic cold, laryngitis, asthma, bronchitis, and sinusitis.",
    helps: [
      "Chronic cold, recurring coryza & post-nasal drip",
      "Laryngitis, chronic hoarseness & vocal strain",
      "Bronchial asthma prevention & breathlessness reduction",
      "Acute & chronic bronchitis symptom relief",
      "Sinusitis, frontal headache & blocked sinus passages",
    ],
    refer: [
      "Status asthmaticus or acute respiratory failure — call 112 / ER immediately",
      "Hemoptysis (coughing blood) or suspected pulmonary embolism",
      "Severe pneumonia with hypoxia (SpO2 dropping below 92%)",
    ],
  },
  {
    id: "renal",
    name: "Renal Diseases",
    emoji: "💧",
    blurb: "Kidney stones, UTI, cystitis, and chronic kidney disease support.",
    helps: [
      "Kidney stones (calculi passage support & stone recurrence prevention)",
      "Recurrent UTI (Urinary Tract Infections) & burning micturition",
      "Cystitis & bladder irritability comfort",
      "Early Chronic Kidney Disease (CKD) constitutional supportive care",
    ],
    refer: [
      "Acute renal failure, anuria (no urine output), or severe uremia — emergency dialysis",
      "Obstructive uropathy with hydronephrosis requiring surgical intervention",
      "Severe septic pyelonephritis with high fever and rigors",
    ],
  },
  {
    id: "paediatrics",
    name: "Paediatric Care",
    emoji: "🧸",
    blurb: "Constipation, allergies, bronchitis, asthma, recurring colds, colic, sleep, and gentle growth support.",
    helps: [
      "Childhood chronic constipation & infantile colic",
      "Childhood allergies (allergic rhinitis, food intolerances, eczema)",
      "Pediatric bronchitis & persistent night coughing",
      "Childhood bronchial asthma supportive prevention",
      "Recurrent colds, earaches & low natural immunity",
    ],
    refer: [
      "Persistent high fever above 103°F (48h+) or febrile convulsions",
      "Severe stridor, cyanosis or acute intercostal chest retractions — ER",
      "Severe dehydration or acute surgical abdomen (intussusception / appendicitis)",
    ],
  },
  {
    id: "skin",
    name: "Skin Conditions",
    emoji: "🌿",
    blurb: "Lichen planus, dermatitis, keratosis, and tinea (ringworm) targeted constitutional therapy.",
    helps: [
      "Lichen planus (cutaneous plaques & oral mucosal involvement)",
      "Dermatitis (atopic eczema, contact dermatitis & seborrheic flares)",
      "Keratosis (keratosis pilaris & hyperkeratotic dry plaques)",
      "Tinea (ringworm & stubborn fungal skin infections)",
      "Chronic urticaria, boils & itchy allergic flare-ups",
    ],
    refer: [
      "Rapidly spreading bacterial cellulitis or systemic sepsis",
      "Suspicious malignant melanomas or ulcerating lesions requiring biopsy",
      "Severe exfoliative erythroderma or drug-induced Stevens-Johnson syndrome",
    ],
  },
  {
    id: "anxiety",
    name: "Anxiety & Mental Health",
    emoji: "🕊️",
    blurb: "A calm space, careful listening, and remedies that work alongside therapy.",
    helps: [
      "Performance, exam & social anxiety",
      "Mild-to-moderate low mood, burnout & overwhelm",
      "Sleep disturbances, insomnia & restless mind",
      "Stress-related psychosomatic physical manifestations",
    ],
    refer: [
      "Severe clinical depression or suicidal thoughts — call 112 / ER now",
      "Do not discontinue prescribed psychiatric medications without physician guidance",
      "Severe bipolar mania or psychotic episodes require immediate psychiatric care",
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle & Dietetics",
    emoji: "🥗",
    blurb: "Advanced Diploma in Dietetics and Nutrition personalized nutrition tailored to your constitution and routine.",
    helps: [
      "Sustainable metabolic weight management",
      "Gut health, microbiome recovery & digestive reset",
      "Balanced nutritional plans tuned to individual constitutions",
      "Deficiency correction & anti-inflammatory dietary strategies",
    ],
    refer: [
      "Severe uncontrolled diabetes / ketoacidosis requiring hospitalization",
      "Severe clinical eating disorders requiring inpatient psychiatric care",
      "Do not discontinue prescribed cardiovascular or anticoagulant medications",
    ],
  },
];

export const WELLNESS_TIPS: WellnessTip[] = [
  {
    title: "Morning remedy tips",
    tag: "Routine",
    body: "Take remedies on a clean tongue, 30 minutes before or after meals. Start the morning with a glass of lukewarm water and slow breathing.",
  },
  {
    title: "Kids & immunity",
    tag: "Paediatrics",
    body: "Consistent sleep schedules, daily outdoor play, seasonal fruits, and eliminating packaged snacks build stronger immunity than any supplement.",
  },
  {
    title: "Targeted skin care",
    tag: "Skin",
    body: "Lichen planus, dermatitis, and fungal flares respond best to consistent constitutional remedies alongside gentle, non-irritating skin hygiene.",
  },
  {
    title: "Diet & doshas",
    tag: "Dietetics",
    body: "Eat your largest, most nourishing meal at midday when digestive fire is strongest. Keep dinners light, warm, and early.",
  },
];

export const INITIAL_PRESCRIPTION: Prescription = {
  id: "RX-2026-1048",
  date: "Oct 28, 2026",
  patient: "Aarav Mehta",
  diagnosis: "Recurrent allergic rhinitis",
  remedies: [
    { name: "Pulsatilla 200", dose: "4 globules 3 times daily before meals", duration: "14 days" },
    { name: "Arnica Montana 30C", dose: "4 globules twice daily", duration: "7 days" },
    { name: "Natrum Mur 6X", dose: "2 tablets at bedtime", duration: "21 days" },
  ],
  precautions: [
    "Keep remedies away from direct sunlight & strong scents",
    "Avoid camphor, menthol balms & eucalyptus oils",
    "No coffee or mint toothpaste within 30 minutes of taking doses",
    "Store in glass vials at room temperature",
  ],
};

export const INITIAL_QUEUE: Appointment[] = [
  { id: "q1", time: "10:00", date: "Today", patientName: "Priya Nair", country: "🇦🇪 UAE", complaint: "PMOS follow-up & cycle review", kind: "Follow-up", mode: "online", status: "Completed" },
  { id: "q2", time: "11:30", date: "Today", patientName: "Aarav Mehta", country: "🇮🇳 India", complaint: "Allergic rhinitis & seasonal flare", kind: "Follow-up", mode: "online", status: "In Progress" },
  { id: "q3", time: "14:00", date: "Today", patientName: "Sarah Collins", country: "🇬🇧 UK", complaint: "Childhood eczema initial intake", kind: "Comprehensive", mode: "online", status: "Upcoming" },
  { id: "q4", time: "16:15", date: "Today", patientName: "Rohan D'Souza", country: "🇮🇳 Goa Clinic", complaint: "Child's recurrent cough & colic", kind: "Comprehensive", mode: "clinic", status: "Upcoming" },
  { id: "q5", time: "19:00", date: "Today", patientName: "Meera Iyer", country: "🇺🇸 US", complaint: "Anxiety & sleep irregularity", kind: "Follow-up", mode: "online", status: "Upcoming" },
];

export const INITIAL_REPORTS = [
  { id: "r1", name: "CBC Blood Report.pdf", date: "Oct 12, 2026", size: "240 KB" },
  { id: "r2", name: "Thyroid Profile (T3/T4/TSH).pdf", date: "Sep 3, 2026", size: "180 KB" },
  { id: "r3", name: "Allergy Panel IgE.pdf", date: "Jul 21, 2026", size: "310 KB" },
];

export const CONSULTATION_HISTORY = [
  { date: "Oct 28, 2026", type: "Follow-up · Video", note: "Sneezing reduced by ~60%. Continued Pulsatilla 200 with dietary adjustments." },
  { date: "Sep 30, 2026", type: "Comprehensive · Video", note: "Detailed 45-min constitutional intake. Started constitutional treatment." },
  { date: "Jun 14, 2026", type: "Acute · In-person", note: "Viral fever, acute remedy administered, resolved in 4 days." },
];


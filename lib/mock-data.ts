/**
 * MOCK DATA FONDASI - APLIKASI EDUKASI "KENALI"
 * SMP Al-Falah Rempoa Ciputat, Tangerang Selatan
 * Program Studi S1 Ilmu Keperawatan
 */

export interface VideoContent {
  id: string;
  level: number;
  title: string;
  topic: string;
  duration: string;
  youtubeId: string;
  youtubeUrl: string;
  summary: string;
  keyPoints: string[];
  thumbnailColor: string;
}

export interface Game1Question {
  id: string;
  scenario: string;
  character: string;
  location: string;
  touchZone: "Aman" | "Privasi" | "Tidak Aman";
  options: {
    id: string;
    text: string;
    isRecommended: boolean;
    feedbackTitle: string;
    feedbackMessage: string;
    tone: "success" | "gentle-warning";
  }[];
}

export interface Game2Situation {
  id: string;
  title: string;
  story: string;
  category: "Aman" | "Perlu Diwaspadai" | "Tidak Aman";
  signs: string[];
  explanation: string;
}

export interface Game3ChatStep {
  id: string;
  senderName: string;
  senderRole: string;
  incomingMessage: string;
  riskContext: string;
  options: {
    id: string;
    label: string;
    responseText: string;
    isBestChoice: boolean;
    feedbackTitle: string;
    feedbackMessage: string;
    tone: "success" | "gentle-warning";
  }[];
}

export interface ScreeningQuestion {
  id: number;
  question: string;
  guidance: string;
}

export interface ScreeningCategory {
  range: [number, number];
  category: "Kecemasan Minimal" | "Kecemasan Ringan" | "Kecemasan Sedang" | "Kecemasan Berat";
  badgeVariant: "emerald" | "sky" | "amber" | "rose";
  description: string;
  recommendation: string;
  needsCounseling: boolean;
}

export interface StudentDiaryEntry {
  id: string;
  studentId: string;
  createdAt: string;
  mood: "senang" | "tenang" | "bingung" | "cemas" | "sedih";
  answers: {
    feelingToday: string;
    safePlace: string;
    uncomfortableExperience: string;
    whoCanHelp: string;
  };
  freeNote: string;
  isPrivate: true;
}

export interface StudentScreeningRecord {
  id: string;
  studentId: string;
  studentName: string;
  nickname: string;
  gender: "Laki-laki" | "Perempuan";
  grade: string;
  school: string;
  submittedAt: string;
  gad7Answers: number[];
  totalScore: number;
  category: "Kecemasan Minimal" | "Kecemasan Ringan" | "Kecemasan Sedang" | "Kecemasan Berat";
  status: "Belum Dihubungi" | "Sedang Didampingi" | "Selesai Konseling";
  bkNotes?: string;
}

/* -------------------------------------------------------------------------- */
/* 1. TIGA VIDEO ANIMASI EDUKASI                                              */
/* -------------------------------------------------------------------------- */

export const MOCK_VIDEOS: VideoContent[] = [
  {
    id: "vid-1",
    level: 1,
    title: "Mengenal Perubahan Tubuh & Batasan Diri",
    topic: "Pubertas, Anatomi Tubuh, dan Sentuhan yang Diperbolehkan / Dilarang",
    duration: "04:35",
    youtubeId: "dQw4w9WgXcQ", // Template video ID
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    summary:
      "Video ini mengajak siswa memahami perubahan fisik dan emosional di masa pubertas, mengenal bagian tubuh privasi (pakaian renang), serta konsep kepemilikan tubuh diri sendiri (bodily autonomy).",
    keyPoints: [
      "Bagian tubuh yang tertutup baju renang (dada, alat kelamin, bokong) adalah area privasi milikmu sendiri.",
      "Tidak ada orang lain yang berhak menyentuh, melihat, atau memfoto area privasimu tanpa alasan medis yang sah didampingi orang tua.",
      "Kamu punya hak penuh untuk berkata TIDAK pada sentuhan yang membuatmu merasa aneh, risih, atau takut.",
    ],
    thumbnailColor: "from-teal-400 to-emerald-500",
  },
  {
    id: "vid-2",
    level: 2,
    title: "Mengenali Bujuk Rayu & Trik Manipulasi",
    topic: "Grooming, Rahasia Buruk vs Rahasia Baik, dan Tekanan Teman Sebaya",
    duration: "05:12",
    youtubeId: "dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    summary:
      "Membongkar trik orang yang berniat jahat melalui hadiah berlebihan, ancaman terselubung, manipulasi 'ini rahasia kita berdua', dan cara membedakan rahasia kejutan baik dengan rahasia yang berbahaya.",
    keyPoints: [
      "Pelaku kekerasan sering kali orang yang sudah dikenal dan memulai dengan perhatian khusus atau hadiah berlebihan.",
      "Rahasia baik membuat hati hangat (misal: kejutan ulang tahun). Rahasia berbahaya membuat dada sesak, takut, atau cemas.",
      "Jika seseorang memintamu merahasiakan suatu perbuatan dari orang tua atau guru, itu adalah lampu merah (bahaya)!",
    ],
    thumbnailColor: "from-amber-400 to-orange-500",
  },
  {
    id: "vid-3",
    level: 3,
    title: "Berani Bicara & Cara Mencari Bantuan",
    topic: "Pencegahan Kekerasan di Sekolah, Circle Bantuan, & Peran Guru BK",
    duration: "04:58",
    youtubeId: "dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    summary:
      "Panduan langkah konkret jika mengalami atau melihat kekerasan seksual di lingkungan SMP Al-Falah: cara melapor ke Guru BK, cara menyimpan bukti digital, dan menghapus stigma rasa bersalah pada korban.",
    keyPoints: [
      "Korban kekerasan seksual TIDAK PERNAH bersalah. Kesalahan sepenuhnya ada pada pelaku.",
      "Langkah darurat T-K-L: TOLAK dengan tegas, KELUAR dari tempat tersebut, dan LAPOR pada orang dewasa yang kamu percaya.",
      "Guru BK SMP Al-Falah adalah sahabat siswa yang siap mendengarkan tanpa menghakimi dan menjaga kerahasiaan ceritamu.",
    ],
    thumbnailColor: "from-sky-400 to-indigo-500",
  },
];

/* -------------------------------------------------------------------------- */
/* 2. MINI GAME 1: "KENALI BATASANKU" (BODY BOUNDARIES)                       */
/* -------------------------------------------------------------------------- */

export const MOCK_GAME1_QUESTIONS: Game1Question[] = [
  {
    id: "g1-q1",
    character: "Kakak Kelas di Lorong Sekolah",
    location: "Koridor Kelas 8 SMP Al-Falah",
    scenario:
      "Saat jam istirahat, seorang kakak kelas merangkul pundakmu dengan sangat erat dan meletakkan tangannya di dekat pinggangmu, padahal kamu merasa risih dan tidak nyaman.",
    touchZone: "Tidak Aman",
    options: [
      {
        id: "opt-1",
        text: "Mundur selangkah dan katakan dengan sopan tapi tegas: 'Maaf kak, saya kurang nyaman dirangkul seperti ini.'",
        isRecommended: true,
        feedbackTitle: "Luar Biasa! Tindakan Sangat Tepat!",
        feedbackMessage:
          "Menyatakan batasan diri secara langsung dan tenang menunjukkan kamu menghargai kenyamanan tubuhmu sendiri. Kamu berhak menolak sentuhan siapa pun!",
        tone: "success",
      },
      {
        id: "opt-2",
        text: "Diam saja dan tersenyum canggung karena takut dianggap tidak sopan pada senior.",
        isRecommended: false,
        feedbackTitle: "Mari Kita Refleksikan Bersama...",
        feedbackMessage:
          "Rasa hormat pada senior tidak berarti kamu harus mengorbankan kenyamanan tubuhmu. Diam bisa disalahartikan bahwa kamu tidak keberatan. Kamu boleh menolak!",
        tone: "gentle-warning",
      },
      {
        id: "opt-3",
        text: "Membalas merangkul lebih erat agar dianggap akrab dan gaul.",
        isRecommended: false,
        feedbackTitle: "Hati-hati ya, Sobat KENALI",
        feedbackMessage:
          "Jika dari awal hatimu merasa risih, jangan memaksakan diri agar dianggap gaul. Dengarkan alarm peringatan dari dalam tubuhmu.",
        tone: "gentle-warning",
      },
    ],
  },
  {
    id: "g1-q2",
    character: "Pelatih Olahraga / Ekstrakurikuler",
    location: "Ruang Ganti Lapangan Basket",
    scenario:
      "Pelatih memanggilmu sendirian ke dalam ruang ganti tertutup dengan alasan ingin memeriksa postur tubuhmu secara privat di balik pintu terkunci.",
    touchZone: "Tidak Aman",
    options: [
      {
        id: "opt-1",
        text: "Katakan: 'Pak/Bu, saya lebih nyaman jika pintu tetap terbuka atau ditemani teman/guru piket.'",
        isRecommended: true,
        feedbackTitle: "Keren Sekali! Sikap Waspada yang Tepat!",
        feedbackMessage:
          "Pemeriksaan fisik oleh siapa pun di ruang tertutup dan terkunci tanpa pendamping adalah situasi berbahaya. Meminta pintu terbuka atau kehadiran pihak ketiga adalah perlindungan diri yang cerdas.",
        tone: "success",
      },
      {
        id: "opt-2",
        text: "Masuk saja dan mengunci pintu karena percaya pelatih adalah figur otoritas.",
        isRecommended: false,
        feedbackTitle: "Ingat Prinsip Ini Ya!",
        feedbackMessage:
          "Siapa pun, meskipun guru atau pelatih, harus tetap menghormati batasan privasi dan keamanan siswa. Situasi tertutup berdua saja harus selalu dihindari.",
        tone: "gentle-warning",
      },
      {
        id: "opt-3",
        text: "Kabur tanpa pamit dan membolos pelajaran ekstrakurikuler selamanya.",
        isRecommended: false,
        feedbackTitle: "Perlu Solusi yang Tuntas",
        feedbackMessage:
          "Menghindar saat itu bagus untuk keselamatan, tapi kamu juga harus menceritakannya ke orang tua atau Guru BK agar situasinya diselidiki dan teman lain tidak terancam.",
        tone: "gentle-warning",
      },
    ],
  },
  {
    id: "g1-q3",
    character: "Sahabat Dekatmu",
    location: "Halaman Masjid Sekolah",
    scenario:
      "Sahabatmu memberikan tos tangan (high-five) dan menepuk bahumu sambil memuji prestasimu yang memenangkan lomba cerdas cermat.",
    touchZone: "Aman",
    options: [
      {
        id: "opt-1",
        text: "Menyambut tos tangan dengan gembira dan mengucapkan terima kasih atas dukungannya.",
        isRecommended: true,
        feedbackTitle: "Tepat Sekali! Ini Sentuhan Positif!",
        feedbackMessage:
          "Tos tangan dan tepukan ramah di bahu dari teman sebagai bentuk ucapan selamat adalah contoh sentuhan aman dan penuh kasih sayang pertemanan yang sehat.",
        tone: "success",
      },
      {
        id: "opt-2",
        text: "Marah-marah dan menuduhnya melanggar batasan tubuh.",
        isRecommended: false,
        feedbackTitle: "Kenali Konteksnya Ya",
        feedbackMessage:
          "Batasan diri bertujuan melindungi dari bahaya, namun kita tetap dapat membedakan sentuhan persahabatan yang wajar, santun, dan saling menghormati.",
        tone: "gentle-warning",
      },
      {
        id: "opt-3",
        text: "Meminta sahabatmu bersumpah tidak menyentuh tanganmu lagi.",
        isRecommended: false,
        feedbackTitle: "Eksplorasi Batasan Diri",
        feedbackMessage:
          "Komunikasi yang seimbang membantu kita menjalin hubungan pertemanan yang hangat sekaligus tetap menjaga batasan.",
        tone: "gentle-warning",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 3. MINI GAME 2: "AMAN / TIDAK" (SITUATION RADAR)                            */
/* -------------------------------------------------------------------------- */

export const MOCK_GAME2_SITUATIONS: Game2Situation[] = [
  {
    id: "g2-s1",
    title: "Hadiah Misterius & Syarat Rahasia",
    story:
      "Seseorang yang kamu kenal di media sosial membelikan skin game mahal atau pulsa, lalu meminta imbalan agar kamu mengirimkan foto saat memakai pakaian tidur di kamar.",
    category: "Tidak Aman",
    signs: [
      "Pemberian hadiah mewah tanpa alasan wajar",
      "Meminta imbalan foto area tubuh atau pakaian dalam/tidur",
      "Meminta merahasiakan transaksi dari orang tua",
    ],
    explanation:
      "Ini adalah modus grooming digital! Pelaku berusaha membuatmu merasa berhutang budi untuk kemudian memanipulasi dan memerasmu. Jangan kirim foto apa pun dan segera lapor ke orang tua/Guru BK.",
  },
  {
    id: "g2-s2",
    title: "Belajar Kelompok Terbuka di Gazebo Sekolah",
    story:
      "Kamu dan tiga teman sekelas (putra dan putri) mengerjakan tugas kelompok IPA di gazebo sekolah saat sore hari dengan pintu gerbang sekolah masih dijaga satpam.",
    category: "Aman",
    signs: [
      "Tempat terbuka dan terlihat oleh orang banyak",
      "Aktivitas jelas dan fokus pada pembelajaran kelompok",
      "Jumlah anggota lebih dari dua orang di lingkungan resmi sekolah",
    ],
    explanation:
      "Situasi ini aman dan positif. Belajar bersama di tempat umum dengan visibilitas tinggi melindungi semua orang dari risiko manipulasi atau tuduhan yang tidak benar.",
  },
  {
    id: "g2-s3",
    title: "Candaan Fisik & Komentar Berbau Tubuh",
    story:
      "Saat jam istirahat di kantin, seorang teman sering melontarkan lelucon yang mengomentari bentuk dada atau pinggulmu, lalu berkata: 'Baperan amat sih, kan cuma bercanda!'",
    category: "Perlu Diwaspadai",
    signs: [
      "Mengomentari bagian tubuh pribadi dengan nada merendahkan",
      "Menggunakan alasan 'hanya bercanda' untuk membenarkan pelecehan verbal",
      "Membuat suasana pertemanan menjadi tidak nyaman atau memalukan",
    ],
    explanation:
      "Ini adalah pelecehan seksual verbal (catcalling/body shaming). Jangan biarkan mereka berlindung di balik kata 'bercanda'. Tegaskan bahwa lelucon tentang tubuh orang lain adalah perbuatan tidak sopan.",
  },
  {
    id: "g2-s4",
    title: "Ajakan Mengantar Pulang Lewat Jalan Sepi",
    story:
      "Kakak alumni yang baru kamu kenal menawarkan tumpangan motor pulang ke rumah, tetapi sengaja memilih rute jalan setapak sepi yang jauh memutar dan mulai menanyakan apakah di rumahmu ada orang.",
    category: "Tidak Aman",
    signs: [
      "Sengaja memilih rute sepi dan terpencil",
      "Mencari tahu apakah kamu sedang sendirian di rumah",
      "Orang yang belum dikenal lama oleh keluarga",
    ],
    explanation:
      "Ini tanda bahaya yang sangat jelas. Pelaku berusaha mengisolasi korban dari bantuan orang lain. Minta turun di tempat keramaian terdekat (seperti minimarket atau pos satpam) dan hubungi keluarga.",
  },
];

/* -------------------------------------------------------------------------- */
/* 4. MINI GAME 3: "PILIH RESPONMU" (SCENARIO SIMULATOR / CHAT)               */
/* -------------------------------------------------------------------------- */

export const MOCK_GAME3_SCENARIOS: Game3ChatStep[] = [
  {
    id: "g3-c1",
    senderName: "Akun 'Anonim_Cool'",
    senderRole: "Teman Main Game Online",
    incomingMessage:
      "Eh, bagi pap foto muka kamu dong tanpa masker. Kalau kamu kirim, nanti aku top-up diamond 500 buat akun kamu. Tapi janji ya jangan bilang siapa-siapa, rahasia kita aja 🤫",
    riskContext: "Upaya manipulasi identitas visual dengan iming-iming materi dan permintaan rahasia.",
    options: [
      {
        id: "resp-1",
        label: "Tolak Tegas & Blokir",
        responseText:
          "Maaf, saya tidak pernah mengirim foto pribadi ke orang yang tidak dikenal langsung di dunia nyata. Saya tidak butuh diamond.",
        isBestChoice: true,
        feedbackTitle: "Keputusan Berani & Cerdas!",
        feedbackMessage:
          "Menolak secara lugas dan tidak tergiur imbalan adalah tameng terbaik di dunia maya. Langkah selanjutnya: ambil tangkapan layar (screenshot) sebagai bukti, lalu blokir akunnya!",
        tone: "success",
      },
      {
        id: "resp-2",
        label: "Kirim Foto Biasa Dulu",
        responseText: "Kalau foto muka biasa boleh deh, asal beneran diisi ya diamond-nya...",
        isBestChoice: false,
        feedbackTitle: "Waspada Jebakan Bertahap!",
        feedbackMessage:
          "Pelaku biasanya memulai dari permintaan kecil yang terlihat sepele, lalu bertahap meminta foto yang makin privasi. Jangan pernah memulai transaksi semacam ini!",
        tone: "gentle-warning",
      },
      {
        id: "resp-3",
        label: "Ragu-ragu & Bertanya ke Teman Game Lain",
        responseText: "Beneran ga nih? Jangan bohong ya...",
        isBestChoice: false,
        feedbackTitle: "Jangan Tunjukkan Keraguan",
        feedbackMessage:
          "Menunjukkan keraguan membuat pelaku semakin gencar membujuk rayumu. Buat batasan tegas sejak pesan pertama.",
        tone: "gentle-warning",
      },
    ],
  },
  {
    id: "g3-c2",
    senderName: "Rian (Teman Sekelas)",
    senderRole: "Grup WhatsApp Kelas 8",
    incomingMessage:
      "Woy, ada yang punya video aib si X gak waktu kemarin kecebur atau ganti baju? Kirim ke sini dong, buat lucu-lucuan di status!",
    riskContext: "Penyebaran konten privasi tanpa persetujuan (non-consensual sharing) & cyberbullying.",
    options: [
      {
        id: "resp-1",
        label: "Ingatkan di Grup & Hentikan",
        responseText:
          "Stop teman-teman, menyebarkan foto atau video privasi orang lain itu melanggar hukum dan bisa bikin teman kita trauma. Tolong jangan disebar.",
        isBestChoice: true,
        feedbackTitle: "Kamu adalah 'Upstander' Sejati!",
        feedbackMessage:
          "Bukan hanya menyelamatkan temanmu dari cyberbullying, kamu juga mengedukasi seluruh anggota grup tentang etika digital dan konsekuensi hukum.",
        tone: "success",
      },
      {
        id: "resp-2",
        label: "Ikut Tertawa Menggunakan Emotikon",
        responseText: "Wkwkwk ada-ada aja lo Rian 😂",
        isBestChoice: false,
        feedbackTitle: "Jangan Menjadi Penonton Pasif",
        feedbackMessage:
          "Ikut menertawakan pelecehan sama saja dengan mendukung pelaku. Jadilah teman yang melindungi dan berani menghentikan lelucon yang merugikan.",
        tone: "gentle-warning",
      },
      {
        id: "resp-3",
        label: "Diam dan Menyimpan Videonya di Galeri HP",
        responseText: "(Hanya membaca chat tanpa merespons)",
        isBestChoice: false,
        feedbackTitle: "Bantu Temanmu yang Sedang Jadi Korban",
        feedbackMessage:
          "Jika kamu tidak berani menegur di grup, minimal japri temanmu yang jadi korban atau lapor ke wali kelas/Guru BK agar masalahnya segera ditangani.",
        tone: "gentle-warning",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* 5. INSTRUMEN SKRINING KECEMASAN (GAD-7)                                     */
/* -------------------------------------------------------------------------- */

export const MOCK_GAD7_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 1,
    question: "Merasa gugup, cemas, gelisah, atau merasa tidak tenang?",
    guidance: "Apakah kamu sering merasa tegang tanpa alasan yang jelas beberapa minggu terakhir?",
  },
  {
    id: 2,
    question: "Tidak mampu menghentikan atau mengendalikan rasa khawatir?",
    guidance: "Pikiran tentang hal-hal buruk terus berputar di kepala dan sulit untuk dialihkan.",
  },
  {
    id: 3,
    question: "Terlalu mengkhawatirkan berbagai hal yang belum tentu terjadi?",
    guidance: "Khawatir berlebihan tentang sekolah, pergaulan teman, atau masa depan.",
  },
  {
    id: 4,
    question: "Sulit untuk bersantai atau merasa tenang saat sedang istirahat?",
    guidance: "Tubuh terasa kaku atau pikiran selalu siaga seolah ada bahaya yang mengintai.",
  },
  {
    id: 5,
    question: "Sangat gelisah sehingga sulit untuk duduk diam?",
    guidance: "Sering menggerak-gerakkan kaki, meremas tangan, atau berjalan mondar-mandir.",
  },
  {
    id: 6,
    question: "Menjadi mudah merasa kesal atau mudah tersinggung?",
    guidance: "Cepat terpancing marah oleh hal-hal kecil di rumah atau di sekolah.",
  },
  {
    id: 7,
    question: "Merasa takut seolah-olah sesuatu yang mengerikan akan segera terjadi?",
    guidance: "Rasa panik mendadak atau firasat buruk yang mengganggu aktivitas sehari-hari.",
  },
];

export const GAD7_SCALE_OPTIONS = [
  { score: 0, label: "Tidak Pernah Sama Sekali", sub: "0 hari" },
  { score: 1, label: "Beberapa Hari", sub: "1 - 6 hari" },
  { score: 2, label: "Lebih dari Separuh Waktu", sub: "7 - 11 hari" },
  { score: 3, label: "Hampir Setiap Hari", sub: "12 - 14 hari" },
];

export const GAD7_CATEGORIES: ScreeningCategory[] = [
  {
    range: [0, 4],
    category: "Kecemasan Minimal",
    badgeVariant: "emerald",
    description:
      "Kondisi emosionalmu saat ini tergolong stabil dan sehat. Perasaan cemas yang kadang muncul adalah respon alami tubuh.",
    recommendation:
      "Pertahankan pola istirahat yang cukup, luangkan waktu untuk hobi yang menyenangkan, dan tetap jaga komunikasi dengan orang tua atau sahabat.",
    needsCounseling: false,
  },
  {
    range: [5, 9],
    category: "Kecemasan Ringan",
    badgeVariant: "sky",
    description:
      "Kamu mengalami sedikit rasa cemas atau stres ringan. Hal ini wajar terjadi saat menghadapi ujian atau dinamika pertemanan.",
    recommendation:
      "Coba latihan pernapasan santai, kurangi waktu layar (screen time) sebelum tidur, dan ceritakan hal-hal yang membebani pikiranmu pada buku diary atau orang terdekat.",
    needsCounseling: false,
  },
  {
    range: [10, 14],
    category: "Kecemasan Sedang",
    badgeVariant: "amber",
    description:
      "Tingkat kekhawatiranmu mulai mengganggu konsentrasi belajar, nafsu makan, atau kenyamanan sehari-hari.",
    recommendation:
      "Sangat dianjurkan untuk berkonsultasi santai dengan Guru BK SMP Al-Falah. Guru BK dapat membantumu memilah pikiran yang membebani tanpa menghakimimu.",
    needsCounseling: true,
  },
  {
    range: [15, 21],
    category: "Kecemasan Berat",
    badgeVariant: "rose",
    description:
      "Kamu memikul beban kecemasan yang cukup berat dan melelahkan bagi tubuh serta pikiranmu.",
    recommendation:
      "Kamu tidak perlu menghadapi ini sendirian. Mari berbicara langsung dengan Guru BK atau tenaga profesional kesehatan keperawatan untuk mendapatkan pendampingan yang tepat dan aman.",
    needsCounseling: true,
  },
];

export function calculateGad7Category(totalScore: number): ScreeningCategory {
  const match = GAD7_CATEGORIES.find(
    (c) => totalScore >= c.range[0] && totalScore <= c.range[1]
  );
  return match ?? GAD7_CATEGORIES[0];
}

/* -------------------------------------------------------------------------- */
/* 6. CONTOH DATA DIARY SISWA (100% PRIVAT — SISWA SAJA)                      */
/* -------------------------------------------------------------------------- */

export const MOCK_STUDENT_DIARIES: StudentDiaryEntry[] = [
  {
    id: "dry-001",
    studentId: "std-ahmad",
    createdAt: "18 Oktober 2026, 19:40 WIB",
    mood: "tenang",
    answers: {
      feelingToday: "Hari ini lumayan lega setelah nonton video edukasi level 1.",
      safePlace: "Kamar tidurku sambil dengerin musik favorit.",
      uncomfortableExperience:
        "Tadi ada teman yang suka nanya-nanya hal pribadi tentang pubertas dengan cara mengejek, tapi aku berhasil menghindar.",
      whoCanHelp: "Ibu di rumah dan Guru BK (Bu Nurul).",
    },
    freeNote:
      "Aku baru sadar kalau menolak sentuhan yang bikin risih itu bukan berarti sombong, tapi hakku. Rasanya lebih percaya diri setelah tahu penjelasannya.",
    isPrivate: true,
  },
  {
    id: "dry-002",
    studentId: "std-ahmad",
    createdAt: "15 Oktober 2026, 21:15 WIB",
    mood: "bingung",
    answers: {
      feelingToday: "Sedikit kepikiran tugas sekolah dan grup WA yang lagi rame bercandaan gak jelas.",
      safePlace: "Perpustakaan sekolah saat jam istirahat.",
      uncomfortableExperience: "Di grup ada yang kirim stiker agak kasar.",
      whoCanHelp: "Kakak sulungku.",
    },
    freeNote: "Semoga besok di sekolah situasinya lebih tenang.",
    isPrivate: true,
  },
];

/* -------------------------------------------------------------------------- */
/* 7. DATA REKAPITULASI SKRINING UNTUK ADMIN BK & MAHASISWA                    */
/* -------------------------------------------------------------------------- */

export const MOCK_SCREENING_RECORDS: StudentScreeningRecord[] = [
  {
    id: "scr-001",
    studentId: "std-001",
    studentName: "Ahmad Fauzi",
    nickname: "Ahmad",
    gender: "Laki-laki",
    grade: "8B",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "19 Oktober 2026, 09:15 WIB",
    gad7Answers: [1, 1, 0, 1, 0, 1, 0],
    totalScore: 4,
    category: "Kecemasan Minimal",
    status: "Belum Dihubungi",
    bkNotes: "Kondisi stabil. Tidak membutuhkan konseling mendesak.",
  },
  {
    id: "scr-002",
    studentId: "std-002",
    studentName: "Fatimah Azzahra",
    nickname: "Zahra",
    gender: "Perempuan",
    grade: "8A",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "18 Oktober 2026, 14:30 WIB",
    gad7Answers: [2, 2, 3, 2, 1, 2, 1],
    totalScore: 13,
    category: "Kecemasan Sedang",
    status: "Sedang Didampingi",
    bkNotes: "Sudah dihubungi via pesan ramah. Dijadwalkan sesi konseling santai hari Rabu jam istirahat.",
  },
  {
    id: "scr-003",
    studentId: "std-003",
    studentName: "Muhammad Rizky Pratama",
    nickname: "Rizky",
    gender: "Laki-laki",
    grade: "8C",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "18 Oktober 2026, 11:05 WIB",
    gad7Answers: [1, 2, 1, 1, 1, 1, 0],
    totalScore: 7,
    category: "Kecemasan Ringan",
    status: "Belum Dihubungi",
    bkNotes: "Cemas ringan menjelang ujian tengah semester.",
  },
  {
    id: "scr-004",
    studentId: "std-004",
    studentName: "Aisyah Putri Rahmawati",
    nickname: "Aisyah",
    gender: "Perempuan",
    grade: "7B",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "17 Oktober 2026, 16:20 WIB",
    gad7Answers: [3, 3, 2, 3, 2, 2, 2],
    totalScore: 17,
    category: "Kecemasan Berat",
    status: "Sedang Didampingi",
    bkNotes: "Prioritas pendampingan. Siswa menceritakan rasa takut berlebihan pada media sosial. Orang tua sudah diajak berdiskusi positif.",
  },
  {
    id: "scr-005",
    studentId: "std-005",
    studentName: "Zaid Abdullah",
    nickname: "Zaid",
    gender: "Laki-laki",
    grade: "9A",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "17 Oktober 2026, 10:45 WIB",
    gad7Answers: [0, 1, 0, 1, 0, 0, 0],
    totalScore: 2,
    category: "Kecemasan Minimal",
    status: "Selesai Konseling",
    bkNotes: "Konseling preventif kelulusan kelas 9 telah selesai.",
  },
  {
    id: "scr-006",
    studentId: "std-006",
    studentName: "Naila Khairunnisa",
    nickname: "Naila",
    gender: "Perempuan",
    grade: "8B",
    school: "SMP Al-Falah Rempoa",
    submittedAt: "16 Oktober 2026, 13:10 WIB",
    gad7Answers: [2, 1, 2, 2, 1, 1, 2],
    totalScore: 11,
    category: "Kecemasan Sedang",
    status: "Belum Dihubungi",
    bkNotes: "Perlu dijadwalkan observasi minggu depan.",
  },
];

/* -------------------------------------------------------------------------- */
/* 8. KONTAK LAYANAN GURU BK SMP AL-FALAH                                     */
/* -------------------------------------------------------------------------- */

export const MOCK_BK_CONTACT = {
  teacherName: "Ibu Nurul Hidayati, S.Pd., Kons.",
  nip: "19880412 201201 2 004",
  role: "Koordinator Bimbingan & Konseling SMP Al-Falah",
  whatsappNumber: "+62 812-3456-7890",
  whatsappDisplay: "0812-3456-7890",
  roomLocation: "Ruang BK Lantai 2 (Samping Perpustakaan), Gedung SMP Al-Falah",
  operatingHours: "Senin – Jumat, pukul 08.00 – 15.00 WIB",
  welcomeMessage:
    "Assalamualaikum wr. wb. Anak-anakku tercinta di SMP Al-Falah, Ruang BK adalah rumah kedua kalian. Tidak ada masalah yang terlalu kecil atau terlalu memalukan untuk diceritakan. Ibu siap mendengarkan dengan penuh kasih sayang dan menjaga rahasiamu.",
};

/* -------------------------------------------------------------------------- */
/* 9. METRIK RISET TIM PENELITI MAHASISWA                                     */
/* -------------------------------------------------------------------------- */

export const MOCK_RESEARCH_METRICS = {
  targetPopulation: "Siswa SMP Al-Falah Rempoa Kelas 7-9 (Usia 13-15 Tahun)",
  totalEnrolledStudents: 120,
  participatedStudents: 78,
  completionRatePercent: 65,
  averageVideoWatchRate: 84,
  averageQuizScorePercent: 88,
  screeningDistribution: {
    minimal: 38,
    ringan: 24,
    sedang: 11,
    berat: 5,
  },
  researchTitle:
    "Pengaruh Media Edukasi Interaktif Berbasis Video Animasi dan Mini Game terhadap Tingkat Pengetahuan Batasan Diri dan Kecemasan Siswa SMP Al-Falah Rempoa",
  leadResearcher: "Sarah Amanda (NIM: 2206012345) - S1 Ilmu Keperawatan",
  advisor: "Ns. Dian Kusuma, M.Kep., Sp.Kep.An",
};

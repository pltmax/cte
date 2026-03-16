import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// PLACEHOLDER SEO — Affinez ces champs avec vos vraies informations.
// Le `title` et la `description` apparaissent dans les résultats Google.
// Règle : title ≤ 60 car., description ≤ 160 car. — soyez précis et incitatifs.

export const metadata: Metadata = {
  title: "À propos — Choppe Ton Exam | Préparation TOEIC en ligne",
  description:
    "Découvrez qui est derrière Choppe Ton Exam : notre histoire, notre mission et pourquoi nous avons créé la meilleure plateforme de préparation au TOEIC en ligne.",
  // PLACEHOLDER SEO — Remplacez l'URL de base par votre domaine de production.
  alternates: {
    canonical: "https://choppetonexam.fr/a-propos",
  },
  openGraph: {
    // PLACEHOLDER SEO — Open Graph : ce qui s'affiche quand le lien est partagé
    // sur LinkedIn, WhatsApp, iMessage, etc. Ajoutez une image (1200×630 px)
    // dans /public/og-a-propos.png pour maximiser le taux de clic.
    title: "À propos — Choppe Ton Exam",
    description:
      "La plateforme de préparation au TOEIC pensée pour les étudiants français qui veulent un bon score rapidement.",
    url: "https://choppetonexam.fr/a-propos",
    siteName: "Choppe Ton Exam",
    locale: "fr_FR",
    type: "website",
    // images: [{ url: "https://choppetonexam.fr/og-a-propos.png", width: 1200, height: 630 }],
  },
};

// ─── Shared helpers ────────────────────────────────────────────────────────────

function SeoPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-lg border-2 border-[#d8b4fe] bg-[#f1f1f1] px-5 py-4 mb-6">
      <p className="text-md text-[#6d28d9] leading-relaxed">{label}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-3 py-1 mb-5 text-xs font-bold text-white bg-[#6600CC] rounded-sm uppercase tracking-wider">
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-br from-[#f3ebff] via-white to-white">
        <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          {/* PLACEHOLDER SEO — Le <h1> est le signal SEO le plus important de la page.
              Il doit contenir votre mot-clé principal ("préparation TOEIC", "TOEIC en ligne", etc.)
              + votre nom de marque. Une seule phrase percutante suffit. */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl">
            La préparation TOEIC{" "}
            <span className="text-[#6600CC]">pensée pour toi</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            {/* PLACEHOLDER SEO — Sous le H1, écrivez 1 à 2 phrases qui résument votre
                proposition de valeur unique. Intégrez des mots-clés secondaires :
                "score TOEIC", "exercices TOEIC", "examen blanc TOEIC", "étudiants français". */}
            Choppe Ton Exam, c&apos;est une plateforme de préparation au TOEIC
            créée par des étudiants, pour des étudiants. Notre mission : te
            donner les méthodes pour décrocher ton score rapidement, sans te
            noyer dans la théorie.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* ── NOTRE HISTOIRE ─────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Notre histoire</SectionLabel>
          {/* PLACEHOLDER SEO — La section "histoire" améliore l'E-E-A-T (Experience,
              Expertise, Authoritativeness, Trustworthiness) aux yeux de Google.
              Racontez comment et pourquoi vous avez créé la plateforme.
              Incluez : l'année de création, le contexte, le problème vécu. */}
          <h2 className="text-xl font-bold text-foreground mb-6">
            Pourquoi on a créé Choppe Ton Exam
          </h2>
          <SeoPlaceholder label="En 2025, quand PL préparait son TOEIC pour partir en échange à Berkeley (USA), il n'a trouvé que des ressources trop académiques avec des explications grammaticales et des listes de vocabulaire interminables. Il s'est donc plongé dans la méthode des examens blancs et a créé un outil qui lui correspondait parfaitement à l'aide de l'IA. Quand ses potes ont vu ça, ils lui ont demandé de leur partager la plateforme pour préparer leur examen. Au bout de la cinquième demande, il a décidé de créer Choppe Ton Exam pour partager sa méthode avec tous les étudiants français." />
        </section>

        {/* ── NOTRE MISSION ──────────────────────────────────────────────── */}
        <section>
          <SectionLabel>Notre mission</SectionLabel>
          {/* PLACEHOLDER SEO — La mission donne de la cohérence à votre marque et
              rassure Google que vous avez une expertise réelle. Soyez concret. */}
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Rendre la préparation TOEIC accessible à tous
          </h2>
          <SeoPlaceholder label="Notre mission est de permettre à chaque étudiant d'atteindre le score TOEIC requis par son école, sans repasser l'examen trois fois. Pour cela, on a développé des méthodes ciblées et créé des examens blancs réalistes." />

          {/* Valeurs — 3 cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            {[
              {
                icon: "⚡",
                title: "Efficacité",
                // PLACEHOLDER SEO — Décrivez chaque valeur en 1-2 phrases.
                body: "Tout est centralisé, cours, exercices, examens blancs dans une seule plateforme. Pas besoin de chercher partout, tu bosses 20/30 minutes par jour et tu progresses.",
              },
              {
                icon: "🎯",
                title: "Précision",
                body: "On a fait des exercices qui sont exactement les mêmes que dans l'examen. Tu progresses en répondant à des questions qui te rappellent les mêmes situations que dans l'examen et t'apprends les méthodes pour repérer les bonnes réponses.",
              },
              {
                icon: "🤝",
                title: "Accessibilité",
                body: "Pour 2 grecs (à Paname, ça fait 3 grecs si t'es de Marseille) t'as accés à tous les exercices et à plusieurs examens blancs. Franchement, ça vaut le coup si t'es en galère pour valider ton TOEIC.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3"
                style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.06)" }}
              >
                <span className="text-2xl">{v.icon}</span>
                <h3 className="text-base font-bold text-foreground">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── POURQUOI LE TOEIC ──────────────────────────────────────────── */}
        {/* Ce bloc est du contenu factuel — bon pour le SEO car Google valorise
            les pages qui répondent aux questions réelles des utilisateurs.
            Gardez-le ou enrichissez-le. */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8 mt-10 mb-10"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.06)" }}>
          <SectionLabel>Pourquoi le TOEIC ?</SectionLabel>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Le TOEIC : l&apos;examen incontournable des étudiants français
          </h2>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              Le <strong>TOEIC Listening &amp; Reading</strong> (Test of English
              for International Communication) est le certificat d&apos;anglais
              le plus demandé par les écoles d&apos;ingénieurs, de commerce et
              les entreprises en France. Plus de{" "}
              <strong>7 millions de candidats</strong> le passent chaque année
              dans le monde.
            </p>
            <p>
              La majorité des grandes écoles exige un score minimum entre{" "}
              <strong>785 et 900 points</strong> pour valider le diplôme. Avec
              une préparation ciblée, il est tout à fait atteignable en{" "}
              <strong>2 à 4 semaines</strong> de travail régulier.
            </p>
            <p>
              Contrairement au TOEFL (orienté université), le TOEIC évalue
              l&apos;anglais dans un contexte <strong>professionnel et du
              quotidien</strong> : réunions, emails, annonces, publicités.
              C&apos;est un QCM de 200 questions en 2 heures — ce qui en fait un
              examen technique qu&apos;on peut « cracker » avec la bonne méthode.
            </p>
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-[#e9d9ff] bg-[#faf6ff] p-8 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            Une question ? Un partenariat ?
          </h2>
          {/* PLACEHOLDER SEO — Ajoutez une vraie adresse email, un lien LinkedIn,
              ou un formulaire de contact. Les infos de contact sont un signal
              de confiance (E-E-A-T) et peuvent améliorer votre positionnement local. */}
          <SeoPlaceholder label="Contacte nous via la section paramètres dans l'app ou par mail à contact@choppetonexam.com." />
          <Link
            href="/parametres"
            className="self-start px-6 py-3 bg-[#6600CC] text-white text-sm font-bold rounded-full hover:bg-[#5500aa] transition-colors"
          >
            Signaler un problème via l&apos;app →
          </Link>
        </section>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff] mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
          <span>© 2026 Choppe Ton Exam. Tous droits réservés.</span>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-white/70 transition-colors">Accueil</Link>
            <Link href="/login" className="hover:text-white/70 transition-colors">Se connecter</Link>
            <Link href="/signup" className="hover:text-white/70 transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

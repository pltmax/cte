import Link from "next/link";
import Navbar from "@/components/Navbar";

// ─── Shared section wrapper ────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 w-full max-w-6xl mx-auto px-6 py-20 ${className}`}
    >
      {children}
    </section>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-8 py-5 bg-white rounded-2xl shadow-sm border border-gray-100">
      <span className="text-3xl font-bold text-[#6600CC]">{value}</span>
      <span className="text-sm text-gray-500 text-center">{label}</span>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-[#f3ebff] flex items-center justify-center text-[#6600CC]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({
  name,
  exam,
  score,
  body,
}: {
  name: string;
  exam: string;
  score: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{body}&rdquo;</p>
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        <span className="text-xs px-2.5 py-1 bg-[#f3ebff] text-[#6600CC] rounded-full font-medium">
          {exam} — {score}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-br from-[#f3ebff] via-white to-white">
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-[#6600CC] bg-[#f3ebff] rounded-full uppercase tracking-wide">
            TOEIC · TOEFL · IELTS
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-3xl">
            Lâche ton amphi.{" "}
            <span className="text-[#6600CC]">Central Park</span> c&apos;est mieux.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Des exercices intelligents, des examens blancs et un suivi de progression pour décrocher
            le score qui ouvre les portes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/signup"
              className="px-7 py-3.5 text-sm font-bold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
            >
              Commencer gratuitement
            </Link>
            <a
              href="/#concept"
              className="px-7 py-3.5 text-sm font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
            >
              Découvrir le concept
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <StatCard value="10 000+" label="étudiants actifs" />
            <StatCard value="95 %" label="taux de réussite" />
            <StatCard value="3 examens" label="TOEIC, TOEFL, IELTS" />
            <StatCard value="100 %" label="en ligne, à ton rythme" />
          </div>
        </div>
      </div>

      {/* ── LE CONCEPT ────────────────────────────────────────────────────── */}
      <Section id="concept">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
            Notre méthode
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-xl">
            Une prépa pensée pour ta vie, pas pour l&apos;amphi
          </h2>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            Choppe Ton Exam adapte chaque session à ton niveau et tes disponibilités — 15 minutes
            suffisent pour progresser chaque jour.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Exercices adaptatifs"
            body="L'algorithme identifie tes lacunes et t'envoie exactement les exercices dont tu as besoin pour progresser vite."
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            title="Examens blancs officiels"
            body="Passe des simulations dans les mêmes conditions que le jour J — avec un score estimé et un rapport détaillé."
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            title="Suivi de progression"
            body="Un tableau de bord clair qui montre ta progression par compétence, semaine après semaine."
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Sessions courtes & flexibles"
            body="15 à 30 minutes par jour suffisent. Prépare-toi depuis ton canapé, le métro, ou entre deux cours."
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            title="Guides & fiches de révision"
            body="Des ressources claires et concises, rédigées par des experts, pour maîtriser chaque type de question."
          />
          <FeatureCard
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            title="Communauté active"
            body="Échange avec d'autres étudiants, partage tes astuces et motive-toi grâce à un classement hebdomadaire."
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-100" />
      </div>

      {/* ── LANCE-TOI ─────────────────────────────────────────────────────── */}
      <Section id="lance-toi">
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
            Démarrage rapide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-xl">
            Prêt en 3 minutes, score amélioré en 3 semaines
          </h2>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            Pas de carte bancaire requise. Crée ton compte, évalue ton niveau, et commence à t&apos;améliorer dès aujourd&apos;hui.
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row gap-0 md:gap-0 max-w-4xl mx-auto">
          {[
            {
              step: "01",
              title: "Crée ton compte",
              body: "Inscription en 30 secondes. Aucune CB requise pour démarrer.",
            },
            {
              step: "02",
              title: "Évalue ton niveau",
              body: "Un test rapide cible tes points faibles pour personnaliser ta prépa.",
            },
            {
              step: "03",
              title: "Progresse chaque jour",
              body: "Suis ton plan personnalisé et regarde ton score grimper semaine après semaine.",
            },
          ].map((item, idx) => (
            <div key={item.step} className="relative flex-1 flex flex-col items-center text-center px-6 py-8">
              {/* connector line */}
              {idx < 2 && (
                <div className="hidden md:block absolute top-12 left-[calc(50%+32px)] right-[-calc(50%-32px)] w-[calc(100%-64px)] h-px bg-[#e0d0f5]" />
              )}
              <div className="w-14 h-14 rounded-2xl bg-[#6600CC] text-white flex items-center justify-center text-lg font-bold mb-5 shadow-md relative z-10">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/signup"
            className="px-8 py-4 text-sm font-bold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors shadow-lg"
          >
            Commencer gratuitement →
          </Link>
        </div>
      </Section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-100" />
      </div>

      {/* ── AVIS ──────────────────────────────────────────────────────────── */}
      <Section id="avis">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-xl">
            Ils ont chopé leur exam. Et toi ?
          </h2>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            Des milliers d&apos;étudiants ont déjà amélioré leur score. Voici ce qu&apos;ils en pensent.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ReviewCard
            name="Camille T."
            exam="TOEIC"
            score="945/990"
            body="J'avais peur de rater à cause du listening. Les exercices adaptatifs m'ont fait progresser en 3 semaines. Je recommande à 100 %."
          />
          <ReviewCard
            name="Axel M."
            exam="IELTS"
            score="Band 7.5"
            body="Les examens blancs sont ultra-fidèles au vrai examen. Je savais exactement où j'en étais avant le jour J. Super tranquille le matin de l'exam."
          />
          <ReviewCard
            name="Sofia L."
            exam="TOEFL"
            score="108/120"
            body="La flexibilité des sessions courtes a tout changé pour moi. Je préparais entre deux cours et j'ai gagné 18 points en un mois."
          />
          <ReviewCard
            name="Hugo R."
            exam="TOEIC"
            score="880/990"
            body="J'avais essayé des applications gratuites mais rien ne ressemblait vraiment à l'examen. Ici c'est différent, tu te sens vraiment prêt."
          />
          <ReviewCard
            name="Inès B."
            exam="IELTS"
            score="Band 8.0"
            body="Les guides de révision sont clairs et précis. Combinés aux exercices, ça fait une méthode vraiment complète. Mon score a explosé."
          />
          <ReviewCard
            name="Nathan K."
            exam="TOEFL"
            score="100/120"
            body="Le suivi de progression m'a permis de voir exactement mes points faibles. J'ai ciblé mon effort et gagné un max de temps."
          />
        </div>
      </Section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff] mt-10">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ton prochain score commence maintenant.
          </h2>
          <p className="text-white/80 text-base max-w-md leading-relaxed">
            Rejoins Choppe Ton Exam et transforme ta prépa en quelques semaines — pas en quelques mois.
          </p>
          <Link
            href="/signup"
            className="mt-2 px-8 py-4 text-sm font-bold text-[#6600CC] bg-white rounded-full hover:bg-white/90 transition-colors shadow-lg"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <span>© 2026 Choppe Ton Exam. Tous droits réservés.</span>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#6600CC] transition-colors">Se connecter</Link>
            <Link href="/signup" className="hover:text-[#6600CC] transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FAQItem from "@/components/FAQItem";

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
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100 h-full min-h-[230px]">
      <div className="flex  mb-2">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed italic mb-4">&ldquo;{body}&rdquo;</p>
      {/* Instead of absolute, use a regular (static) div always at the bottom */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <span className="text-xs px-2.5 py-1 bg-[#f3ebff] text-[#6600CC] rounded-full font-medium">
            {exam} — {score}
          </span>
        </div>
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
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-3xl flex flex-col gap-2">
                <span className="text-2xl md:text-3xl text-gray-500 font-medium">Préparation au TOEIC en ligne</span>
                <span>
                    Lâche ton amphi,{" "}
                    <span className="text-[#6600CC]">Central Park</span> c&apos;est mieux.
                </span>
            </h1>
          <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
            Des méthodes efficaces, des exercices adaptés et des examens blancs pour décrocher
            le score qui t'emmènera à l'étranger.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 mt-2">
            <Link
              href="/signup"
              className="px-7 py-3 text-base font-bold text-white bg-[#6600CC] rounded-full hover:bg-[#5500aa] transition-colors shadow-md"
            >
              Commencer gratuitement
            </Link>
            <a
              href="/#concept"
              className="px-7 py-3 text-base font-semibold text-[#6600CC] border border-[#6600CC]/30 rounded-full hover:bg-[#f3ebff] transition-colors"
            >
              Découvrir le concept
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <StatCard value="100+" label="étudiants actifs" />
            <StatCard value="97 %" label="taux de réussite" />
            <StatCard value="25+" label="exercices réels" />
            <StatCard value="100%" label="en ligne, à ton rythme" />
          </div>
        </div>
      </div>

      {/* ── LE CONCEPT ────────────────────────────────────────────────────── */}
      <Section id="concept">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto px-6 py-12">
          
          {/* Colonne de Gauche : Titre et Description */}
          <div className="lg:w-5/12 lg:top-32 h-fit flex flex-col items-start text-left">
            <span className="inline-block px-3 py-1 mb-6 text-xs font-bold text-white bg-[#6600CC] rounded-sm uppercase tracking-wider">
              Notre méthode
            </span>
            <h2 className="text-4xl md:text-4xl font-bold text-foreground leading-tight mb-6 ">
                On t&apos;apprend pas l&apos;anglais. On t&apos;apprend à cracker l&apos;exam.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
            On va pas se mentir : tu vas pas devenir bilingue en deux semaines. Par contre, tu vas valider ton TOEIC. Oublie la grammaire interminable et apprends plutôt à plier l'épreuve avec les bonnes méthodes.
            </p>
          </div>

          {/* Colonne de Droite : Liste des fonctionnalités */}
          <div className="lg:w-7/12 flex flex-col">

            {/* Item 1 */}
            <div className="py-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-foreground">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Guides & fiches de révision</h3>
              </div>
              <p className="text-base text-gray-500 leading-relaxed">
                Des ressources claires et concises, rédigées par des experts, pour maîtriser chaque type de question.
              </p>
            </div>
            
            {/* Add vertical gap between items */}
            <div className="pt-8 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-foreground">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Exercices adaptés</h3>
              </div>
              <p className="text-base text-gray-500 leading-relaxed">
                Une série d'exercices couvrant toutes les sections de l'examen, conçus pour cibler les compétences requises et adopter une méthodologie efficace.
              </p>
            </div>

            {/* Item 3 */}
            <div className="py-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-foreground">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Examens blancs réels</h3>
              </div>
              <p className="text-base text-gray-500 leading-relaxed">
              Mets-toi dans les conditions du jour J ! À l'issue de chaque test, visualise tes progrès et cible tes faiblesses pour aller droit au but.
              </p>
            </div>

            {/* Item 4 */}
            <div className="py-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-foreground">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-foreground">Sessions courtes & flexibles</h3>
              </div>
              <p className="text-base text-gray-500 leading-relaxed">
                Organise toi à ton rythme ! 15 à 30 minutes par jour suffisent. Bosse depuis ton canapé, le métro, ou entre deux cours.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-300" />
      </div>

      {/* ── LANCE-TOI ─────────────────────────────────────────────────────── */}
      <Section id="lance-toi">
        <div className="flex flex-col items-center text-center gap-4 mb-14">
          <span className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest">
            Démarrage rapide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-xl">
            Arrête de bégayer. Viens tester ton vrai niveau.
          </h2>
          <p className="text-base text-gray-500 max-w-lg leading-relaxed">
            Pas de blabla, pas de carte bancaire. Crée ton compte, évalue ton niveau, fais 2-3 exos et commence à progresser dès aujourd&apos;hui.
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
              body: "Un test rapide pour voir où tu te situes sur des questions types.",
            },
            {
              step: "03",
              title: "Progresse chaque jour",
              body: "Suis la méthode et regarde ton score grimper semaine après semaine.",
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
        <div className="border-t border-gray-300" />
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
            Des dizaines d&apos;étudiants ont déjà amélioré leur score. Voici ce qu&apos;ils en pensent.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ReviewCard
            name="Sébastien I."
            exam="TOEIC"
            score="955/990"
            body="J'ai toujours été nul en anglais mais il me fallait 945 pour partir en échange. Les exercices m'ont fait progresser en 3 semaines. Je recommande à 100 %."
          />
          <ReviewCard
            name="Ambre P."
            exam="TOEIC"
            score="975/990"
            body="Les examens blancs sont ultra-fidèles au vrai examen. D'habitude je suis très stressée mais je savais exactement où j'en étais avant le jour du TOEIC."
          />
          <ReviewCard
            name="Sofia L."
            exam="TOEIC"
            score="945/990"
            body="La flexibilité des exercices a tout changé pour moi. Je préparais entre deux cours et j'ai gagné 60 points par rapport à mes examens blancs en un mois."
          />
          <ReviewCard
            name="Hugo I."
            exam="TOEIC"
            score="880/990"
            body="J'étais bloqué à 600 en essayant de tout traduire et de comprendre chaque règle. J'ai appliqué leur méthode pour repérer les bonnes réponses sans lire tout le texte. Ça a débloqué mon score direct."
          />
        </div>
      </Section>

    {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-gray-300" />
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <Section id="faq">
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          
          {/* Colonne de gauche : Titre court */}
          <div className="lg:w-1/3 flex flex-col items-start text-left">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-bold text-white bg-[#6600CC] rounded-sm uppercase tracking-wider">
              Questions fréquentes
          </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              T'as encore des doutes ?
            </h2>
            <p className="mt-4 text-base text-gray-500 leading-relaxed">
              Tout ce que tu dois savoir sur l'examen et notre méthode pour exploser ton score.
            </p>
          </div>

          {/* Colonne de droite : Les questions (Accordéons) */}
          <div className="lg:w-2/3 flex flex-col">
            <div>
              <FAQItem 
                question="Quel est un bon score au TOEIC ?"
                answer="Tout dépend de ton objectif. La plupart des écoles d'ingénieurs et de commerce exigent un score minimum de 785 (niveau B2) ou 850 pour valider le diplôme. Les meilleures entreprises visent souvent au-dessus de 900 (niveau C1) pour prouver une excellente compréhension écrite et orale."
              />
              <FAQItem 
                question="Est-ce que ça marche si je suis vraiment nul en anglais ?"
                answer="Oui, car le TOEIC Listening & Reading est un QCM standardisé. Notre méthode ne t'oblige pas à apprendre toute la grammaire anglaise par cœur. On t'apprend la mécanique de l'examen, comment repérer les pièges, et comment déduire la bonne réponse même quand tu ne comprends pas tout le vocabulaire."
              />
              <FAQItem 
                question="Combien de temps faut-il pour se préparer ?"
                answer="Si tu t'entraînes sérieusement avec nos exercices adaptatifs 15 à 30 minutes par jour, 3 à 4 semaines suffisent généralement pour voir un bond massif dans ton score. L'important n'est pas de réviser longtemps, mais de réviser les bonnes notions et de faire des examens blancs réguliers."
              />
              <FAQItem 
                question="Quelle est la différence entre le TOEIC et le TOEFL ?"
                answer="Le TOEIC (Test of English for International Communication) évalue ton anglais dans un contexte professionnel (réunions, emails, voyages d'affaires). Le TOEFL est axé sur un anglais académique (pour intégrer une université américaine ou britannique). Si tu veux valider un diplôme en France ou trouver un stage, c'est le TOEIC qu'il te faut."
              />
              <FAQItem 
                question="Puis-je m'inscrire à l'examen officiel directement ici ?"
                answer="Non, Choppe Ton Exam est une plateforme de préparation 100% en ligne. Pour passer l'attestation officielle, tu devras t'inscrire en candidat libre ou via ton école directement sur le site officiel d'ETS Global. Par contre, on te prépare pour que le jour J dans le centre d'examen soit une simple formalité."
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#6600CC] to-[#9933ff] mt-10">
        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            C'est l'heure d'aller plier ça.
          </h2>
          <p className="text-white/80 text-base max-w-md leading-relaxed">
            Prends les raccourcis, choppe ton exam et passe enfin à autre chose. Zéro blabla, que du résultat.
          </p>
          <Link
            href="/signup"
            className="mt-2 px-8 py-4 text-sm font-bold text-[#6600CC] bg-white rounded-full hover:bg-white/90 transition-colors shadow-lg"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
          <span>© 2026 Choppe Ton Exam. Tous droits réservés.</span>
          <div className="flex gap-5">
            <Link href="/a-propos" className="hover:text-[#6600CC] text-white transition-colors">À propos</Link>
            <Link href="/confidentialite" className="hover:text-[#6600CC] text-white transition-colors">Confidentialité</Link>
            <Link href="/cgv" className="hover:text-[#6600CC] text-white transition-colors">CGV</Link>
            <Link href="/login" className="hover:text-[#6600CC] text-white transition-colors">Se connecter</Link>
            <Link href="/signup" className="hover:text-[#6600CC] text-white transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Choppe Ton Exam",
  description:
    "Découvrez comment Choppe Ton Exam collecte, utilise et protège vos données personnelles conformément au RGPD.",
  alternates: {
    canonical: "https://choppetonexam.fr/confidentialite",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  children,
  n,
}: {
  title: string;
  children: React.ReactNode;
  n: number;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-3 text-base font-bold text-foreground">
        <span className="w-7 h-7 rounded-full bg-[#f3ebff] text-[#6600CC] text-xs font-bold flex items-center justify-center shrink-0">
          {n}
        </span>
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-sm text-gray-700 leading-relaxed pl-10">
        {children}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      <Navbar />

      <div className="px-4 md:px-6 py-12 max-w-3xl mx-auto">
        <article
          className="bg-white rounded-2xl border border-gray-100 px-4 md:px-10 py-10"
          style={{ boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.08)" }}
        >
          {/* Header */}
          <header className="mb-10">
            <p className="text-xs font-semibold text-[#6600CC] uppercase tracking-widest mb-2">
              Légal
            </p>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Politique de Confidentialité
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Dernière mise à jour : 10/03/2026
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              La présente politique décrit la manière dont{" "}
              <strong>Choppe Ton Exam</strong> collecte, utilise et protège vos
              données personnelles, conformément au Règlement (UE) 2016/679
              (RGPD) et à la loi Informatique et Libertés.
            </p>
          </header>

          <div className="flex flex-col gap-8">

            {/* 1 — Responsable du traitement */}
            <Section n={1} title="Responsable du traitement">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-32 shrink-0">Nom</span>
                  <span className="font-medium">Pierre-Louis FRANCO</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-32 shrink-0">Adresse</span>
                  <span className="font-medium">83 Boulevard du Redon, 13009 Marseille, France</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-32 shrink-0">Email</span>
                  <span className="font-medium">contact@choppetonexam.fr</span>
                </div>
              </div>
              <p>
                Pour toute question relative au traitement de vos données,
                contactez-nous à l'adresse ci-dessus.
              </p>
            </Section>

            {/* 2 — Données collectées */}
            <Section n={2} title="Données collectées">
              <p>Nous collectons les données suivantes :</p>

              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Catégorie</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Données</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2.5 font-medium align-top">Compte</td>
                      <td className="px-4 py-2.5 text-gray-600">Prénom, nom, adresse e-mail, numéro de téléphone, mot de passe (chiffré)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium align-top">Abonnement</td>
                      <td className="px-4 py-2.5 text-gray-600">Type de plan souscrit, date d'expiration, crédits restants</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium align-top">Pédagogique</td>
                      <td className="px-4 py-2.5 text-gray-600">Résultats des exercices, résultats des examens blancs, priorités de questions adaptatives</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium align-top">Paiement</td>
                      <td className="px-4 py-2.5 text-gray-600">Données de transaction (montant, date) — aucune donnée bancaire brute n'est stockée par nos soins</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium align-top">Technique</td>
                      <td className="px-4 py-2.5 text-gray-600">Cookies de session (nécessaires à l'authentification)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 3 — Finalités et bases légales */}
            <Section n={3} title="Finalités et bases légales">
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Finalité</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Base légale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Création et gestion du compte</td>
                      <td className="px-4 py-2.5 text-gray-600">Exécution du contrat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Fourniture du service (exercices, examens, guides)</td>
                      <td className="px-4 py-2.5 text-gray-600">Exécution du contrat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Traitement du paiement</td>
                      <td className="px-4 py-2.5 text-gray-600">Exécution du contrat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Envoi des e-mails transactionnels (confirmation, mot de passe)</td>
                      <td className="px-4 py-2.5 text-gray-600">Exécution du contrat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Personalisation de l'entraînement (algorithme adaptatif)</td>
                      <td className="px-4 py-2.5 text-gray-600">Intérêt légitime</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 text-gray-600 align-top">Obligations comptables et fiscales</td>
                      <td className="px-4 py-2.5 text-gray-600">Obligation légale</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* 4 — Durée de conservation */}
            <Section n={4} title="Durée de conservation">
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li>
                  <strong>Données de compte</strong> : durée de vie du compte,
                  puis 3 ans après la dernière activité (délai de prescription de droit commun).
                </li>
                <li>
                  <strong>Données pédagogiques</strong> : durée de l'abonnement
                  actif, puis suppression ou anonymisation.
                </li>
                <li>
                  <strong>Données de facturation</strong> : 10 ans à compter de
                  la transaction (obligation légale comptable — article L123-22 du Code de commerce).
                </li>
                <li>
                  <strong>Cookies de session</strong> : durée de la session,
                  au maximum 7 jours.
                </li>
              </ul>
            </Section>

            {/* 5 — Sous-traitants */}
            <Section n={5} title="Sous-traitants et destinataires">
              <p>
                Vos données peuvent être transmises aux sous-traitants suivants,
                dans le strict respect de leurs obligations contractuelles et du RGPD :
              </p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Sous-traitant</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Rôle</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Pays</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Supabase</td>
                      <td className="px-4 py-2.5 text-gray-600">Base de données, authentification</td>
                      <td className="px-4 py-2.5 text-gray-600">USA / UE</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Stripe</td>
                      <td className="px-4 py-2.5 text-gray-600">Traitement des paiements</td>
                      <td className="px-4 py-2.5 text-gray-600">USA / UE</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Resend</td>
                      <td className="px-4 py-2.5 text-gray-600">E-mails transactionnels</td>
                      <td className="px-4 py-2.5 text-gray-600">USA</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Google Cloud Storage</td>
                      <td className="px-4 py-2.5 text-gray-600">Hébergement des fichiers audio et images</td>
                      <td className="px-4 py-2.5 text-gray-600">USA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Les transferts de données vers des pays hors de l'Union européenne
                (USA) sont encadrés par des{" "}
                <strong>clauses contractuelles types</strong> (CCT) approuvées
                par la Commission européenne, ou des mécanismes équivalents
                garantissant un niveau de protection adéquat.
              </p>
            </Section>

            {/* 6 — Cookies */}
            <Section n={6} title="Cookies">
              <p>
                Choppe Ton Exam utilise uniquement des{" "}
                <strong>cookies strictement nécessaires</strong> au fonctionnement
                du service :
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li>
                  <strong>Cookie de session Supabase</strong> : maintient votre
                  connexion entre les pages. Sans ce cookie, vous seriez déconnecté
                  à chaque navigation.
                </li>
              </ul>
              <p>
                Aucun cookie analytique (Google Analytics, Hotjar…) ni
                publicitaire (Meta Pixel, Google Ads…) n'est déposé sur votre
                navigateur. Le bandeau de consentement cookies affiché sur le
                site vise à vous en informer explicitement.
              </p>
            </Section>

            {/* 7 — Droits */}
            <Section n={7} title="Vos droits">
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li><strong>Droit d'accès</strong> — obtenir une copie de vos données.</li>
                <li><strong>Droit de rectification</strong> — corriger des données inexactes.</li>
                <li><strong>Droit à l'effacement</strong> — demander la suppression de votre compte et de vos données.</li>
                <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré.</li>
                <li><strong>Droit d'opposition</strong> — vous opposer au traitement fondé sur l'intérêt légitime.</li>
                <li><strong>Droit à la limitation</strong> — restreindre temporairement un traitement.</li>
              </ul>
              <p>
                Pour exercer l'un de ces droits, contactez-nous à{" "}
                <strong>contact@choppetonexam.fr</strong>. Nous répondrons
                dans un délai maximum d'<strong>1 mois</strong>.
              </p>
              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous
                pouvez introduire une réclamation auprès de la{" "}
                <strong>CNIL</strong> :{" "}
                <a
                  href="https://www.cnil.fr/fr/plaintes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6600CC] underline hover:opacity-80 transition-opacity"
                >
                  www.cnil.fr/fr/plaintes
                </a>.
              </p>
            </Section>

            {/* 8 — Sécurité */}
            <Section n={8} title="Sécurité">
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles
                appropriées pour protéger vos données contre tout accès non autorisé,
                perte ou divulgation :
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-gray-700">
                <li>Chiffrement des communications via HTTPS (TLS).</li>
                <li>Mots de passe stockés sous forme hachée (bcrypt via Supabase Auth).</li>
                <li>Politiques de sécurité au niveau des lignes (Row Level Security) sur la base de données.</li>
                <li>Données bancaires traitées exclusivement par Stripe (certifié PCI-DSS niveau 1).</li>
              </ul>
            </Section>

            {/* 9 — Modifications */}
            <Section n={9} title="Modifications de la politique">
              <p>
                La présente politique peut être mise à jour à tout moment.
                La version en vigueur est toujours celle publiée sur cette page,
                avec sa date de mise à jour en en-tête.
              </p>
              <p>
                En cas de modification substantielle affectant vos droits,
                vous en serez informé par e-mail ou par un bandeau d'information
                lors de votre prochaine connexion.
              </p>
            </Section>

          </div>

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              Pour toute question, contactez-nous à{" "}
              <strong className="text-gray-500">contact@choppetonexam.fr</strong>.
              Cette politique est complémentaire à nos{" "}
              <a href="/cgv" className="underline hover:text-[#6600CC] transition-colors">
                Conditions Générales de Vente
              </a>.
            </p>
          </div>

        </article>
      </div>
    </div>
  );
}

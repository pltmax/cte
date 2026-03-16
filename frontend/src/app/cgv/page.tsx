import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Choppe Ton Exam",
  description:
    "Consultez les conditions générales de vente de Choppe Ton Exam : abonnements, crédits examens, droit de rétractation et modalités de paiement.",
  alternates: {
    canonical: "https://choppetonexam.fr/cgv",
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

function Fill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
      ✎ {label}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CGVPage() {
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
              Conditions Générales de Vente
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Dernière mise à jour : 10/03/2026
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Les présentes conditions générales de vente (ci-après «&nbsp;CGV&nbsp;»)
              régissent toute commande passée sur la plateforme Choppe Ton Exam
              accessible à l'adresse <strong>choppetonexam.fr</strong>.
              En procédant au paiement, le Client déclare avoir lu, compris et
              accepté les présentes CGV sans réserve.
            </p>
          </header>

          <div className="flex flex-col gap-8">

            {/* 1 — Vendeur */}
            <Section n={1} title="Éditeur et vendeur">
              <p>Le service est édité et commercialisé par :</p>
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm space-y-1.5">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">Raison sociale</span>
                  <span className="font-medium">Mr. Pierre-Louis FRANCO</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">Forme juridique</span>
                  <span className="font-medium">Entreprise individuelle</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">Adresse</span>
                  <span className="font-medium">83 Boulevard du Redon, 13009 Marseille, France</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">SIREN</span>
                  <span className="font-medium">102 080 405</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">TVA</span>
                  <span className="font-medium">TVA non applicable (franchise en base)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-28 shrink-0">Email</span>
                  <span className="font-medium">contact@choppetonexam.fr</span>
                </div>
              </div>
            </Section>

            {/* 2 — Objet */}
            <Section n={2} title="Objet">
              <p>
                Les présentes CGV ont pour objet de définir les droits et obligations
                des parties dans le cadre de la vente en ligne d'abonnements d'accès
                à la plateforme <strong>Choppe Ton Exam</strong>, service de
                préparation au test TOEIC Listening &amp; Reading.
              </p>
              <p>
                Les services proposés sont exclusivement à destination de
                consommateurs particuliers (B2C). Toute revente ou utilisation
                commerciale est interdite.
              </p>
            </Section>

            {/* 3 — Services */}
            <Section n={3} title="Description des services">
              <p>
                La plateforme propose des abonnements payants donnant accès à :
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Des exercices interactifs couvrant les 7 parties du TOEIC</li>
                <li>Des guides pédagogiques (stratégies, vocabulaire, grammaire)</li>
                <li>Des crédits permettant de passer des examens blancs complets</li>
              </ul>
              <p>
                Les plans disponibles sont les suivants :
              </p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Plan</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Durée</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Crédits</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Prix TTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Rush</td>
                      <td className="px-4 py-2.5 text-gray-500">2 semaines</td>
                      <td className="px-4 py-2.5 text-gray-500">2</td>
                      <td className="px-4 py-2.5 text-gray-500">14,00 €</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-medium">Chill</td>
                      <td className="px-4 py-2.5 text-gray-500">1 mois</td>
                      <td className="px-4 py-2.5 text-gray-500">4</td>
                      <td className="px-4 py-2.5 text-gray-500">20,00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400">
                Tarifs susceptibles d'évoluer. Le prix applicable est celui affiché au moment de la commande.
              </p>
            </Section>

            {/* 4 — Prix et paiement */}
            <Section n={4} title="Prix et modalités de paiement">
              <p>
                Les prix sont exprimés en euros, toutes taxes comprises (TTC).{" "}
              </p>
              <p>
                Le paiement est effectué en ligne au moment de la commande,
                de façon sécurisée via <strong>Stripe</strong>.
                Les données bancaires du Client ne sont jamais transmises ni
                stockées par Choppe Ton Exam — elles sont traitées exclusivement
                par Stripe (certifié PCI-DSS).
              </p>
              <p>
                L'accès aux services est activé immédiatement après confirmation
                du paiement. La commande est considérée comme définitive à réception
                de la confirmation par email.
              </p>
            </Section>

            {/* 5 — Droit de rétractation */}
            <Section n={5} title="Droit de rétractation">
              <p>
                Conformément à l'article L221-28 du Code de la consommation,{" "}
                <strong>
                  le droit de rétractation de 14 jours ne s'applique pas
                </strong>{" "}
                aux contenus numériques non fournis sur support matériel lorsque
                l'exécution a commencé avec l'accord préalable et exprès du
                consommateur, qui a renoncé à son droit de rétractation.
              </p>
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
                <strong>Important :</strong> en cochant la case «&nbsp;Je renonce à
                mon droit de rétractation pour accéder immédiatement au contenu
                numérique&nbsp;» au moment du paiement, le Client reconnaît avoir
                été informé de cette renonciation et accepte que l'accès soit
                ouvert immédiatement, sans possibilité de remboursement ultérieur.
              </div>
            </Section>

            {/* 6 — Crédits examens */}
            <Section n={6} title="Crédits examens blancs">
              <p>
                Les crédits examens blancs sont des unités consommables incluses
                dans certains plans d'abonnement. Chaque crédit permet de lancer
                un examen blanc complet (200 questions, 2 heures).
              </p>
              <p>
                Les crédits sont soumis aux règles suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Ils sont valables pendant toute la durée de l'abonnement actif.</li>
                <li>
                  Ils <strong>ne sont pas remboursables</strong>, que ce soit
                  partiellement ou totalement, y compris en cas de résiliation
                  anticipée.
                </li>
                <li>
                  Un crédit est considéré comme consommé dès le lancement d'un
                  examen, même si celui-ci est abandonné en cours de session.
                </li>
                <li>
                  Les crédits non utilisés à l'expiration de l'abonnement sont
                  perdus et ne font l'objet d'aucun avoir.
                </li>
              </ul>
            </Section>

            {/* 7 — Durée, résiliation */}
            <Section n={7} title="Durée de l'abonnement et résiliation">
              <p>
                Les abonnements sont à durée déterminée, non reconductibles
                automatiquement. L'accès expire à la date indiquée lors de la
                souscription et dans l'email de confirmation.
              </p>
              <p>
                Aucun remboursement n'est accordé en cas de résiliation avant
                l'échéance, sauf obligation légale contraire.
              </p>
              <p>
                L'éditeur se réserve le droit de suspendre ou supprimer le compte
                d'un utilisateur en cas de manquement aux présentes CGV ou aux
                Conditions d'utilisation de la plateforme.
              </p>
            </Section>

            {/* 8 — Propriété intellectuelle */}
            <Section n={8} title="Propriété intellectuelle">
              <p>
                L'ensemble des contenus de la plateforme (textes, exercices,
                guides, questions d'entraînement, interfaces) est la propriété
                exclusive de Mr. Pierre-Louis FRANCO ou de ses
                concédants de licence.
              </p>
              <p>
                Toute reproduction, redistribution, revente ou extraction de
                contenu, à des fins commerciales ou non, est strictement
                interdite sans autorisation écrite préalable.
              </p>
              <p>
                Le Client bénéficie d'un droit d'utilisation personnel,
                non exclusif et non cessible pour la durée de son abonnement.
              </p>
            </Section>

            {/* 9 — Responsabilité */}
            <Section n={9} title="Limitation de responsabilité">
              <p>
                Choppe Ton Exam est une plateforme d'entraînement indépendante,
                non affiliée à ETS Global (éditeur du TOEIC). Les résultats
                obtenus sur la plateforme constituent des indicateurs pédagogiques
                et ne constituent en aucun cas une garantie de score lors du
                test officiel.
              </p>
              <p>
                L'éditeur s'engage à assurer la disponibilité du service dans la
                limite du possible, mais ne peut être tenu responsable
                d'interruptions techniques, de force majeure ou d'indisponibilités
                ponctuelles. En cas d'interruption prolongée, un avoir ou un
                report de l'abonnement pourra être proposé à la discrétion de
                l'éditeur.
              </p>
            </Section>

            {/* 10 — Données personnelles */}
            <Section n={10} title="Données personnelles">
              <p>
                Le traitement des données personnelles collectées lors de la
                commande (nom, email, données de paiement) est régi par notre
                Politique de confidentialité, consultable à l'adresse{" "}
                <a href="/confidentialite" target="_blank" rel="noopener noreferrer" className="text-[#6600CC]">Confidentialité</a>.
              </p>
              <p>
                Conformément au RGPD (Règlement UE 2016/679), le Client dispose
                d'un droit d'accès, de rectification, de suppression et de
                portabilité de ses données, en contactant{" "}
                contact@choppetonexam.fr.
              </p>
            </Section>

            {/* 11 — Droit applicable */}
            <Section n={11} title="Droit applicable et litiges">
              <p>
                Les présentes CGV sont soumises au droit français.
              </p>
              <p>
                En cas de litige, le Client peut recourir gratuitement à un
                médiateur de la consommation avant toute action judiciaire.
                Le médiateur compétent est :{" "}
              </p>
                <p className="font-bold text-[#6600CC]">Médiateur de la consommation CNPM - Médiation de la consommation</p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>27 avenue de la Libération, 42400 Saint-Chamond, France</li>
                    <li>contact@cnpm-mediation-consommation.eu</li>
                    <li className="text-[#6600CC]"> <a href="https://cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer">https://cnpm-mediation-consommation.eu</a></li>
                </ul>
              <p>
                À défaut de résolution amiable, les tribunaux français seront
                seuls compétents.
              </p>
            </Section>

          </div>

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed">
              Pour toute question relative à ces CGV, contactez-nous à {"contact@choppetonexam.fr"}.
              Ces conditions peuvent être mises à jour ; la version en vigueur
              est toujours celle publiée sur cette page.
            </p>
          </div>

        </article>
      </div>
    </div>
  );
}

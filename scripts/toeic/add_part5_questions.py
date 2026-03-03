"""Add 5 new questions per category to Part 5 exercise JSON files."""
import json
import shutil
from pathlib import Path

BASE = Path(__file__).parent.parent.parent / "mockexamData" / "TOEIC"

NEW_QUESTIONS = [
    # ──────────────────────── WORD FORM (5) ────────────────────────
    {
        "category": "word_form",
        "sentence": "The committee was impressed by the _____ of the candidate's response to the technical questions.",
        "options": ["(A) comprehensive", "(B) comprehensively", "(C) comprehensiveness", "(D) comprehend"],
        "answer": "C",
        "strategy": "Le blanc est précédé de l'article 'the' et suivi de la préposition 'of'. La structure 'the + _____ + of' est réservée à un nom — seule la forme nominale convient.",
        "traps": "(A) 'comprehensive' est un adjectif — ne peut pas être le noyau du groupe nominal précédé de 'the'. (B) 'comprehensively' est un adverbe — jamais noyau d'un groupe nominal. (D) 'comprehend' est un verbe — incompatible avec la position après l'article défini.",
        "explanation": "'Comprehensiveness' (C) est le nom abstrait dérivé de l'adjectif 'comprehensive' via le suffixe '-ness'. Ce type de dérivation — adjectif + -ness → nom abstrait — est régulièrement testé au TOEIC : 'effective → effectiveness', 'responsive → responsiveness', 'aware → awareness'. Le patron 'the + NOM déverbal/dénominal + of' structure un groupe nominal formel très courant dans les évaluations professionnelles."
    },
    {
        "category": "word_form",
        "sentence": "Employees who _____ perform above expectations are eligible for a quarterly performance bonus.",
        "options": ["(A) consistent", "(B) consistently", "(C) consistency", "(D) consists"],
        "answer": "B",
        "strategy": "Le blanc se trouve entre le pronom relatif 'who' et le verbe 'perform'. Cette position — entre le relatif et le verbe — est réservée à un adverbe de manière.",
        "traps": "(A) 'consistent' est un adjectif — il modifie un nom, pas un verbe. (C) 'consistency' est un nom — il ne peut pas modifier un verbe. (D) 'consists' est une forme verbale conjuguée — deux formes verbales ne peuvent pas se combiner directement de cette façon.",
        "explanation": "'Consistently' (B) est l'adverbe de manière qui modifie le verbe 'perform', indiquant la régularité de la performance. Dans les propositions relatives, l'adverbe peut se placer entre le pronom relatif et le verbe : 'employees who consistently perform', 'staff who regularly contribute'. Le TOEIC teste souvent la position des adverbes par rapport aux verbes dans les propositions subordonnées."
    },
    {
        "category": "word_form",
        "sentence": "The project's _____ ahead of schedule allowed the company to take on two additional contracts.",
        "options": ["(A) complete", "(B) completing", "(C) completion", "(D) completely"],
        "answer": "C",
        "strategy": "Le blanc est précédé du génitif 'project's' et suivi de la préposition 'ahead of'. La structure 'possessif + _____ + adverbe' encadre un nom — noyau du groupe nominal sujet.",
        "traps": "(A) 'complete' est soit un adjectif soit un verbe — ne peut pas être le noyau d'un groupe nominal après un génitif dans ce contexte. (B) 'completing' est le gérondif — 'The project's completing' n'est pas idiomatique en anglais formel. (D) 'completely' est un adverbe — jamais noyau d'un groupe nominal.",
        "explanation": "'Completion' (C) est le nom déverbal standard dérivé de 'complete'. Le TOEIC teste régulièrement la série 'complete → completion → completely → complete (adj)'. La structure 'possessif + NOM déverbal' est très courante : 'the project's completion', 'the department's reorganization', 'the team's achievement'."
    },
    {
        "category": "word_form",
        "sentence": "The board's new governance policies are _____ aligned with international best practices in corporate transparency.",
        "options": ["(A) broad", "(B) broadly", "(C) broaden", "(D) breadth"],
        "answer": "B",
        "strategy": "Le blanc se trouve entre l'auxiliaire 'are' et le participe passé 'aligned'. Cette position — entre un auxiliaire et un participe — est réservée aux adverbes de degré ou de manière.",
        "traps": "(A) 'broad' est un adjectif — il modifie des noms, pas des participes dans cette position. (C) 'broaden' est un verbe — deux formes verbales ne peuvent pas se combiner de cette façon. (D) 'breadth' est un nom — un nom ne peut pas modifier un participe passé.",
        "explanation": "'Broadly' (B) est l'adverbe qui modifie 'aligned', indiquant le degré ou la portée de l'alignement. Le schéma 'auxiliaire + ADVERBE + participe passé' est classique au TOEIC : 'are broadly aligned', 'is widely recognized', 'has been fully implemented'. L'adverbe 'broadly' en particulier est très fréquent dans le discours corporatif pour exprimer un alignement général sans être absolu."
    },
    {
        "category": "word_form",
        "sentence": "The _____ of the quarterly earnings exceeded all analyst forecasts by a considerable margin.",
        "options": ["(A) announce", "(B) announcer", "(C) announcement", "(D) announced"],
        "answer": "C",
        "strategy": "Le blanc est précédé de l'article 'The' et suivi de la préposition 'of'. La structure 'article + _____ + of' est réservée à un nom.",
        "traps": "(A) 'announce' est un verbe — ne peut pas suivre directement l'article. (B) 'announcer' désigne une personne — 'the announcer of earnings' est sémantiquement incorrect dans ce contexte. (D) 'announced' est un participe passé — ne peut pas être le noyau nominal ici.",
        "explanation": "'Announcement' (C) est le nom d'action standard dérivé de 'announce' via le suffixe '-ment'. Dans le discours financier, on parle de 'the announcement of earnings', 'the announcement of results', 'the announcement of the merger'. La dérivation 'announce → announcement' est l'un des patrons de suffixation les plus productifs en anglais professionnel, avec '-tion/-ation', '-ness', et '-al'."
    },

    # ──────────────────────── VOCABULARY (5) ────────────────────────
    {
        "category": "vocabulary",
        "sentence": "The charity event successfully _____ over $50,000 in donations for the local children's hospital.",
        "options": ["(A) collected", "(B) gathered", "(C) raised", "(D) earned"],
        "answer": "C",
        "strategy": "Cherche le verbe qui collocate avec 'donations' et 'funds' dans le contexte spécifique d'un événement caritatif de collecte de fonds.",
        "traps": "(A) 'collected' peut s'employer avec 'donations' mais 'raise funds' est la collocation dominante pour un événement caritatif. (B) 'gathered' s'applique à des personnes ou des objets physiques rassemblés — 'gathered donations' n'est pas une collocation établie. (D) 'earned' implique une rémunération pour un travail — une organisation caritative ne gagne pas des dons, elle les recueille.",
        "explanation": "'Raise' (C) est le verbe quasi exclusif pour la collecte de fonds dans un contexte caritatif ou de financement : 'raise funds', 'raise money', 'raise $50,000'. L'expression 'fundraising' (collecte de fonds) est dérivée de ce verbe et indique sa centralité. Le TOEIC teste régulièrement 'raise' dans les textes sur les événements philanthropiques et les campagnes de dons."
    },
    {
        "category": "vocabulary",
        "sentence": "The company decided to _____ several non-core divisions in order to focus on its primary business segments.",
        "options": ["(A) close", "(B) shut", "(C) divest", "(D) dismiss"],
        "answer": "C",
        "strategy": "Cherche le terme technique de finance d'entreprise qui désigne la cession (vente) de filiales ou de divisions non stratégiques à un tiers.",
        "traps": "(A) 'close' signifie fermer définitivement une activité sans nécessairement la vendre — 'close a division' implique une cessation, pas une cession. (B) 'shut' a le même problème que 'close', avec un registre encore plus courant et informel. (D) 'dismiss' signifie licencier des personnes ou rejeter une idée — il ne s'applique pas à des unités d'entreprise.",
        "explanation": "'Divest' (C) est le terme technique standard en finance d'entreprise pour la cession d'actifs, de filiales ou de divisions : 'divest non-core assets', 'divestiture strategy', 'divest a subsidiary'. Il implique non pas une fermeture mais une vente à un tiers. Le TOEIC teste ce vocabulaire financier spécialisé dans les textes sur les fusions-acquisitions et les restructurations d'entreprise."
    },
    {
        "category": "vocabulary",
        "sentence": "The hotel has _____ all guest reservations until the renovation work is complete.",
        "options": ["(A) extended", "(B) transferred", "(C) suspended", "(D) paused"],
        "answer": "C",
        "strategy": "Cherche le verbe formel et officiel qui exprime l'interruption temporaire et officielle d'un service ou d'une activité, avec intention de reprendre.",
        "traps": "(A) 'extended' signifie prolongé dans le temps — ici, les réservations ne sont pas prolongées mais interrompues. (B) 'transferred' signifie déplacées vers autre chose — des réservations transférées seraient déplacées vers un autre hôtel ou une autre date, ce qui n'est pas indiqué. (D) 'paused' est possible sémantiquement mais appartient à un registre technique/informatique et est trop informel dans un contexte hôtelier.",
        "explanation": "'Suspended' (C) est le terme officiel standard pour l'arrêt temporaire d'un service, d'une activité ou d'un droit : 'suspend operations', 'suspend reservations', 'suspend service'. Il implique une interruption officielle et temporaire avec intention de reprendre — exactement le contexte d'une rénovation. 'Suspend' est très fréquent dans les communications officielles du TOEIC : annonces d'hôtels, d'administrations, d'entreprises."
    },
    {
        "category": "vocabulary",
        "sentence": "The employee handbook clearly _____ the procedures for requesting annual leave and managing absence.",
        "options": ["(A) describes", "(B) explains", "(C) outlines", "(D) defines"],
        "answer": "C",
        "strategy": "Cherche le verbe qui exprime la présentation structurée et organisée d'étapes ou de procédures dans un document officiel — non pas une description narrative, mais un plan clair.",
        "traps": "(A) 'describes' s'utilise pour une description narrative ou détaillée — moins précis pour un manuel qui liste des étapes de façon structurée. (B) 'explains' implique une démarche pédagogique pour faire comprendre quelque chose de complexe — différent de présenter une liste de procédures. (D) 'defines' signifie donner la définition formelle d'un terme — il conviendrait si on donnait des définitions, pas des listes d'étapes.",
        "explanation": "'Outlines' (C) est le verbe standard pour la présentation structurée et synthétique d'un ensemble d'informations ou d'étapes dans un document : 'outline the procedures', 'outline the key steps', 'outline the requirements'. Il implique une organisation claire et lisible — exactement ce qu'on attend d'un handbook. Le TOEIC teste régulièrement ce verbe dans les textes sur les manuels d'entreprise et les politiques internes."
    },
    {
        "category": "vocabulary",
        "sentence": "Both parties have agreed to _____ the final payment schedule before signing the partnership agreement.",
        "options": ["(A) confirm", "(B) settle", "(C) finalize", "(D) establish"],
        "answer": "C",
        "strategy": "Cherche le verbe qui exprime l'achèvement des derniers détails d'une négociation ou d'un document, avec l'idée de rendre définitif ce qui était encore en cours de discussion.",
        "traps": "(A) 'confirm' signifie valider quelque chose qui existait déjà — ici, il s'agit de compléter les derniers détails, pas de confirmer un calendrier déjà établi. (B) 'settle' implique davantage la résolution d'un litige ou d'un désaccord — le contexte est ici une négociation coopérative. (D) 'establish' signifie créer ou mettre en place quelque chose qui n'existait pas — mais ici le calendrier est en cours de négociation, pas absent.",
        "explanation": "'Finalize' (C) est le verbe standard pour l'achèvement et la mise au point définitive d'un accord, d'un document ou d'une décision : 'finalize the details', 'finalize the contract', 'finalize the schedule'. Il implique que le processus est sur le point d'être complété et rendu irrévocable. C'est l'un des verbes les plus fréquents dans les textes de négociation commerciale du TOEIC."
    },

    # ──────────────────────── VERB TENSE (5) ────────────────────────
    {
        "category": "verb_tense",
        "sentence": "By the time the quarterly review _____, all department heads will have submitted their progress reports.",
        "options": ["(A) begins", "(B) will begin", "(C) began", "(D) had begun"],
        "answer": "A",
        "strategy": "Repère la structure 'By the time + proposition subordonnée'. Quand la principale est au futur ('will have submitted'), la subordonnée après 'by the time' prend le présent simple — jamais le futur.",
        "traps": "(B) 'will begin' est fautif — en anglais, les propositions temporelles avec 'when', 'before', 'after', 'by the time' ne prennent jamais le futur même si le sens est futur. (C) 'began' est le simple past — la phrase est orientée vers l'avenir, pas le passé. (D) 'had begun' est le plus-que-parfait — réservé à une action antérieure à un autre événement passé.",
        "explanation": "La règle 'pas de futur dans une proposition subordonnée temporelle' est fondamentale en anglais : 'By the time + présent simple, ... + futur parfait'. Ce patron est très fréquent au TOEIC : 'By the time you receive this letter, the shipment will already have arrived.' L'erreur (B) est la plus tentante car le sens est futur — mais la règle grammaticale interdit le futur dans ce type de subordonnée."
    },
    {
        "category": "verb_tense",
        "sentence": "The company _____ its environmental policy every two years to ensure compliance with updated regulations.",
        "options": ["(A) revises", "(B) is revising", "(C) has revised", "(D) will have revised"],
        "answer": "A",
        "strategy": "Repère l'indice de fréquence 'every two years'. Une action habituellement répétée à intervalles réguliers s'exprime au présent simple.",
        "traps": "(B) 'is revising' est le présent continu — il s'utilise pour une action en cours à ce moment précis, pas une pratique périodique. (C) 'has revised' est le present perfect — il décrit un résultat actuel d'une action passée, pas une habitude. (D) 'will have revised' est le futur parfait — il décrit une action qui sera complétée avant un moment futur donné.",
        "explanation": "'Revises' (A) est le présent simple qui exprime une action habituelle répétée à intervalles réguliers — exactement ce qu'indique 'every two years'. Les marqueurs de fréquence comme 'every [période]', 'annually', 'monthly', 'regularly' sont des indices clés du présent simple au TOEIC. La confusion la plus fréquente est avec (B) le présent continu, qui décrit une action temporaire en cours, pas une politique d'entreprise permanente."
    },
    {
        "category": "verb_tense",
        "sentence": "The architect _____ the blueprints when the client unexpectedly arrived at the office to discuss the changes.",
        "options": ["(A) reviews", "(B) was reviewing", "(C) had reviewed", "(D) reviewed"],
        "answer": "B",
        "strategy": "Repère la structure d'interruption : une action en cours (passé continu) est interrompue par un événement ponctuel ('when the client arrived'). Le simple past 'arrived' est l'action qui interrompt.",
        "traps": "(A) 'reviews' est le présent simple — incompatible avec une narration au passé. (C) 'had reviewed' est le plus-que-parfait — il impliquerait que la révision était terminée avant l'arrivée du client, ce qui contredit le sens. (D) 'reviewed' au simple past placerait deux actions ponctuelles simultanées, sans exprimer l'idée d'une interruption.",
        "explanation": "'Was reviewing' (B) est le past continuous qui décrit l'action en cours au moment de l'interruption. Le patron 'past continuous + when + simple past' est l'une des structures les plus testées au TOEIC : 'was reviewing when... arrived', 'was conducting when... called', 'was preparing when... interrupted'. C'est le schéma standard de narration d'une interruption dans le passé."
    },
    {
        "category": "verb_tense",
        "sentence": "The construction of the new headquarters _____ for three weeks before engineers discovered a problem with the foundation.",
        "options": ["(A) had been underway", "(B) is underway", "(C) has been underway", "(D) would be underway"],
        "answer": "A",
        "strategy": "Repère que la phrase entière est au passé ('engineers discovered'). Une action qui durait depuis un certain temps avant un événement passé s'exprime au plus-que-parfait continu.",
        "traps": "(B) 'is underway' est le présent — incompatible avec un contexte narratif entièrement au passé. (C) 'has been underway' est le present perfect continuous — il relie le passé au présent actuel, mais ici l'événement (la découverte) est dans le passé. (D) 'would be underway' est le conditionnel — il exprime une hypothèse, pas un fait narratif.",
        "explanation": "'Had been underway' (A) est le past perfect continuous qui exprime la durée d'une action en cours jusqu'à un moment passé spécifique. Le patron 'had been [action] + for [durée] + before [simple past]' est fréquent au TOEIC pour indiquer qu'un processus était en cours quand un événement le perturbe. La difficulté réside dans la distinction avec (C) — la clé est que tous les événements sont dans le passé."
    },
    {
        "category": "verb_tense",
        "sentence": "If the company _____ its marketing budget last quarter, it might have avoided the sharp decline in brand awareness.",
        "options": ["(A) increases", "(B) increased", "(C) had increased", "(D) would have increased"],
        "answer": "C",
        "strategy": "Repère la structure conditionnelle de type 3 (hypothèse sur le passé). La principale contient 'might have avoided' — cela impose 'had + participe passé' dans la subordonnée hypothétique.",
        "traps": "(A) 'increases' est le présent simple — incompatible avec une hypothèse sur le passé. (B) 'increased' est le simple past — c'est le conditionnel de type 2 (hypothèse sur le présent/futur), pas le type 3. (D) 'would have increased' appartient à la principale de type 3, pas à la subordonnée en 'if'.",
        "explanation": "Le conditionnel de type 3 suit la structure 'If + had + participe passé, ... + would/could/might + have + participe passé'. Il exprime une hypothèse contrefactuelle sur le passé. 'Had increased' (C) est la forme correcte pour la subordonnée hypothétique. Le piège (B) correspond au type 2 ('If + simple past, ... + would + base verbale') qui porte sur le présent ou l'avenir."
    },

    # ──────────────────────── PREPOSITION (5) ────────────────────────
    {
        "category": "preposition",
        "sentence": "The new safety regulations will take effect _____ January 1st and will apply to all manufacturing facilities.",
        "options": ["(A) in", "(B) at", "(C) on", "(D) from"],
        "answer": "C",
        "strategy": "'January 1st' est une date précise incluant un numéro de jour. Les dates précises avec un numéro de jour prennent la préposition 'on'.",
        "traps": "(A) 'in' s'utilise avec les mois ('in January'), les saisons, les années ('in 2025') — pas avec une date précise incluant le numéro du jour. (B) 'at' s'utilise avec les heures ('at 9 a.m.') et certaines expressions ('at night') — jamais avec une date. (D) 'from' est plausible dans 'from January 1st' mais 'take effect on [date]' est la collocation standard dans les documents officiels.",
        "explanation": "La préposition 'on' (C) est obligatoire avec les dates incluant un numéro de jour : 'on January 1st', 'on Monday', 'on the 15th'. La règle mnémotechnique est : 'in' pour les périodes (an, mois, saison), 'on' pour les jours et dates, 'at' pour les moments précis (heure). 'Take effect on [date]' est la collocation officielle standard dans tous les documents réglementaires et juridiques."
    },
    {
        "category": "preposition",
        "sentence": "The project was delivered _____ budget despite several unexpected delays during the construction phase.",
        "options": ["(A) under", "(B) below", "(C) within", "(D) inside"],
        "answer": "A",
        "strategy": "Cherche la préposition qui forme la collocation figée avec 'budget' pour exprimer que le coût final est inférieur au budget prévu.",
        "traps": "(B) 'below budget' est grammaticalement et sémantiquement possible, mais 'under budget' est la collocation quasi figée et la plus fréquente dans le discours professionnel. (C) 'within budget' signifie 'dans les limites du budget' — légèrement différent de 'inférieur au budget'. (D) 'inside budget' n'est pas une collocation établie en anglais professionnel.",
        "explanation": "'Under budget' (A) est la collocation standard pour indiquer que les coûts réels sont inférieurs aux prévisions : 'delivered under budget', 'completed under budget', 'came in under budget'. Avec 'on budget' (dans le budget prévu) et 'over budget' (au-delà du budget), ces trois expressions forment un groupe figé très fréquent dans les rapports de gestion de projet du TOEIC."
    },
    {
        "category": "preposition",
        "sentence": "The new employee orientation program is _____ charge of the Human Resources Development team.",
        "options": ["(A) in", "(B) under", "(C) at", "(D) on"],
        "answer": "A",
        "strategy": "Cherche la préposition qui forme la collocation figée avec 'charge' pour exprimer la responsabilité ou la supervision d'une équipe.",
        "traps": "(B) 'under charge' n'est pas une collocation établie en anglais standard. (C) 'at charge' n'est pas une expression anglaise correcte dans ce sens. (D) 'on charge' n'existe pas dans ce sens.",
        "explanation": "'In charge of' (A) est la collocation figée standard pour exprimer la responsabilité d'une personne ou d'une équipe : 'in charge of the program', 'in charge of the project', 'put someone in charge of'. C'est l'une des collocations prépositionnelles les plus fréquentes du TOEIC. La confusion avec 'responsible for' est courante — les deux expriment la responsabilité mais 'in charge of' insiste davantage sur le contrôle et la supervision."
    },
    {
        "category": "preposition",
        "sentence": "The managing director was _____ a business trip in Singapore when the emergency board meeting was called.",
        "options": ["(A) in", "(B) on", "(C) at", "(D) for"],
        "answer": "B",
        "strategy": "Cherche la préposition qui forme la collocation figée avec 'business trip' pour exprimer l'état d'être en train d'effectuer un voyage d'affaires.",
        "traps": "(A) 'in a business trip' n'est pas une expression correcte en anglais. (C) 'at a business trip' n'est pas correct — 'at' s'utilise pour des événements statiques (at a conference, at a meeting), pas pour un voyage. (D) 'for a business trip' exprime le but ('il est parti pour un voyage') mais pas l'état d'être en train d'en faire un.",
        "explanation": "'On a business trip' (B) est la collocation figée standard : on est 'on' un voyage tout comme on est 'on' une mission, 'on' duty, 'on' leave. Cette préposition exprime l'état actuel d'être engagé dans une activité de déplacement. Le TOEIC teste fréquemment les collocations 'on + [type d'activité professionnelle]' : 'on a business trip', 'on assignment', 'on leave', 'on duty'."
    },
    {
        "category": "preposition",
        "sentence": "The new pricing policy was implemented _____ accordance with the recommendations of the external consulting firm.",
        "options": ["(A) in", "(B) on", "(C) by", "(D) with"],
        "answer": "A",
        "strategy": "'Accordance' apparaît toujours avec la préposition 'in' dans l'expression figée 'in accordance with', signifiant 'conformément à'. La structure est figée et ne tolère aucune variation.",
        "traps": "(B) 'on accordance' n'existe pas. (C) 'by accordance' n'existe pas. (D) 'with accordance' n'est pas la formulation correcte — bien que 'with' soit dans l'expression complète, la préposition qui précède 'accordance' est 'in'.",
        "explanation": "'In accordance with' (A) est une locution prépositionnelle figée qui signifie 'conformément à', 'en accord avec' : 'in accordance with the regulations', 'in accordance with company policy', 'in accordance with the agreement'. Elle est caractéristique du registre juridique et administratif et apparaît très régulièrement dans les textes du TOEIC. C'est l'une des locutions les plus testées dans la catégorie des prépositions composées."
    },

    # ──────────────────────── CONJUNCTION (5) ────────────────────────
    {
        "category": "conjunction",
        "sentence": "The construction project was completed on time _____ the team faced several unexpected logistical challenges.",
        "options": ["(A) because", "(B) although", "(C) so that", "(D) unless"],
        "answer": "B",
        "strategy": "La structure 'résultat positif + _____ + obstacle' indique une opposition ou une concession — cherche la conjonction de concession qui introduit une proposition subordonnée (sujet + verbe).",
        "traps": "(A) 'because' exprime la cause — 'completed on time because faced challenges' est sémantiquement incohérent (l'obstacle ne cause pas le succès). (C) 'so that' exprime le but — grammaticalement incorrect ici car il faudrait un auxiliaire supplémentaire. (D) 'unless' exprime une condition négative ('sauf si') — incompatible avec le sens.",
        "explanation": "'Although' (B) est la conjonction de concession qui introduit une proposition subordonnée s'opposant à la proposition principale. C'est le patron 'résultat + although + obstacle' ou 'although + obstacle, résultat'. Les conjonctions de concession les plus fréquentes au TOEIC sont 'although', 'even though', 'despite the fact that' — toutes suivies d'un sujet + verbe."
    },
    {
        "category": "conjunction",
        "sentence": "Please ensure that all invoices are approved by the department head _____ they are submitted to the finance office.",
        "options": ["(A) in case", "(B) provided that", "(C) before", "(D) whenever"],
        "answer": "C",
        "strategy": "La relation logique entre les deux propositions est chronologique : une action doit obligatoirement précéder l'autre. Cherche la conjonction temporelle qui exprime cette antériorité.",
        "traps": "(A) 'in case' exprime une précaution pour une éventualité ('au cas où') — il n'établit pas une séquence obligatoire. (B) 'provided that' exprime une condition ('à condition que') — possible mais moins précis pour une séquence temporelle obligatoire. (D) 'whenever' exprime la répétition ('chaque fois que') — il n'implique pas la même idée de séquence prescriptive.",
        "explanation": "'Before' (C) est la conjonction temporelle qui établit clairement que l'approbation doit précéder la soumission : 'approved before they are submitted'. Dans les directives et procédures internes du TOEIC, 'before' est la conjonction standard pour exprimer une séquence obligatoire d'étapes. La confusion la plus fréquente est avec (B) 'provided that', qui rendrait la phrase conditionnelle plutôt que temporelle."
    },
    {
        "category": "conjunction",
        "sentence": "_____ the report was submitted on time, several figures in the financial section needed to be revised.",
        "options": ["(A) Although", "(B) However", "(C) Despite", "(D) Nevertheless"],
        "answer": "A",
        "strategy": "La phrase est composée de deux propositions complètes (sujet + verbe chacune). Cherche un mot qui peut introduire une proposition subordonnée (sujet + verbe) — pas une préposition, pas un adverbe de liaison.",
        "traps": "(B) 'However' est un adverbe de liaison — il ne peut pas introduire une proposition subordonnée ; il doit être précédé d'un point ou d'un point-virgule. (C) 'Despite' est une préposition — suivie d'un nom ou d'un gérondif, jamais d'un sujet + verbe directement. (D) 'Nevertheless' est un adverbe de liaison — même problème que (B).",
        "explanation": "'Although' (A) est une conjonction de subordination qui peut introduire directement une proposition avec sujet + verbe : 'Although the report was submitted on time, ...'. Ce contraste entre conjonctions de subordination ('although', 'even though', 'whereas') et adverbes de liaison ('however', 'nevertheless', 'nonetheless') est l'un des tests les plus fréquents dans la catégorie conjonctions du TOEIC."
    },
    {
        "category": "conjunction",
        "sentence": "The factory will resume full production _____ the equipment inspection has been completed and certified by the safety team.",
        "options": ["(A) once", "(B) since", "(C) although", "(D) so that"],
        "answer": "A",
        "strategy": "La relation logique est temporelle : la reprise de la production se fera immédiatement après l'achèvement de l'inspection. Cherche la conjonction temporelle qui exprime 'dès que'.",
        "traps": "(B) 'since' exprime soit la cause soit le point de départ dans le temps — aucun des deux n'est approprié ici. (C) 'although' exprime la concession — ici il n'y a pas d'opposition mais une condition préalable. (D) 'so that' exprime le but — 'will resume so that the inspection has been completed' est sémantiquement incohérent.",
        "explanation": "'Once' (A) est la conjonction temporelle qui exprime l'immédiateté : 'dès que', 'une fois que'. 'Once the inspection has been completed, the factory will resume' est un patron courant dans les communications opérationnelles et les directives de sécurité du TOEIC. Comme toutes les conjonctions temporelles, 'once' est suivi du present perfect dans une subordonnée orientée vers le futur — jamais du futur simple."
    },
    {
        "category": "conjunction",
        "sentence": "The proposal will be accepted _____ all board members agree on the revised financial projections.",
        "options": ["(A) provided that", "(B) even though", "(C) in order that", "(D) as soon as"],
        "answer": "A",
        "strategy": "La phrase exprime une condition nécessaire à l'acceptation de la proposition. Cherche la conjonction conditionnelle formelle qui signifie 'à condition que' ou 'pourvu que'.",
        "traps": "(B) 'even though' exprime la concession — 'la proposition sera acceptée même si tous les membres sont d'accord' est sémantiquement incohérent. (C) 'in order that' exprime le but — logiquement inversé ici. (D) 'as soon as' est temporel et non conditionnel — 'dès que tous les membres sont d'accord' implique que leur accord est certain, pas conditionnel.",
        "explanation": "'Provided that' (A) est une conjonction conditionnelle formelle qui signifie 'à condition que', 'pourvu que' : 'will be accepted provided that all members agree'. Elle est plus formelle que 'if' et est typique des textes contractuels et réglementaires du TOEIC. 'Provided that' impose que la condition soit présentée comme une exigence non négociable — exactement le sens voulu ici."
    },

    # ──────────────────────── PRONOUN (5) ────────────────────────
    {
        "category": "pronoun",
        "sentence": "The team leader will review all submissions _____ are received before the deadline.",
        "options": ["(A) who", "(B) whom", "(C) which", "(D) whose"],
        "answer": "C",
        "strategy": "Le blanc introduit une proposition relative qui modifie 'submissions' (chose, pas personne). Le choix dépend de la nature du référent et de sa fonction grammaticale dans la proposition relative.",
        "traps": "(A) 'who' est réservé aux personnes quand elles sont sujet de la proposition relative — 'submissions' est une chose. (B) 'whom' est réservé aux personnes quand elles sont objet — même problème. (D) 'whose' exprime la possession — 'submissions whose are received' est grammaticalement incorrect.",
        "explanation": "'Which' (C) est le pronom relatif standard pour les choses dans les propositions relatives : 'submissions which are received', 'documents which require approval'. Le TOEIC teste régulièrement le choix entre 'who' (personnes, sujet) / 'whom' (personnes, objet) / 'which' (choses) / 'whose' (possession). La clé est que 'submissions' est clairement une chose, imposant 'which'. Notez que 'that' aurait également été correct mais n'est pas proposé ici."
    },
    {
        "category": "pronoun",
        "sentence": "The board has not yet decided _____ will lead the new strategic initiatives committee.",
        "options": ["(A) which", "(B) whom", "(C) who", "(D) whose"],
        "answer": "C",
        "strategy": "Le blanc introduit une proposition complétive (après 'decided') où le pronom est le sujet du verbe 'will lead'. Pour une personne en position de sujet, utilise 'who'.",
        "traps": "(A) 'which' est pour les choses — ici il s'agit d'une personne. (B) 'whom' est le pronom objet — ici le pronom est le sujet de 'will lead', donc 'who' (sujet) est correct. (D) 'whose' exprime la possession — grammaticalement impossible ici sans un nom qui suive.",
        "explanation": "'Who' (C) est le pronom interrogatif/relatif pour les personnes en position de sujet. La distinction 'who' (sujet) vs. 'whom' (objet) est l'un des tests classiques du TOEIC : dans 'who will lead' (sujet + verbe), 'who' est le sujet ; dans 'whom the board will appoint' (objet), 'whom' est correct. Pour identifier la fonction, on peut remplacer par 'he/she' (sujet → 'who') ou 'him/her' (objet → 'whom')."
    },
    {
        "category": "pronoun",
        "sentence": "The marketing team prepared the campaign entirely by _____, without any external agency involvement.",
        "options": ["(A) them", "(B) themselves", "(C) their", "(D) they"],
        "answer": "B",
        "strategy": "L'expression 'by + pronom' exprime l'idée de faire quelque chose seul ou de façon autonome. Dans cette construction, un pronom réfléchi est obligatoire.",
        "traps": "(A) 'them' est le pronom personnel objet — 'by them' signifie 'par eux' (agent passif), ce qui changerait complètement le sens. (C) 'their' est le déterminant possessif — grammaticalement impossible après une préposition seul. (D) 'they' est le pronom sujet — ne peut pas suivre une préposition.",
        "explanation": "'By themselves' (B) est la construction réfléchie standard qui exprime l'autonomie et l'absence d'aide extérieure : 'did it by themselves', 'completed it by herself', 'built it by himself'. La préposition 'by' avec un pronom réfléchi est figée dans ce sens. Au TOEIC, les questions sur les pronoms réfléchis testent souvent la distinction entre le pronom objet ('them') et le pronom réfléchi ('themselves') dans les contextes d'agentivité et d'autonomie."
    },
    {
        "category": "pronoun",
        "sentence": "The committee approved the revised budget, _____ was a significant relief for the project management team.",
        "options": ["(A) that", "(B) which", "(C) it", "(D) what"],
        "answer": "B",
        "strategy": "Le blanc introduit une proposition relative non restrictive (après une virgule) dont le référent est la proposition principale entière. Identifie le seul pronom relatif qui peut référer à une proposition entière dans ce contexte.",
        "traps": "(A) 'that' ne peut jamais introduire une proposition relative non restrictive (entre virgules) — c'est une règle absolue en anglais formel. (C) 'it' est un pronom personnel qui nécessiterait une nouvelle proposition principale (avec un verbe conjugué), pas une relative subordonnée. (D) 'what' introduit une proposition nominale ('ce qui/que') — il ne peut pas référer à la proposition précédente de la même façon.",
        "explanation": "'Which' (B) est le seul pronom relatif qui peut introduire une proposition relative non restrictive avec pour référent l'ensemble de la proposition précédente : 'The committee approved the budget, which was a relief.' La règle absolue est : 'that' = restrictif (sans virgule), 'which' = non restrictif possible (avec virgule). En outre, 'which' peut référer à une proposition entière, pas seulement à un nom — usage très fréquent dans les e-mails et rapports d'entreprise du TOEIC."
    },
    {
        "category": "pronoun",
        "sentence": "The board congratulated _____ on successfully navigating the company through its most challenging quarter in a decade.",
        "options": ["(A) themselves", "(B) itself", "(C) him", "(D) oneself"],
        "answer": "B",
        "strategy": "Identifie l'antécédent du pronom réfléchi. 'The board' est un nom collectif singulier en anglais américain — il prend un verbe singulier et un pronom réfléchi singulier neutre.",
        "traps": "(A) 'themselves' est le pronom réfléchi pluriel — incompatible avec 'the board' qui est singulier en anglais américain. (C) 'him' est un pronom personnel objet masculin — 'the board' est une entité collective, pas une personne. (D) 'oneself' est le pronom réfléchi de la personne impersonnelle ('one') — il s'utilise dans des formulations générales, pas avec un sujet spécifique.",
        "explanation": "'Itself' (B) est le pronom réfléchi singulier pour les entités non humaines ou les noms collectifs singuliers en anglais américain : 'the company prided itself on...', 'the organization distinguished itself...', 'the board congratulated itself on...'. En anglais américain, les noms collectifs (board, committee, government, team) sont traités comme des singuliers grammaticaux — contrairement à l'anglais britannique. Au TOEIC (qui suit l'usage américain standard), 'the board' + 'itself' est la seule combinaison correcte."
    },
]


def main():
    # ── Source JSON ──
    src = BASE / "exo_part5" / "part5_exercises.json"
    data = json.loads(src.read_text(encoding="utf-8"))
    data["questions"].extend(NEW_QUESTIONS)
    src.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {src} — now {len(data['questions'])} questions")

    # ── Exercices copy (GCS-linked) ──
    exercices = BASE / "exercices" / "part5_exercises.json"
    exercices.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {exercices}")

    # ── Frontend copy ──
    frontend = Path(__file__).parent.parent.parent / "frontend" / "src" / "data" / "exercices" / "part5_exercises.json"
    frontend.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Updated {frontend}")

    # ── Verify counts per category ──
    from collections import Counter
    counts = Counter(q["category"] for q in data["questions"])
    print("\nQuestions per category:")
    for cat, n in sorted(counts.items()):
        print(f"  {cat}: {n}")


if __name__ == "__main__":
    main()

import { site } from '../site.mjs';

/**
 * Every word of the French site. Edit here, run `node build.mjs`.
 * TODO markers flag copy that asserts something I could not verify.
 */
export default {
  ui: {
    skip: 'Aller au contenu',
    menu: 'Menu',
    close: 'Fermer',
    openMenu: 'Ouvrir le menu',
    call: 'Appeler',
    callLong: `Appeler le ${site.phoneText}`,
    whatsapp: 'WhatsApp',
    whatsappLong: 'Écrire sur WhatsApp',
    directions: 'Itinéraire',
    directionsLong: 'Voir l’itinéraire',
    open: 'Ouvert',
    closed: 'Fermé',
    closesAt: 'ferme à',
    opensAt: 'ouvre à',
    opensDay: 'ouvre',
    today: 'aujourd’hui',
    closedToday: 'Fermé aujourd’hui',
    hoursTitle: 'Horaires',
    allServices: 'Toutes nos spécialités',
    readMore: 'En savoir plus',
    onThisPage: 'Sur cette page',
    langSwitch: 'العربية',
    langSwitchLabel: 'Passer à l’arabe',
    loadMap: 'Afficher le plan',
    loadMapHint: 'Le plan est chargé depuis Google uniquement si vous cliquez.',
    mapTitle: 'Plan d’accès au Centre Dentaire Majorelle',
    breadcrumb: 'Fil d’Ariane',
    homeLabel: 'Accueil',
    questions: 'Questions fréquentes',
    duration: 'Durée',
    photoSlot: 'Emplacement photo',
    photoSlotHint: 'À remplacer par une photo du cabinet',
    waMessage: 'Bonjour, je souhaite prendre rendez-vous au Centre Dentaire Majorelle.',
  },

  days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],

  nav: {
    soins: 'Soins dentaires',
    implants: 'Implantologie',
    esthetique: 'Esthétique',
    radiologie: 'Radiologie',
    urgences: 'Urgences',
    contact: 'Contact',
  },

  meta: {
    home: {
      title: `Dentiste à Tétouan — ${site.name}`,
      description:
        'Centre dentaire à Tétouan, boulevard Mohammadia. Soins, implantologie, esthétique et radiologie panoramique sur place. Du lundi au samedi — 06 68 64 14 89.',
    },
    soins: {
      title: 'Soins dentaires à Tétouan — caries, détartrage, dévitalisation',
      description:
        'Caries, détartrage, traitement de racine, extraction : les soins dentaires courants à Tétouan, boulevard Mohammadia. Rendez-vous au 06 68 64 14 89.',
    },
    implants: {
      title: 'Implant dentaire à Tétouan — implantologie | Centre Majorelle',
      description:
        'Pose d’implants dentaires à Tétouan : bilan radiologique, devis écrit, couronne sur implant. Centre Dentaire Majorelle, boulevard Mohammadia. 06 68 64 14 89.',
    },
    esthetique: {
      title: 'Esthétique dentaire à Tétouan — blanchiment, facettes, couronnes',
      description:
        'Blanchiment, facettes et couronnes céramique à Tétouan. Un résultat naturel, discuté avant de commencer. Centre Dentaire Majorelle — 06 68 64 14 89.',
    },
    radiologie: {
      title: 'Radiologie dentaire à Tétouan — panoramique sur place',
      description:
        'Radiographie panoramique et rétro-alvéolaire réalisées sur place à Tétouan, lues pendant la consultation. Centre Dentaire Majorelle, boulevard Mohammadia.',
    },
    urgences: {
      title: 'Urgence dentaire à Tétouan — rage de dent, abcès, dent cassée',
      description:
        'Douleur aiguë, abcès, dent cassée : appelez le 06 68 64 14 89. Créneaux d’urgence réservés chaque jour au Centre Dentaire Majorelle, Tétouan.',
    },
    contact: {
      title: `Contact et horaires — ${site.name}, Tétouan`,
      description:
        'Adresse, horaires, plan et téléphone du Centre Dentaire Majorelle, boulevard Mohammadia à Tétouan. Ouvert du lundi au samedi — 06 68 64 14 89.',
    },
  },

  // ── Home ────────────────────────────────────────────────────────────────
  home: {
    h1: 'Votre dentiste à Tétouan,\nboulevard Mohammadia.',
    lead:
      'Soins, implantologie, esthétique et radiologie panoramique dans un cabinet neuf, calme et entièrement équipé. Le Dr Zeguendry et son équipe vous reçoivent du lundi au samedi.',
    heroAlt:
      'L’accueil du Centre Dentaire Majorelle : comptoir gris clair sous une ligne de lumière chaude, logo au mur, sol en marbre blanc.',

    services: {
      h2: 'Quatre spécialités,\nsous le même toit.',
      lead:
        'Du détartrage à l’implant, tout se fait ici — y compris la radiologie, ce qui vous évite un déplacement et une semaine d’attente entre le cliché et le diagnostic.',
    },

    cabinet: {
      h2: 'Un cabinet neuf, pensé\npour qu’on s’y sente bien.',
      body: [
        'Le centre a été conçu d’un seul tenant : fauteuils récents, salle de stérilisation dédiée, radiologie intégrée. La salle d’attente donne sur le boulevard et reste calme — pas de couloir, pas de file d’attente debout.',
        'C’est un détail, mais c’est le premier que l’on remarque quand on a peur du dentiste : l’endroit est clair, silencieux, et on sait où l’on va.',
      ],
      alt:
        'La façade du Centre Dentaire Majorelle, boulevard Mohammadia à Tétouan, enseigne bleue éclairée le soir.',
      facts: [
        {
          t: 'Radiologie sur place',
          d: 'Panoramique et rétro-alvéolaire. Le cliché est lu pendant la consultation.',
        },
        {
          t: 'Stérilisation tracée',
          d: 'Instruments sous sachet, autoclave, un cycle documenté par série.', // TODO confirm
        },
        {
          t: 'Français et arabe',
          d: 'L’équipe reçoit dans les deux langues, à l’accueil comme au fauteuil.', // TODO add Spanish if true
        },
        {
          t: 'Sur le boulevard',
          d: 'Entrée directe boulevard Mohammadia, au niveau du trottoir.', // TODO confirm step-free access
        },
      ],
    },

    dentist: {
      h2: 'Le Dr Zeguendry',
      // TODO — replace entirely with the dentist's real background, degrees and year of practice.
      body: [
        'Chirurgien-dentiste, le Dr Zeguendry dirige le Centre Dentaire Majorelle à Tétouan. Sa façon de travailler tient en une phrase : expliquer avant de faire.',
        'Concrètement, vous savez ce qui va être fait, pourquoi, combien de séances cela demande et ce que cela coûte — avant que le premier instrument ne soit sorti.',
      ],
      quote:
        'Un patient qui comprend ce qu’on lui fait a beaucoup moins peur. C’est la moitié du travail.',
      photoNote: 'Photo du Dr Zeguendry — 800 × 1000 px',
    },

    city: {
      h2: 'À Tétouan, et aux alentours.',
      body:
        'Le cabinet reçoit des patients de Tétouan et de toute la côte : Martil, M’diq, Fnideq, Cabo Negro, Oued Laou. Si vous venez de loin, dites-le en appelant — on regroupe les soins sur une même journée quand c’est possible.',
      alt:
        'Vue sur Tétouan, la ville blanche, depuis les hauteurs de la kasbah, avec le Rif et la plaine de Martil au fond.',
      credit: 'Photo : Ideophagous, Wikimedia Commons, CC BY-SA 4.0',
    },

    faq: {
      h2: 'Les questions qu’on nous pose.',
      items: [
        {
          q: 'Faut-il prendre rendez-vous ?',
          a: `Oui, de préférence. Appelez le ${site.phoneText} : on vous propose un créneau, en général dans la semaine. Si vous avez une douleur aiguë, dites-le tout de suite — des créneaux d’urgence sont gardés libres chaque jour.`,
        },
        {
          q: 'Combien coûte une consultation ?',
          a: 'Le tarif de la première consultation vous est annoncé au téléphone, avant votre venue. Pour un implant, une facette ou une prothèse, vous recevez un devis écrit après le bilan radiologique : rien n’est engagé tant que vous ne l’avez pas accepté.',
        },
        {
          q: 'Est-ce que je peux me faire rembourser ?',
          // TODO — confirm exactly what the clinic issues (feuille de soins, facture, tiers payant).
          a: 'Une feuille de soins détaillée vous est remise à la fin du traitement, à présenter à votre organisme (CNSS, CNOPS, mutuelle ou assurance privée). Appelez-nous pour connaître les modalités exactes selon votre couverture.',
        },
        {
          q: 'J’ai très peur du dentiste.',
          a: 'Dites-le en arrivant, c’est beaucoup plus fréquent qu’on ne le croit. Chaque geste est expliqué avant d’être fait et l’anesthésie locale est posée progressivement. Une première séance peut se limiter à un examen et une radio, sans aucun soin.',
        },
        {
          q: 'Recevez-vous les enfants ?',
          // TODO — confirm; remove this question entirely if the clinic does not treat children.
          a: 'Oui. Pour une première visite, prévoyez un rendez-vous court en début de journée : l’enfant découvre le fauteuil, on compte les dents, et on s’arrête là. La confiance se construit à cette séance-là.',
        },
      ],
    },

    cta: {
      h2: 'Un rendez-vous se prend\nen un appel.',
      body: `Du lundi au samedi. Pour une douleur, appelez plutôt que d’écrire : la ligne est décrochée pendant les heures d’ouverture.`,
    },
  },

  // ── Service pages ───────────────────────────────────────────────────────
  services: {
    soins: {
      name: 'Soins dentaires',
      short: 'Caries, détartrage, dévitalisation, extraction. La base, faite correctement et sans douleur.',
      duration: '30 à 60 min',
      h1: 'Soins dentaires à Tétouan',
      lead:
        'La dentisterie courante, celle qui règle 80 % des motifs de consultation : une carie qui commence, du tartre, une dent qui réagit au froid, une dent de sagesse qui pousse mal.',
      body: [
        'Une consultation commence toujours par un examen complet et, si nécessaire, une radio — faite sur place et lue devant vous. L’objectif est de vous dire, dès la première séance, ce qui doit être soigné maintenant, ce qui peut attendre, et ce qui ne nécessite rien du tout.',
        'Les soins sont réalisés sous anesthésie locale dès qu’il y a le moindre risque de douleur. Si l’anesthésie n’agit pas assez, on attend et on en remet — on ne commence pas « pour voir ».',
      ],
      includes: {
        title: 'Ce que cela couvre',
        items: [
          ['Caries et obturations', 'Composite de la teinte de la dent, poli le jour même. Une séance suffit dans la majorité des cas.'],
          ['Détartrage et polissage', 'Élimination du tartre au-dessus et au-dessous de la gencive, puis polissage. Recommandé une à deux fois par an.'],
          ['Traitement de racine', 'Quand la carie a atteint le nerf. Deux séances en général, sous anesthésie.'],
          ['Extraction', 'Dent trop abîmée, dent de sagesse incluse ou mal orientée. Toujours après un bilan radiologique.'],
          ['Gencives qui saignent', 'Le saignement au brossage n’est pas normal. Détartrage, puis réévaluation à quelques semaines.'],
        ],
      },
      steps: {
        title: 'Comment se passe une première séance',
        items: [
          ['Examen', 'Toutes les dents, les gencives, l’occlusion. Cinq à dix minutes, sans instrument agressif.'],
          ['Radio si besoin', 'Rétro-alvéolaire pour une dent précise, panoramique pour une vue d’ensemble. Sur place, résultat immédiat.'],
          ['Plan de traitement', 'Ce qui est urgent, ce qui est à surveiller, le nombre de séances et le coût. Par écrit si le traitement est long.'],
          ['Premier soin', 'Souvent réalisé dans la même séance, si le temps le permet et si vous êtes d’accord.'],
        ],
      },
      faq: [
        {
          q: 'Un détartrage, est-ce que ça abîme l’émail ?',
          a: 'Non. L’instrument à ultrasons décolle le tartre, il n’attaque pas l’émail. La sensibilité ressentie les jours suivants vient des collets dégagés par le tartre retiré, et elle disparaît en quelques jours.',
        },
        {
          q: 'Faut-il enlever les dents de sagesse systématiquement ?',
          a: 'Non. Une dent de sagesse bien placée, fonctionnelle et nettoyable se garde. L’extraction se discute quand elle pousse de travers, reste bloquée, provoque des infections à répétition ou pousse les autres dents.',
        },
        {
          q: 'Combien de temps dure un plombage ?',
          a: 'Un composite bien posé sur une dent peu délabrée tient plusieurs années. Sa durée dépend surtout de la taille de la cavité, de votre hygiène et du grincement éventuel. Il se contrôle à chaque visite.',
        },
      ],
    },

    implants: {
      name: 'Implantologie',
      short: 'Remplacer une dent perdue par une racine en titane et une couronne fixe. Bilan et devis avant toute décision.',
      duration: 'Plusieurs séances',
      h1: 'Implant dentaire à Tétouan',
      lead:
        'Un implant remplace la racine d’une dent absente par une vis en titane intégrée à l’os. On y fixe ensuite une couronne. C’est la solution la plus proche d’une dent naturelle — et celle qui demande le plus de préparation.',
      body: [
        'Tout commence par un bilan : radiographie panoramique, examen de la gencive et de l’os disponible, état des dents voisines. Ce bilan dit si un implant est possible, et sinon ce qui doit être fait avant — ou quelle autre solution est préférable.',
        'Vous recevez ensuite un devis écrit, détaillant chaque étape et son coût. Il n’y a aucun engagement à ce stade : beaucoup de patients repartent avec le devis et reviennent des semaines plus tard. C’est normal et c’est même conseillé.',
        'La pose elle-même se fait sous anesthésie locale et dure moins d’une heure pour un implant unitaire. Le temps long, c’est l’ostéo-intégration : plusieurs mois pendant lesquels l’os se lie au titane. Pendant cette période, une solution provisoire évite tout trou visible.',
      ],
      includes: {
        title: 'Ce que cela couvre',
        items: [
          ['Implant unitaire', 'Une dent manquante, sans toucher aux dents voisines — contrairement à un bridge.'],
          ['Plusieurs implants', 'Pour remplacer plusieurs dents, ou stabiliser une prothèse qui bouge.'],
          ['Couronne sur implant', 'Céramique, teinte accordée aux dents voisines, vissée ou scellée sur le pilier.'],
          ['Bilan pré-implantaire', 'Panoramique, évaluation du volume osseux et de la gencive, plan et devis.'],
        ],
      },
      steps: {
        title: 'Les étapes, dans l’ordre',
        items: [
          ['Bilan et devis', 'Radiographie, examen, discussion des alternatives. Devis écrit remis le jour même.'],
          ['Pose de l’implant', 'Sous anesthésie locale, moins d’une heure pour un implant unitaire. Vous repartez en marchant.'],
          ['Cicatrisation', 'Plusieurs mois pendant lesquels l’os se lie au titane. Contrôles réguliers, provisoire si nécessaire.'],
          ['Empreinte et couronne', 'Une fois l’implant stable : empreinte, essayage de la teinte, pose de la couronne définitive.'],
          ['Suivi', 'Un contrôle annuel, comme pour une dent naturelle. L’implant se nettoie et se surveille.'],
        ],
      },
      faq: [
        {
          q: 'Est-ce que la pose fait mal ?',
          a: 'La pose se fait sous anesthésie locale : vous ne sentez pas l’intervention. Les suites sont comparables à celles d’une extraction simple — une gêne pendant deux à trois jours, calmée par un antalgique courant.',
        },
        {
          q: 'Combien de temps ça dure, en tout ?',
          a: 'Comptez généralement plusieurs mois entre la pose et la couronne définitive, le temps que l’os se lie à l’implant. La durée exacte dépend de la zone, de la qualité de l’os et de la nécessité éventuelle d’une greffe. Elle est précisée sur votre devis.',
        },
        {
          q: 'Et si je n’ai pas assez d’os ?',
          a: 'C’est fréquent quand la dent est absente depuis longtemps : l’os se résorbe. Une greffe osseuse ou un comblement peut permettre de poser l’implant ensuite. Le bilan radiologique tranche, et une autre solution est proposée si l’implant n’est pas indiqué.',
        },
        {
          q: 'Combien coûte un implant ?',
          a: 'Le prix dépend du nombre d’implants, de la marque choisie, du type de couronne et d’une éventuelle greffe. C’est précisément pour cela qu’un devis écrit est établi après le bilan, plutôt qu’un tarif annoncé au téléphone.',
        },
      ],
    },

    esthetique: {
      name: 'Esthétique dentaire',
      short: 'Blanchiment, facettes, couronnes céramique. Un résultat qui reste crédible, pas un blanc de publicité.',
      duration: '1 à 3 séances',
      h1: 'Esthétique dentaire à Tétouan',
      lead:
        'Éclaircir, réaligner visuellement, refermer un espace, remplacer une couronne grise. L’objectif n’est pas de faire des dents parfaites : c’est de faire des dents qui vous ressemblent, en mieux.',
      body: [
        'Un traitement esthétique commence par une conversation et des photos. Vous dites ce qui vous gêne — souvent une chose précise, pas « tout ». On regarde ensemble ce qui est réalisable, ce qui demanderait de toucher à des dents saines, et ce qui relève plutôt de l’orthodontie.',
        'Deux principes guident le travail : ne jamais mutiler une dent saine pour un gain esthétique discutable, et garder une teinte compatible avec votre visage et votre âge. Des dents plus blanches que le blanc de l’œil se repèrent immédiatement, et rarement en bien.',
      ],
      includes: {
        title: 'Ce que cela couvre',
        items: [
          ['Blanchiment', 'Au fauteuil, à domicile avec gouttières, ou les deux. Le gain se mesure sur un teintier, avant et après.'],
          ['Facettes céramique', 'Fines pellicules collées sur la face visible. Pour une forme, une teinte ou un petit espace.'],
          ['Couronnes céramique', 'Quand la dent est trop délabrée pour une facette. Teinte accordée aux dents voisines.'],
          ['Reconstitution au composite', 'Un angle cassé, un petit espace : réparé en une séance, sans toucher à l’émail sain.'],
        ],
      },
      steps: {
        title: 'Comment on procède',
        items: [
          ['Ce qui vous gêne', 'Photos, teintier, et une vraie discussion. Beaucoup de demandes se règlent plus simplement que prévu.'],
          ['Ce qui est possible', 'Les options, avec leurs limites et leur coût. Y compris l’option « ne rien faire », quand c’est la bonne.'],
          ['Essai avant de graver', 'Pour les facettes et les couronnes : maquette ou provisoires, que vous portez et validez avant le définitif.'],
          ['Pose', 'Une à trois séances selon le nombre de dents. Retouches de teinte incluses.'],
        ],
      },
      faq: [
        {
          q: 'Le blanchiment abîme-t-il les dents ?',
          a: 'Réalisé au cabinet, avec un produit dosé et des gencives protégées, non. L’effet secondaire habituel est une sensibilité au froid pendant quelques jours, qui disparaît. Le risque vient des kits vendus en ligne, mal dosés et sans protection de la gencive.',
        },
        {
          q: 'Combien de temps le blanchiment tient-il ?',
          a: 'Généralement un à deux ans, selon ce que vous consommez : café, thé, tabac et certains sodas recolorent plus vite. Une séance d’entretien courte permet de rattraper la teinte sans recommencer tout le traitement.',
        },
        {
          q: 'Faut-il tailler les dents pour des facettes ?',
          a: 'Très peu, et parfois pas du tout selon le cas et le type de facette. C’est justement le point à évaluer avant : si une facette impose de sacrifier beaucoup d’émail sain, on vous le dit et on regarde une autre solution.',
        },
      ],
    },

    radiologie: {
      name: 'Radiologie dentaire',
      short: 'Panoramique et rétro-alvéolaire sur place. Le cliché est lu pendant la consultation, pas une semaine plus tard.',
      duration: '5 min',
      h1: 'Radiologie dentaire sur place à Tétouan',
      lead:
        'Le cabinet dispose de sa propre radiologie. Concrètement : pas de rendez-vous ailleurs, pas de second déplacement, et un diagnostic posé pendant la consultation en cours.',
      body: [
        'Une grande partie de ce qui se passe dans une bouche ne se voit pas à l’œil nu : une carie sous une obturation, un kyste à la pointe d’une racine, une dent de sagesse couchée, le volume d’os disponible pour un implant. La radio n’est pas un supplément, c’est ce qui permet de ne pas travailler à l’aveugle.',
        'Les doses employées en radiologie dentaire sont faibles. Prévenez-nous si vous êtes enceinte ou susceptible de l’être : l’examen est alors reporté s’il peut l’être, et un tablier de protection est utilisé si l’urgence l’impose.',
      ],
      includes: {
        title: 'Les examens disponibles',
        items: [
          ['Panoramique', 'Une vue de l’ensemble des dents, des mâchoires et des sinus, en un seul cliché. Indispensable avant un implant ou une extraction de dent de sagesse.'],
          ['Rétro-alvéolaire', 'Un cliché ciblé sur une ou deux dents, très détaillé. Pour une carie, une racine ou un contrôle après traitement.'],
          ['Lecture immédiate', 'L’image s’affiche à l’écran, à côté du fauteuil. On la regarde ensemble, et on vous explique ce qu’on y voit.'],
          ['Copie pour votre dossier', 'Sur demande, le cliché vous est remis — utile si vous consultez un spécialiste ailleurs.'],
        ],
      },
      steps: {
        title: 'Comment ça se passe',
        items: [
          ['Préparation', 'Retrait des bijoux et objets métalliques au niveau du visage et du cou. Trente secondes.'],
          ['Cliché', 'Vous restez immobile pendant que l’appareil tourne autour de la tête. Une vingtaine de secondes pour une panoramique.'],
          ['Lecture', 'L’image apparaît immédiatement à l’écran et vous est expliquée pendant la consultation.'],
        ],
      },
      faq: [
        {
          q: 'Une radio dentaire est-elle dangereuse ?',
          a: 'Les doses utilisées en radiologie dentaire sont très faibles et l’examen est ciblé. Il n’est jamais prescrit sans raison : c’est un examen fait pour répondre à une question précise.',
        },
        {
          q: 'Je suis enceinte, puis-je faire une radio ?',
          a: 'Signalez-le avant l’examen. On reporte le cliché lorsque c’est possible. En cas d’urgence — une infection à traiter — il est réalisé avec un tablier plombé, l’absence d’image étant alors plus risquée que le cliché lui-même.',
        },
        {
          q: 'Puis-je venir uniquement pour une panoramique ?',
          a: `Oui, y compris si vous êtes adressé par un autre praticien. Appelez le ${site.phoneText} pour caler un créneau — c’est rapide.`,
        },
      ],
    },

    urgences: {
      name: 'Urgences dentaires',
      short: 'Douleur aiguë, dent cassée, abcès. Appelez : des créneaux sont gardés libres chaque jour.',
      duration: 'Le jour même',
      h1: 'Urgence dentaire à Tétouan',
      lead:
        'Une rage de dent ne se planifie pas. Des créneaux sont réservés chaque jour pour les urgences — appelez, ne prenez pas rendez-vous en ligne, et dites d’emblée que vous avez mal.', // TODO confirm that daily emergency slots are genuinely held
      urgentBox: {
        title: 'Appelez maintenant',
        body: 'Pendant les heures d’ouverture, la ligne est décrochée. C’est la façon la plus rapide d’être vu aujourd’hui.',
      },
      body: [
        'Certaines situations ne peuvent pas attendre le rendez-vous de la semaine prochaine : une douleur qui empêche de dormir, une joue qui gonfle, une dent cassée après un choc, un saignement qui ne s’arrête pas après une extraction.',
        'Dans ces cas, l’objectif de la séance est simple : faire cesser la douleur et traiter l’infection. Le soin définitif — couronne, traitement de racine complet, remplacement — se planifie ensuite, à froid.',
      ],
      includes: {
        title: 'Les motifs qui justifient d’appeler tout de suite',
        items: [
          ['Douleur qui empêche de dormir', 'Une pulpite ne se calme pas seule. Plus on attend, plus le traitement est long.'],
          ['Joue ou gencive gonflée', 'Signe d’une infection. À traiter rapidement, surtout si la fièvre s’ajoute.'],
          ['Dent cassée ou expulsée', 'Après un choc. Une dent expulsée peut parfois être replacée : conservez-la dans du lait ou de la salive et venez immédiatement.'],
          ['Saignement qui ne s’arrête pas', 'Après une extraction, au-delà de quelques heures malgré une compresse mordue.'],
          ['Couronne ou bridge descellé', 'Conservez la pièce, ne la recollez pas vous-même. Elle peut souvent être refixée.'],
        ],
      },
      steps: {
        title: 'En attendant de venir',
        items: [
          ['Un antalgique courant', 'Paracétamol selon la posologie indiquée sur la boîte. Évitez l’aspirine si vous saignez.'], // TODO have the dentist validate this wording
          ['Pas de chaleur sur la joue', 'Le chaud aggrave un abcès. Du froid à l’extérieur de la joue soulage davantage.'],
          ['Pas d’antibiotique sans avis', 'Un antibiotique pris au hasard masque les signes sans traiter la cause, et complique la suite.'],
          ['Appelez, même si ça se calme', 'Une douleur qui cesse d’un coup n’est pas toujours bon signe : le nerf peut avoir cessé de réagir.'],
        ],
      },
      faq: [
        {
          q: 'Puis-je venir sans rendez-vous ?',
          a: `Appelez d’abord, même cinq minutes avant. Le ${site.phoneText} permet de savoir immédiatement s’il y a un créneau libre — cela évite d’attendre sur place pour rien.`,
        },
        {
          q: 'Et en dehors des heures d’ouverture ?',
          // TODO — confirm; replace with the real out-of-hours arrangement or the local emergency service.
          a: 'Le cabinet reçoit pendant ses heures d’ouverture. En dehors, adressez-vous au service d’urgence le plus proche, puis appelez-nous dès la réouverture pour la suite du traitement.',
        },
        {
          q: 'Ma dent ne fait plus mal, dois-je quand même venir ?',
          a: 'Oui. Une douleur intense qui disparaît brutalement signifie souvent que le nerf est mort, pas que le problème est réglé. L’infection, elle, continue en silence.',
        },
      ],
    },
  },


  // ── Contact ─────────────────────────────────────────────────────────────
  contact: {
    h1: 'Contact et horaires',
    lead: 'Boulevard Mohammadia, Tétouan. Le téléphone reste le moyen le plus rapide de nous joindre.',
    addressTitle: 'Adresse',
    phoneTitle: 'Téléphone',
    emailTitle: 'E-mail',
    hoursTitle: 'Horaires d’ouverture',
    accessTitle: 'Venir au cabinet',
    accessBody: [
      'Le cabinet se trouve sur le boulevard Mohammadia, l’enseigne bleue est visible depuis la rue — de jour comme de nuit.', // TODO add landmarks: near which crossroads / which bus lines
      'Stationnement possible le long du boulevard selon l’heure. Si vous venez de Martil ou de M’diq, comptez une quinzaine de minutes hors heures de pointe.', // TODO confirm parking
    ],
    noteTitle: 'Avant d’appeler',
    noteBody:
      'Ayez à portée de main : ce qui vous amène, depuis quand, et le nom des médicaments que vous prenez. Cela permet de vous orienter vers le bon créneau dès le premier appel.',
  },

  // ── Footer ──────────────────────────────────────────────────────────────
  footer: {
    blurb:
      'Centre dentaire à Tétouan : soins, implantologie, esthétique et radiologie panoramique sur place.',
    servicesTitle: 'Spécialités',
    clinicTitle: 'Le centre',
    contactTitle: 'Nous joindre',
    hoursTitle: 'Horaires',
    legal: 'Tous droits réservés.',
    disclaimer:
      'Les informations de ce site sont données à titre indicatif et ne remplacent pas une consultation.',
    credits: 'Photo de Tétouan : Ideophagous, Wikimedia Commons, CC BY-SA 4.0.',
  },

  notFound: {
    title: 'Page introuvable',
    h1: 'Cette page n’existe pas.',
    body: 'Le lien est peut-être ancien ou mal recopié. Voici par où reprendre.',
  },
};

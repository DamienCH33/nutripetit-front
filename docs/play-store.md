# NutriPetit sur Google Play — guide

Objectif : publier la PWA telle quelle sur Google Play, **d'abord gratuite**, puis ajouter l'offre Famille.
L'appli Android est une *Trusted Web Activity* (TWA) : une coquille qui ouvre `https://nutripetit.up.railway.app/app/` en plein écran, sans barre d'adresse. Le code reste celui de ce dépôt ; une mise à jour du site met à jour l'appli, sans repasser par le store.

## 0. Avant de commencer

| | Pourquoi |
|---|---|
| Corrections de l'audit + refonte **en prod** | Pas d'appli publique sans l'alerte miel et l'âge envoyé au scan (voir `docs/audits.md` de l'API) |
| Nom « NutriPetit » vérifié à l'INPI | Avant d'investir dans le store et la promo |
| Domaine définitif | Le domaine est figé dans l'appli (`host`) et dans `assetlinks.json`. Passer de `*.up.railway.app` à `nutripetit.fr` **avant** la première publication évite une mise à jour forcée |
| Micro-entreprise immatriculée | Obligatoire pour l'offre payante (étape 5), pas pour la version gratuite |

## 1. Compte développeur

1. Créer le compte sur la Google Play Console (frais d'inscription unique, payés par toi dans la Console).
2. Compte **personnel** créé après le 13/11/2023 : test fermé obligatoire avec **au moins 12 testeurs inscrits 14 jours d'affilée** avant d'avoir accès à la production. Google examine ensuite la demande (7 jours environ). Prévoir la liste des 12 testeurs (adresses Gmail) dès maintenant.

## 2. Générer l'appli Android (sur ta machine)

Prérequis : Node 22, JDK 17 ; Bubblewrap télécharge lui-même le SDK Android au premier lancement.

```bash
npm i -g @bubblewrap/cli
cd android
bubblewrap init --manifest https://nutripetit.up.railway.app/manifest.json
#   → répondre en reprenant les valeurs de twa-manifest.json (packageId fr.nutripetit.app, startUrl /app/)
#   → il crée android.keystore : le SAUVEGARDER hors du dépôt (gestionnaire de mots de passe). Perdu = plus de mise à jour possible.
bubblewrap build
#   → app-release-bundle.aab (à envoyer sur la Console) + app-release-signed.apk (pour tester sur ton téléphone)
```

`android.keystore`, `*.aab`, `*.apk` et le dossier `android/app/` généré **ne vont pas dans git** (déjà dans `.gitignore`).

## 3. Prouver que l'appli et le site t'appartiennent (Digital Asset Links)

Sans ce fichier, l'appli s'ouvre avec une barre d'adresse Chrome en haut.

1. Dans la Console : *Configuration > Intégrité de l'application > Signature d'application* → copier l'empreinte **SHA-256 de la clé de signature de l'appli** (celle de Google, pas celle de ton keystore local, si Play App Signing est activé — c'est le cas par défaut).
2. Dans le dépôt **API**, créer `public/.well-known/assetlinks.json` :

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "fr.nutripetit.app",
    "sha256_cert_fingerprints": ["<EMPREINTE SHA-256 DE LA CONSOLE>"]
  }
}]
```

3. Déployer, puis vérifier : `curl -s https://nutripetit.up.railway.app/.well-known/assetlinks.json` doit renvoyer ce JSON en `application/json` (Caddy le transmet à Symfony, qui sert `public/` tel quel).

## 4. Fiche du store

**Titre** (30 caractères max) : `NutriPetit – score bébé`

**Description courte** (80 max) :
> Scannez un petit pot : le score adapté à l'âge de votre bébé, avec les raisons.

**Description longue** (4 000 max) :
> NutriPetit répond à une question simple, au rayon : ce produit, je peux le donner à mon enfant ?
>
> Scannez le code-barres d'un aliment bébé, d'un lait infantile ou d'un biscuit. NutriPetit vous donne un verdict adapté à l'âge de votre enfant, de 0 à 3 ans, avec les trois raisons qui comptent le plus et la source officielle de chaque règle (ANSES, OMS Europe, EFSA, règlement européen sur les laits infantiles).
>
> • Score adapté à l'âge : le sel ajouté compte avant 1 an, pas après ; le miel est interdit avant 12 mois.
> • Alertes de sécurité en plein écran : miel avant 1 an, risque d'étouffement, poissons à éviter.
> • Laits infantiles notés à part : tous sont conformes, le score compare leurs critères facultatifs.
> • Transparent : chaque point gagné ou perdu est expliqué et sourcé.
> • Sans compte et sans publicité. L'âge de votre enfant reste sur votre téléphone.
>
> NutriPetit n'est pas un professionnel de santé et ne donne aucun avis médical. Il compare des produits à partir de recommandations officielles générales, sans connaître votre enfant (allergies, prématurité, poids, traitement). Pour toute question sur son alimentation, et avant de changer de lait infantile, demandez à votre médecin ou à votre pédiatre.
>
> Données produits : Open Food Facts (licence ODbL).

**Catégorie** : Santé et remise en forme (ou Parents).
**Captures** : les écrans de la refonte (accueil, scanner, fiche, alerte miel), en 1080 × 1920.

## 5. Déclarations dans la Console (« Contenu de l'appli »)

| Rubrique | Réponse |
|---|---|
| Public cible | **18 ans et plus** (les parents). Ne pas cocher les tranches enfants : sinon l'appli tombe sous la politique « Familles », bien plus stricte, alors qu'elle ne s'adresse pas aux enfants |
| Publicités | Non |
| Sécurité des données — collectées | Historique de scans et âge de l'enfant au moment du scan, liés à un identifiant anonyme ; adresse IP de façon transitoire (limitation d'abus). Pas de partage avec des tiers. Chiffré en transit. Suppression possible depuis l'appli (Historique > Effacer) |
| Sécurité des données — version Famille | Ajouter : adresse e-mail (compte), achats (abonnement) |
| Applis de santé | Remplir la déclaration si la Console la propose : « information nutritionnelle », pas de dispositif médical, pas de diagnostic |
| Politique de confidentialité | `https://nutripetit.up.railway.app/confidentialite` (à mettre à jour pour la version Famille) |
| Classification du contenu | Questionnaire IARC : aucun contenu sensible |

## 6. L'offre Famille (après la version gratuite)

Ce qui reste **gratuit pour toujours** : scans, score adapté à l'âge, raisons et sources, **toutes les alertes de sécurité et les rappels produits**, historique 13 mois pour un enfant. Une alerte de sécurité ne se paie pas.

Ce qui passe en **Famille** : alternatives mieux notées, plusieurs enfants, historique synchronisé et partagé entre parents, listes et favoris.

Volontairement **absent** de l'offre : tout ce qui ressemble à un suivi médical (« récap pour le pédiatre », journal alimentaire). NutriPetit compare des produits ; il ne suit pas la santé d'un enfant. Ça éviterait aussi de stocker des données qui pourraient être qualifiées de données de santé.

**Avant de vendre quoi que ce soit** (obligations d'un vendeur en ligne à des particuliers, à faire valider) :
- SIRET de la micro-entreprise, et mentions légales qui l'affichent ;
- conditions générales de vente (prix, durée, renouvellement, résiliation) ;
- droit de rétractation de 14 jours sur un contenu numérique : soit le respecter, soit faire renoncer explicitement le client à ce droit au moment de l'achat ;
- un médiateur de la consommation, obligatoire pour tout professionnel qui vend à des particuliers ;
- l'avertissement « pas un professionnel de santé » dans les CGV et sur l'écran d'achat, en plus de la fiche du store.

Travail technique, par lot :

1. **Comptes** (API) : entité `Account` (e-mail), connexion par lien magique (Symfony `login_link`), rattachement de la session anonyme existante au compte (l'historique suit), suppression du compte. Mise à jour RGPD de `/confidentialite`.
2. **Droits** (API) : entité `Entitlement` (compte, produit `famille_annuel|famille_mensuel`, échéance, statut) ; un seul point de vérité `isFamily(account)` utilisé par les endpoints Famille (403 sinon, avec un message qui renvoie vers l'offre).
3. **Achat dans l'appli** (front) : dans une TWA, Google Play Billing passe par l'API *Digital Goods* + *Payment Request* de Chrome. Le front n'accorde jamais un droit lui-même : il envoie le jeton d'achat à l'API.
4. **Vérification** (API) : l'API valide chaque jeton auprès de la *Google Play Developer API* (compte de service), puis écoute les notifications temps réel (RTDN, via Pub/Sub) pour les renouvellements, résiliations et remboursements.
5. **Paiement hors Google** (option, EEE) : depuis le 30/06/2026, un lien vers un paiement web est possible (frais Google réduits, frais du prestataire en plus). À ne regarder qu'une fois le volume connu.

Frais Google sur les abonnements : 15 % avec Google Play Billing (10 % de service + 5 % de facturation, selon Adapty, à vérifier sur la page officielle des frais avant de fixer le prix).

## 7. Après la publication

- Une mise à jour du site = une mise à jour de l'appli. Ne republier sur le store que si `twa-manifest.json` change (icône, nom, domaine).
- Surveiller dans la Console : plantages (rares en TWA), avis, et l'onglet *Vitals*.
- Garder `android.keystore` et son mot de passe en lieu sûr.

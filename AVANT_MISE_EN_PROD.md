# ✅ Checklist avant mise en production — commun à toutes les landings

> À faire par Seb + valider avec la tech avant tout déploiement réel sur cadremploi.fr.
> Cette page couvre ce qui est **commun à toutes les landings** (workflow Git, visibilité
> du repo, cible de mise en prod). Chaque landing a en plus sa **propre checklist**
> spécifique (SEO, feature flags, chiffres, contenu) :
>
> - [tech/AVANT_MISE_EN_PROD.md](tech/AVANT_MISE_EN_PROD.md)
> - `immo/AVANT_MISE_EN_PROD.md` (à créer quand le dossier `immo/` existera)

---

## 1. Cible de mise en production

Pattern général visé : `cadremploi.fr/carriere/<nom-landing>/` — un dossier du repo =
une landing (voir [README.md](README.md)). **Non confirmé officiellement par l'infra** —
à valider avant que ce soit considéré comme définitif (échange en cours avec le CTO sur
le process de mise en ligne, et sur le pattern d'URL et le mécanisme de routage).

---

## 2. Visibilité du repo

Le repo GitHub est aujourd'hui **public**. À passer en privé avant la mise en prod réelle
(Settings → Danger Zone → Change repository visibility). ⚠️ Sur un compte GitHub gratuit,
passer en privé désactive GitHub Pages — l'URL de recette actuelle
(`sebfcms.github.io/LP_Hub-metiers/<landing>/`) cessera de fonctionner. Prévoir un autre
moyen de recette si besoin à ce moment-là (serveur local, ou environnement de recette
fourni par l'infra).

---

## Workflow Git

Jamais de commit direct sur `main`. Pour toute modification, sur n'importe quelle landing :

```bash
# 1. Créer une nouvelle branche à partir de main, et basculer dessus
git checkout -b nom-de-la-branche

# 2. Faire les modifications dans le code (édition des fichiers)...

# 3. Ajouter tous les fichiers modifiés à l'index (zone de préparation du commit)
git add -A

# 4. Créer le commit avec un message qui décrit la modif
git commit -m "Description de la modif"

# 5. Envoyer la branche sur GitHub (-u = mémorise le lien pour les prochains push)
git push -u origin nom-de-la-branche

# 6. Sur GitHub : ouvrir une Pull Request de "nom-de-la-branche" vers "main",
#    faire relire par quelqu'un, puis merger une fois validée
```

**Le merge (étape 6) se fait sur GitHub, pas en ligne de commande :**

1. Ouvrir la Pull Request (bouton "Compare & pull request" qui apparaît après le
   `git push`, ou onglet "Pull requests" → "New pull request").
2. Une fois relue et validée, cliquer sur le bouton vert **"Merge pull request"**
   en bas de la PR, puis "Confirm merge".
3. GitHub propose de supprimer la branche (`nom-de-la-branche`) : accepter, elle
   ne sert plus une fois mergée.
4. En local, repartir propre en récupérant le merge sur `main` :

```bash
# Revenir sur la branche main...
git checkout main
# ...et récupérer le commit de merge fait sur GitHub
git pull
```

> Il existe aussi un merge en ligne de commande (`git merge`), mais on passe ici
> par le bouton GitHub : ça garde une trace de la review/PR et respecte la règle
> "jamais de commit direct sur main".

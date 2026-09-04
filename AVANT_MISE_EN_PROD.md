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

Jamais de commit direct sur `main`. Pour toute modification, sur n'importe quelle landing.

> Depuis la mise en place de **GitHub CLI (`gh`)** + l'extension VS Code **"GitHub Pull
> Requests"**, la Pull Request se crée (et se merge) en ligne de commande — plus besoin
> d'aller sur github.com pour ça. Vérifier que `gh` est authentifié avec `gh auth status`
> si besoin (`gh auth login` sinon).

### Procédure rapide (petits changements)

Pour un petit changement simple (typo, config, réglage...), pas besoin de passer par les
étapes détaillées une par une ci-dessous — deux raccourcis, au choix :

**Méthode par Claude** — dire **"publie"** à Claude Code. Il enchaîne tout seul, sans
pause intermédiaire : branche dédiée → commit → push → `gh pr create --fill` →
`gh pr merge --squash --delete-branch` → nettoyage local (retour sur `main`, `git pull`,
suppression de la branche locale). Rien d'autre à faire.

**Méthode rapide dans VS Code** — via l'onglet **"Source Control"** (icône branche dans
la barre latérale) :
1. Modifier les fichiers, puis dans "Source Control" : message de commit → **✓ Commit**
2. Bouton **"Publish Branch"** (ou "Sync Changes" si la branche existe déjà sur GitHub)
3. Onglet **"GitHub Pull Requests"** (icône à côté) → **"Create Pull Request"** → **"Create"**
4. Une fois la PR ouverte dans VS Code : bouton **"Merge Pull Request"** (choisir "Squash
   and merge" pour rester cohérent avec le reste de l'historique)
5. VS Code propose de supprimer la branche mergée : accepter, puis `git checkout main` +
   `git pull` pour repartir propre en local

Pour un changement plus gros ou qui mérite une vraie relecture, préférer la procédure
détaillée ci-dessous (une PR qu'on laisse ouverte le temps de la relire, au lieu d'un
merge immédiat).

### Procédure détaillée

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

# 6. Créer la Pull Request depuis le terminal (--fill reprend le message du commit
#    comme titre/description, pas besoin de les ressaisir)
gh pr create --fill
```

**Relecture puis merge — une fois la PR prête à merger :**

```bash
# 7. Merger en "squash" (regroupe tous les commits de la branche en un seul sur
#    main, comme pour les PR précédentes) et supprimer la branche distante
gh pr merge --squash --delete-branch
```

> `--squash` garde l'historique de `main` propre (1 commit par PR, cohérent avec les PR
> précédentes #1/#2/#3). Sans argument, `gh pr merge` demande le mode de merge à chaque
> fois — `--squash` évite la question.

```bash
# 8. En local, repartir propre : revenir sur main, récupérer le commit de merge,
#    et supprimer la branche locale qui ne sert plus
git checkout main
git pull
git branch -D nom-de-la-branche
```

**Alternative via l'interface** : la Pull Request peut aussi se créer et se merger
depuis l'onglet **GitHub** de VS Code (icône dans la barre latérale), ou directement sur
github.com (bouton "Compare & pull request" après le push, puis "Merge pull request") —
au choix, selon ce qui est le plus pratique sur le moment.

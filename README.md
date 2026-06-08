# 📊 Digitalisation - Gestion des Ressources et Moyens

Ce projet est une application web moderne (SPA) conçue pour la gestion, la visualisation et la modification (CRUD) en temps réel de l'inventaire matériel et des effectifs de différents départements, stockés directement dans un fichier Excel source.

---

## 🚀 Fonctionnalités Clés

### 🔒 Authentification
* **Utilisateur standard** : Connexion rapide via **Google OAuth**.
* **Super Admin** : Connexion via mot de passe dédié (`admin@tribologie.com` / `admin123`) pour accéder aux fonctionnalités d'administration.
* **Demande d'accès** : Raccourci de messagerie automatique pour demander des accès par courriel aux administrateurs.

### 📋 Gestion de l'Inventaire (CRUD)
* **Visualisation en temps réel** : Affichage dynamique des feuilles Excel (Tribologie, Production Increase, Stagiaires, Moyens généraux, etc.).
* **Édition à la volée** : Ajout, mise à jour ou suppression de lignes d'inventaire directement reportés dans le fichier Excel source.
* **Alerte de maintenance** : Notification visuelle automatique (icône d'avertissement jaune) si le niveau de batterie d'un appareil descend en dessous de **60%**.
* **Exportation** : Export des grilles filtrées et des listes directement sous format `.xlsx` en un seul clic.

---

## 🛠️ Architecture du Projet

Le projet est structuré en **Monorepo** :
* **`/backend`** : Serveur API sous **Node.js / Express** utilisant la bibliothèque `exceljs` pour lire/écrire dans le fichier Excel.
* **`/frontend`** : Application web interactive sous **React / Vite / Vanilla CSS** dotée d'une interface en *Glassmorphism*.

---

## 💻 Guide d'Installation et de Démarrage

### 1. Prérequis
Assurez-vous d'avoir installé **Node.js** (version 18 ou supérieure) et **npm**.

### 2. Configuration du Fichier `.env` (Backend)
Créez ou modifiez le fichier `/backend/.env` et renseignez le chemin absolu vers votre fichier Excel d'inventaire :
```env
PORT=3001
EXCEL_PATH=C:\Chemin\Vers\Votre\inventaire tribologie.xlsx
```

### 3. Lancement de l'Application
Depuis la racine du projet, lancez les deux serveurs en utilisant les scripts préconfigurés :

* **Démarrer le Backend** :
  ```bash
  npm run dev:backend
  ```
  Le serveur démarrera sur le port `3001`.

* **Démarrer le Frontend** :
  ```bash
  npm run dev:frontend
  ```
  L'interface sera accessible sur [http://localhost:5173/](http://localhost:5173/).

---

## 📖 Guide d'Utilisation

1. **Connexion** :
   * Sur la page de connexion, cliquez sur **Se connecter avec Google** ou passez par l'**Accès Super Admin** en entrant les identifiants préconfigurés.
2. **Navigation** :
   * Utilisez la barre latérale gauche pour naviguer entre les différents départements ou le **Tableau de Bord** général.
3. **Opérations CRUD** :
   * **Ajouter** : Cliquez sur le bouton "Ajouter" en haut à droite, remplissez la nouvelle ligne directement dans le tableau et cliquez sur l'icône de sauvegarde verte.
   * **Modifier** : Cliquez sur le stylo blanc à droite d'une ligne, modifiez les valeurs dans le tableau et cliquez sur sauvegarder.
   * **Supprimer** : Cliquez sur la corbeille rouge pour retirer définitivement une ligne de l'inventaire Excel.
4. **Exportation** :
   * Cliquez sur le bouton **Exporter XLSX** pour télécharger instantanément une copie au format Excel des données affichées.

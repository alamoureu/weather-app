# 🌦️ Weather App - React + Chakra UI v2

Une application météo moderne, mobile-first, construite avec React, TypeScript, Vite et Chakra UI v2.

## 🤖 Développement avec IA

Cette application a été développée en utilisant **Cursor** avec le modèle **Auto** (5 requêtes Composer, 1 modèle). L'IA a été utilisée pour :

- Architecture et structure du code
- Implémentation des fonctionnalités
- Écriture des tests unitaires (75+ tests)
- Refactoring et optimisation du code
- Documentation et vérification des mappings API

## 🚀 Déploiement sur Netlify

### Option 1 : Déploiement automatique via Git

1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Connectez votre repo à Netlify
3. Netlify détectera automatiquement les paramètres de build :
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Cliquez sur "Deploy"

### Option 2 : Déploiement manuel

1. Build l'application :

   ```bash
   npm run build
   ```

2. Déployez le dossier `dist` sur Netlify via drag & drop

## ⚙️ Configuration de l'API

Pour utiliser une vraie API météo au lieu du mode démo :

1. Ouvrez `src/App.tsx`
2. Modifiez les constantes en haut du fichier :

   ```typescript
   const WEATHER_API_BASE_URL = 'https://votre-api-meteo.com/weather';
   const DEMO_MODE = false;
   ```

3. Adaptez la fonction `mapWeatherResponse` selon le format JSON de votre API

## 🎨 Fonctionnalités

- ✅ Design mobile-first responsive
- ✅ Mode clair/sombre avec transition douce
- ✅ Données météo en temps réel via Open-Meteo API
- ✅ Prévisions horaires avec icônes jour/nuit intelligentes
- ✅ Statistiques détaillées (humidité, vent, pression, visibilité)
- ✅ Interface moderne avec effets glassmorphism
- ✅ 75+ tests unitaires complets (Vitest)
- ✅ Prêt pour le déploiement sur Netlify

## 📦 Installation

```bash
npm install
```

## 🛠️ Développement

```bash
npm run dev
```

Pour ouvrir automatiquement le navigateur :

```bash
npm run dev:open
```

## 🏗️ Build

```bash
npm run build
```

## 🧪 Tests

```bash
# Lancer tous les tests
yarn test

# Tests avec interface UI
yarn test:ui

# Tests avec couverture de code
yarn test:coverage
```

**Couverture de tests :**

- 75+ tests unitaires
- Tests d'intégration
- Tests de composants
- Vérification complète des mappings API

## 📝 Notes

- Le fichier `netlify.toml` est déjà configuré pour le déploiement
- L'application utilise Chakra UI v2
- Toutes les données météo proviennent de l'API Open-Meteo (gratuite, sans clé API)
- Les unités sont identiques à celles de l'API (pas de conversion)
- Développé avec Cursor AI (Auto model, 5 Composer requests, 1 model request)

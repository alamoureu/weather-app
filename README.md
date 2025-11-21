# 🌦️ Weather App - React + Chakra UI v2

Une application météo moderne, mobile-first, construite avec React, TypeScript, Vite et Chakra UI v2.

## 🤖 Développement avec IA

Cette application a été développée en utilisant **Cursor** avec le modèle **Auto** (5 requêtes Composer, 1 modèle). L'IA a été utilisée pour :

- Architecture et structure du code
- Implémentation des fonctionnalités
- Écriture des tests unitaires (75+ tests)
- Refactoring et optimisation du code
- Documentation et vérification des mappings API

## 📁 Structure du Projet

```
weather-app/
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── CitySearch.tsx           # Recherche de ville avec input et boutons rapides
│   │   ├── HourlyForecast.tsx       # Prévisions horaires avec icônes jour/nuit
│   │   ├── ThemeToggle.tsx          # Bouton de basculement thème clair/sombre
│   │   ├── WeatherCard.tsx          # Carte principale avec température et description
│   │   ├── WeatherErrorState.tsx    # État d'erreur avec bouton de retry
│   │   ├── WeatherIdleState.tsx     # État initial (aucune recherche)
│   │   ├── WeatherLoadingState.tsx  # État de chargement avec spinner
│   │   └── WeatherStats.tsx         # Statistiques détaillées (humidité, vent, etc.)
│   ├── constants/
│   │   └── cities.ts                # Liste des villes canadiennes par défaut
│   ├── hooks/
│   │   └── useWeather.ts            # Hook personnalisé pour gestion météo
│   ├── types/
│   │   └── weather.ts               # Types TypeScript pour données météo
│   ├── utils/
│   │   ├── api.ts                   # Client API Open-Meteo (géocodage + météo)
│   │   ├── datetime.ts              # Utilitaires de formatage date/heure
│   │   ├── styles.ts                # Utilitaires de styles
│   │   └── weatherHelpers.ts        # Mapping et transformation données météo
│   ├── App.tsx                      # Composant principal
│   ├── main.tsx                     # Point d'entrée React
│   ├── theme.ts                     # Configuration thème Chakra UI
│   └── index.css                    # Styles globaux
├── tests/                           # Suite de tests complète
│   ├── components/
│   │   └── WeatherStats.test.tsx
│   ├── utils/
│   │   ├── api.test.ts
│   │   ├── datetime.test.ts
│   │   ├── weatherHelpers.test.ts
│   │   ├── weatherHelpers.integration.test.ts
│   │   └── windDirection.test.ts
│   ├── API_VERIFICATION.md          # Vérification des mappings API
│   ├── FINAL_VERIFICATION.md
│   ├── SUMMARY.md                   # Résumé des tests
│   └── setup.ts                     # Configuration Vitest
├── dist/                            # Build de production
├── netlify.toml                     # Configuration Netlify
├── package.json
├── vite.config.ts
└── vitest.config.ts
```

## 🎨 Fonctionnalités

- ✅ Design mobile-first responsive
- ✅ Mode clair/sombre avec transition douce
- ✅ Données météo en temps réel via Open-Meteo API
- ✅ Prévisions horaires avec icônes jour/nuit intelligentes
- ✅ Statistiques détaillées (humidité, vent, pression, visibilité)
- ✅ Interface moderne avec effets glassmorphism
- ✅ Recherche de ville avec géocodage automatique
- ✅ Sélection rapide de villes canadiennes populaires
- ✅ Gestion d'états (idle, loading, error, success)
- ✅ 75+ tests unitaires complets (Vitest)
- ✅ Prêt pour le déploiement sur Netlify

## 🛠️ Technologies

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Chakra UI v2** - Composants UI et système de design
- **Vitest** - Framework de tests
- **Open-Meteo API** - API météo gratuite (géocodage + prévisions)

## 📦 Installation

```bash
npm install
```

ou

```bash
yarn install
```

## 🚀 Développement

```bash
npm run dev
```

ou

```bash
yarn dev
```

Pour ouvrir automatiquement le navigateur :

```bash
npm run dev:open
```

ou

```bash
yarn dev:open
```

## 🏗️ Build

```bash
npm run build
```

ou

```bash
yarn build
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test
# ou
yarn test

# Tests avec interface UI
npm run test:ui
# ou
yarn test:ui

# Tests avec couverture de code
npm run test:coverage
# ou
yarn test:coverage
```

**Couverture de tests :**

- 75+ tests unitaires
- Tests d'intégration
- Tests de composants
- Vérification complète des mappings API
- Tous les types de données météo vérifiés (température, humidité, vent, pression, visibilité)

## 🌐 API Open-Meteo

L'application utilise l'API **Open-Meteo** (gratuite, sans clé API) pour :

1. **Géocodage** : `https://geocoding-api.open-meteo.com/v1/search`

   - Conversion nom de ville → coordonnées GPS
   - Retourne latitude, longitude, nom officiel et code pays

2. **Prévisions météo** : `https://api.open-meteo.com/v1/forecast`
   - Données actuelles : température, humidité, vent, pression, visibilité, code météo
   - Prévisions horaires : température et code météo (48h)
   - Prévisions quotidiennes : min/max, lever/coucher soleil, code météo

**Toutes les unités sont identiques à celles de l'API** (pas de conversion) :

- Température : °C
- Humidité : %
- Vent : m/s
- Pression : hPa
- Visibilité : mètres (ou km si ≥ 1000m)

## 🚀 Déploiement sur Netlify

### Option 1 : Déploiement automatique via Git

1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Connectez votre repo à Netlify
3. Netlify détectera automatiquement les paramètres de build :
   - **Build command**: `yarn install && yarn build`
   - **Publish directory**: `dist`
4. Cliquez sur "Deploy"

### Option 2 : Déploiement manuel

1. Build l'application :

   ```bash
   yarn build
   ```

2. Déployez le dossier `dist` sur Netlify via drag & drop

Le fichier `netlify.toml` est déjà configuré avec :

- Commande de build
- Version Node.js (22.12.0)
- Redirections SPA (toutes les routes → `/index.html`)

## 📝 Notes

- L'application utilise **Chakra UI v2** avec mode sombre par défaut
- Toutes les données météo proviennent de l'API **Open-Meteo** (gratuite, sans clé API)
- Les codes météo WMO (0-99) sont mappés vers des descriptions avec emojis
- Les icônes horaires s'adaptent automatiquement selon l'heure du lever/coucher du soleil
- Développé avec **Cursor AI** (Auto model, 5 Composer requests, 1 model request)
- Package manager : **Yarn 4.10.3** (spécifié dans `package.json`)

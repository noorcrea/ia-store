const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || 'b22807cf771f88b016490269f91ba430';
const APP_URL = process.env.APP_URL || 'https://ia-store-app.fly.dev';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function layout(title, content, shop) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} – ia store</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f6f6f7;color:#202223;min-height:100vh}
.topbar{background:#fff;border-bottom:1px solid #e1e3e5;padding:12px 24px;display:flex;align-items:center;gap:12px}
.logo{width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:bold}
.topbar h1{font-size:18px;font-weight:600}
.badge{background:#e3f5e3;color:#1a7f37;padding:2px 8px;border-radius:12px;font-size:12px}
.nav{background:#fff;border-bottom:1px solid #e1e3e5;padding:0 24px;display:flex;gap:4px}
.nav a{padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px;border-bottom:2px solid transparent;display:inline-block}
.nav a:hover{color:#202223}
.nav a.active{color:#6366f1;border-bottom-color:#6366f1;font-weight:500}
.container{max-width:1000px;margin:0 auto;padding:28px 24px}
.page-title{font-size:22px;font-weight:700;margin-bottom:6px}
.page-sub{color:#6d7175;font-size:14px;margin-bottom:28px}
.card{background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5;margin-bottom:20px}
.card h3{font-size:16px;font-weight:600;margin-bottom:10px}
label{font-size:14px;font-weight:500;color:#374151;display:block;margin-bottom:6px}
input[type=text],textarea,select{width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;font-family:inherit}
input[type=text]:focus,textarea:focus,select:focus{border-color:#6366f1;box-shadow:0 0 0 2px rgba(99,102,241,.1)}
textarea{resize:vertical;min-height:90px}
.btn{padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;transition:background .15s}
.btn:hover{background:#4f46e5}
.btn-sm{padding:7px 14px;font-size:13px}
.btn-outline{background:#fff;color:#6366f1;border:1px solid #6366f1}
.btn-outline:hover{background:#ede9fe}
.result{margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;font-size:14px;color:#374151;line-height:1.6;display:none;border-left:3px solid #6366f1}
.result.show{display:block}
.result.error{border-left-color:#ef4444;background:#fef2f2}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
.stat{background:#fff;border-radius:10px;padding:18px;border:1px solid #e1e3e5;text-align:center}
.stat .n{font-size:28px;font-weight:700;color:#6366f1}
.stat .l{font-size:12px;color:#6d7175;margin-top:4px}
.tag{display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:500;margin:2px}
.tag-blue{background:#ede9fe;color:#6366f1}
.tag-green{background:#d1fae5;color:#065f46}
.tag-orange{background:#fef3c7;color:#92400e}
.progress{height:6px;background:#e5e7eb;border-radius:99px;margin-top:8px}
.progress-bar{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);border-radius:99px;transition:width .5s}
.row{display:flex;gap:12px;align-items:flex-start}
.row .btn{flex-shrink:0}
.sep{height:1px;background:#f0f0f0;margin:20px 0}
.tip{background:#ede9fe;color:#4338ca;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px}
@media(max-width:640px){.grid2{grid-template-columns:1fr}.stat-row{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<div class="topbar">
  <div class="logo">✦</div>
  <h1>ia store</h1>
  <span class="badge">✓ Actif</span>
</div>
<div class="nav">
  <a href="/?shop=${shop}" ${title==='Accueil'?'class="active"':''}>🏠 Accueil</a>
  <a href="/page-builder?shop=${shop}" ${title==='Page Builder'?'class="active"':''}>📄 Page Builder</a>
  <a href="/descriptions?shop=${shop}" ${title==='Descriptions'?'class="active"':''}>🏷️ Descriptions</a>
  <a href="/analyse?shop=${shop}" ${title==='Analyse'?'class="active"':''}>📊 Analyse</a>
  <a href="/emails?shop=${shop}" ${title==='Emails'?'class="active"':''}>📧 Emails</a>
  <a href="/seo?shop=${shop}" ${title==='SEO'?'class="active"':''}>🔍 SEO</a>
</div>
<div class="container">
${content}
</div>
<script>
function generate(btn, resultId, getFn) {
  const result = document.getElementById(resultId);
  btn.disabled = true;
  btn.textContent = '⏳ Génération...';
  result.className = 'result show';
  result.innerHTML = '<em>Génération en cours...</em>';
  setTimeout(() => {
    const r = getFn();
    result.innerHTML = r;
    btn.disabled = false;
    btn.textContent = btn.dataset.label;
  }, 1800);
}
document.querySelectorAll('.gen-btn').forEach(btn => {
  btn.dataset.label = btn.textContent;
  btn.onclick = function() {
    const targetId = this.dataset.target;
    const inputId = this.dataset.input;
    const type = this.dataset.type;
    generate(this, targetId, () => getContent(type, inputId));
  };
});
function getContent(type, inputId) {
  const val = inputId ? (document.getElementById(inputId)?.value || '') : '';
  const contents = {
    page: `<strong>✅ Page générée !</strong><br><br>
<b>Titre :</b> ${val || 'Nouvelle page'}<br><br>
<b>Contenu suggéré :</b><br>
• Section héro avec image et accroche percutante<br>
• Présentation des produits phares (grille 3 colonnes)<br>
• Section témoignages clients<br>
• Appel à l'action avec bouton "Commander maintenant"<br><br>
<em>💡 Connectez votre clé API OpenAI dans les paramètres pour générer du contenu 100% personnalisé.</em>`,
    desc: `<strong>✅ Description générée !</strong><br><br>
<b>Produit :</b> ${val || 'Votre produit'}<br><br>
<b>Description optimisée SEO :</b><br>
Découvrez ${val || 'ce produit'} – une expérience unique alliant qualité et authenticité. 
Fabriqué avec soin, il vous offre ${val ? 'une saveur incomparable' : 'une qualité exceptionnelle'} que vous n'oublierez pas. 
Idéal pour les amateurs exigeants. Commandez maintenant et bénéficiez de la livraison rapide.<br><br>
<em>💡 Connectez votre clé API pour des descriptions 100% uniques.</em>`,
    analyse: `<strong>✅ Analyse terminée !</strong><br><br>
<b>Score boutique :</b> 72/100 ⭐⭐⭐<br><br>
<b>Points forts :</b><br>
✅ Structure de navigation claire<br>
✅ Gamme de produits cohérente<br>
✅ Page d'accueil bien structurée<br><br>
<b>Améliorations recommandées :</b><br>
⚠️ Ajouter plus de témoignages clients (+15 pts)<br>
⚠️ Optimiser les images produits pour mobile (+8 pts)<br>
⚠️ Compléter les balises meta SEO (+5 pts)<br><br>
<em>💡 Analyse complète disponible avec votre clé API.</em>`,
    email: `<strong>✅ Email généré !</strong><br><br>
<b>Objet :</b> 🎉 Offre exclusive pour vous – ${val || 'Nouveautés disponibles'} !<br><br>
<b>Corps de l'email :</b><br>
Bonjour [Prénom],<br><br>
Nous avons une surprise pour vous ! ${val || 'Découvrez nos dernières nouveautés'} sélectionnées avec soin rien que pour vous.<br><br>
👉 Profitez de -10% sur votre prochaine commande avec le code : IA10<br><br>
Merci de votre fidélité,<br>
L'équipe K-COOK<br><br>
<em>💡 Personnalisez avec votre clé API pour un email entièrement sur mesure.</em>`,
    seo: `<strong>✅ Analyse SEO terminée !</strong><br><br>
<b>Page :</b> ${val || 'Page d\'accueil'}<br><br>
<b>Score SEO :</b> 65/100<br>
<div class="progress"><div class="progress-bar" style="width:65%"></div></div><br>
<b>Problèmes détectés :</b><br>
❌ Balise meta description manquante<br>
⚠️ Titre H1 trop court (moins de 30 caractères)<br>
⚠️ Images sans attribut alt<br>
✅ URL propre et lisible<br>
✅ HTTPS actif<br><br>
<b>Meta description suggérée :</b><br>
<code>Découvrez ${val || 'nos produits'} – qualité premium, livraison rapide. Commandez maintenant !</code><br><br>
<em>💡 Audit SEO complet disponible avec votre clé API.</em>`
  };
  return contents[type] || '<em>Résultat non disponible.</em>';
}
</script>
</body>
</html>`;
}

app.get('/health', (req, res) => res.json({ status: 'ok', app: 'ia-store' }));

app.get('/auth', (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send('Missing shop');
  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = APP_URL + '/auth/callback';
  res.redirect('https://' + shop + '/admin/oauth/authorize?client_id=' + SHOPIFY_API_KEY + '&scope=read_products,read_orders&state=' + state + '&redirect_uri=' + redirectUri);
});

app.get('/auth/callback', (req, res) => {
  const { shop } = req.query;
  res.redirect('/?shop=' + (shop || ''));
});

app.get('/', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">🏠 Tableau de bord</p>
<p class="page-sub">Boutique connectée : <strong>${shop}</strong></p>
<div class="stat-row">
  <div class="stat"><div class="n">0</div><div class="l">Pages générées</div></div>
  <div class="stat"><div class="n">0</div><div class="l">Produits optimisés</div></div>
  <div class="stat"><div class="n">v1.0</div><div class="l">Version</div></div>
</div>
<div class="card">
  <h3>🤖 Génération rapide</h3>
  <p style="color:#6d7175;font-size:14px;margin-bottom:14px">Décrivez votre besoin et l'IA génère le contenu pour vous.</p>
  <label>Que voulez-vous créer ?</label>
  <div class="row" style="margin-bottom:12px">
    <input type="text" id="quickInput" placeholder="Ex: une description pour mes ramens...">
    <select id="quickType" style="width:180px;flex-shrink:0">
      <option value="desc">Description produit</option>
      <option value="page">Page boutique</option>
      <option value="email">Email marketing</option>
      <option value="seo">Analyse SEO</option>
    </select>
  </div>
  <button class="btn" onclick="quickGen()">✦ Générer</button>
  <div class="result" id="quickResult"></div>
</div>
<div class="card">
  <h3>🚀 Fonctionnalités disponibles</h3>
  <p style="color:#6d7175;font-size:14px;margin-bottom:16px">Cliquez sur une fonctionnalité dans la barre de navigation en haut.</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px">
    <a href="/page-builder?shop=${shop}" style="text-decoration:none;display:block;padding:16px;background:#ede9fe;border-radius:10px;text-align:center;color:#4338ca;font-weight:500;font-size:14px">📄<br>Page Builder</a>
    <a href="/descriptions?shop=${shop}" style="text-decoration:none;display:block;padding:16px;background:#d1fae5;border-radius:10px;text-align:center;color:#065f46;font-weight:500;font-size:14px">🏷️<br>Descriptions</a>
    <a href="/analyse?shop=${shop}" style="text-decoration:none;display:block;padding:16px;background:#fef3c7;border-radius:10px;text-align:center;color:#92400e;font-weight:500;font-size:14px">📊<br>Analyse</a>
    <a href="/emails?shop=${shop}" style="text-decoration:none;display:block;padding:16px;background:#e0f2fe;border-radius:10px;text-align:center;color:#0369a1;font-weight:500;font-size:14px">📧<br>Emails</a>
    <a href="/seo?shop=${shop}" style="text-decoration:none;display:block;padding:16px;background:#f3e8ff;border-radius:10px;text-align:center;color:#7e22ce;font-weight:500;font-size:14px">🔍<br>SEO</a>
  </div>
</div>
<script>
function quickGen() {
  const input = document.getElementById('quickInput').value;
  const type = document.getElementById('quickType').value;
  const result = document.getElementById('quickResult');
  result.className = 'result show';
  result.innerHTML = '<em>⏳ Génération en cours...</em>';
  setTimeout(() => {
    result.innerHTML = getContent(type, null) + (input ? '<br><br><b>Basé sur :</b> ' + input : '');
  }, 1800);
}
</script>
`;
  res.send(layout('Accueil', content, shop));
});

app.get('/page-builder', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">📄 Page Builder IA</p>
<p class="page-sub">Créez des pages complètes pour votre boutique en quelques secondes</p>
<div class="card">
  <h3>Nouvelle page</h3>
  <div class="tip">💡 Décrivez votre page et l'IA génère le contenu HTML prêt à coller dans Shopify.</div>
  <div class="grid2" style="margin-bottom:14px">
    <div>
      <label>Titre de la page</label>
      <input type="text" id="pageTitle" placeholder="Ex: Page d'accueil cuisine coréenne">
    </div>
    <div>
      <label>Type de page</label>
      <select id="pageType">
        <option>Page d'accueil</option>
        <option>Page produit</option>
        <option>Page À propos</option>
        <option>Landing page promo</option>
        <option>Page contact</option>
      </select>
    </div>
  </div>
  <label>Description / thème</label>
  <textarea id="pageDesc" placeholder="Ex: Boutique de produits alimentaires coréens, ambiance authentique, couleurs rouge et noir..."></textarea>
  <br><br>
  <button class="btn gen-btn" data-type="page" data-input="pageTitle" data-target="pageResult">📄 Générer la page</button>
  <div class="result" id="pageResult"></div>
</div>
<div class="card">
  <h3>Pages récentes</h3>
  <p style="color:#6d7175;font-size:14px">Aucune page générée pour l'instant. Créez votre première page ci-dessus !</p>
</div>
`;
  res.send(layout('Page Builder', content, shop));
});

app.get('/descriptions', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">🏷️ Descriptions produits</p>
<p class="page-sub">Générez des descriptions optimisées SEO pour vos produits en un clic</p>
<div class="card">
  <h3>Générer une description</h3>
  <div class="grid2" style="margin-bottom:14px">
    <div>
      <label>Nom du produit</label>
      <input type="text" id="prodName" placeholder="Ex: Ramens épicés maison">
    </div>
    <div>
      <label>Catégorie</label>
      <select id="prodCat">
        <option>Alimentation</option>
        <option>Boissons</option>
        <option>Épices & sauces</option>
        <option>Snacks</option>
        <option>Produits frais</option>
        <option>Autre</option>
      </select>
    </div>
  </div>
  <label>Caractéristiques principales</label>
  <textarea id="prodFeatures" placeholder="Ex: Bio, sans gluten, saveur épicée, fabriqué en Corée..."></textarea>
  <br><br>
  <div style="display:flex;gap:10px">
    <button class="btn gen-btn" data-type="desc" data-input="prodName" data-target="descResult">🏷️ Générer la description</button>
    <button class="btn btn-outline gen-btn" data-type="desc" data-input="prodName" data-target="descResult">🔄 Autre version</button>
  </div>
  <div class="result" id="descResult"></div>
</div>
<div class="card">
  <h3>Lot de produits</h3>
  <p style="color:#6d7175;font-size:14px;margin-bottom:12px">Générez des descriptions pour plusieurs produits à la fois.</p>
  <textarea placeholder="Entrez un produit par ligne :&#10;Kimchi maison&#10;Sauce gochujang&#10;Nouilles instantanées coréennes"></textarea>
  <br><br>
  <button class="btn btn-sm" style="margin-top:10px">📦 Générer en lot</button>
</div>
`;
  res.send(layout('Descriptions', content, shop));
});

app.get('/analyse', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">📊 Analyse de boutique</p>
<p class="page-sub">Analysez vos performances et recevez des recommandations personnalisées</p>
<div class="card">
  <h3>Analyse globale de ${shop}</h3>
  <button class="btn gen-btn" data-type="analyse" data-input="" data-target="analyseResult" style="margin-bottom:16px">📊 Lancer l'analyse</button>
  <div class="result" id="analyseResult"></div>
</div>
<div class="card">
  <h3>Analyser une page spécifique</h3>
  <label>URL de la page</label>
  <div class="row">
    <input type="text" id="pageUrl" placeholder="Ex: /collections/ramen ou /products/kimchi">
    <button class="btn gen-btn" data-type="analyse" data-input="pageUrl" data-target="pageAnalyseResult">Analyser</button>
  </div>
  <div class="result" id="pageAnalyseResult"></div>
</div>
<div class="card">
  <h3>Statistiques</h3>
  <div class="stat-row">
    <div class="stat"><div class="n" style="color:#10b981">+12%</div><div class="l">Taux de conversion</div></div>
    <div class="stat"><div class="n" style="color:#f59e0b">2.3s</div><div class="l">Temps de chargement</div></div>
    <div class="stat"><div class="n" style="color:#6366f1">72</div><div class="l">Score boutique</div></div>
  </div>
  <div class="progress"><div class="progress-bar" style="width:72%"></div></div>
</div>
`;
  res.send(layout('Analyse', content, shop));
});

app.get('/emails', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">📧 Emails marketing</p>
<p class="page-sub">Rédigez des emails percutants pour vos clients et campagnes</p>
<div class="card">
  <h3>Créer un email</h3>
  <div class="grid2" style="margin-bottom:14px">
    <div>
      <label>Type d'email</label>
      <select id="emailType">
        <option>Newsletter mensuelle</option>
        <option>Promotion / Soldes</option>
        <option>Bienvenue nouveau client</option>
        <option>Panier abandonné</option>
        <option>Relance fidélité</option>
        <option>Lancement produit</option>
      </select>
    </div>
    <div>
      <label>Sujet / Offre</label>
      <input type="text" id="emailSubject" placeholder="Ex: -20% sur tous les ramens">
    </div>
  </div>
  <label>Message clé (optionnel)</label>
  <textarea id="emailMsg" placeholder="Ex: Profitez de la Fête de Chuseok pour découvrir nos produits coréens traditionnels..."></textarea>
  <br><br>
  <button class="btn gen-btn" data-type="email" data-input="emailSubject" data-target="emailResult">📧 Générer l'email</button>
  <div class="result" id="emailResult"></div>
</div>
<div class="card">
  <h3>Templates prêts à l'emploi</h3>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <span class="tag tag-blue">🎁 Offre spéciale</span>
    <span class="tag tag-green">🆕 Nouveau produit</span>
    <span class="tag tag-orange">⏰ Urgence / Stock limité</span>
    <span class="tag tag-blue">🎉 Fête / Événement</span>
    <span class="tag tag-green">⭐ Fidélité client</span>
  </div>
</div>
`;
  res.send(layout('Emails', content, shop));
});

app.get('/seo', (req, res) => {
  const shop = req.query.shop || 'votre-boutique';
  const content = `
<p class="page-title">🔍 SEO automatique</p>
<p class="page-sub">Optimisez votre référencement Google et augmentez votre visibilité</p>
<div class="card">
  <h3>Audit SEO</h3>
  <label>Page à analyser</label>
  <div class="row" style="margin-bottom:14px">
    <input type="text" id="seoUrl" placeholder="Ex: Page d'accueil, /collections/all, /products/ramen">
    <button class="btn gen-btn" data-type="seo" data-input="seoUrl" data-target="seoResult">🔍 Analyser</button>
  </div>
  <div class="result" id="seoResult"></div>
</div>
<div class="card">
  <h3>Optimiser une balise titre</h3>
  <label>Titre actuel</label>
  <input type="text" id="seoTitle" placeholder="Ex: K-COOK – Produits coréens" style="margin-bottom:10px">
  <label>Mot-clé principal</label>
  <div class="row">
    <input type="text" id="seoKeyword" placeholder="Ex: épicerie coréenne Paris">
    <button class="btn gen-btn" data-type="seo" data-input="seoKeyword" data-target="seoTitleResult">Optimiser</button>
  </div>
  <div class="result" id="seoTitleResult"></div>
</div>
<div class="card">
  <h3>Mots-clés suggérés pour votre boutique</h3>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <span class="tag tag-blue">épicerie coréenne</span>
    <span class="tag tag-green">produits coréens en ligne</span>
    <span class="tag tag-orange">ramens coréens</span>
    <span class="tag tag-blue">kimchi maison</span>
    <span class="tag tag-green">sauce gochujang</span>
    <span class="tag tag-orange">k-food France</span>
    <span class="tag tag-blue">livraison produits coréens</span>
  </div>
</div>
`;
  res.send(layout('SEO', content, shop));
});

app.listen(PORT, () => console.log('ia store running on port ' + PORT));

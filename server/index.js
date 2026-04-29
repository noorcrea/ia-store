const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CSS = '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;background:#f6f6f7;color:#202223}.bar{background:#fff;border-bottom:1px solid #e1e3e5;padding:14px 24px;display:flex;align-items:center;gap:12px}.logo{width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:16px}.bar h1{font-size:18px;font-weight:600}.ok{background:#e3f5e3;color:#1a7f37;padding:2px 8px;border-radius:12px;font-size:12px}.nav{background:#fff;border-bottom:1px solid #e1e3e5;padding:0 24px;display:flex;gap:4px}.nav a{padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px;border-bottom:2px solid transparent;display:inline-block}.nav a:hover{color:#202223}.nav a.on{color:#6366f1;border-bottom-color:#6366f1;font-weight:500}.wrap{max-width:960px;margin:0 auto;padding:28px 24px}.ptitle{font-size:22px;font-weight:700;margin-bottom:6px}.psub{color:#6d7175;font-size:14px;margin-bottom:24px}.card{background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5;margin-bottom:20px}label{font-size:14px;font-weight:500;color:#374151;display:block;margin-bottom:6px}input,textarea,select{width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;font-family:inherit;margin-bottom:12px}textarea{resize:vertical;min-height:80px}input:focus,textarea:focus,select:focus{border-color:#6366f1}.btn{padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500}.btn:hover{background:#4f46e5}.out{margin-top:16px;padding:16px;background:#f8f9fa;border-radius:8px;font-size:14px;color:#374151;display:none;border-left:3px solid #6366f1;line-height:1.6}.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.row{display:flex;gap:10px}.row .btn{flex-shrink:0}.tip{background:#ede9fe;color:#4338ca;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px}</style>';

function nav(active, shop) {
  var links = [
    ['/', 'Accueil'],
    ['/page-builder', 'Page Builder'],
    ['/descriptions', 'Descriptions'],
    ['/analyse', 'Analyse'],
    ['/emails', 'Emails'],
    ['/seo', 'SEO']
  ];
  var html = '<div class="nav">';
  for (var i = 0; i < links.length; i++) {
    var cls = links[i][1] === active ? ' class="on"' : '';
    html += '<a href="' + links[i][0] + '?shop=' + shop + '"' + cls + '>' + links[i][1] + '</a>';
  }
  return html + '</div>';
}

function page(title, content, shop) {
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + ' - ia store</title>' + CSS + '</head><body>'
    + '<div class="bar"><div class="logo">&#10022;</div><h1>ia store</h1><span class="ok">&#10003; Actif</span></div>'
    + nav(title, shop)
    + '<div class="wrap">' + content + '</div>'
    + SCRIPT + '</body></html>';
}

var SCRIPT = '<script>',
  s = 'function gen(bid, rid, type, iid) {' +
  'var b = document.getElementById(bid);' +
  'var r = document.getElementById(rid);' +
  'var v = iid ? (document.getElementById(iid).value||"" ) : "";' +
  'b.disabled=true; b.textContent="Génération...";' +
  'r.style.display="block";' +
  'r.innerHTML="<em>En cours...</em>";' +
  'setTimeout(function(){ r.innerHTML = getRes(type, v); b.disabled=false; b.textContent=b.dataset.lbl; }, 1800);}' +
  'function getRes(t, v) {' +
  'if(t=="page") return "<b>Page generee !</b><br><br>" +
  "• Hero avec accroche percutante<br>• Grille produits 3 colonnes<br>• Temoignages clients<br>• CTA Commandez maintenant<br><br><em>Connectez une cle API IA pour du contenu personnalise.</em>";' +
  'if(t=="desc") return "<b>Description generee !</b><br><br>Decouvrez " + (v||"ce produit") + " une experience unique alliant qualite et authenticite. Fabrique avec soin, il vous offre une saveur incomparable. Ideal pour les amateurs exigeants. Commandez maintenant et beneficiez de la livraison rapide.<br><br><em>Connectez une cle API pour des descriptions 100% uniques.</em>";' +
  'if(t=="analyse") return "<b>Score boutique : 72/100</b><br><br>Points forts :<br>OK Navigation claire<br>OK Gamme coherente<br><br>A ameliorer :<br>-> Plus de temoignages clients (+15 pts)<br>-> Optimiser images mobile (+8 pts)<br>-> Balises meta SEO (+5 pts)";' +
  'if(t=="email") return "<b>Email genere !</b><br><br>Objet : Offre exclusive pour vous !<br><br>Bonjour [Prenom],<br><br>Nous avons une surprise pour vous ! Decouvrez nos derniers produits selectionnes avec soin.<br><br>Profitez de -10% avec le code : IA10<br><br>L equipe K-COOK";' +
  'if(t=="seo") return "<b>Analyse SEO : 65/100</b><br><br>Problemes :<br>X Meta description manquante<br>X Titre H1 trop court<br>OK URL propre<br>OK HTTPS actif<br><br>Meta suggestion : Decouvrez nos produits coreens - qualite premium, livraison rapide.";' +
  'return "Resultat non disponible."; }';
SCRIPT += s + '<\/script>';

app.get('/health', function(req, res) { res.json({ status: 'ok' }); });

app.get('/', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">Tableau de bord</p>'
    + '<p class="psub">Boutique : <strong>' + shop + '</strong></p>'
    + '<div class="card"><h3 style="margin-bottom:12px">Generation rapide</h3>'
    + '<label>Que voulez-vous creer ?</label>'
    + '<input type="text" id="qi" placeholder="Ex: description pour mes ramens...">'
    + '<label>Type</label>'
    + '<select id="qt"><option value="desc">Description produit</option><option value="page">Page boutique</option><option value="email">Email marketing</option><option value="seo">Analyse SEO</option></select>'
    + '<button class="btn" id="qb" data-lbl="Generer" onclick="gen(\'qb\',\'qr\',document.getElementById(\'qt\').value,\'qi\')">Generer</button>'
    + '<div class="out" id="qr"></div></div>'
    + '<div class="card"><h3 style="margin-bottom:12px">Fonctionnalites</h3>'
    + '<div class="g2">'
    + '<a href="/page-builder?shop=' + shop + '" style="display:block;padding:16px;background:#ede9fe;border-radius:10px;text-align:center;color:#4338ca;font-weight:500;font-size:14px;text-decoration:none">Page Builder</a>'
    + '<a href="/descriptions?shop=' + shop + '" style="display:block;padding:16px;background:#d1fae5;border-radius:10px;text-align:center;color:#065f46;font-weight:500;font-size:14px;text-decoration:none">Descriptions</a>'
    + '<a href="/analyse?shop=' + shop + '" style="display:block;padding:16px;background:#fef3c7;border-radius:10px;text-align:center;color:#92400e;font-weight:500;font-size:14px;text-decoration:none">Analyse</a>'
    + '<a href="/emails?shop=' + shop + '" style="display:block;padding:16px;background:#e0f2fe;border-radius:10px;text-align:center;color:#0369a1;font-weight:500;font-size:14px;text-decoration:none">Emails</a>'
    + '<a href="/seo?shop=' + shop + '" style="display:block;padding:16px;background:#f3e8ff;border-radius:10px;text-align:center;color:#7e22ce;font-weight:500;font-size:14px;text-decoration:none">SEO</a>'
    + '</div></div>';
  res.send(page('Accueil', content, shop));
});

app.get('/page-builder', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">Page Builder IA</p><p class="psub">Creez des pages completes en quelques secondes</p>'
    + '<div class="card">'
    + '<div class="tip">Decrivez votre page et obtenez le contenu pret a coller dans Shopify.</div>'
    + '<div class="g2">'
    + '<div><label>Titre de la page</label><input type="text" id="pt" placeholder="Ex: Accueil cuisine coreenne"></div>'
    + '<div><label>Type</label><select id="ptype"><option>Page d accueil</option><option>Page produit</option><option>A propos</option><option>Landing page promo</option></select></div>'
    + '</div>'
    + '<label>Description / theme</label>'
    + '<textarea id="pd" placeholder="Ex: Boutique de produits coreens, ambiance authentique..."></textarea>'
    + '<button class="btn" id="pb" data-lbl="Generer la page" onclick="gen(\'pb\',\'pr\',\'page\',\'pt\')">Generer la page</button>'
    + '<div class="out" id="pr"></div>'
    + '</div>';
  res.send(page('Page Builder', content, shop));
});

app.get('/descriptions', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">Descriptions produits</p><p class="psub">Descriptions optimisees SEO en un clic</p>'
    + '<div class="card">'
    + '<div class="g2">'
    + '<div><label>Nom du produit</label><input type="text" id="dn" placeholder="Ex: Ramens epices maison"></div>'
    + '<div><label>Categorie</label><select><option>Alimentation</option><option>Boissons</option><option>Epices</option><option>Snacks</option></select></div>'
    + '</div>'
    + '<label>Caracteristiques</label>'
    + '<textarea placeholder="Ex: Bio, sans gluten, fabrique en Coree..."></textarea>'
    + '<button class="btn" id="db" data-lbl="Generer la description" onclick="gen(\'db\',\'dr\',\'desc\',\'dn\')">Generer la description</button>'
    + '<div class="out" id="dr"></div>'
    + '</div>';
  res.send(page('Descriptions', content, shop));
});

app.get('/analyse', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">Analyse de boutique</p><p class="psub">Performances et recommandations personnalisees</p>'
    + '<div class="card">'
    + '<h3 style="margin-bottom:12px">Analyse globale de ' + shop + '</h3>'
    + '<button class="btn" id="ab" data-lbl="Lancer l analyse" onclick="gen(\'ab\',\'ar\',\'analyse\')">Lancer l analyse</button>'
    + '<div class="out" id="ar"></div>'
    + '</div>'
    + '<div class="card">'
    + '<h3 style="margin-bottom:12px">Analyser une page</h3>'
    + '<div class="row"><input type="text" id="au" placeholder="Ex: /collections/ramen"><button class="btn" id="ab2" data-lbl="Analyser" onclick="gen(\'ab2\',\'ar2\',\'analyse\',\'au\')">Analyser</button></div>'
    + '<div class="out" id="ar2"></div>'
    + '</div>';
  res.send(page('Analyse', content, shop));
});

app.get('/emails', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">Emails marketing</p><p class="psub">Emails percutants pour vos clients</p>'
    + '<div class="card">'
    + '<div class="g2">'
    + '<div><label>Type d email</label><select><option>Newsletter mensuelle</option><option>Promotion / Soldes</option><option>Bienvenue</option><option>Panier abandonne</option></select></div>'
    + '<div><label>Sujet / Offre</label><input type="text" id="es" placeholder="Ex: -20% sur les ramens"></div>'
    + '</div>'
    + '<label>Message cle</label>'
    + '<textarea placeholder="Ex: Profitez de la fete de Chuseok..."></textarea>'
    + '<button class="btn" id="eb" data-lbl="Generer l email" onclick="gen(\'eb\',\'er\',\'email\',\'es\')">Generer l email</button>'
    + '<div class="out" id="er"></div>'
    + '</div>';
  res.send(page('Emails', content, shop));
});

app.get('/seo', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var content = '<p class="ptitle">SEO automatique</p><p class="psub">Optimisez votre referencement Google</p>'
    + '<div class="card">'
    + '<label>Page a analyser</label>'
    + '<div class="row"><input type="text" id="su" placeholder="Ex: Page d accueil"><button class="btn" id="sb" data-lbl="Analyser" onclick="gen(\'sb\',\'sr\',\'seo\',\'su\')">Analyser</button></div>'
    + '<div class="out" id="sr"></div>'
    + '</div>'
    + '<div class="card"><h3 style="margin-bottom:10px">Mots-cles suggeres</h3>'
    + '<div style="display:flex;gap:8px;flex-wrap:wrap">'
    + '<span style="background:#ede9fe;color:#6366f1;padding:4px 12px;border-radius:12px;font-size:13px">epicerie coreenne</span>'
    + '<span style="background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:12px;font-size:13px">produits coreens</span>'
    + '<span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:12px;font-size:13px">ramens coreens</span>'
    + '<span style="background:#e0f2fe;color:#0369a1;padding:4px 12px;border-radius:12px;font-size:13px">kimchi maison</span>'
    + '</div></div>';
  res.send(page('SEO', content, shop));
});

app.listen(PORT, function() { console.log('ia store port ' + PORT); });

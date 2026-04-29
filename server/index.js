var express = require('express');
var cors = require('cors');
var app = express();
var PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function html(title, body, shop) {
  shop = shop || 'boutique';
  var nav = '<nav style="background:#fff;border-bottom:1px solid #e1e3e5;padding:0 24px;display:flex;gap:4px">';
  nav += '<a href="/?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">Accueil</a>';
  nav += '<a href="/page-builder?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">Page Builder</a>';
  nav += '<a href="/descriptions?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">Descriptions</a>';
  nav += '<a href="/analyse?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">Analyse</a>';
  nav += '<a href="/emails?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">Emails</a>';
  nav += '<a href="/seo?shop=' + shop + '" style="padding:10px 16px;text-decoration:none;color:#6d7175;font-size:14px">SEO</a>';
  nav += '</nav>';
  var s = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">';
  s += '<meta name="viewport" content="width=device-width,initial-scale=1">';
  s += '<title>' + title + ' - ia store</title>';
  s += '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#f6f6f7;color:#202223}</style>';
  s += '</head><body>';
  s += '<div style="background:#fff;border-bottom:1px solid #e1e3e5;padding:14px 24px;display:flex;align-items:center;gap:12px">';
  s += '<div style="width:32px;height:32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:16px">&#10022;</div>';
  s += '<h1 style="font-size:18px;font-weight:600">ia store</h1>';
  s += '<span style="background:#e3f5e3;color:#1a7f37;padding:2px 8px;border-radius:12px;font-size:12px">Actif</span>';
  s += '</div>' + nav;
  s += '<div style="max-width:960px;margin:0 auto;padding:28px 24px">' + body + '</div>';
  s += '<script>function gen(btnId,resId,txt){';
  s += 'var b=document.getElementById(btnId);';
  s += 'var r=document.getElementById(resId);';
  s += 'b.disabled=true;r.style.display="block";r.innerHTML="Generation en cours...";';
  s += 'setTimeout(function(){r.innerHTML=txt;b.disabled=false;},1800);}';
  s += '<\/script></body></html>';
  return s;
}

app.get('/health', function(req, res) { res.json({ status: 'ok' }); });

app.get('/', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Tableau de bord</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Boutique : <strong>' + shop + '</strong></p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5;margin-bottom:20px">';
  body += '<h3 style="font-size:16px;font-weight:600;margin-bottom:14px">Generation rapide</h3>';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Decrivez votre besoin</label>';
  body += '<input id="qi" type="text" placeholder="Ex: description pour mes ramens..." style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px">';
  body += '<button onclick="gen(\'qb\',\'qr\',\'<b>Contenu genere !</b><br><br>Votre demande a ete traitee. Connectez une cle API pour du contenu personnalise.\')";id="qb" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Generer</button>';
  body += '<div id="qr" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5">';
  body += '<h3 style="font-size:16px;font-weight:600;margin-bottom:16px">Fonctionnalites</h3>';
  body += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">';
  body += '<a href="/page-builder?shop=' + shop + '" style="display:block;padding:16px;background:#ede9fe;border-radius:10px;text-align:center;color:#4338ca;font-weight:500;font-size:14px;text-decoration:none">Page Builder</a>';
  body += '<a href="/descriptions?shop=' + shop + '" style="display:block;padding:16px;background:#d1fae5;border-radius:10px;text-align:center;color:#065f46;font-weight:500;font-size:14px;text-decoration:none">Descriptions</a>';
  body += '<a href="/analyse?shop=' + shop + '" style="display:block;padding:16px;background:#fef3c7;border-radius:10px;text-align:center;color:#92400e;font-weight:500;font-size:14px;text-decoration:none">Analyse</a>';
  body += '<a href="/emails?shop=' + shop + '" style="display:block;padding:16px;background:#e0f2fe;border-radius:10px;text-align:center;color:#0369a1;font-weight:500;font-size:14px;text-decoration:none">Emails</a>';
  body += '<a href="/seo?shop=' + shop + '" style="display:block;padding:16px;background:#f3e8ff;border-radius:10px;text-align:center;color:#7e22ce;font-weight:500;font-size:14px;text-decoration:none">SEO</a>';
  body += '</div></div>';
  res.send(html('Accueil', body, shop));
});

app.get('/page-builder', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var r1 = '<b>Page generee !</b><br><br>Hero avec accroche, grille produits 3 colonnes, temoignages clients, CTA commander maintenant. <em>Connectez une cle API pour du contenu personnalise.</em>';
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Page Builder IA</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Creez des pages completes en quelques secondes</p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5">';
  body += '<div style="background:#ede9fe;color:#4338ca;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:14px">Decrivez votre page et obtenez le contenu pret a coller dans Shopify.</div>';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Titre de la page</label>';
  body += '<input id="pt" type="text" placeholder="Ex: Accueil cuisine coreenne" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Description / theme</label>';
  body += '<textarea id="pd" placeholder="Ex: Boutique de produits coreens authentiques..." style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;resize:vertical;min-height:80px;font-family:inherit;margin-bottom:12px"></textarea>';
  body += '<button onclick="gen(\'pb\',\'pr\',\'' + r1 + '\')";id="pb" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Generer la page</button>';
  body += '<div id="pr" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  res.send(html('Page Builder', body, shop));
});

app.get('/descriptions', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var r1 = '<b>Description generee !</b><br><br>Decouvrez ce produit unique alliant qualite et authenticite. Fabrique avec soin, il offre une experience incomparable. Ideal pour les amateurs exigeants. <em>Connectez une cle API pour des descriptions 100% uniques.</em>';
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Descriptions produits</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Descriptions optimisees SEO en un clic</p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Nom du produit</label>';
  body += '<input id="dn" type="text" placeholder="Ex: Ramens epices maison" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Caracteristiques</label>';
  body += '<textarea id="df" placeholder="Ex: Bio, sans gluten, fabrique en Coree..." style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;resize:vertical;min-height:80px;font-family:inherit;margin-bottom:12px"></textarea>';
  body += '<button onclick="gen(\'db\',\'dr\',\'' + r1 + '\')";id="db" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Generer la description</button>';
  body += '<div id="dr" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  res.send(html('Descriptions', body, shop));
});

app.get('/analyse', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var r1 = '<b>Score boutique : 72/100</b><br><br>Points forts : Navigation claire, Gamme coherente.<br>A ameliorer : Temoignages (+15pts), Images mobile (+8pts), Meta SEO (+5pts).';
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Analyse de boutique</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Performances et recommandations personnalisees</p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5;margin-bottom:20px">';
  body += '<h3 style="font-size:16px;font-weight:600;margin-bottom:14px">Analyse globale</h3>';
  body += '<button onclick="gen(\'ab\',\'ar\',\'' + r1 + '\')";id="ab" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Lancer l analyse</button>';
  body += '<div id="ar" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  res.send(html('Analyse', body, shop));
});

app.get('/emails', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var r1 = '<b>Email genere !</b><br><br>Objet : Offre exclusive !<br><br>Bonjour [Prenom],<br>Decouvrez nos derniers produits selectionnes avec soin.<br>Profitez de -10% avec le code : IA10<br><br>L equipe ' + shop;
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">Emails marketing</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Emails percutants pour vos clients</p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Sujet / Offre</label>';
  body += '<input id="es" type="text" placeholder="Ex: -20% sur les ramens" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Message cle</label>';
  body += '<textarea placeholder="Ex: Fete de Chuseok..." style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;resize:vertical;min-height:80px;font-family:inherit;margin-bottom:12px"></textarea>';
  body += '<button onclick="gen(\'eb\',\'er\',\'' + r1 + '\')";id="eb" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Generer l email</button>';
  body += '<div id="er" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  res.send(html('Emails', body, shop));
});

app.get('/seo', function(req, res) {
  var shop = req.query.shop || 'votre-boutique';
  var r1 = '<b>Score SEO : 65/100</b><br><br>Problemes : Meta description manquante, Titre H1 trop court.<br>OK : URL propre, HTTPS actif.<br><br>Meta suggestion : Decouvrez nos produits coreens - qualite premium, livraison rapide.';
  var body = '<h2 style="font-size:22px;font-weight:700;margin-bottom:6px">SEO automatique</h2>';
  body += '<p style="color:#6d7175;font-size:14px;margin-bottom:24px">Optimisez votre referencement Google</p>';
  body += '<div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e1e3e5;margin-bottom:20px">';
  body += '<label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px">Page a analyser</label>';
  body += '<input id="su" type="text" placeholder="Ex: Page d accueil" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;margin-bottom:12px">';
  body += '<button onclick="gen(\'sb\',\'sr\',\'' + r1 + '\')";id="sb" style="padding:10px 20px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">Analyser</button>';
  body += '<div id="sr" style="display:none;margin-top:14px;padding:14px;background:#f8f9fa;border-radius:8px;font-size:14px;border-left:3px solid #6366f1"></div>';
  body += '</div>';
  res.send(html('SEO', body, shop));
});

app.listen(PORT, function() { console.log('ia store port ' + PORT); });

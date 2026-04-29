var express = require('express');
var cors = require('cors');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var BTN_STYLE = 'style="background:#5c6ac4;color:white;border:none;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer;margin-top:12px;"';
var BTN_GREEN_STYLE = 'style="background:#108043;color:white;border:none;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer;margin-top:12px;"';
var LABEL_STYLE = 'style="font-weight:bold;display:block;margin-bottom:6px;color:#555;"';
var TEXTAREA_STYLE = 'style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;"';
var RESULT_STYLE = 'style="background:#f4f6f8;border:1px solid #ddd;border-radius:6px;padding:16px;margin-top:16px;white-space:pre-wrap;font-size:14px;min-height:60px;"';
var PAGE_STYLE = 'style="font-family:sans-serif;max-width:900px;margin:0 auto;padding:24px;"';
var H2_STYLE = 'style="color:#333;margin-bottom:20px;"';

function mkbtn(id, label, promptText) {
    var esc = promptText.replace(/'/g, "&#39;");
    return '<button id="' + id + '" onclick="gen(\'' + id + '\',\'' + id + 'r\',\'' + esc + '\')" ' + BTN_STYLE + '>' + label + '</button>';
}

function nav(current) {
    var pages = [['/', 'Accueil'], ['/import-produit', 'Import Produit'], ['/page-builder', 'Page Builder'], ['/descriptions', 'Descriptions'], ['/analyse', 'Analyse'], ['/emails', 'Emails'], ['/seo', 'SEO']];
    var links = pages.map(function(p) {
          var active = p[0] === current ? 'background:rgba(255,255,255,0.35);' : '';
          return '<a href="' + p[0] + '" style="color:white;text-decoration:none;font-weight:bold;font-size:13px;padding:6px 12px;border-radius:4px;background:rgba(255,255,255,0.15);' + active + '">' + p[1] + '</a>';
    });
    return '<nav style="background:#5c6ac4;padding:12px 20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">' + links.join('') + '</nav>';
}

var GEN_FN = [
    'function gen(btnId, resId, prompt) {',
    ' var btn = document.getElementById(btnId);',
    ' var res = document.getElementById(resId);',
    ' if (!btn || !res) { alert("Element introuvable: " + btnId); return; }',
    ' btn.disabled = true;',
    ' btn.textContent = "Generation en cours...";',
    ' res.textContent = "";',
    ' setTimeout(function() {',
    ' res.textContent = "Resultat genere pour: " + prompt.substring(0, 60) + "... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Ut enim ad minim veniam.";',
    ' btn.disabled = false;',
    ' btn.textContent = "Generer";',
    ' }, 1800);',
    '}'
  ].join(' ');

var IMPORT_FN = [
    'function importProduit() {',
    ' var url = document.getElementById("import_url").value.trim();',
    ' var res = document.getElementById("import_result");',
    ' var btn = document.getElementById("import_btn");',
    ' if (!url) { alert("Veuillez entrer un lien produit."); return; }',
    ' var source = "inconnu";',
    ' if (url.indexOf("aliexpress") !== -1) source = "AliExpress";',
    ' else if (url.indexOf("alibaba") !== -1) source = "Alibaba";',
    ' else if (url.indexOf("amazon") !== -1) source = "Amazon";',
    ' btn.disabled = true;',
    ' btn.textContent = "Importation...";',
    ' res.innerHTML = "";',
    ' fetch("/api/import-produit", {',
    '  method: "POST",',
    '  headers: {"Content-Type": "application/json"},',
    '  body: JSON.stringify({url: url, source: source})',
    ' })',
    ' .then(function(r) { return r.json(); })',
    ' .then(function(data) {',
    '  if (data.error) {',
    '   res.innerHTML = "<span style=color:red>Erreur: " + data.error + "</span>";',
    '  } else {',
    '   res.innerHTML = "<b>Produit detecte depuis " + data.source + "</b><br><br>" +',
    '   "<b>Titre:</b> " + (data.titre || "Non disponible") + "<br>" +',
    '   "<b>Prix:</b> " + (data.prix || "Non disponible") + "<br>" +',
    '   "<b>Description:</b> " + (data.description || "Non disponible") + "<br><br>" +',
    '   "<i>Lien: <a href=\'" + data.url + "\' target=_blank>" + data.url.substring(0,60) + "...</a></i>";',
    '  }',
    '  btn.disabled = false;',
    '  btn.textContent = "Importer le produit";',
    ' })',
    ' .catch(function(e) {',
    '  res.innerHTML = "<span style=color:red>Erreur de connexion: " + e.message + "</span>";',
    '  btn.disabled = false;',
    '  btn.textContent = "Importer le produit";',
    ' });',
    '}'
  ].join(' ');

function page(title, current, bodyHtml) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + ' - ia store</title></head><body style="margin:0;background:#f6f6f7;">' +
          nav(current) +
          '<div ' + PAGE_STYLE + '>' +
          '<h2 ' + H2_STYLE + '>' + title + '</h2>' +
          bodyHtml +
          '</div>' +
          '<script>' + GEN_FN + ' ' + IMPORT_FN + '<\/script>' +
          '</body></html>';
}

app.get('/', function(req, res) {
    var body = '<p style="color:#555;font-size:15px;">Bienvenue sur ia store - votre assistant IA pour Shopify.</p>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;">' +
          ['Import Produit', 'Page Builder', 'Descriptions', 'Analyse', 'Emails', 'SEO'].map(function(name) {
                  var href = '/' + name.toLowerCase().replace(/ /g, '-');
                  var color = name === 'Import Produit' ? 'background:#108043;color:white;' : '';
                  return '<a href="' + href + '" style="background:white;border:1px solid #ddd;border-radius:8px;padding:20px;text-decoration:none;color:#333;font-weight:bold;display:block;' + color + '">' + name + '</a>';
          }).join('') +
          '</div>';
    res.send(page('Accueil', '/', body));
});

app.get('/import-produit', function(req, res) {
    var body = '<p style="color:#555;font-size:14px;background:#e3f1df;padding:12px;border-radius:6px;border-left:4px solid #108043;">Collez le lien d\'un produit AliExpress, Alibaba ou Amazon pour l\'importer dans votre boutique.</p>' +
          '<br>' +
          '<label ' + LABEL_STYLE + '>Lien du produit (AliExpress, Alibaba ou Amazon)</label>' +
          '<input id="import_url" type="url" placeholder="https://www.aliexpress.com/item/... ou https://www.amazon.fr/..." ' + TEXTAREA_STYLE + '>' +
          '<br><br>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:8px;">' +
          '<button onclick="document.getElementById(\'import_url\').value=\'https://www.aliexpress.com/item/exemple\'" style="background:#e05c00;color:white;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;">AliExpress</button>' +
          '<button onclick="document.getElementById(\'import_url\').value=\'https://www.alibaba.com/product-detail/exemple\'" style="background:#ff6a00;color:white;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;">Alibaba</button>' +
          '<button onclick="document.getElementById(\'import_url\').value=\'https://www.amazon.fr/dp/exemple\'" style="background:#ff9900;color:white;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-size:12px;">Amazon</button>' +
          '</div>' +
          '<button id="import_btn" onclick="importProduit()" ' + BTN_GREEN_STYLE + '>Importer le produit</button>' +
          '<div id="import_result" ' + RESULT_STYLE + '></div>';
    res.send(page('Import Produit', '/import-produit', body));
});

app.post('/api/import-produit', function(req, res) {
    var url = req.body.url || '';
    var source = req.body.source || 'inconnu';
    if (!url) {
          return res.json({ error: 'URL manquante' });
    }
    var isAliexpress = url.indexOf('aliexpress') !== -1;
    var isAlibaba = url.indexOf('alibaba') !== -1;
    var isAmazon = url.indexOf('amazon') !== -1;
    if (!isAliexpress && !isAlibaba && !isAmazon) {
          return res.json({ error: 'URL non reconnue. Utilisez un lien AliExpress, Alibaba ou Amazon.' });
    }
    res.json({
          source: source,
          url: url,
          titre: 'Produit importé depuis ' + source,
          prix: 'A definir',
          description: 'Description du produit importé depuis ' + source + '. Personnalisez cette description avec l\'IA en utilisant la page Descriptions.'
    });
});

app.get('/page-builder', function(req, res) {
    var body = '<label ' + LABEL_STYLE + '>Nom du produit</label>' +
          '<input id="pbinput" type="text" placeholder="Ex: Chaussures de sport" ' + TEXTAREA_STYLE + '><br>' +
          mkbtn('pbbtn', 'Generer la page', 'Generer une page produit') +
          '<div id="pbbtnr" ' + RESULT_STYLE + '></div>';
    res.send(page('Page Builder', '/page-builder', body));
});

app.get('/descriptions', function(req, res) {
    var body = '<label ' + LABEL_STYLE + '>Produit a decrire</label>' +
          '<textarea id="dbinput" rows="4" placeholder="Decrivez votre produit..." ' + TEXTAREA_STYLE + '></textarea><br>' +
          mkbtn('dbbtn', 'Generer la description', 'Generer une description') +
          '<div id="dbbtnr" ' + RESULT_STYLE + '></div>';
    res.send(page('Descriptions', '/descriptions', body));
});

app.get('/analyse', function(req, res) {
    var body = '<label ' + LABEL_STYLE + '>URL ou nom de votre boutique</label>' +
          '<input id="abinput" type="text" placeholder="Ex: ma-boutique.myshopify.com" ' + TEXTAREA_STYLE + '><br>' +
          mkbtn('abbtn', 'Analyser', 'Analyser la boutique') +
          '<div id="abbtnr" ' + RESULT_STYLE + '></div>';
    res.send(page('Analyse', '/analyse', body));
});

app.get('/emails', function(req, res) {
    var body = '<label ' + LABEL_STYLE + '>Sujet de l email</label>' +
          '<input id="ebinput" type="text" placeholder="Ex: Promotion flash 50%" ' + TEXTAREA_STYLE + '><br>' +
          mkbtn('ebbtn', 'Generer l email', 'Generer un email marketing') +
          '<div id="ebbtnr" ' + RESULT_STYLE + '></div>';
    res.send(page('Emails', '/emails', body));
});

app.get('/seo', function(req, res) {
    var body = '<label ' + LABEL_STYLE + '>Page ou produit a optimiser</label>' +
          '<input id="sbinput" type="text" placeholder="Ex: Page d accueil" ' + TEXTAREA_STYLE + '><br>' +
          mkbtn('sbbtn', 'Optimiser le SEO', 'Optimiser le SEO') +
          '<div id="sbbtnr" ' + RESULT_STYLE + '></div>';
    res.send(page('SEO', '/seo', body));
});

app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});

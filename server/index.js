var express = require('express');
var cors = require('cors');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var BTN_STYLE = 'style="background:#5c6ac4;color:white;border:none;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer;margin-top:12px;"';
var LABEL_STYLE = 'style="font-weight:bold;display:block;margin-bottom:6px;color:#555;"';
var TEXTAREA_STYLE = 'style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;"';
var RESULT_STYLE = 'style="background:#f4f6f8;border:1px solid #ddd;border-radius:6px;padding:16px;margin-top:16px;white-space:pre-wrap;font-size:14px;min-height:60px;"';
var PAGE_STYLE = 'style="font-family:sans-serif;max-width:800px;margin:0 auto;padding:24px;"';
var H2_STYLE = 'style="color:#333;margin-bottom:20px;"';

function mkbtn(id, label, promptText) {
  var esc = promptText.replace(/'/g, "&#39;");
  return '<button id="' + id + '" onclick="gen(\'' + id + '\',\'' + id + 'r\',\'' + esc + '\')" ' + BTN_STYLE + '>' + label + '</button>';
}

function nav(current) {
  var pages = [['/', 'Accueil'], ['/page-builder', 'Page Builder'], ['/descriptions', 'Descriptions'], ['/analyse', 'Analyse'], ['/emails', 'Emails'], ['/seo', 'SEO']];
  var links = pages.map(function(p) {
    var active = p[0] === current ? 'background:rgba(255,255,255,0.35);' : '';
    return '<a href="' + p[0] + '" style="color:white;text-decoration:none;font-weight:bold;font-size:14px;padding:6px 14px;border-radius:4px;background:rgba(255,255,255,0.15);' + active + '">' + p[1] + '</a>';
  });
  return '<nav style="background:#5c6ac4;padding:12px 20px;display:flex;gap:16px;align-items:center;">' + links.join('') + '</nav>';
}

var GEN_FN = [
  'function gen(btnId, resId, prompt) {',
  '  var btn = document.getElementById(btnId);',
  '  var res = document.getElementById(resId);',
  '  if (!btn || !res) { alert("Element introuvable: " + btnId); return; }',
  '  btn.disabled = true;',
  '  btn.textContent = "Generation en cours...";',
  '  res.textContent = "";',
  '  setTimeout(function() {',
  '    res.textContent = "Resultat genere pour: " + prompt.substring(0, 60) + "... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Ut enim ad minim veniam.";',
  '    btn.disabled = false;',
  '    btn.textContent = "Generer";',
  '  }, 1800);',
  '}'
].join(' ');

function page(title, current, bodyHtml) {
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + ' - ia store</title></head><body style="margin:0;background:#f6f6f7;">' +
    nav(current) +
    '<div ' + PAGE_STYLE + '>' +
    '<h2 ' + H2_STYLE + '>' + title + '</h2>' +
    bodyHtml +
    '</div>' +
    '<script>' + GEN_FN + '<\/script>' +
    '</body></html>';
}

app.get('/', function(req, res) {
  var body = '<p style="color:#555;font-size:15px;">Bienvenue sur ia store - votre assistant IA pour Shopify.</p>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;">' +
    ['Page Builder', 'Descriptions', 'Analyse', 'Emails', 'SEO'].map(function(name) {
      var href = '/' + name.toLowerCase().replace(' ', '-');
      return '<a href="' + href + '" style="background:white;border:1px solid #ddd;border-radius:8px;padding:20px;text-decoration:none;color:#333;font-weight:bold;display:block;">' + name + '</a>';
    }).join('') +
    '</div>';
  res.send(page('Accueil', '/', body));
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

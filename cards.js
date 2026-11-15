const CARDS={
"mario_t":{"name":"Mario","type":"trans","pv":20,"fam":["Royaume Champignon","Héros","Frère Mario"],"img":"001_Mario.png","text":"Victoire : PV adverses à 0 ou 5 Lieux conquis."},
"mario":{"name":"Mario","type":"perso","cost":6,"power":5,"fam":["Royaume Champignon","Héros","Frère Mario"],"img":"002_Mario.png","fx":{"equipTop":3}},
"luigi":{"name":"Luigi","type":"perso","cost":3,"power":4,"fam":["Royaume Champignon","Frère Mario"],"img":"005_Luigi.png","fx":{"draw":1}},
"peach":{"name":"Peach","type":"perso","cost":1,"power":2,"fam":["Royaume Champignon","Princesse"],"img":"006_Peach.png"},
"yoshi":{"name":"Yoshi","type":"perso","cost":2,"power":3,"fam":["Royaume Champignon","Yoshi"],"img":"010_Yoshi.png","fx":{"moveBase":1}},
"toad":{"name":"Toad","type":"perso","cost":1,"power":1,"fam":["Royaume Champignon"],"img":"011_Toad.png","fx":{"search":{"n":4,"not":"toad"}}},
"lien":{"name":"Lien Fraternel","type":"action","cost":1,"fam":["Royaume Champignon","Frère Mario"],"img":"012_lien_fraternelle.png","fx":{"search":{"n":3,"not":"lien"}}},
"frappe":{"name":"Frappe Fraternel","type":"action","react":4,"cost":3,"fam":["Royaume Champignon","Frère Mario"],"img":"013_frappe_fraternelle.png"},
"champi":{"name":"Super Champignon","type":"equip","cost":1,"power":2,"fam":["Royaume Champignon"],"img":"014_SuperChampi.png"},
"fleur":{"name":"Fleur de Feu","type":"equip","cost":3,"power":3,"eqCost":"discard","fam":["Royaume Champignon"],"img":"007_fireflower.png"},
"etoileR":{"name":"Étoile Rouge","type":"equip","cost":5,"moveTapped":1,"fam":["Espace"],"img":"016_Etoilerouge.png"},
"superE":{"name":"Super Étoile","type":"equip","cost":6,"power":3,"untap":1,"eqCost":"discard","fam":["Royaume Champignon"],"img":"004_SuperEtoile.png"},
"chateau":{"name":"Château de Peach","type":"lieu","cost":1,"fam":["Royaume Champignon"],"img":"003_ChateauDePeach.png","conq":{"turns":4},"draw":1},
"galaxy":{"name":"Galaxy","type":"lieu","cost":2,"fam":["Espace"],"img":"009_galaxy.png","conq":{"turns":5},"draw":2,"start":"galaxy"},
"ile":{"name":"Île des Yoshi","type":"lieu","cost":4,"fam":["Île des Yoshi"],"img":"015_Ile_Yoshi.png","conq":{"units":5},"draw":3}
}
;

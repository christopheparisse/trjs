/**
 * @module {aidecontextuelle}
 * @author Christophe Parisse
 * last change: 17/11/2017
 */

trjs.aide_fra = [];
trjs.aide_eng = [];

trjs.aide_fra["op-trs"] = "<b>Partie gauche :</b><br/>"
	+ "Vous pouvez naviguer dans votre arborescence de fichiers : <br/>"
	+ "Ouvrez un dossier par un double-clic, l'intégralité du contenu du répertoire ouvert s'affiche dans la partie droite de la fenêtre.<br/><br/>"
	+ "<b>Partie droite :</b><br/>" 
	+ "Sélectionnez un fichier :<ul><li>en double-cliquant sur celui-ci,</li><li>en appuyant sur la touche ENTREE,</li>" 
	+ "<li>ou en cliquant sur <b>Choisir un fichier</b></li></ul><br/>"
	+ "Plusieurs <b>options d'affichage</b> s'offrent à vous en bas de la fenêtre :<br/>"
	+ "Vous pouvez demandez l'affichage de tous les fichiers ou sélectionner (par défaut) seulement les fichiers de transcription." ;

trjs.aide_fra["choose-media"] = "<b>Partie gauche :</b><br/>"
	+ "Vous pouvez naviguer dans votre arborescence de fichiers: <br/>"
	+ "Ouvrez un dossier par un double-clic, l'intégralité du contenu du répertoire ouvert s'affiche dans la partie droite de la fenêtre.<br/><br/>"
	+ "<b>Partie droite :</b><br/>" 
	+ "Sélectionnez un fichier :<ul><li>en double-cliquant sur celui-ci,</li><li>en appuyant sur la touche Entrée,</li>" 
	+ "<li>ou en cliquant sur <b>Choisir un fichier</b></li></ul><br/>"
	+ "Plusieurs <b>options d'affichage</b> s'offrent à vous en bas de la fenêtre :<br/>"
	+ "Vous pouvez demandez l'affichage de tous les fichiers ou sélectionner (par défaut) seulement les fichiers média.<br/><br/>"
	+ "Concernant la <b>qualité du fichier média</b> que vous vous appretez à ouvrir, vous pouvez sélectionner une qualité automatique (par défaut) ou préciser la qualité que vous désirez." ;

trjs.aide_fra["new-trs"] = "Vous pouvez commencer ou éditer votre transcription.<br/>"
	+ "Le tableau de trancription est divisé en 4 :"
	+ "<ol><li><b>Locuteur</b>"
	+ " - <i>renseigne l'identifiant du locuteur ou de la structure (dépendante)</i></li>"
	+ "	<ul><li>Chaque nouveau locuteur doit être renseigné dans le tableau des participants</li>"
	+ "		<li>Chaque nouvelle valeur de structure doit être renseignée dans le tableau des structures</li>"
	+ "		<li>Les structures supplémentaires s’imbriquent sous le locuteur (ligne principale par défaut)</li>"
	+ "	</ul><li><b>Début</b>"
	+ " - <i>le temps de début</i> et </li>"
	+ "	<li><b>Fin</b>"
	+ " - <i>le temps de fin</i></li>"
	+ "	<ul><li>Un clic permet d'obtenir le temps en millisec.</li>"
	+ "		<li>L'affichage du nombre et du format pour les millisec. est modifiable dans le menu Paramètres.</li>"
	+ "	</ul><b><li>Transcription</b>"
	+ " - <i>la partie texte éditable</i></li>"
	+ "	<ul><li>Les nuances de gris sur les lignes correspondent aux locuteurs : plus le gris est foncé, plus la fréquence du temps de parole du locuteur est élevée.</li>"
	+ "		<li>La ligne sélectionnée est surlignée en bleu (en bleu clair pour une ligne dépendante)</li></ul></ol>" ;

trjs.aide_fra["transcribe"] = trjs.messgs_fra.transcribe;

trjs.aide_fra["op-metadata"] = "Remplissez les <b>métadonnées</b> liées au fichier.<br/><br/>"
	+ "Seules les <b>parties grisées</b> sont <b>éditables</b> :<br/>"
	+ "Vous pouvez ici renommer le fichier de transcription, et renseigner les métadonnées décrites selon le format <a href=\"http://www.bnf.fr/fr/professionnels/formats_catalogage/a.f_dublin_core.html\">Dublin Core</a>.<br/>"
	+ "Pour obtenir des informations supplémentaires, passez votre souris sur la partie Information située à droite du tableau, une infobulle apparaît." ;

trjs.aide_fra["op-part"] = "Enregistrez les noms des <b>locuteurs</b>, ainsi que les informations les concernant.<br/>"
	+ "Seules les <b>parties grisées</b> sont <b>éditables</b>.<br/><br/>"
	+ "Une fois les participants renseignés, vous pouvez vous y référer de la manière suivante :"
	+ "<ul><li>soit par un <b>raccourci clavier</b> :</li></ul>"
	+ "<table border='1px'>"
	+ "<thead><tr><th>Raccourcis clavier</th><th>Codage direct du locuteur</th></tr></thead>"
	+ "<tbody><tr><td>Ctrl + 1</td><td>Premier locuteur</td></tr>"
	+ "<tr><td>Ctrl + 2</td><td>Deuxième locuteur</td></tr>"
	+ "<tr><td>...</td><td>...</td></tr>"
	+ "<tr><td>Ctrl + 9</td><td>Neuvième locuteur</td></tr>"
	+ "</tbody></table><br/>"
	+ "<ul><li>soit par un <b>clic droit</b> à l'emplacement du champ locuteur dans la transcription</li></ul>" ;

trjs.aide_fra["op-struc"] = "Définissez les <b>types de structures</b>, c'est-à-dire le champ qui décrit le type d'un énoncé.<br/>"
	+ "Seules les <b>parties grisées</b> sont <b>éditables</b>.<br/><br/>"
	+ "Une fois les structures renseignées, vous pouvez vous y référer de la manière suivante :"
	+ "<ul><li>soit par un <b>raccourci clavier</b> :</li></ul>"
	+ "<table border='1px'>"
	+ "<thead><tr><th>Raccourcis clavier</th><th>Codage direct de la structure (champ décrivant un énoncé)</th></tr></thead>"
	+ "<tbody><tr><td>Ctrl + Alt + 1</td><td>Première propriété des structures (tiers secondaires)</td></tr>"
	+ "<tr><td>Ctrl + Alt + 2</td><td>Deuxième propriété</td></tr>"
	+ "<tr><td>...</td><td>...</td></tr>"
	+ "<tr><td>Ctrl + Alt + 9</td><td>Neuvième propriété</td></tr>"
	+ "</tbody></table><br/>"
	+ "<ul><li>soit par un <b>clic droit</b> à l'emplacement du champ locuteur dans la transcription</li></ul>" ;

trjs.aide_fra["boutons-media"] = "Les transcriptions de base se font à l'aide des commandes suivantes:<br/>"
	+ "<table border='1px'>"
	+ "<thead><tr><th>Icône</th><th>Raccourci clavier</th><th>Fonctionnalité</th></tr></thead>"
	+ "<tbody><tr><td><i class='iconcur fa fa-play-circle fa-lg'></i></td><td>TAB</td><td><b>Lecture</b> simple, <b>pause</b></td></tr>"
	+ "<tr><td><i class='iconcur fa fa-level-up fa-lg'></i></td><td>RETURN</td><td><b>Marquage du temps, passage à la ligne suivante</b>.</td></tr>"
	+ "<tr><td><i class='iconcur fa fa-edit fa-lg'></i></td><td>F6</td><td>Insertion d'une <b>ligne vide</b></td></tr>"
	+ "<tr><td><i class='iconcur fa fa-arrow-up fa-lg'></i></td><td>F4</td><td>Marquage du <b>temps de début</b></td></tr>"
	+ "<tr><td><i class='iconcur fa fa-arrow-down fa-lg'></i></td><td>F5</td><td>Marquage du <b>temps de fin</b></td></tr>"
	+ "<tr><td><i class='iconcur fa fa-refresh fa-lg'></i></td><td>F7</td><td><b>Repeat</b> : lecture de la ligne courante</td></tr>"
	+ "<tr><td><i class='iconcur fa fa-repeat fa-lg'></i></td><td>F8</td><td>Lecture <b>continue</b></td></tr>"
	+ "<tr><td><i class='iconcur fa fa-hand-o-left fa-lg'></i></td><td>ALT + ← <br/>(ou F2)</td><td>Recule</td></tr>"
	+ "<tr><td><i class='iconcur fa fa-hand-o-right fa-lg'></i></td><td>ALT + → <br/>(ou F3)</td><td>Avance</td></tr>"
	+ "<tr><td><i class='iconcur fa fa-search-minus fa-lg'></i>&nbsp;<i class='iconcur fa fa-search-plus fa-lg'></i></td><td></td><td><b>Zoom</b> : agrandit ou rétrécit</td></tr>"
	+ "</tbody></table><br/>"
	+ "Les icones indiquées se retrouvent autour du champ média (audio ou vidéo) .<br/>"
	+ "Lorsqu'on passe la souris sur une icône, une <b>bulle d'information</b> apparaît pour rappeler la fonction principale de l'icône, ainsi que son raccourci clavier associé.<br/>"
	+ "<br/>Touches supplémentaires pour la transcription: "
	+ "Voir bouton d'aide de gauche pour transcription de base" ;

trjs.aide_fra["transcription-compl"] = "Touches supplémentaires pour la transcription:<br/>"
    + "<table border='1px'>"
    + "<thead><tr><th>Raccourci clavier</th><th>Fonctionnalité</th></tr></thead>"
    + "<tr><td>Ctrl+B</td><td>Diviser une ligne</td></tr>"
    + "<tr><td>Ctrl+I</td><td>Insertion ligne vide</td></tr>"
    + "<tr><td>Ctrl+D</td><td>Effacer une ligne</td></tr>"
    + "<tr><td>Ctrl+M</td><td>Insérer une ligne vide avec temps</td></tr>"
    + "<tr><td>Ctrl+R</td><td>Dupliquer une ligne</td></tr>"
    + "<tr><td>Ctrl+J</td><td>Joindre deux lignes</td></tr>"
    + "<tr><td>Ctrl+Alt+D</td><td>Effacer une ligne et ses dépendances</td></tr>"
    + "<tr><td>Ctrl+Alt+I</td><td>Mettre le temps et passer à ligne locuteur suivante</td></tr>"
    + "<tr><td>Ctrl+Alt+J</td><td>Joindre deux lignes avec locuteur</td></tr>"
    + "<tr><td>Ctrl+Alt+M</td><td>Mettre le temps et passer à ligne suivante</td></tr>"
    + "<tr><td>Ctrl+Alt+R</td><td>Divise une ligne avec temps</td></tr>"
    + "</tbody></table><br/>" ;

trjs.aide_fra["op-param"] = "<p>Dans le menu <b>Paramètres</b>, les paramètres suivants sont modifiables :<br/>"
	+ "Lorsqu'on passe la souris sur un paramètre, une <b>bulle d'information</b> apparaît pour rappeler sa <b>fonction principale</b>, ainsi que son raccourci clavier éventuel associé."
	+ "<table><thead><tr><th>Paramètre</th><th>Descriptif</th><th>Localisation</th></tr></thead>"
	+ "<tbody><tr><td colspan='3'><div class='scrollit'>"
	+ "<table><tr><td>Version</td><td>Français ou Anglais</td><td>Onglet <bl>LANGUE</bl></td></tr>"
	+ "<tr><td>Visualisation de la partition</td><td>Coché par défaut</td><td>Onglet <bl>AFFICHAGE</bl></td></tr>"
	+ "<tr><td>Visualisation du signal sonore</td><td>Coché par défaut</td><td>Onglet <bl>AFFICHAGE</bl></td></tr>"
	+ "<tr><td>Affichage des numéros en début de ligne</td><td>Par défaut pas affichés</td><td>Onglet <bl>AFFICHAGE</bl></td></tr>"
	+ "<tr><td>Affichage des noms des participants</td><td>A la place des codes</td><td>Onglet <bl>AFFICHAGE</bl></td></tr>"
	+ "<tr><td>Affichage des temps des alignements</td><td>Coché par défaut</td><td>Onglet <bl>AFFICHAGE</bl></td></tr>"
	+ "<tr><td>Modes d'édition des zones d'affichage</td><td>3 modes disponibles</td><td>Onglet <bl>MODES D'EDITION</bl></td></tr>"
	+ "<tr><td>Réorganisation dynamique des lignes</td><td>Coché par défaut</td><td>Onglet <bl>MODES D'EDITION</bl></td></tr>"
	+ "<tr><td>Format pour les repères temporels</td><td>Par défaut en h:mm:ss</td><td>Onglet <bl>REGLAGES</bl></td></tr>"
	+ "<tr><td>Nombre de chiffres (ms)</td><td>De 0 à 3</td><td>Onglet <bl>REGLAGES</bl></td></tr>"
	+ "<tr><td>Valeur de retour en arrière (en ms)</td><td>Raccourci clavier :  ALT + <-</td><td>Onglet <bl>REGLAGES</bl></td></tr>"
	+ "<tr><td>Valeur de saut en avant (en ms)</td><td>Raccourci clavier :  ALT + -></td><td>Onglet <bl>REGLAGES</bl></td></tr>"
	+ "<tr><td>Vérification de la transcription lors de la sauvegarde</td><td>Coché par défaut</td><td>Onglet <bl>VERIFICATION</bl></td></tr>"
	+ "<tr><td>Nombre de versions précédentes</td><td>Lors de la sauvergarde, de 1 à 3</td><td>Onglet <bl>VERIFICATION</bl></td></tr>"
	+ "</table></div></td></tr>"
	+ "</tbody></table></p>" ;

trjs.aide_fra["op-search"] = "<p>L'onglet de recherche s'affiche sous forme de panneau.<br/>"
	+ "On peut y accéder par le raccourci clavier : CTRL + F<br/><br/>"
	+ "Il est possible d'effectuer plusieurs types de recherche dans le fichier courant :"
	+ "<ul><li><b>Rechercher</b> un mot ou une chaîne de caractères :</li>"
    + "		<ul><li>dans le champ Locuteurs</li>"
	+ "		<li>dans le champ Transcription</li></ul>"
	+ "<li><b>Remplacer</b> le résultat de la recherche</li>"
	+ "<li><b>Montrer</b> les locuteurs ou les tiers :</li>"
	+ "		<ul><li>dans le champ Locuteurs (permet d'afficher seulement le locuteur/la tier sur laquelle on travaille)</li>"
	+ "		<li>dans le champ Transcription (permet d'afficher toutes les mentions d'un locuteur/une tier dans la transcription)</li></ul>"
	+ "<li><b>Cacher</b> les locuteurs ou les tiers :</li>"
	+ "		<ul><li>dans le champ Locuteurs (permet de cacher les locuteurs/tiers désirés)</li>"
	+ "		<li>dans le champ Transcription</li></ul>"
	+ "<li><b>Aller à un numéro de ligne</b> (ou le raccourci clavier : CTRL + L</li>"
	+ "<li>Aller à un <b>repère temporel</b> (ou le raccourci clavier : CTRL + T</li></ul>";

trjs.aide = trjs.aide_fra;

trjs.aidecontextuelle = function (theme, forcer) {
	
	for (var i in trjs.aide) {
		if (theme === i) {
            var index = 'HELP_' + i + '_DONE';
			if (localStorage[index] !== undefined && localStorage[index] !== 'undefined' && !forcer) return;
			$('#aideid').html(trjs.aide[i]);
			$('#aidecontext').show();
			localStorage[index] = 'done';
			return;
		}
	}
	console.log("aide non trouvée: " + theme);
};

trjs.aideclose = function () {
	$('#aidecontext').hide();
};

/* BARRE D OUTILS */
trjs.palette = {};

trjs.palette.file = function (style) {
	if (trjs.param.paletteFile === false) {
        $('#palette-file').show();
        trjs.param.paletteFile = true;
	}
	else {
        $('#palette-file').hide();
        trjs.param.paletteFile = false;
	}
};

trjs.palette.edit = function (style) {
    if (trjs.param.paletteEdit === false) {
        $('#palette-edit').show();
        trjs.param.paletteEdit = true;
    }
    else {
        $('#palette-edit').hide();
        trjs.param.paletteEdit = false;
    }
};

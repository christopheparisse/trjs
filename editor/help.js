/**
 * @module {help}
 * @author Christophe Parisse
 * last change: 17/11/2017
 */

trjs.help_fra = [];
trjs.help_eng = [];

trjs.help_fra["op-trs"] = "<b>Partie gauche :</b><br/>"
	+ "Vous pouvez naviguer dans votre arborescence de fichiers : <br/>"
	+ "Ouvrez un dossier par un double-clic, l'intégralité du contenu du répertoire ouvert s'affiche dans la partie droite de la fenêtre.<br/><br/>"
	+ "<b>Partie droite :</b><br/>" 
	+ "Sélectionnez un fichier :<ul><li>en double-cliquant sur celui-ci,</li><li>en appuyant sur la touche ENTREE,</li>" 
	+ "<li>ou en cliquant sur <b>Choisir un fichier</b></li></ul><br/>"
	+ "Plusieurs <b>options d'affichage</b> s'offrent à vous en bas de la fenêtre :<br/>"
	+ "Vous pouvez demandez l'affichage de tous les fichiers ou sélectionner (par défaut) seulement les fichiers de transcription." ;

trjs.help_eng["op-trs"] = "<b>Left side :</b><br/>"
    + "You can navigate the file tree: <br/>"
    + "Open a folder with double click, all the folder will be displayed in the left side of the window.<br/><br/>"
    + "<b>Right side:</b><br/>"
    + "Select a file: <ul><li>with double clic</li><li>using the RETURN key</li>"
    + "<li>or clic on <b>Choose the file</b></li></ul><br/>"
    + "Several <b>display options</b> are available in the bottom of the window:<br/>"
    + "You can ask to display all files or only transcription files." ;

trjs.help_fra["choose-media"] = "<b>Partie gauche :</b><br/>"
	+ "Vous pouvez naviguer dans votre arborescence de fichiers: <br/>"
	+ "Ouvrez un dossier par un double-clic, l'intégralité du contenu du répertoire ouvert s'affiche dans la partie droite de la fenêtre.<br/><br/>"
	+ "<b>Partie droite :</b><br/>" 
	+ "Sélectionnez un fichier :<ul><li>en double-cliquant sur celui-ci,</li><li>en appuyant sur la touche Entrée,</li>" 
	+ "<li>ou en cliquant sur <b>Choisir un fichier</b></li></ul><br/>"
	+ "Plusieurs <b>options d'affichage</b> s'offrent à vous en bas de la fenêtre :<br/>"
	+ "Vous pouvez demandez l'affichage de tous les fichiers ou sélectionner (par défaut) seulement les fichiers média.<br/><br/>"
	+ "Concernant la <b>qualité du fichier média</b> que vous vous appretez à ouvrir, vous pouvez sélectionner une qualité automatique (par défaut) ou préciser la qualité que vous désirez." ;

trjs.help_eng["choose-media"] = "<b>Left side :</b><br/>"
    + "You can navigate the file tree: <br/>"
    + "Open a folder with double click, all the folder will be displayed in the left side of the window.<br/><br/>"
    + "<b>Right side:</b><br/>"
    + "Select a file: <ul><li>with double clic</li><li>using the RETURN key</li>"
    + "<li>or clic on <b>Choose the file</b></li></ul><br/>"
    + "Several <b>display options</b> are available in the bottom of the window:<br/>"
    + "You can ask to display all files or only media files.<br/><br/>"
    + "<b>Media quality</b> can be selected automatically (default) or manually." ;

trjs.help_fra["new-trs"] = "Vous pouvez commencer ou éditer votre transcription.<br/>"
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

trjs.help_eng["new-trs"] = "You can start or edit your transcription.<br/>"
    + "The trancription display is divided in 4 parts:"
    + "<ol><li><b>Locutor</b>"
    + " - <i>identify the locutor or the structure (dependant)</i></li>"
    + "	<ul><li>Each new locutor must be described in the participant table</li>"
    + "		<li>Each new structure must be described in the structure table</li>"
    + "		<li>Structures are displayed under the locutor (main line by default)</li>"
    + "	</ul><li><b>Start</b>"
    + " - <i>le temps de début</i> et </li>"
    + "	<li><b>Fin</b>"
    + " - <i>le temps de fin</i></li>"
    + "	<ul><li>Un clic permet d'obtenir le temps en millisec.</li>"
    + "		<li>L'affichage du nombre et du format pour les millisec. est modifiable dans le menu Paramètres.</li>"
    + "	</ul><b><li>Transcription</b>"
    + " - <i>la partie texte éditable</i></li>"
    + "	<ul><li>Les nuances de gris sur les lignes correspondent aux locuteurs : plus le gris est foncé, plus la fréquence du temps de parole du locuteur est élevée.</li>"
    + "		<li>La ligne sélectionnée est surlignée en bleu (en bleu clair pour une ligne dépendante)</li></ul></ol>" ;

trjs.help_fra["op-metadata"] = "Remplissez les <b>métadonnées</b> liées au fichier.<br/><br/>"
    + "Seules les <b>parties grisées</b> sont <b>éditables</b> :<br/>"
    + "Vous pouvez ici renommer le fichier de transcription, et renseigner les métadonnées décrites selon le format <a href=\"http://www.bnf.fr/fr/professionnels/formats_catalogage/a.f_dublin_core.html\">Dublin Core</a>.<br/>"
    + "Pour obtenir des informations supplémentaires, passez votre souris sur la partie Information située à droite du tableau, une infobulle apparaît." ;

trjs.help_eng["op-metadata"] = "Fill the <b>metadata</b> related to the file.<br/><br/>"
    + "Only the <b>gray parts</b> can be <b>edited</b> :<br/>"
    + "Information about <a href=\"http://dublincore.org/documents/dces/\">Dublin Core</a> metadata.<br/>"
    + "For more information, draw your mouse on the information part on the right off the table." ;

trjs.help_fra["op-part"] = "Enregistrez les noms des <b>locuteurs</b>, ainsi que les informations les concernant.<br/>"
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

trjs.help_eng["op-part"] = "Save the names of the <b>participant</b>, including any other related information.<br/>"
    + "Only the <b>gray parts</b> can be <b>edited</b> :<br/>"
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

trjs.help_fra["op-struc"] = "Définissez les <b>types de structures</b>, c'est-à-dire le champ qui décrit le type d'un énoncé.<br/>"
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

trjs.help_eng["op-struc"] = "Please define the <b>structure types</b>.<br/>"
    + "Only the <b>gray parts</b> can be <b>edited</b> :<br/>"
    + "Structure types defined can be inserted quickly:"
    + "<ul><li>using <b>a keyboard shortcut</b>:</li></ul>"
    + "<table border='1px'>"
    + "<thead><tr><th>Shortcut</th><th>Direct code for a structure</th></tr></thead>"
    + "<tbody><tr><td>Ctrl + Alt + 1</td><td>First proprerty of structure (secondary tiers)</td></tr>"
    + "<tr><td>Ctrl + Alt + 2</td><td>Second property</td></tr>"
    + "<tr><td>...</td><td>...</td></tr>"
    + "<tr><td>Ctrl + Alt + 9</td><td>Ninth property</td></tr>"
    + "</tbody></table><br/>"
    + "<ul><li>or using a <b>right click</b> on the locutor field of the transcription</li></ul>" ;

trjs.help_fra["boutons-media"] = "Les transcriptions de base se font à l'aide des commandes suivantes:<br/>"
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

trjs.help_eng["boutons-media"] = "Basic transcription can be done using these shortcuts:<br/>"
    + "<table border='1px'>"
    + "<thead><tr><th>Icon</th><th>Keyboard shortcut</th><th>Function</th></tr></thead>"
    + "<tbody><tr><td><i class='iconcur fa fa-play-circle fa-lg'></i></td><td>TAB</td><td><b>Play</b> or <b>stop</b> media</td></tr>"
    + "<tr><td><i class='iconcur fa fa-level-up fa-lg'></i></td><td>RETURN</td><td><b>Mark time, goto next line</b>.</td></tr>"
    + "<tr><td><i class='iconcur fa fa-edit fa-lg'></i></td><td>F6</td><td>Insert <b>empty line</b></td></tr>"
    + "<tr><td><i class='iconcur fa fa-arrow-up fa-lg'></i></td><td>F4</td><td>Mark <b>start time</b></td></tr>"
    + "<tr><td><i class='iconcur fa fa-arrow-down fa-lg'></i></td><td>F5</td><td>Mark <b>end time</b></td></tr>"
    + "<tr><td><i class='iconcur fa fa-refresh fa-lg'></i></td><td>F7</td><td><b>Repeat</b> current line</td></tr>"
    + "<tr><td><i class='iconcur fa fa-repeat fa-lg'></i></td><td>F8</td><td><b>Continuous</b> play</td></tr>"
    + "<tr><td><i class='iconcur fa fa-hand-o-left fa-lg'></i></td><td>ALT + ← <br/>(or F2)</td><td>Media backwards</td></tr>"
    + "<tr><td><i class='iconcur fa fa-hand-o-right fa-lg'></i></td><td>ALT + → <br/>(or F3)</td><td>Media forward</td></tr>"
    + "<tr><td><i class='iconcur fa fa-search-minus fa-lg'></i>&nbsp;<i class='iconcur fa fa-search-plus fa-lg'></i></td><td></td><td><b>Zoom</b> larger or smaller</td></tr>"
    + "</tbody></table><br/>"
    + "Icons are displayed around the media (audio or video) .<br/>"
    + "Tooltips are availalable when the cursor is above an icon.<br/>"
    + "<br/>For other shorcuts, see next help button."
    + "See left help button for basic transcription tips." ;

trjs.help_fra["transcription-compl"] = "Touches supplémentaires pour la transcription:<br/>"
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

trjs.help_eng["transcription-compl"] = "Other shortcut for transcription editing:<br/>"
    + "<table border='1px'>"
    + "<thead><tr><th>Keyboard shortcut</th><th>Function</th></tr></thead>"
    + "<tr><td>Ctrl+B</td><td>Split a line</td></tr>"
    + "<tr><td>Ctrl+I</td><td>Insert an empty line</td></tr>"
    + "<tr><td>Ctrl+D</td><td>Delete a line</td></tr>"
    + "<tr><td>Ctrl+M</td><td>Insert an empty line with time</td></tr>"
    + "<tr><td>Ctrl+R</td><td>Duplicate a line</td></tr>"
    + "<tr><td>Ctrl+J</td><td>Join two lines</td></tr>"
    + "<tr><td>Ctrl+Alt+D</td><td>Delete a line and the dependant lines</td></tr>"
    + "<tr><td>Ctrl+Alt+I</td><td>Set time and go to next locutor</td></tr>"
    + "<tr><td>Ctrl+Alt+J</td><td>Join two lines with the locutor</td></tr>"
    + "<tr><td>Ctrl+Alt+M</td><td>Set time and go to next line</td></tr>"
    + "<tr><td>Ctrl+Alt+R</td><td>Split a line with time</td></tr>"
    + "</tbody></table><br/>" ;

trjs.help_fra["op-param"] = "<p>Dans le menu <b>Paramètres</b>, les paramètres suivants sont modifiables :<br/>"
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

trjs.help_eng["op-param"] = "<p>Changes available in the <b>Parameter</b> menu:<br/>"
    + "<b>Tooltip information</b> are available on individual tabs."
    + "<table><thead><tr><th>Parameter</th><th>Description</th><th>Localisation</th></tr></thead>"
    + "<tbody><tr><td colspan='3'><div class='scrollit'>"
    + "<table><tr><td>Version</td><td>French ou English</td><td>Tab<bl>LANGUAGE</bl></td></tr>"
    + "<tr><td>Display the partition</td><td>Set by default</td><td>Tab <bl>Display</bl></td></tr>"
    + "<tr><td>Visualising sound signal</td><td>Set by default</td><td>Tab <bl>Display</bl></td></tr>"
    + "<tr><td>Display number at the start of the lines</td><td>By default not displayed</td><td>Tab <bl>Display</bl></td></tr>"
    + "<tr><td>Display name of participants</td><td>Instead of codes</td><td>Tab <bl>Display</bl></td></tr>"
    + "<tr><td>Display link time</td><td>Set by default</td><td>Tab <bl>Display</bl></td></tr>"
    + "<tr><td>Display editing mode</td><td>3 modes available</td><td>Tab <bl>EDITION MODE</bl></td></tr>"
    + "<tr><td>Automatic line reorganization</td><td>Set by default</td><td>Tab <bl>EDITION MODE</bl></td></tr>"
    + "<tr><td>Format temporal markers</td><td>By default h:mm:ss</td><td>Tab <bl>Setting</bl></td></tr>"
    + "<tr><td>Nombre de chiffres (ms)</td><td>De 0 à 3</td><td>Tab <bl>Settings</bl></td></tr>"
    + "<tr><td>Backward time step (in ms)</td><td>Keyboard shorcut :  ALT + <-</td><td>Tab <bl>Setting</bl></td></tr>"
    + "<tr><td>Forward time step (in ms)</td><td>Keyboard shorcut :  ALT + -></td><td>Tab <bl>Setting</bl></td></tr>"
    + "<tr><td>Checking transcription when saving</td><td>Set by default</td><td>Tab <bl>CHECK</bl></td></tr>"
    + "<tr><td>Number of saved previous versions</td><td>From 1 to 3</td><td>Tab <bl>CHECK</bl></td></tr>"
    + "</table></div></td></tr>"
    + "</tbody></table></p>" ;

trjs.help_fra["op-search"] = "<p>L'onglet de recherche s'affiche sous forme de panneau.<br/>"
	+ "On peut y accéder par le raccourci clavier : CTRL + F<br/><br/>"
	+ "Il est possible d'effectuer plusieurs types de recherche dans le fichier courant :"
	+ "<ul><li><b>Rechercher</b> un mot ou une chaîne de caractères :</li>"
    + "		<ul><li>dans le champ Locuteurs</li>"
	+ "		<li>dans le champ Transcription</li></ul>"
	+ "<li><b>Remplacer</b> le résultat de la recherche</li>"
	+ "<li><b>Montrer</b> les locuteurs ou les tiers :</li>"
	+ "		<ul><li>dans le champ Locuteurs (permet d'afficher seulement le locuteur/la tier sur laquelle on travaille)</li>"
	+ "		<li>dans le champ Transcription (permet d'afficher toutes les mentions d'un mot dans la transcription)</li></ul>"
	+ "<li><b>Cacher</b> les locuteurs ou les tiers :</li>"
	+ "		<ul><li>dans le champ Locuteurs (permet de cacher les locuteurs/tiers désirés)</li>"
	+ "		<li>dans le champ Transcription</li></ul>"
	+ "<li><b>Aller à un numéro de ligne</b> (ou le raccourci clavier : CTRL + L</li>"
	+ "<li>Aller à un <b>repère temporel</b> (ou le raccourci clavier : CTRL + T</li></ul>";

trjs.help_eng["op-search"] = "<p>The search tab is a separate panel.<br/>"
    + "Direct access through keyboard shortcut : CTRL + F<br/><br/>"
    + "Several types of search can be performed in the current file. The lines found are highlighted in color:"
    + "<ul><li><b>Searching</b> for a word or a character string:</li>"
    + "		<ul><li>in the Locutor field</li>"
    + "		<li>in the Transcription field</li></ul>"
    + "<li><b>Remplace</b> the search result</li>"
    + "<li><b>Show</b> locutors or tiers:</li>"
    + "		<ul><li>in the Locutor field (allow to display only the desired locutors/tiers)</li>"
    + "		<li>in the Transcription field (allow to display only the mention of a word)</li></ul>"
    + "<li><b>Cacher</b> les locuteurs ou les tiers :</li>"
    + "		<ul><li>in the Locutor field (allow to hide the desired locutors/tiers)</li>"
    + "		<li>in the Transcription field</li></ul>"
    + "<li><b>Go to a line number</b> (or keyboard shorcut : CTRL + L</li>"
    + "<li>Go to a <b>time point</b> (or keyboard shorcut : CTRL + T</li></ul>";

trjs.help_fra.transcribe =
    "<p><b>Transcrire rapidement:</b> Se positionner sur une ligne locuteur. Si cette ligne ne présente pas de marqueur " +
    "de temps de début, se déplacer sur le média pour aller au point de départ désiré puis appuyer sur F4 (ou éditer " +
    "directement le temps de départ dans le première colonne après le locuteur).<br/>" +
    "<u>A partir de ce moment la touche TAB va démarrer ou arrêter le son ou la vidéo</u>. Les touches ALT+flèche gauche et " +
    "ALT+flèche droite permettre de reculer ou avancer le média rapidement. <u>Il est possible de taper la transcription " +
    "en temps réel</u>, que le média soit en train de jouer ou non. Lorqu'un ligne de transcription est finie, appuyer sur " +
    "la touche RETURN (ENTREE) lorsque le média joue la fin de la ligne transcrite. Le curseur marquera le temps de fin, " +
    "passera à la ligne suivante, y marquera le temps de début et le processus pourra continuer.<br/><br/>" +
    "Si le curseur est en fin de fichier, des lignes seront insérées. Sinon les lignes existantes seront modifiées, ce qui " +
    "permet d'ajuster un marquage temporel incorrect. Pour insérer des lignes blanches en milieu de corpus, faire " +
    "F6 autant de fois que nécessaire pour insérer plusieurs lignes à l'avance, ou utiliser CTRL+M pour insérer des " +
    "lignes en temps réel." +
    "</p>";

trjs.help_eng.transcribe =
    "<p><b>Fast transcribe:</b> Put the cursor on a locutor line. If this line does not containt any starting time mark, " +
    "use the media to choose the desired starting time and then hit F4, this will set the starting time.You can " +
    "also edit directly the starting time in the first column after the speaker name.<br/>" +
    "<u>From this time on, the TAB kay will start or stop the sound or the video</u>. The keys ALT+left arrow and " +
    "ALT+right arrow make it possible to move forward or backward the media. <u>The transcription can be written in " +
    "real time</u>, at the same time the media is played or not. When a transcription line is finished, hit the " +
    "RETURN key when the media will play the end of the line (or after stoping the media at that exact time). The end time " +
    "will be marked on the second time column, the cursor will go to the next line and the start time of the next " +
    "line will be marked with the same time as the end of the previous line. The process can then be repeated " +
    "as long as necessary.<br/><br/> If the cursor is a the end of the file, new line will be inserted. " +
    "If not, the existing lines will be modified and rewritted. This make it possible to adjust an incorrect temporal " +
    "alignement or to align lines without time marker (for example imported lines). " +
    "To insert new lines in the middle of the transcription hit F6 as much as necessary to insert blank lines " +
    "in advance. Or you can hit CTRL+M instead of the RETURN key. This will perform the same operation as the " +
    "RETURN key but with inserting a new line." +
    "</p>";

trjs.help_fra.helpStart =
    "<p>TRJS permet de réaliser des transcriptions rapidement à partir d'un média vidéo ou audio." +
    "Il a été optimisé pour qu'il ne soit pas nécessaire d'utiliser de souris et permettre ainsi une utilisation" +
    "efficace du clavier y compris pour manipuler la video ou le son et une transcriptions très rapide</p>" +
    "<p>TRJS permet aussi une utilisation classique en utilisant la souris et en découpant les sons et" +
    "images au préalable ou au fur et à mesure. TRJS permet aussi d'aligner un texte brut ne présentant" +
    "pas d'alignement préalable mais correctement divisé en locuteurs.</p>" +
    "<h2>Organisation de l'écran</h2>" +
    "<p>L'écran se divise en trois parties visibles en permanence:</p><br/>" +
    "<ol>" +
    "<li>Les accès aux <span style='color: red; font-weight: bold;'>paramètres, menus et fonctions annexes</span></li>" +
    "<li>Le champ <span style='color: green; font-weight: bold;'>média</span> contenant la vidéo et/ou l'audio</li>" +
    "<li>La <span style='color: blue; font-weight: bold;'>transcription</span> comprenant une suite de lignes dans un tableau permettant l'édition du document</li>" +
    "</ol>" +
    // "<img align='middle' height='500px' src='doc/general.png' />" +
    "<h3>Accès paramètres, menus et fonctions annexes</h3>" +
    "<p>Les paneaux de présentation et d'édition des paramètres s'affichent de manière optionnelle en cliquant" +
    "sur le menu \"Outils\" puis le menus correspondants.</p>" +
    "<ol>" +
    "<li>Recherche</li>" +
    "<li>Metadonnées</li>" +
    "<li>Participants</li>" +
    "<li>Templates</li>" +
    "<li>Paramètres</li>" +
    "<li>Vérifier la transcription</li>" +
    "<li>Décaler des repères temporels</li>" +
    "<li>Convertir des médias</li>" +
    "</ol>" +
    // "<table style='border-top: solid 2px black; border-bottom: solid 2px black;'>" +
    // "<tr><td style='background: salmon; font-weight: bold;'>Panneau paramètres</td><td style='background: salmon; font-weight: bold;'>Sous-panneau metadonéées</td></tr>" +
    // "<tr><td><img align='middle' height='200px' src='doc/params.png' /></td><td><img align='middle' height='200px' src='doc/metadata.png' /></td></tr>" +
    // "</table>" +
    "Aide complète disponible sur <a href='http://ct3.ortolang.fr/trjs/'>http://ct3.ortolang.fr/trjs/</a>";

trjs.help_eng.helpStart =
    "<p>TRJS allows you to transcribe very quickly and effciently from a sound or a video. " +
    "It was optimized so that using a mouse is not necassary and it is possible to use only " +
    "the keyboard to manipulate the video or the sound very quickly.</p>" +
    "<p>TRJS makes it also possible to split and link sound and media with the mouse with a more " +
    "visual approach. It is also possible to align a raw text that not previously link to " +
    "sound or video.</p>" +
    "<p>Starting a transcripion you should:<br/>" +
    "<ul><li>Create a new transcription with menu File + New transcription</li>" +
    "<li>Open a previous transcription with File + Open</li>" +
    "<li>If necessary open a media with File + Open media</li>" +
    "<li>Edit metadata with menu Tools + Metadata</li></ul>" +
    "<li>Edit participants with menu Tools + Participants</li></ul>" +
    "<li>Edit document structure with menu Tools + Template</li></ul>" +
    "</p>" +
    "<h2>Organisation of the screen</h2>" +
    "<p>The screen is divided in three parts:</p><br/>" +
    "<ol>" +
    "<li>Access to <span style='color: red; font-weight: bold;'>parameters, menus and functions</span></li>" +
    "<li><span style='color: green; font-weight: bold;'>Media</span> containing video and/or audio</li>" +
    "<li><span style='color: blue; font-weight: bold;'>Transcription</span> containing a set of line in an " +
    "array that allow modification</li>" +
    "</ol>" +
    //    "<img align='middle' height='500px' src='doc/general.png' />" +
    "<h3>Access to parameters, menus and other functions</h3>" +
    "<p>Presentation and edition of metadata, partiticipants and templates are displayed " +
    "using the corresponding \"Tools\" menu.</p>" +
    "<ol>" +
    "<li>Search</li>" +
    "<li>Metadata</li>" +
    "<li>Participants</li>" +
    "<li>Templates</li>" +
    "<li>Parameters</li>" +
    "<li>Check the transcription</li>" +
    "<li>Shift all time links</li>" +
    "<li>Convert media</li>" +
    "</ol>" +
    //    "<table style='border-top: solid 2px black; border-bottom: solid 2px black;'>" +
    //    "<tr><td style='background: salmon; font-weight: bold;'>Parameters</td><td style='background: salmon; font-weight: bold;'>Metadata</td></tr>" +
    //    "<tr><td><img align='middle' height='200px' src='doc/params.png' /></td><td><img align='middle' height='200px' src='doc/metadata.png' /></td></tr>" +
    //    "</table>" +
    "Full help available on <a href='http://ct3.ortolang.fr/trjs/'>http://ct3.ortolang.fr/trjs/</a>";

trjs.help_fra.helpEdit = trjs.help_fra["boutons-media"] +
    trjs.help_fra["transcription-compl"];
trjs.help_eng.helpEdit = trjs.help_eng["boutons-media"] +
    trjs.help_eng["transcription-compl"];

trjs.help_fra.importexport = "FRA HELP importexport";
trjs.help_eng.importexport = "ENG HELP importexport";

trjs.help_fra.helpParams = "FRA HELP helpParams";
trjs.help_eng.helpParams = "ENG HELP helpParams";

trjs.help = trjs.help_fra;

trjs.contextualhelp = function (theme, forcer) {
	
	for (var i in trjs.help) {
		if (theme === i) {
            var index = 'HELP_' + i + '_DONE';
			if (localStorage[index] !== undefined && localStorage[index] !== 'undefined' && !forcer) return;
			$('#aideid').html(trjs.help[i]);
			$('#aidecontext').show();
			localStorage[index] = 'done';
			return;
		}
	}
	console.log("aide non trouvée: " + theme);
};

trjs.displayhelp = function (theme) {
    $('#aideid').html(trjs.help[theme]);
    $('#aidecontext').show();
}

trjs.closehelp = function () {
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

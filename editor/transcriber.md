/*
 * Descripion et organition du programme
 * @author Christophe Parisse
 * @date august 2014
 * 
 * Description générale du layout à copier dans le wiki

====== Organisation des relations de dépendances entre zones d'affichage du logiciel ======

Il y a 6 zones d'affichage dans le logiciel qui sont répartis en deux groupes:
  * le media qui comprend la vidéo ou le son accompagné (si présent) de la représentation du signal 
	et d'un slider horizontal représentant la position dans le temps
  * la transcription qui comprend la partition (représentation horizontal de la transcription verticale) 
  	et d'un slider horizontal représentant la position dans le temps

Dans une zone, le positionnement temporel des éléments est toujours synchrone. Les deux zones peuvent être 
synchronisées ou non selon les cas d'utilisation du logiciel.

  * (transcription>media): En situation normale, la zone transcription commande la zone média mais pas l'inverse. 
  	Cela permet de déplacer le média sans se déplacer dans la transcription et ainsi de corriger l'alignement 
  	temps - transcription de manière aisé. Le mode s'appelle mode standard.
  * (transcription=media): Dans certains cas, on veut pouvoir commander la transcription depuis le film. 
  	Soit pour la visio, soit pour d'autres raisons. Des touches spéciales visio existent en standard, 
  	sinon il est possible de passer en mode bloqué.
  * (transcription!=media): Dans certains cas, on ne veut pas commander le média depuis le texte 
  	(réseau lent par exemple) ou autres besoins. Il est possible de passer en mode libre.

Chaque élément de visualisation peut comporter des commandes utilisateur ou des commandes internes 
donc il faut préciser les fonctions de chaque zone.

  * **ELEMENTS MEDIA**
  * media: la zone média contient une interface utilisateur intégré (play/stop/déplacer dans le temps 
  	et relacher). Cette zone est en mode standard par défaut. En mode bloqué, elle positionne la transcription. 
  	Des boutons sont ajoutés pour lancer directement la synchro mode bloqué entre média et transcription
    * jouer en continu
    * jouer ligne courante
    * jouer trois lignes
  * wave: cette zone permet la sélection d'une partie avec la souris. Cette sélection ne positionne pas 
  	la transcription ni la partition. On peut aussi sélectionner une zone (pas de décalage transcription). 
  	Enfin on peut transmettre le temps courant à la transcription (n'existe qu'en mode standard et libre). 
  	En mode bloqué, la sélection positionne la transcription.
  * slider wave: cette zone fournit une vue horizontale de l'ensemble du signal sonore. Un clic à n% de 
  	la zone positionne le média à n% de sa durée totale. Les boutons sur ce slider sont optionnels. Ils ne sont 
  	affichés qu'en mode libre. Les boutons à gauche et à droite permettent un déplacement de une image 
  	(ou 1/50 secondes pour le son pur), de une seconde, d'une durée du facteur de zoom, à l'extrémité. 
  	Le positionnement sur le slider ne positionne pas la transcription, sauf en mode bloqué.

  * **ELEMENTS TRANSCRIPTION**
  * slider partition: cette zone fournit une vue horizontale de l'ensemble du texte. Un clic à n% 
  	de la zone positionne le média à n% de sa durée totale. Des boutons à gauche et à droite permettent 
  	un déplacement de une image (ou 1/50 secondes pour le son pur), de une seconde, d'une durée du facteur 
  	de zoom, à l'extrémité. Le positionnement sur le slider positionne le média, sauf en mode libre.
  * partition: cette zone produit une représentation horizontale de la transcription. Un facteur de zoom 
  	permet de déterminer combien de secondes sont représentées en largeur. Le facteur temporel de cette zone 
  	est le même que celui du wave (mais les deux peuvent être décalés). Un clic sur cette zone positionne 
  	le temps du média (sauf en mode libre). Ce clic positionne également la transcription si le clic est 
  	sur une zone dont on peut déterminer la position dans la transcription (pas toujours possible 
  	pour les parties du texte non-alignées).
  * transcription: visualisation verticale éditable du texte. Le positionnement sur une zone transcrite 
  	positionne la partition (si possible c'est à dire si la transcription est liée temporellement) et 
  	le temps du média (sauf en mode libre pour le média).
  	
  * **commandes complémentaires utilisées par programme ou au lancement de l'application ou au chargement du fichier**
  * goToLine (aller à une ligne donnée)
  * goToTime (aller à une temps donné)

===== IMPLEMENTATION =====
  ** deux points fondamentaux permettent de contrôler le positionnement de la transcription et du média.
  * Modifier le temps du média (media.currentTime --> fonction interne du navigateur) --> lance l'exécution d'un driver "updateListener" qui
    permet de contrôler le comportement du média. (les comportements des updateListener dépendent donc des modes: trjs.param.synchro.block, .control, .free)
  * Sélectionner la ligne courante: trjs.data.selectedLine --> il s'en suit une modification de l'affichage des lignes et de la partition
  * mode free: les fonctions de positionnement de temps et de lignes sont totalement indépendantes.
  * mode control: le positionnement ligne génére du positionnement de temps
  * mode block: les deux positionnement se controlent mutuellement - il faut éviter le blocage mutuel.
  - modif media.currentTime --> COMMENT SAVOIR SI MODIFIE PAR SETSELECTEDLINE ?
    - updateListener-free - mise à jour de wave et slider-wave --> pas de goToTime
    - updateListener-control - mise à jour de wave et slider-wave --> pas de goToTime
    - updateListener-block - mise à jour de wave et slider-wave ++ appel de goToTime-sans-continuation
  - goToTime et toute affection de trjs.data.selectedLine --> setSelectedLine
    - mode-free - mise à jour affichage transcription et partition
    - mode-control - mise à jour affichage transcription et partition ++ positionnement du temps par selectedLine (sauf si sans continuation)
    - mode-block - mise à jour affichage transcription et partition ++ positionnement du temps par selectedLine (sauf si sans continuation)

 * 
 * ------------------------------------------------------------------------------------------------------------
 * 
 * LIENS ENTRE LES PARTIES MEDIA ET TRANSCRIPTION
 * organisation of the layout of the application
 * 
 * slider for wave
 * media display
 * wave display
 * 
 * slider for partition
 * partition
 * transcription
 * 
 * three modes available (see data.js in synchro part)
 * 
 * bloc: time of media <=> time of transcription
 * control: time of media <= time of transcription but not opposite
 * free: time of media != time of transcription
 * 
 * the difficulty is to control all the interactions between blocs
 * 
 * ----------------- ELEMENTS TO BE CONTROLLED --------------------------
 * some input commands move the blocs accordingly to the mode
 * play in transcription and slider-partition
 * page left and right (jump a zoom width) in transcription and slider-partition
 * go begining and go end in transcription and slider-partition
 * page up and page down in transcription
 * line up and line down in transcription
 * alt left and right (jump a few seconds) in transcription and slider-partition
 * play in media and slider-wave
 * page left and right (jump a zoom width) in slider-wave
 * go begining and go end in media and slider-wave
 * 
 * some software controls move the blocs accordingly to the mode
 * vertical elevator in the transcription ?
 * time and position control in the media
 * 
 * --------------- MEDIA -------------------
 * there are two ways of controling the link between the media movie (from the html5 media):
 * -- explicitly when a function is called by tweeking the value of media.currentTime and
 *    calling the functions that position the wave, the partition and the transcription
 * -- implicitly when the timeupdate listeners are called each n milliseconds: the value of media.currentTime
 *    is set but the the functions that position the wave, the partition and the transcription can be used
 * 
 * playPause : starts media --> timeUpdateListener
 * playJump: position the transcription to the current time and starts media --> timeUpdateListener
 * playCurrent: position the media time to the time in the transcription and starts media --> timeUpdateListener
 * playStartLine: position the media time to the begining of the line in the transcription and starts media --> timeUpdateListener
 * adjustRealInfo.show(media) : position the partition to the media.currentTime unless time as changed since less than 1/1000 seconds - calls setCurrentTimeText
 * timeUpdateListener : calls adjustRealInfo.show
 * ctrlFromTo : calls adjustRealInfo.show
 * runFromTo(s, e, ...) : set media to the time s and plays until time e --> ctrlFromTo
 * ctrlContinuousFromTo : calls adjustRealInfo.show
 * runContinuous(s, ...): set media to the time s and plays until endContinuousPlay is called --> ctrlContinuousFromTo
 * --------------- PARTITION -------------------
 * setCurrentTimeText(t) : position the partition and the wave and the position display to the time t - calls draw() and drawWaveLine()
 *   do this accordingly to the mode or if forced by runFromTo or runContinuous
 * highlight(s,e,...) : === highlightElement : position the partition if necessary and highlights the time s to e part and draw wave accordingly if necessary
 * draw(time) : draw the page of the partition according to time and the parts of the wave if necessary - called only by setCurrentTimeText()
 * drawPartition(zoom,pos) : real drawing function of partitition - called only internal from partition
 * --------------- WAVE -------------------
 * drawWaveLine: draw the vertical line of a wave - called only by setCurrentTimeText() - do not draw the wave
 * drawWave(zoom,pos) : real drawing function of wave - called by partition and internally
 * drawWavePart(start, end) : higlights a special area of the wave
 * --------------- TRANSCRIPT/EVENTS -------------------
 * setSelectedLine: sets the current line, the displayed values of the current line, and highlights the corresponding partition
 *   uses highlight() - do not change the focus
 * goToTime(t) : position the transcription to the given time (if t is undefined uses media.currentTime)
 *
 * ------------------------------------------------------------------------------------------------------------
 * 
 * Organisation of the modules
 * 
 * Modules de bibliothèques externes (en dehors de node.js pour le serveur)
 * js/jquery.js
 * js/jstree.js
 * js/bootstrap.js
 * js/bootbox.min.js
 * js/rangy-core.js
 * js/filesaver.js
 * js/parseuri.js
 * 
 * Module locaux spécifiques de transcriber.js
 * editor/messgs.js		Messages in different languages
 * editor/wave.js		Displays wave of sound or vidéo
 * editor/partition.js	Displays transcription as horizontal partition
 * editor/decim.js		Reduce the wavefile to the display wave
 * editor/version2.js	Version information
 * editor/codefn2.js	Transcode html and special characters for urls
 * editor/data.js		Contains all global data for transcriber.js
 * editor/editor.js		Main entry into the software: initial loading and parameters
 * editor/params.js		Stored paramaters for the program - allows the user to tailor the program to her uses
 * editor/utils.js		Utilitary functions
 * editor/logs.js		Message and information display functions
 * editor/media.js		Handles the display and control of the audio and video
 * editor/opensave.js	Opens the media and transcript files
 * editor/templates.js	Loads the header and parameters of the TEIML file
 * editor/transcription.js	Loads the transcrition part (body) of the TEIML file
 * editor/events.js		Handles the keyboard and mouse events
 * editor/filetree.js	Display the local file tree and chooses the transcript and media file to be displayed
 * editor/tablekeyboard.js	Tables of keyboard bindings
 * editor/sliders.js	Display the sliders for wave and partition
 * 
 * transcriber.html		Main html page
 * style/global.css  - main style sheet - references also image data and cursor contained in the style directory
 * 
 */

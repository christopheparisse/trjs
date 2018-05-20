/*
 * check main line for CLAN format
 * info from depfile
# Main Line
*:	* , ,, [x _*] [- _*] [+ _*] [^ *] *~_* *_*# *-_*
	+... +/. +!? +//. +/? +"/. +". +//? +..? +.
	+" +^ +< +, ++ +≋ +≈
	`_* *- :
	[!] [!!] [=! _*] [= _*] [=? _*] [?] [: _*] [:: _*] [\*] [\* _*] [\% _*]
	[# _*]
	[>*] [<*] [/] [//] [///] [/-] [/?] [^c] [^c _*]
	&_* &{l=\% &}l=\% 0_* '_* /_* //_* ///_*
	*@a *@b *@c *@d *@e *@f *@fp *@g *@i *@k *@l *@n *@nv *@o *@p
	*@q *@s *@s:* *@s$* *@si *@sl *@sas *@t *@u *@wp *@x *@z:*
	+@c +@f +@n +@s +@s:* +@si +@sl +@sas +@t +-_*
	[UPREFS Mac] [UPREFS Mc] [UPREFS De] [UPREFS La] [UPREFS Las]
	[UPREFS Los] [UPREFS San] [UPREFS St] [UPREFS O'] [UPREFS D']

 */

{
  function testprint(o) {
    return o ? o : "";
  }
}

utterance
  = pr:precode? blank* mi:markinit? blank* s:eltb+ ep:endmarker blank* po:postcode? { return (testprint(pr) + testprint(mi) + s.join('') + ep + testprint(po)).trim(); }
  / pr:precode? blank* mi:markinit? blank* s:eltb+ po:postcode? { return 'warning: missing end marker.'; }
  / pr:precode? blank* mi:markinit? blank* ep:endmarker? po:postcode? { return 'warning: missing utternance (use 0 instead of nothing).'; }

eltb
 = s:elt blank+ { return s; }
 / s:elt { return s; }

elt
  = p:pause { return p; }
  / c:crochet { return c; }
  / c:chevron { return c; }
  / l:longevent { return l; }
  / p:ponctu { return p; }
  / w:word { return w; }

markinit
  = m:"+<" { return "<mark>" + m + "</mark>"; }
  / m:"+," { return "<mark>" + m + "</mark>"; }
  / m:"+^" { return "<mark>" + m + "</mark>"; }
  / m:"++" { return "<mark>" + m + "</mark>"; }
  / m:"+\"" { return "<mark>" + m + "</mark>"; }

crochet
  = "["  s1:toutsymbsansblanc+ blank* s2:toutsymb* "]" { return "<bracket>" + "<type>" + s1.join("") + "</type>" + s2.join("") + "</bracket>"; }

chevron
  = "<" s:eltb+ ">" { return "<chevron>" + s.join("") + "</chevron>"; }

longevent
  = "&{l=\*" blank* tt:toutsymbsanschevron* blank* "&}l=\*" { return "<longevent type='verbal'>" + ts + "</longevent>" }
  / "&{n=\*" blank* tt:toutsymbsanschevron* blank* "&}n=\*" { return "<longevent type='nonverbal'>" + ts + "</longevent>" }

word
  = w:mot { return "<w>" + w + "</w>"; }
  / w:motnombre { return "<w>" + w + "</w>"; }
  / w:motmaj { return "<w>" + w + "</w>"; }
  / w:nombre { return "<w>" + w + "</w>"; }

precode
  = "[-" blank* m:mot blank* "]" { return "<precode>" + m + "</precode>"; }

postcode
  = "[+" blank* m:mot blank* "]" { return "<postcode>" + m + "</postcode>"; }

pause
  = "#" p1:[0-9]+ "\." p2:[0-9]* { return "<pause>" + p1.join('') + "." + p2.join('') + "</pause>"; }
  / "#" "\." p2:[0-9]+ { return "<pause>" + "." + p2.join('') + "</pause>"; }
  / "#" p1:[0-9]+ { return "<pause>" + p1.join('') + "</pause>"; }
  / "###" { return "<pause>" + "long" + "</pause>"; }
  / "##" { return "<pause>" + "middle" + "</pause>"; }
  / "#" { return "<pause>" + "short" + "</pause>"; }
  / "(" p1:[0-9]+ "." p2:[0-9]* ")" { return "<pause>" + p1.join('') + "." + p2.join('') + "</pause>"; }
  / "(" "." p2:[0-9]+ ")" { return "<pause>" + "." + p2.join('') + "</pause>"; }
  / "(" p1:[0-9]+ ")" { return "<pause>" + p1.join('') + "</pause>"; }
  / "(...)" { return "<pause>" + "long" + "</pause>"; }
  / "(..)" { return "<pause>" + "middle" + "</pause>"; }
  / "(.)" { return "<pause>" + "short" + "</pause>"; }

mot
  = ic:inicode initial:lettreminmaj milieu:lettremilieumajapos+ fin:lettreminmaj+ { return ic + initial + reste.join('') + fin; }
  / initial:lettre milieu:lettremilieumajapos+ fin:lettre+ { return initial + reste.join('') + fin; }
  / initial:lettreapi mot:lettremilieuapi*  w:" "? apos:['] { return initial + mot.join('') + "'"; }
  / mot:lettreapi+ { return mot.join(''); }

inicode
  = [\&\=\-\*]

motmaj
  = initial:lettremaj milieu:lettremilieumajapos+ fin:lettreminmaj { return initial + reste.join('') + fin; }
  / initial:lettremaj apos:['] { return initial + apos; }
  / initial:lettremaj reste:lettreapi+ apos:['] { return initial + reste.join('') + apos; }
  / initial:lettremaj reste:lettremilieumajapos* { return initial + reste.join(''); }

motnombre
  = initial:lettreminmaj reste:[-+0-9]+ { return initial + reste.join(''); }

nombre
  = digits:[0-9-+()*]+ { return digits.join(''); }

endmarker
  = "+" p:[\.?!/;:,]+ { return "<ut>" + p.join('') + "</ut>"; }
  / "#" p:[\.?!/;:,]+ { return "<ut>" + p.join('') + "</ut>"; }
  / pct:[\.!?,;:]+ { return "<ut>" + pct.join('') + "</ut>"; }

ponctu
  = pct:[,‡„;:,↓↑]+ { return "<ponctu>" + pct.join('') + "</ponctu>"; }

blank
  = [ \t\r\n]+ { return " "; }

others
  = oth:[#$&°§=*] { return '_'+oth+'_'; }

lettre
  = [a-zàâäéèêëçïîôöùüû_(){}/\\@ˌˈ:^]

lettremaj
  = [A-ZÀÂÄÉÈËÊÇÏÎÖÔÚÜÛ_(){}/\\@ˌˈ^]

api
  = [iyɨʉɯuɪʏʊeøəɘɵɤoɛœɜɞʌɔæɐaɶɑɒɚɝ]
  / [ẽø̃ɛ̃õɔ̃ãɑ̃]
  / [pbdtʈɖcɟkɡqɢʔmɱɳɲŋɴʙrɽʀⱱɾɸβfvθðszʃʒʂʐçʝxɣχʁħʕhɬɮʋɹɻjɰlɭʎʟ]

lettreapi
  = lettre
  / api

lettremilieuapi
  = lettre
  / api
  / [-+]

lettreminmaj
  = lettre
  / lettremaj
  / api

lettremilieumajapos
  = lettre
  / lettremaj
  / api
  / [-+']

toutsymb
  = toutsymbsanschevron
  / [<>]

toutsymbsansblanc
  = toutsymbsanschevronsansblanc
  / [<>]

toutsymbsanschevron
  = lettreapi
  / lettremaj
  / [0-9#$&°§=*(){}/\\@.!?:;'," \t\r\n]

toutsymbsanschevronsansblanc
  = lettreapi
  / lettremaj
  / [0-9#$&°§=*(){}/\\@.!?:;',"]

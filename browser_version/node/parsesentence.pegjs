/*
 * parsing a sentence into elements
 */

utterance
  = markinit s:utterance { return s; }
  / c:crochet s:utterance { return c.concat(s); }
  / c:chevron s:utterance { return c.concat(s); }
  / p:ponctu s:utterance { return p.concat(s); }
  / ep:endponctu s:utterance { return ep.concat(s); }
  / "aujourd'hui" s:utterance { return ["aujourd'hui"].concat(s); }
  / "entr'ouvrir" s:utterance { return ["entr'ouvrir"].concat(s); }
  / "d'abord" s:utterance { return ["d'abord"].concat(s); }
  / m:motnombre s:utterance { return m.concat(s); }
  / m:motmaj s:utterance { return m.concat(s); }
  / m:mot s:utterance { return m.concat(s); }
  / n:nombre s:utterance { return n.concat(s); }
  / b:blank s:utterance { return s; }
  / o:others s:utterance { return o.concat(s); }
  / g:groupin s:utterance { return g.concat(s); }
  / g:groupout s:utterance { return g.concat(s); }
  /

markinit
  = "+<"
  / "+,"
  / "+^"
  / "+<"

crochet
  = ci:"[" c:toutsymb* cf:"]" { return [ci + c.join('') + cf]; }

chevron
  = ci:"<pause" c:toutsymbsanschevron* cf:">" { return [ci + c.join('') + cf]; }
  / ci:"<incident" c:toutsymbsanschevron* cf:">" { return [ci + c.join('') + cf]; }
  / ci:"<seg>" { return [ci]; }
  / ci:"</seg>" { return [ci]; }

groupout
  = go:">" { return ['⌉']; }

groupin
  = gi:"<" { return ['⌈']; }

mot
  = initial:lettre milieu:lettremilieumajapos+ fin:lettre { return [initial + milieu.join('')] + fin; }
  / initial:lettreapi mot:lettremilieuapi*  w:" "? apos:['ʲ] { return [initial + mot.join('') + "'"]; }
  / mot:lettreapi+ { return [mot.join('')]; }

motmaj
  = initial:lettremaj milieu:lettremilieumajapos+ fin:lettreminmaj { return [initial + reste.join('')] + fin; }
  / initial:lettremaj apos:['] { return [initial + apos]; }
  / initial:lettremaj reste:lettreapi+ apos:['] { return [initial + reste.join('') + apos]; }
  / initial:lettremaj reste:lettremilieumajapos* { return [initial + reste.join('')]; }

motnombre
  = initial:lettreminmaj reste:[-+0-9]+ { return [initial + reste.join('')]; }

nombre
  = digits:[0-9-+()*]+ { return [digits.join('')]; }

endponctu
  = "#+" p:[.?!/;:,]+ { return ["#" + p.join('')]; }
  / "#" p:[.?!/;:,]+ { return ["#" + p.join('')]; }
  / "+" p:[.?!/;:,]+ { return ["#" + p.join('')]; }
  / pct:[.!?,;:]+ { return ['#' + pct.join('')]; }

ponctu
  = pct:[.!?]+ { return ['#'+pct]; }
  / pct:[,;:]+ { return ['#'+pct]; }

blank
  = [ \t\r\n]+

others
  = oth:[#$&°§=*] { return ['_'+oth+'_']; }

lettre
  = [a-zàâäéèêëçïîôöùüû_(){}/\\@]

lettremaj
  = [A-ZÀÂÄÉÈËÊÇÏÎÖÔÚÜÛ_(){}/\\@]

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

lettremilieumajapos
  = lettre
  / lettremaj
  / api
  / [-+']

toutsymb
  = toutsymbsanschevron
  / [<>]

toutsymbsanschevron
  = lettre
  / lettremaj
  / [0-9#$&°§=*(){}/\\@.!?:;'," \t\r\n]
  
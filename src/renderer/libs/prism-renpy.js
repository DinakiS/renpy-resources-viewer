export default {
  'comment': {
    pattern: /(^|[^\\])#.*/,
    lookbehind: true
  },
  'triple-quoted-string': {
    pattern: /("""|''')[\s\S]+?\1/,
    greedy: true,
    alias: 'string'
  },
  'string': {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'function': {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: true
  },
  'label': {
    pattern: /((?:^|\s)label[ \t]+)[a-zA-Z_][\w.]*(?=\s*:)/g,
    lookbehind: true,
    alias: 'function'
  },
  'style': {
    pattern: /((?:^|\s)(?:style|screen)[ \t]+)[a-zA-Z_]\w*(?=\s*:)/g,
    lookbehind: true,
    alias: 'function'
  },
  'class-name': {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: true
  },
  'python-code': {
    pattern: /((?:^|\s)\$)/,
    alias: 'keyword'
  },
  'spaces': {
    pattern: /(\s+)/g
  },
  'renpy': {
    pattern: /\b(?:define|image|transform|default|init|label|show|screen|pause|python|call|menu|scene|jump|hide|stop|play)\b/,
    alias: 'keyword'
  },
  'keyword': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|nonlocal|pass|print|raise|return|try|while|with|yield)\b/,
  'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  'boolean': /\b(?:True|False|None)\b/,
  'number': /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[\da-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,
  'operator': /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]|\b(?:or|and|not)\b/,
  'punctuation': /[{}[\];(),.:]/
}

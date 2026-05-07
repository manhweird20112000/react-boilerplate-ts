import { n as e } from './chunk-BneVvdWh.js'
import { t } from './iframe-SXVsTQNR.js'
function n(e) {
  var t,
    r,
    i = ``
  if (typeof e == `string` || typeof e == `number`) i += e
  else if (typeof e == `object`)
    if (Array.isArray(e)) {
      var a = e.length
      for (t = 0; t < a; t++) e[t] && (r = n(e[t])) && (i && (i += ` `), (i += r))
    } else for (r in e) e[r] && (i && (i += ` `), (i += r))
  return i
}
function r() {
  for (var e, t, r = 0, i = ``, a = arguments.length; r < a; r++)
    (e = arguments[r]) && (t = n(e)) && (i && (i += ` `), (i += t))
  return i
}
var i = e(() => {}),
  a,
  o,
  s,
  c,
  l,
  u,
  ee,
  d,
  f,
  p,
  m,
  h,
  g,
  _,
  v,
  te,
  y,
  ne,
  re,
  b,
  x,
  ie,
  S,
  C,
  ae,
  w,
  T,
  E,
  D,
  O,
  oe,
  k,
  A,
  j,
  M,
  se,
  N,
  P,
  F,
  I,
  ce,
  L,
  R,
  z,
  le,
  B,
  ue,
  V,
  H,
  U,
  W,
  de,
  fe,
  G,
  K,
  pe,
  me,
  he,
  ge,
  _e,
  ve,
  q,
  J,
  ye,
  be,
  xe,
  Se,
  Ce,
  we,
  Y,
  X,
  Te,
  Ee,
  De,
  Oe,
  ke,
  Ae,
  je,
  Me,
  Ne,
  Pe,
  Fe = e(() => {
    ;((a = (e, t) => {
      let n = Array(e.length + t.length)
      for (let t = 0; t < e.length; t++) n[t] = e[t]
      for (let r = 0; r < t.length; r++) n[e.length + r] = t[r]
      return n
    }),
      (o = (e, t) => ({ classGroupId: e, validator: t })),
      (s = (e = new Map(), t = null, n) => ({ nextPart: e, validators: t, classGroupId: n })),
      (c = `-`),
      (l = []),
      (u = `arbitrary..`),
      (ee = (e) => {
        let t = p(e),
          { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e
        return {
          getClassGroupId: (e) => {
            if (e.startsWith(`[`) && e.endsWith(`]`)) return f(e)
            let n = e.split(c)
            return d(n, n[0] === `` && n.length > 1 ? 1 : 0, t)
          },
          getConflictingClassGroupIds: (e, t) => {
            if (t) {
              let t = r[e],
                i = n[e]
              return t ? (i ? a(i, t) : t) : i || l
            }
            return n[e] || l
          }
        }
      }),
      (d = (e, t, n) => {
        if (e.length - t === 0) return n.classGroupId
        let r = e[t],
          i = n.nextPart.get(r)
        if (i) {
          let n = d(e, t + 1, i)
          if (n) return n
        }
        let a = n.validators
        if (a === null) return
        let o = t === 0 ? e.join(c) : e.slice(t).join(c),
          s = a.length
        for (let e = 0; e < s; e++) {
          let t = a[e]
          if (t.validator(o)) return t.classGroupId
        }
      }),
      (f = (e) =>
        e.slice(1, -1).indexOf(`:`) === -1
          ? void 0
          : (() => {
              let t = e.slice(1, -1),
                n = t.indexOf(`:`),
                r = t.slice(0, n)
              return r ? u + r : void 0
            })()),
      (p = (e) => {
        let { theme: t, classGroups: n } = e
        return m(n, t)
      }),
      (m = (e, t) => {
        let n = s()
        for (let r in e) {
          let i = e[r]
          h(i, n, r, t)
        }
        return n
      }),
      (h = (e, t, n, r) => {
        let i = e.length
        for (let a = 0; a < i; a++) {
          let i = e[a]
          g(i, t, n, r)
        }
      }),
      (g = (e, t, n, r) => {
        if (typeof e == `string`) {
          _(e, t, n)
          return
        }
        if (typeof e == `function`) {
          v(e, t, n, r)
          return
        }
        te(e, t, n, r)
      }),
      (_ = (e, t, n) => {
        let r = e === `` ? t : y(t, e)
        r.classGroupId = n
      }),
      (v = (e, t, n, r) => {
        if (ne(e)) {
          h(e(r), t, n, r)
          return
        }
        ;(t.validators === null && (t.validators = []), t.validators.push(o(n, e)))
      }),
      (te = (e, t, n, r) => {
        let i = Object.entries(e),
          a = i.length
        for (let e = 0; e < a; e++) {
          let [a, o] = i[e]
          h(o, y(t, a), n, r)
        }
      }),
      (y = (e, t) => {
        let n = e,
          r = t.split(c),
          i = r.length
        for (let e = 0; e < i; e++) {
          let t = r[e],
            i = n.nextPart.get(t)
          ;(i || ((i = s()), n.nextPart.set(t, i)), (n = i))
        }
        return n
      }),
      (ne = (e) => `isThemeGetter` in e && e.isThemeGetter === !0),
      (re = (e) => {
        if (e < 1) return { get: () => void 0, set: () => {} }
        let t = 0,
          n = Object.create(null),
          r = Object.create(null),
          i = (i, a) => {
            ;((n[i] = a), t++, t > e && ((t = 0), (r = n), (n = Object.create(null))))
          }
        return {
          get(e) {
            let t = n[e]
            if (t !== void 0) return t
            if ((t = r[e]) !== void 0) return (i(e, t), t)
          },
          set(e, t) {
            e in n ? (n[e] = t) : i(e, t)
          }
        }
      }),
      (b = `!`),
      (x = `:`),
      (ie = []),
      (S = (e, t, n, r, i) => ({
        modifiers: e,
        hasImportantModifier: t,
        baseClassName: n,
        maybePostfixModifierPosition: r,
        isExternal: i
      })),
      (C = (e) => {
        let { prefix: t, experimentalParseClassName: n } = e,
          r = (e) => {
            let t = [],
              n = 0,
              r = 0,
              i = 0,
              a,
              o = e.length
            for (let s = 0; s < o; s++) {
              let o = e[s]
              if (n === 0 && r === 0) {
                if (o === x) {
                  ;(t.push(e.slice(i, s)), (i = s + 1))
                  continue
                }
                if (o === `/`) {
                  a = s
                  continue
                }
              }
              o === `[` ? n++ : o === `]` ? n-- : o === `(` ? r++ : o === `)` && r--
            }
            let s = t.length === 0 ? e : e.slice(i),
              c = s,
              l = !1
            s.endsWith(b)
              ? ((c = s.slice(0, -1)), (l = !0))
              : s.startsWith(b) && ((c = s.slice(1)), (l = !0))
            let u = a && a > i ? a - i : void 0
            return S(t, l, c, u)
          }
        if (t) {
          let e = t + x,
            n = r
          r = (t) => (t.startsWith(e) ? n(t.slice(e.length)) : S(ie, !1, t, void 0, !0))
        }
        if (n) {
          let e = r
          r = (t) => n({ className: t, parseClassName: e })
        }
        return r
      }),
      (ae = (e) => {
        let t = new Map()
        return (
          e.orderSensitiveModifiers.forEach((e, n) => {
            t.set(e, 1e6 + n)
          }),
          (e) => {
            let n = [],
              r = []
            for (let i = 0; i < e.length; i++) {
              let a = e[i],
                o = a[0] === `[`,
                s = t.has(a)
              o || s ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(a)) : r.push(a)
            }
            return (r.length > 0 && (r.sort(), n.push(...r)), n)
          }
        )
      }),
      (w = (e) => ({
        cache: re(e.cacheSize),
        parseClassName: C(e),
        sortModifiers: ae(e),
        ...ee(e)
      })),
      (T = /\s+/),
      (E = (e, t) => {
        let {
            parseClassName: n,
            getClassGroupId: r,
            getConflictingClassGroupIds: i,
            sortModifiers: a
          } = t,
          o = [],
          s = e.trim().split(T),
          c = ``
        for (let e = s.length - 1; e >= 0; --e) {
          let t = s[e],
            {
              isExternal: l,
              modifiers: u,
              hasImportantModifier: ee,
              baseClassName: d,
              maybePostfixModifierPosition: f
            } = n(t)
          if (l) {
            c = t + (c.length > 0 ? ` ` + c : c)
            continue
          }
          let p = !!f,
            m = r(p ? d.substring(0, f) : d)
          if (!m) {
            if (!p) {
              c = t + (c.length > 0 ? ` ` + c : c)
              continue
            }
            if (((m = r(d)), !m)) {
              c = t + (c.length > 0 ? ` ` + c : c)
              continue
            }
            p = !1
          }
          let h = u.length === 0 ? `` : u.length === 1 ? u[0] : a(u).join(`:`),
            g = ee ? h + b : h,
            _ = g + m
          if (o.indexOf(_) > -1) continue
          o.push(_)
          let v = i(m, p)
          for (let e = 0; e < v.length; ++e) {
            let t = v[e]
            o.push(g + t)
          }
          c = t + (c.length > 0 ? ` ` + c : c)
        }
        return c
      }),
      (D = (...e) => {
        let t = 0,
          n,
          r,
          i = ``
        for (; t < e.length; ) (n = e[t++]) && (r = O(n)) && (i && (i += ` `), (i += r))
        return i
      }),
      (O = (e) => {
        if (typeof e == `string`) return e
        let t,
          n = ``
        for (let r = 0; r < e.length; r++) e[r] && (t = O(e[r])) && (n && (n += ` `), (n += t))
        return n
      }),
      (oe = (e, ...t) => {
        let n,
          r,
          i,
          a,
          o = (o) => (
            (n = w(t.reduce((e, t) => t(e), e()))),
            (r = n.cache.get),
            (i = n.cache.set),
            (a = s),
            s(o)
          ),
          s = (e) => {
            let t = r(e)
            if (t) return t
            let a = E(e, n)
            return (i(e, a), a)
          }
        return ((a = o), (...e) => a(D(...e)))
      }),
      (k = []),
      (A = (e) => {
        let t = (t) => t[e] || k
        return ((t.isThemeGetter = !0), t)
      }),
      (j = /^\[(?:(\w[\w-]*):)?(.+)\]$/i),
      (M = /^\((?:(\w[\w-]*):)?(.+)\)$/i),
      (se = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/),
      (N = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/),
      (P =
        /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/),
      (F = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/),
      (I = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/),
      (ce =
        /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/),
      (L = (e) => se.test(e)),
      (R = (e) => !!e && !Number.isNaN(Number(e))),
      (z = (e) => !!e && Number.isInteger(Number(e))),
      (le = (e) => e.endsWith(`%`) && R(e.slice(0, -1))),
      (B = (e) => N.test(e)),
      (ue = () => !0),
      (V = (e) => P.test(e) && !F.test(e)),
      (H = () => !1),
      (U = (e) => I.test(e)),
      (W = (e) => ce.test(e)),
      (de = (e) => !G(e) && !q(e)),
      (fe = (e) => Y(e, De, H)),
      (G = (e) => j.test(e)),
      (K = (e) => Y(e, Oe, V)),
      (pe = (e) => Y(e, ke, R)),
      (me = (e) => Y(e, je, ue)),
      (he = (e) => Y(e, Ae, H)),
      (ge = (e) => Y(e, Te, H)),
      (_e = (e) => Y(e, Ee, W)),
      (ve = (e) => Y(e, Me, U)),
      (q = (e) => M.test(e)),
      (J = (e) => X(e, Oe)),
      (ye = (e) => X(e, Ae)),
      (be = (e) => X(e, Te)),
      (xe = (e) => X(e, De)),
      (Se = (e) => X(e, Ee)),
      (Ce = (e) => X(e, Me, !0)),
      (we = (e) => X(e, je, !0)),
      (Y = (e, t, n) => {
        let r = j.exec(e)
        return r ? (r[1] ? t(r[1]) : n(r[2])) : !1
      }),
      (X = (e, t, n = !1) => {
        let r = M.exec(e)
        return r ? (r[1] ? t(r[1]) : n) : !1
      }),
      (Te = (e) => e === `position` || e === `percentage`),
      (Ee = (e) => e === `image` || e === `url`),
      (De = (e) => e === `length` || e === `size` || e === `bg-size`),
      (Oe = (e) => e === `length`),
      (ke = (e) => e === `number`),
      (Ae = (e) => e === `family-name`),
      (je = (e) => e === `number` || e === `weight`),
      (Me = (e) => e === `shadow`),
      (Ne = () => {
        let e = A(`color`),
          t = A(`font`),
          n = A(`text`),
          r = A(`font-weight`),
          i = A(`tracking`),
          a = A(`leading`),
          o = A(`breakpoint`),
          s = A(`container`),
          c = A(`spacing`),
          l = A(`radius`),
          u = A(`shadow`),
          ee = A(`inset-shadow`),
          d = A(`text-shadow`),
          f = A(`drop-shadow`),
          p = A(`blur`),
          m = A(`perspective`),
          h = A(`aspect`),
          g = A(`ease`),
          _ = A(`animate`),
          v = () => [`auto`, `avoid`, `all`, `avoid-page`, `page`, `left`, `right`, `column`],
          te = () => [
            `center`,
            `top`,
            `bottom`,
            `left`,
            `right`,
            `top-left`,
            `left-top`,
            `top-right`,
            `right-top`,
            `bottom-right`,
            `right-bottom`,
            `bottom-left`,
            `left-bottom`
          ],
          y = () => [...te(), q, G],
          ne = () => [`auto`, `hidden`, `clip`, `visible`, `scroll`],
          re = () => [`auto`, `contain`, `none`],
          b = () => [q, G, c],
          x = () => [L, `full`, `auto`, ...b()],
          ie = () => [z, `none`, `subgrid`, q, G],
          S = () => [`auto`, { span: [`full`, z, q, G] }, z, q, G],
          C = () => [z, `auto`, q, G],
          ae = () => [`auto`, `min`, `max`, `fr`, q, G],
          w = () => [
            `start`,
            `end`,
            `center`,
            `between`,
            `around`,
            `evenly`,
            `stretch`,
            `baseline`,
            `center-safe`,
            `end-safe`
          ],
          T = () => [`start`, `end`, `center`, `stretch`, `center-safe`, `end-safe`],
          E = () => [`auto`, ...b()],
          D = () => [
            L,
            `auto`,
            `full`,
            `dvw`,
            `dvh`,
            `lvw`,
            `lvh`,
            `svw`,
            `svh`,
            `min`,
            `max`,
            `fit`,
            ...b()
          ],
          O = () => [L, `screen`, `full`, `dvw`, `lvw`, `svw`, `min`, `max`, `fit`, ...b()],
          oe = () => [L, `screen`, `full`, `lh`, `dvh`, `lvh`, `svh`, `min`, `max`, `fit`, ...b()],
          k = () => [e, q, G],
          j = () => [...te(), be, ge, { position: [q, G] }],
          M = () => [`no-repeat`, { repeat: [``, `x`, `y`, `space`, `round`] }],
          se = () => [`auto`, `cover`, `contain`, xe, fe, { size: [q, G] }],
          N = () => [le, J, K],
          P = () => [``, `none`, `full`, l, q, G],
          F = () => [``, R, J, K],
          I = () => [`solid`, `dashed`, `dotted`, `double`],
          ce = () => [
            `normal`,
            `multiply`,
            `screen`,
            `overlay`,
            `darken`,
            `lighten`,
            `color-dodge`,
            `color-burn`,
            `hard-light`,
            `soft-light`,
            `difference`,
            `exclusion`,
            `hue`,
            `saturation`,
            `color`,
            `luminosity`
          ],
          V = () => [R, le, be, ge],
          H = () => [``, `none`, p, q, G],
          U = () => [`none`, R, q, G],
          W = () => [`none`, R, q, G],
          Y = () => [R, q, G],
          X = () => [L, `full`, ...b()]
        return {
          cacheSize: 500,
          theme: {
            animate: [`spin`, `ping`, `pulse`, `bounce`],
            aspect: [`video`],
            blur: [B],
            breakpoint: [B],
            color: [ue],
            container: [B],
            'drop-shadow': [B],
            ease: [`in`, `out`, `in-out`],
            font: [de],
            'font-weight': [
              `thin`,
              `extralight`,
              `light`,
              `normal`,
              `medium`,
              `semibold`,
              `bold`,
              `extrabold`,
              `black`
            ],
            'inset-shadow': [B],
            leading: [`none`, `tight`, `snug`, `normal`, `relaxed`, `loose`],
            perspective: [`dramatic`, `near`, `normal`, `midrange`, `distant`, `none`],
            radius: [B],
            shadow: [B],
            spacing: [`px`, R],
            text: [B],
            'text-shadow': [B],
            tracking: [`tighter`, `tight`, `normal`, `wide`, `wider`, `widest`]
          },
          classGroups: {
            aspect: [{ aspect: [`auto`, `square`, L, G, q, h] }],
            container: [`container`],
            columns: [{ columns: [R, G, q, s] }],
            'break-after': [{ 'break-after': v() }],
            'break-before': [{ 'break-before': v() }],
            'break-inside': [{ 'break-inside': [`auto`, `avoid`, `avoid-page`, `avoid-column`] }],
            'box-decoration': [{ 'box-decoration': [`slice`, `clone`] }],
            box: [{ box: [`border`, `content`] }],
            display: [
              `block`,
              `inline-block`,
              `inline`,
              `flex`,
              `inline-flex`,
              `table`,
              `inline-table`,
              `table-caption`,
              `table-cell`,
              `table-column`,
              `table-column-group`,
              `table-footer-group`,
              `table-header-group`,
              `table-row-group`,
              `table-row`,
              `flow-root`,
              `grid`,
              `inline-grid`,
              `contents`,
              `list-item`,
              `hidden`
            ],
            sr: [`sr-only`, `not-sr-only`],
            float: [{ float: [`right`, `left`, `none`, `start`, `end`] }],
            clear: [{ clear: [`left`, `right`, `both`, `none`, `start`, `end`] }],
            isolation: [`isolate`, `isolation-auto`],
            'object-fit': [{ object: [`contain`, `cover`, `fill`, `none`, `scale-down`] }],
            'object-position': [{ object: y() }],
            overflow: [{ overflow: ne() }],
            'overflow-x': [{ 'overflow-x': ne() }],
            'overflow-y': [{ 'overflow-y': ne() }],
            overscroll: [{ overscroll: re() }],
            'overscroll-x': [{ 'overscroll-x': re() }],
            'overscroll-y': [{ 'overscroll-y': re() }],
            position: [`static`, `fixed`, `absolute`, `relative`, `sticky`],
            inset: [{ inset: x() }],
            'inset-x': [{ 'inset-x': x() }],
            'inset-y': [{ 'inset-y': x() }],
            start: [{ 'inset-s': x(), start: x() }],
            end: [{ 'inset-e': x(), end: x() }],
            'inset-bs': [{ 'inset-bs': x() }],
            'inset-be': [{ 'inset-be': x() }],
            top: [{ top: x() }],
            right: [{ right: x() }],
            bottom: [{ bottom: x() }],
            left: [{ left: x() }],
            visibility: [`visible`, `invisible`, `collapse`],
            z: [{ z: [z, `auto`, q, G] }],
            basis: [{ basis: [L, `full`, `auto`, s, ...b()] }],
            'flex-direction': [{ flex: [`row`, `row-reverse`, `col`, `col-reverse`] }],
            'flex-wrap': [{ flex: [`nowrap`, `wrap`, `wrap-reverse`] }],
            flex: [{ flex: [R, L, `auto`, `initial`, `none`, G] }],
            grow: [{ grow: [``, R, q, G] }],
            shrink: [{ shrink: [``, R, q, G] }],
            order: [{ order: [z, `first`, `last`, `none`, q, G] }],
            'grid-cols': [{ 'grid-cols': ie() }],
            'col-start-end': [{ col: S() }],
            'col-start': [{ 'col-start': C() }],
            'col-end': [{ 'col-end': C() }],
            'grid-rows': [{ 'grid-rows': ie() }],
            'row-start-end': [{ row: S() }],
            'row-start': [{ 'row-start': C() }],
            'row-end': [{ 'row-end': C() }],
            'grid-flow': [{ 'grid-flow': [`row`, `col`, `dense`, `row-dense`, `col-dense`] }],
            'auto-cols': [{ 'auto-cols': ae() }],
            'auto-rows': [{ 'auto-rows': ae() }],
            gap: [{ gap: b() }],
            'gap-x': [{ 'gap-x': b() }],
            'gap-y': [{ 'gap-y': b() }],
            'justify-content': [{ justify: [...w(), `normal`] }],
            'justify-items': [{ 'justify-items': [...T(), `normal`] }],
            'justify-self': [{ 'justify-self': [`auto`, ...T()] }],
            'align-content': [{ content: [`normal`, ...w()] }],
            'align-items': [{ items: [...T(), { baseline: [``, `last`] }] }],
            'align-self': [{ self: [`auto`, ...T(), { baseline: [``, `last`] }] }],
            'place-content': [{ 'place-content': w() }],
            'place-items': [{ 'place-items': [...T(), `baseline`] }],
            'place-self': [{ 'place-self': [`auto`, ...T()] }],
            p: [{ p: b() }],
            px: [{ px: b() }],
            py: [{ py: b() }],
            ps: [{ ps: b() }],
            pe: [{ pe: b() }],
            pbs: [{ pbs: b() }],
            pbe: [{ pbe: b() }],
            pt: [{ pt: b() }],
            pr: [{ pr: b() }],
            pb: [{ pb: b() }],
            pl: [{ pl: b() }],
            m: [{ m: E() }],
            mx: [{ mx: E() }],
            my: [{ my: E() }],
            ms: [{ ms: E() }],
            me: [{ me: E() }],
            mbs: [{ mbs: E() }],
            mbe: [{ mbe: E() }],
            mt: [{ mt: E() }],
            mr: [{ mr: E() }],
            mb: [{ mb: E() }],
            ml: [{ ml: E() }],
            'space-x': [{ 'space-x': b() }],
            'space-x-reverse': [`space-x-reverse`],
            'space-y': [{ 'space-y': b() }],
            'space-y-reverse': [`space-y-reverse`],
            size: [{ size: D() }],
            'inline-size': [{ inline: [`auto`, ...O()] }],
            'min-inline-size': [{ 'min-inline': [`auto`, ...O()] }],
            'max-inline-size': [{ 'max-inline': [`none`, ...O()] }],
            'block-size': [{ block: [`auto`, ...oe()] }],
            'min-block-size': [{ 'min-block': [`auto`, ...oe()] }],
            'max-block-size': [{ 'max-block': [`none`, ...oe()] }],
            w: [{ w: [s, `screen`, ...D()] }],
            'min-w': [{ 'min-w': [s, `screen`, `none`, ...D()] }],
            'max-w': [{ 'max-w': [s, `screen`, `none`, `prose`, { screen: [o] }, ...D()] }],
            h: [{ h: [`screen`, `lh`, ...D()] }],
            'min-h': [{ 'min-h': [`screen`, `lh`, `none`, ...D()] }],
            'max-h': [{ 'max-h': [`screen`, `lh`, ...D()] }],
            'font-size': [{ text: [`base`, n, J, K] }],
            'font-smoothing': [`antialiased`, `subpixel-antialiased`],
            'font-style': [`italic`, `not-italic`],
            'font-weight': [{ font: [r, we, me] }],
            'font-stretch': [
              {
                'font-stretch': [
                  `ultra-condensed`,
                  `extra-condensed`,
                  `condensed`,
                  `semi-condensed`,
                  `normal`,
                  `semi-expanded`,
                  `expanded`,
                  `extra-expanded`,
                  `ultra-expanded`,
                  le,
                  G
                ]
              }
            ],
            'font-family': [{ font: [ye, he, t] }],
            'font-features': [{ 'font-features': [G] }],
            'fvn-normal': [`normal-nums`],
            'fvn-ordinal': [`ordinal`],
            'fvn-slashed-zero': [`slashed-zero`],
            'fvn-figure': [`lining-nums`, `oldstyle-nums`],
            'fvn-spacing': [`proportional-nums`, `tabular-nums`],
            'fvn-fraction': [`diagonal-fractions`, `stacked-fractions`],
            tracking: [{ tracking: [i, q, G] }],
            'line-clamp': [{ 'line-clamp': [R, `none`, q, pe] }],
            leading: [{ leading: [a, ...b()] }],
            'list-image': [{ 'list-image': [`none`, q, G] }],
            'list-style-position': [{ list: [`inside`, `outside`] }],
            'list-style-type': [{ list: [`disc`, `decimal`, `none`, q, G] }],
            'text-alignment': [{ text: [`left`, `center`, `right`, `justify`, `start`, `end`] }],
            'placeholder-color': [{ placeholder: k() }],
            'text-color': [{ text: k() }],
            'text-decoration': [`underline`, `overline`, `line-through`, `no-underline`],
            'text-decoration-style': [{ decoration: [...I(), `wavy`] }],
            'text-decoration-thickness': [{ decoration: [R, `from-font`, `auto`, q, K] }],
            'text-decoration-color': [{ decoration: k() }],
            'underline-offset': [{ 'underline-offset': [R, `auto`, q, G] }],
            'text-transform': [`uppercase`, `lowercase`, `capitalize`, `normal-case`],
            'text-overflow': [`truncate`, `text-ellipsis`, `text-clip`],
            'text-wrap': [{ text: [`wrap`, `nowrap`, `balance`, `pretty`] }],
            indent: [{ indent: b() }],
            'vertical-align': [
              {
                align: [
                  `baseline`,
                  `top`,
                  `middle`,
                  `bottom`,
                  `text-top`,
                  `text-bottom`,
                  `sub`,
                  `super`,
                  q,
                  G
                ]
              }
            ],
            whitespace: [
              { whitespace: [`normal`, `nowrap`, `pre`, `pre-line`, `pre-wrap`, `break-spaces`] }
            ],
            break: [{ break: [`normal`, `words`, `all`, `keep`] }],
            wrap: [{ wrap: [`break-word`, `anywhere`, `normal`] }],
            hyphens: [{ hyphens: [`none`, `manual`, `auto`] }],
            content: [{ content: [`none`, q, G] }],
            'bg-attachment': [{ bg: [`fixed`, `local`, `scroll`] }],
            'bg-clip': [{ 'bg-clip': [`border`, `padding`, `content`, `text`] }],
            'bg-origin': [{ 'bg-origin': [`border`, `padding`, `content`] }],
            'bg-position': [{ bg: j() }],
            'bg-repeat': [{ bg: M() }],
            'bg-size': [{ bg: se() }],
            'bg-image': [
              {
                bg: [
                  `none`,
                  {
                    linear: [{ to: [`t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`] }, z, q, G],
                    radial: [``, q, G],
                    conic: [z, q, G]
                  },
                  Se,
                  _e
                ]
              }
            ],
            'bg-color': [{ bg: k() }],
            'gradient-from-pos': [{ from: N() }],
            'gradient-via-pos': [{ via: N() }],
            'gradient-to-pos': [{ to: N() }],
            'gradient-from': [{ from: k() }],
            'gradient-via': [{ via: k() }],
            'gradient-to': [{ to: k() }],
            rounded: [{ rounded: P() }],
            'rounded-s': [{ 'rounded-s': P() }],
            'rounded-e': [{ 'rounded-e': P() }],
            'rounded-t': [{ 'rounded-t': P() }],
            'rounded-r': [{ 'rounded-r': P() }],
            'rounded-b': [{ 'rounded-b': P() }],
            'rounded-l': [{ 'rounded-l': P() }],
            'rounded-ss': [{ 'rounded-ss': P() }],
            'rounded-se': [{ 'rounded-se': P() }],
            'rounded-ee': [{ 'rounded-ee': P() }],
            'rounded-es': [{ 'rounded-es': P() }],
            'rounded-tl': [{ 'rounded-tl': P() }],
            'rounded-tr': [{ 'rounded-tr': P() }],
            'rounded-br': [{ 'rounded-br': P() }],
            'rounded-bl': [{ 'rounded-bl': P() }],
            'border-w': [{ border: F() }],
            'border-w-x': [{ 'border-x': F() }],
            'border-w-y': [{ 'border-y': F() }],
            'border-w-s': [{ 'border-s': F() }],
            'border-w-e': [{ 'border-e': F() }],
            'border-w-bs': [{ 'border-bs': F() }],
            'border-w-be': [{ 'border-be': F() }],
            'border-w-t': [{ 'border-t': F() }],
            'border-w-r': [{ 'border-r': F() }],
            'border-w-b': [{ 'border-b': F() }],
            'border-w-l': [{ 'border-l': F() }],
            'divide-x': [{ 'divide-x': F() }],
            'divide-x-reverse': [`divide-x-reverse`],
            'divide-y': [{ 'divide-y': F() }],
            'divide-y-reverse': [`divide-y-reverse`],
            'border-style': [{ border: [...I(), `hidden`, `none`] }],
            'divide-style': [{ divide: [...I(), `hidden`, `none`] }],
            'border-color': [{ border: k() }],
            'border-color-x': [{ 'border-x': k() }],
            'border-color-y': [{ 'border-y': k() }],
            'border-color-s': [{ 'border-s': k() }],
            'border-color-e': [{ 'border-e': k() }],
            'border-color-bs': [{ 'border-bs': k() }],
            'border-color-be': [{ 'border-be': k() }],
            'border-color-t': [{ 'border-t': k() }],
            'border-color-r': [{ 'border-r': k() }],
            'border-color-b': [{ 'border-b': k() }],
            'border-color-l': [{ 'border-l': k() }],
            'divide-color': [{ divide: k() }],
            'outline-style': [{ outline: [...I(), `none`, `hidden`] }],
            'outline-offset': [{ 'outline-offset': [R, q, G] }],
            'outline-w': [{ outline: [``, R, J, K] }],
            'outline-color': [{ outline: k() }],
            shadow: [{ shadow: [``, `none`, u, Ce, ve] }],
            'shadow-color': [{ shadow: k() }],
            'inset-shadow': [{ 'inset-shadow': [`none`, ee, Ce, ve] }],
            'inset-shadow-color': [{ 'inset-shadow': k() }],
            'ring-w': [{ ring: F() }],
            'ring-w-inset': [`ring-inset`],
            'ring-color': [{ ring: k() }],
            'ring-offset-w': [{ 'ring-offset': [R, K] }],
            'ring-offset-color': [{ 'ring-offset': k() }],
            'inset-ring-w': [{ 'inset-ring': F() }],
            'inset-ring-color': [{ 'inset-ring': k() }],
            'text-shadow': [{ 'text-shadow': [`none`, d, Ce, ve] }],
            'text-shadow-color': [{ 'text-shadow': k() }],
            opacity: [{ opacity: [R, q, G] }],
            'mix-blend': [{ 'mix-blend': [...ce(), `plus-darker`, `plus-lighter`] }],
            'bg-blend': [{ 'bg-blend': ce() }],
            'mask-clip': [
              { 'mask-clip': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] },
              `mask-no-clip`
            ],
            'mask-composite': [{ mask: [`add`, `subtract`, `intersect`, `exclude`] }],
            'mask-image-linear-pos': [{ 'mask-linear': [R] }],
            'mask-image-linear-from-pos': [{ 'mask-linear-from': V() }],
            'mask-image-linear-to-pos': [{ 'mask-linear-to': V() }],
            'mask-image-linear-from-color': [{ 'mask-linear-from': k() }],
            'mask-image-linear-to-color': [{ 'mask-linear-to': k() }],
            'mask-image-t-from-pos': [{ 'mask-t-from': V() }],
            'mask-image-t-to-pos': [{ 'mask-t-to': V() }],
            'mask-image-t-from-color': [{ 'mask-t-from': k() }],
            'mask-image-t-to-color': [{ 'mask-t-to': k() }],
            'mask-image-r-from-pos': [{ 'mask-r-from': V() }],
            'mask-image-r-to-pos': [{ 'mask-r-to': V() }],
            'mask-image-r-from-color': [{ 'mask-r-from': k() }],
            'mask-image-r-to-color': [{ 'mask-r-to': k() }],
            'mask-image-b-from-pos': [{ 'mask-b-from': V() }],
            'mask-image-b-to-pos': [{ 'mask-b-to': V() }],
            'mask-image-b-from-color': [{ 'mask-b-from': k() }],
            'mask-image-b-to-color': [{ 'mask-b-to': k() }],
            'mask-image-l-from-pos': [{ 'mask-l-from': V() }],
            'mask-image-l-to-pos': [{ 'mask-l-to': V() }],
            'mask-image-l-from-color': [{ 'mask-l-from': k() }],
            'mask-image-l-to-color': [{ 'mask-l-to': k() }],
            'mask-image-x-from-pos': [{ 'mask-x-from': V() }],
            'mask-image-x-to-pos': [{ 'mask-x-to': V() }],
            'mask-image-x-from-color': [{ 'mask-x-from': k() }],
            'mask-image-x-to-color': [{ 'mask-x-to': k() }],
            'mask-image-y-from-pos': [{ 'mask-y-from': V() }],
            'mask-image-y-to-pos': [{ 'mask-y-to': V() }],
            'mask-image-y-from-color': [{ 'mask-y-from': k() }],
            'mask-image-y-to-color': [{ 'mask-y-to': k() }],
            'mask-image-radial': [{ 'mask-radial': [q, G] }],
            'mask-image-radial-from-pos': [{ 'mask-radial-from': V() }],
            'mask-image-radial-to-pos': [{ 'mask-radial-to': V() }],
            'mask-image-radial-from-color': [{ 'mask-radial-from': k() }],
            'mask-image-radial-to-color': [{ 'mask-radial-to': k() }],
            'mask-image-radial-shape': [{ 'mask-radial': [`circle`, `ellipse`] }],
            'mask-image-radial-size': [
              { 'mask-radial': [{ closest: [`side`, `corner`], farthest: [`side`, `corner`] }] }
            ],
            'mask-image-radial-pos': [{ 'mask-radial-at': te() }],
            'mask-image-conic-pos': [{ 'mask-conic': [R] }],
            'mask-image-conic-from-pos': [{ 'mask-conic-from': V() }],
            'mask-image-conic-to-pos': [{ 'mask-conic-to': V() }],
            'mask-image-conic-from-color': [{ 'mask-conic-from': k() }],
            'mask-image-conic-to-color': [{ 'mask-conic-to': k() }],
            'mask-mode': [{ mask: [`alpha`, `luminance`, `match`] }],
            'mask-origin': [
              { 'mask-origin': [`border`, `padding`, `content`, `fill`, `stroke`, `view`] }
            ],
            'mask-position': [{ mask: j() }],
            'mask-repeat': [{ mask: M() }],
            'mask-size': [{ mask: se() }],
            'mask-type': [{ 'mask-type': [`alpha`, `luminance`] }],
            'mask-image': [{ mask: [`none`, q, G] }],
            filter: [{ filter: [``, `none`, q, G] }],
            blur: [{ blur: H() }],
            brightness: [{ brightness: [R, q, G] }],
            contrast: [{ contrast: [R, q, G] }],
            'drop-shadow': [{ 'drop-shadow': [``, `none`, f, Ce, ve] }],
            'drop-shadow-color': [{ 'drop-shadow': k() }],
            grayscale: [{ grayscale: [``, R, q, G] }],
            'hue-rotate': [{ 'hue-rotate': [R, q, G] }],
            invert: [{ invert: [``, R, q, G] }],
            saturate: [{ saturate: [R, q, G] }],
            sepia: [{ sepia: [``, R, q, G] }],
            'backdrop-filter': [{ 'backdrop-filter': [``, `none`, q, G] }],
            'backdrop-blur': [{ 'backdrop-blur': H() }],
            'backdrop-brightness': [{ 'backdrop-brightness': [R, q, G] }],
            'backdrop-contrast': [{ 'backdrop-contrast': [R, q, G] }],
            'backdrop-grayscale': [{ 'backdrop-grayscale': [``, R, q, G] }],
            'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [R, q, G] }],
            'backdrop-invert': [{ 'backdrop-invert': [``, R, q, G] }],
            'backdrop-opacity': [{ 'backdrop-opacity': [R, q, G] }],
            'backdrop-saturate': [{ 'backdrop-saturate': [R, q, G] }],
            'backdrop-sepia': [{ 'backdrop-sepia': [``, R, q, G] }],
            'border-collapse': [{ border: [`collapse`, `separate`] }],
            'border-spacing': [{ 'border-spacing': b() }],
            'border-spacing-x': [{ 'border-spacing-x': b() }],
            'border-spacing-y': [{ 'border-spacing-y': b() }],
            'table-layout': [{ table: [`auto`, `fixed`] }],
            caption: [{ caption: [`top`, `bottom`] }],
            transition: [
              { transition: [``, `all`, `colors`, `opacity`, `shadow`, `transform`, `none`, q, G] }
            ],
            'transition-behavior': [{ transition: [`normal`, `discrete`] }],
            duration: [{ duration: [R, `initial`, q, G] }],
            ease: [{ ease: [`linear`, `initial`, g, q, G] }],
            delay: [{ delay: [R, q, G] }],
            animate: [{ animate: [`none`, _, q, G] }],
            backface: [{ backface: [`hidden`, `visible`] }],
            perspective: [{ perspective: [m, q, G] }],
            'perspective-origin': [{ 'perspective-origin': y() }],
            rotate: [{ rotate: U() }],
            'rotate-x': [{ 'rotate-x': U() }],
            'rotate-y': [{ 'rotate-y': U() }],
            'rotate-z': [{ 'rotate-z': U() }],
            scale: [{ scale: W() }],
            'scale-x': [{ 'scale-x': W() }],
            'scale-y': [{ 'scale-y': W() }],
            'scale-z': [{ 'scale-z': W() }],
            'scale-3d': [`scale-3d`],
            skew: [{ skew: Y() }],
            'skew-x': [{ 'skew-x': Y() }],
            'skew-y': [{ 'skew-y': Y() }],
            transform: [{ transform: [q, G, ``, `none`, `gpu`, `cpu`] }],
            'transform-origin': [{ origin: y() }],
            'transform-style': [{ transform: [`3d`, `flat`] }],
            translate: [{ translate: X() }],
            'translate-x': [{ 'translate-x': X() }],
            'translate-y': [{ 'translate-y': X() }],
            'translate-z': [{ 'translate-z': X() }],
            'translate-none': [`translate-none`],
            accent: [{ accent: k() }],
            appearance: [{ appearance: [`none`, `auto`] }],
            'caret-color': [{ caret: k() }],
            'color-scheme': [
              { scheme: [`normal`, `dark`, `light`, `light-dark`, `only-dark`, `only-light`] }
            ],
            cursor: [
              {
                cursor: [
                  `auto`,
                  `default`,
                  `pointer`,
                  `wait`,
                  `text`,
                  `move`,
                  `help`,
                  `not-allowed`,
                  `none`,
                  `context-menu`,
                  `progress`,
                  `cell`,
                  `crosshair`,
                  `vertical-text`,
                  `alias`,
                  `copy`,
                  `no-drop`,
                  `grab`,
                  `grabbing`,
                  `all-scroll`,
                  `col-resize`,
                  `row-resize`,
                  `n-resize`,
                  `e-resize`,
                  `s-resize`,
                  `w-resize`,
                  `ne-resize`,
                  `nw-resize`,
                  `se-resize`,
                  `sw-resize`,
                  `ew-resize`,
                  `ns-resize`,
                  `nesw-resize`,
                  `nwse-resize`,
                  `zoom-in`,
                  `zoom-out`,
                  q,
                  G
                ]
              }
            ],
            'field-sizing': [{ 'field-sizing': [`fixed`, `content`] }],
            'pointer-events': [{ 'pointer-events': [`auto`, `none`] }],
            resize: [{ resize: [`none`, ``, `y`, `x`] }],
            'scroll-behavior': [{ scroll: [`auto`, `smooth`] }],
            'scroll-m': [{ 'scroll-m': b() }],
            'scroll-mx': [{ 'scroll-mx': b() }],
            'scroll-my': [{ 'scroll-my': b() }],
            'scroll-ms': [{ 'scroll-ms': b() }],
            'scroll-me': [{ 'scroll-me': b() }],
            'scroll-mbs': [{ 'scroll-mbs': b() }],
            'scroll-mbe': [{ 'scroll-mbe': b() }],
            'scroll-mt': [{ 'scroll-mt': b() }],
            'scroll-mr': [{ 'scroll-mr': b() }],
            'scroll-mb': [{ 'scroll-mb': b() }],
            'scroll-ml': [{ 'scroll-ml': b() }],
            'scroll-p': [{ 'scroll-p': b() }],
            'scroll-px': [{ 'scroll-px': b() }],
            'scroll-py': [{ 'scroll-py': b() }],
            'scroll-ps': [{ 'scroll-ps': b() }],
            'scroll-pe': [{ 'scroll-pe': b() }],
            'scroll-pbs': [{ 'scroll-pbs': b() }],
            'scroll-pbe': [{ 'scroll-pbe': b() }],
            'scroll-pt': [{ 'scroll-pt': b() }],
            'scroll-pr': [{ 'scroll-pr': b() }],
            'scroll-pb': [{ 'scroll-pb': b() }],
            'scroll-pl': [{ 'scroll-pl': b() }],
            'snap-align': [{ snap: [`start`, `end`, `center`, `align-none`] }],
            'snap-stop': [{ snap: [`normal`, `always`] }],
            'snap-type': [{ snap: [`none`, `x`, `y`, `both`] }],
            'snap-strictness': [{ snap: [`mandatory`, `proximity`] }],
            touch: [{ touch: [`auto`, `none`, `manipulation`] }],
            'touch-x': [{ 'touch-pan': [`x`, `left`, `right`] }],
            'touch-y': [{ 'touch-pan': [`y`, `up`, `down`] }],
            'touch-pz': [`touch-pinch-zoom`],
            select: [{ select: [`none`, `text`, `all`, `auto`] }],
            'will-change': [{ 'will-change': [`auto`, `scroll`, `contents`, `transform`, q, G] }],
            fill: [{ fill: [`none`, ...k()] }],
            'stroke-w': [{ stroke: [R, J, K, pe] }],
            stroke: [{ stroke: [`none`, ...k()] }],
            'forced-color-adjust': [{ 'forced-color-adjust': [`auto`, `none`] }]
          },
          conflictingClassGroups: {
            overflow: [`overflow-x`, `overflow-y`],
            overscroll: [`overscroll-x`, `overscroll-y`],
            inset: [
              `inset-x`,
              `inset-y`,
              `inset-bs`,
              `inset-be`,
              `start`,
              `end`,
              `top`,
              `right`,
              `bottom`,
              `left`
            ],
            'inset-x': [`right`, `left`],
            'inset-y': [`top`, `bottom`],
            flex: [`basis`, `grow`, `shrink`],
            gap: [`gap-x`, `gap-y`],
            p: [`px`, `py`, `ps`, `pe`, `pbs`, `pbe`, `pt`, `pr`, `pb`, `pl`],
            px: [`pr`, `pl`],
            py: [`pt`, `pb`],
            m: [`mx`, `my`, `ms`, `me`, `mbs`, `mbe`, `mt`, `mr`, `mb`, `ml`],
            mx: [`mr`, `ml`],
            my: [`mt`, `mb`],
            size: [`w`, `h`],
            'font-size': [`leading`],
            'fvn-normal': [
              `fvn-ordinal`,
              `fvn-slashed-zero`,
              `fvn-figure`,
              `fvn-spacing`,
              `fvn-fraction`
            ],
            'fvn-ordinal': [`fvn-normal`],
            'fvn-slashed-zero': [`fvn-normal`],
            'fvn-figure': [`fvn-normal`],
            'fvn-spacing': [`fvn-normal`],
            'fvn-fraction': [`fvn-normal`],
            'line-clamp': [`display`, `overflow`],
            rounded: [
              `rounded-s`,
              `rounded-e`,
              `rounded-t`,
              `rounded-r`,
              `rounded-b`,
              `rounded-l`,
              `rounded-ss`,
              `rounded-se`,
              `rounded-ee`,
              `rounded-es`,
              `rounded-tl`,
              `rounded-tr`,
              `rounded-br`,
              `rounded-bl`
            ],
            'rounded-s': [`rounded-ss`, `rounded-es`],
            'rounded-e': [`rounded-se`, `rounded-ee`],
            'rounded-t': [`rounded-tl`, `rounded-tr`],
            'rounded-r': [`rounded-tr`, `rounded-br`],
            'rounded-b': [`rounded-br`, `rounded-bl`],
            'rounded-l': [`rounded-tl`, `rounded-bl`],
            'border-spacing': [`border-spacing-x`, `border-spacing-y`],
            'border-w': [
              `border-w-x`,
              `border-w-y`,
              `border-w-s`,
              `border-w-e`,
              `border-w-bs`,
              `border-w-be`,
              `border-w-t`,
              `border-w-r`,
              `border-w-b`,
              `border-w-l`
            ],
            'border-w-x': [`border-w-r`, `border-w-l`],
            'border-w-y': [`border-w-t`, `border-w-b`],
            'border-color': [
              `border-color-x`,
              `border-color-y`,
              `border-color-s`,
              `border-color-e`,
              `border-color-bs`,
              `border-color-be`,
              `border-color-t`,
              `border-color-r`,
              `border-color-b`,
              `border-color-l`
            ],
            'border-color-x': [`border-color-r`, `border-color-l`],
            'border-color-y': [`border-color-t`, `border-color-b`],
            translate: [`translate-x`, `translate-y`, `translate-none`],
            'translate-none': [`translate`, `translate-x`, `translate-y`, `translate-z`],
            'scroll-m': [
              `scroll-mx`,
              `scroll-my`,
              `scroll-ms`,
              `scroll-me`,
              `scroll-mbs`,
              `scroll-mbe`,
              `scroll-mt`,
              `scroll-mr`,
              `scroll-mb`,
              `scroll-ml`
            ],
            'scroll-mx': [`scroll-mr`, `scroll-ml`],
            'scroll-my': [`scroll-mt`, `scroll-mb`],
            'scroll-p': [
              `scroll-px`,
              `scroll-py`,
              `scroll-ps`,
              `scroll-pe`,
              `scroll-pbs`,
              `scroll-pbe`,
              `scroll-pt`,
              `scroll-pr`,
              `scroll-pb`,
              `scroll-pl`
            ],
            'scroll-px': [`scroll-pr`, `scroll-pl`],
            'scroll-py': [`scroll-pt`, `scroll-pb`],
            touch: [`touch-x`, `touch-y`, `touch-pz`],
            'touch-x': [`touch`],
            'touch-y': [`touch`],
            'touch-pz': [`touch`]
          },
          conflictingClassGroupModifiers: { 'font-size': [`leading`] },
          orderSensitiveModifiers: [
            `*`,
            `**`,
            `after`,
            `backdrop`,
            `before`,
            `details-content`,
            `file`,
            `first-letter`,
            `first-line`,
            `marker`,
            `placeholder`,
            `selection`
          ]
        }
      }),
      (Pe = oe(Ne)))
  })
function Ie(...e) {
  return Pe(r(e))
}
var Le = e(() => {
  ;(i(), Fe())
})
function Re(e) {
  let { className: t, variant: n = `primary`, type: r = `button`, ...i } = e
  return (0, ze.jsx)(`button`, {
    type: r,
    className: Ie(
      `inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`,
      n === `primary`
        ? `bg-primary text-primary-foreground hover:bg-primary/90`
        : `bg-secondary text-secondary-foreground hover:bg-secondary/90`,
      t
    ),
    ...i
  })
}
var ze,
  Be = e(() => {
    ;(Le(),
      (ze = t()),
      (Re.__docgenInfo = {
        description: ``,
        methods: [],
        displayName: `Button`,
        props: {
          variant: {
            required: !1,
            tsType: {
              name: `union`,
              raw: `'primary' | 'secondary'`,
              elements: [
                { name: `literal`, value: `'primary'` },
                { name: `literal`, value: `'secondary'` }
              ]
            },
            description: ``
          }
        }
      }))
  }),
  Ve,
  Z,
  Q,
  $,
  He
e(() => {
  ;(Be(),
    (Ve = { title: `shared/ui/Button`, component: Re, args: { children: `Button` } }),
    (Z = { args: { variant: `primary` } }),
    (Q = { args: { variant: `secondary` } }),
    ($ = { args: { disabled: !0 } }),
    (Z.parameters = {
      ...Z.parameters,
      docs: {
        ...Z.parameters?.docs,
        source: {
          originalSource: `{
  args: {
    variant: 'primary'
  }
}`,
          ...Z.parameters?.docs?.source
        }
      }
    }),
    (Q.parameters = {
      ...Q.parameters,
      docs: {
        ...Q.parameters?.docs,
        source: {
          originalSource: `{
  args: {
    variant: 'secondary'
  }
}`,
          ...Q.parameters?.docs?.source
        }
      }
    }),
    ($.parameters = {
      ...$.parameters,
      docs: {
        ...$.parameters?.docs,
        source: {
          originalSource: `{
  args: {
    disabled: true
  }
}`,
          ...$.parameters?.docs?.source
        }
      }
    }),
    (He = [`Primary`, `Secondary`, `Disabled`]))
})()
export { $ as Disabled, Z as Primary, Q as Secondary, He as __namedExportsOrder, Ve as default }

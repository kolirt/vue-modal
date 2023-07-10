(function(){var a;"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.nonce=(a=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:a.content,e.appendChild(document.createTextNode(`.vue-modal[data-v-75f88310]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;overflow-y:auto}.vue-modal__inner[data-v-75f88310]{margin-bottom:auto;opacity:0;visibility:hidden;width:100%;display:flex;justify-content:center}.vue-modal__inner.vue-modal__inner--slideDown[data-v-75f88310]{transform:translateY(-40px)}.vue-modal__inner.vue-modal__inner--slideUp[data-v-75f88310]{transform:translateY(40px)}.vue-modal__inner.vue-modal__inner--slideLeft[data-v-75f88310]{transform:translate(-40px)}.vue-modal__inner.vue-modal__inner--slideRight[data-v-75f88310]{transform:translate(40px)}.vue-modal__inner.vue-modal__inner--center[data-v-75f88310]{margin-top:auto}.vue-modal__inner.vue-modal__inner--active[data-v-75f88310]:not(.vue-modal__inner--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-48abfbb2]{width:0}.vue-modals[data-v-48abfbb2] *{box-sizing:border-box}.vue-modals-overlay[data-v-48abfbb2]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-48abfbb2]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as I, computed as f, markRaw as D, defineComponent as T, ref as M, onMounted as N, onBeforeUnmount as R, openBlock as c, createElementBlock as v, normalizeStyle as x, createElementVNode as z, normalizeClass as $, renderSlot as k, Fragment as H, renderList as V, unref as b, createBlock as P, withCtx as q, resolveDynamicComponent as F, normalizeProps as U, guardReactiveProps as j, useSlots as A, toDisplayString as G, createCommentVNode as S } from "vue";
import J from "js-event-bus";
const s = I({
  transitionTime: 200,
  animationType: "slideDown",
  modalStyle: {
    padding: "5rem 2.5rem",
    align: "center",
    "z-index": 201
  },
  overlayStyle: {
    "background-color": "rgba(0, 0, 0, 0.9)",
    "z-index": 200
  }
});
function K(e) {
  var o, t, l, a, r;
  e != null && e.transitionTime && (s.transitionTime = e.transitionTime), e != null && e.animationType && (s.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (s.modalStyle.padding = e.modalStyle.padding), (t = e.modalStyle) != null && t.align && (s.modalStyle.align = e.modalStyle.align), (l = e.modalStyle) != null && l["z-index"] && (s.modalStyle["z-index"] = e.modalStyle["z-index"])), (a = e == null ? void 0 : e.overlayStyle) != null && a["z-index"] && (s.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (r = e == null ? void 0 : e.overlayStyle) != null && r["background-color"] && (s.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
const i = I({
  modals: []
}), fe = f(() => i.modals.length > 0);
function Q(e, o, t) {
  i.modals.push(D({ component: e, props: o, options: t }));
}
function X() {
  i.modals.pop();
}
const E = new J();
function g(e, ...o) {
  E.emit(e, null, ...o);
}
function u(e, o) {
  E.on(e, o);
}
function y(e, o) {
  E.detach(e, o);
}
var n = /* @__PURE__ */ ((e) => (e.Open = "open", e.Opened = "opened", e.Close = "close", e.Closed = "closed", e))(n || {});
function Y(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
async function ve(e, o, t) {
  t != null && t.force && await Z(!1);
  const l = i.modals.length;
  return Q(
    e,
    o
    /*, options*/
  ), g(n.Open), new Promise((a, r) => {
    function _(m) {
      m.index === l && (y(n.Closed, _), m.success ? a(m.data) : r());
    }
    u(n.Closed, _);
  });
}
function ye(e) {
  return new Promise((o) => {
    function t(l) {
      y(n.Closed, t), o(l.data);
    }
    u(n.Closed, t), g(n.Close, { success: !0, data: e });
  });
}
function W() {
  return new Promise((e) => {
    function o() {
      y(n.Closed, o), e();
    }
    u(n.Closed, o), g(n.Close, { success: !1 });
  });
}
function Z(e = !0) {
  return new Promise((o) => {
    function t() {
      y(n.Closed, t);
      for (let l = i.modals.length - 1; l >= 0; l--)
        i.modals.splice(l, 1), g(n.Closed, {
          index: l,
          success: !1
        });
      o();
    }
    u(n.Closed, t), g(n.Close, { success: !1, forceCloseAll: e });
  });
}
const w = /* @__PURE__ */ T({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 }
  },
  setup(e) {
    const o = e, t = M(!1), l = f(() => o.index !== i.modals.length - 1), a = f(() => s.animationType !== "none" && s.transitionTime || 0), r = f(() => {
      var d, C;
      return {
        padding: (d = s.modalStyle) == null ? void 0 : d.padding,
        "z-index": (C = s.modalStyle) == null ? void 0 : C["z-index"]
      };
    }), _ = f(() => ({
      transition: `opacity ${a.value}ms ease, visibility ${a.value}ms ease, transform ${a.value}ms ease`
    })), m = f(() => {
      var d;
      return [
        {
          "vue-modal__inner--active": t.value,
          "vue-modal__inner--hide": l.value,
          "vue-modal__inner--center": ((d = s.modalStyle) == null ? void 0 : d.align) === "center"
        },
        `vue-modal__inner--${s.animationType}`
      ];
    });
    function h(d) {
      i.modals.length - 1 === o.index && (t.value = !1, setTimeout(g, a.value, n.Closed, {
        index: o.index,
        success: d.success,
        data: d.data
      }));
    }
    function p(d) {
      Y(d) && i.modals.length - 1 === o.index && W();
    }
    return N(() => {
      setTimeout(() => {
        t.value = !0;
      }, o.index > 0 ? a.value : 0), u(n.Close, h), document.addEventListener("keydown", p), g(n.Opened);
    }), R(() => {
      y(n.Close, h), document.removeEventListener("keydown", p);
    }), (d, C) => (c(), v("div", {
      class: "vue-modal",
      style: x(r.value)
    }, [
      z("div", {
        class: $(["vue-modal__inner", m.value]),
        style: x(_.value)
      }, [
        k(d.$slots, "default", {}, void 0, !0)
      ], 6)
    ], 4));
  }
});
const B = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [l, a] of o)
    t[l] = a;
  return t;
}, O = /* @__PURE__ */ B(w, [["__scopeId", "data-v-75f88310"]]);
function ee() {
  var l;
  const e = document.createElement("div");
  e.style.visibility = "hidden", e.style.overflow = "scroll", document.body.appendChild(e);
  const o = document.createElement("div");
  e.appendChild(o);
  const t = e.offsetWidth - o.offsetWidth;
  return (l = e.parentNode) == null || l.removeChild(e), t;
}
function oe() {
  const e = M(ee());
  function o() {
    document.documentElement.style.overflow = "hidden", document.documentElement.scrollHeight > document.documentElement.clientHeight && (document.body.style.paddingRight = `${e.value}px`);
  }
  function t() {
    document.documentElement.style.overflow = "auto", document.body.style.paddingRight = "0px";
  }
  function l(a) {
    a ? o() : t();
  }
  return {
    paddingSize: e,
    toggleLock: l
  };
}
const te = { class: "vue-modals" }, le = /* @__PURE__ */ T({
  __name: "ModalTarget",
  setup(e) {
    const o = s.animationType !== "none" && s.transitionTime || 0, t = f(() => ({
      ...s == null ? void 0 : s.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), l = M(!1), a = f(() => i.modals.length && !l.value);
    function r({ forceCloseAll: p }) {
      (i.modals.length === 1 && p !== !1 || p) && (l.value = !0, setTimeout(() => {
        l.value = !1;
      }, o));
    }
    const _ = oe();
    function m() {
      _.toggleLock(!1);
    }
    function h() {
      _.toggleLock(!0);
    }
    return N(() => {
      u(n.Close, r), u(n.Closed, m), u(n.Open, h);
    }), R(() => {
      y(n.Close, r), y(n.Closed, m), y(n.Open, h);
    }), (p, d) => (c(), v("div", te, [
      (c(!0), v(H, null, V(b(i).modals, (C, L) => (c(), P(O, {
        index: L,
        key: L
      }, {
        default: q(() => [
          (c(), P(F(C.component), U(j(C.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      z("div", {
        class: $(["vue-modals-overlay", { active: a.value }]),
        style: x(t.value)
      }, null, 6)
    ]));
  }
});
const ne = /* @__PURE__ */ B(le, [["__scopeId", "data-v-48abfbb2"]]), ae = {
  key: 0,
  class: "vue-modal-header"
}, se = {
  key: 0,
  class: "vue-modal-title"
}, de = { class: "vue-modal-body" }, ie = {
  key: 1,
  class: "vue-modal-footer"
}, re = /* @__PURE__ */ T({
  __name: "SimpleModal",
  props: {
    title: {},
    showClose: { type: Boolean, default: !0 },
    size: {
      type: String,
      default: "sm",
      validator(e) {
        return ["sm", "md", "lg", "xl", "xxl"].includes(e);
      }
    }
  },
  setup(e) {
    const o = e, t = A();
    return (l, a) => (c(), v("div", {
      class: $(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (c(), v("div", ae, [
        o.title ? (c(), v("h1", se, G(o.title), 1)) : S("", !0),
        o.showClose ? (c(), v("button", {
          key: 1,
          onClick: a[0] || (a[0] = (r) => b(W)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : S("", !0)
      ])) : S("", !0),
      z("div", de, [
        k(l.$slots, "default", {}, void 0, !0)
      ]),
      b(t).footer ? (c(), v("div", ie, [
        k(l.$slots, "footer", {}, void 0, !0)
      ])) : S("", !0)
    ], 2));
  }
});
const ce = /* @__PURE__ */ B(re, [["__scopeId", "data-v-39a87773"]]);
function _e(e) {
  return {
    install(o) {
      K(e || {}), o.component("ModalTarget", ne), o.component("SimpleModal", ce), u(n.Closed, X);
    }
  };
}
export {
  y as $off,
  u as $on,
  n as Events,
  ne as ModalTarget,
  Z as closeAllModals,
  W as closeModal,
  ye as confirmModal,
  _e as createModal,
  fe as isOpened,
  ve as openModal,
  oe as useLock
};

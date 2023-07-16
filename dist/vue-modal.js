(function(){var e;"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.nonce=(e=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:e.content,a.appendChild(document.createTextNode(`.vue-modal[data-v-0195a498]{position:fixed;top:0;left:0;width:100%;height:100%;overflow-y:auto;opacity:0;visibility:hidden;display:flex;justify-content:center;flex-wrap:wrap}.vue-modal.vue-modal--slideDown[data-v-0195a498]{transform:translateY(-40px)}.vue-modal.vue-modal--slideUp[data-v-0195a498]{transform:translateY(40px)}.vue-modal.vue-modal--slideLeft[data-v-0195a498]{transform:translate(-40px)}.vue-modal.vue-modal--slideRight[data-v-0195a498]{transform:translate(40px)}.vue-modal.vue-modal--center[data-v-0195a498]{align-items:center}.vue-modal.vue-modal--top[data-v-0195a498]{align-items:flex-start}.vue-modal.vue-modal--active[data-v-0195a498]:not(.vue-modal--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-90fab32e]{width:0}.vue-modals[data-v-90fab32e] *{box-sizing:border-box}.vue-modals-overlay[data-v-90fab32e]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-90fab32e]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as W, computed as C, markRaw as q, defineComponent as b, ref as M, onMounted as D, onBeforeUnmount as I, openBlock as r, createElementBlock as v, normalizeClass as z, normalizeStyle as H, renderSlot as k, Fragment as F, renderList as U, unref as T, createBlock as R, withCtx as A, resolveDynamicComponent as G, normalizeProps as J, guardReactiveProps as K, createElementVNode as V, useSlots as Q, toDisplayString as X, createCommentVNode as x } from "vue";
import Y from "js-event-bus";
const d = W({
  transitionTime: 200,
  animationType: "slideDown",
  modalStyle: {
    padding: void 0,
    align: "center",
    "z-index": 201
  },
  overlayStyle: {
    "background-color": "rgba(0, 0, 0, 0.9)",
    "z-index": 200
  }
});
function Z(e) {
  var o, t, l, a, c;
  e != null && e.transitionTime && (d.transitionTime = e.transitionTime), e != null && e.animationType && (d.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (d.modalStyle.padding = e.modalStyle.padding), (t = e.modalStyle) != null && t.align && (d.modalStyle.align = e.modalStyle.align), (l = e.modalStyle) != null && l["z-index"] && (d.modalStyle["z-index"] = e.modalStyle["z-index"])), (a = e == null ? void 0 : e.overlayStyle) != null && a["z-index"] && (d.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (c = e == null ? void 0 : e.overlayStyle) != null && c["background-color"] && (d.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
const i = W({
  modals: []
}), ge = C(() => i.modals.length > 0);
function w(e, o, t) {
  i.modals.push(q({ component: e, props: o, options: t }));
}
function O() {
  i.modals.pop();
}
const $ = new Y();
function h(e, ...o) {
  $.emit(e, null, ...o);
}
function y(e, o) {
  $.on(e, o);
}
function _(e, o) {
  $.detach(e, o);
}
var n = /* @__PURE__ */ ((e) => (e.Open = "open", e.Opened = "opened", e.Close = "close", e.Closed = "closed", e))(n || {});
function ee(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
async function pe(e, o, t) {
  t != null && t.force && i.modals.length && await oe(!1);
  const l = i.modals.length;
  return w(e, o, t), h(n.Open), new Promise((a, c) => {
    function g(u) {
      u.index === l && (_(n.Closed, g), u.success ? a(u.data) : c());
    }
    y(n.Closed, g);
  });
}
function Ce(e) {
  return new Promise((o) => {
    function t(l) {
      _(n.Closed, t), o(l.data);
    }
    y(n.Closed, t), h(n.Close, { success: !0, data: e });
  });
}
function j() {
  return new Promise((e) => {
    function o() {
      _(n.Closed, o), e();
    }
    y(n.Closed, o), h(n.Close, { success: !1 });
  });
}
function oe(e = !0) {
  return new Promise((o) => {
    function t() {
      _(n.Closed, t);
      for (let l = i.modals.length - 1; l >= 0; l--)
        i.modals.splice(l, 1), h(n.Closed, {
          index: l,
          success: !1
        });
      o();
    }
    y(n.Closed, t), h(n.Close, { success: !1, forceCloseAll: e });
  });
}
const te = /* @__PURE__ */ b({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 },
    item: { type: Object }
  },
  setup(e) {
    const o = e, t = M(!1), l = C(() => o.index !== i.modals.length - 1), a = C(() => d.animationType !== "none" && d.transitionTime || 0), c = C(() => {
      var s, p, m, f, B, L, P, N;
      return {
        padding: ((m = (p = (s = o.item) == null ? void 0 : s.options) == null ? void 0 : p.modalStyle) == null ? void 0 : m.padding) ?? ((f = d.modalStyle) == null ? void 0 : f.padding),
        "z-index": ((P = (L = (B = o.item) == null ? void 0 : B.options) == null ? void 0 : L.modalStyle) == null ? void 0 : P["z-index"]) ?? ((N = d.modalStyle) == null ? void 0 : N["z-index"]),
        transition: `opacity ${a.value}ms ease, visibility ${a.value}ms ease, transform ${a.value}ms ease`
      };
    }), g = C(() => {
      var s, p, m, f;
      return [
        {
          "vue-modal--active": t.value,
          "vue-modal--hide": l.value
        },
        `vue-modal--${((m = (p = (s = o.item) == null ? void 0 : s.options) == null ? void 0 : p.modalStyle) == null ? void 0 : m.align) ?? ((f = d.modalStyle) == null ? void 0 : f.align)}`,
        `vue-modal--${d.animationType}`
      ];
    });
    function u(s) {
      i.modals.length - 1 === o.index && (t.value = !1, setTimeout(h, a.value, n.Closed, {
        index: o.index,
        success: s.success,
        data: s.data
      }));
    }
    function S(s) {
      ee(s) && i.modals.length - 1 === o.index && j();
    }
    return D(() => {
      setTimeout(() => {
        t.value = !0;
      }, o.index > 0 ? a.value : 0), y(n.Close, u), document.addEventListener("keydown", S), h(n.Opened);
    }), I(() => {
      _(n.Close, u), document.removeEventListener("keydown", S);
    }), (s, p) => (r(), v("div", {
      class: z(["vue-modal", g.value]),
      style: H(c.value)
    }, [
      k(s.$slots, "default", {}, void 0, !0)
    ], 6));
  }
});
const E = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [l, a] of o)
    t[l] = a;
  return t;
}, le = /* @__PURE__ */ E(te, [["__scopeId", "data-v-0195a498"]]);
function ne() {
  var l;
  const e = document.createElement("div");
  e.style.visibility = "hidden", e.style.overflow = "scroll", document.body.appendChild(e);
  const o = document.createElement("div");
  e.appendChild(o);
  const t = e.offsetWidth - o.offsetWidth;
  return (l = e.parentNode) == null || l.removeChild(e), t;
}
function ae() {
  const e = M(ne());
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
const de = { class: "vue-modals" }, se = /* @__PURE__ */ b({
  __name: "ModalTarget",
  setup(e) {
    const o = d.animationType !== "none" && d.transitionTime || 0, t = C(() => ({
      ...d == null ? void 0 : d.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), l = M(!1), a = C(() => i.modals.length && !l.value);
    function c({ forceCloseAll: s }) {
      (i.modals.length === 1 && s !== !1 || s) && (l.value = !0, setTimeout(() => {
        l.value = !1;
      }, o));
    }
    const g = ae();
    function u() {
      g.toggleLock(!1);
    }
    function S() {
      g.toggleLock(!0);
    }
    return D(() => {
      y(n.Close, c), y(n.Closed, u), y(n.Open, S);
    }), I(() => {
      _(n.Close, c), _(n.Closed, u), _(n.Open, S);
    }), (s, p) => (r(), v("div", de, [
      (r(!0), v(F, null, U(T(i).modals, (m, f) => (r(), R(le, {
        index: f,
        item: m,
        key: f
      }, {
        default: A(() => [
          (r(), R(G(m.component), J(K(m.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index", "item"]))), 128)),
      V("div", {
        class: z(["vue-modals-overlay", { active: a.value }]),
        style: H(t.value)
      }, null, 6)
    ]));
  }
});
const ie = /* @__PURE__ */ E(se, [["__scopeId", "data-v-90fab32e"]]), ce = {
  key: 0,
  class: "vue-modal-header"
}, re = {
  key: 0,
  class: "vue-modal-title"
}, ue = { class: "vue-modal-body" }, me = {
  key: 1,
  class: "vue-modal-footer"
}, ye = /* @__PURE__ */ b({
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
    const o = e, t = Q();
    return (l, a) => (r(), v("div", {
      class: z(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (r(), v("div", ce, [
        o.title ? (r(), v("h1", re, X(o.title), 1)) : x("", !0),
        o.showClose ? (r(), v("button", {
          key: 1,
          onClick: a[0] || (a[0] = (c) => T(j)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : x("", !0)
      ])) : x("", !0),
      V("div", ue, [
        k(l.$slots, "default", {}, void 0, !0)
      ]),
      T(t).footer ? (r(), v("div", me, [
        k(l.$slots, "footer", {}, void 0, !0)
      ])) : x("", !0)
    ], 2));
  }
});
const fe = /* @__PURE__ */ E(ye, [["__scopeId", "data-v-39a87773"]]);
function he(e) {
  return {
    install(o) {
      Z(e || {}), o.component("ModalTarget", ie), o.component("SimpleModal", fe), y(n.Closed, O);
    }
  };
}
export {
  _ as $off,
  y as $on,
  n as Events,
  ie as ModalTarget,
  oe as closeAllModals,
  j as closeModal,
  Ce as confirmModal,
  he as createModal,
  ge as isOpened,
  pe as openModal,
  ae as useLock
};

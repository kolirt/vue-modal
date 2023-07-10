(function(){var a;"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.nonce=(a=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:a.content,e.appendChild(document.createTextNode(`.vue-modal[data-v-5f79c1cd]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;overflow-y:auto}.vue-modal__inner[data-v-5f79c1cd]{margin-top:auto;margin-bottom:auto;height:auto;opacity:0;visibility:hidden;width:100%;display:flex;justify-content:center}.vue-modal__inner.vue-modal__inner--slideDown[data-v-5f79c1cd]{transform:translateY(-40px)}.vue-modal__inner.vue-modal__inner--slideUp[data-v-5f79c1cd]{transform:translateY(40px)}.vue-modal__inner.vue-modal__inner--slideLeft[data-v-5f79c1cd]{transform:translate(-40px)}.vue-modal__inner.vue-modal__inner--slideRight[data-v-5f79c1cd]{transform:translate(40px)}.vue-modal__inner.vue-modal__inner--active[data-v-5f79c1cd]:not(.vue-modal__inner--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-48abfbb2]{width:0}.vue-modals[data-v-48abfbb2] *{box-sizing:border-box}.vue-modals-overlay[data-v-48abfbb2]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-48abfbb2]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as I, computed as f, markRaw as D, defineComponent as M, ref as z, onMounted as N, onBeforeUnmount as R, openBlock as r, createElementBlock as y, normalizeStyle as k, createElementVNode as $, normalizeClass as E, renderSlot as b, Fragment as H, renderList as V, unref as T, createBlock as P, withCtx as j, resolveDynamicComponent as q, normalizeProps as F, guardReactiveProps as U, useSlots as A, toDisplayString as G, createCommentVNode as x } from "vue";
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
  var o, t, l, a, i;
  e != null && e.transitionTime && (s.transitionTime = e.transitionTime), e != null && e.animationType && (s.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (s.modalStyle.padding = e.modalStyle.padding), (t = e.modalStyle) != null && t.align && (s.modalStyle.align = e.modalStyle.align), (l = e.modalStyle) != null && l["z-index"] && (s.modalStyle["z-index"] = e.modalStyle["z-index"])), (a = e == null ? void 0 : e.overlayStyle) != null && a["z-index"] && (s.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (i = e == null ? void 0 : e.overlayStyle) != null && i["background-color"] && (s.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
const d = I({
  modals: []
}), fe = f(() => d.modals.length > 0);
function Q(e, o, t) {
  d.modals.push(D({ component: e, props: o, options: t }));
}
function X() {
  d.modals.pop();
}
const B = new J();
function g(e, ...o) {
  B.emit(e, null, ...o);
}
function u(e, o) {
  B.on(e, o);
}
function v(e, o) {
  B.detach(e, o);
}
var n = /* @__PURE__ */ ((e) => (e.Open = "open", e.Opened = "opened", e.Close = "close", e.Closed = "closed", e))(n || {});
function Y(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
async function ye(e, o, t) {
  t != null && t.force && await Z(!1);
  const l = d.modals.length;
  return Q(
    e,
    o
    /*, options*/
  ), g(n.Open), new Promise((a, i) => {
    function _(m) {
      m.index === l && (v(n.Closed, _), m.success ? a(m.data) : i());
    }
    u(n.Closed, _);
  });
}
function ve(e) {
  return new Promise((o) => {
    function t(l) {
      v(n.Closed, t), o(l.data);
    }
    u(n.Closed, t), g(n.Close, { success: !0, data: e });
  });
}
function W() {
  return new Promise((e) => {
    function o() {
      v(n.Closed, o), e();
    }
    u(n.Closed, o), g(n.Close, { success: !1 });
  });
}
function Z(e = !0) {
  return new Promise((o) => {
    function t() {
      v(n.Closed, t);
      for (let l = d.modals.length - 1; l >= 0; l--)
        d.modals.splice(l, 1), g(n.Closed, {
          index: l,
          success: !1
        });
      o();
    }
    u(n.Closed, t), g(n.Close, { success: !1, forceCloseAll: e });
  });
}
const w = /* @__PURE__ */ M({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 }
  },
  setup(e) {
    const o = e, t = z(!1), l = f(() => o.index !== d.modals.length - 1), a = f(() => s.animationType !== "none" && s.transitionTime || 0), i = f(() => {
      var c, C, S;
      return {
        padding: (c = s.modalStyle) == null ? void 0 : c.padding,
        "z-index": (C = s.modalStyle) == null ? void 0 : C["z-index"],
        "justify-content": (S = s.modalStyle) == null ? void 0 : S.align
      };
    }), _ = f(() => ({
      transition: `opacity ${a.value}ms ease, visibility ${a.value}ms ease, transform ${a.value}ms ease`
    })), m = f(() => [
      {
        "vue-modal__inner--active": t.value,
        "vue-modal__inner--hide": l.value
      },
      `vue-modal__inner--${s.animationType}`
    ]);
    function h(c) {
      d.modals.length - 1 === o.index && (t.value = !1, setTimeout(g, a.value, n.Closed, {
        index: o.index,
        success: c.success,
        data: c.data
      }));
    }
    function p(c) {
      Y(c) && d.modals.length - 1 === o.index && W();
    }
    return N(() => {
      setTimeout(() => {
        t.value = !0;
      }, o.index > 0 ? a.value : 0), u(n.Close, h), document.addEventListener("keydown", p), g(n.Opened);
    }), R(() => {
      v(n.Close, h), document.removeEventListener("keydown", p);
    }), (c, C) => (r(), y("div", {
      class: "vue-modal",
      style: k(i.value)
    }, [
      $("div", {
        class: E(["vue-modal__inner", m.value]),
        style: k(_.value)
      }, [
        b(c.$slots, "default", {}, void 0, !0)
      ], 6)
    ], 4));
  }
});
const L = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [l, a] of o)
    t[l] = a;
  return t;
}, O = /* @__PURE__ */ L(w, [["__scopeId", "data-v-5f79c1cd"]]);
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
  const e = z(ee());
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
const te = { class: "vue-modals" }, le = /* @__PURE__ */ M({
  __name: "ModalTarget",
  setup(e) {
    const o = s.animationType !== "none" && s.transitionTime || 0, t = f(() => ({
      ...s == null ? void 0 : s.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), l = z(!1), a = f(() => d.modals.length && !l.value);
    function i({ forceCloseAll: p }) {
      (d.modals.length === 1 && p !== !1 || p) && (l.value = !0, setTimeout(() => {
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
      u(n.Close, i), u(n.Closed, m), u(n.Open, h);
    }), R(() => {
      v(n.Close, i), v(n.Closed, m), v(n.Open, h);
    }), (p, c) => (r(), y("div", te, [
      (r(!0), y(H, null, V(T(d).modals, (C, S) => (r(), P(O, {
        index: S,
        key: S
      }, {
        default: j(() => [
          (r(), P(q(C.component), F(U(C.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      $("div", {
        class: E(["vue-modals-overlay", { active: a.value }]),
        style: k(t.value)
      }, null, 6)
    ]));
  }
});
const ne = /* @__PURE__ */ L(le, [["__scopeId", "data-v-48abfbb2"]]), ae = {
  key: 0,
  class: "vue-modal-header"
}, se = {
  key: 0,
  class: "vue-modal-title"
}, de = { class: "vue-modal-body" }, ie = {
  key: 1,
  class: "vue-modal-footer"
}, ce = /* @__PURE__ */ M({
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
    return (l, a) => (r(), y("div", {
      class: E(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (r(), y("div", ae, [
        o.title ? (r(), y("h1", se, G(o.title), 1)) : x("", !0),
        o.showClose ? (r(), y("button", {
          key: 1,
          onClick: a[0] || (a[0] = (i) => T(W)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : x("", !0)
      ])) : x("", !0),
      $("div", de, [
        b(l.$slots, "default", {}, void 0, !0)
      ]),
      T(t).footer ? (r(), y("div", ie, [
        b(l.$slots, "footer", {}, void 0, !0)
      ])) : x("", !0)
    ], 2));
  }
});
const re = /* @__PURE__ */ L(ce, [["__scopeId", "data-v-39a87773"]]);
function _e(e) {
  return {
    install(o) {
      K(e || {}), o.component("ModalTarget", ne), o.component("SimpleModal", re), u(n.Closed, X);
    }
  };
}
export {
  v as $off,
  u as $on,
  n as Events,
  ne as ModalTarget,
  Z as closeAllModals,
  W as closeModal,
  ve as confirmModal,
  _e as createModal,
  fe as isOpened,
  ye as openModal,
  oe as useLock
};

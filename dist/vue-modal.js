(function(){var e;"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.nonce=(e=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:e.content,a.appendChild(document.createTextNode(`.vue-modal[data-v-1421616b]{position:fixed;top:0;left:0;width:100%;height:100%;overflow-y:auto;opacity:0;visibility:hidden;display:flex;justify-content:center;flex-wrap:wrap}.vue-modal.vue-modal--slideDown[data-v-1421616b]{transform:translateY(-40px)}.vue-modal.vue-modal--slideUp[data-v-1421616b]{transform:translateY(40px)}.vue-modal.vue-modal--slideLeft[data-v-1421616b]{transform:translate(-40px)}.vue-modal.vue-modal--slideRight[data-v-1421616b]{transform:translate(40px)}.vue-modal.vue-modal--center[data-v-1421616b]{align-items:center}.vue-modal.vue-modal--top[data-v-1421616b]{align-items:flex-start}.vue-modal.vue-modal--active[data-v-1421616b]:not(.vue-modal--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-48abfbb2]{width:0}.vue-modals[data-v-48abfbb2] *{box-sizing:border-box}.vue-modals-overlay[data-v-48abfbb2]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-48abfbb2]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as L, computed as _, markRaw as I, defineComponent as k, ref as b, onMounted as P, onBeforeUnmount as N, openBlock as r, createElementBlock as f, normalizeClass as T, normalizeStyle as R, renderSlot as S, Fragment as H, renderList as V, unref as x, createBlock as B, withCtx as q, resolveDynamicComponent as F, normalizeProps as U, guardReactiveProps as j, createElementVNode as W, useSlots as A, toDisplayString as G, createCommentVNode as h } from "vue";
import J from "js-event-bus";
const s = L({
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
function K(e) {
  var o, t, l, a, c;
  e != null && e.transitionTime && (s.transitionTime = e.transitionTime), e != null && e.animationType && (s.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (s.modalStyle.padding = e.modalStyle.padding), (t = e.modalStyle) != null && t.align && (s.modalStyle.align = e.modalStyle.align), (l = e.modalStyle) != null && l["z-index"] && (s.modalStyle["z-index"] = e.modalStyle["z-index"])), (a = e == null ? void 0 : e.overlayStyle) != null && a["z-index"] && (s.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (c = e == null ? void 0 : e.overlayStyle) != null && c["background-color"] && (s.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
const i = L({
  modals: []
}), fe = _(() => i.modals.length > 0);
function Q(e, o, t) {
  i.modals.push(I({ component: e, props: o, options: t }));
}
function X() {
  i.modals.pop();
}
const M = new J();
function g(e, ...o) {
  M.emit(e, null, ...o);
}
function m(e, o) {
  M.on(e, o);
}
function v(e, o) {
  M.detach(e, o);
}
var n = /* @__PURE__ */ ((e) => (e.Open = "open", e.Opened = "opened", e.Close = "close", e.Closed = "closed", e))(n || {});
function Y(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
async function ve(e, o, t) {
  t != null && t.force && i.modals.length && await Z(!1);
  const l = i.modals.length;
  return Q(
    e,
    o
    /*, options*/
  ), g(n.Open), new Promise((a, c) => {
    function y(u) {
      u.index === l && (v(n.Closed, y), u.success ? a(u.data) : c());
    }
    m(n.Closed, y);
  });
}
function ye(e) {
  return new Promise((o) => {
    function t(l) {
      v(n.Closed, t), o(l.data);
    }
    m(n.Closed, t), g(n.Close, { success: !0, data: e });
  });
}
function D() {
  return new Promise((e) => {
    function o() {
      v(n.Closed, o), e();
    }
    m(n.Closed, o), g(n.Close, { success: !1 });
  });
}
function Z(e = !0) {
  return new Promise((o) => {
    function t() {
      v(n.Closed, t);
      for (let l = i.modals.length - 1; l >= 0; l--)
        i.modals.splice(l, 1), g(n.Closed, {
          index: l,
          success: !1
        });
      o();
    }
    m(n.Closed, t), g(n.Close, { success: !1, forceCloseAll: e });
  });
}
const w = /* @__PURE__ */ k({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 }
  },
  setup(e) {
    const o = e, t = b(!1), l = _(() => o.index !== i.modals.length - 1), a = _(() => s.animationType !== "none" && s.transitionTime || 0), c = _(() => {
      var d, C;
      return {
        padding: (d = s.modalStyle) == null ? void 0 : d.padding,
        "z-index": (C = s.modalStyle) == null ? void 0 : C["z-index"],
        transition: `opacity ${a.value}ms ease, visibility ${a.value}ms ease, transform ${a.value}ms ease`
      };
    }), y = _(() => {
      var d;
      return [
        {
          "vue-modal--active": t.value,
          "vue-modal--hide": l.value
        },
        `vue-modal--${(d = s.modalStyle) == null ? void 0 : d.align}`,
        `vue-modal--${s.animationType}`
      ];
    });
    function u(d) {
      i.modals.length - 1 === o.index && (t.value = !1, setTimeout(g, a.value, n.Closed, {
        index: o.index,
        success: d.success,
        data: d.data
      }));
    }
    function p(d) {
      Y(d) && i.modals.length - 1 === o.index && D();
    }
    return P(() => {
      setTimeout(() => {
        t.value = !0;
      }, o.index > 0 ? a.value : 0), m(n.Close, u), document.addEventListener("keydown", p), g(n.Opened);
    }), N(() => {
      v(n.Close, u), document.removeEventListener("keydown", p);
    }), (d, C) => (r(), f("div", {
      class: T(["vue-modal", y.value]),
      style: R(c.value)
    }, [
      S(d.$slots, "default", {}, void 0, !0)
    ], 6));
  }
});
const $ = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [l, a] of o)
    t[l] = a;
  return t;
}, O = /* @__PURE__ */ $(w, [["__scopeId", "data-v-1421616b"]]);
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
  const e = b(ee());
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
const te = { class: "vue-modals" }, le = /* @__PURE__ */ k({
  __name: "ModalTarget",
  setup(e) {
    const o = s.animationType !== "none" && s.transitionTime || 0, t = _(() => ({
      ...s == null ? void 0 : s.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), l = b(!1), a = _(() => i.modals.length && !l.value);
    function c({ forceCloseAll: d }) {
      (i.modals.length === 1 && d !== !1 || d) && (l.value = !0, setTimeout(() => {
        l.value = !1;
      }, o));
    }
    const y = oe();
    function u() {
      y.toggleLock(!1);
    }
    function p() {
      y.toggleLock(!0);
    }
    return P(() => {
      m(n.Close, c), m(n.Closed, u), m(n.Open, p);
    }), N(() => {
      v(n.Close, c), v(n.Closed, u), v(n.Open, p);
    }), (d, C) => (r(), f("div", te, [
      (r(!0), f(H, null, V(x(i).modals, (z, E) => (r(), B(O, {
        index: E,
        key: E
      }, {
        default: q(() => [
          (r(), B(F(z.component), U(j(z.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      W("div", {
        class: T(["vue-modals-overlay", { active: a.value }]),
        style: R(t.value)
      }, null, 6)
    ]));
  }
});
const ne = /* @__PURE__ */ $(le, [["__scopeId", "data-v-48abfbb2"]]), ae = {
  key: 0,
  class: "vue-modal-header"
}, se = {
  key: 0,
  class: "vue-modal-title"
}, de = { class: "vue-modal-body" }, ie = {
  key: 1,
  class: "vue-modal-footer"
}, ce = /* @__PURE__ */ k({
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
    return (l, a) => (r(), f("div", {
      class: T(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (r(), f("div", ae, [
        o.title ? (r(), f("h1", se, G(o.title), 1)) : h("", !0),
        o.showClose ? (r(), f("button", {
          key: 1,
          onClick: a[0] || (a[0] = (c) => x(D)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : h("", !0)
      ])) : h("", !0),
      W("div", de, [
        S(l.$slots, "default", {}, void 0, !0)
      ]),
      x(t).footer ? (r(), f("div", ie, [
        S(l.$slots, "footer", {}, void 0, !0)
      ])) : h("", !0)
    ], 2));
  }
});
const re = /* @__PURE__ */ $(ce, [["__scopeId", "data-v-39a87773"]]);
function _e(e) {
  return {
    install(o) {
      K(e || {}), o.component("ModalTarget", ne), o.component("SimpleModal", re), m(n.Closed, X);
    }
  };
}
export {
  v as $off,
  m as $on,
  n as Events,
  ne as ModalTarget,
  Z as closeAllModals,
  D as closeModal,
  ye as confirmModal,
  _e as createModal,
  fe as isOpened,
  ve as openModal,
  oe as useLock
};

(function(){var a;"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.nonce=(a=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:a.content,e.appendChild(document.createTextNode(`.vue-modal[data-v-2b817101]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;overflow-y:auto}.vue-modal__inner[data-v-2b817101]{margin-top:auto;margin-bottom:auto;height:auto;opacity:0;visibility:hidden;width:100%;display:flex;justify-content:center}.vue-modal__inner.vue-modal__inner--slideDown[data-v-2b817101]{transform:translateY(-40px)}.vue-modal__inner.vue-modal__inner--slideUp[data-v-2b817101]{transform:translateY(40px)}.vue-modal__inner.vue-modal__inner--slideLeft[data-v-2b817101]{transform:translate(-40px)}.vue-modal__inner.vue-modal__inner--slideRight[data-v-2b817101]{transform:translate(40px)}.vue-modal__inner.vue-modal__inner--active[data-v-2b817101]:not(.vue-modal__inner--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-cda44deb]{width:0}.vue-modals[data-v-cda44deb] *{box-sizing:border-box}.vue-modals-overlay[data-v-cda44deb]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-cda44deb]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as I, markRaw as D, defineComponent as M, ref as $, computed as g, onMounted as N, onBeforeUnmount as R, openBlock as m, createElementBlock as f, normalizeStyle as k, createElementVNode as z, normalizeClass as B, renderSlot as b, Fragment as V, renderList as j, unref as T, createBlock as P, withCtx as q, resolveDynamicComponent as F, normalizeProps as U, guardReactiveProps as A, useSlots as G, toDisplayString as H, createCommentVNode as x } from "vue";
import J from "js-event-bus";
var t = /* @__PURE__ */ ((e) => (e.Open = "open", e.Opened = "opened", e.Close = "close", e.Closed = "closed", e))(t || {});
const i = I({
  modals: []
});
function K(e, o, l) {
  i.modals.push(D({ component: e, props: o, options: l }));
}
function Q() {
  i.modals.pop();
}
const E = new J();
function p(e, ...o) {
  E.emit(e, null, ...o);
}
function v(e, o) {
  E.on(e, o);
}
function _(e, o) {
  E.detach(e, o);
}
async function me(e, o, l) {
  l != null && l.force && await X(!1);
  const n = i.modals.length;
  return K(
    e,
    o
    /*, options*/
  ), p(t.Open), new Promise((s, a) => {
    function r(c) {
      c.index === n && (_(t.Closed, r), c.success ? s(c.data) : a());
    }
    v(t.Closed, r);
  });
}
function ve(e) {
  return new Promise((o) => {
    function l(n) {
      _(t.Closed, l), o(n.data);
    }
    v(t.Closed, l), p(t.Close, { success: !0, data: e });
  });
}
function W() {
  return new Promise((e) => {
    function o() {
      _(t.Closed, o), e();
    }
    v(t.Closed, o), p(t.Close, { success: !1 });
  });
}
function X(e = !0) {
  return new Promise((o) => {
    function l() {
      _(t.Closed, l);
      for (let n = i.modals.length - 1; n >= 0; n--)
        i.modals.splice(n, 1), p(t.Closed, {
          index: n,
          success: !1
        });
      o();
    }
    v(t.Closed, l), p(t.Close, { success: !1, forceCloseAll: e });
  });
}
const d = I({
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
function Y(e) {
  var o, l, n, s, a;
  e != null && e.transitionTime && (d.transitionTime = e.transitionTime), e != null && e.animationType && (d.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (d.modalStyle.padding = e.modalStyle.padding), (l = e.modalStyle) != null && l.align && (d.modalStyle.align = e.modalStyle.align), (n = e.modalStyle) != null && n["z-index"] && (d.modalStyle["z-index"] = e.modalStyle["z-index"])), (s = e == null ? void 0 : e.overlayStyle) != null && s["z-index"] && (d.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (a = e == null ? void 0 : e.overlayStyle) != null && a["background-color"] && (d.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
function Z(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
const w = /* @__PURE__ */ M({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 }
  },
  setup(e) {
    const o = e, l = $(!1), n = g(() => o.index !== i.modals.length - 1), s = g(() => d.animationType !== "none" ? d.transitionTime : 0), a = g(() => {
      var u, h, S;
      return {
        padding: (u = d.modalStyle) == null ? void 0 : u.padding,
        "z-index": (h = d.modalStyle) == null ? void 0 : h["z-index"],
        "justify-content": (S = d.modalStyle) == null ? void 0 : S.align
      };
    }), r = g(() => ({
      transition: `opacity ${s.value}ms ease, visibility ${s.value}ms ease, transform ${s.value}ms ease`
    })), c = g(() => [
      {
        "vue-modal__inner--active": l.value,
        "vue-modal__inner--hide": n.value
      },
      `vue-modal__inner--${d.animationType}`
    ]);
    function y(u) {
      i.modals.length - 1 === o.index && (l.value = !1, setTimeout(p, s.value, t.Closed, {
        index: o.index,
        success: u.success,
        data: u.data
      }));
    }
    function C(u) {
      Z(u) && i.modals.length - 1 === o.index && W();
    }
    return N(() => {
      setTimeout(() => {
        l.value = !0;
      }, o.index > 0 ? s.value : 0), v(t.Close, y), document.addEventListener("keydown", C), p(t.Opened);
    }), R(() => {
      _(t.Close, y), document.removeEventListener("keydown", C);
    }), (u, h) => (m(), f("div", {
      class: "vue-modal",
      style: k(a.value)
    }, [
      z("div", {
        class: B(["vue-modal__inner", c.value]),
        style: k(r.value)
      }, [
        b(u.$slots, "default", {}, void 0, !0)
      ], 6)
    ], 4));
  }
});
const L = (e, o) => {
  const l = e.__vccOpts || e;
  for (const [n, s] of o)
    l[n] = s;
  return l;
}, O = /* @__PURE__ */ L(w, [["__scopeId", "data-v-2b817101"]]);
function ee() {
  const e = $(null);
  function o() {
    var y;
    const a = document.createElement("div");
    a.style.visibility = "hidden", a.style.overflow = "scroll", document.body.appendChild(a);
    const r = document.createElement("div");
    a.appendChild(r);
    const c = a.offsetWidth - r.offsetWidth;
    return (y = a.parentNode) == null || y.removeChild(a), c;
  }
  function l() {
    document.documentElement.style.overflow = "hidden", document.body.style.paddingRight = `${e.value}px`;
  }
  function n() {
    document.documentElement.style.overflow = "auto", document.body.style.paddingRight = "0px";
  }
  function s(a) {
    e.value === null && (e.value = o()), a ? l() : n();
  }
  return {
    paddingSize: e,
    toggleLock: s
  };
}
const oe = { class: "vue-modals" }, le = /* @__PURE__ */ M({
  __name: "ModalTarget",
  setup(e) {
    const o = d.animationType !== "none" ? d.transitionTime : 0, l = g(() => ({
      ...d == null ? void 0 : d.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), n = $(!1), s = g(() => i.modals.length && !n.value);
    function a({ forceCloseAll: C }) {
      (i.modals.length === 1 && C !== !1 || C) && (n.value = !0, setTimeout(() => {
        n.value = !1;
      }, o));
    }
    const r = ee();
    function c() {
      r.toggleLock(!1);
    }
    function y() {
      r.toggleLock(!0);
    }
    return N(() => {
      v(t.Close, a), v(t.Closed, c), v(t.Open, y);
    }), R(() => {
      _(t.Close, a), _(t.Closed, c), _(t.Open, y);
    }), (C, u) => (m(), f("div", oe, [
      (m(!0), f(V, null, j(T(i).modals, (h, S) => (m(), P(O, {
        index: S,
        key: S
      }, {
        default: q(() => [
          (m(), P(F(h.component), U(A(h.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      z("div", {
        class: B(["vue-modals-overlay", { active: s.value }]),
        style: k(l.value)
      }, null, 6)
    ]));
  }
});
const te = /* @__PURE__ */ L(le, [["__scopeId", "data-v-cda44deb"]]), ne = {
  key: 0,
  class: "vue-modal-header"
}, ae = {
  key: 0,
  class: "vue-modal-title"
}, se = { class: "vue-modal-body" }, de = {
  key: 1,
  class: "vue-modal-footer"
}, ie = /* @__PURE__ */ M({
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
    const o = e, l = G();
    return (n, s) => (m(), f("div", {
      class: B(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (m(), f("div", ne, [
        o.title ? (m(), f("h1", ae, H(o.title), 1)) : x("", !0),
        o.showClose ? (m(), f("button", {
          key: 1,
          onClick: s[0] || (s[0] = (a) => T(W)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : x("", !0)
      ])) : x("", !0),
      z("div", se, [
        b(n.$slots, "default", {}, void 0, !0)
      ]),
      T(l).footer ? (m(), f("div", de, [
        b(n.$slots, "footer", {}, void 0, !0)
      ])) : x("", !0)
    ], 2));
  }
});
const re = /* @__PURE__ */ L(ie, [["__scopeId", "data-v-39a87773"]]);
function ye(e) {
  return {
    install(o) {
      Y(e || {}), o.component("ModalTarget", te), o.component("SimpleModal", re), v(t.Closed, Q);
    }
  };
}
export {
  _ as $off,
  v as $on,
  t as Events,
  X as closeAllModals,
  W as closeModal,
  ve as confirmModal,
  ye as createModal,
  me as openModal
};

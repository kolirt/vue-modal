(function(){var a;"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.nonce=(a=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:a.content,e.appendChild(document.createTextNode(`.vue-modal[data-v-d70c7025]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex}.vue-modal__inner[data-v-d70c7025]{margin-top:auto;margin-bottom:auto;height:auto;opacity:0;visibility:hidden;width:100%;display:flex;justify-content:center}.vue-modal__inner.vue-modal__inner--slideDown[data-v-d70c7025]{transform:translateY(-40px)}.vue-modal__inner.vue-modal__inner--slideUp[data-v-d70c7025]{transform:translateY(40px)}.vue-modal__inner.vue-modal__inner--slideLeft[data-v-d70c7025]{transform:translate(-40px)}.vue-modal__inner.vue-modal__inner--slideRight[data-v-d70c7025]{transform:translate(40px)}.vue-modal__inner.vue-modal__inner--active[data-v-d70c7025]:not(.vue-modal__inner--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-f0689ea2]{width:0}.vue-modals[data-v-f0689ea2] *{box-sizing:border-box}.vue-modals-overlay[data-v-f0689ea2]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-f0689ea2]{opacity:1;visibility:visible}.vue-modal-content[data-v-39a87773]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-39a87773]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-39a87773]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-39a87773]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-39a87773]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-39a87773]{width:100%;max-width:1400px}.vue-modal-header[data-v-39a87773]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-39a87773]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-39a87773]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-39a87773]:hover{opacity:1}.vue-modal-body[data-v-39a87773]{padding:1rem}.vue-modal-footer[data-v-39a87773]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;gap:.25rem}`)),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as I, markRaw as V, defineComponent as M, ref as D, computed as v, onMounted as L, onBeforeUnmount as N, openBlock as r, createElementBlock as m, normalizeStyle as h, createElementVNode as $, normalizeClass as z, renderSlot as T, Fragment as j, renderList as q, unref as k, createBlock as P, withCtx as F, resolveDynamicComponent as U, normalizeProps as A, guardReactiveProps as G, useSlots as H, toDisplayString as J, createCommentVNode as x } from "vue";
import K from "js-event-bus";
var a = /* @__PURE__ */ ((e) => (e.Close = "close", e.Closed = "closed", e))(a || {});
const d = I({
  modals: []
});
function Q(e, o, l) {
  d.modals.push(V({ component: e, props: o, options: l }));
}
function W() {
  d.modals.pop();
}
const b = new K();
function S(e, ...o) {
  b.emit(e, null, ...o);
}
function y(e, o) {
  b.on(e, o);
}
function f(e, o) {
  b.detach(e, o);
}
async function ue(e, o, l) {
  l != null && l.force && await X(!1);
  const t = d.modals.length;
  return Q(
    e,
    o
    /*, options*/
  ), new Promise((n, i) => {
    function u(_) {
      _.index === t && (f(a.Closed, u), _.success ? n(_.data) : i());
    }
    y(a.Closed, u);
  });
}
function me(e) {
  return new Promise((o) => {
    function l(t) {
      f(a.Closed, l), o(t.data);
    }
    y(a.Closed, l), S(a.Close, { success: !0, data: e });
  });
}
function R() {
  return new Promise((e) => {
    function o() {
      f(a.Closed, o), e();
    }
    y(a.Closed, o), S(a.Close, { success: !1 });
  });
}
function X(e = !0) {
  return new Promise((o) => {
    function l() {
      f(a.Closed, l);
      for (let t = d.modals.length - 1; t >= 0; t--)
        d.modals.splice(t, 1), S(a.Closed, {
          index: t,
          success: !1
        });
      o();
    }
    y(a.Closed, l), S(a.Close, { success: !1, forceCloseAll: e });
  });
}
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
function Y(e) {
  var o, l, t, n, i;
  e != null && e.transitionTime && (s.transitionTime = e.transitionTime), e != null && e.animationType && (s.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (s.modalStyle.padding = e.modalStyle.padding), (l = e.modalStyle) != null && l.align && (s.modalStyle.align = e.modalStyle.align), (t = e.modalStyle) != null && t["z-index"] && (s.modalStyle["z-index"] = e.modalStyle["z-index"])), (n = e == null ? void 0 : e.overlayStyle) != null && n["z-index"] && (s.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (i = e == null ? void 0 : e.overlayStyle) != null && i["background-color"] && (s.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
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
    const o = e, l = D(!1), t = v(() => o.index !== d.modals.length - 1), n = v(() => s.animationType !== "none" ? s.transitionTime : 0), i = v(() => {
      var c, p, E;
      return {
        padding: (c = s.modalStyle) == null ? void 0 : c.padding,
        "z-index": (p = s.modalStyle) == null ? void 0 : p["z-index"],
        "justify-content": (E = s.modalStyle) == null ? void 0 : E.align
      };
    }), u = v(() => ({
      transition: `opacity ${n.value}ms ease, visibility ${n.value}ms ease, transform ${n.value}ms ease`
    })), _ = v(() => [
      {
        "vue-modal__inner--active": l.value,
        "vue-modal__inner--hide": t.value
      },
      `vue-modal__inner--${s.animationType}`
    ]);
    function g(c) {
      d.modals.length - 1 === o.index && (l.value = !1, setTimeout(S, n.value, a.Closed, {
        index: o.index,
        success: c.success,
        data: c.data
      }));
    }
    function C(c) {
      Z(c) && d.modals.length - 1 === o.index && R();
    }
    return L(() => {
      setTimeout(() => {
        l.value = !0;
      }, o.index > 0 ? n.value : 0), y(a.Close, g), document.addEventListener("keydown", C);
    }), N(() => {
      f(a.Close, g), document.removeEventListener("keydown", C);
    }), (c, p) => (r(), m("div", {
      class: "vue-modal",
      style: h(i.value)
    }, [
      $("div", {
        class: z(["vue-modal__inner", _.value]),
        style: h(u.value)
      }, [
        T(c.$slots, "default", {}, void 0, !0)
      ], 6)
    ], 4));
  }
});
const B = (e, o) => {
  const l = e.__vccOpts || e;
  for (const [t, n] of o)
    l[t] = n;
  return l;
}, O = /* @__PURE__ */ B(w, [["__scopeId", "data-v-d70c7025"]]), ee = { class: "vue-modals" }, oe = /* @__PURE__ */ M({
  __name: "ModalTarget",
  setup(e) {
    const o = s.animationType !== "none" ? s.transitionTime : 0, l = v(() => ({
      ...s == null ? void 0 : s.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), t = D(!1), n = v(() => d.modals.length && !t.value);
    function i({ forceCloseAll: u }) {
      (d.modals.length === 1 && u !== !1 || u) && (t.value = !0, setTimeout(() => {
        t.value = !1;
      }, o));
    }
    return L(() => {
      y(a.Close, i);
    }), N(() => {
      f(a.Close, i);
    }), (u, _) => (r(), m("div", ee, [
      (r(!0), m(j, null, q(k(d).modals, (g, C) => (r(), P(O, {
        index: C,
        key: C
      }, {
        default: F(() => [
          (r(), P(U(g.component), A(G(g.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      $("div", {
        class: z(["vue-modals-overlay", { active: n.value }]),
        style: h(l.value)
      }, null, 6)
    ]));
  }
});
const le = /* @__PURE__ */ B(oe, [["__scopeId", "data-v-f0689ea2"]]), te = {
  key: 0,
  class: "vue-modal-header"
}, ae = {
  key: 0,
  class: "vue-modal-title"
}, se = { class: "vue-modal-body" }, ne = {
  key: 1,
  class: "vue-modal-footer"
}, de = /* @__PURE__ */ M({
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
    const o = e, l = H();
    return (t, n) => (r(), m("div", {
      class: z(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (r(), m("div", te, [
        o.title ? (r(), m("h1", ae, J(o.title), 1)) : x("", !0),
        o.showClose ? (r(), m("button", {
          key: 1,
          onClick: n[0] || (n[0] = (i) => k(R)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : x("", !0)
      ])) : x("", !0),
      $("div", se, [
        T(t.$slots, "default", {}, void 0, !0)
      ]),
      k(l).footer ? (r(), m("div", ne, [
        T(t.$slots, "footer", {}, void 0, !0)
      ])) : x("", !0)
    ], 2));
  }
});
const ie = /* @__PURE__ */ B(de, [["__scopeId", "data-v-39a87773"]]);
function ve(e) {
  return {
    install(o) {
      Y(e || {}), o.component("ModalTarget", le), o.component("SimpleModal", ie), y(a.Closed, W);
    }
  };
}
export {
  X as closeAllModals,
  R as closeModal,
  me as confirmModal,
  ve as createModal,
  ue as openModal
};

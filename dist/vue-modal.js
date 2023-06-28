(function(){var a;"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.nonce=(a=document.head.querySelector("meta[property=csp-nonce]"))==null?void 0:a.content,e.appendChild(document.createTextNode(`.vue-modal[data-v-a95f8dcb]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex}.vue-modal__inner[data-v-a95f8dcb]{margin-top:auto;margin-bottom:auto;height:auto;opacity:0;visibility:hidden;width:100%;display:flex;justify-content:center}.vue-modal__inner.vue-modal__inner--slideDown[data-v-a95f8dcb]{transform:translateY(-40px)}.vue-modal__inner.vue-modal__inner--slideUp[data-v-a95f8dcb]{transform:translateY(40px)}.vue-modal__inner.vue-modal__inner--slideLeft[data-v-a95f8dcb]{transform:translate(-40px)}.vue-modal__inner.vue-modal__inner--slideRight[data-v-a95f8dcb]{transform:translate(40px)}.vue-modal__inner.vue-modal__inner--active[data-v-a95f8dcb]:not(.vue-modal__inner--hide){transform:translate(0);opacity:1;visibility:visible}.vue-modals[data-v-5a8d87b4]{width:0}.vue-modals[data-v-5a8d87b4] *{box-sizing:border-box}.vue-modals-overlay[data-v-5a8d87b4]{position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;visibility:hidden}.vue-modals-overlay.active[data-v-5a8d87b4]{opacity:1;visibility:visible}.vue-modal-content[data-v-cc22b0fe]{background:#fff;border-radius:.5rem;font-family:inherit}.vue-modal-content.size-sm[data-v-cc22b0fe]{width:100%;max-width:576px}.vue-modal-content.size-md[data-v-cc22b0fe]{width:100%;max-width:768px}.vue-modal-content.size-lg[data-v-cc22b0fe]{width:100%;max-width:992px}.vue-modal-content.size-xl[data-v-cc22b0fe]{width:100%;max-width:1200px}.vue-modal-content.size-xxl[data-v-cc22b0fe]{width:100%;max-width:1400px}.vue-modal-header[data-v-cc22b0fe]{padding:1rem;display:flex;flex-shrink:0;align-items:center;justify-content:space-between;border-bottom:1px solid #dee2e6;border-top-left-radius:.5rem;border-top-right-radius:.5rem}.vue-modal-title[data-v-cc22b0fe]{font-size:1.25rem;font-weight:500;margin:0}.vue-modal-btn-close[data-v-cc22b0fe]{opacity:.5;width:2rem;height:2rem;background:transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;border:none;padding:0;cursor:pointer;transition:opacity .2s ease}.vue-modal-btn-close[data-v-cc22b0fe]:hover{opacity:1}.vue-modal-body[data-v-cc22b0fe]{padding:1rem}.vue-modal-footer[data-v-cc22b0fe]{padding:1rem;display:flex;flex-wrap:wrap;justify-content:flex-end;border-bottom-left-radius:.5rem;border-bottom-right-radius:.5rem;border-top:1px solid #dee2e6;column-gap:.25rem}`)),document.head.appendChild(e)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
import { reactive as D, markRaw as V, defineComponent as h, computed as y, ref as L, onMounted as N, onBeforeUnmount as P, openBlock as i, createElementBlock as u, normalizeStyle as p, createElementVNode as T, normalizeClass as k, renderSlot as x, Fragment as j, renderList as q, unref as C, createBlock as I, withCtx as F, resolveDynamicComponent as U, normalizeProps as A, guardReactiveProps as G, useSlots as H, toDisplayString as J, createCommentVNode as f } from "vue";
import K from "js-event-bus";
var d = /* @__PURE__ */ ((e) => (e.Close = "close", e.Closed = "closed", e))(d || {});
const c = D({
  modals: []
});
function Q(e, o, t) {
  c.modals.push(V({ component: e, props: o, options: t }));
}
function W() {
  c.modals.pop();
}
const b = new K();
function M(e, ...o) {
  b.emit(e, null, ...o);
}
function g(e, o) {
  b.on(e, o);
}
function $(e, o) {
  b.detach(e, o);
}
function ce(e, o) {
  const t = c.modals.length;
  return Q(
    e,
    o
    /*, options*/
  ), new Promise((a, n) => {
    function s(m) {
      m.index === t && ($(d.Closed, s), m.success ? a(m.data) : n());
    }
    g(d.Closed, s);
  });
}
function R() {
  M(d.Close, { success: !1 });
}
function ue(e) {
  M(d.Close, { success: !0, data: e });
}
const l = D({
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
function X(e) {
  var o, t, a, n, s;
  e != null && e.transitionTime && (l.transitionTime = e.transitionTime), e != null && e.animationType && (l.animationType = e.animationType), e != null && e.modalStyle && ((o = e.modalStyle) != null && o.padding && (l.modalStyle.padding = e.modalStyle.padding), (t = e.modalStyle) != null && t.align && (l.modalStyle.align = e.modalStyle.align), (a = e.modalStyle) != null && a["z-index"] && (l.modalStyle["z-index"] = e.modalStyle["z-index"])), (n = e == null ? void 0 : e.overlayStyle) != null && n["z-index"] && (l.overlayStyle["z-index"] = e.overlayStyle["z-index"]), (s = e == null ? void 0 : e.overlayStyle) != null && s["background-color"] && (l.overlayStyle["background-color"] = e.overlayStyle["background-color"]);
}
function Y(e) {
  return "key" in e ? e.key === "Escape" || e.key === "Esc" : e.keyCode === 27;
}
const Z = /* @__PURE__ */ h({
  __name: "BaseModal",
  props: {
    index: { type: Number, required: !0 }
  },
  setup(e) {
    const o = e, t = l.animationType !== "none" ? l.transitionTime : 0, a = y(() => {
      var r, S, E;
      return {
        padding: (r = l.modalStyle) == null ? void 0 : r.padding,
        "z-index": (S = l.modalStyle) == null ? void 0 : S["z-index"],
        "justify-content": (E = l.modalStyle) == null ? void 0 : E.align
      };
    }), n = y(() => ({
      transition: `opacity ${t}ms ease, visibility ${t}ms ease, transform ${t}ms ease`
    })), s = L(!1), m = y(() => o.index !== c.modals.length - 1), B = y(() => [
      {
        "vue-modal__inner--active": s.value,
        "vue-modal__inner--hide": m.value
      },
      `vue-modal__inner--${l.animationType}`
    ]);
    function v(r) {
      c.modals.length - 1 === o.index && (s.value = !1, setTimeout(M, t, d.Closed, {
        index: o.index,
        success: r.success,
        data: r.data
      }));
    }
    function _(r) {
      Y(r) && c.modals.length - 1 === o.index && R();
    }
    return N(() => {
      setTimeout(() => {
        s.value = !0;
      }, o.index > 0 ? t : 0), g(d.Close, v), document.addEventListener("keydown", _);
    }), P(() => {
      $(d.Close, v), document.removeEventListener("keydown", _);
    }), (r, S) => (i(), u("div", {
      class: "vue-modal modal",
      style: p(a.value)
    }, [
      T("div", {
        class: k(["vue-modal__inner", B.value]),
        style: p(n.value)
      }, [
        x(r.$slots, "default", {}, void 0, !0)
      ], 6)
    ], 4));
  }
});
const z = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [a, n] of o)
    t[a] = n;
  return t;
}, w = /* @__PURE__ */ z(Z, [["__scopeId", "data-v-a95f8dcb"]]), O = { class: "vue-modals" }, ee = /* @__PURE__ */ h({
  __name: "ModalTarget",
  setup(e) {
    const o = l.animationType !== "none" ? l.transitionTime : 0, t = y(() => ({
      ...l == null ? void 0 : l.overlayStyle,
      transition: `opacity ${o}ms ease, visibility ${o}ms ease`
    })), a = L(!1), n = y(() => c.modals.length && !a.value);
    function s() {
      c.modals.length === 1 && (a.value = !0, setTimeout(() => {
        a.value = !1;
      }, o));
    }
    return N(() => {
      g(d.Close, s);
    }), P(() => {
      $(d.Close, s);
    }), (m, B) => (i(), u("div", O, [
      (i(!0), u(j, null, q(C(c).modals, (v, _) => (i(), I(w, {
        index: _,
        key: _
      }, {
        default: F(() => [
          (i(), I(U(v.component), A(G(v.props)), null, 16))
        ]),
        _: 2
      }, 1032, ["index"]))), 128)),
      T("div", {
        class: k(["vue-modals-overlay", { active: n.value }]),
        style: p(t.value)
      }, null, 6)
    ]));
  }
});
const oe = /* @__PURE__ */ z(ee, [["__scopeId", "data-v-5a8d87b4"]]), te = {
  key: 0,
  class: "vue-modal-header"
}, le = {
  key: 0,
  class: "vue-modal-title"
}, ae = { class: "vue-modal-body" }, ne = {
  key: 1,
  class: "vue-modal-footer"
}, se = /* @__PURE__ */ h({
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
    const o = e, t = H();
    return (a, n) => (i(), u("div", {
      class: k(["vue-modal-content", `size-${o.size}`])
    }, [
      o.title || o.showClose ? (i(), u("div", te, [
        o.title ? (i(), u("h1", le, J(o.title), 1)) : f("", !0),
        o.showClose ? (i(), u("button", {
          key: 1,
          onClick: n[0] || (n[0] = (s) => C(R)()),
          class: "vue-modal-btn-close",
          "aria-label": "Close"
        })) : f("", !0)
      ])) : f("", !0),
      T("div", ae, [
        x(a.$slots, "default", {}, void 0, !0)
      ]),
      C(t).footer ? (i(), u("div", ne, [
        x(a.$slots, "footer", {}, void 0, !0)
      ])) : f("", !0)
    ], 2));
  }
});
const de = /* @__PURE__ */ z(se, [["__scopeId", "data-v-cc22b0fe"]]);
function me(e) {
  return {
    install(o) {
      X(e || {}), o.component("ModalTarget", oe), o.component("SimpleModal", de), g(d.Closed, W);
    }
  };
}
export {
  R as closeModal,
  ue as confirmModal,
  me as createModal,
  ce as openModal
};

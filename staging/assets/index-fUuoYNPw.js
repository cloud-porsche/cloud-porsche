import{bs as b,bt as y,bu as v,g as A,az as F,f as Y,r as $,bv as H,h as O,b6 as L}from"./index-9WrTN1Ev.js";function N(t){return b()?(y(t),!0):!1}function l(t){return typeof t=="function"?t():v(t)}const z=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const k=Object.prototype.toString,X=t=>k.call(t)==="[object Object]",Z=()=>{};function C(t,e){function n(...r){return new Promise((o,a)=>{Promise.resolve(t(()=>e.apply(this,r),{fn:e,thisArg:this,args:r})).then(o).catch(a)})}return n}const D=t=>t();function E(t=D){const e=$(!0);function n(){e.value=!1}function r(){e.value=!0}const o=(...a)=>{e.value&&t(...a)};return{isActive:H(e),pause:n,resume:r,eventFilter:o}}function P(t){return L()}function T(t,e,n={}){const{eventFilter:r=D,...o}=n;return O(t,C(r,e),o)}function I(t,e,n={}){const{eventFilter:r,...o}=n,{eventFilter:a,pause:c,resume:s,isActive:i}=E(r);return{stop:T(t,e,{...o,eventFilter:a}),pause:c,resume:s,isActive:i}}function V(t,e=!0,n){P()?A(t,n):e?t():F(t)}const _=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i,j=/[YMDHhms]o|\[([^\]]+)\]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|SSS/g;function G(t,e,n,r){let o=t<12?"AM":"PM";return r&&(o=o.split("").reduce((a,c)=>a+=`${c}.`,"")),n?o.toLowerCase():o}function u(t){const e=["th","st","nd","rd"],n=t%100;return t+(e[(n-20)%10]||e[n]||e[0])}function R(t,e,n={}){var r;const o=t.getFullYear(),a=t.getMonth(),c=t.getDate(),s=t.getHours(),i=t.getMinutes(),f=t.getSeconds(),M=t.getMilliseconds(),w=t.getDay(),d=(r=n.customMeridiem)!=null?r:G,p={Yo:()=>u(o),YY:()=>String(o).slice(-2),YYYY:()=>o,M:()=>a+1,Mo:()=>u(a+1),MM:()=>`${a+1}`.padStart(2,"0"),MMM:()=>t.toLocaleDateString(l(n.locales),{month:"short"}),MMMM:()=>t.toLocaleDateString(l(n.locales),{month:"long"}),D:()=>String(c),Do:()=>u(c),DD:()=>`${c}`.padStart(2,"0"),H:()=>String(s),Ho:()=>u(s),HH:()=>`${s}`.padStart(2,"0"),h:()=>`${s%12||12}`.padStart(1,"0"),ho:()=>u(s%12||12),hh:()=>`${s%12||12}`.padStart(2,"0"),m:()=>String(i),mo:()=>u(i),mm:()=>`${i}`.padStart(2,"0"),s:()=>String(f),so:()=>u(f),ss:()=>`${f}`.padStart(2,"0"),SSS:()=>`${M}`.padStart(3,"0"),d:()=>w,dd:()=>t.toLocaleDateString(l(n.locales),{weekday:"narrow"}),ddd:()=>t.toLocaleDateString(l(n.locales),{weekday:"short"}),dddd:()=>t.toLocaleDateString(l(n.locales),{weekday:"long"}),A:()=>d(s,i),AA:()=>d(s,i,!1,!0),a:()=>d(s,i,!0),aa:()=>d(s,i,!0,!0)};return e.replace(j,(m,S)=>{var g,h;return(h=S??((g=p[m])==null?void 0:g.call(p)))!=null?h:m})}function W(t){if(t===null)return new Date(Number.NaN);if(t===void 0)return new Date;if(t instanceof Date)return new Date(t);if(typeof t=="string"&&!/Z$/i.test(t)){const e=t.match(_);if(e){const n=e[2]-1||0,r=(e[7]||"0").substring(0,3);return new Date(e[1],n,e[3]||1,e[4]||0,e[5]||0,e[6]||0,r)}}return new Date(t)}function q(t,e="HH:mm:ss",n={}){return Y(()=>R(W(l(t)),l(e),n))}export{V as a,N as b,X as c,z as i,Z as n,l as t,q as u,I as w};

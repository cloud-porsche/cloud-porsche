const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ParkingSpotComponent-BxOqynjd.js","assets/index-BPprRNqh.js","assets/index-CJWvBbDX.css","assets/VDataTable-CwklLWKB.js","assets/VPagination-CJXWOpo_.js","assets/VPagination-osFSi_du.css","assets/VSelect-BoUmtaYN.js","assets/VChip-DRVAF1qL.js","assets/VChip-DsRJUznz.css","assets/VSelect-CgvyrPNl.css","assets/VDataTable-DXmHtqsb.css","assets/VRow-DRgvTkQL.js","assets/index-D0m80SB5.js","assets/ParkingSpotComponent-CvebGzkd.css"])))=>i.map(i=>d[i]);
import{b2 as Te,r as K,g as v,i as Je,aA as vt,h as mt,b8 as ft,d as Xe,o as L,c as H,w as U,b as Z,t as be,k as s,E as ge,a_ as de,C as Pe,b0 as Ye,a5 as ce,b9 as pt,ba as St,bb as Ue,aa as Ne,bc as W,bd as gt,be as bt,b7 as Ze,a6 as Qe,a9 as ke,aE as yt,aL as et,bf as ht,bg as kt,ac as we,b6 as le,n as X,aG as wt,bh as tt,v as Ct,bi as Vt,bj as xt,bk as $e,bl as Ft,am as lt,aq as Me,ar as at,au as ye,R as re,bm as Et,ax as Oe,bn as _t,bo as Rt,bp as Tt,at as Pt,aC as Mt,W as nt,bq as Ot,X as Ae,aY as At,aV as Dt,S as zt,y as z,j as Y,u as n,l as Nt,L as ve,m as It,V as Lt,s as ne,q as ie,p as qe,a4 as Bt,e as ue,P as ee,D as je,ag as Ut,Z as me,I as $t,a$ as Ge,F as qt,T as te,br as jt,bs as Gt,bt as Wt}from"./index-BPprRNqh.js";import{_ as Ht}from"./ProTier-WEItR_0B.js";import{V as Kt}from"./VChip-DRVAF1qL.js";import{t as Ie,w as Jt,a as Xt,b as st,i as rt,n as Yt,c as Zt}from"./index-D0m80SB5.js";import{m as Qt,a as We,V as el}from"./VSelect-BoUmtaYN.js";import{V as tl}from"./VPagination-CJXWOpo_.js";const De=rt?window:void 0,ll=rt?window.document:void 0;function ze(e){var l;const t=Ie(e);return(l=t==null?void 0:t.$el)!=null?l:t}function he(...e){let l,t,u,o;if(typeof e[0]=="string"||Array.isArray(e[0])?([t,u,o]=e,l=De):[l,t,u,o]=e,!l)return Yt;Array.isArray(t)||(t=[t]),Array.isArray(u)||(u=[u]);const m=[],C=()=>{m.forEach(w=>w()),m.length=0},b=(w,g,E,f)=>(w.addEventListener(g,E,f),()=>w.removeEventListener(g,E,f)),x=Je(()=>[ze(l),Ie(o)],([w,g])=>{if(C(),!w)return;const E=Zt(g)?{...g}:g;m.push(...t.flatMap(f=>u.map(V=>b(w,f,V,E))))},{immediate:!0,flush:"post"}),_=()=>{x(),C()};return st(_),_}function al(){const e=K(!1),l=ft();return l&&mt(()=>{e.value=!0},l),e}function nl(e){const l=al();return v(()=>(l.value,!!e()))}const fe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},pe="__vueuse_ssr_handlers__",sl=rl();function rl(){return pe in fe||(fe[pe]=fe[pe]||{}),fe[pe]}function ol(e,l){return sl[e]||l}function il(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const ul={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},He="vueuse-storage";function Se(e,l,t,u={}){var o;const{flush:m="pre",deep:C=!0,listenToStorageChanges:b=!0,writeDefaults:x=!0,mergeDefaults:_=!1,shallow:w,window:g=De,eventFilter:E,onError:f=c=>{console.error(c)},initOnMounted:V}=u,h=(w?Te:K)(typeof l=="function"?l():l);if(!t)try{t=ol("getDefaultStorage",()=>{var c;return(c=De)==null?void 0:c.localStorage})()}catch(c){f(c)}if(!t)return h;const R=Ie(l),d=il(R),P=(o=u.serializer)!=null?o:ul[d],{pause:S,resume:$}=Jt(h,()=>F(h.value),{flush:m,deep:C,eventFilter:E});g&&b&&Xt(()=>{t instanceof Storage?he(g,"storage",k):he(g,He,M),V&&k()}),V||k();function T(c,y){if(g){const p={key:e,oldValue:c,newValue:y,storageArea:t};g.dispatchEvent(t instanceof Storage?new StorageEvent("storage",p):new CustomEvent(He,{detail:p}))}}function F(c){try{const y=t.getItem(e);if(c==null)T(y,null),t.removeItem(e);else{const p=P.write(c);y!==p&&(t.setItem(e,p),T(y,p))}}catch(y){f(y)}}function A(c){const y=c?c.newValue:t.getItem(e);if(y==null)return x&&R!=null&&t.setItem(e,P.write(R)),R;if(!c&&_){const p=P.read(y);return typeof _=="function"?_(p,R):d==="object"&&!Array.isArray(p)?{...R,...p}:p}else return typeof y!="string"?y:P.read(y)}function k(c){if(!(c&&c.storageArea!==t)){if(c&&c.key==null){h.value=R;return}if(!(c&&c.key!==e)){S();try{(c==null?void 0:c.newValue)!==P.write(h.value)&&(h.value=A(c))}catch(y){f(y)}finally{c?vt($):$()}}}}function M(c){k(c.detail)}return h}const Ke=["fullscreenchange","webkitfullscreenchange","webkitendfullscreen","mozfullscreenchange","MSFullscreenChange"];function dl(e,l={}){const{document:t=ll,autoExit:u=!1}=l,o=v(()=>{var d;return(d=ze(e))!=null?d:t==null?void 0:t.querySelector("html")}),m=K(!1),C=v(()=>["requestFullscreen","webkitRequestFullscreen","webkitEnterFullscreen","webkitEnterFullScreen","webkitRequestFullScreen","mozRequestFullScreen","msRequestFullscreen"].find(d=>t&&d in t||o.value&&d in o.value)),b=v(()=>["exitFullscreen","webkitExitFullscreen","webkitExitFullScreen","webkitCancelFullScreen","mozCancelFullScreen","msExitFullscreen"].find(d=>t&&d in t||o.value&&d in o.value)),x=v(()=>["fullScreen","webkitIsFullScreen","webkitDisplayingFullscreen","mozFullScreen","msFullscreenElement"].find(d=>t&&d in t||o.value&&d in o.value)),_=["fullscreenElement","webkitFullscreenElement","mozFullScreenElement","msFullscreenElement"].find(d=>t&&d in t),w=nl(()=>o.value&&t&&C.value!==void 0&&b.value!==void 0&&x.value!==void 0),g=()=>_?(t==null?void 0:t[_])===o.value:!1,E=()=>{if(x.value){if(t&&t[x.value]!=null)return t[x.value];{const d=o.value;if((d==null?void 0:d[x.value])!=null)return!!d[x.value]}}return!1};async function f(){if(!(!w.value||!m.value)){if(b.value)if((t==null?void 0:t[b.value])!=null)await t[b.value]();else{const d=o.value;(d==null?void 0:d[b.value])!=null&&await d[b.value]()}m.value=!1}}async function V(){if(!w.value||m.value)return;E()&&await f();const d=o.value;C.value&&(d==null?void 0:d[C.value])!=null&&(await d[C.value](),m.value=!0)}async function h(){await(m.value?f():V())}const R=()=>{const d=E();(!d||d&&g())&&(m.value=d)};return he(t,Ke,R,!1),he(()=>ze(o),Ke,R,!1),u&&st(f),{isSupported:w,isFullscreen:m,enter:V,exit:f,toggle:h}}const cl={class:"pb-1"},vl=Xe({__name:"CounterCard",props:{name:{},current:{},total:{},colors:{}},setup(e){function l(t,u,o){if(!(!o||u==="none"))return t===0||o===0?u==="invert"?"tomato":void 0:t===o?u==="invert"?void 0:"tomato":(u==="invert"?t>=o/.65:t>=o/1.35)?"darkgoldenrod":"green"}return(t,u)=>(L(),H(Pe,{style:de({backgroundColor:l(t.current,t.colors,t.total),color:l(t.current,t.colors,t.total)?"white":void 0}),class:"pa-4 d-flex flex-column justify-space-evenly align-center text-center"},{default:U(()=>[Z("b",cl,be(t.name),1),Z("span",null,[s(Kt,{class:"larger"},{default:U(()=>[ge(be(t.current+(t.total?" / "+t.total:"")),1)]),_:1})])]),_:1},8,["style"]))}}),se=Ye(vl,[["__scopeId","data-v-d8d6c545"]]),Le=Symbol.for("vuetify:v-slider");function ml(e,l,t){const u=t==="vertical",o=l.getBoundingClientRect(),m="touches"in e?e.touches[0]:e;return u?m.clientY-(o.top+o.height/2):m.clientX-(o.left+o.width/2)}function fl(e,l){return"touches"in e&&e.touches.length?e.touches[0][l]:"changedTouches"in e&&e.changedTouches.length?e.changedTouches[0][l]:e[l]}const pl=ce({disabled:{type:Boolean,default:null},error:Boolean,readonly:{type:Boolean,default:null},max:{type:[Number,String],default:100},min:{type:[Number,String],default:0},step:{type:[Number,String],default:0},thumbColor:String,thumbLabel:{type:[Boolean,String],default:void 0,validator:e=>typeof e=="boolean"||e==="always"},thumbSize:{type:[Number,String],default:20},showTicks:{type:[Boolean,String],default:!1,validator:e=>typeof e=="boolean"||e==="always"},ticks:{type:[Array,Object]},tickSize:{type:[Number,String],default:2},color:String,trackColor:String,trackFillColor:String,trackSize:{type:[Number,String],default:4},direction:{type:String,default:"horizontal",validator:e=>["vertical","horizontal"].includes(e)},reverse:Boolean,...pt(),...St({elevation:2}),ripple:{type:Boolean,default:!0}},"Slider"),Sl=e=>{const l=v(()=>parseFloat(e.min)),t=v(()=>parseFloat(e.max)),u=v(()=>+e.step>0?parseFloat(e.step):0),o=v(()=>Math.max(Ue(u.value),Ue(l.value)));function m(C){if(C=parseFloat(C),u.value<=0)return C;const b=Ze(C,l.value,t.value),x=l.value%u.value,_=Math.round((b-x)/u.value)*u.value+x;return parseFloat(Math.min(_,t.value).toFixed(o.value))}return{min:l,max:t,step:u,decimals:o,roundValue:m}},gl=e=>{let{props:l,steps:t,onSliderStart:u,onSliderMove:o,onSliderEnd:m,getActiveThumb:C}=e;const{isRtl:b}=Ne(),x=W(l,"reverse"),_=v(()=>l.direction==="vertical"),w=v(()=>_.value!==x.value),{min:g,max:E,step:f,decimals:V,roundValue:h}=t,R=v(()=>parseInt(l.thumbSize,10)),d=v(()=>parseInt(l.tickSize,10)),P=v(()=>parseInt(l.trackSize,10)),S=v(()=>(E.value-g.value)/f.value),$=W(l,"disabled"),T=v(()=>l.error||l.disabled?void 0:l.thumbColor??l.color),F=v(()=>l.error||l.disabled?void 0:l.trackColor??l.color),A=v(()=>l.error||l.disabled?void 0:l.trackFillColor??l.color),k=Te(!1),M=Te(0),c=K(),y=K();function p(a){var Be;const O=l.direction==="vertical",Ce=O?"top":"left",ot=O?"height":"width",it=O?"clientY":"clientX",{[Ce]:ut,[ot]:dt}=(Be=c.value)==null?void 0:Be.$el.getBoundingClientRect(),ct=fl(a,it);let Ve=Math.min(Math.max((ct-ut-M.value)/dt,0),1)||0;return(O?w.value:w.value!==b.value)&&(Ve=1-Ve),h(g.value+Ve*(E.value-g.value))}const q=a=>{m({value:p(a)}),k.value=!1,M.value=0},N=a=>{y.value=C(a),y.value&&(y.value.focus(),k.value=!0,y.value.contains(a.target)?M.value=ml(a,y.value,l.direction):(M.value=0,o({value:p(a)})),u({value:p(a)}))},B={passive:!0,capture:!0};function j(a){o({value:p(a)})}function G(a){a.stopPropagation(),a.preventDefault(),q(a),window.removeEventListener("mousemove",j,B),window.removeEventListener("mouseup",G)}function ae(a){var O;q(a),window.removeEventListener("touchmove",j,B),(O=a.target)==null||O.removeEventListener("touchend",ae)}function oe(a){var O;N(a),window.addEventListener("touchmove",j,B),(O=a.target)==null||O.addEventListener("touchend",ae,{passive:!1})}function I(a){a.preventDefault(),N(a),window.addEventListener("mousemove",j,B),window.addEventListener("mouseup",G,{passive:!1})}const D=a=>{const O=(a-g.value)/(E.value-g.value)*100;return Ze(isNaN(O)?0:O,0,100)},J=W(l,"showTicks"),i=v(()=>J.value?l.ticks?Array.isArray(l.ticks)?l.ticks.map(a=>({value:a,position:D(a),label:a.toString()})):Object.keys(l.ticks).map(a=>({value:parseFloat(a),position:D(parseFloat(a)),label:l.ticks[a]})):S.value!==1/0?gt(S.value+1).map(a=>{const O=g.value+a*f.value;return{value:O,position:D(O)}}):[]:[]),r=v(()=>i.value.some(a=>{let{label:O}=a;return!!O})),Q={activeThumbRef:y,color:W(l,"color"),decimals:V,disabled:$,direction:W(l,"direction"),elevation:W(l,"elevation"),hasLabels:r,isReversed:x,indexFromEnd:w,min:g,max:E,mousePressed:k,numTicks:S,onSliderMousedown:I,onSliderTouchstart:oe,parsedTicks:i,parseMouseMove:p,position:D,readonly:W(l,"readonly"),rounded:W(l,"rounded"),roundValue:h,showTicks:J,startOffset:M,step:f,thumbSize:R,thumbColor:T,thumbLabel:W(l,"thumbLabel"),ticks:W(l,"ticks"),tickSize:d,trackColor:F,trackContainerRef:c,trackFillColor:A,trackSize:P,vertical:_};return bt(Le,Q),Q},bl=ce({focused:Boolean,max:{type:Number,required:!0},min:{type:Number,required:!0},modelValue:{type:Number,required:!0},position:{type:Number,required:!0},ripple:{type:[Boolean,Object],default:!0},name:String,...Qe()},"VSliderThumb"),yl=ke()({name:"VSliderThumb",directives:{Ripple:yt},props:bl(),emits:{"update:modelValue":e=>!0},setup(e,l){let{slots:t,emit:u}=l;const o=et(Le),{isRtl:m,rtlClasses:C}=Ne();if(!o)throw new Error("[Vuetify] v-slider-thumb must be used inside v-slider or v-range-slider");const{thumbColor:b,step:x,disabled:_,thumbSize:w,thumbLabel:g,direction:E,isReversed:f,vertical:V,readonly:h,elevation:R,mousePressed:d,decimals:P,indexFromEnd:S}=o,$=v(()=>_.value?void 0:R.value),{elevationClasses:T}=ht($),{textColorClasses:F,textColorStyles:A}=kt(b),{pageup:k,pagedown:M,end:c,home:y,left:p,right:q,down:N,up:B}=Vt,j=[k,M,c,y,p,q,N,B],G=v(()=>x.value?[1,2,3]:[1,5,10]);function ae(I,D){if(!j.includes(I.key))return;I.preventDefault();const J=x.value||.1,i=(e.max-e.min)/J;if([p,q,N,B].includes(I.key)){const Q=(V.value?[m.value?p:q,f.value?N:B]:S.value!==m.value?[p,B]:[q,B]).includes(I.key)?1:-1,a=I.shiftKey?2:I.ctrlKey?1:0;D=D+Q*J*G.value[a]}else if(I.key===y)D=e.min;else if(I.key===c)D=e.max;else{const r=I.key===M?1:-1;D=D-r*J*(i>100?i/10:10)}return Math.max(e.min,Math.min(e.max,D))}function oe(I){const D=ae(I,e.modelValue);D!=null&&u("update:modelValue",D)}return we(()=>{const I=le(S.value?100-e.position:e.position,"%");return s("div",{class:["v-slider-thumb",{"v-slider-thumb--focused":e.focused,"v-slider-thumb--pressed":e.focused&&d.value},e.class,C.value],style:[{"--v-slider-thumb-position":I,"--v-slider-thumb-size":le(w.value)},e.style],role:"slider",tabindex:_.value?-1:0,"aria-label":e.name,"aria-valuemin":e.min,"aria-valuemax":e.max,"aria-valuenow":e.modelValue,"aria-readonly":!!h.value,"aria-orientation":E.value,onKeydown:h.value?void 0:oe},[s("div",{class:["v-slider-thumb__surface",F.value,T.value],style:{...A.value}},null),X(s("div",{class:["v-slider-thumb__ripple",F.value],style:A.value},null),[[wt("ripple"),e.ripple,null,{circle:!0,center:!0}]]),s(tt,{origin:"bottom center"},{default:()=>{var D;return[X(s("div",{class:"v-slider-thumb__label-container"},[s("div",{class:["v-slider-thumb__label"]},[s("div",null,[((D=t["thumb-label"])==null?void 0:D.call(t,{modelValue:e.modelValue}))??e.modelValue.toFixed(x.value?P.value:1)])])]),[[Ct,g.value&&e.focused||g.value==="always"]])]}})])}),{}}}),hl=ce({start:{type:Number,required:!0},stop:{type:Number,required:!0},...Qe()},"VSliderTrack"),kl=ke()({name:"VSliderTrack",props:hl(),emits:{},setup(e,l){let{slots:t}=l;const u=et(Le);if(!u)throw new Error("[Vuetify] v-slider-track must be inside v-slider or v-range-slider");const{color:o,parsedTicks:m,rounded:C,showTicks:b,tickSize:x,trackColor:_,trackFillColor:w,trackSize:g,vertical:E,min:f,max:V,indexFromEnd:h}=u,{roundedClasses:R}=xt(C),{backgroundColorClasses:d,backgroundColorStyles:P}=$e(w),{backgroundColorClasses:S,backgroundColorStyles:$}=$e(_),T=v(()=>`inset-${E.value?"block":"inline"}-${h.value?"end":"start"}`),F=v(()=>E.value?"height":"width"),A=v(()=>({[T.value]:"0%",[F.value]:"100%"})),k=v(()=>e.stop-e.start),M=v(()=>({[T.value]:le(e.start,"%"),[F.value]:le(k.value,"%")})),c=v(()=>b.value?(E.value?m.value.slice().reverse():m.value).map((p,q)=>{var B;const N=p.value!==f.value&&p.value!==V.value?le(p.position,"%"):void 0;return s("div",{key:p.value,class:["v-slider-track__tick",{"v-slider-track__tick--filled":p.position>=e.start&&p.position<=e.stop,"v-slider-track__tick--first":p.value===f.value,"v-slider-track__tick--last":p.value===V.value}],style:{[T.value]:N}},[(p.label||t["tick-label"])&&s("div",{class:"v-slider-track__tick-label"},[((B=t["tick-label"])==null?void 0:B.call(t,{tick:p,index:q}))??p.label])])}):[]);return we(()=>s("div",{class:["v-slider-track",R.value,e.class],style:[{"--v-slider-track-size":le(g.value),"--v-slider-tick-size":le(x.value)},e.style]},[s("div",{class:["v-slider-track__background",S.value,{"v-slider-track__background--opacity":!!o.value||!w.value}],style:{...A.value,...$.value}},null),s("div",{class:["v-slider-track__fill",d.value],style:{...M.value,...P.value}},null),b.value&&s("div",{class:["v-slider-track__ticks",{"v-slider-track__ticks--always-show":b.value==="always"}]},[c.value])])),{}}}),wl=ce({...Ft(),...pl(),...lt(),modelValue:{type:[Number,String],default:0}},"VSlider"),xe=ke()({name:"VSlider",props:wl(),emits:{"update:focused":e=>!0,"update:modelValue":e=>!0,start:e=>!0,end:e=>!0},setup(e,l){let{slots:t,emit:u}=l;const o=K(),{rtlClasses:m}=Ne(),C=Sl(e),b=Me(e,"modelValue",void 0,F=>C.roundValue(F??C.min.value)),{min:x,max:_,mousePressed:w,roundValue:g,onSliderMousedown:E,onSliderTouchstart:f,trackContainerRef:V,position:h,hasLabels:R,readonly:d}=gl({props:e,steps:C,onSliderStart:()=>{u("start",b.value)},onSliderEnd:F=>{let{value:A}=F;const k=g(A);b.value=k,u("end",k)},onSliderMove:F=>{let{value:A}=F;return b.value=g(A)},getActiveThumb:()=>{var F;return(F=o.value)==null?void 0:F.$el}}),{isFocused:P,focus:S,blur:$}=at(e),T=v(()=>h(b.value));return we(()=>{const F=ye.filterProps(e),A=!!(e.label||t.label||t.prepend);return s(ye,Oe({class:["v-slider",{"v-slider--has-labels":!!t["tick-label"]||R.value,"v-slider--focused":P.value,"v-slider--pressed":w.value,"v-slider--disabled":e.disabled},m.value,e.class],style:e.style},F,{focused:P.value}),{...t,prepend:A?k=>{var M,c;return s(re,null,[((M=t.label)==null?void 0:M.call(t,k))??(e.label?s(Et,{id:k.id.value,class:"v-slider__label",text:e.label},null):void 0),(c=t.prepend)==null?void 0:c.call(t,k)])}:void 0,default:k=>{let{id:M,messagesId:c}=k;return s("div",{class:"v-slider__container",onMousedown:d.value?void 0:E,onTouchstartPassive:d.value?void 0:f},[s("input",{id:M.value,name:e.name||M.value,disabled:!!e.disabled,readonly:!!e.readonly,tabindex:"-1",value:b.value},null),s(kl,{ref:V,start:0,stop:T.value},{"tick-label":t["tick-label"]}),s(yl,{ref:o,"aria-describedby":c.value,focused:P.value,min:x.value,max:_.value,modelValue:b.value,"onUpdate:modelValue":y=>b.value=y,position:T.value,elevation:e.elevation,onFocus:S,onBlur:$,ripple:e.ripple,name:e.name},{"thumb-label":t["thumb-label"]})])}})}),{}}}),Cl=ce({indeterminate:Boolean,inset:Boolean,flat:Boolean,loading:{type:[Boolean,String],default:!1},...lt(),...Qt()},"VSwitch"),Vl=ke()({name:"VSwitch",inheritAttrs:!1,props:Cl(),emits:{"update:focused":e=>!0,"update:modelValue":e=>!0,"update:indeterminate":e=>!0},setup(e,l){let{attrs:t,slots:u}=l;const o=Me(e,"indeterminate"),m=Me(e,"modelValue"),{loaderClasses:C}=_t(e),{isFocused:b,focus:x,blur:_}=at(e),w=K(),g=Rt&&window.matchMedia("(forced-colors: active)").matches,E=v(()=>typeof e.loading=="string"&&e.loading!==""?e.loading:e.color),f=Tt(),V=v(()=>e.id||`switch-${f}`);function h(){o.value&&(o.value=!1)}function R(d){var P,S;d.stopPropagation(),d.preventDefault(),(S=(P=w.value)==null?void 0:P.input)==null||S.click()}return we(()=>{const[d,P]=Pt(t),S=ye.filterProps(e),$=We.filterProps(e);return s(ye,Oe({class:["v-switch",{"v-switch--flat":e.flat},{"v-switch--inset":e.inset},{"v-switch--indeterminate":o.value},C.value,e.class]},d,S,{modelValue:m.value,"onUpdate:modelValue":T=>m.value=T,id:V.value,focused:b.value,style:e.style}),{...u,default:T=>{let{id:F,messagesId:A,isDisabled:k,isReadonly:M,isValid:c}=T;const y={model:m,isValid:c};return s(We,Oe({ref:w},$,{modelValue:m.value,"onUpdate:modelValue":[p=>m.value=p,h],id:F.value,"aria-describedby":A.value,type:"checkbox","aria-checked":o.value?"mixed":void 0,disabled:k.value,readonly:M.value,onFocus:x,onBlur:_},P),{...u,default:p=>{let{backgroundColorClasses:q,backgroundColorStyles:N}=p;return s("div",{class:["v-switch__track",g?void 0:q.value],style:N.value,onClick:R},[u["track-true"]&&s("div",{key:"prepend",class:"v-switch__track-true"},[u["track-true"](y)]),u["track-false"]&&s("div",{key:"append",class:"v-switch__track-false"},[u["track-false"](y)])])},input:p=>{let{inputNode:q,icon:N,backgroundColorClasses:B,backgroundColorStyles:j}=p;return s(re,null,[q,s("div",{class:["v-switch__thumb",{"v-switch__thumb--filled":N||e.loading},e.inset||g?void 0:B.value],style:e.inset?void 0:j.value},[u.thumb?s(Mt,{defaults:{VIcon:{icon:N,size:"x-small"}}},{default:()=>[u.thumb({...y,icon:N})]}):s(tt,null,{default:()=>[e.loading?s(Ot,{name:"v-switch",active:!0,color:c.value===!1?void 0:E.value},{default:G=>u.loader?u.loader(G):s(Ae,{active:G.isActive,color:G.color,indeterminate:!0,size:"16",width:"2"},null)}):N&&s(nt,{key:String(N),icon:N,size:"x-small"},null)]})])])}})}})}),{}}}),xl={class:"pa-2 pr-8"},Fl={class:"d-flex align-center ga-2"},El={class:"property-main"},_l={class:"d-flex align-center justify-space-evenly"},Fe=-100,Ee=150,_e=-1200,Re=300,Rl=Xe({__name:"[id]",setup(e){var J;const l=Gt(()=>Wt(()=>import("./ParkingSpotComponent-BxOqynjd.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]))),t=At("fullscreen"),{isFullscreen:u,toggle:o}=dl(t),m=Dt(),C=zt(),b=v(()=>C.params.id),x=v(()=>C.params.tenantId),[_,w,g,E]=[!1,40,-100,80],f=Se("view-settings-iso",_),V=Se("view-settings-x",w),h=Se("view-settings-y",g),R=Se("view-settings-zoom",E);function d(){f.value=_,V.value=w,h.value=g,R.value=E}const P=K(!1),S=v(()=>m.properties.find(i=>i.id===b.value)),$=((J=S.value)==null?void 0:J.simulationState)??z.SimulationState.OFF,T=K($===z.SimulationState.OFF?z.SimulationState.NORMAL:$);Je(S,()=>{var i;S.value&&S.value.simulationState&&T.value!==((i=S.value)==null?void 0:i.simulationState)&&S.value.simulationState!==z.SimulationState.OFF&&(T.value=S.value.simulationState)});const F=K(1),A=v(()=>{var i,r;return(r=(i=S.value)==null?void 0:i.layers)==null?void 0:r[F.value-1]}),k=v(()=>{var i;return(i=S.value)==null?void 0:i.layers.flatMap(r=>r.parkingSpots).filter(r=>!r.placeholder)}),M=v(()=>{var i;return((i=k.value)==null?void 0:i.length)??0}),c=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.state===z.ParkingSpotState.FREE))??[]}),y=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.state===z.ParkingSpotState.OCCUPIED||r.state===z.ParkingSpotState.CHARGING))??[]}),p=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.state===z.ParkingSpotState.RESERVED))??[]}),q=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.state===z.ParkingSpotState.OUT_OF_ORDER))??[]}),N=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.electricCharging))??[]}),B=v(()=>{var i;return((i=k.value)==null?void 0:i.filter(r=>r.state===z.ParkingSpotState.CHARGING))??[]}),j=v(()=>{var i;return((i=S.value)==null?void 0:i.customers)??[]}),G=[{id:"Electric",state:z.ParkingSpotState.FREE,electricCharging:!0,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Electric charging spot"},{id:"Charging",state:z.ParkingSpotState.CHARGING,electricCharging:!0,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Electric charging spot that is currently charging"},{id:"Free",state:z.ParkingSpotState.FREE,electricCharging:!1,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Free spot"},{id:"Occupied",state:z.ParkingSpotState.OCCUPIED,electricCharging:!1,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Occupied spot"},{id:"Reserved",state:z.ParkingSpotState.RESERVED,electricCharging:!1,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Reserved spot"},{id:"Out of Order",state:z.ParkingSpotState.OUT_OF_ORDER,electricCharging:!1,lastStateChange:new Date,customer:null,placeholder:!1,explanation:"Spot out of order"}];function ae(i){i.button!==2||!f.value||(P.value=!0)}function oe(i){!P.value||!f.value||(V.value+=i.movementX/8,h.value+=i.movementY,V.value<Fe&&(V.value=Fe),V.value>Ee&&(V.value=Ee),h.value<_e&&(h.value=_e),h.value>Re&&(h.value=Re))}function I(i){P.value=!1}function D(i,r){m.updateParkingSpot(b.value,i,{id:i,state:r})}return(i,r)=>{const Q=Ht;return L(),Y("div",{ref:"fullscreen",onMouseup:r[15]||(r[15]=a=>I()),style:de(n(P)?{cursor:"all-scroll"}:{})},[n(S)?(L(),H(Nt,{key:0,density:"compact",class:"d-flex align-center pa-1 pl-4 pr-4"},{default:U(()=>[Z("span",xl,[Z("b",null,"Id: "+be(n(S).id??"Unknown"),1)]),s(ne,{vertical:"",inset:""}),X(s(ie,{class:"ml-4",density:"comfortable",to:`/${n(x)}/defects/${n(S).id}`,icon:"mdi-hammer-screwdriver"},null,8,["to"]),[[te,"Defects"]]),X(s(ie,{class:"ml-4",density:"comfortable",icon:"mdi-sync",onClick:r[0]||(r[0]=a=>n(m).fetchProperty(n(S).id))},null,512),[[te,"Refresh"]]),X(s(ie,{class:"ml-4 mr-4",icon:n(u)?"mdi-fullscreen-exit":"mdi-fullscreen",onClick:n(o),density:"comfortable"},null,8,["icon","onClick"]),[[te,"Toggle Fullscreen Spot View"]]),s(ne,{vertical:"",inset:""}),s(qe),s(Q,null,{default:U(()=>[Z("div",Fl,[s(Bt,{disabled:n(ue)().hasAdminAccess,activator:"parent",text:"Admin only"},null,8,["disabled"]),s(el,{label:"Simulation Speed",items:[n(z.SimulationState).SLOW,n(z.SimulationState).NORMAL,n(z.SimulationState).FAST],modelValue:n(T),"onUpdate:modelValue":[r[1]||(r[1]=a=>ee(T)?T.value=a:null),r[2]||(r[2]=a=>{T.value=a,n(m).updateSimulationSpeed(n(b),n(T))})],disabled:!n(ue)().wsStatus||!n(ue)().hasAdminAccess,density:"compact","hide-details":"","min-width":"150px"},null,8,["items","modelValue","disabled"]),s(ie,{disabled:!n(ue)().wsStatus||!n(ue)().hasAdminAccess,"append-icon":n(S).simulationState!==n(z.SimulationState).OFF?"mdi-pause":"mdi-play",text:"Simulation",onClick:r[3]||(r[3]=a=>n(S).simulationState!==n(z.SimulationState).OFF?n(m).setSimulationInactive(n(S).id):n(m).setSimulationActive(n(S).id,n(T)))},null,8,["disabled","append-icon"])])]),_:1})]),_:1})):ve("",!0),s(It,{indeterminate:n(m).loading,color:n(m).error?"error":void 0},null,8,["indeterminate","color"]),n(S)?(L(),H(Lt,{key:1},{default:U(()=>[Z("div",El,[s(se,{name:"FREE",current:n(c).length,total:n(M),colors:"invert"},null,8,["current","total"]),s(se,{name:"OCCUPIED",current:n(y).length,total:n(M),colors:"default"},null,8,["current","total"]),s(se,{name:"RESERVED",current:n(p).length,total:n(M),colors:"none"},null,8,["current","total"]),s(se,{name:"CHARGING",current:n(B).length,total:n(N).length,colors:"none"},null,8,["current","total"]),s(se,{name:"OUT OF ORDER",current:n(q).length,colors:"none"},null,8,["current"]),X(s(se,{name:"CUSTOMERS",current:n(j).length,colors:"none"},null,8,["current"]),[[te,"Count of total daily customers","bottom"]]),s(Pe,{class:"legend"},{default:U(()=>[s(je,{class:"d-flex ga-2 align-center"},{default:U(()=>[r[17]||(r[17]=ge("Legend ")),X((L(),H(nt,{size:"sm"},{default:U(()=>r[16]||(r[16]=[ge("mdi-information-outline ")])),_:1})),[[te,"Hover to see what each spot represents","top"]])]),_:1}),s(Ut,null,{default:U(()=>[Z("span",_l,[(L(),Y(re,null,me(G,a=>s(n(l),{key:a.id,spot:a,explanation:a.explanation},null,8,["spot","explanation"])),64))])]),_:1})]),_:1}),n(A)?(L(),H(Pe,{key:0,class:"full-grid-row",onMousedown:r[11]||(r[11]=a=>ae(a)),onMousemove:r[12]||(r[12]=a=>oe(a)),onMouseup:r[13]||(r[13]=a=>I(a)),onContextmenu:r[14]||(r[14]=$t(()=>{},["prevent"]))},{default:U(()=>[s(je,{class:"d-flex align-center spot-title"},{default:U(()=>[ge(be(n(S).name)+" ",1),s(qe),s(ne,{vertical:"",inset:"",class:"ma-4"}),s(Q,{class:"d-flex align-center flex-grow-1",modelValue:n(f),"onUpdate:modelValue":r[9]||(r[9]=a=>ee(f)?f.value=a:null)},{default:U(()=>[X(s(Vl,{label:"Isometric",flat:"",color:n(f)?"primary":"default",modelValue:n(f),"onUpdate:modelValue":r[4]||(r[4]=a=>ee(f)?f.value=a:null),"hide-details":""},null,8,["color","modelValue"]),[[te,"Toggle Isometric View"]]),X(s(ie,{class:"ml-2",icon:"mdi-backup-restore",density:"comfortable",flat:"",onClick:r[5]||(r[5]=a=>d())},null,512),[[te,"Reset View Settings to defaults","bottom"]]),s(ne,{vertical:"",inset:"",class:"ma-4"}),s(xe,{modelValue:n(R),"onUpdate:modelValue":r[6]||(r[6]=a=>ee(R)?R.value=a:null),min:20,max:120,step:1,"prepend-icon":"mdi-magnify-minus","append-icon":"mdi-magnify-plus",disabled:!n(f),density:"comfortable","thumb-label":"","hide-details":""},null,8,["modelValue","disabled"]),s(xe,{modelValue:n(V),"onUpdate:modelValue":r[7]||(r[7]=a=>ee(V)?V.value=a:null),min:Fe,max:Ee,step:1,"prepend-icon":"mdi-axis-x-arrow",disabled:!n(f),density:"comfortable","thumb-label":"","hide-details":""},null,8,["modelValue","disabled"]),s(xe,{modelValue:n(h),"onUpdate:modelValue":r[8]||(r[8]=a=>ee(h)?h.value=a:null),min:_e,max:Re,step:1,"prepend-icon":"mdi-axis-z-arrow",disabled:!n(f),density:"comfortable","thumb-label":"","hide-details":""},null,8,["modelValue","disabled"])]),_:1},8,["modelValue"]),s(ne,{vertical:"",inset:"",class:"ma-4"}),s(tl,{modelValue:n(F),"onUpdate:modelValue":r[10]||(r[10]=a=>ee(F)?F.value=a:null),length:n(S).layers.length,variant:"outlined","total-visible":"5",density:"comfortable"},null,8,["modelValue","length"])]),_:1}),s(ne),n(S).layers.length>0?(L(),Y("div",{key:0,style:de(n(f)?{transform:`translate3d(${n(V)}%, ${n(h)}px, 0)`}:{})},[n(f)?n(f)?(L(!0),Y(re,{key:1},me(n(S).layers,a=>(L(),Y("div",{id:"spot-container",ref_for:!0,ref:"spot-container",class:jt(["isometric",a.floor===n(A).floor?"preferred-isometric":""]),style:de({gridTemplateColumns:`repeat(${a.columns}, minmax(2em, 1fr))`,top:`${a.floor*100}px`,zIndex:a.floor,zoom:`${n(R)}%`})},[(L(),H(Ge,null,{fallback:U(()=>[s(Ae,{indeterminate:""})]),default:U(()=>[(L(!0),Y(re,null,me(a.parkingSpots,O=>(L(),H(n(l),{key:O.id,spot:O,onStateChange:Ce=>D(O.id,Ce)},null,8,["spot","onStateChange"]))),128))]),_:2},1024))],6))),256)):ve("",!0):(L(),Y("div",{key:0,id:"spot-container",ref:"spot-container",class:"overflow-auto",style:de(n(A)?{gridTemplateColumns:`repeat(${n(A).columns}, minmax(2em, 1fr))`}:{})},[(L(),H(Ge,null,{fallback:U(()=>[s(Ae,{indeterminate:""})]),default:U(()=>[(L(!0),Y(re,null,me(n(A).parkingSpots,a=>(L(),H(n(l),{key:a.id,spot:a,onStateChange:O=>D(a.id,O)},null,8,["spot","onStateChange"]))),128))]),_:1}))],4))],4)):(L(),H(qt,{key:1,class:"pa-4"},{default:U(()=>r[18]||(r[18]=[Z("i",null,"No parking spots yet.",-1)])),_:1}))]),_:1})):ve("",!0)])]),_:1})):ve("",!0)],36)}}}),zl=Ye(Rl,[["__scopeId","data-v-fac14b38"]]);export{zl as default};

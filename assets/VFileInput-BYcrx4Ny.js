import{a5 as X,am as Y,an as M,ao as Z,a9 as ee,ap as le,aq as te,ar as ae,g as s,as as B,r as h,i as ne,ac as ue,at as ie,au as x,av as oe,k as u,aw as se,ax as g,R as k,ay as re,az as ce,aA as de,aB as fe}from"./index-C41_NqNp.js";import{V as ve}from"./VChip-9zWF-8GI.js";const me=X({chips:Boolean,counter:Boolean,counterSizeString:{type:String,default:"$vuetify.fileInput.counterSize"},counterString:{type:String,default:"$vuetify.fileInput.counter"},hideInput:Boolean,multiple:Boolean,showSize:{type:[Boolean,Number,String],default:!1,validator:e=>typeof e=="boolean"||[1e3,1024].includes(Number(e))},...Y({prependIcon:"$file"}),modelValue:{type:[Array,Object],default:e=>e.multiple?[]:null,validator:e=>M(e).every(f=>f!=null&&typeof f=="object")},...Z({clearable:!0})},"VFileInput"),ge=ee()({name:"VFileInput",inheritAttrs:!1,props:me(),emits:{"click:control":e=>!0,"mousedown:control":e=>!0,"update:focused":e=>!0,"update:modelValue":e=>!0},setup(e,f){let{attrs:N,emit:C,slots:a}=f;const{t:V}=le(),n=te(e,"modelValue",e.modelValue,l=>M(l),l=>!e.multiple&&Array.isArray(l)?l[0]:l),{isFocused:v,focus:$,blur:D}=ae(e),I=s(()=>typeof e.showSize!="boolean"?e.showSize:void 0),b=s(()=>(n.value??[]).reduce((l,t)=>{let{size:r=0}=t;return l+r},0)),S=s(()=>B(b.value,I.value)),p=s(()=>(n.value??[]).map(l=>{const{name:t="",size:r=0}=l;return e.showSize?`${t} (${B(r,I.value)})`:t})),j=s(()=>{var t;const l=((t=n.value)==null?void 0:t.length)??0;return e.showSize?V(e.counterSizeString,l,S.value):V(e.counterString,l)}),F=h(),P=h(),i=h(),E=s(()=>v.value||e.active),z=s(()=>["plain","underlined"].includes(e.variant));function y(){var l;i.value!==document.activeElement&&((l=i.value)==null||l.focus()),v.value||$()}function O(l){var t;(t=i.value)==null||t.click()}function U(l){C("mousedown:control",l)}function q(l){var t;(t=i.value)==null||t.click(),C("click:control",l)}function L(l){l.stopPropagation(),y(),de(()=>{n.value=[],fe(e["onClick:clear"],l)})}return ne(n,l=>{(!Array.isArray(l)||!l.length)&&i.value&&(i.value.value="")}),ue(()=>{const l=!!(a.counter||e.counter),t=!!(l||a.details),[r,T]=ie(N),{modelValue:pe,..._}=x.filterProps(e),G=oe(e);return u(x,g({ref:F,modelValue:n.value,"onUpdate:modelValue":c=>n.value=c,class:["v-file-input",{"v-file-input--chips":!!e.chips,"v-file-input--hide":e.hideInput,"v-input--plain-underlined":z.value},e.class],style:e.style,"onClick:prepend":O},r,_,{centerAffix:!z.value,focused:v.value}),{...a,default:c=>{let{id:m,isDisabled:d,isDirty:A,isReadonly:w,isValid:H}=c;return u(se,g({ref:P,"prepend-icon":e.prependIcon,onMousedown:U,onClick:q,"onClick:clear":L,"onClick:prependInner":e["onClick:prependInner"],"onClick:appendInner":e["onClick:appendInner"]},G,{id:m.value,active:E.value||A.value,dirty:A.value||e.dirty,disabled:d.value,focused:v.value,error:H.value===!1}),{...a,default:J=>{var R;let{props:{class:K,...Q}}=J;return u(k,null,[u("input",g({ref:i,type:"file",readonly:w.value,disabled:d.value,multiple:e.multiple,name:e.name,onClick:o=>{o.stopPropagation(),w.value&&o.preventDefault(),y()},onChange:o=>{if(!o.target)return;const W=o.target;n.value=[...W.files??[]]},onFocus:y,onBlur:D},Q,T),null),u("div",{class:K},[!!((R=n.value)!=null&&R.length)&&!e.hideInput&&(a.selection?a.selection({fileNames:p.value,totalBytes:b.value,totalBytesReadable:S.value}):e.chips?p.value.map(o=>u(ve,{key:o,size:"small",text:o},null)):p.value.join(", "))])])}})},details:t?c=>{var m,d;return u(k,null,[(m=a.details)==null?void 0:m.call(a,c),l&&u(k,null,[u("span",null,null),u(re,{active:!!((d=n.value)!=null&&d.length),value:j.value,disabled:e.disabled},a.counter)])])}:void 0})}),ce({},F,P,i)}});export{ge as V};

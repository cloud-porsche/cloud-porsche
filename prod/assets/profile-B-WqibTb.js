import{a5 as ie,a6 as ue,a7 as de,a8 as pe,a9 as me,aa as fe,ab as ce,ac as ve,k as a,d as ye,e as Ve,ad as ge,ae as Ce,g as we,r as f,af as be,i as xe,o as m,j as N,u as n,c as x,w as l,J as F,a as _,U as ke,m as he,ag as M,b as i,ah as De,Y as Ue,W,X as Ae,C as r,K as k,n as G,T as Y,t as w,M as v,L as J,ai as K,A as E,B as X,_ as Re,D as H,E as Q,G as Z,N as ee,aj as Ne,p as Le,a1 as T,ak as Pe,$ as Fe,al as _e}from"./index-p8F1I7Eo.js";import{V as Ee}from"./VFileInput-B_gXH_DM.js";import{V as Te,a as ae}from"./VRow-yukr7wC1.js";import"./VChip-bJK9fyN9.js";const je=ie({fluid:{type:Boolean,default:!1},...ue(),...de(),...pe()},"VContainer"),Ie=me()({name:"VContainer",props:je(),setup(y,V){let{slots:h}=V;const{rtlClasses:c}=fe(),{dimensionStyles:d}=ce(y);return ve(()=>a(y.tag,{class:["v-container",{"v-container--fluid":y.fluid},c.value,y.class],style:[d.value,y.style]},h)),{}}}),Se={for:"pb-upload"},Be={class:"d-flex align-center justify-center fill-height"},$e={class:"d-flex align-center justify-center fill-height"},ze={class:"card-grid"},Oe={class:"d-flex align-center"},qe={key:0},Me={class:"d-flex justify-center text-center pa-2 text-body-2"},We={class:"text-body-1"},Xe=ye({__name:"profile",async setup(y){var B,$;let V,h;const c=Ve(),d=ge(),s=Ce(),p=we(()=>_.currentRoute.value.params.tenantId),b=f(!1),u=f({displayName:((B=s.value)==null?void 0:B.displayName)??"",photo:null}),L=f(!1),j=f(!1),g=f(null);($=s.value)!=null&&$.photoURL&&(g.value=([V,h]=be(()=>P(s.value.photoURL)),V=await V,h(),V)),xe(s,async o=>{if(o){g.value=o.photoURL?await P(o.photoURL):null;const e=_.currentRoute.value.query.redirect;e&&_.push({path:e})}});const D=f(""),te=()=>{b.value=!0},I=()=>{var o;b.value=!1,u.value.displayName=((o=s.value)==null?void 0:o.displayName)??""},S=async()=>{var o,e;try{if(s.value&&d){let t="",C="";if(u.value.photo){C+=u.value.photo.name.split(".").pop(),t=s.value.uid+"."+C;const R=new File([u.value.photo],t,{type:u.value.photo.type});await le(R),g.value&&((o=s.value.photoURL)==null?void 0:o.split(".").pop())!=C&&!((e=s.value.photoURL)!=null&&e.startsWith("http"))&&await T("/v1/storage/"+s.value.photoURL)}await Pe(s.value,{displayName:u.value.displayName,photoURL:t!==""?t:s.value.photoURL}),t&&(g.value=await P(t))}b.value=!1,D.value="Profile updated!"}catch(t){console.error("Failed to update profile:",t)}};async function P(o){if(!o)return"";if(o.startsWith("http"))return o;try{const e=await ke(`/v1/storage/${o}`);if(!e.ok)throw new Error("Failed to fetch signed URL");const{signedUrl:t}=await e.json();return t}catch(e){return console.error("Error fetching signed URL:",e),""}}const le=async o=>{try{const e=new FormData;e.append("file",o),await Fe("/v1/storage/upload",e)}catch(e){console.error("Failed to upload photo:",e)}};function oe(){var o;(o=s.value)!=null&&o.email&&_e(d,s.value.email).then(()=>{D.value="Password reset email sent!"}).catch(e=>{console.error("Error sending reset email:",e)})}const U=f(!1),A=f(""),se=async()=>{var o;A.value===p.value&&!["free","free-tier"].includes(p.value)&&(c.hasAdminAccess?await T(`/v1/tenants/${p.value}`,void 0,"tenantManagement"):await T(`/v1/tenants/${p.value}/users/${(o=d==null?void 0:d.currentUser)==null?void 0:o.uid}`,void 0,"tenantManagement"),await K(d))};function ne(){U.value=!0}function re(){U.value=!1,A.value=""}return(o,e)=>(m(),N("div",null,[n(c).authLoading?(m(),x(he,{key:0,indeterminate:"",color:"primary"})):n(s)?(m(),x(Ie,{key:1,class:"d-flex justify-center align-center"},{default:l(()=>[a(E,{class:"pa-4",width:"fit-content","min-width":"50%",loading:n(c).authLoading},{default:l(()=>[a(M,{class:"d-flex justify-center"},{default:l(()=>[i("label",Se,[a(De,{id:"pb",class:"rounded-circle bg-primary",size:"120",text:"User Photo",rounded:"",border:""},{default:l(()=>[g.value?(m(),x(Ue,{key:0,src:g.value,alt:"User Photo",cover:""},{error:l(()=>[i("div",Be,[a(W,{color:"error",icon:"mdi-image-broken-variant"})])]),placeholder:l(()=>[i("div",$e,[a(Ae,{size:"24",indeterminate:""})])]),_:1},8,["src"])):(m(),x(W,{key:1,class:"opacity-80",color:"background",size:"80"},{default:l(()=>e[8]||(e[8]=[r("mdi-account ")])),_:1}))]),_:1})]),a(Ee,{id:"pb-upload",class:"d-none",modelValue:u.value.photo,"onUpdate:modelValue":[e[0]||(e[0]=t=>u.value.photo=t),S],accept:"image/*","prepend-icon":"mdi-camera","max-width":"400"},null,8,["modelValue"])]),_:1}),a(k,{class:"ma-4"}),a(M,null,{default:l(()=>{var t,C,R,z,O,q;return[i("div",ze,[e[9]||(e[9]=i("span",{class:"text-end"},"Display Name:",-1)),G((m(),N("span",Oe,[r(w(((t=n(s))==null?void 0:t.displayName)??"Anonymous")+" ",1),a(v,{class:"ms-2",color:"primary",onClick:te,size:"x-small",icon:"mdi-pencil",variant:"tonal"})])),[[Y,(C=n(s))!=null&&C.displayName?{text:(R=n(s))==null?void 0:R.displayName,openOnClick:!0,persistent:!1}:void 0,"bottom"]]),e[10]||(e[10]=i("span",{class:"text-end"},"Email:",-1)),G((m(),N("span",null,[r(w(((z=n(s))==null?void 0:z.email)??"No Email"),1)])),[[Y,(O=n(s))!=null&&O.email?{text:(q=n(s))==null?void 0:q.email,openOnClick:!0,persistent:!1}:void 0,"bottom"]])])]}),_:1}),a(k,{class:"ma-4"}),a(J,null,{default:l(()=>[a(Te,null,{default:l(()=>[a(ae,{class:"text-end"},{default:l(()=>[a(v,{color:"warn",variant:"tonal",onClick:oe},{default:l(()=>e[11]||(e[11]=[r("Reset Password ")])),_:1})]),_:1}),a(ae,null,{default:l(()=>[a(v,{color:"error",onClick:e[1]||(e[1]=t=>n(K)(n(d))),variant:"tonal","append-icon":"mdi-logout"},{default:l(()=>e[12]||(e[12]=[r("Log Out ")])),_:1})]),_:1})]),_:1})]),_:1}),["free","free-tier"].includes(n(p))?F("",!0):(m(),N("div",qe,[a(k,{class:"ma-4"}),i("span",Me,[a(v,{text:"Delete Account",variant:"text",size:"8",color:"error",flat:"",onClick:ne})])]))]),_:1},8,["loading"]),a(ee,{modelValue:U.value,"onUpdate:modelValue":e[4]||(e[4]=t=>U.value=t),"max-width":"400",onAfterLeave:re},{default:l(()=>[a(E,{class:"pa-4"},{default:l(()=>[a(X,null,{default:l(()=>[r("Delete "+w(n(c).hasAdminAccess&&!["free","free-tier"].includes(n(p))?"Tenant":"Account"),1)]),_:1}),a(k,{class:"pb-4"}),a(Re,null,{default:l(()=>[i("p",We,[r(w(n(c).hasAdminAccess&&!["free","free-tier"].includes(n(p))?"WARNING! You are about to delete your whole Subscription and all associated data with it!":"Are you sure you want to delete your account?")+" ",1),e[13]||(e[13]=i("br",null,null,-1)),e[14]||(e[14]=i("br",null,null,-1)),e[15]||(e[15]=r(" This action cannot be undone. ")),e[16]||(e[16]=i("br",null,null,-1)),e[17]||(e[17]=r(" Confirm key: ")),i("b",null,w(n(p)),1)])]),_:1}),a(H,null,{default:l(()=>[a(Q,{ref:"deleteForm",modelValue:j.value,"onUpdate:modelValue":e[3]||(e[3]=t=>j.value=t)},{default:l(()=>[a(Z,{label:"Confirm deletion",modelValue:A.value,"onUpdate:modelValue":e[2]||(e[2]=t=>A.value=t),variant:"outlined",rules:[t=>!!t||"Confirm deletion needed",t=>t===n(p)||"Confirm key is incorrect"],required:""},null,8,["modelValue","rules"]),a(k,{class:"pa-2 mt-4"}),a(v,{color:"error",text:"true",class:"w-100",onClick:se},{default:l(()=>e[18]||(e[18]=[r("Delete ")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),D.value?(m(),x(Ne,{key:0,closable:"",type:"success",class:"position-absolute bottom-0 ma-16"},{default:l(()=>[r(w(D.value),1)]),_:1})):F("",!0),a(ee,{modelValue:b.value,"onUpdate:modelValue":e[7]||(e[7]=t=>b.value=t),"max-width":"400",onAfterLeave:I},{default:l(()=>[a(E,null,{default:l(()=>[a(X,null,{default:l(()=>e[19]||(e[19]=[r("Edit Profile")])),_:1}),a(H,null,{default:l(()=>[a(Q,{ref:"editForm",modelValue:L.value,"onUpdate:modelValue":e[6]||(e[6]=t=>L.value=t)},{default:l(()=>[a(Z,{label:"Display Name",modelValue:u.value.displayName,"onUpdate:modelValue":e[5]||(e[5]=t=>u.value.displayName=t),rules:[t=>!!t||"Display name is required"],required:""},null,8,["modelValue","rules"])]),_:1},8,["modelValue"])]),_:1}),a(J,null,{default:l(()=>[a(Le),a(v,{color:"error",text:"true",onClick:I},{default:l(()=>e[20]||(e[20]=[r("Cancel ")])),_:1}),a(v,{color:"primary",text:"true",disabled:!L.value,onClick:S},{default:l(()=>e[21]||(e[21]=[r("Save ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})):F("",!0)]))}});export{Xe as default};

import{a6 as ie,a7 as ue,a8 as de,a9 as pe,aa as me,ab as fe,ac as ce,ad as ve,l as a,d as ye,f as Ve,ae as ge,af as we,h as Ce,r as f,ag as xe,j as be,o as m,k as N,u as n,c as h,w as l,M as F,a as _,W as ke,n as he,ah as M,b as i,ai as De,Z as Ue,X as W,Y as Re,F as r,x as D,p as G,T as Y,t as C,s as v,N as K,aj as X,D as E,E as Z,$ as Ae,G as H,I as J,K as Q,O as ee,ak as Ne,q as Le,a2 as T,al as Pe,a0 as Fe,am as _e}from"./index-CY7nOk5p.js";import{V as Ee}from"./VFileInput-DFaZ0aEn.js";import{V as Te,a as ae}from"./VRow-Dl5gG6n6.js";import"./VChip-PKdmnwD0.js";const Ie=ie({fluid:{type:Boolean,default:!1},...ue(),...de(),...pe()},"VContainer"),je=me()({name:"VContainer",props:Ie(),setup(y,V){let{slots:U}=V;const{rtlClasses:c}=fe(),{dimensionStyles:d}=ce(y);return ve(()=>a(y.tag,{class:["v-container",{"v-container--fluid":y.fluid},c.value,y.class],style:[d.value,y.style]},U)),{}}}),Se={for:"pb-upload"},Be={class:"d-flex align-center justify-center fill-height"},Oe={class:"d-flex align-center justify-center fill-height"},$e={class:"card-grid"},qe={class:"d-flex align-center"},ze={key:0},Me={class:"d-flex justify-center text-center pa-2 text-body-2"},We={class:"text-body-1"},Ze=ye({__name:"profile",async setup(y){var B,O;let V,U;const c=Ve(),d=ge(),s=we(),p=Ce(()=>_.currentRoute.value.params.tenantId),x=f(!1),u=f({displayName:((B=s.value)==null?void 0:B.displayName)??"",photo:null}),L=f(!1),I=f(!1),g=f(null);(O=s.value)!=null&&O.photoURL&&(g.value=([V,U]=xe(()=>P(s.value.photoURL)),V=await V,U(),V)),be(s,async o=>{if(o){g.value=o.photoURL?await P(o.photoURL):null;const e=_.currentRoute.value.query.redirect;e&&_.push({path:e})}});const R=f(""),te=()=>{x.value=!0},j=()=>{var o;x.value=!1,u.value.displayName=((o=s.value)==null?void 0:o.displayName)??""},S=async()=>{var o,e;try{if(s.value&&d){let t="",w="";if(u.value.photo){w+=u.value.photo.name.split(".").pop(),t=s.value.uid+"."+w;const A=new File([u.value.photo],t,{type:u.value.photo.type});await le(A),g.value&&((o=s.value.photoURL)==null?void 0:o.split(".").pop())!=w&&!((e=s.value.photoURL)!=null&&e.startsWith("http"))&&await T("/v1/storage/"+s.value.photoURL)}await Pe(s.value,{displayName:u.value.displayName,photoURL:t!==""?t:s.value.photoURL}),t&&(g.value=await P(t))}x.value=!1,R.value="Profile updated!"}catch(t){console.error("Failed to update profile:",t)}};async function P(o){if(!o)return"";if(o.startsWith("http"))return o;try{const e=await ke(`/v1/storage/${o}`);if(!e.ok)throw new Error("Failed to fetch signed URL");const{signedUrl:t}=await e.json();return t}catch(e){return console.error("Error fetching signed URL:",e),""}}const le=async o=>{try{const e=new FormData;e.append("file",o),await Fe("/v1/storage/upload",e)}catch(e){console.error("Failed to upload photo:",e)}};function oe(){var o;(o=s.value)!=null&&o.email&&_e(d,s.value.email).then(()=>{R.value="Password reset email sent!"}).catch(e=>{console.error("Error sending reset email:",e)})}const b=f(!1),k=f(""),se=async()=>{var o;k.value===p.value&&!["free","free-tier"].includes(p.value)&&(c.hasAdminAccess?await T(`/v1/tenants/${p.value}`,void 0,"tenantManagement"):await T(`/v1/tenants/${p.value}/users/${(o=d==null?void 0:d.currentUser)==null?void 0:o.uid}`,void 0,"tenantManagement"),await X(d),b.value=!1,k.value="")};function ne(){b.value=!0}function re(){b.value=!1,k.value=""}return(o,e)=>(m(),N("div",null,[n(c).authLoading?(m(),h(he,{key:0,indeterminate:"",color:"primary"})):n(s)?(m(),h(je,{key:1,class:"d-flex justify-center align-center"},{default:l(()=>[a(E,{class:"pa-4",width:"fit-content","min-width":"50%",loading:n(c).authLoading},{default:l(()=>[a(M,{class:"d-flex justify-center"},{default:l(()=>[i("label",Se,[a(De,{id:"pb",class:"rounded-circle bg-primary",size:"120",text:"User Photo",rounded:"",border:""},{default:l(()=>[g.value?(m(),h(Ue,{key:0,src:g.value,alt:"User Photo",cover:""},{error:l(()=>[i("div",Be,[a(W,{color:"error",icon:"mdi-image-broken-variant"})])]),placeholder:l(()=>[i("div",Oe,[a(Re,{size:"24",indeterminate:""})])]),_:1},8,["src"])):(m(),h(W,{key:1,class:"opacity-80",color:"background",size:"80"},{default:l(()=>e[8]||(e[8]=[r("mdi-account ")])),_:1}))]),_:1})]),a(Ee,{id:"pb-upload",class:"d-none",modelValue:u.value.photo,"onUpdate:modelValue":[e[0]||(e[0]=t=>u.value.photo=t),S],accept:"image/*","prepend-icon":"mdi-camera","max-width":"400"},null,8,["modelValue"])]),_:1}),a(D,{class:"ma-4"}),a(M,null,{default:l(()=>{var t,w,A,$,q,z;return[i("div",$e,[e[9]||(e[9]=i("span",{class:"text-end"},"Display Name:",-1)),G((m(),N("span",qe,[r(C(((t=n(s))==null?void 0:t.displayName)??"Anonymous")+" ",1),a(v,{class:"ms-2",color:"primary",onClick:te,size:"x-small",icon:"mdi-pencil",variant:"tonal"})])),[[Y,(w=n(s))!=null&&w.displayName?{text:(A=n(s))==null?void 0:A.displayName,openOnClick:!0,persistent:!1}:void 0,"bottom"]]),e[10]||(e[10]=i("span",{class:"text-end"},"Email:",-1)),G((m(),N("span",null,[r(C((($=n(s))==null?void 0:$.email)??"No Email"),1)])),[[Y,(q=n(s))!=null&&q.email?{text:(z=n(s))==null?void 0:z.email,openOnClick:!0,persistent:!1}:void 0,"bottom"]])])]}),_:1}),a(D,{class:"ma-4"}),a(K,null,{default:l(()=>[a(Te,null,{default:l(()=>[a(ae,{class:"text-end"},{default:l(()=>[a(v,{color:"warn",variant:"tonal",onClick:oe},{default:l(()=>e[11]||(e[11]=[r("Reset Password ")])),_:1})]),_:1}),a(ae,null,{default:l(()=>[a(v,{color:"error",onClick:e[1]||(e[1]=t=>n(X)(n(d))),variant:"tonal","append-icon":"mdi-logout"},{default:l(()=>e[12]||(e[12]=[r("Log Out ")])),_:1})]),_:1})]),_:1})]),_:1}),["free","free-tier"].includes(n(p))?F("",!0):(m(),N("div",ze,[a(D,{class:"ma-4"}),i("span",Me,[a(v,{text:"Delete Account",variant:"text",size:"8",color:"error",flat:"",onClick:ne})])]))]),_:1},8,["loading"]),a(ee,{modelValue:b.value,"onUpdate:modelValue":e[4]||(e[4]=t=>b.value=t),"max-width":"fit-content",onAfterLeave:re},{default:l(()=>[a(E,{class:"pa-4"},{default:l(()=>[a(Z,null,{default:l(()=>[r("Delete "+C(n(c).hasAdminAccess&&!["free","free-tier"].includes(n(p))?"Tenant":"Account"),1)]),_:1}),a(D,{class:"pb-4"}),a(Ae,null,{default:l(()=>[i("p",We,[r(C(n(c).hasAdminAccess&&!["free","free-tier"].includes(n(p))?"WARNING! You are about to delete your whole Subscription and all associated data with it!":"Are you sure you want to delete your account?")+" ",1),e[13]||(e[13]=i("br",null,null,-1)),e[14]||(e[14]=i("br",null,null,-1)),e[15]||(e[15]=r(" This action cannot be undone. ")),e[16]||(e[16]=i("br",null,null,-1)),e[17]||(e[17]=r(" Confirm key: ")),i("b",null,C(n(p)),1)])]),_:1}),a(H,null,{default:l(()=>[a(J,{ref:"deleteForm",modelValue:I.value,"onUpdate:modelValue":e[3]||(e[3]=t=>I.value=t)},{default:l(()=>[a(Q,{label:"Confirm deletion",modelValue:k.value,"onUpdate:modelValue":e[2]||(e[2]=t=>k.value=t),variant:"outlined",rules:[t=>!!t||"Confirm deletion needed",t=>t===n(p)||"Confirm key is incorrect"],required:""},null,8,["modelValue","rules"]),a(D,{class:"pa-2 mt-4"}),a(v,{color:"error",text:"true",class:"w-100",onClick:se},{default:l(()=>e[18]||(e[18]=[r("Delete ")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),R.value?(m(),h(Ne,{key:0,closable:"",type:"success",class:"position-absolute bottom-0 ma-16"},{default:l(()=>[r(C(R.value),1)]),_:1})):F("",!0),a(ee,{modelValue:x.value,"onUpdate:modelValue":e[7]||(e[7]=t=>x.value=t),"max-width":"400",onAfterLeave:j},{default:l(()=>[a(E,null,{default:l(()=>[a(Z,null,{default:l(()=>e[19]||(e[19]=[r("Edit Profile")])),_:1}),a(H,null,{default:l(()=>[a(J,{ref:"editForm",modelValue:L.value,"onUpdate:modelValue":e[6]||(e[6]=t=>L.value=t)},{default:l(()=>[a(Q,{label:"Display Name",modelValue:u.value.displayName,"onUpdate:modelValue":e[5]||(e[5]=t=>u.value.displayName=t),rules:[t=>!!t||"Display name is required"],required:""},null,8,["modelValue","rules"])]),_:1},8,["modelValue"])]),_:1}),a(K,null,{default:l(()=>[a(Le),a(v,{color:"error",text:"true",onClick:j},{default:l(()=>e[20]||(e[20]=[r("Cancel ")])),_:1}),a(v,{color:"primary",text:"true",disabled:!L.value,onClick:S},{default:l(()=>e[21]||(e[21]=[r("Save ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})):F("",!0)]))}});export{Ze as default};

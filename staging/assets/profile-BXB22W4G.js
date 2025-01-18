import{a4 as ne,a5 as re,a6 as ie,a7 as de,a8 as ue,a9 as ce,aa as me,ab as fe,l,d as pe,u as ve,ac as ge,ad as ye,f as Ve,r as p,ae as Ce,h as De,a as L,R as we,af as B,W as N,ag as he,S as be,ah as xe,_ as ke,k as P,c as h,w as o,I,o as c,ai as z,b as i,aj as _e,a0 as Pe,Z as M,$ as Re,B as r,J as b,p as q,T as W,t as C,L as V,K as G,z as S,A as J,a2 as Ue,C as K,D as Y,F as Z,M as H,ak as Ae,q as Fe,n as Le}from"./index-9WrTN1Ev.js";import{V as Ne}from"./VFileInput-IXkzaXfL.js";import{V as Ie,a as Q}from"./VRow-BtE0aTqm.js";import"./VChip-D4sclpbQ.js";const Se=ne({fluid:{type:Boolean,default:!1},...re(),...ie(),...de()},"VContainer"),Ee=ue()({name:"VContainer",props:Se(),setup(v,a){let{slots:g}=a;const{rtlClasses:e}=ce(),{dimensionStyles:D}=me(v);return fe(()=>l(v.tag,{class:["v-container",{"v-container--fluid":v.fluid},e.value,v.class],style:[D.value,v.style]},g)),{}}}),Oe=pe({__name:"profile",async setup(v,{expose:a}){var T,j;a();let g,e;const D=ve(),m=ge(),t=ye(),f=Ve(()=>L.currentRoute.value.params.tenantId),y=p(!1),d=p({displayName:((T=t.value)==null?void 0:T.displayName)??"",photo:null}),x=p(!1),k=p(!1),w=p(null);(j=t.value)!=null&&j.photoURL&&(w.value=([g,e]=Ce(()=>_(t.value.photoURL)),g=await g,e(),g)),De(t,async s=>{if(s){w.value=s.photoURL?await _(s.photoURL):null;const n=L.currentRoute.value.query.redirect;n&&L.push({path:n})}});const R=p(""),X=()=>{y.value=!0},$=()=>{var s;y.value=!1,d.value.displayName=((s=t.value)==null?void 0:s.displayName)??""},ee=async()=>{var s,n;try{if(t.value&&m){let u="",F="";if(d.value.photo){F+=d.value.photo.name.split(".").pop(),u=t.value.uid+"."+F;const se=new File([d.value.photo],u,{type:d.value.photo.type});await E(se),w.value&&((s=t.value.photoURL)==null?void 0:s.split(".").pop())!=F&&!((n=t.value.photoURL)!=null&&n.startsWith("http"))&&await N("/v1/storage/"+t.value.photoURL)}await he(t.value,{displayName:d.value.displayName,photoURL:u!==""?u:t.value.photoURL}),u&&(w.value=await _(u))}y.value=!1,R.value="Profile updated!"}catch(u){console.error("Failed to update profile:",u)}};async function _(s){if(!s)return"";if(s.startsWith("http"))return s;try{const n=await we(`/v1/storage/${s}`);if(!n.ok)throw new Error("Failed to fetch signed URL");const{signedUrl:u}=await n.json();return u}catch(n){return console.error("Error fetching signed URL:",n),""}}const E=async s=>{try{const n=new FormData;n.append("file",s),await be("/v1/storage/upload",n)}catch(n){console.error("Failed to upload photo:",n)}};function ae(){var s;(s=t.value)!=null&&s.email&&xe(m,t.value.email).then(()=>{R.value="Password reset email sent!"}).catch(n=>{console.error("Error sending reset email:",n)})}const U=p(!1),A=p(""),te=async()=>{var s;A.value===f.value&&!["free","free-tier"].includes(f.value)&&(D.hasAdminAccess?await N(`/v1/tenants/${f.value}`,void 0,"tenantManagement"):await N(`/v1/tenants/${f.value}/users/${(s=m==null?void 0:m.currentUser)==null?void 0:s.uid}`,void 0,"tenantManagement"),await B(m))};function le(){U.value=!0}function oe(){U.value=!1,A.value=""}const O={appStore:D,auth:m,user:t,tenantId:f,editDialog:y,editData:d,formValid:x,deleteFormValid:k,userPhoto:w,successMessage:R,openEditDialog:X,closeEditDialog:$,saveChanges:ee,fetchImage:_,uploadPhoto:E,resetPassword:ae,deleteDialogOpen:U,deleteConfirm:A,confirmDelete:te,openDeleteDialog:le,closeDeleteDialog:oe,get signOut(){return B}};return Object.defineProperty(O,"__isScriptSetup",{enumerable:!1,value:!0}),O}}),Te={for:"pb-upload"},je={class:"d-flex align-center justify-center fill-height"},Be={class:"d-flex align-center justify-center fill-height"},ze={class:"card-grid"},Me={class:"d-flex align-center"},qe={key:0},We={class:"d-flex justify-center text-center pa-2 text-body-2"},Ge={class:"text-body-1"};function Je(v,a,g,e,D,m){return c(),P("div",null,[e.appStore.authLoading?(c(),h(Le,{key:0,indeterminate:"",color:"primary"})):e.user?(c(),h(Ee,{key:1,class:"d-flex justify-center align-center"},{default:o(()=>[l(S,{class:"pa-4",width:"fit-content","min-width":"50%",loading:e.appStore.authLoading},{default:o(()=>[l(z,{class:"d-flex justify-center"},{default:o(()=>[i("label",Te,[l(_e,{id:"pb",class:"rounded-circle bg-primary",size:"120",text:"User Photo",rounded:"",border:""},{default:o(()=>[e.userPhoto?(c(),h(Pe,{key:0,src:e.userPhoto,alt:"User Photo",cover:""},{error:o(()=>[i("div",je,[l(M,{color:"error",icon:"mdi-image-broken-variant"})])]),placeholder:o(()=>[i("div",Be,[l(Re,{size:"24",indeterminate:""})])]),_:1},8,["src"])):(c(),h(M,{key:1,class:"opacity-80",color:"background",size:"80"},{default:o(()=>a[8]||(a[8]=[r("mdi-account ")])),_:1}))]),_:1})]),l(Ne,{id:"pb-upload",class:"d-none",modelValue:e.editData.photo,"onUpdate:modelValue":[a[0]||(a[0]=t=>e.editData.photo=t),e.saveChanges],accept:"image/*","prepend-icon":"mdi-camera","max-width":"400"},null,8,["modelValue"])]),_:1}),l(b,{class:"ma-4"}),l(z,null,{default:o(()=>{var t,f,y,d,x,k;return[i("div",ze,[a[9]||(a[9]=i("span",{class:"text-end"},"Display Name:",-1)),q((c(),P("span",Me,[r(C(((t=e.user)==null?void 0:t.displayName)??"Anonymous")+" ",1),l(V,{class:"ms-2",color:"primary",onClick:e.openEditDialog,size:"x-small",icon:"mdi-pencil",variant:"tonal"})])),[[W,(f=e.user)!=null&&f.displayName?{text:(y=e.user)==null?void 0:y.displayName,openOnClick:!0,persistent:!1}:void 0,"bottom"]]),a[10]||(a[10]=i("span",{class:"text-end"},"Email:",-1)),q((c(),P("span",null,[r(C(((d=e.user)==null?void 0:d.email)??"No Email"),1)])),[[W,(x=e.user)!=null&&x.email?{text:(k=e.user)==null?void 0:k.email,openOnClick:!0,persistent:!1}:void 0,"bottom"]])])]}),_:1}),l(b,{class:"ma-4"}),l(G,null,{default:o(()=>[l(Ie,null,{default:o(()=>[l(Q,{class:"text-end"},{default:o(()=>[l(V,{color:"warn",variant:"tonal",onClick:e.resetPassword},{default:o(()=>a[11]||(a[11]=[r("Reset Password ")])),_:1})]),_:1}),l(Q,null,{default:o(()=>[l(V,{color:"error",onClick:a[1]||(a[1]=t=>e.signOut(e.auth)),variant:"tonal","append-icon":"mdi-logout"},{default:o(()=>a[12]||(a[12]=[r("Log Out ")])),_:1})]),_:1})]),_:1})]),_:1}),["free","free-tier"].includes(e.tenantId)?I("",!0):(c(),P("div",qe,[l(b,{class:"ma-4"}),i("span",We,[l(V,{text:"Delete Account",variant:"text",size:"8",color:"error",flat:"",onClick:e.openDeleteDialog})])]))]),_:1},8,["loading"]),l(H,{modelValue:e.deleteDialogOpen,"onUpdate:modelValue":a[4]||(a[4]=t=>e.deleteDialogOpen=t),"max-width":"400",onAfterLeave:e.closeDeleteDialog},{default:o(()=>[l(S,{class:"pa-4"},{default:o(()=>[l(J,null,{default:o(()=>[r("Delete "+C(e.appStore.hasAdminAccess&&!["free","free-tier"].includes(e.tenantId)?"Tenant":"Account"),1)]),_:1}),l(b,{class:"pb-4"}),l(Ue,null,{default:o(()=>[i("p",Ge,[r(C(e.appStore.hasAdminAccess&&!["free","free-tier"].includes(e.tenantId)?"WARNING! You are about to delete your whole Subscription and all associated data with it!":"Are you sure you want to delete your account?")+" ",1),a[13]||(a[13]=i("br",null,null,-1)),a[14]||(a[14]=i("br",null,null,-1)),a[15]||(a[15]=r(" This action cannot be undone. ")),a[16]||(a[16]=i("br",null,null,-1)),a[17]||(a[17]=r(" Confirm key: ")),i("b",null,C(e.tenantId),1)])]),_:1}),l(K,null,{default:o(()=>[l(Y,{ref:"deleteForm",modelValue:e.deleteFormValid,"onUpdate:modelValue":a[3]||(a[3]=t=>e.deleteFormValid=t)},{default:o(()=>[l(Z,{label:"Confirm deletion",modelValue:e.deleteConfirm,"onUpdate:modelValue":a[2]||(a[2]=t=>e.deleteConfirm=t),variant:"outlined",rules:[t=>!!t||"Confirm deletion needed",t=>t===e.tenantId||"Confirm key is incorrect"],required:""},null,8,["modelValue","rules"]),l(b,{class:"pa-2 mt-4"}),l(V,{color:"error",text:"true",class:"w-100",onClick:e.confirmDelete},{default:o(()=>a[18]||(a[18]=[r("Delete ")])),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),e.successMessage?(c(),h(Ae,{key:0,closable:"",type:"success",class:"position-absolute bottom-0 ma-16"},{default:o(()=>[r(C(e.successMessage),1)]),_:1})):I("",!0),l(H,{modelValue:e.editDialog,"onUpdate:modelValue":a[7]||(a[7]=t=>e.editDialog=t),"max-width":"400",onAfterLeave:e.closeEditDialog},{default:o(()=>[l(S,null,{default:o(()=>[l(J,null,{default:o(()=>a[19]||(a[19]=[r("Edit Profile")])),_:1}),l(K,null,{default:o(()=>[l(Y,{ref:"editForm",modelValue:e.formValid,"onUpdate:modelValue":a[6]||(a[6]=t=>e.formValid=t)},{default:o(()=>[l(Z,{label:"Display Name",modelValue:e.editData.displayName,"onUpdate:modelValue":a[5]||(a[5]=t=>e.editData.displayName=t),rules:[t=>!!t||"Display name is required"],required:""},null,8,["modelValue","rules"])]),_:1},8,["modelValue"])]),_:1}),l(G,null,{default:o(()=>[l(Fe),l(V,{color:"error",text:"true",onClick:e.closeEditDialog},{default:o(()=>a[20]||(a[20]=[r("Cancel ")])),_:1}),l(V,{color:"primary",text:"true",disabled:!e.formValid,onClick:e.saveChanges},{default:o(()=>a[21]||(a[21]=[r("Save ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})):I("",!0)])}const Qe=ke(Oe,[["render",Je],["__file","/home/runner/work/cloud-porsche/cloud-porsche/cloud-dev-ui/src/pages/[tenantId]/profile.vue"]]);export{Qe as default};

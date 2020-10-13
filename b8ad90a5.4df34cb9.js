(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{77:function(e,r,t){"use strict";t.r(r),t.d(r,"frontMatter",(function(){return a})),t.d(r,"metadata",(function(){return c})),t.d(r,"rightToc",(function(){return p})),t.d(r,"default",(function(){return u}));var n=t(2),o=t(6),i=(t(0),t(91)),a={id:"browser-support",title:"Browser Support",sidebar_label:"Browser Support"},c={unversionedId:"introduction/browser-support",id:"introduction/browser-support",isDocsHomePage:!1,title:"Browser Support",description:"tinka relies on fetch, it's fetch client after all,",source:"@site/docs/introduction/4-browser-support.md",slug:"/introduction/browser-support",permalink:"/docs/introduction/browser-support",editUrl:"https://github.com/crazyfactory/tinka/edit/master/docs/docs/introduction/4-browser-support.md",version:"current",sidebar_label:"Browser Support",sidebar:"someSidebar",previous:{title:"Order of middleware",permalink:"/docs/introduction/order-of-middlewares"},next:{title:"FetchMiddleware",permalink:"/docs/middlewares/fetch"}},p=[],s={rightToc:p};function u(e){var r=e.components,t=Object(o.a)(e,["components"]);return Object(i.a)("wrapper",Object(n.a)({},s,t,{components:r,mdxType:"MDXLayout"}),Object(i.a)("p",null,"tinka relies on ",Object(i.a)("inlineCode",{parentName:"p"},"fetch"),", it's fetch client after all,\nso it's supported in all browsers that support ",Object(i.a)("inlineCode",{parentName:"p"},"fetch")," out of the box."),Object(i.a)("p",null,"For older browsers, a polyfill should be added. Tinka doesn't come with that polyfill for obvious reasons."))}u.isMDXComponent=!0},91:function(e,r,t){"use strict";t.d(r,"a",(function(){return f}));var n=t(0),o=t.n(n);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=o.a.createContext({}),u=function(e){var r=o.a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},l={inlineCode:"code",wrapper:function(e){var r=e.children;return o.a.createElement(o.a.Fragment,{},r)}},d=o.a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,i=e.originalType,a=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),d=u(t),f=n,b=d["".concat(a,".").concat(f)]||d[f]||l[f]||i;return t?o.a.createElement(b,c(c({ref:r},s),{},{components:t})):o.a.createElement(b,c({ref:r},s))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var i=t.length,a=new Array(i);a[0]=d;var c={};for(var p in r)hasOwnProperty.call(r,p)&&(c[p]=r[p]);c.originalType=e,c.mdxType="string"==typeof e?e:n,a[1]=c;for(var s=2;s<i;s++)a[s]=t[s];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);
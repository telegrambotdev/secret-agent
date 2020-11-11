(window.webpackJsonp=window.webpackJsonp||[]).push([[111],{"5+Rh":function(e,t,o){"use strict";o.r(t);var n=o("Ow4o"),s=o("vu0Y"),r=o("pLV6");function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}r.a.config.optionMergeStrategies;var i={VueRemarkRoot:s.a},u=function(e){var t=e.options.components=e.options.components||{},o=e.options.computed=e.options.computed||{};Object.keys(i).forEach((function(e){"object"===a(i[e])&&"function"==typeof i[e].render||"function"==typeof i[e]&&"function"==typeof i[e].options.render?t[e]=i[e]:o[e]=function(){return i[e]}}))},c=r.a.config.optionMergeStrategies,p="__vueRemarkFrontMatter",d={excerpt:null,title:"[AwaitedDOM](/docs/basic-interfaces/awaited-dom) <span>/</span> XPathExpression"};var l=function(e){e.options[p]&&(e.options[p]=d),r.a.util.defineReactive(e.options,p,d),e.options.computed=c.computed({$frontmatter:function(){return e.options[p]}},e.options.computed)},h=Object(n.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("VueRemarkRoot",[o("h1",{attrs:{id:"awaiteddom-spanspan-xpathexpression"}},[o("a",{attrs:{href:"#awaiteddom-spanspan-xpathexpression","aria-hidden":"true"}},[e._v("#")]),o("a",{attrs:{href:"/docs/basic-interfaces/awaited-dom"}},[e._v("AwaitedDOM")]),o("span",[e._v("/")]),e._v(" XPathExpression")]),o("div",{staticClass:"overview"},[o("span",{staticClass:"seoSummary"},[e._v("This interface is a compiled XPath expression that can be evaluated on a document or specific node to return information from its DOM tree.")]),e._v(" This is useful when an expression will be reused in an application, because it is just compiled once and all namespace prefixes which occur within the expression are preresolved.")]),o("div",{staticClass:"overview"},[e._v("Objects of this type are created by calling "),o("code",[e._v("XPathEvaluator.createExpression()")]),e._v(".")]),o("h2",{attrs:{id:"methods"}},[o("a",{attrs:{href:"#methods","aria-hidden":"true"}},[e._v("#")]),e._v("Methods")]),o("h3",{attrs:{id:"evaluate"}},[o("a",{attrs:{href:"#evaluate","aria-hidden":"true"}},[e._v("#")]),e._v(".evaluate"),o("em",[e._v("(contextNode, type?, result?)")]),o("div",{staticClass:"specs"},[o("i",[e._v("W3C")])])]),o("p",[e._v("Evaluates the XPath expression on the given node or document.")]),o("h4",{attrs:{id:"arguments"}},[o("a",{attrs:{href:"#arguments","aria-hidden":"true"}},[e._v("#")]),o("strong",[e._v("Arguments")]),e._v(":")]),o("ul",[o("li",[e._v("contextNode "),o("a",{attrs:{href:"./node"}},[o("code",{pre:!0},[e._v("Node")])]),e._v(". A "),o("code",[e._v("Node")]),e._v(" representing the context to use for evaluating the expression.")]),o("li",[e._v("type "),o("code",{pre:!0},[e._v("number")]),e._v(". Specifies the type of result to be returned by evaluating the expression. This must be one of the "),o("code",[e._v("XPathResult.Constants")]),e._v(".")]),o("li",[e._v("result "),o("a",{attrs:{href:"./x-path-result"}},[o("code",{pre:!0},[e._v("XPathResult")])]),e._v(". Allows to specify a result object which may be reused and returned by this method. If this is specified as "),o("code",[e._v("null")]),e._v(" or the implementation does not reuse the specified result, a new result object will be returned.")])]),o("h4",{attrs:{id:"returns-xpathresult"}},[o("a",{attrs:{href:"#returns-xpathresult","aria-hidden":"true"}},[e._v("#")]),o("strong",[e._v("Returns")]),e._v(": "),o("a",{attrs:{href:"./x-path-result"}},[o("code",{pre:!0},[e._v("XPathResult")])])])])}),[],!1,null,null,null);"function"==typeof u&&u(h),"function"==typeof l&&l(h);t.default=h.exports},vu0Y:function(e,t,o){"use strict";t.a={name:"VueRemarkRoot",render:function(e){return e("div",null,this.$slots.default)}}}}]);
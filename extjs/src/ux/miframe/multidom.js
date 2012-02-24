/*
 * Copyright 2007-2011, Active Group, Inc.  All rights reserved.
 * ******************************************************************************
 * This file is distributed on an AS IS BASIS WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * ***********************************************************************************
 * @version 4.0 alpha-2
 * [For Ext 4.0 or higher only]
 *
 * License: Ext.ux.ManagedIframe.Component, Ext.ux.ManagedIframe.Element, and multidom.js
 * are licensed under the terms of the Open Source GPL 3.0 license:
 * http://www.gnu.org/licenses/gpl.html
 *
 * Commercial use is prohibited without a Commercial Developement License. See
 * http://licensing.theactivegroup.com.
 *
 */

(function(){

    var Element = Ext.core.Element,
        Evm     = Ext.EventManager,
        DC      = Ext.documentCache = {},
        OP      = Object.prototype,
        toString = OP.toString,
        bodyTag = /^body/i,
        HTMLDoc = '[object HTMLDocument]',
        objTypes = {
            array : '[object Array]',
            object : '[object Object]',
            complex : /object|array/i
        },
        slice = Array.prototype.slice,
        methodRE = /^(function|object)$/i,
        primitivesRE =/^(number|string|boolean)$/i,
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g,
        spacesRe = /\s+/,
        wordsRe = /\w/g,
        adjustDirect2DTableRe = /table-row|table-.*-group/,
        INTERNAL = '_internal',
        PADDING = 'padding',
        MARGIN = 'margin',
        BORDER = 'border',
        LEFT = '-left',
        RIGHT = '-right',
        TOP = '-top',
        BOTTOM = '-bottom',
        WIDTH = '-width',
        MATH = Math,
        HIDDEN = 'hidden',
        ISCLIPPED = 'isClipped',
        OVERFLOW = 'overflow',
        OVERFLOWX = 'overflow-x',
        OVERFLOWY = 'overflow-y',
        ORIGINALCLIP = 'originalClip',
        // special markup used throughout Ext when box wrapping elements
        borders = {l: BORDER + LEFT + WIDTH, r: BORDER + RIGHT + WIDTH, t: BORDER + TOP + WIDTH, b: BORDER + BOTTOM + WIDTH},
        paddings = {l: PADDING + LEFT, r: PADDING + RIGHT, t: PADDING + TOP, b: PADDING + BOTTOM},
        margins = {l: MARGIN + LEFT, r: MARGIN + RIGHT, t: MARGIN + TOP, b: MARGIN + BOTTOM},
        data = Ext.core.Element.data;

    Element.addMethods({
        remove : function(){
            var me = this,
                dom = me.dom;

            if (dom) {
                Ext.removeNode(dom);
                delete me.dom;   //remove this AFTER listeners/caches are cleared for document resolution
             }
        },

        getParentDocument : function(){
            return this.dom.ownerDocument || Element.getParentDocument(this.dom);
        },

        /**
         * Normalizes currentStyle and computedStyle.
         * @param {String} property The style property whose value is returned.
         * @return {String} The current value of the style property for this element.
         * @method
         */
        getStyle : function(){
            var ext = Ext,
                Element = ext.core.Element,
                supports = ext.supports,        //scope chain reductions
                notCamelRe = /\-/,
                normalize = Ext.bind(Element.normalize, Element),
                getStyleFn =
                    (document.defaultView && Ext.isFunction(document.defaultView.getComputedStyle) ) ?
                    function getStyle(){
                        var el = this.dom, camel, prop,
                            props = slice.call(arguments, 0),
                            v, cs, out, display, cleaner, style, view, cStyle,
                            propValues;

                        if( ext.isDocument(el)){
                            return null;
                        }

                        view = this.getParentDocument().defaultView;
                        style = el.style;

                        /* Caution: Firefox will not render "presentation" (ie. computed styles) in iframes
                         * that are display:none or are inheriting display:none.  Similar issues with legacy Safari.
                         */
                        cStyle = view.getComputedStyle(el, null) || {};
                        propValues = props.length > 1 ? {} : '';
                        while(props.length) {
                            prop = props.shift();
                            if(!prop) continue;

                            camel = normalize(prop);
                            out = style[camel] || cStyle[camel] || null;

                            // Ignore cases when the margin is correctly reported as 0, the bug only shows
                            // numbers larger.
                            if(camel == 'marginRight' && !supports.RightMargin && out != '0px' ){
                                cleaner = Element.getRightMarginFixCleaner(el);
                                display = style.display;
                                style.display = 'inline-block';
                                out = cStyle.marginRight;
                                style.display = display;
                                cleaner();
                            } else if(camel == 'backgroundColor' && !supports.TransparentColor && out == 'rgba(0, 0, 0, 0)' ){
                                out = 'transparent';
                            }

                            if(typeof propValues == 'object') {
                                propValues[prop] = out;
                            } else {
                                propValues = out;
                            }

                        }
                        return propValues;

                    } :
                    function getStyle(){
                        var el = this.dom,
                            m, cs, style, out,
                            camel, prop,
                            props = slice.call(arguments, 0),
                            propValues;

                        if (ext.isDocument(el)) {
                            return null;
                        }
                        style = el.style;

                        propValues = props.length > 1 ? {} : '';

                        while(props.length) {
                            prop = props.shift();
                            if(!prop) continue;

                            if (prop == 'opacity') {
                                out = 1;
                                if (style.filter && style.filter.match) {
                                    m = style.filter.match(opacityRe);
                                    if(m){
                                        var fv = parseFloat(m[1]);
                                        if(!isNaN(fv)){
                                            out = fv ? fv / 100 : 0;
                                        }
                                    }
                                }
                            } else {

                                camel = normalize(prop);
                                //on IE, currentStyle is quite accurate, so favor it first
                                out = el.currentStyle[camel] || style[camel] || null;
                            }

                            if(typeof propValues == 'object') {
                                propValues[prop] = out;
                            } else {
                                propValues = out;
                            }

                        }
                        return propValues;
                    };
            var getStyle = null;   //declared for GC
            return getStyleFn;
        }()
    });

    Element.addMethods({

        /**
         * Returns an object with properties top, left, right and bottom representing the margins of this element unless sides is passed,
         * then it returns the calculated width of the sides (see getPadding)
         * @param {String} sides (optional) Any combination of l, r, t, b to get the sum of those sides
         * @return {Object/Number}
         */
        getMargin : function(side){
            var me = this,
                key,
                o,
                margins;

            if (!side) {
                margins = [];
                for (key in me.margins){
                    me.margins.hasOwnProperty(key) && margins.push(me.margins[key]);
                }
                o = me.getStyles.apply(me, margins);
                for (key in o){
                    o.hasOwnProperty(key) && (o[key] = parseFloat(o[key]) || 0);
                }

                return o;
            } else {
                return me.addStyles.call(me, side, me.margins);
            }
        },

        /**
         * Returns an object with properties matching the styles requested.
         * For example, el.getStyles('color', 'font-size', 'width') might return
         * {'color': '#FFFFFF', 'font-size': '13px', 'width': '100px'}.
         * @param {String} style1 A style name
         * @param {String} style2 A style name
         * @param {String} etc.
         * @return {Object} The style object
         */
        getStyles : Element.prototype.getStyle,

        // private
        addStyles : function(sides, styles){
            var totalSize = 0,
                sidesArr = sides.match(wordsRe),
                i = 0,
                len = sidesArr.length,
                side,
                styleSides = [];

            if(len == 1) {
                totalSize += MATH.abs(parseFloat(this.getStyle( styles[sidesArr[0] ] ) ) || 0 );
            } else {
                for (; i < len; i++) {
                    side = sidesArr[i];
                    styleSides.push(styles[side]);
                }
                //Gather all at once, returning a hash
                styleSides = this.getStyles.apply(this, styleSides);

                for (i=0; i < len; i++) {
                    side = sidesArr[i];
                    totalSize += MATH.abs(parseFloat(styleSides[styles[side]]) || 0);
                }
            }
            return totalSize;
        },

        /**
         * Returns the current scroll position of the element.
         * @return {Object} An object containing the scroll position in the format {left: (scrollLeft), top: (scrollTop)}
         */
        getScroll : function() {
            var d = this.dom,
                doc = Ext.isDocument(d) ? d : this.getParentDocument(),
                body = doc.body,
                docElement = doc.documentElement,
                l,
                t,
                ret;

            if (d == doc || d == body || d == docElement) {

                if (Ext.isWebKit || !Ext.isDocumentStrict(doc)) {
                    l = body.scrollLeft;
                    t = body.scrollTop;
                } else {
                    l = docElement.scrollLeft;
                    t = docElement.scrollTop;
                }
                ret = {
                    left: l || 0 ,
                    top : t || 0
                };
            } else {
                ret = {
                    left: d.scrollLeft,
                    top : d.scrollTop
                };
            }
            return ret;
        },

        scrollIntoView : function(container, hscroll, top) {

            container = Ext.getDom(container) || Ext.getBody().dom;
            var el = this.dom,
                offsets = this.getOffsetsTo(container),
                scroll = Ext.fly(container, '_getScroll').getScroll(),
                // el's box
                left = offsets[0]+ (Ext.isIE ? scroll.left : 0),
                top = offsets[1] + (Ext.isIE ? scroll.top : 0),
                bottom = top + el.offsetHeight,
                right = left + el.offsetWidth,
                // ct's box
                ctClientHeight = container.clientHeight,
                ctScrollTop = scroll.top,
                ctScrollLeft = scroll.left,
                ctBottom = ctScrollTop + ctClientHeight,
                ctRight = ctScrollLeft + container.clientWidth;

            if( Ext.isFunction(el.scrollIntoView) ) {
                el.scrollIntoView(top !== false);  //to top default
            } else {
                container.scrollTop = top;
            }

            if (hscroll !== false) {
                if (el.offsetWidth > container.clientWidth || left < ctScrollLeft) {
                    container.scrollLeft = left;
                }
                else if (right > ctRight) {
                    container.scrollLeft = right - container.clientWidth;
                }
                container.scrollLeft = container.scrollLeft;
            }

            return this;
        },

        /**
        * Gets an object with all CSS positioning properties. Useful along with setPostioning to get
        * snapshot before performing an update and then restoring the element.
        * @return {Object}
        */
        getPositioning : function(){

            var styles = this.getStyles('left', 'top', 'position', 'right', 'bottom', 'z-index'),
                l = styles.left,
                t = styles.top;

            return Ext.apply(styles,
              {
                "right" : l ? "" : styles.right,
                "bottom" : t ? "" : styles.bottom
              });
        },

        /**
         * Translates the passed page coordinates into left/top css values for this element
         * @param {Number/Array} x The page x or an array containing [x, y]
         * @param {Number} y (optional) The page y, required if x is not an array
         * @return {Object} An object with left and top properties. e.g. {left: (value), top: (value)}
         */
        translatePoints: function(x, y) {

            var ext = Ext,
                me = this,
                styles = me.getStyles('position', 'top', 'left'),
                relative = styles.position == 'relative',
                o = me.getXY(),
                left = parseFloat(styles.left),
                top = parseFloat(styles.top);

            if (ext.isArray(x)) {
                 y = x[1];
                 x = x[0];
            }
            if (!ext.isNumber(left)) {
                left = relative ? 0 : me.dom.offsetLeft;
            }
            if (!ext.isNumber(top)) {
                top = relative ? 0 : me.dom.offsetTop;
            }
            left = (ext.isNumber(x)) ? x - o[0] + left : undefined;
            top = (ext.isNumber(y)) ? y - o[1] + top : undefined;
            return {
                left: left,
                top: top
            };
        },

        getBox: function(contentBox, local) {
            var me = this,
                xy,
                left,
                top,
                paddingW,
                bordersW,
                l, r, t, b, w, h, bx;

            if (!local) {
                xy = me.getXY();
                left = xy[0];
                top = xy[1];
            } else {
                left = parseInt(me.getStyle("left"), 10) || 0;
                top = parseInt(me.getStyle("top"), 10) || 0;
            }
            w = me.getWidth();
            h = me.getHeight();
            if (!contentBox) {
                bx = {
                    x: left,
                    y: top,
                    0: left,
                    1: top,
                    width: w,
                    height: h
                };
            } else {

                paddingW = me.getStyles(paddings.l, paddings.r, paddings.t, paddings.b);
                bordersW = me.getStyles(borders.l,  borders.r,  borders.t,  borders.b);

                l = (parseFloat(bordersW[borders.l]) || 0) + (parseFloat(paddingW[paddings.l]) || 0);
                r = (parseFloat(bordersW[borders.r]) || 0) + (parseFloat(paddingW[paddings.r]) || 0);
                t = (parseFloat(bordersW[borders.t]) || 0) + (parseFloat(paddingW[paddings.t]) || 0);
                b = (parseFloat(bordersW[borders.b]) || 0) + (parseFloat(paddingW[paddings.b]) || 0);

                bx = {
                    x: left + l,
                    y: top + t,
                    0: left + l,
                    1: top + t,
                    width: w - (l + r),
                    height: h - (t + b)
                };
            }
            bx.right = bx.x + bx.width;
            bx.bottom = bx.y + bx.height;

            return bx;
        },

        /*
         * Method to return numeric style properties either in 'px' or
         * converted from (pt, em, etc)
         * @param {String} prop The style property whose value is returned.
         * @return {String} The current value of the style property for this element.
         * @method
         */
        getPixelStyle  : function(){
            var isPix = /^\-?\d+(px)?$/i,
                isFontSize = /fontsize|font-size/i;
            return (document.defaultView && Ext.isFunction(document.defaultView.getComputedStyle) )
                ? Element.prototype.getStyle
                :function(prop){
                    var value = this.getStyle.apply(this, slice.call(arguments, 0 )),
                        me = this,
                        dom = me.dom;

                    if (!isPix.test(value)) {
                        var style = dom.style,
                            leftStyle = style.left,
                            runtimeStyleLeft = dom.runtimeStyle.left;

                        dom.runtimeStyle.left = dom.currentStyle.left;
                        style.left = isFontSize.test(prop) ? "1em" : (value || 0);
                        value = style.pixelLeft;
                        style.left = leftStyle;
                        dom.runtimeStyle.left = runtimeStyleLeft;
                        if(Ext.isNumber(value)) {
                            value = value + 'px';
                        }
                    }
                    return value;
                };
        }()
    });

    Ext.apply(Ext, {

        removeNode : function(n){

             var dom = n ? n.dom || n : null,
                 el, elc, elCache = Element.getDocumentCache(dom), parent;

            //clear out any references if found in the cache(s)
            if(dom && (elc = elCache[dom.id]) && (el = elc.el) ){
                if(el.dom){
                    Ext.enableNestedListenerRemoval ? Evm.purgeElement(el.dom, true) : Evm.removeAll(el.dom);
                }
                delete elCache[dom.id];
                delete el.dom;
                el = null;
            }
            //No removal for window, documents, or bodies
            if(!Ext.isWindow(dom) && !Ext.isDocument(dom) && !bodyTag.test(dom.tagName)){
                (parent = dom.parentElement || dom.parentNode) && parent.removeChild(dom);
            }
            dom = parent = null;
        },

        /**
         * HTMLDocument assertion with optional accessibility testing
         * @param {HTMLELement} el The DOM Element to test
         * @param {Boolean} testOrigin (optional) True to test "same-origin" access
         *
         */
        isDocument : function(el, testOrigin){
            var elm, test = false;
            try {
                elm = el ? el.dom || el : null;
                test = !!elm && (toString.apply(elm) == HTMLDoc || elm.nodeType == 9);
                if(test && testOrigin){
                    test = !!elm.location;
                }
            }catch(e){test = false;}
            return test;
        },

        isWindow : function(el){
          var elm = el ? el.dom || el : null;
          return elm ? !!elm.navigator || toString.apply(elm) == "[object Window]" : false;
        },

        /**
         * Returns true if an object's member reference is a callable function
         * @argument {Object} object
         * @argument {String} member The string name of the referenced object's member to be tested
         * (Member should be limited to those universally implemented as methods)
         */

        isHostMethod : function(object, member){
            var t = typeof object[member];
            return !!((methodRE.test(t) && object[member]) || t == 'unknown');
        },

        isHostObjectProperty : function(object, member) {
		    var t = typeof object[member];
            return !!((methodRE.test(t) && object[member]));
		},

        isComplex : function(obj){
           return !!obj && objTypes.complex.test(typeof obj);
        },

        isElement : function(obj){
            if(obj){
                var o = obj.dom || obj;
                return !!o.tagName || (/\[object html/i).test(toString.apply(o));
            }
            return false;
        },

        isEvent : function(obj){
            return toString.apply(obj) == '[object Event]' || (Ext.isObject(obj) && !Ext.type(obj.constructor) && (window.event && obj.clientX && obj.clientX === window.event.clientX));
        },

        isDocumentStrict : function(doc) {
            return (doc && doc.compatMode && doc.compatMode != "BackCompat");
        }

    });

    //give getDom document context support
    Ext.getDom = function (el, strict, doc) {
        doc = doc || document;
        if (!el || !doc) { return null; }
        if (el.dom) {
            return el.dom;
        }
        else if (typeof el == "string") {
            var e = doc.getElementById(el);
            if (e && Ext.isIE && strict) {
                if (el != e.getAttribute("id")) {
                    return null;
                }
            }
            return e;
        } else {
            return el;
        }
    };

    Ext.apply( Evm, {

        /**
        * Removes all event handers from an element.  Typically you will use {@link Ext.core.Element#removeAllListeners}
        * directly on an Element in favor of calling this version.
        * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
        */
        removeAll : function(element){
            var dom = Ext.getDom(element),
                cache, ev, id;
            if (!dom) {
                return;
            }
            cache = this.getElementEventCache(dom);

            for (ev in cache) {
                if (cache.hasOwnProperty(ev)) {
                    this.removeListener(dom, ev);
                }
            }
            var dCache = Element.getDocumentCache(dom);

            if(dCache) {
                id = Ext.isDocument(dom) ? Ext.documentId : (Ext.isWindow(dom) ? Ext.windowId : dom.id);
                dCache[id].events={};
            }
        },

         /**
         * Get the id of the element. If one has not been assigned, automatically assign it.
         * @param {Mixed} element The element to get the id for.
         * @return {String} id
         */
        getId : function(element) {
            var skipGarbageCollection = true,
                id;

            var el = Ext.getDom(element);

            if (Ext.isDocument(el)) {
                id = Ext.documentId;
            } else if ( Ext.isWindow(el)) {
                id = Ext.windowId;
            }
            else {
                id = Ext.id(el);
                skipGarbageCollection = false;
            }

            //Flyweight listeners are converted to Ext.Elements here:
            var cache = Element.assertElementCache(element.dom ? element : new Element(el), id);
            if (skipGarbageCollection) {
                cache[id].skipGarbageCollection = true;
            }
            return id;
        },

        /**
         * Gets the event cache for the object
         * @private
         * @param {HTMLElement} element The element
         * @return {Object} The event cache for the object
         */
        getElementEventCache : function(element) {
            if (!element) {
                return {};
            }
            var cache= Element.getDocumentCache(element),
                elementCache = cache[this.getId(element)] || {};
            return elementCache.events || (elementCache.events = {});
        }

    });

    //statics
    Ext.apply(Element, {

        addToCache : function(el, id) {

            if (el) {
                Element.assertElementCache(el, id || el.id);
            }
            return el;
        },

        /*
         * method to return the document context of a passed HTMLElement
         * @static
         */
        getParentDocument : function(el, accessTest){

            var doc, dom= null;

            try{
                dom = Ext.getDom(el); //will fail if El.dom is non "same-origin" document
            }catch(ex){}

            if(dom) {
                doc = Ext.isDocument(dom) ? dom : (dom.ownerDocument || dom.document);
            }
            return (doc && accessTest) ? Ext.isDocument(doc, accessTest) : doc;
        },

        assertElementCache  : function(element, id){
            var cache;
            if(element) {
                id = id || element.id;

                cache = Element.getDocumentCache(element) || {};
                cache[id] || (cache[id] = {
                    el: element,
                    data: {},
                    events: {}
                });
            }
            return cache;
        },

        getDocumentCache  : function(element, cacheId){
            var elDoc = Element.getParentDocument(element);

            if(elDoc === document) {
                return Ext.cache;
            }
            //Now test to ensure the foreign document is accessible
            if(elDoc && Ext.isDocument(elDoc ,true) ) {
                cacheId = cacheId || Ext.id(elDoc);
                return Ext.documentCache[cacheId] || (Ext.documentCache[cacheId] = {});
            }

        },

        //Purge all listener and cache entries for a named document cache
        clearDocumentCache : function(docId){
            // Purge all elements in the cache
            var el,
                cache = Ext.documentCache[docId] || {};
            for (el in cache) {
                if (cache.hasOwnProperty(el)) {
                    Ext.EventManager.removeAll(cache[el].el);
                }
            }
            delete Ext.documentCache[docId];
        },

        getXY : function(el) {

            el = Ext.getDom(el);

            var p,
                pe,
                b,
                bt,
                bl,
                dbd,
                x = 0,
                y = 0,
                scroll,
                hasAbsolute,
                styles,
                fly = Ext.fly(el),
                doc = fly.getParentDocument(),
                bd = (doc.body || doc.documentElement),
                ret = [0,0];

            if(el != doc.body && el != doc.documentElement){
                hasAbsolute = fly.isStyle("position", "absolute");

                if (el.getBoundingClientRect) {
                    b = el.getBoundingClientRect();
                    scroll = Ext.fly(doc).getScroll();
                    ret = [Math.round(b.left + (scroll.left || 0) ), Math.round(b.top + (scroll.top || 0))];
                } else {
                    p = el;

                    while (p) {
                        pe = Ext.fly(p);

                        x += p.offsetLeft;
                        y += p.offsetTop;

                        hasAbsolute = hasAbsolute || pe.isStyle("position", "absolute");

                        if (Ext.isGecko) {
                            styles = pe.getStyles("borderTopWidth","borderLeftWidth","overflow") || {};
                            y += bt = parseFloat(styles.borderTopWidth) || 0;
                            x += bl = parseFloat(styles.borderLeftWidth) || 0;

                            if (p != el && styles.overflow != 'visible') {
                                x += bl;
                                y += bt;
                            }
                        }
                        p = p.offsetParent;
                    }

                    if (Ext.isSafari && hasAbsolute) {
                        x -= bd.offsetLeft;
                        y -= bd.offsetTop;
                    }

                    if (Ext.isGecko && !hasAbsolute) {
                        styles = Ext.fly(bd).getStyles("borderLeftWidth", "borderTopWidth") || {};
                        x += parseFloat(styles.borderLeftWidth) || 0;
                        y += parseFloat(styles.borderTopWidth) || 0;
                    }

                    p = el.parentNode;
                    while (p && p != bd) {
                        if (!Ext.isOpera || (p.tagName != 'TR' && !Ext.fly(p).isStyle("display", "inline"))) {
                            x -= p.scrollLeft;
                            y -= p.scrollTop;
                        }
                        p = p.parentNode;
                    }
                    ret = [x,y];
                }
            }
            return ret;
        }

    });

    Ext.apply( Ext.supports, {

        //Allows a new battery of test to be submitted after initialization (or re-run altogether)
        init : function(tests) {
            var doc = document,
                div = doc.createElement('div'),
                i, test;

            tests = [].concat(tests || this.tests);
            var ln = tests.length;

            div.innerHTML = [
                '<div style="height:30px;width:50px;">',
                    '<div style="height:20px;width:20px;"></div>',
                '</div>',
                '<div style="width: 200px; height: 200px; position: relative; padding: 5px;">',
                    '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>',
                '</div>',
                '<div style="float:left; background-color:transparent;"></div>'
            ].join('');

            doc.body.appendChild(div);

            for (i = 0; i < ln; i++) {
                test = tests[i];
                this[test.identity] = test.fn.call(this, doc, div);
            }

            doc.body.removeChild(div);
        },

        /*
         * Adds Event Feature Detection to Ext.supports
         * @param {String} evName The event name to test
         * @param {HTMLElement/String} testEl The string tagName of the Element or, existing HTMLElement instance
          *     to use for the test.
         * @return {Boolean}
         */
        Event : function(){

            var TAGNAMES = {
                  'select':'input',
                  'change':'input',
                  'submit':'form',
                  'reset':'form',
                  'load':'img',
                  'error':'img',
                  'abort':'img'
                },
                cache = {},      //Cached results
                onPrefix = /^on/i,
                //Get a tokenized string of the form nodeName:type
                getKey = function(type, el){
                    var tEl = Ext.getDom(el);
                    return (tEl ?
                               (Ext.isElement(tEl) || Ext.isDocument(tEl) ?
                                    tEl.nodeName.toLowerCase() :
                                        el.self ? '#window' : el || '#object')
                            : el || 'div')
                            + ':' + type;
                };

            return function (evName, testEl, noPrefix) {
                evName = (evName || '').replace(onPrefix,'');
                var el,
                    isSupported = false,
                    eventName = noPrefix !== true ? 'on' + evName : evName,
                    tag = (testEl ? testEl : TAGNAMES[evName]) || 'div',
                    key = getKey(evName, tag);

                if(key in cache){
                    //Use a previously cached result if available
                    return cache[key];
                }

                el = Ext.isString(tag) ? document.createElement(tag): testEl;
                if(el){
                    isSupported = (eventName in el) ||
                            (window.Event !== undefined && String(evName).toUpperCase() in window.Event);

                    if (!isSupported && Ext.isHostMethod(el, 'setAttribute')){
                        if (typeof el[eventName] == 'undefined') {
                            el.setAttribute(eventName, 'return;');
                            isSupported = Ext.isHostMethod(el, eventName);
                            Ext.isHostMethod(el, 'removeAttribute') && el.removeAttribute(eventName);
                        }
                    }
                }

                el = null;
                //cache and return result for future tests
                return cache[key] = isSupported;
            };
        }(),

        /*
         * Tests whether a style attribute (and optional value) is supported) by the UA
         * @param {String} prop The style attribute to test (eg: 'border-top')
         * @param {Mixed} value (optional) value to use in the test.
         * @param {Boolean} forced true to ignore cached results
         * @return {Boolean}
         * @method
         * Note: position:fixed is still an ellusive on test IE6
         */
        Style : (function(){
            var cache = {},
                el = document.createElement('div'),
                normalize = Ext.bind(Element.normalize, Element);

            return function(prop, value, forced) {
                var key = prop + (value || "");

                if(!forced && key && (key in cache)) {
                    return cache[key];
                }else {
                    var supported = false,
                        camel = normalize(prop);

                    if(el.runtimeStyle){
                        try{
                            el.style[camel] = value || "";  //may throw if the value is unsupported
                            supported = el.runtimeStyle[camel] !== undefined;
                        }catch(e){};

                    }else {
                        var view = document.defaultView;
                        if(view && view.getComputedStyle){
                            var cs = (view.getComputedStyle(el, null)||{})[camel];
                            supported = cs !== undefined;
                            if(value){
                                el.innerHTML = '<div style="'+prop+':'+value+'"></div>';
                                supported = supported && el.firstChild.style[camel] != "";
                            }
                        }
                    }
                    return cache[key] = supported;
                }
            };

        })()
    });


    Ext.supports.tests.push(
        {
            identity: 'ComputedStyle',
            fn: function(doc, div, view) {
                view = doc.defaultView;
                return !!view && Ext.isFunction(view.getComputedStyle);  //coerce assertion to bool
            }
        }
    );


}());

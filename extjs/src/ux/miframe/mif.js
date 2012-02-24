
Ext.require([ '*' ]);


Ext.onReady(function() {

    Ext.QuickTips.init();

    var announce = function(e){

        if(e && e.getTarget && window.console){
            var target = e.getTarget();
            console.log(e.type, target, target.tagName || target.nodeName || target, e.frameAction, e.frameResetting);
        } else if (e) {

            console.info('comp', arguments);
        }
    },
    restaraunts = Ext.StoreMgr.lookup('restaraunts');  //Static model and Store for examples

    var configs = [{
        title       : 'MIFrame Basics',
        collapsible : true,
        id          : 'mifhost',
        closable    : true,
        closeAction : 'destroy',
        constrain   : true,
        x           : 10,
        y           : 100,
        width       : 400,
        height      : 480,
        headerPosition: 'left',
        autoScroll  : false,  //disable so as not to also overflow the child component
        layout      : 'fit',

        tbar        : [
            {
               text : 'Disable',
               handler : function(button){
                  var MIF = Ext.ComponentQuery.query('#mifhost > miframe')[0];

                  if(MIF){
                    MIF[ MIF.disabled ? 'enable' : 'disable']();
                    button.setText(MIF.disabled ? 'Enable' : 'Disable');
                  }

               }
            },
            {
                text      : 'Other Sites',
                arrowAlign: 'right',
                tooltip   : 'Clicking on the current frame document (shimmed) will also dismiss the attached menu.',
                                                                    //target your MIframe by name
                menu      : [
                    {text: 'Google.com', href : 'http://google.com',        hrefTarget: 'MIFportal' },
                    {text: 'GITHub.com' , href : 'http://www.github.com',   hrefTarget: 'MIFportal'},
                    {text: 'Sencha.com', href : 'http://www.sencha.com',    hrefTarget: 'MIFportal'},
                    {text: 'static.html (same-origin)', href : 'static.html', hrefTarget: 'MIFportal'}
                ]
            },
            {
               text : 'Print',
               handler : function(button){
                  var MIF = Ext.ComponentQuery.query('#mifhost > miframe')[0];
                  if(MIF) {
                    MIF.getContentTarget().print();
                  }
               }
            },
            {
               text : 'Reset',
               handler : function(button){
                  var MIF = Ext.ComponentQuery.query('#mifhost > miframe')[0];
                  if(MIF) {
                    MIF.getContentTarget().reset(null, function(){ console.info('reset!', arguments);});
                  }
               }
            },
            {
               text : 'Scroll to source',
               handler : function(button){
                  var MIF = Ext.ComponentQuery.query('#mifhost > miframe')[0];
                  if(MIF) {
                    var mifEl = MIF.frameElement;
                    mifEl.scrollChildIntoView( (mifEl.query('#theLink a') || [])[0]);
                  }
               }
            }
        ],
        items : {
            xtype : 'miframe',
            frameName : 'MIFportal',
            eventsFollowFrameLinks : true

            //,autoLoad : {url:'static.html'}
            ,src : 'static.html'
            //,html : 'Samples are easy to Follow!'

            ,listeners : {          //These listeners clear themselves on destruction
                datasetchanged : {
                    element : 'frameElement',
                    fn : function(e){
                        console.info('datasetchanged', this, e.frameResetting);
                    }
                },
                dataavailable : {    //raised when the document DOM is ready (same-origin only)
                    element : 'frameElement',  // MIFElement reference
                    fn : function(e, target){
                        console.info('dataavailable');
                        var doc = this.getDoc();
                        if( doc){
                            doc.on('click', function(e, target){
                                    console.log(this.id, target);
                                }, this);
                            this.scrollChildIntoView(this.query('#theLink a')[0]);
                        }
                    }
                },
                load : {
                    element : 'frameElement',
                    fn : function(e, target){
                       console.info(this.id, ' is loaded,' , this.isReset);

                    }
                },
                resize : {
                    element : 'frameElement',
                    fn : function(e, target){
                        e.frameResetting || console.info(this.id, ' was resized,' ,this.isReset);

                    }
                }
            }
        }
    },

    {
        title       : 'Favorite Restaraunts Report ( Templates )',
        collapsible : true,
        id          : 'mifwriter',
        closable    : true,
        closeAction : 'destroy',
        constrain   : true,
        x           : 500,
        y           : 100,
        width       : 400,
        height      : 480,
        headerPosition: 'right',
        autoScroll  : false,  //disable so as not to also overflow the child component
        layout      : 'fit',
        tbar : [
            {
                text : 'Sort',
                handler : function(b){
                    var MIF = Ext.ComponentQuery.query('#mifwriter > miframe')[0];
                    if(MIF) {
                        restaraunts.sort('cuisine');
                    }
                },
                tooltip : 're-sort by cuisine'
            },
            {
                text : 'Edit',
                enableToggle : true,
                toggleHandler : function(b, pressed){
                    var MIF = Ext.ComponentQuery.query('#mifwriter > miframe')[0];
                    if(MIF) {
                        MIF.frameElement.getBody().dom.contentEditable = String(!!pressed);
                    }
                },
                tooltip : 'Toggle inline editing'
            },
            '->',
            {
               text : 'Print',
               handler : function(button){
                  var MIF = Ext.ComponentQuery.query('#mifwriter > miframe')[0];
                  if(MIF) {
                    MIF.getContentTarget().print();
                  }
               }
            }

        ],

        items : {
            xtype       : 'miframe',
            frameName   : 'MIFREPORT',
            restaraunts : restaraunts,
            data        : Ext.pluck(restaraunts.getRange(), 'data'),

            tpl   : [
                '<html><head>',
                '<style type="text/css">',
                    '@media all {.page-break  { display:none; } }',
                    '@media print {.page-break  { display:block; page-break-before:always; }}',
                    '@page { margin-left: 3cm; }',
                    '@page :left { margin-left: 4cm;}',
                    '.name { float:left; } .cuisine { float:right; font-style:italic;}',
                    '.x-clear { clear:both; }',
                    'body { font-family : \'Lucida Grande\', helvetica, verdana, sans-serif; }',
                    '.report-header * { padding:5px;}',
                    '.title { position:absolute;right:10px;top:5px;}',
                    '.report-line { color:#333333; padding-bottom : 3px;}',
                '</style>',
                '</head><body style="height:100%">',
                '<tpl for=".">',
                    '<tpl if="(xindex == 1) || (xindex % 32 == 0)">',
                        //only topmost header is visible @screen
                        '<div class="report-header {[ (xindex == 1) ? \"\" : \"page-break\" ]}">',
                            '<img src = "http://www.sencha.com/files/misc/training-globe.png" ></img>',
                            '<div class="title">International Cuisine</div>',
                        '</div>',
                    '</tpl>',
                    '<div class="report-line">',
                        '<div class="name">{name}</div>',
                        '<div class="cuisine">{cuisine}</div>',
                        '<div class="x-clear"></div>',
                    '</div>',
                '</tpl>',
                '</body></html>'
            ],

            listeners : {          //These listeners clear themselves on destruction

                dataavailable : {    //raised when the document DOM is ready (same-origin only)
                    element : 'frameElement',  // MIFElement reference
                    fn : function(e, target){
                        console.info('dataavailable ');
                    }
                },

                datachanged : {
                    element : 'restaraunts',      //Re-render the report when the store changes (eg sort)
                    fn : function(restaraunts){
                        //keep the report up-to-date
                        var MIF = Ext.ComponentQuery.query('#mifwriter > miframe')[0];
                        if(MIF) {
                            MIF.update(Ext.pluck(restaraunts.getRange(), 'data') );
                        }
                    }
                }
            }
        }

    }

    ];

    var container = Ext.getBody();
    Ext.each(configs, function(config) {

        Ext.createWidget('window', Ext.applyIf(config, {
            renderTo: container,
            bodyPadding: 4

        })).show().toFront();
    });

    var shimFrames = function(shimmed){
        Ext.invoke(Ext.ComponentQuery.query('miframe'), 'toggleShim', !!shimmed);
    };

    // optional layout enhancements

    //Dismiss menus -- even when ANY ManagedIframe document is clicked
    Ext.util.Observable.observe(Ext.menu.Menu, {
        'beforeshow': function() { shimFrames( true); },
        'hide'      : function() { shimFrames(false); }
    });

    //Keep the mouse moving smoothly across ManagedIframes through resizing actions
    Ext.util.Observable.observe(Ext.resizer.Resizer, {
        'beforeresize': function() { shimFrames( true); },
        'resize'      : function() { shimFrames(false); }
    });

    //Allow regain of focus on deactivated Windows when clicking over the IFRAME
    Ext.util.Observable.observe(Ext.window.Window, {
        'deactivate'  : function(win) {
            var MIF = win.child('miframe');
            if ( MIF) {
                MIF.toggleShim(true);
            }
        },
        'activate'    : function(win) {
            var MIF = win.child('miframe');
            if ( MIF) {
                MIF.toggleShim(false);
            }
        }
    });

});



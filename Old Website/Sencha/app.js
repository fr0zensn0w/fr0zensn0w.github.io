/**
 * Created by ac185252 on 5/20/2015.
 */

 Ext.application({
    name: 'app',
    launch: function() {
        console.log("Hello from IntellJ and ExtJS " + Ext.getVersion('ext.js'));
        console.log("After this should be a break point");
        console.log("this should not show...when the break point is on there");
    }
});


Ext.onReady(function() {
    ///////-------------------------------------------------------------------------------------------------------------

    var color = '#00CCFF';
    Ext.create('Ext.container.Container', {
        minWidth: 40,
        minHeight: 50,
        renderTo: Ext.getBody(),
        border: 3,
        style: {
            borderColor: 'white',
            borderStyle: 'dashed',
            background: color,

        },
        items: [{
            xtype: 'button',
            text: 'Computer Information',
            handler: function() {
                var  getKeys = function(obj) {
                    var keys = [];
                    for ( var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                };

                var k = getKeys(Ext.is);
                var str = '';

                for (var i=0; i<k.length; i++) {
                    var val = k[i];
                    if (val != 'init' && val != 'platforms' && Ext.is[val] == true)
                        str += val + ': ' + Ext.is[val] + '</br>';
                }

                Ext.Msg.alert('Info', str);
                //alert("Info button pressed");
            }
        }, {
            xtype: 'button',
            text: 'Popup Window',
            handler: function() {
                Ext.create('Ext.window.Window', {
                    title: 'Window',
                    height: 300,
                    //width: body.dom.clientWidth - 20,
                    width: 650,

                    margin: '10 10 10 10',
                    autoShow: true,
                    collapsible: true,
                    style: {
                        background: color
                    },
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: 'Start date'
                    }],

                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        layout: {
                            pack: 'center'
                        },
                        items: [{
                            text: 'Docked at the top'
                        }]
                    }],
                    bbar: [{
                        xtype: 'button',
                        text: 'Bottom Button Bar'
                    }]
                });
            }
        }]
    });
/////-------------------------------------------------------------------------------
    // color picker

    //Ext.create('Ext.picker.Color', {
    //    value: '993300',  // initial selected color
    //    renderTo: document.body,
    //    floating : false,
    //    draggable : false,
    //    listeners: {
    //        select: function(picker, selColor) {
    //            var newColor = selColor.toString();
    //            newColor = '#' + newColor;
    //            color = newColor;
    //            divE1.applyStyles("background-color:" + color);
    //
    //        }
    //    }
    //});

/////-------------------------------------------------------------------------------

    var me = this;
    var tabPanel = Ext.create('Ext.tab.Panel', {
        title : 'Tab Form',
        layout: 'fit',
        //width : 600,
        //height : 200,
        renderTo : Ext.getBody(),
        defaults : {
            margin : '10 10 10 10',
            frame: true,
        },
        activeTab: 0,
        removePanelHeader: true,
        items : [ {
            defaults : {
                margin : '10 10 10 10',
                frame: true,
            },
            autoScroll: true,
            title: 'Simple Form',
            items: [{
                xtype : 'textfield',
                fieldLabel : 'Name',
                id: 'Name'

            }, {
                xtype : 'textfield',
                fieldLabel : 'Email',
                //itemId: 'Email'
                id: 'Email'
            }, {
                xtype: 'datefield',
                fieldLabel : 'Date Picker',
                id: 'Date'
            },{
                xtype : 'button',
                text : 'Reset',
                handler: function() {
                    Ext.Msg.alert('Reset', 'Form will be reset!');
                }
            },{
                xtype : 'button',
                text : 'Submit',
                handler: function() {
                    // Ext.Msg.alert('Submit', 'Form will be submitted to server!');
                    Ext.Msg.alert('Submitted information', 'Name: ' + Ext.getCmp('Name').getValue() + '</br>' + 'Email: '
                        + Ext.getCmp('Email').getValue() + '</br>' + 'Date Chosen: '+ Ext.getCmp('Date').getValue());
                }
            }, {
                xtype : 'button',
                text : 'makeWider',
                handler: function() {
                    tabPanel.setWidth(tabPanel.getWidth() + 100);
                }
            },{
                xtype : 'button',
                text : 'reduce width',
                handler: function() {
                    tabPanel.setWidth(tabPanel.getWidth() - 100);
                }
            }, {
                xtype : 'checkbox',
                fieldLabel : 'checkbox'
            }],
            activeTab: 1
        }, {
            title: 'Color Picker',
            closable: false,
            xtype: 'colorpicker',
            value: '993300',
            listeners: {
                select: function(picker, selColor) {
                    var newColor = selColor.toString();
                    newColor = '#' + newColor;
                    color = newColor;
                    divE1.applyStyles("background-color:" + color);

                }
            }
        }, {
            title: 'Tab 3',
            closable: true,
            defaults : {
                margin : '10 10 10 10',
                frame: true,
            },
            items: [{
                xtype : 'textfield',
                fieldLabel : 'Manual Color in Hex',
                id: 'Tab3text',
            }],
        }],
    });
    ///////-------------------------------------------------------------------------------------------------------------




    //handle the background
    var divE1 = Ext.get('my-div');
    var body = Ext.getBody();
    console.log(body);
    divE1.removeCls('x-hidden'); // makes the box visible
    divE1.applyStyles("background-color:magenta;");
    divE1.setWidth(body.dom.clientWidth);



    // when the body is clicked do something
    Ext.getBody().on('click', function(e, t, eOpts){
        if (t.id === 'my-div') {
            //alert('div clicked');
            //alert(divE1.getWidth() + '');
            if (divE1.getWidth() < body.dom.clientWidth) {
                divE1.setWidth(body.dom.clientWidth, {duration: 250, easing: 'elasticIn'});
                divE1.setHeight(500, {duration: 250, easing: 'elasticIn'});
            } else if (divE1.getWidth() > body.dom.clientWidth / 2) {
                divE1.setWidth(body.dom.clientWidth / 2, {duration: 250, easing: 'elasticIn'});
                divE1.setHeight(300, {duration: 250, easing: 'elasticIn'});
            }
        } else {
            //alert('body clicked');
        }
    });
//---------------------------------------------------------

    ////// this section of code works if you comment it out
//    var function2;
//    function2 = function(x) {
//        return x * x;
//    }
//
//    Ext.Msg.alert('should be 9 :' + function2(3));
    //-------------------------------------------------------

});

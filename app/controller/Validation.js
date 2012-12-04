Ext.define('Kort.controller.Validation', {
    extend: 'Ext.app.Controller',
    
    config: {
        views: [
            'validation.NavigationView',
            'validation.List',
            'validation.vote.Container'
        ],
        refs: {
            mainTabPanel: '#mainTabPanel',
            validationNavigationView: '#validationNavigationView',
            validationList: '.validationlist'
        },
        control: {
            validationList: {
                itemtap: 'onValidationListItemTap'
            }
        },
        
        itemTapDisabled: false
    },
    
    init: function() {
        var me = this;
        me.callParent(arguments);
        
        me.getApplication().on({
            votesend: { fn: me.refreshView, scope: me },
            fixsend: { fn: me.refreshView, scope: me }
        });
    },
    
    refreshView: function() {
        var me = this,
            validationsStore = Ext.getStore('Validations');
        
        if(me.getValidationList()) {
            validationsStore.load(function(records, operation, success) {
                validationsStore.updateDistances(Kort.geolocation);
                me.getValidationList().refresh();
            });
        }
    },
    
    onValidationListItemTap: function(list, index, target, record, e) {
        var me = this,
            voteTabPanel;
        
        if(!me.getItemTapDisabled()) {
            me.setItemTapDisabled(true);
            voteTabPanel = Ext.create('Kort.view.validation.vote.Container', {
                record: record,
                title: record.get('title')
            });
            me.getValidationNavigationView().push(voteTabPanel);
        }
        Ext.defer(function() {
            me.setItemTapDisabled(false);
        }, 200);
    }
});
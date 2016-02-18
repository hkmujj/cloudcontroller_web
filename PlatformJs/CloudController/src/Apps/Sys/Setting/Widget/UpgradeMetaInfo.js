/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.Setting.Widget.UpgradeMetaInfo", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("UPGRADE_META_INFO");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("UPGRADE_META_INFO");
   },
   
   metaInfoGrid : null,
   /**
    * @template
    * @inheritdoc
    */
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 800,
         minWidth: 800,
         minHeight: 400,
         height: 400,
         resizable: false,
         layout: "fit",
         maximizable: false
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: [
            this.getServiceMetaInfoConfig()
         ],
         buttons : [{
               text : this.LANG_TEXT.BTN.SAVE,
               listeners : {
                  click : this.saveHandler,
                  scope : this
               }
         }]
      });
      this.callParent();
   },
   
   saveHandler : function()
   {
      var items = [];
      this.metaInfoGrid.store.each(function(record){
         var data = record.getData();
         delete data.id;
         items.push(data);
      }, this);
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.SAVE"));
      this.appRef.setServiceServerAddressMeta(items, function(response){
         this.loadMask.hide();
         if(response.status){
            this.metaInfoGrid.store.reload();
         }else{
            Cntysoft.raiseError(Ext.getClassName(this), "saveHandler", response.getErrorString());
         }
      }, this);
   },
   
   getServiceMetaInfoConfig: function()
   {
      var COLS = this.LANG_TEXT.COLS;
      var NAMES = this.GET_LANG_TEXT("SYS_NAMES");
      return {
         xtype: "grid",
         columns: [
            {text: COLS.NAME, dataIndex: "name", flex: 1, resizable: false, menuDisabled: true},
            {text: COLS.IP, dataIndex: "ip", width: 250, resizable: false, menuDisabled: true, editor: {
                  xtype: "textfield",
                  allowBlank: false
               }
            },
            {text: COLS.PORT, dataIndex: "port", width: 150, resizable: false, menuDisabled: true, editor: {
                  xtype: "numberfield",
                  allowBlank: false,
                  minValue : 1000
               }}
         ],
         plugins: {
            ptype: "cellediting",
            clicksToEdit: 1
         },
         autoScroll: true,
         store: new Ext.data.Store({
            fields: [
               {name: "name", type: "string"},
               {name: "ip", type: "string"},
               {name: "port", type: "string"},
               {name: "key", type: "string"}
            ],
            data: [
               {name: NAMES.CLOUD_CONTROLLER, key: "CloudController"}
            ]
         }),
         listeners : {
            afterrender : function(grid)
            {
               this.metaInfoGrid = grid;
            },
            scope : this
         }
      };
   },
   destroy : function()
   {
      delete this.metaInfoGrid;
      this.callParent();
   }
});
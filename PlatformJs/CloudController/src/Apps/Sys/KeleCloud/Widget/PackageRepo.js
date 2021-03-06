/*
 * Cntysoft Cloud Software Team
 *
 * @author SOFTBOY <cntysoft@163.com>
 * @copyright  Copyright (c) 2010-2011 Cntysoft Technologies China Inc. <http://www.cntysoft.com>
 * @license    http://www.cntysoft.com/license/new-bsd     New BSD License
 */
Ext.define("App.Sys.KeleCloud.Widget.PackageRepo", {
   extend: "WebOs.Kernel.ProcessModel.AbstractWidget",
   requires: [
      "Cntysoft.Utils.ColRenderer",
      "CloudController.Comp.Uploader.SimpleUploader"
   ],
   LANG_TEXT: null,
   initPmTextRef: function()
   {
      this.pmText = this.GET_PM_TEXT("PACKAGE_REPO");
   },
   initLangTextRef: function()
   {
      this.LANG_TEXT = this.GET_LANG_TEXT("PACKAGE_REPO");
   },
   contextMenu: null,
   applyConstraintConfig: function(config)
   {
      this.callParent([config]);
      Ext.apply(config, {
         width: 1000,
         minWidth: 1000,
         height: 500,
         minHeight: 500,
         maximizable: true,
         layout: "fit"
      });
   },
   initComponent: function()
   {
      Ext.apply(this, {
         items: this.getGridPanelConfig(),
         bbar: this.getBBarConfig()
      });
      this.callParent(arguments);
   },
   itemContextMenuHandler: function(view, record, item, index, event)
   {
      var pos = event.getXY()
      var menu;
      event.stopEvent();
      menu = this.createContextMenu();
      menu.record = record;
      menu.showAt(pos[0], pos[1]);
   },
   createContextMenu: function()
   {
      if(!this.contextMenu){
         var L = this.LANG_TEXT.BTN;
         this.contextMenu = new Ext.menu.Menu({
            ignoreParentClicks: true,
            width: 150,
            items: [{
                  text: L.DELETE_FILE
               }],
            listeners: {
               click: this.deleteFileHandler,
               scope: this
            }
         });
      }
      return this.contextMenu;
   },
   
   deleteFileHandler : function(menu, item)
   {
      var record = menu.record;
      this.setLoading(Cntysoft.GET_LANG_TEXT("MSG.DELETE"));
      this.appRef.removeSoftware(record.get("filename"), function(response){
         this.loadMask.hide();
         this.fsview.store.reload();
      }, this);
   },
   
   getGridPanelConfig: function()
   {
      var L = this.LANG_TEXT.COLS;
      return {
         xtype: "grid",
         columns: [
            {text: L.FILE_NAME, dataIndex: "filename", flex: 1, resizable: false, menuDisabled: true},
            {text: L.FILE_SIZE, dataIndex: "filesize", width: 200, resizable: false, menuDisabled: true, renderer: Cntysoft.Utils.ColRenderer.filesizeRenderer}
         ],
         autoScroll: true,
         store: new Ext.data.Store({
            autoLoad: true,
            fields: [
               {name: "filename", type: "string"},
               {name: "filesize", type: "string"}
            ],
            proxy: {
               type: "websocketgateway",
               websocketEntryName: "metaserver",
               invokeMetaInfo: {
                  name: "SoftwareRepo/RepoInfo",
                  method: "lsSoftwareRepoDir"
               }
            }
         }),
         listeners: {
            afterrender: function(grid)
            {
               this.fsview = grid;
            },
            itemcontextmenu: this.itemContextMenuHandler,
            scope: this
         }
      };
   },
   getBBarConfig: function()
   {
      var L = this.LANG_TEXT.BTN;
      return [{
            xtype: "ccsimpleuploader",
            text: L.UPLOAD_SOFTWARE,
            maskTarget: this,
            websocketEntry:"metaserver",
            listeners: {
               uploadsuccess: function()
               {
                  this.fsview.store.reload();
               },
               scope: this
            }
         }];
   },
   destroy: function()
   {
      delete this.fsview;
      if(this.contextMenu){
         this.contextMenu.destroy();
         delete this.contextMenu;
      }
      this.callParent();
   }
});
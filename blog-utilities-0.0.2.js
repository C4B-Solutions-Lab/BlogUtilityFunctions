/*!
 * BlogUtilities JavaScript library v0.0.2
 * (c) Dabrowski-Software-Development (https://github.com/dabrowski-software-development/BlogUtilityFunctions)
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(
 function (window) {
    var self = this;


    var _systemFileStorageFilePath = null;                                  // note that here you provide relative path to the website module (MODULE_NAME), not js module (MODULE_NAME.js)

    var _parentContainerCssClass = null;                                    // note that here you provide full CSS class identifier
    var _dataDivContainerCssClassName = null;                               // note that here you provide only CSS class name
    var _dataDivLineDefinitionContainerCssClassName = null;                 // note that here you provide only CSS class name
    var _dataDivContainerTitleCssClassName = null;                          // note that here you provide only CSS class name
    var _dataDivContainerCreationDateCssClassName = null;                   // note that here you provide only CSS class name
    var _errorDivContainerCssClassName = null;                              // note that here you provide only CSS class name

    var _parentContainerToHostDynamicContentEditor = null;                  // this has to be full CSS class name starting with dot
    var _editorDynamicContentCssClass = null;                               // this class has to exist in CSS handling editor content moderation

    var _dynamicContentProcessorFilePath = null;
    var _dynamicContentProcessorRelativePathToStorage = null;

    var _editorSettingsTitle = "CONTENT MODERATION";
    var _editorSettingsButton_ApplyChanges = "APPLY CHANGES";
    var _editorSettingsButton_CancelChanges = "CANCEL";

    // below settings are typical for popup editor
    var _editorContainerUniqueIdInternal = null;
    var _dynamicEditor = null;
    var _editorSettings = {
            width: 651,
            height: 296,
            autoOpen: true,
            closeOnEscape: false,
            draggable: false,
            resizable: true,            
            dialogClass: "no-close",
            title: _editorSettingsTitle,
            buttons: [
                        {
                            text: _editorSettingsButton_ApplyChanges,
                            click: function() {
                                $(this).dialog("close");
                            }
                        },
                        {
                            text: _editorSettingsButton_CancelChanges,
                            click: function() {
                                $(this).dialog("close");
                            }
                        }                        
            ],
            create: function () {
                            $(this).parent()
                                   .find('div.ui-dialog-titlebar')
                                   .addClass('titleCaption');

                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(1)
                                .addClass("applyChanges")
                                .click(onApplyChangesInternal)

                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(1).effect("slide", {}, 900, null);



                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(2)
                                .addClass("cancelChanges")
                                .click(onCancelChangesInternal)

                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(2)
                                .effect("slide", {}, 900, null);                                
            },                        
            open: function() {
                $(_editorContainerUniqueIdInternal).addClass(_editorDynamicContentCssClass);
                $(_editorContainerUniqueIdInternal).effect("slide", {}, 1000, null);
            },
            close: function() {
                $(_editorContainerUniqueIdInternal).removeClass(_editorDynamicContentCssClass);
                $(_editorContainerUniqueIdInternal).effect("clip", {}, 3000, null);
            }
    };

    function setupDynamicEditorInternal() {
        _dynamicEditor = '<div id="editorContainerEditable"><textarea id="' + _editorContainerUniqueIdInternal.substr(1) + '" rows="340" cols="81"></textarea></div>'
    }

    function addTemporaryContainerToServeContentEditionInternal() {
        $(_parentContainerToHostDynamicContentEditor).append(_dynamicEditor);
    }

    function removeTemporaryContainerToServeContentEditionInternal() {
        document.body.removeChild(document.body.lastChild);
    }

    function refreshContentInternal() {
        location.reload();
    }

    function onApplyChangesInternal() {
        processContentChangesInternal();
    }

    function onCancelChangesInternal() {
        refreshContentInternal();
    }

    function postActionResponseInternal(data, status) {
        removeTemporaryContainerToServeContentEditionInternal();
        refreshContentInternal();
    }

    function processContentChangesInternal() {
          $.post(_dynamicContentProcessorFilePath,
                 {
                    contentRawData: $(_editorContainerUniqueIdInternal).val(),
                    contentRawDataStorageFilePath: _dynamicContentProcessorRelativePathToStorage
                 },
                 postActionResponseInternal
                );
    }

    function shrinkEditableAreaInternal() {
        _dynamicEditor = _dynamicEditor.replace("81", "71")
    }

    function adjustNavigationButtonsAndTitleBarInternal() {
        if(activeBrowser.browserUtility.ie) {
            adjustNavigationButtonsAndTitleBar_ie_Internal();
        }
        else if(activeBrowser.browserUtility.opera) {
            adjustNavigationButtonsAndTitleBar_opera_Internal();
        }
        else if(activeBrowser.browserUtility.firefox) {
            adjustNavigationButtonsAndTitleBar_firefox_Internal();
        }
        else if(activeBrowser.browserUtility.safari) {
            adjustNavigationButtonsAndTitleBar_safari_Internal();
        }
    }

    function adjustNavigationButtonsAndTitleBar_ie_Internal() {
        _editorSettings.width = _editorSettings.width + 4;
    }

    function adjustNavigationButtonsAndTitleBar_opera_Internal() {
        _editorSettings.width = _editorSettings.width - 2;
    }

    function adjustNavigationButtonsAndTitleBar_firefox_Internal() {
        _editorSettings.width = _editorSettings.width + 4;
    }    

    function adjustNavigationButtonsAndTitleBar_safari_Internal() {
        _editorSettings.width = _editorSettings.width + 1;
    }



    
    // main private function # 1 
    function initializeBlogFunctionalityInternal(
                                                 systemFileStorageFilePath,
                                                 parentContainerCssClass,
                                                 dataDivContainerCssClassName,
                                                 dataDivLineDefinitionContainerCssClassName,
                                                 dataDivContainerTitleCssClassName,
                                                 dataDivContainerCreationDateCssClassName,
                                                 errorDivContainerCssClassName,
                                                 parentContainerToHostDynamicContentEditor,
                                                 editorDynamicContentCssClass,
                                                 dynamicContentProcessorFilePath,
                                                 dynamicContentProcessorRelativePathToStorage,
                                                 editorSettingsTitle,
                                                 editorSettingsButton_ApplyChanges,
                                                 editorSettingsButton_CancelChanges,
                                                 isFirstLineHoldingTitle,
                                                 isLastLineHoldingCreationDate
                                                )
    {
        _systemFileStorageFilePath = systemFileStorageFilePath;
        _parentContainerCssClass = parentContainerCssClass;
        _dataDivContainerCssClassName = dataDivContainerCssClassName;
        _dataDivLineDefinitionContainerCssClassName = dataDivLineDefinitionContainerCssClassName;
        _dataDivContainerTitleCssClassName = dataDivContainerTitleCssClassName;
        _dataDivContainerCreationDateCssClassName = dataDivContainerCreationDateCssClassName;
        _errorDivContainerCssClassName = errorDivContainerCssClassName;

        _parentContainerToHostDynamicContentEditor = parentContainerToHostDynamicContentEditor;
        _editorDynamicContentCssClass = editorDynamicContentCssClass;

        _dynamicContentProcessorFilePath = dynamicContentProcessorFilePath;
        _dynamicContentProcessorRelativePathToStorage = dynamicContentProcessorRelativePathToStorage;

        _editorSettingsTitle = editorSettingsTitle || _editorSettingsTitle;
        _editorSettingsButton_ApplyChanges = editorSettingsButton_ApplyChanges || _editorSettingsButton_ApplyChanges;
        _editorSettingsButton_CancelChanges = editorSettingsButton_CancelChanges || _editorSettingsButton_CancelChanges;

        //load blog content
        jsUtilities.fillChildContainersUnderGivenParentContainer(
                                                                    _systemFileStorageFilePath,
                                                                    _parentContainerCssClass,
                                                                    _dataDivContainerCssClassName, _dataDivLineDefinitionContainerCssClassName, _errorDivContainerCssClassName,
                                                                    isFirstLineHoldingTitle, isLastLineHoldingCreationDate,
                                                                    _dataDivContainerTitleCssClassName, _dataDivContainerCreationDateCssClassName
                                                                );
    }

    // main private function # 2 
    function runContentEditorInternal(editorContainerUniqueID) {
        _editorContainerUniqueIdInternal = editorContainerUniqueID; //set popup editor name
        setupDynamicEditorInternal();

        if(activeBrowser.browserUtility.ie || activeBrowser.browserUtility.firefox || activeBrowser.browserUtility.safari) {
            shrinkEditableAreaInternal();
        }

        adjustNavigationButtonsAndTitleBarInternal();

        addTemporaryContainerToServeContentEditionInternal();
        $(_editorContainerUniqueIdInternal).load(_systemFileStorageFilePath, null);
        $(_editorContainerUniqueIdInternal).dialog(_editorSettings);        
    }



    /* Public API begining */

    self.initializeBlogFunctionality = function(
                                             systemFileStorageFilePath,
                                             parentContainerCssClass,
                                             dataDivContainerCssClassName,
                                             dataDivLineDefinitionContainerCssClassName,
                                             dataDivContainerTitleCssClassName,
                                             dataDivContainerCreationDateCssClassName,
                                             errorDivContainerCssClassName,
                                             parentContainerToHostDynamicContentEditor,
                                             editorDynamicContentCssClass,
                                             dynamicContentProcessorFilePath,
                                             dynamicContentProcessorRelativePathToStorage,
                                             editorSettingsTitle,
                                             editorSettingsButton_ApplyChanges,
                                             editorSettingsButton_CancelChanges,
                                             isFirstLineHoldingTitle,
                                             isLastLineHoldingCreationDate                                        
    ) {
        initializeBlogFunctionalityInternal(
                                             systemFileStorageFilePath,
                                             parentContainerCssClass,
                                             dataDivContainerCssClassName,
                                             dataDivLineDefinitionContainerCssClassName,
                                             dataDivContainerTitleCssClassName,
                                             dataDivContainerCreationDateCssClassName,
                                             errorDivContainerCssClassName,
                                             parentContainerToHostDynamicContentEditor,
                                             editorDynamicContentCssClass,
                                             dynamicContentProcessorFilePath,
                                             dynamicContentProcessorRelativePathToStorage,
                                             editorSettingsTitle,
                                             editorSettingsButton_ApplyChanges,
                                             editorSettingsButton_CancelChanges,
                                             isFirstLineHoldingTitle,
                                             isLastLineHoldingCreationDate                                             
                                           );
    }

    self.runContentEditor = function(editorContainerUniqueID) {
        return runContentEditorInternal(editorContainerUniqueID);
    }

    /* Public API end */



    /* Expose module API to the outside world */
    window.blogUtilities = window.blogUtilities || self;
 }
)(window)

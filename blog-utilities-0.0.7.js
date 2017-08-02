/*!
 * BlogUtilities JavaScript library v0.0.7
 * (c) Dabrowski-Software-Development (https://github.com/dabrowski-software-development/BlogUtilityFunctions)
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
(
 function (window) {
    var self = this;



    // these two variables control page scroll pausing and resuming
    var _pageIsBeingScrolled = false;
    var _pageIsPaused = false;
    var _pageSpeedDefaultValue = 10; // seconds


    var _abstractionOfData = null;                                          // this will hold path to module storage location or module storage data itself

    var _useBackwardCompatibility;                                          // this flag specifies wheter use v18 (true) functionality or v19 (false)

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
                                .click(onApplyChanges_Internal)

                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(1).effect("slide", {}, 900, null);



                            $(this).closest(".ui-dialog")
                                .find(".ui-button")
                                .eq(2)
                                .addClass("cancelChanges")
                                .click(onCancelChanges_Internal)

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

    function setupDynamicEditor_Internal() {
        _dynamicEditor = '<div id="editorContainerEditable"><textarea id="' + _editorContainerUniqueIdInternal.substr(1) + '" rows="340" cols="81"></textarea></div>'
    }

    function addTemporaryContainerToServeContentEdition_Internal() {
        $(_parentContainerToHostDynamicContentEditor).append(_dynamicEditor);
    }

    function removeTemporaryContainerToServeContentEdition_Internal() {
        document.body.removeChild(document.body.lastChild);
    }

    function refreshContent_Internal() {
        location.reload();
    }

    function onApplyChanges_Internal() {
        processContentChanges_Internal();
    }

    function onCancelChanges_Internal() {
        refreshContent_Internal();
    }

    function postActionResponse_Internal(data, status) {
        removeTemporaryContainerToServeContentEdition_Internal();
        refreshContent_Internal();
    }

    function processContentChanges_Internal() {
          $.post(_dynamicContentProcessorFilePath,
                 {
                    contentRawData: $(_editorContainerUniqueIdInternal).val(),
                    contentRawDataStorageFilePath: _dynamicContentProcessorRelativePathToStorage
                 },
                 postActionResponse_Internal
                );
    }

    function shrinkEditableArea_Internal() {
        _dynamicEditor = _dynamicEditor.replace("81", "71")
    }

    function adjustNavigationButtonsAndTitleBar_Internal() {
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

    function manageStartStopPageScrollingDown_Internal() {
        var blogPage = $("html, body");

        $("body").click(function(e) {
            if(_pageIsBeingScrolled)  {

                if(_pageIsPaused) {
                    setPageIsPaused_Internal(false);

                    var event = new MouseEvent('click', {
                                                            'view': window,
                                                            'bubbles': true,
                                                            'cancelable': true
                                                        });

                    setTimeout(function() {
                        document.getElementsByTagName('body')[0].dispatchEvent(event);
                    }, 1000);
                }

                blogPage.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
                    blogPage.stop();
                });

                blogPage.animate({ scrollBottom: $(this).position().top  }, 'slow', function(){
                    blogPage.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
                });

                // mark that we paused scrolling the page
                setPageIsPaused_Internal(true);

                return false;
            }
        });

        $("body").dblclick(function(e) {
            if(_pageIsBeingScrolled)  {
            
                $(blogPage).animate({ scrollTop: $(this).height() }, _pageSpeedDefaultValue * 1000);

                blogPage.animate({ scrollBottom: $(this).position().top  }, 'slow', function(){
                    blogPage.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
                });

                return false;
            }
        });        
    }

    function setPageIsBeingScrolled_Internal(pageIsBeingScrolled) {
        _pageIsBeingScrolled = pageIsBeingScrolled;
    }

    function setPageIsPaused_Internal(pageIsPaused) {
        _pageIsPaused = pageIsPaused;
    }

    function getPageSpeedDefaultValue_Internal() {
        return _pageSpeedDefaultValue;
    }

    function setPageSpeedDefaultValue_Internal(pageSpeedDefaultValue) {
        _pageSpeedDefaultValue = pageSpeedDefaultValue;
    }
    
    // main private function # 1 
    function initializeBlogFunctionality_Internal(
                                                 useBackwardCompatibility,
                                                 abstractionOfData,
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
        _useBackwardCompatibility = useBackwardCompatibility;
        _abstractionOfData = abstractionOfData;
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

        // load blog content depending on wheter use backward compatibility (v18) or current version (v19)
        if(_useBackwardCompatibility === true) {
            jsUtilities.fillChildContainersUnderGivenParentContainer(
                                                                        _abstractionOfData,
                                                                        _parentContainerCssClass,
                                                                        _dataDivContainerCssClassName, _dataDivLineDefinitionContainerCssClassName, _errorDivContainerCssClassName,
                                                                        isFirstLineHoldingTitle, isLastLineHoldingCreationDate,
                                                                        _dataDivContainerTitleCssClassName, _dataDivContainerCreationDateCssClassName
                                                                      );
        }
        else {
            jsUtilities.fillChildContainersUnderGivenParentContainer_2(
                                                                        _abstractionOfData,
                                                                        _parentContainerCssClass,
                                                                        _dataDivContainerCssClassName, _dataDivLineDefinitionContainerCssClassName, _errorDivContainerCssClassName,
                                                                        isFirstLineHoldingTitle, isLastLineHoldingCreationDate,
                                                                        _dataDivContainerTitleCssClassName, _dataDivContainerCreationDateCssClassName
                                                                      );
        }
    }

    // main private function # 2 
    function runContentEditor_Internal(editorContainerUniqueID) {
        _editorContainerUniqueIdInternal = editorContainerUniqueID; // set popup editor name
        setupDynamicEditor_Internal();

        if(activeBrowser.browserUtility.ie || activeBrowser.browserUtility.firefox || activeBrowser.browserUtility.safari) {
            shrinkEditableArea_Internal();
        }

        adjustNavigationButtonsAndTitleBar_Internal();

        addTemporaryContainerToServeContentEdition_Internal();
        $(_editorContainerUniqueIdInternal).load(_systemFileStorageFilePath, null);
        $(_editorContainerUniqueIdInternal).dialog(_editorSettings);        
    }



    /* Public API */

    self.initializeBlogFunctionality = function(
                                             useBackwardCompatibility,
                                             abstractionOfData,
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
        initializeBlogFunctionality_Internal(
                                             useBackwardCompatibility,
                                             abstractionOfData,
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
        return runContentEditor_Internal(editorContainerUniqueID);
    }

    self.manageStartStopPageScrollingDown = function() {
        return manageStartStopPageScrollingDown_Internal();
    }

    self.setPageIsBeingScrolled = function(pageIsBeingScrolled) {
        return setPageIsBeingScrolled_Internal(pageIsBeingScrolled);
    }

    self.setPageIsPaused = function(pageIsPaused) {
        return setPageIsPaused_Internal(pageIsPaused);
    }

    self.getPageSpeedDefaultValue = function() {
        return getPageSpeedDefaultValue_Internal();
    }

    self.setPageSpeedDefaultValue = function(pageSpeedDefaultValue) {
        return setPageSpeedDefaultValue_Internal(pageSpeedDefaultValue);
    }

    /* ~ Public API */



    /* Expose module API to the outside world */
    window.blogUtilities = window.blogUtilities || self;
 }
)(window)

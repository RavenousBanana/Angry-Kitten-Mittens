// ==UserScript==
// @name           Neverwinter Gateway Professions Bot v2
// @description    Automatically selects profession tasks for empty slots.
// @namespace      http://userscripts.org/scripts/show/171738
// @include        https://gateway.playneverwinter.com
// @include        https://gateway.playneverwinter.com/*
// @include        https://gatewaysitedown.playneverwinter.com
// @include        https://gatewaysitedown.playneverwinter.com/* 
// @include        http://gateway.playneverwinter.com
// @include        http://gateway.playneverwinter.com/*
// @include        http://gatewaysitedown.playneverwinter.com
// @include        http://gatewaysitedown.playneverwinter.com/* 
// @originalAuthor Mustex
// @modifiedBy     Bunta, RavenousBanana
// @version        2.0.0
// @license        http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==

/* RELEASE NOTES
1.0.0.3
    - Fix some gem trading tasks not being filtered correctly
    - Add check for gateway disconnected
1.0.0.2
    - Fix leadership tasks not creating assets correctly
    - Add option to save task lists per character (experimental)
1.0.0.1
    - Rewrite script using client.dataModel methods to massively improve reliability and performance (thanks Msc)
    - AD refining will now only attempt to refine if you are able to collect diamonds
    - Change task lists to use exact task names so no ambiguity exists (no longer requires excluderare option)
    - Asset resources are now trained as needed (only for required slots)
0.3.0.5
    - Fix resources not buying correctly in all cases
    - Fix pause button state saving correctly in firefox
0.3.0.4
    - Add page timeout reloading functions outside of main function (thanks Kreese and Frabtik)
    - Add check to ensure tasks are being started for the correct character
    - Alter next run resolve function to use delay parameter to allow for unique delay timers to be used in certain cases
0.3.0.3
    - Fix ingredient task selection to correctly iterate through all ingredient tasks
    - Alter character selection to pick only exact character name matches
    - Update leadership tasks
0.3.0.2
    - Exclude alchemy from rare task exclusions due to Aqua Regia (thanks Eversor)
    - Reduce GM_setValue calls to avoid tampermonkey failing to save settings (thanks miah)
0.3.0.1
    - Altered mutichar selector to be faster (thanks miah)
    - Updated rare tasks selector (thanks Traktor)
    - Add option to refine AD during character switching (thanks Eversor)
    - Added some level 20 gather tasks
    - Increased supply buying to 100 units
0.3.0.0
    - Added Multi-Character support
    - Added function to clear all saved settings for script
    - Remove disable sound functionality (now configurable in gateway)
0.2.0.1.8
    - Added pause button to allow easy on/off switching
0.2.0.1.7
    - Added option to enable/disable filling optional asset slots
    - Added batch potions tasks to be skipped in ingredient selection
    - Added timer to reload page if stuck loading for too long
    - Added option to disable page sounds
    - Updated license to by-nc-sa
0.2.0.1.6
    - Add configurable option for excluding rare tasks
0.2.0.1.5
    - Add ability to specify specific level for tasks and configure same named artificing resource tasks to request correct level of task
    - Remove purchase notification that never times out
0.2.0.1.4
    - Added functionality to purchase required resources from gateway shop
0.2.0.1.3
    - Add Artificing and Weaponsmithing to Robot
      (Artificing will not work properly yet as all three tiers of gather and craft tasks have the same task name) 
0.2.0.1.2
    - Update reload process
    - Fix optional asset selector with gateway update
0.2.0.1.1
    - Simplify asset selection after they fixed bug in previous gateway update
    - Update level 20 leadership tasks
    - Update with changes in Mustex's script (version 15)
        * Added a secondary timer that will reload the gateway every few hours. This should help with disconnects from the server
        * Implemented tooltips for settings panel
0.1.9.1.15
    - Repeat task reordering for +2 armor
0.1.9.1.14
    - Fix selection of assets after gateway update
    - Skip intensive gather tasks added after gateway update
0.1.9.1.13
    - Change ordering of tasks and ingredient checks
      The purpose of this is to allow crafting of +4 armors if you have +2 ingredients in your inv but to not create them if you don't.
      Creating the ingredients for them is less efficient than crafting ingredients for pants but is more efficient if you already have the ingredients from earlier tasks.
0.1.9.1.12
    - Optimise crafting tasks for highest exp/min gains due to ingredient requirements
0.1.9.1.11
    - Add extra craft tasks for when residuum runs out
0.1.9.1.10
    - Only allow rare tasks to be selected for Leadership
      This avoids craft loops where higher quality rare crafts require ingredients with the same name
0.1.9.1.9
    - Alter craft tasks to favour armor to optimise inventory space
0.1.9.1.8
    - Fix script restart bug when no tasks found
0.1.9.1.7
    - Update search string for Potions (After the task names for elxiirs have been changed)
    - Remove logon error skips to avoid logons sometimes failing on first load (ensure logon details are correct!)
0.1.9.1.6
    - Update tasks for all professions
    - Update ingredient search lists for all professions
0.1.9.1.5
    - Fix regular expression used in potion ingredient search
0.1.9.1.4
    - Alter default timeouts (makes script a lot more stable and less prone to errors)
    - Remove unused variable
    - Add extra logging for task ingredient searches
0.1.9.1.3
    - Fix bug with required resource checks getting stuck on non craftable resources
0.1.9.1.2
    - Added method to check for required task ingredients and choose tasks to create them
      Method is currently hard coded to specify certain search strings for ingredient types
      Currently working for all Alchemy tasks
      There is a current problem that if you have the required potion ingredient but it is in your belt slots
      the task is uncraftable but the ingredients show as available and it will not craft a new one
0.1.9.1
    - Update with changes in Mustex's script (version 12)
        * Added tasks for Platesmithing, Leatherworking, Tailoring
        * Added detection for the gateway being down
0.1.8.3.8
    - Update asset selection to avoid using coloured assets in junk slots for leadership
0.1.8.3.7
    - Update leadership tasks table due to task reward/duration alterations
0.1.8.3.6
    - Add option to enable/disable automation process
    - Update alchemy tasks some more
0.1.8.3.5
    - Add ability to select from multiple tasks with same name (eg Alchemical Research)
    - Add craft options for alchemy potions (need to be manually switched since they use the same ingredients)
0.1.8.3.4
    - Add alchemy tasks up to level 20
0.1.8.3.3
    - Change task slot selection to be user configurable options in settings window
    - Add level 1 alchemical research
0.1.8.3.2
    - Added ability to specify how many tasks of each profession to train multiple professions at once
    - Updated mailsmithing level 0 tasks
0.1.8.3.1
    - Changed asset selection to only update Junk assets
    - Leadership asset selection for bronze tier picks lowest asset first
    - Modified Leadership tasks
0.1.8.3
    - Tweaked Leadership tasks grid
    - Added task grid for Alchemy (Partial) 
0.1.8.2
    - onsave handlers for settings are now called before the settings values are saved
    - Added onsave handler for console to enable/disable using the window console
0.1.8.1
    - Added checking for errors (using the window title) and will navigate back to the main login page if autologin is enabled
0.1.8
    - Added popup for altering settings
    - Settings are saved to script cache
    - Added mailsmithing tasks to task grid
0.1.7
    - Added lower level leadership tasks to grid
    - Added hiring tasks to leadership task
    - Uses saved values to determine which profession type to level (Defaults to Leadership, currently no way to change it)

0.1.5
    - Is now able to recover from missing assets
    - Uses a configurable grid to determine what the next task is to complete

0.1.0
    - Is now able to select some hard coded leadership tasks
    - Can now collect from any completed slot
    
1.0.0.4
    - Added Jewelcrafting tasks (however it is not optimised for lower tiers generating better experience, also not added rare tasks)

1.0.0.5
    - Modified the Jewelcrafting task list to stop spamming inventory and put in a fix to continue if the characters inventory is full rather than looping on that character.

1.0.0.6
    - Added Simril Lightcrafting (A.K.A. WinterEvent)

1.0.0.7
    - Updated the leatherworking profession to only create profession materials, it should no longer require any other bag space.

1.0.0.8
    - Jewelcrafting will no longer prioritize creating workers over refining/gathering tasks.

1.0.0.9
    - Updated mailsmithing to no longer use any bag space.
1.1.0
    - Added Black Ice Shaping.
1.1.1
    - Added a user defined character switch delay.
1.1.2
    - Added tasks up to rank 25 for leadership.
1.1.3
    - Added Jewelcrafting up to rank 25.
2.0.0
    - Switched to list free version.
*/
var version = '2.0.0';

console.log("Neverwinter Gateway Bot v", version+" running");

// Make sure it's running on the main page, no frames
if (window.self !== window.top) {
    throw "";
}

// Set global console variables
var fouxConsole = {log:function(){},info:function(){},error:function(){},warn:function(){}};
var console = unsafeWindow.console || fouxConsole;

// Page Reloading function
// Every second the page is idle or loading is tracked
var loading_reset = false; // Enables a periodic reload if this is toggled on by the Auto Reload check box on the settings panel
var s_paused = false;      // extend the paused setting to the Page Reloading function

(function() {
    var $                  = unsafeWindow.$;
    var state_loading      = 0;   // If "Page Loading" takes longer than 30 seconds, reload page (maybe a javascript error)
    var state_loading_time = 30;  // default of 30 seconds

    var state_idle         = 0;   // If the page is idle for longer than 60 seconds, reload page (maybe a javascript error)
    var state_idle_time    = 120; // default of 120 seconds
    var reload_hours       = [2, 5, 8, 11, 14, 17, 20, 23]; // logout and reload every three hours - 2:29 - 5:29 - 8:29 - 11:29 - 14:29 - 17:29 - 20:29 - 23:29
    var last_location      = "";  // variable to track reference to page URL
    var reload_timer       = setInterval(function() {
        if (!s_paused) {
            if (loading_reset) {
                var loading_date       = new Date();
                var loading_sec        = Number(loading_date.getSeconds());
                var loading_min        = Number(loading_date.getMinutes());
                var loading_hour       = Number(loading_date.getHours());
                if (reload_hours.indexOf(loading_hour) >= 0 && loading_min == 29 && loading_sec < 2) {
                    console.log("Auto Reload");
                    unsafeWindow.location.href = "http://gateway.playneverwinter.com";
                    return;
                }
            }
            
            // check for errors
            if ($("title").text().match(/Error/) || $("div.modal-content h3").text().match(/Disconnected/)) {
                console.log("Error detected - relogging");
                unsafeWindow.location.href = "http://gateway.playneverwinter.com";
                return;
            }

            if ($("div.loading-image:visible").length) {
                last_location = location.href;
                state_idle = 0;
                if (state_loading >= state_loading_time) {
                    console.log("Page Loading too long");
                    state_loading = 0;
                    location.reload();
                }
                else {
                    state_loading++;
                    console.log("Page Loading ...", state_loading+"s");
                }
            }
            // TODO: Add check for Gateway disconnected
            //<div class="modal-content" id="modal_content"><h3>Disconnected from Gateway</h3><p>You have been disconnected.</p><button type="button" class="modal-button" onclick="window.location.reload(true);">Close</button>
            

            /* Can't use idle check with dataModel methods
            else if (location.href == last_location) {
                state_loading = 0;
                if (state_idle >= state_idle_time) {
                    console.log("Page Idle too long");
                    state_idle = 0;
                    unsafeWindow.location.href = "http://gateway.playneverwinter.com";
                }
                else {
                    state_idle++;
                    // comment out to avoid console spam
                    console.log("Page Idle ...", state_idle+"s");
                }
            }
            */
            else {
                last_location = location.href;
                state_loading = 0;
                state_idle = 0;
            }
        }
    }, 1000);
})();

(function() {

    /**
     * Add a string of CSS to the main page
     *
     * @param {String} cssString The CSS to add to the main page
     */
    function AddCss(cssString) {
        var head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        var newCss = document.createElement('style');
        newCss.type = "text/css";
        newCss.innerHTML = cssString;
        head.appendChild(newCss);
    }
    function countLeadingSpaces(str) {
        return str.match(/^(\s*)/)[1].length;
    }

    var image_pause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAY" +
        "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" +
        "BNp57TyT3+MAAAAASUVORK5CYII=";
    var image_play = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYA" +
        "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";
    var image_prefs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
        "AMAAAAoLQ9TAAAAllBMVEUAGQASEhIfHx8fJy8pKSk2NjZBQUFJR0ZQUE9RUVFSUlJNX3No" +
        "aGhsaWdramlycG1meY98fHx+fn5wgpV0iqKKh4R4jaR9jJx8kad9kad/mbONmaWEnrmEnrq" +
        "koZy3t7fIx8bKyMHT0c3S0dDU09DV1NPP1t3W1dXY2Njb2tfe29bf3tzj4uHr6+js6+r39/" +
        "f5+PgAAABrL3yvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTA" +
        "QCanBgAAAAHdElNRQfWBRoFKh31UQ8DAAAAgUlEQVQY022OxxLCMAwFRSc4BEIPJZQQ08v+" +
        "/8+RsTExDDpIe3ijfSJ/hx9g62Dt4GaAI+8YT0t27+BxxvvE/no5pYT10lGFrE34Ja40W3g" +
        "1oMGmW7YZ6hnCYexKTPVkXivuvWe1Cz1aKqPNI3N0slI2TNYZiARJX30qERc7wBPKC4WRDz" +
        "WdWHfmAAAAAElFTkSuQmCC";
    var image_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
        "AQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfW" +
        "BRkTNhxuPxLkAAAAHXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBUaGUgR0lNUO9kJW4AAAE" +
        "KSURBVCjPhdGxSgNBFAXQMzpgYWwsLEQUDBJBQgqFIChZEPR7/DA/QCGQTgQtJE1ENoWohY" +
        "UgbGKQyFjErNv52nObe19wqGWg7z0l5YVgVdOu+wUt507tqIVQ4Zodp861ooELe15M5KFI6" +
        "Zfr9u25MIj6Jl4cmSIPBWrq2o5cufO4aOJDYSozNTa2pK4t03PtwUdMKRRykAmW0dTRcyNX" +
        "pBQpI8GJDTR050zkNzK0bMMZLvUNZ8yCfy6Wvbc1NVyi4dloXjqWvds6uvp41pFmpVOKJWd" +
        "6bgwxkmTMIotWKpwrfBkZl7uMonUHf5wSlV2+fUZrjnXdzrmyy7djD8GWTW9e51z557o1Tz" +
        "85FH/WkOkaHQAAAABJRU5ErkJggg==";


    // Setup global closure variables
    var $ = unsafeWindow.jQuery;
    var timerHandle = 0;
    var dfdNextRun = $.Deferred();
    var charcurrent = 0; // current character counter
    var settingwipe = false; // Use to wipe stored settings
    var delay = {
        SHORT   : 1000,
        MEDIUM  : 5000,
        LONG    : 30000,
        MINS    : 300000,
        DEFAULT : 10000, // default delay
        TIMEOUT : 60000, // delay for cycle processing timeout
    };

    // Delete all saved settings
    if (settingwipe) {
        var keys = GM_listValues();
        for (var i = 0; i < keys.length; i++) {
            GM_deleteValue(keys[i]);
        }
    }
    
    // Load Settings
    var settingnames = [
        {name: 'paused',        title: 'Pause Script',                   def: false,   type: 'checkbox', tooltip: 'Disable All Automation'},
        {name: 'debug',         title: 'Enable Debug',                   def: false,   type: 'checkbox', tooltip: 'Enable all debug output to console', onsave: function(newValue) { console = newValue ? unsafeWindow.console || fouxConsole:fouxConsole; }},
        {name: 'optionals',     title: 'Fill Optional Assets',           def: true,    type: 'checkbox', tooltip: 'Enable to include selecting the optional assets of tasks'},
        {name: 'trainassets',   title: 'Train Assets',                   def: true,    type: 'checkbox', tooltip: 'Enable training/upgrading of asset worker resources'},
        {name: 'refinead',      title: 'Refine AD',                      def: true,    type: 'checkbox', tooltip: 'Enable refining of AD on character switch'},
        {name: 'autoreload',    title: 'Auto Reload',                    def: false,   type: 'checkbox', tooltip: 'Enabling this will reload the gateway periodically. (Ensure Auto Login is enabled)'},
        {name: 'no_bag_space',  title: 'Use No Bag Space',               def: false,   type: 'checkbox', tooltip: 'Enabling this will prevent tasks that consume bag space from being run (Alchemy excluded)'},
        {name: 'delay',         title: 'Character switch delay (ms)',    def: '10000', type: 'text',     tooltip:  'This is the amount of time between character switches.'},
        {name: 'autologin',     title: 'Attempt to login automatically', def: false,   type: 'checkbox', tooltip: 'Automatically attempt to login to the neverwinter gateway site'},
        {name: 'nw_username',   title: '  Neverwinter Username',         def: '',      type: 'text',     tooltip: ''},
        {name: 'nw_password',   title: '  Neverwinter Password',         def: '',      type: 'password', tooltip: ''},
        {name: 'charcount',     title: '  Number of Characters',         def: '0',     type: 'text',     tooltip: 'Enter number of characters to use (reload page to update settings form)'},
    ];

    var professions = [
        { name: "Leadership",          displayName: "Leadership"     },
        { name: "Armorsmithing_Med",   displayName: "Mailsmithing"   },
        { name: "Armorsmithing_Heavy", displayName: "Platesmithing"  },
        { name: "Leatherworking",      displayName: "Leatherworking" },
        { name: "Tailoring",           displayName: "Tailoring"      },
        { name: "Artificing",          displayName: "Artificing"     },
        { name: "Weaponsmithing",      displayName: "Weaponsmithing" },
        { name: "Alchemy",             displayName: "Alchemy"        },
        { name: "Jewelcrafting",       displayName: "Jewelcrafting"  },
    ];
    
    // Load local settings cache (unsecured)
    var settings = {};
    for (var j = 0; j < settingnames.length; j++) {
        var settingname = settingnames[j];
        if (settingname.type === 'label') {
            continue;
        } 
        settings[settingname.name] = GM_getValue(settingname.name, settingname.def);
        if (typeof(settingname.onsave) === "function") {
            //console.log("Calling 'onsave' for", settingname.name);
            settingname.onsave(settings[settingname.name], settings[settingname.name]);
        }
    }
    
    if (settings.charcount<1) { settings.charcount = 1; }
    if (settings.charcount>99) { settings.charcount = 99; }

    // Create settings.
    var charSettings = [];
    for (var k = 0; k < settings.charcount; k++) {
        charSettings.push({name: 'nw_charname'+k, title: 'Character', def: 'Character '+(k+1), type:'text', tooltip:'Characters Name'});
        for (var l = 0; l < professions.length; l++) {
            var profession = professions[l];
            charSettings.push({ name: profession.name+k,          title: profession.displayName, def: '0',   type: 'text',     tooltip: 'Number of slots to assign to '+profession.displayName });
            charSettings.push({ name: profession.name+k+"RP",     title: "RP",                   def: false, type: 'checkbox', tooltip: 'Prioritize RP' });
            charSettings.push({ name: profession.name+k+"XP",     title: "XP",                   def: false, type: 'checkbox', tooltip: 'Prioritize XP' });
            charSettings.push({ name: profession.name+k+"Copper", title: "Copper",               def: false, type: 'checkbox', tooltip: 'Prioritize Copper' });
        }
    }
    
    // Load settings.
    for (var m = 0; m < charSettings.length; m++) {
        var currentCharSettings = charSettings[m];
        settings[currentCharSettings.name] = GM_getValue(currentCharSettings.name, currentCharSettings.def);
    }
    
    // Page Settings
    var PAGES = Object.freeze({
        LOGIN : { name: "Login", path: "div#login"},
        GUARD : { name: "Account Guard", path: "div#page-accountguard"},
    });
    
    delay.CHAR = parseInt(settings.delay);

    /**
     * Uses the page settings to determine which page is currently displayed
     */
    function GetCurrentPage() {
        for (var page in PAGES) {
            if ($(PAGES[page].path).filter(":visible").length) {
                return PAGES[page];
            }
        }
    }
    
    /**
     * Logs in to gateway
     * No client.dataModel exists at this stage
     */
    function page_LOGIN() {
        //if (!$("form > p.error:visible").length && settings.autologin) {
            // No previous log in error - attempt to log in
            //console.log("Setting username");
            $("input#user").val(settings.nw_username);
            //console.log("Setting password");
            $("input#pass").val(settings.nw_password);
            //console.log("Clicking Login Button");
            $("div#login > input").click();
        //}
        dfdNextRun.resolve(delay.LONG);
    }
    
    /**
     * Action to perform on account guard page
     */
    function page_GUARD() {
        // Do nothing on the guard screen
        dfdNextRun.resolve(delay.LONG);
    }

    /**
     * Collects rewards for tasks or starts new tasks
     * Function is called once per new task and returns true if an action is created
     * If no action is started function returns false to switch characters
     */
    function processCharacter() {

        // Switch to professions page to show task progression
        unsafeWindow.location.hash="#char("+encodeURI(unsafeWindow.client.getCurrentCharAtName())+")/professions";
        
        // Collect rewards for completed tasks and restart
        if (unsafeWindow.client.dataModel.model.ent.main.itemassignments.complete) {
            return collectRewards();
        }
        
        // Check for available slots and start new task
        if (unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function(entry) { return (!entry.islockedslot && !entry.uassignmentid); }).length) {

            // Go through the professions to assign tasks until specified slots filled
            for (var i = 0; i < professions.length; i++) {
                var profession = professions[i];

                // Filter the current tasks by profession
                var currentTasks = unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function(task) { return task.category === profession.Name; });

                // Check if we have filled our quota for the profession
                if (currentTasks.length < settings[profession.name]) {

                    unsafeWindow.client.professionFetchTaskList('craft_'+profession.name);
                    unsafeWindow.client.dataModel.fetchVendor('Nw_Gateway_Professions_Merchant');
                    window.setTimeout(function() {
                        var taskList = createTaskList(profession.name);
                        if (taskList !== null) {
                            console.log("Task list generated:", taskList);
                            createNextTask(taskList, 0);
                        } else {
                            console.log("Failed to generate task list.");
                            dfdNextRun.resolve(delay.SHORT);
                        }
                        return true;
                    }, delay.SHORT);
                    return true;
                }
            }
            console.log("All task counts assigned");
        }
        else {
            //console.log("No available task slots");
        }
        
        // TODO: Add code to get next task finish time
        return false;
    }

    function collectRewards() {
        unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.forEach(function(entry) {
            if (entry.hascompletedetails) {
                unsafeWindow.client.professionTaskCollectRewards(entry.uassignmentid);
            }
        });
        dfdNextRun.resolve();
        return unsafeWindow.client.dataModel.model.ent.main.itemassignments.complete;
    }

    function createTaskList(professionName) {
        if (!unsafeWindow.client.dataModel.model.craftinglist || unsafeWindow.client.dataModel.model.craftinglist === null || !unsafeWindow.client.dataModel.model.craftinglist['craft_'+professionName] ||
            unsafeWindow.client.dataModel.model.craftinglist['craft_'+professionName] === null) {
            console.log("Tasks are not yet loaded for", professionName);
            //window.setTimeout(function() { return createTaskList(professionName); }, delay.SHORT);
            return null;
        } else {
            if (!unsafeWindow.client.dataModel.model.vendor || unsafeWindow.client.dataModel.model.vendor === null || !unsafeWindow.client.dataModel.model.vendor.items || unsafeWindow.client.dataModel.model.vendor.items === null) {
                console.log("The vendor has not loaded yet");
                //window.setTimeout(function() { return createTaskList(professionName); }, delay.SHORT);
                return null;
            } else {
                var profession = unsafeWindow.client.dataModel.model.craftinglist['craft_'+professionName];
                console.log("Creating task list for", professionName);
                var sorts = [sortByProfessionXP];
                console.log("Prioritizing Profession XP");
                var prioritySettings = charSettings.filter(function(setting) { return setting.name === professionName+charcurrent+'RP' || setting.name === professionName+charcurrent+'XP' || setting.name === professionName+charcurrent+'Copper'; });
                for (var i = 0; i < prioritySettings.length; i++) {
                    var setting = prioritySettings[i];
                    if (setting.name === professionName+charcurrent+'Copper' && settings[setting.name] === true) {
                        sorts.push(sortByCopper);
                        console.log("Prioritizing Copper");
                        break;
                    }
                }
                for (var j = 0; j < prioritySettings.length; j++) {
                    var setting2 = prioritySettings[j];
                    if (setting2.name === professionName+charcurrent+'XP' && settings[setting2.name] === true) {
                        sorts.push(sortByXP);
                        console.log("Prioritizing XP");
                        break;
                    }
                }
                for (var k = 0; k < prioritySettings.length; k++) {
                    var setting3 = prioritySettings[k];
                    if (setting3.name === professionName+charcurrent+'RP' && settings[setting3.name] === true) {
                        sorts.push(sortByRP);
                        console.log("Prioritizing RP");
                        break;
                    }
                }
                var tasks = createSortedEntryList(profession.entries.filter(filterTasksByLevel), sorts, professionName);
                tasks.craftName = professionName;
                //console.log("createTaskList returning", tasks);
                return tasks;
            }
        }
    }

    function sortByProfessionXP(a, b) {
        return sort(a, b, filterByProfessionXP);
    }

    function sortByXP(a, b) {
        return sort(a, b, filterByXP);
    }

    function sortByCopper(a, b) {
        return sort(a, b, filterByCopper);
    }

    function sortByRP(a, b) {
        return sort(a, b, filterByRP);
    }

    function filterTasksByLevel(task) {
        return !task.failslevelrequirements;
    }

    function sort(taskA, taskB, filter) {
        //console.log("DEBUG:", taskA.def.name, taskB.def.name);
        if (/Alchemy_Tier\d+_Experiment_Rank\d+/.exec(taskA.def.name) !== null) {
            return -1;
        }
        if (/Alchemy_Tier\d+_Experiment_Rank\d+/.exec(taskA.def.name) !== null) {
            return 1;
        }
        if (/Alchemy_Tier\d+_Experimentation_Rank\d+/.exec(taskA.def.name) !== null) {
            //console.log("taskA is experimentation, prioritizing");
            return -1;
        }
        if (/Alchemy_Tier\d+_Experimentation_Rank\d+/.exec(taskB.def.name) !== null) {
            //console.log("taskB is experimentation, prioritizing");
            return 1;
        }
        var taskARewards = getRewards(taskA).filter(filter);
        var taskARewardTotal = 0;
        for (var i = 0; i < taskARewards.length; i++) {
            taskARewardTotal += taskARewards[i].count;
        }
        var taskBRewards = getRewards(taskB).filter(filter);
        var taskBRewardTotal = 0;
        for (var j = 0; j < taskBRewards.length; j++) {
            taskBRewardTotal += taskBRewards[j].count;
        }
        return taskBRewardTotal/calculateDuration(taskB) - taskARewardTotal/calculateDuration(taskA);
    }

    function getRewards(task) {
        var rewards = task.rewards;
        for (var i = 0; i < task.children.length; i++){
            var child = task.children[i];
            rewards = rewards.concat(getRewards(child));
        }
        return rewards;
    }

    function calculateDuration(task) {
        var duration = task.def.duration;
        for (var i = 0; i < task.children.length; i++) {
            var child = task.children[i];
            duration += calculateDuration(child);
        }
        return duration;
    }

    function filterByProfessionXP(reward) {
        return /@ItemDef\[Xp_Crafting_\w+\]/.exec(reward.hdef) !== null;
    }

    function filterByXP(reward) {
        return reward.hdef == "@ItemDef[XP]";
    }

    function filterByCopper(reward) {
         return reward.hdef == "@ItemDef[Resources]";
    }

    function filterByRP(reward) {
        return /@ItemDef\[\w+_Rp\]/.exec(reward.hdef) !== null;
    }

    function createSortedEntryList(tasks, sortByFuncs, professionName) {
        var sortedTasks = [];
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];

            if (findChildren(task, tasks)) {

                // Check if the character has enough bag space to complete the task.
                var requiredBagSpace = getRequiredBagSpace(task);
                if (professionName !== "Alchemy" && (settings.no_bag_space && requiredBagSpace > 0)) {
                    console.log("Cannot perform", task.def.displayname, "as the 'No Bag Space' option is checked (profession:"+professionName+")");
                    continue;
                }
                console.log(getBagSpace()+" inventory slot/s available. "+requiredBagSpace+" inventory slots required for "+task.def.name);
                if (getBagSpace() < requiredBagSpace) {
                    console.log("Cannot perform", task.def.displayname, "due to insufficient bag space");
                    continue;
                }

                // Check if the character has enough Copper to complete the task.
                if (!sufficientCopper(task)) {
                    console.log("Cannot perform", task.def.displayname, "as there is insufficient Copper");
                    continue;
                } else {
                    //console.log("Sufficient Copper available for", task.def.displayname);
                }

                // Check if the task requires Astral Diamonds.
                if (requiresAD(task)) {
                    console.log("Cannot perform", task.def.displayname, "as it requires AD");
                    continue;
                } else {
                    //console.log(task.def.displayname, "does not require AD");
                }
                sortedTasks.push(task);
            }
        }
        for (var j = 0; j < sortByFuncs.length; j++) {
            sortedTasks.sort(sortByFuncs[j]);
        }
        console.log("DEBUG:", sortedTasks.map(function(task) { return task.def.displayname; }).join(", "));
        return sortedTasks;
    }

    function getRequiredBagSpace(task) {
        var requiredBagSpace = 0;
        for (var key in task.rewards) {
            if (requiresBagSpace(task.rewards[key])) { // Ignoring items stacking for now as I cannot tell what will and won't stack
                requiredBagSpace += 1;
            }
        }
        task.children.forEach(function(child) { requiredBagSpace += getRequiredBagSpace(child); } );
        //console.log(task.def.name, "requires at most", requiredBagSpace, "inventory slots");
        return requiredBagSpace;
    }

    function requiresBagSpace(reward) {
        //console.log("DEBUG:", reward, reward.hdef, !~reward.hdef.indexOf('Crafting'));
        if (reward.hdef) {
            return !~reward.hdef.indexOf('Crafting');
        } else if(reward.hitem) {
            return !~reward.hitem.indexOf('Crafting');
        }
        return true;
    }

    function getBagSpace() {
        var emptySlots = 0;
        unsafeWindow.client.dataModel.model.ent.main.inventory.playerbags.forEach(function(playerbag) {
            emptySlots += playerbag.slots.filter(function(slot) { return slot === null; }).length;
        });
        return emptySlots - getPendingBagSpace();
    }

    function getPendingBagSpace() {
        var pendingSlots = 0;
        unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.forEach(function(assignment) {
            if (assignment.category === "None") {
                return;
            }
            console.log(assignment.hdef);
            var match = /@ItemAssignmentDef\[(\w+)\]/.exec(assignment.hdef);
            if (match === null || match.length < 2) {
                console.log("ERROR: Cannot find bag space requirement for "+assignment.displayname+" (match: "+match+"); preventing inventory slot usage until the issue is resolved");
                pendingSlots += 999; // This will stop any bag space being used until we can resolve the issue.
                return;
            }
            var hdef = match[1];
            var task = findTask(assignment.category, hdef);
            if (task === null) {
                console.log("ERROR: Cannot find bag space requirement for "+assignment.displayname+" (task: "+task+"); preventing inventory slot usage until the issue is resolved");
                pendingSlots += 999; // This will stop any bag space being used until we can resolve the issue.
                return;
            }
            console.log(task);
            task.rewards.forEach(function(reward) {
                if (requiresBagSpace(reward)) {
                    pendingSlots++;
                }
            } );
        } );
        return pendingSlots;
    }

    function findTask(category, hdef) {
        var profession = unsafeWindow.client.dataModel.model.craftinglist["craft_"+category];
        if (typeof profession === "undefined") {
            console.log("ERROR: "+category+" not found in crafting list; failed to find task ("+hdef+")");
            return null;
        }
        var task = profession.entries.filter(function(entry) {
            return typeof entry.def !== "undefined" && entry.def !== null && entry.def.name === hdef;
        } )[0];
        return typeof task !== "undefined" ? task : null;
    }

    function sufficientCopper(task) {
        return getAvailableCopper() >= getCopperCost(task, "@ItemDef[Resources]");
    }

    function getAvailableCopper() {
        return unsafeWindow.client.dataModel.model.vendor.items[0].costinfo[0].availablecount;
    }

    function getCopperCost(task) {
        var copperCost = 0;
        for (var i = 0; i < task.children.length; i++) {
            var child = task.children[i];
            copperCost += getCopperCost(child);
        }
        if (task.copperCost) {
            copperCost += task.copperCost;
        }
        //console.log(task.def.displayname, "has a total copper cost of", copperCost);
        return copperCost;
    }

    function requiresAD(task) {
        return getCost(task, "@ItemDef[Astral_Diamonds]") > 0;
    }

    function getCost(task, hdef) {
        var cost = 0;
        var consumables = getConsumables(task).filter(function(consumable){ return consumable.hdef === hdef && consumable.required > 0; });
        for (var i = 0; i < consumables.length; i++){
            var consumable = consumables[i];
            cost += consumable.required;
        }
        return cost;
    }

    function getConsumables(task) {
        var consumables = task.consumables;
        for (var i = 0; i < task.children.length; i++){
            var child = task.children[i];
            consumables = consumables.concat(getConsumables(child));
        }
        return consumables;
    }

    function findChildren(currentTask, tasks) {
        //console.log("Attempting to build task tree for", currentTask.def.displayname);
        currentTask.children = [];
        currentTask.copperCost = 0;
        var consumables = currentTask.consumables.filter(function(consumable) { return consumable.required && !consumable.fillsrequirements; });
        for (var i = 0; i < consumables.length; i++) {
            var consumable = consumables[i];
            //console.log(currentTask.def.displayname, "requires", consumable.hdef);
            if (!canBuy(consumable)) {
                var reducedTasks = removeCurrentTask(currentTask, tasks);
                var reqTask = findTaskForConsumable(consumable, reducedTasks);
                if (reqTask && findChildren(reqTask, reducedTasks)) {
                    //console.log(reqTask.def.displayname, "will supply", consumable.hdef, "for", currentTask.def.displayname);
                    currentTask.children.push(reqTask);
                } else {
                    console.log(consumable.hdef + " cannot be acquired"+ ", " + currentTask.def.displayname + " cannot be completed");
                    return false;
                }
            } else {
                currentTask.copperCost += getCopperCostinfo(consumable).count * consumable.required;
                //console.log(consumable.hdef, "can be acquired from the vendor for", currentTask.copperCost, "copper");
            }
        }
        var assets = currentTask.required.filter(function(asset){ return !asset.fillsrequirements; });
        for (var j = 0; j < assets.length; j++) {
            var asset = assets[j];
            //console.log(currentTask.def.displayname, "requires", asset.icon);
            if (!canBuy(asset)) {
                var task = findTaskForAsset(asset, tasks);
                if (task && findChildren(task, tasks)) {
                    //console.log(asset.icon, "can be aquired from the", currentTask.def.displayname, "task");
                    currentTask.children.push(task);
                } else {
                    console.log(asset.icon + " cannot be acquired"+ ", " + currentTask.def.displayname + " cannot be completed");
                    return false;
                }
            } else {
                currentTask.copperCost += getCopperCostinfoForAsset(asset).count * asset.required;
                //console.log(asset.icon, "can be acquired from the vendor for", asset.copperCost, "copper");
            }
        }
        return true;
    }

    function canBuy(itemToFind) {
        return unsafeWindow.client.dataModel.model.vendor.items.filter(function(item){
            if (itemToFind.hdef) {
                return item.hdef === itemToFind.hdef;
            } else if (itemToFind.icon) {
                return item.icon === itemToFind.icon;
            } else if (itemToFind.hitem) {
                return item.hdef === itemToFind.hitem;
            }
            return false;
        }).length > 0;
    }

    function removeCurrentTask(currentTask, tasks) {
        var newTasks = [];
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (task.def.displayname !== currentTask.def.displayname) {
                newTasks.push(task);
            }
        }
        return newTasks;
    }

    function findTaskForConsumable(reqConsumable, craftingList) {
        for (var i = 0; i < craftingList.length; i++) {
            var craftingItem = craftingList[i];
            for (var j = 0; j < craftingItem.rewards.length; j++) {
                if (craftingItem.rewards[j].hdef == reqConsumable.hdef) {
                    return craftingItem;
                }
            }
        }
        //console.log("No task found that can provide", reqConsumable.hdef);
        return null;
    }

    function getCopperCostinfoForAsset(asset) {
        return unsafeWindow.client.dataModel.model.vendor.items.filter(function(item){ return item.icon == asset.icon; })[0].costinfo.filter(function(costinfo){ return costinfo.hitemdef == "@ItemDef[Resources]"; })[0];
    }

    function getCopperCostinfo(consumable) {
        return unsafeWindow.client.dataModel.model.vendor.items.filter(function(item){ return item.hdef == consumable.hdef; })[0].costinfo.filter(function(costinfo){ return costinfo.hitemdef == "@ItemDef[Resources]"; })[0];
    }

    function findTaskForAsset(asset, tasks) {
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            for (var j = 0; j < task.rewards.length; j++) {
                var reward = task.rewards[j];
                if (reward.icon == asset.icon) {
                    return task;
                }
            }
        }
        console.log("No task found that can provide the", asset.icon, "asset");
        return null;
    }


    /**
     * Iterative approach to finding the next task to assign to an open slot.
     *
     * @param {Array} prof The tasklist for the profession being used
     * @param {int} i The current task number being attempted
     */
    function createNextTask(tasks, i) {

        console.log("Selecting next task (i: "+i+").");

        if (tasks === null || i+1 > tasks.length) {
            console.log("Unable to select a task, the task list is empty");
            dfdNextRun.resolve(delay.SHORT);
            return false;
        }
        if (!unsafeWindow.client.dataModel.model.craftinglist || unsafeWindow.client.dataModel.model.craftinglist === null || !unsafeWindow.client.dataModel.model.craftinglist['craft_' + tasks.craftName] || unsafeWindow.client.dataModel.model.craftinglist['craft_' + tasks.craftName] === null) {
            console.log('Task list not loaded for:', tasks.craftName);
            window.setTimeout(function() { createNextTask(tasks, i); }, delay.SHORT);
            return false;
        }
        var task = getNextTask(tasks[i]);
        gatherResources(task);
        
        // TODO: Craft name should be on each task, that way we can create a craftlist containing mixed craft tasks.
        task = '/professions-tasks/' + tasks.craftName + '/' + task.def.name;
        unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/,')' + task);
        WaitForState("div.page-professions-taskdetails").done(function() {
            var def = $.Deferred();
            var buttonList = $("h3:contains('Optional Assets:')").closest("div").find("button");
            if (buttonList.length && settings.optionals) {
                SelectItemFor(buttonList, 0, def, tasks);
            }
            else {
                def.resolve();
            }
            def.done(function() {
                var enabledButton = $("div.footer-body > div.input-field.button:not('.disabled') > button:contains('Start Task')");
                if (enabledButton.length) {
                    enabledButton.click();
                    WaitForState("").done(function() {
                        dfdNextRun.resolve(delay.SHORT);
                    });
                    return;
                }
                else {
                    $("div.footer-body > div.input-field.button > button:contains('Back')").click();
                    WaitForState("").done(function() {
                        createNextTask(tasks, i+1);
                    });
                }
            });
        });
    }

    function getNextTask(task) {
        if (task.children.length > 0) {
            return getNextTask(task.children[0]);
        }
        return task;
    }

    function gatherResources(task) {
        if (!task.failedrequirementsreasons.length) {
            console.log("Resource requirements met for "+task.def.name);
        } else {
            console.log("Resource requirements not met for "+task.def.name);
            var consumables = task.consumables.filter(function(consumable) { return consumable.required && !consumable.fillsrequirements; });
            for (var i = 0; i < consumables.length; i++) {
                var consumable = consumables[i];
                buyConsumable(consumable);
            }
            var assets = task.required.filter(function(asset){ return asset.required && !asset.fillsrequirements; });
            for (var j = 0; j < assets.length; j++) {
                var asset = assets[j];
                if (!asset.fillsrequirements) {
                    buyAsset(asset);
                }
            }
        }
    }

    function buyConsumable(consumable) {
        console.log("Buying consumable: "+consumable.hdef);
        unsafeWindow.client.sendCommand("GatewayVendor_PurchaseVendorItem", { vendor: 'Nw_Gateway_Professions_Merchant', store: 'Store_Crafting_Resources', idx: getStoreIndex(consumable), count: consumable.required - consumable.count });
        WaitForState("button.closeNotification").done(function() {
            $("button.closeNotification").click();
        });
    }

    function getStoreIndex(itemToFind) {
        return unsafeWindow.client.dataModel.model.vendor.items.filter(function(item){
            if (itemToFind.hdef) {
                return item.hdef === itemToFind.hdef;
            } else {
                return item.icon === itemToFind.icon;
            }
        })[0].storeindex;
    }

    function buyAsset(asset) {
        console.log("Buying asset: "+asset.hdef);
        unsafeWindow.client.sendCommand("GatewayVendor_PurchaseVendorItem", { vendor: 'Nw_Gateway_Professions_Merchant', store: 'Store_Crafting_Assets', idx: getStoreIndex(asset), count: 1 });
        WaitForState("button.closeNotification").done(function() {
            $("button.closeNotification").click();
        });
    }
    
    /**
     * Fills resource slots and begins a profession task
     *
     * @param {string} taskDetail The craftindetail object for the task to be started
     */
     /*
    function startTask(taskDetail) {
        return;
        
        unsafeWindow.client.professionFetchTaskDetail(taskDetail.def.name);
        //client.dataModel.addDefaultResources();
        client.professionStartAssignment(taskDetail.def.name);
    }
    */

    /**
     * Selects the highest level asset for the i'th button in the list. Uses an iterative approach
     * in order to apply a sufficient delay after the asset is assigned
     *
     * @param {Array} The list of buttons to use to click and assign assets for
     * @param {int} i The current iteration number. Will select assets for the i'th button
     * @param {Deferred} jQuery Deferred object to resolve when all of the assets have been assigned
     */
    function SelectItemFor(buttonListIn, i, def, prof) {
        buttonListIn[i].click();
        WaitForState("").done(function() {
            var specialItems = $("div.modal-item-list a.Special");
            var goldItems = $("div.modal-item-list a.Gold");
            var silverItems = $("div.modal-item-list a.Silver");
            var bronzeItems = $("div.modal-item-list a.Bronze");
            var clicked = false;

            // Try to avoid using up higher rank assets needlessly
            if (prof.taskName === "Leadership") {
                var mercenarys = $("div.modal-item-list a.Bronze:contains('Mercenary')");
                var guards = $("div.modal-item-list a.Bronze:contains('Guard')");
                var footmen = $("div.modal-item-list a.Bronze:contains('Footman')");

                if (mercenarys.length)   { clicked = true; mercenarys[0].click(); }
                else if (guards.length)  { clicked = true; guards[0].click(); }
                else if (footmen.length) { clicked = true; footmen[0].click(); }
            }
            // TODO: add remaining professions in the same way for bronze tier assets.

            if (!clicked) {
                // Click the highest slot
                if (specialItems.length)     { specialItems[0].click(); }
                else if (goldItems.length)   { goldItems[0].click(); }
                else if (silverItems.length) { silverItems[0].click(); }
                else if (bronzeItems.length) { bronzeItems[0].click(); }
                else { $("button.close-button").click(); }
            }

            //console.log("Clicked item");
            WaitForState("").done(function() {
                // Get the new set of select buttons created since the other ones are removed when the asset loads
                var buttonList = $("h3:contains('Optional Assets:')").closest("div").find("button");
                if (i < buttonList.length - 1) {
                    SelectItemFor(buttonList, i+1, def, prof);
                }
                else {
                    // Let main loop continue
                    def.resolve();
                }
            });
        });
    }
    
    function switchChar() {
        if (settings.refinead) {
            var _currencies = unsafeWindow.client.dataModel.model.ent.main.currencies;
            if (_currencies.diamondsconvertleft && _currencies.roughdiamonds) {
                //console.log("Refining AD");
                unsafeWindow.client.sendCommand('Gateway_ConvertNumeric', 'Astral_Diamonds');
            }
        }

        //console.log("Switching Characters");
        if (++charcurrent >= settings.charcount) { charcurrent = 0; }
        GM_setValue("charcurrent", charcurrent);
        dfdNextRun.resolve(delay.SHORT);
    }
    
    /**
     * Waits for the loading symbol to be hidden.
     *
     * @return {Deferred} A jQuery defferred object that will be resolved when loading is complete
     */
    function WaitForLoad() {
        return WaitForState("");
    }
    /**
     * Creates a deferred object that will be resolved when the state is reached
     *
     * @param {string} query The query for the state to wait for
     * @return {Deferred} A jQuery defferred object that will be resolved when the state is reached
     */
    function WaitForState(query) {
        var dfd = $.Deferred();
        window.setTimeout(function() {AttemptResolve(query, dfd);}, delay.SHORT); // Doesn't work without a short delay
        return dfd;
    }
    /**
     * Will continually test for the given query state and resolve the given deferred object when the state is reached
     * and the loading symbol is not visible
     *
     * @param {string} query The query for the state to wait for
     * @param {Deferred} dfd The jQuery defferred object that will be resolved when the state is reached
     */
    function AttemptResolve(query, dfd) {
        if ((query === "" || $(query).length) && $("div.loading-image:visible").length === 0) {
            dfd.resolve();
        }
        else {
            window.setTimeout(function() {AttemptResolve(query, dfd);}, delay.SHORT); // Try again in a little bit
        }
    }

    /**
     * The main process loop:
     * - Determine which page we are on and call the page specific logic
     * - When processing is complete, process again later
     *   - Use a short timer when something changed last time through
     *   - Use a longer timer when waiting for tasks to complete
     */
    function process() {
        // Make sure the settings button exists
        addSettings();

        // Enable/Disable the unconditional page reload depending on settings
        loading_reset = settings.autoreload; 

        // Check if timer is paused
        s_paused = settings.paused; // let the Page Reloading function know the pause state
        if (settings.paused) {
            // Just continue later - the deferred object is still set and nothing will resolve it until we get past this point
            var timerHandle = window.setTimeout(function() {process();}, delay.DEFAULT);
            return;
        } 

        // Check for Gateway down
        if (window.location.href.indexOf("gatewaysitedown") > -1) {
            // Do a long delay and then retry the site
            console.log("Gateway down detected - relogging in "+(delay.MINS/1000)+" seconds");
            window.setTimeout(function() {unsafeWindow.location.href = "http://gateway.playneverwinter.com";}, delay.MINS);
            return;
        }

        // Check for login or account guard and process accordingly
        var currentPage = GetCurrentPage();
        if      (currentPage == PAGES.LOGIN)       { page_LOGIN(); return; }
        else if (currentPage == PAGES.GUARD)       { page_GUARD(); return; }
        
        window.setTimeout(function() {loginProcess();}, delay.SHORT);
        
        // Continue again later
        dfdNextRun.done(function(delayTimer) {
            dfdNextRun = $.Deferred();
            timerHandle = window.setTimeout(function() {process();}, typeof delayTimer!== 'undefined' ? delayTimer:delay.DEFAULT);
        });
    }
    
    function loginProcess() {

        console.log("Login process started.");

        // Get logged on account details
        var accountName;
        try {
            accountName = unsafeWindow.client.dataModel.model.loginInfo.publicaccountname;
        }
        catch (e) {
            // TODO: Use callback function
            console.log("ERROR: Failed to get the account name.");
            window.setTimeout(function() {loginProcess();}, delay.SHORT);
            return;
        }
        
        // Check if timer is paused again to avoid starting new task between timers
        s_paused = settings.paused; // let the Page Reloading function know the pause state
        if (settings.paused) {
            // Just continue later - the deferred object is still set and nothing will resolve it until we get past this point
            var timerHandle = window.setTimeout(function() {process();}, delay.DEFAULT);
            return;
        } 

        if (accountName) {
            // load current character position and values
            charcurrent =  GM_getValue("charcurrent", 0);
            if (charcurrent > parseInt(settings.charcount)) {
                charcurrent = 0;
            }
            for (var i = 0; i < (charSettings.length/settings.charcount); i++) {
                var j = i+(charcurrent*charSettings.length/settings.charcount);
                settings[charSettings[j].name.replace(new RegExp(charcurrent+"$"),'')] = settings[charSettings[j].name];
            }

            var charName = settings.nw_charname;
            var fullCharName = charName+'@'+accountName;

            if (unsafeWindow.client.getCurrentCharAtName() != fullCharName) {
                loadCharacter(fullCharName);
                return;
            }

            // Try to start tasks
            if (processCharacter()) {
                console.log("Not finished processing "+charName+".");
                return;
            } else {
                console.log("Finished processing "+charName+".");
            }

            // Switch to the next character.
            window.setTimeout(function() {
                switchChar();
            }, delay.CHAR);
            
        } else {
            console.log("ERROR: No account name available.");
        }
    }

    function loadCharacter(charname) {
        // Load character and restart next load loop
        console.log("Loading "+charname);
        unsafeWindow.client.dataModel.loadEntityByName(charname);
        dfdNextRun.resolve();
    }
    
    function addSettings() {
        if ($("#settingsButton").length)
            return;
        // Add the required CSS
        AddCss("\
            #settingsButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 0px; top: 0px; padding: 3px; z-index: 1000;}\
            #pauseButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 23px; top: 0px; padding: 3px; z-index: 1000;}\
            #settingsPanel{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); color: rgb(0, 0, 0); position: fixed; overflow: auto; right: 0px; top: 0px; width: 350px;max-height:750px;font: 12px sans-serif; text-align: left; display: block; z-index: 1000;}\
            #settings_title{font-weight: bolder; background: none repeat scroll 0% 0% rgb(204, 204, 204); border-bottom: 1px solid rgb(102, 102, 102); padding: 3px;}\
            #settingsPanelButtonContainer {background: none repeat scroll 0% 0% rgb(204, 204, 204); border-top: 1px solid rgb(102, 102, 102);padding: 3px;text-align:center} \
            #settingsPanel label.purple {font-weight:bold;color:#7C37F6}\
            #settingsPanel label.blue {font-weight:bold;color:#007EFF}\
            #settingsPanel label.green {font-weight:bold;color:#8AFF00}\
            #settingsPanel label.white {font-weight:bold;color:#FFFFFF}\
            #charPanel {width:340px;max-height:400px;overflow:auto;display:block;padding:3px;}\
        ");

        // Add settings panel to page body
        $("body").append(
            '<div id="settingsPanel">\
                <div id="settings_title">\
                    <img src='+image_prefs+' style="float: left; vertical-align: text-bottom;"\>\
                    <img id="settings_close" src='+image_close+' title="Click to hide preferences" style="float: right; vertical-align: text-bottom; cursor: pointer; display: block;"\>\
                    <span style="margin:3px">Settings</span>\
                </div>\
                <form style="margin: 0px; padding: 0px">\
                    <ul style="list-style: none outside none; max-height: 500px; overflow: auto; margin: 3px; padding: 0px;">\
                    </ul>\
                </form>\
            </div>'
        );

        // Add each setting input
        var settingsList = $("#settingsPanel form ul");
        for (var i = 0; i < settingnames.length; i++) {
            var id = 'settings_' + settingnames[i].name;
            var indent = countLeadingSpaces(settingnames[i].title) * 2;
            switch(settingnames[i].type) {
                case "checkbox":
                    settingsList.append('<li title="'+settingnames[i].tooltip+'" style="margin-left:'+indent+'em"><input style="margin:4px" name="'+id+'" id="'+id+'" type="checkbox" /><label class="'+settingnames[i].class+'" for="'+id+'">'+settingnames[i].title+'</label></li>');
                    $('#'+id).prop('checked', settings[settingnames[i].name]);
                    break;
                case "text":
                    settingsList.append('<li title="'+settingnames[i].tooltip+'" style="margin-left:'+indent+'em"><label class="'+settingnames[i].class+'" for="'+id+'">'+settingnames[i].title+'</label><input style="margin:4px" name="'+id+'" id="'+id+'" type="text" /></li>');
                    $('#'+id).val(settings[settingnames[i].name]);
                    break;
                case "password":
                    settingsList.append('<li title="'+settingnames[i].tooltip+'" style="margin-left:'+indent+'em"><label class="'+settingnames[i].class+'" for="'+id+'">'+settingnames[i].title+'</label><input style="margin:4px" name="'+id+'" id="'+id+'" type="password" /></li>');
                    $('#'+id).val(settings[settingnames[i].name]);
                    break;
                case "select":
                    settingsList.append('<li title="'+settingnames[i].tooltip+'" style="margin-left:'+indent+'em"><label class="'+settingnames[i].class+'" style="padding-left:4px" for="'+id+'">'+settingnames[i].title+'</label><select style="margin:4px" name="'+id+'" id="'+id+'" /></li>');
                    var options = settingnames[i].opts;
                    var select = $('#'+id);
                    for (var j = 0; j < options.length; j++) {
                        if (settings[settingnames[i].name] == options[j].path)
                            select.append('<option value="'+options[j].path+'" selected="selected">'+options[j].name+'</option>');
                        else 
                            select.append('<option value="'+options[j].path+'">'+options[j].name+'</option>');
                    }
                    break;
                case "label":
                    settingsList.append('<li title="'+settingnames[i].tooltip+'" style="margin-left:'+indent+'em;><label class="'+settingnames[i].class+'">'+settingnames[i].title+'</label></li>');
                    break; 
            }
        }
        
        // Add character settings for each char
        var addText = '\
            <script type="text/javascript">\
            <!--\
            function click_position(obj)\
            {\
                change_position(obj.value)\
            }\
            \
            function change_position(val)\
            {\
                for (var i = 0; i < '+settings.charcount+'; i++)\
                {\
                    document.getElementById("charContainer"+i).style.display="none";\
                }\
                document.getElementById("charContainer"+val).style.display="block";\
            }\
            //-->\
            </script>\
            <div id="charPanel">\
                <div style="width:150px;max-height:400px;overflow:auto;">\
            ';
        for (var i = 0; i < settings.charcount; i++) {
            addText += '\
                    <div><input autocomplete="off" type="radio" name="radio_position" onclick="click_position(this)" id="value_'+i+'" value="'+i+'" /><label for="value_'+i+'">'+settings["nw_charname"+i]+'</label></div>\
                ';
        }
        addText += '\
                </div>\
                <div style="width:340px;">\
            ';
        for (var i = 0; i < settings.charcount; i++) {
            addText += '\
                    <div id="charContainer'+i+'" style="display:none">\
                        <ul style="list-style: none outside none; max-height: 500px; overflow: auto;">\
                ';
            var k = 0 + (i*charSettings.length/settings.charcount);
            var id = 'settings_' + charSettings[k].name;
            addText += '<li title="'+charSettings[k].tooltip+'"><input style="margin:4px" name="'+id+'" id="'+id+'" type="text" /></li>';
            var numSettingsPerChar = charSettings.length/settings.charcount;
            for (var j = 1; j < (numSettingsPerChar); j++) {
                k = j + (i*numSettingsPerChar);
                if (charSettings[k].type == 'void') { continue; }
                id = 'settings_' + charSettings[k].name;
                if ((j-1)%4 === 0 && j !== numSettingsPerChar-1) {
                    addText += '<li>';
                }
                addText += '<input maxlength="2" size="1" style="margin:4px" name="'+id+'" id="'+id+'" type="'+charSettings[k].type+'" title="'+charSettings[k].tooltip+'" />';
                addText += '<label class="' + charSettings[k].class + '" for="' + id + '">' + charSettings[k].title + '</label>';
                if (j%4 === 0 && j !== 1) {
                    addText += '</li>';
                }
            }
            addText += '</ul>';
            addText += '</div>';
        }
        addText += '\
                </div>\
            </div>\
            ';
        $("#settingsPanel form").append(addText);

        // Add values to character input fields
        for (var i = 0; i < charSettings.length; i++) {
            var id = 'settings_' + charSettings[i].name;
            switch(charSettings[i].type) {
            case "checkbox":
                $('#'+id).prop('checked', settings[charSettings[i].name]);
                break;
            case "text":
                $('#'+id).val(settings[charSettings[i].name]);
                break;
            }
        }

        // Add save/cancel buttons to panel
        $("#settingsPanel form").append('\
            <div id="settingsPanelButtonContainer">\
                <input id="settings_save" type="button" value="Save and Apply">\
                <input id="settings_close" type="button" value="Close">\
            </div>');

        // Add open settings button to page
        $("body").append('<div id="settingsButton"><img src="'+image_prefs+'" title="Click to show preferences" style="cursor: pointer; display: block;"></div>');

        // Add pause button to page
        $("body").append('<div id="pauseButton"><img src="'+(settings.paused?image_play:image_pause)+'" title="Click to '+(settings.paused?"resume":"pause")+' task script" style="cursor: pointer; display: block;"></div>');

        // Add the javascript
        $("#settingsPanel").hide();
        $("#settingsButton").click(function() {
            $("#settingsButton").hide();
            $("#pauseButton").hide();
            $("#settingsPanel").show();
        });
        $("#settings_close,settings_cancel").click(function() {
            $("#settingsButton").show();
            $("#pauseButton").show();
            $("#settingsPanel").hide();
        });
        $("#pauseButton").click(function() {
            settings.paused = !settings.paused;
            setTimeout(function() { GM_setValue("paused", settings.paused); }, 0);
            $("#settings_paused").prop("checked", settings.paused);
            $("#pauseButton img").attr("src",(settings.paused?image_play:image_pause));
            $("#pauseButton img").attr("title","Click to "+(settings.paused?"resume":"pause")+" task script");
        });

        // Use setTimeout to workaround permission issues when calling GM functions from main window
        $("#settings_save").click(function() { setTimeout(function() { SaveSettings();}, 0);});
    }

    function SaveSettings() {
        var charcount = settings.charcount;

        // Get each value from the UI
        for (var i = 0; i < settingnames.length; i++) {
            var name = settingnames[i].name;
            var el = $('#settings_'+name);
            var value = false;
            switch(settingnames[i].type) {
                case "checkbox":
                    value = el.prop("checked");
                    break;
                case "text":
                    value = el.val();
                    break;
                case "password":
                    value = el.val();
                    break;
                case "select":
                    value = el.val();
                    break;
                case "label": // Labels don't have values
                    continue;
            }
            if (typeof(settingnames[i].onsave) === "function") {
                //console.log("Calling 'onsave' for", name);
                settingnames[i].onsave(value, settings[name]);
            }
            if (settings[name] !== value) { settings[name] = value; } // Save to local cache
            if (GM_getValue(name) !== value) { GM_setValue(name, value); } // Save to GM cache
        }

        // Get character settings from UI
        for (var i = 0; i < charSettings.length; i++) {
            if (charSettings[i].type == 'void') { continue; }
            var name = charSettings[i].name;
            var el = $('#settings_' + name);
            var value = el.val();
            switch(charSettings[i].type) {
                case "text":
                    value = el.val();
                    break;
                case "checkbox":
                    value = el.prop("checked");
                    break;
            }
            //console.log(settings, name, el, value);
            if (settings[name] !== value) { settings[name] = value; } // Save to local cache
            if (GM_getValue(name) !== value) { GM_setValue(name, value); } // Save to GM cache
        }
        
        // If character numbers have changed reload page
        if (charcount != settings.charcount) {
            console.log("Reloading Gateway to update character count");
            unsafeWindow.location.href = "http://gateway.playneverwinter.com";
            return;
        }

        // Delete all saved settings
        /*
        if (settingwipe) {
            var keys = GM_listValues();
            for (var i = 0; i < keys.length; i++) {
                GM_deleteValue(keys[i]);
            }
        }
        */
        
        // Close the panel
        $("#settingsButton").show();
        $("#pauseButton img").attr("src",(settings.paused?image_play:image_pause));
        $("#pauseButton img").attr("title","Click to "+(settings.paused?"resume":"pause")+" task script");
        $("#pauseButton").show();
        $("#settingsPanel").hide();
    }

    // Add the settings button and start a process timer
    addSettings();
    timerHandle = window.setTimeout(function() {process();}, delay.SHORT);
})();

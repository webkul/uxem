var model = new Object();
model = {
    id: `1`,
    title: `Empathy map tool to visualise user's need and behaviour`,
    says: `<ul><li>Need to create different maps for different projects</li><li>No solidity in the user research workflow</li><li>User feedback/suggestions get cumbersome</li><li>Need to organise data to share with stakeholders</li></ul>`,
    thinks: `<ul><li>The conventional process takes a lot of productive time</li><li>Is there any better alternative or tool?</li><li>How to kill the spaghetti mess</li></ul>`,
    does: `<ul><li>Uses word-processor or notepad</li><li>Uses sticky notes</li><li>Scribbles on Moleskine</li><li>Keeps searching archives</li></ul>`,
    feels: `<ul><li>Saturated</li><li>Frustrated</li><li>Anxious</li><li>Sloppy</li></ul>`
}
var headString = `<head><link href="https://fonts.googleapis.com/css?family=PT+Serif&display=swap" rel="stylesheet"></head><style>*{box-sizing:border-box}body{font-family:'PT Serif',serif;padding:24px;width:2000px;max-width:100%;margin:0 auto}h1{font-size:48px}h2{font-size:28px}ul{font-size:18px}body>div:first-of-type{display:grid;grid-template-columns:1fr 1fr}@media screen and (max-width:800px){body>div:first-of-type{grid-template-columns:1fr}}</style>`;
var initHandler = function () {
    var ueTitle = document.querySelector(".ue-title span"),
        ueView = document.querySelectorAll(".ue-view"),
        ueProject = document.querySelector(".ue-ic-projects"),
        ueMode = document.querySelector(".ue-ic-mode"),
        ueCredits = document.querySelector(".ue-ic-credits"),
        ueSave = document.querySelector(".ue-ic-save"),
        getBody = document.body,
        ueDropAction = document.querySelector(".ue-dropaction span"),
        ueOverlay = document.querySelector(".ue-xs-overlay"),
        ueSegment = document.querySelectorAll(".ue-segment"),
        ueST = document.querySelectorAll(".ue-st"),
        ueLogo = document.querySelector(".ue-logo"),
        ueNotes = document.querySelectorAll(".ue-notes"),
        ueLock = document.querySelectorAll(".ue-segment h2"),
        ueProjectList = document.querySelector(".ue-project-list"),
        ueBtnAdd = document.querySelector(".ue-btn-add"),
        ueWorkspace = document.querySelector(".ue-workspace"),
        ueToolbar = document.querySelector(".ue-toolbar"),
        totalProjects,
    activeView = "workspace";

    //Plain Text Handler
    var plainText = function (ev) {
        ev.preventDefault();
        var plainString = (ev.originalEvent || ev).clipboardData.getData('text/plain');
        document.execCommand("insertHTML", false, plainString);
    }


    //Title
    if (ueTitle) {
        //Push Cursor to End
        ueTitle.addEventListener("focus", function () {
            var textSelection = window.getSelection();
            if (ueTitle.firstChild != null) {
                textSelection.collapse(ueTitle.firstChild, ueTitle.firstChild.length);
            }
        });
        //Paste as Plain Text
        ueTitle.addEventListener("paste", function (ev) {
            plainText(ev);
        });
    }

    //Notes
    if (ueNotes) {
        //Paste as Plain Text
        ueNotes.forEach(function (item) {
            item.addEventListener("paste", function (ev) {
                plainText(ev);
            });
        })
    }

    //Lock
    if (ueLock) {
        ueLock.forEach(function (item) {
            item.addEventListener("click", function () {
                if (!item.classList.contains("ue-locked")) {
                    item.classList.add("ue-locked");
                    item.nextElementSibling.setAttribute("contenteditable", "false");
                } else {
                    item.classList.remove("ue-locked");
                    item.nextElementSibling.setAttribute("contenteditable", "true");
                }
            });
        })
    }

    if (ueView) {
        var hideViews = function (param) {
            ueView.forEach(function (item) {
                if (item.dataset.view != param) {
                    if (item.classList.contains("ue-vw-active")) {
                        item.classList.remove("ue-vw-active");
                    }
                } else if (!item.classList.contains("ue-vw-active")) {
                    item.classList.add("ue-vw-active");
                }
            });
        }
        ueProject.addEventListener("click", function () {
            if (activeView != "projects") {
                getProjectsList();
                activeView = "projects";
                hideViews(activeView);
            }
        });

        ueCredits.addEventListener("click", function () {
            activeView = "credits";
            hideViews(activeView);
        });

        ueSave.addEventListener("click", function () {
            let computeContent = ueWorkspace.innerHTML.replace(/contenteditable="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, '').replace(/class="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, '');
            let computeHref = `data:text/html,<html>${headString} ${computeContent}</html>`;
            if (ueTitle.textContent == "") {
                this.download = `uxem-unnamed-project.html`;
            } else {
                this.download = `uxem-${ueTitle.textContent.toLowerCase()}.html`;
            }
            this.href = computeHref;
        })
    }

    // Segments
    if (ueSegment) {
        var hideSegments = function (param) {
            ueSegment.forEach(function (item) {
                if (item.dataset.view != param) {
                    if (item.classList.contains("ue-segment-visible")) {
                        item.classList.remove("ue-segment-visible");
                    }
                } else if (!item.classList.contains("ue-segment-visible")) {
                    item.classList.add("ue-segment-visible");
                }
            });
        }
        if (ueST) {
            var hideST = function (param) {
                ueST.forEach(function (item) {
                    if (item.dataset.bind != param) {
                        if (item.classList.contains("ue-st-visible")) {
                            item.classList.remove("ue-st-visible");
                        }
                    } else if (!item.classList.contains("ue-st-visible")) {
                        item.classList.add("ue-st-visible");
                    }
                });
            }
            ueST.forEach(function (trigger) {
                trigger.addEventListener("click", function () {
                    let tempData = trigger.dataset.bind;
                    activeView = "workspace";
                    hideViews(activeView);
                    hideSegments(tempData);
                    hideST(tempData);
                    ueDropAction.textContent = tempData;
                });
            })
        }
    }

    //Dark Mode
    ueMode.addEventListener("click", function () {
        if (!getBody.classList.contains("ue-dark-mode")) {
            getBody.classList.add("ue-dark-mode");
            saveDarkMode("on");
        } else {
            getBody.classList.remove("ue-dark-mode");
            saveDarkMode("off");
        }
    });


    //BottomSheet
    if (ueDropAction) {
        ueDropAction.addEventListener("click", function () {
            if (ueOverlay) {
                if (!ueOverlay.classList.contains("ue-xs-overlay-show")) {
                    ueOverlay.classList.add("ue-xs-overlay-show");
                }
                ueOverlay.addEventListener("click", function () {
                    if (ueOverlay.classList.contains("ue-xs-overlay-show")) {
                        ueOverlay.classList.add("ue-xs-overlay-hide");
                        setTimeout(function () {
                            ueOverlay.classList.remove("ue-xs-overlay-hide", "ue-xs-overlay-show");
                        }, 400);
                    }
                });
            }
        });
    }

    //Detect Windows to Customize Style
    if (window.navigator.platform === "Win32" || window.navigator.platform === "Linux x86_64") {
        var cssString = `::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:var(--primary-8)}::-webkit-scrollbar-thumb{background:var(--primary-86)}`;
        var dynamicStyle = document.createElement("style");
        dynamicStyle.textContent = cssString;
        document.body.appendChild(dynamicStyle);
    }

    var computeModel = function () {
        model = {
            id: ueTitle.dataset.projectId,
            title: ueTitle.innerHTML,
            says: ueNotes[0].innerHTML,
            thinks: ueNotes[1].innerHTML,
            does: ueNotes[2].innerHTML,
            feels: ueNotes[3].innerHTML
        };
        return model;
    }

    var openIndexedDB = function () {
        var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
        var openDB = indexedDB.open("uxem", 1);
        openDB.onupgradeneeded = function () {
            openDB.result.createObjectStore("config", {
                keyPath: "id"
            });
            openDB.result.createObjectStore("projects", {
                keyPath: "id"
            });
        }
        return openDB;
    }

    var saveProjectStore = function () {
        var openDB = openIndexedDB();
        if (ueTitle.dataset.projectId != "unset") {
            openDB.onsuccess = function () {
                var tx = openDB.result.transaction("projects", "readwrite");
                var store = tx.objectStore("projects");
                var req = store.put(computeModel());
                saveHistory();
                tx.onsuccess = function () {
                    openDB.result.close();
                }
            }
        }
    }

    var saveHistory = function () {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("config", "readwrite");
            var store = tx.objectStore("config");
            var req = store.put({
                id: "2",
                lastHistory: ueTitle.dataset.projectId
            });
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    var saveDarkMode = function (param) {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("config", "readwrite");
            var store = tx.objectStore("config");
            var req = store.put({
                id: "1",
                darkMode: param
            });
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    var getDarkMode = function () {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("config", "readonly");
            var store = tx.objectStore("config");
            var req = store.get("1");
            req.onsuccess = function () {
                if (req.result) {
                    if (req.result.darkMode == "on") {
                        if (!getBody.classList.contains("ue-dark-mode")) {
                            getBody.classList.add("ue-dark-mode");
                        }
                    }
                }
            }
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    var getHistory = function () {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("config", "readonly");
            var store = tx.objectStore("config");
            var req = store.get("2");
            req.onsuccess = function () {
                if (req.result) {
                    ueTitle.dataset.projectId = req.result.lastHistory;
                    getProjectStore();
                } else {
                    getProjectStore();
                }
            }
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }


    var getProjectStore = function () {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("projects", "readonly");
            var store = tx.objectStore("projects");
            var req = store.get(ueTitle.dataset.projectId);
            req.onsuccess = function () {
                if (req.result) {
                    ueTitle.innerHTML = req.result.title;
                    ueNotes[0].innerHTML = req.result.says;
                    ueNotes[1].innerHTML = req.result.thinks;
                    ueNotes[2].innerHTML = req.result.does;
                    ueNotes[3].innerHTML = req.result.feels;
                    ueTitle.focus();
                } else if (totalProjects == 0 || ueTitle.dataset.projectId == 1) {
                    ueTitle.innerHTML = model.title;
                    ueNotes[0].innerHTML = model.says;
                    ueNotes[1].innerHTML = model.thinks;
                    ueNotes[2].innerHTML = model.does;
                    ueNotes[3].innerHTML = model.feels;
                    ueTitle.focus();
                    saveProjectStore();
                } else {
                    if (activeView != "projects") {
                        getProjectsList();
                        activeView = "projects";
                        hideViews(activeView);
                    }
                }
            }
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    var getProjectsList = function () {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("projects", "readonly");
            var store = tx.objectStore("projects");
            var projectListReq = store.getAll();
            projectListReq.onsuccess = function () {
                totalProjects = projectListReq.result.length;
                if (projectListReq.result.length == 0) {
                    ueProjectList.innerHTML = '<div class="ue-empty-state"><img></img><p>You killed all the projects, try refreshing or creating a new project.</p></div>';
                } else {
                    ueProjectList.innerHTML = '';
                    var projectList = projectListReq.result;
                    projectList.forEach(function (item) {
                        if (item.title == "") {
                            item.title = `Unnamed Project`;
                        }
                        var listItem = document.createElement("li");
                        listItem.innerHTML = `<span class="ue-ic ue-ic-trash" data-project-id="${item.id}"></span><span data-project-id="${item.id}" class="ue-project-name">${item.title}</span>`
                        ueProjectList.appendChild(listItem);
                    });
                }
            }
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    var deleteProjectStore = function (param) {
        var openDB = openIndexedDB();
        openDB.onsuccess = function () {
            var tx = openDB.result.transaction("projects", "readwrite");
            var store = tx.objectStore("projects");
            store.delete(param);
            getProjectsList();
            tx.onsuccess = function () {
                openDB.result.close();
            }
        }
    }

    ueBtnAdd.addEventListener("click", function () {
        activeView = "workspace";
        hideViews(activeView);
        ueTitle.dataset.projectId = Date.now();
        ueTitle.innerHTML = ``;
        ueNotes.forEach(function (item) {
            item.innerHTML = `<ul><li></li></ul>`;
        });
    });
    ueTitle.onkeydown = function () {
        saveProjectStore();
    };
    ueNotes.forEach(function (item) {
        item.onkeyup = function () {
            hideToolbar();
            if (item.innerHTML == "<div><br></div>" | item.innerHTML == "") {
                item.innerHTML = `<ul><li></li></ul>`
            }
            saveProjectStore();
        };
    });
    window.addEventListener("focus", function () {
        getDarkMode();
        getProjectsList();
        getProjectStore();
        ueTitle.focus();
    });
    getProjectsList();
    getHistory();
    getDarkMode();
    window.addEventListener("click", function (ev) {
        var temptarget = ev.target;
        if (ev.target.matches(".ue-project-name")) {
            ueTitle.dataset.projectId = ev.target.dataset.projectId;
            getProjectStore();
            activeView = "workspace";
            hideViews(activeView);
        }
        if (ev.target.matches(".ue-ic-trash")) {
            var response = window.confirm("Are you sure you want to delete the project?");
            if (response == true) {
                deleteProjectStore(ev.target.dataset.projectId);
                ueTitle.dataset.projectId = "unset";
                getProjectsList();
            }
        }
    });

    //Editor
    var hideToolbar = function () {
        if (ueToolbar.classList.contains("ue-toolbar-visible")) {
            ueToolbar.classList.remove("ue-toolbar-visible");
        }
        ueStyle.style.display = "block";
        ueColors.style.display = "none";
    }
    var selection = window.getSelection(); // get the selection then
    var range;
    var ueStyle = document.querySelector(".ue-style");
    var ueColors = document.querySelector(".ue-colors");
    ueNotes.forEach(function (item) {
        item.addEventListener('mouseup', (ev) => {
            range = selection.getRangeAt(0); // the range at first selection group
            var computePosition = range.getBoundingClientRect();
            var charCount = range.endOffset - range.startOffset;
            if (charCount) {
                ueToolbar.style.left = `${computePosition.x}px`;
                ueToolbar.style.top = `${computePosition.y - computePosition.height/2 - 40}px`;
                ueToolbar.classList.add("ue-toolbar-visible");
            }
        });
    })

    var toolbarAction = function (prop, val, condition) {
        var span = document.createElement('span');
        span.style[prop] = val;
        if (condition == true) {
            span.style.color = "rgba(0,0,0,.86)";
        }
        span.appendChild(range.extractContents());
        range.insertNode(span);
        saveProjectStore();
    }

    document.addEventListener("mousedown", function (ev) {
        var evTarget = ev.target;
        if (evTarget.matches(".ue-ic-bold") || evTarget.matches(".ue-ic-italic") || evTarget.matches(".ue-ic-highlight") || evTarget.matches(".ue-ic-clear") || evTarget.matches(".ue-color")) {
            if (range != undefined) {
                if (evTarget.classList.contains("ue-ic-bold")) {
                    toolbarAction("fontWeight", "bold");
                }
                if (evTarget.classList.contains("ue-ic-italic")) {
                    toolbarAction("fontStyle", "italic");
                }
                if (evTarget.classList.contains("ue-ic-clear")) {
                    var span = document.createTextNode('span');
                    span.textContent = range.extractContents().textContent.replace(/\n/g, "");
                    if (range.commonAncestorContainer.parentNode.hasAttribute("style")) {
                        range.commonAncestorContainer.parentNode.style = "";
                    };
                    range.insertNode(span);
                    saveProjectStore();
                }
                if (evTarget.classList.contains("ue-ic-highlight")) {
                    ueStyle.style.display = "none";
                    ueColors.style.display = "block";
                }
                if (evTarget.classList.contains("ue-color")) {
                    toolbarAction("background", evTarget.dataset.color, true);
                    ueStyle.style.display = "block";
                    ueColors.style.display = "none";
                }
            }
        } else {
            hideToolbar();
        }
    });
}
window.addEventListener("DOMContentLoaded", initHandler);
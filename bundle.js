/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "c073444d425bbc730085"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(1)(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(process) {module.exports = {\n\tpathDataToPolys:svgPathToPolygons,\n\tcompare:compare\n};\nconst { parseSVG, makeAbsolute } = __webpack_require__(2);\n\nfunction svgPathToPolygons(svgPathString, opts={}) {\n\tif (!opts.tolerance) opts.tolerance=1;\n\tconst polys = [];\n\tconst tolerance2 = opts.tolerance*opts.tolerance;\n\tlet poly = [];\n\tlet prev;\n\tmakeAbsolute(parseSVG(svgPathString)).forEach( cmd => {\n\t\tswitch(cmd.code) {\n\t\t\tcase 'M':\n\t\t\t\tpolys.push(poly=[]);\n\t\t\t\t// intentional flow-through\n\t\t\tcase 'L':\n\t\t\tcase 'H':\n\t\t\tcase 'V':\n\t\t\tcase 'Z':\n\t\t\t\tadd(cmd.x,cmd.y);\n\t\t\t\tif (cmd.code==='Z') poly.closed = true;\n\t\t\tbreak;\n\n\t\t\tcase 'C':\n\t\t\t\tsampleCubicBézier(cmd.x0,cmd.y0,cmd.x1,cmd.y1,cmd.x2,cmd.y2,cmd.x,cmd.y);\n\t\t\t\tadd(cmd.x,cmd.y);\n\t\t\tbreak;\n\n\t\t\tcase 'S':\n\t\t\t\tlet x1=0, y1=0;\n\t\t\t\tif (prev) {\n\t\t\t\t\tif (prev.code==='C') {\n\t\t\t\t\t\tx1 = prev.x*2 - prev.x2;\n\t\t\t\t\t\ty1 = prev.y*2 - prev.y2;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tx1 = prev.x;\n\t\t\t\t\t\ty1 = prev.y;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tsampleCubicBézier(cmd.x0,cmd.y0,x1,y1,cmd.x2,cmd.y2,cmd.x,cmd.y);\n\t\t\t\tadd(cmd.x,cmd.y);\n\t\t\tbreak;\n\n\t\t\tdefault:\n\t\t\t\tconsole.error('Our deepest apologies, but '+cmd.command+' commands ('+cmd.code+') are not yet supported.');\n\t\t\t\tprocess.exit(2);\n\t\t}\n\t\tprev = cmd;\n\t});\n\treturn polys;\n\n\t// http://antigrain.com/research/adaptive_bezier/\n\tfunction sampleCubicBézier(x0, y0, x1, y1, x2, y2, x3, y3) {\n\t\t// Calculate all the mid-points of the line segments\n\t\tconst x01   = (x0 + x1) / 2,\n\t\t      y01   = (y0 + y1) / 2,\n\t\t      x12   = (x1 + x2) / 2,\n\t\t      y12   = (y1 + y2) / 2,\n\t\t      x23   = (x2 + x3) / 2,\n\t\t      y23   = (y2 + y3) / 2,\n\t\t      x012  = (x01 + x12) / 2,\n\t\t      y012  = (y01 + y12) / 2,\n\t\t      x123  = (x12 + x23) / 2,\n\t\t      y123  = (y12 + y23) / 2,\n\t\t      x0123 = (x012 + x123) / 2,\n\t\t      y0123 = (y012 + y123) / 2;\n\n\t\t// Try to approximate the full cubic curve by a single straight line\n\t\tconst dx = x3-x0,\n\t\t      dy = y3-y0;\n\n\t\tconst d1 = Math.abs(((x1-x3)*dy - (y1-y3)*dx)),\n\t\t      d2 = Math.abs(((x2-x3)*dy - (y2-y3)*dx));\n\n\t\tif (((d1+d2)*(d1+d2)) < (tolerance2 * (dx*dx + dy*dy))) add(x0123,y0123);\n\t\telse { // Continue subdivision\n\t\t  sampleCubicBézier(x0, y0, x01, y01, x012, y012, x0123, y0123); \n\t\t  sampleCubicBézier(x0123, y0123, x123, y123, x23, y23, x3, y3); \n\t\t}\n   }\n\n   function add(x,y){\n   \tif (opts.decimals && opts.decimals>=0) {\n   \t\tx = x.toFixed(opts.decimals)*1;\n   \t\ty = y.toFixed(opts.decimals)*1;\n   \t}\n   \tpoly.push([x,y]);\n   }\n}\n\n// OMG YOU FOUND THE SECRET UNDOCUMENTED FEATURE\nfunction compare(pathData,opts={}) {\n\tvar polys = svgPathToPolygons(pathData,opts);\n\tvar minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;\n\tpolys.forEach(poly => {\n\t\tpoly.forEach(pt => {\n\t\t\tif (pt[0]<minX) minX=pt[0];\n\t\t\tif (pt[1]<minY) minY=pt[1];\n\t\t\tif (pt[0]>maxX) maxX=pt[0];\n\t\t\tif (pt[1]>maxY) maxY=pt[1];\n\t\t});\n\t});\n\tlet dx=maxX-minX, dy=maxY-minY;\n\tconsole.log(`\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${dx}px\" height=\"${dy}px\" viewBox=\"${minX} ${minY} ${dx*2} ${dy}\">\n<style>path,polygon,polyline { fill-opacity:0.2; stroke:black }</style>\n<path d=\"${pathData}\"/>\n<g transform=\"translate(${dx},0)\">\n${polys.map(poly => `  <${poly.closed ? 'polygon' : 'polyline'} points=\"${poly.join(' ')}\"/>`).join(\"\\n\")}\n</g>\n</svg>\n\t`.trim());\n};\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/svg-path-to-polygons/svg-path-to-polygons.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/svg-path-to-polygons/svg-path-to-polygons.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _require = __webpack_require__(0),\n    pathDataToPolys = _require.pathDataToPolys;\n\nwindow.pathDataToPolys = pathDataToPolys;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

eval("// v1.0 exported just the parser function. To maintain backwards compatibility,\n// we export additional named features as properties of that function.\nvar parserFunction = __webpack_require__(3).parse;\nparserFunction.parseSVG = parserFunction;\nparserFunction.makeAbsolute = makeSVGPathCommandsAbsolute;\nmodule.exports = parserFunction;\n\nfunction makeSVGPathCommandsAbsolute(commands) {\n\tvar subpathStart, prevCmd={x:0,y:0};\n\tvar attr = {x:'x0',y:'y0',x1:'x0',y1:'y0',x2:'x0',y2:'y0'};\n\tcommands.forEach(function(cmd) {\n\t\tif (cmd.command==='moveto') subpathStart=cmd;\n\t\tcmd.x0=prevCmd.x; cmd.y0=prevCmd.y;\n\t\tfor (var a in attr) if (a in cmd) cmd[a] += cmd.relative ? cmd[attr[a]] : 0;\n\t\tif (!('x' in cmd)) cmd.x = prevCmd.x; // V\n\t\tif (!('y' in cmd)) cmd.y = prevCmd.y; // X\n\t\tcmd.relative = false;\n\t\tcmd.code = cmd.code.toUpperCase();\n\t\tif (cmd.command=='closepath') {\n\t\t\tcmd.x = subpathStart.x;\n\t\t\tcmd.y = subpathStart.y;\n\t\t}\n\t\tprevCmd = cmd;\n\t});\n\treturn commands;\n}\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/svg-path-parser/index.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/svg-path-parser/index.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Generated by PEG.js 0.10.0.\n *\n * http://pegjs.org/\n */\n\n\n\nfunction peg$subclass(child, parent) {\n  function ctor() { this.constructor = child; }\n  ctor.prototype = parent.prototype;\n  child.prototype = new ctor();\n}\n\nfunction peg$SyntaxError(message, expected, found, location) {\n  this.message  = message;\n  this.expected = expected;\n  this.found    = found;\n  this.location = location;\n  this.name     = \"SyntaxError\";\n\n  if (typeof Error.captureStackTrace === \"function\") {\n    Error.captureStackTrace(this, peg$SyntaxError);\n  }\n}\n\npeg$subclass(peg$SyntaxError, Error);\n\npeg$SyntaxError.buildMessage = function(expected, found) {\n  var DESCRIBE_EXPECTATION_FNS = {\n        literal: function(expectation) {\n          return \"\\\"\" + literalEscape(expectation.text) + \"\\\"\";\n        },\n\n        \"class\": function(expectation) {\n          var escapedParts = \"\",\n              i;\n\n          for (i = 0; i < expectation.parts.length; i++) {\n            escapedParts += expectation.parts[i] instanceof Array\n              ? classEscape(expectation.parts[i][0]) + \"-\" + classEscape(expectation.parts[i][1])\n              : classEscape(expectation.parts[i]);\n          }\n\n          return \"[\" + (expectation.inverted ? \"^\" : \"\") + escapedParts + \"]\";\n        },\n\n        any: function(expectation) {\n          return \"any character\";\n        },\n\n        end: function(expectation) {\n          return \"end of input\";\n        },\n\n        other: function(expectation) {\n          return expectation.description;\n        }\n      };\n\n  function hex(ch) {\n    return ch.charCodeAt(0).toString(16).toUpperCase();\n  }\n\n  function literalEscape(s) {\n    return s\n      .replace(/\\\\/g, '\\\\\\\\')\n      .replace(/\"/g,  '\\\\\"')\n      .replace(/\\0/g, '\\\\0')\n      .replace(/\\t/g, '\\\\t')\n      .replace(/\\n/g, '\\\\n')\n      .replace(/\\r/g, '\\\\r')\n      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n  }\n\n  function classEscape(s) {\n    return s\n      .replace(/\\\\/g, '\\\\\\\\')\n      .replace(/\\]/g, '\\\\]')\n      .replace(/\\^/g, '\\\\^')\n      .replace(/-/g,  '\\\\-')\n      .replace(/\\0/g, '\\\\0')\n      .replace(/\\t/g, '\\\\t')\n      .replace(/\\n/g, '\\\\n')\n      .replace(/\\r/g, '\\\\r')\n      .replace(/[\\x00-\\x0F]/g,          function(ch) { return '\\\\x0' + hex(ch); })\n      .replace(/[\\x10-\\x1F\\x7F-\\x9F]/g, function(ch) { return '\\\\x'  + hex(ch); });\n  }\n\n  function describeExpectation(expectation) {\n    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);\n  }\n\n  function describeExpected(expected) {\n    var descriptions = new Array(expected.length),\n        i, j;\n\n    for (i = 0; i < expected.length; i++) {\n      descriptions[i] = describeExpectation(expected[i]);\n    }\n\n    descriptions.sort();\n\n    if (descriptions.length > 0) {\n      for (i = 1, j = 1; i < descriptions.length; i++) {\n        if (descriptions[i - 1] !== descriptions[i]) {\n          descriptions[j] = descriptions[i];\n          j++;\n        }\n      }\n      descriptions.length = j;\n    }\n\n    switch (descriptions.length) {\n      case 1:\n        return descriptions[0];\n\n      case 2:\n        return descriptions[0] + \" or \" + descriptions[1];\n\n      default:\n        return descriptions.slice(0, -1).join(\", \")\n          + \", or \"\n          + descriptions[descriptions.length - 1];\n    }\n  }\n\n  function describeFound(found) {\n    return found ? \"\\\"\" + literalEscape(found) + \"\\\"\" : \"end of input\";\n  }\n\n  return \"Expected \" + describeExpected(expected) + \" but \" + describeFound(found) + \" found.\";\n};\n\nfunction peg$parse(input, options) {\n  options = options !== void 0 ? options : {};\n\n  var peg$FAILED = {},\n\n      peg$startRuleFunctions = { svg_path: peg$parsesvg_path },\n      peg$startRuleFunction  = peg$parsesvg_path,\n\n      peg$c0 = function(data) {\n          if (!data) return [];\n          for (var cmds=[],i=0;i<data.length;i++) cmds=cmds.concat.apply(cmds,data[i]);\n          var first=cmds[0];\n          if (first && first.code=='m'){ // Per spec, first moveto is never relative\n            delete first.relative;\n            first.code = 'M';\n          }\n          return cmds;\n        },\n      peg$c1 = function(first, more) { return merge(first,more) },\n      peg$c2 = /^[Mm]/,\n      peg$c3 = peg$classExpectation([\"M\", \"m\"], false, false),\n      peg$c4 = function(c, first, more) {\n          var move = commands(c,[first]);\n          if (more) move = move.concat(commands(c=='M' ? 'L' : 'l',more[1]));\n          return move;\n        },\n      peg$c5 = /^[Zz]/,\n      peg$c6 = peg$classExpectation([\"Z\", \"z\"], false, false),\n      peg$c7 = function() { return commands('Z') },\n      peg$c8 = /^[Ll]/,\n      peg$c9 = peg$classExpectation([\"L\", \"l\"], false, false),\n      peg$c10 = function(c, args) { return commands(c,args) },\n      peg$c11 = /^[Hh]/,\n      peg$c12 = peg$classExpectation([\"H\", \"h\"], false, false),\n      peg$c13 = function(c, args) { return commands(c,args.map(function(x){ return {x:x}})) },\n      peg$c14 = /^[Vv]/,\n      peg$c15 = peg$classExpectation([\"V\", \"v\"], false, false),\n      peg$c16 = function(c, args) { return commands(c,args.map(function(y){ return {y:y}})) },\n      peg$c17 = /^[Cc]/,\n      peg$c18 = peg$classExpectation([\"C\", \"c\"], false, false),\n      peg$c19 = function(a, b, c) { return { x1:a.x, y1:a.y, x2:b.x, y2:b.y, x:c.x, y:c.y } },\n      peg$c20 = /^[Ss]/,\n      peg$c21 = peg$classExpectation([\"S\", \"s\"], false, false),\n      peg$c22 = function(b, c) { return { x2:b.x, y2:b.y, x:c.x, y:c.y } },\n      peg$c23 = /^[Qq]/,\n      peg$c24 = peg$classExpectation([\"Q\", \"q\"], false, false),\n      peg$c25 = function(a, b) { return { x1:a.x, y1:a.y, x:b.x, y:b.y } },\n      peg$c26 = /^[Tt]/,\n      peg$c27 = peg$classExpectation([\"T\", \"t\"], false, false),\n      peg$c28 = /^[Aa]/,\n      peg$c29 = peg$classExpectation([\"A\", \"a\"], false, false),\n      peg$c30 = function(rx, ry, xrot, large, sweep, xy) { return { rx:rx, ry:ry, xAxisRotation:xrot, largeArc:large, sweep:sweep, x:xy.x, y:xy.y } },\n      peg$c31 = function(x, y) { return { x:x, y:y } },\n      peg$c32 = function(n) { return n*1 },\n      peg$c33 = function(parts) { return parts.join('')*1 },\n      peg$c34 = /^[01]/,\n      peg$c35 = peg$classExpectation([\"0\", \"1\"], false, false),\n      peg$c36 = function(bit) { return bit=='1' },\n      peg$c37 = function() { return '' },\n      peg$c38 = \",\",\n      peg$c39 = peg$literalExpectation(\",\", false),\n      peg$c40 = function(parts) { return parts.join('') },\n      peg$c41 = \".\",\n      peg$c42 = peg$literalExpectation(\".\", false),\n      peg$c43 = /^[eE]/,\n      peg$c44 = peg$classExpectation([\"e\", \"E\"], false, false),\n      peg$c45 = /^[+\\-]/,\n      peg$c46 = peg$classExpectation([\"+\", \"-\"], false, false),\n      peg$c47 = /^[0-9]/,\n      peg$c48 = peg$classExpectation([[\"0\", \"9\"]], false, false),\n      peg$c49 = function(digits) { return digits.join('') },\n      peg$c50 = /^[ \\t\\n\\r]/,\n      peg$c51 = peg$classExpectation([\" \", \"\\t\", \"\\n\", \"\\r\"], false, false),\n\n      peg$currPos          = 0,\n      peg$savedPos         = 0,\n      peg$posDetailsCache  = [{ line: 1, column: 1 }],\n      peg$maxFailPos       = 0,\n      peg$maxFailExpected  = [],\n      peg$silentFails      = 0,\n\n      peg$result;\n\n  if (\"startRule\" in options) {\n    if (!(options.startRule in peg$startRuleFunctions)) {\n      throw new Error(\"Can't start parsing from rule \\\"\" + options.startRule + \"\\\".\");\n    }\n\n    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];\n  }\n\n  function text() {\n    return input.substring(peg$savedPos, peg$currPos);\n  }\n\n  function location() {\n    return peg$computeLocation(peg$savedPos, peg$currPos);\n  }\n\n  function expected(description, location) {\n    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n    throw peg$buildStructuredError(\n      [peg$otherExpectation(description)],\n      input.substring(peg$savedPos, peg$currPos),\n      location\n    );\n  }\n\n  function error(message, location) {\n    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)\n\n    throw peg$buildSimpleError(message, location);\n  }\n\n  function peg$literalExpectation(text, ignoreCase) {\n    return { type: \"literal\", text: text, ignoreCase: ignoreCase };\n  }\n\n  function peg$classExpectation(parts, inverted, ignoreCase) {\n    return { type: \"class\", parts: parts, inverted: inverted, ignoreCase: ignoreCase };\n  }\n\n  function peg$anyExpectation() {\n    return { type: \"any\" };\n  }\n\n  function peg$endExpectation() {\n    return { type: \"end\" };\n  }\n\n  function peg$otherExpectation(description) {\n    return { type: \"other\", description: description };\n  }\n\n  function peg$computePosDetails(pos) {\n    var details = peg$posDetailsCache[pos], p;\n\n    if (details) {\n      return details;\n    } else {\n      p = pos - 1;\n      while (!peg$posDetailsCache[p]) {\n        p--;\n      }\n\n      details = peg$posDetailsCache[p];\n      details = {\n        line:   details.line,\n        column: details.column\n      };\n\n      while (p < pos) {\n        if (input.charCodeAt(p) === 10) {\n          details.line++;\n          details.column = 1;\n        } else {\n          details.column++;\n        }\n\n        p++;\n      }\n\n      peg$posDetailsCache[pos] = details;\n      return details;\n    }\n  }\n\n  function peg$computeLocation(startPos, endPos) {\n    var startPosDetails = peg$computePosDetails(startPos),\n        endPosDetails   = peg$computePosDetails(endPos);\n\n    return {\n      start: {\n        offset: startPos,\n        line:   startPosDetails.line,\n        column: startPosDetails.column\n      },\n      end: {\n        offset: endPos,\n        line:   endPosDetails.line,\n        column: endPosDetails.column\n      }\n    };\n  }\n\n  function peg$fail(expected) {\n    if (peg$currPos < peg$maxFailPos) { return; }\n\n    if (peg$currPos > peg$maxFailPos) {\n      peg$maxFailPos = peg$currPos;\n      peg$maxFailExpected = [];\n    }\n\n    peg$maxFailExpected.push(expected);\n  }\n\n  function peg$buildSimpleError(message, location) {\n    return new peg$SyntaxError(message, null, null, location);\n  }\n\n  function peg$buildStructuredError(expected, found, location) {\n    return new peg$SyntaxError(\n      peg$SyntaxError.buildMessage(expected, found),\n      expected,\n      found,\n      location\n    );\n  }\n\n  function peg$parsesvg_path() {\n    var s0, s1, s2, s3, s4;\n\n    s0 = peg$currPos;\n    s1 = [];\n    s2 = peg$parsewsp();\n    while (s2 !== peg$FAILED) {\n      s1.push(s2);\n      s2 = peg$parsewsp();\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsemoveTo_drawTo_commandGroups();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = [];\n        s4 = peg$parsewsp();\n        while (s4 !== peg$FAILED) {\n          s3.push(s4);\n          s4 = peg$parsewsp();\n        }\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c0(s2);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsemoveTo_drawTo_commandGroups() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsemoveTo_drawTo_commandGroup();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = [];\n      s5 = peg$parsewsp();\n      while (s5 !== peg$FAILED) {\n        s4.push(s5);\n        s5 = peg$parsewsp();\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsemoveTo_drawTo_commandGroup();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = [];\n        s5 = peg$parsewsp();\n        while (s5 !== peg$FAILED) {\n          s4.push(s5);\n          s5 = peg$parsewsp();\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsemoveTo_drawTo_commandGroup();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsemoveTo_drawTo_commandGroup() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsemoveto();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = [];\n      s5 = peg$parsewsp();\n      while (s5 !== peg$FAILED) {\n        s4.push(s5);\n        s5 = peg$parsewsp();\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsedrawto_command();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = [];\n        s5 = peg$parsewsp();\n        while (s5 !== peg$FAILED) {\n          s4.push(s5);\n          s5 = peg$parsewsp();\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsedrawto_command();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsedrawto_command() {\n    var s0;\n\n    s0 = peg$parseclosepath();\n    if (s0 === peg$FAILED) {\n      s0 = peg$parselineto();\n      if (s0 === peg$FAILED) {\n        s0 = peg$parsehorizontal_lineto();\n        if (s0 === peg$FAILED) {\n          s0 = peg$parsevertical_lineto();\n          if (s0 === peg$FAILED) {\n            s0 = peg$parsecurveto();\n            if (s0 === peg$FAILED) {\n              s0 = peg$parsesmooth_curveto();\n              if (s0 === peg$FAILED) {\n                s0 = peg$parsequadratic_bezier_curveto();\n                if (s0 === peg$FAILED) {\n                  s0 = peg$parsesmooth_quadratic_bezier_curveto();\n                  if (s0 === peg$FAILED) {\n                    s0 = peg$parseelliptical_arc();\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n\n    return s0;\n  }\n\n  function peg$parsemoveto() {\n    var s0, s1, s2, s3, s4, s5, s6;\n\n    s0 = peg$currPos;\n    if (peg$c2.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c3); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_pair();\n        if (s3 !== peg$FAILED) {\n          s4 = peg$currPos;\n          s5 = peg$parsecomma_wsp();\n          if (s5 === peg$FAILED) {\n            s5 = null;\n          }\n          if (s5 !== peg$FAILED) {\n            s6 = peg$parselineto_argument_sequence();\n            if (s6 !== peg$FAILED) {\n              s5 = [s5, s6];\n              s4 = s5;\n            } else {\n              peg$currPos = s4;\n              s4 = peg$FAILED;\n            }\n          } else {\n            peg$currPos = s4;\n            s4 = peg$FAILED;\n          }\n          if (s4 === peg$FAILED) {\n            s4 = null;\n          }\n          if (s4 !== peg$FAILED) {\n            peg$savedPos = s0;\n            s1 = peg$c4(s1, s3, s4);\n            s0 = s1;\n          } else {\n            peg$currPos = s0;\n            s0 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parseclosepath() {\n    var s0, s1;\n\n    s0 = peg$currPos;\n    if (peg$c5.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c6); }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c7();\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parselineto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c8.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c9); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parselineto_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parselineto_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecoordinate_pair();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsecoordinate_pair();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsecoordinate_pair();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsehorizontal_lineto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c11.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c12); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c13(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecoordinate_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsenumber();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsenumber();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsenumber();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsevertical_lineto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c14.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c15); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c16(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecurveto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c17.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c18); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecurveto_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecurveto_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecurveto_argument();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsecurveto_argument();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsecurveto_argument();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecurveto_argument() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecoordinate_pair();\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma_wsp();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_pair();\n        if (s3 !== peg$FAILED) {\n          s4 = peg$parsecomma_wsp();\n          if (s4 === peg$FAILED) {\n            s4 = null;\n          }\n          if (s4 !== peg$FAILED) {\n            s5 = peg$parsecoordinate_pair();\n            if (s5 !== peg$FAILED) {\n              peg$savedPos = s0;\n              s1 = peg$c19(s1, s3, s5);\n              s0 = s1;\n            } else {\n              peg$currPos = s0;\n              s0 = peg$FAILED;\n            }\n          } else {\n            peg$currPos = s0;\n            s0 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsesmooth_curveto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c20.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c21); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsesmooth_curveto_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsesmooth_curveto_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsesmooth_curveto_argument();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsesmooth_curveto_argument();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsesmooth_curveto_argument();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsesmooth_curveto_argument() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecoordinate_pair();\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma_wsp();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_pair();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c22(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsequadratic_bezier_curveto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c23.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c24); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsequadratic_bezier_curveto_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsequadratic_bezier_curveto_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsequadratic_bezier_curveto_argument();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsequadratic_bezier_curveto_argument();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsequadratic_bezier_curveto_argument();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsequadratic_bezier_curveto_argument() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecoordinate_pair();\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma_wsp();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsecoordinate_pair();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c25(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsesmooth_quadratic_bezier_curveto() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c26.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c27); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsesmooth_quadratic_bezier_curveto_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsesmooth_quadratic_bezier_curveto_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parsecoordinate_pair();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parsecoordinate_pair();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parsecoordinate_pair();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parseelliptical_arc() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    if (peg$c28.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c29); }\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$parsewsp();\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$parsewsp();\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parseelliptical_arc_argument_sequence();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c10(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parseelliptical_arc_argument_sequence() {\n    var s0, s1, s2, s3, s4, s5;\n\n    s0 = peg$currPos;\n    s1 = peg$parseelliptical_arc_argument();\n    if (s1 !== peg$FAILED) {\n      s2 = [];\n      s3 = peg$currPos;\n      s4 = peg$parsecomma_wsp();\n      if (s4 === peg$FAILED) {\n        s4 = null;\n      }\n      if (s4 !== peg$FAILED) {\n        s5 = peg$parseelliptical_arc_argument();\n        if (s5 !== peg$FAILED) {\n          s4 = [s4, s5];\n          s3 = s4;\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s3;\n        s3 = peg$FAILED;\n      }\n      while (s3 !== peg$FAILED) {\n        s2.push(s3);\n        s3 = peg$currPos;\n        s4 = peg$parsecomma_wsp();\n        if (s4 === peg$FAILED) {\n          s4 = null;\n        }\n        if (s4 !== peg$FAILED) {\n          s5 = peg$parseelliptical_arc_argument();\n          if (s5 !== peg$FAILED) {\n            s4 = [s4, s5];\n            s3 = s4;\n          } else {\n            peg$currPos = s3;\n            s3 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s3;\n          s3 = peg$FAILED;\n        }\n      }\n      if (s2 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c1(s1, s2);\n        s0 = s1;\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parseelliptical_arc_argument() {\n    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;\n\n    s0 = peg$currPos;\n    s1 = peg$parsenonnegative_number();\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma_wsp();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsenonnegative_number();\n        if (s3 !== peg$FAILED) {\n          s4 = peg$parsecomma_wsp();\n          if (s4 === peg$FAILED) {\n            s4 = null;\n          }\n          if (s4 !== peg$FAILED) {\n            s5 = peg$parsenumber();\n            if (s5 !== peg$FAILED) {\n              s6 = peg$parsecomma_wsp();\n              if (s6 !== peg$FAILED) {\n                s7 = peg$parseflag();\n                if (s7 !== peg$FAILED) {\n                  s8 = peg$parsecomma_wsp();\n                  if (s8 === peg$FAILED) {\n                    s8 = null;\n                  }\n                  if (s8 !== peg$FAILED) {\n                    s9 = peg$parseflag();\n                    if (s9 !== peg$FAILED) {\n                      s10 = peg$parsecomma_wsp();\n                      if (s10 === peg$FAILED) {\n                        s10 = null;\n                      }\n                      if (s10 !== peg$FAILED) {\n                        s11 = peg$parsecoordinate_pair();\n                        if (s11 !== peg$FAILED) {\n                          peg$savedPos = s0;\n                          s1 = peg$c30(s1, s3, s5, s7, s9, s11);\n                          s0 = s1;\n                        } else {\n                          peg$currPos = s0;\n                          s0 = peg$FAILED;\n                        }\n                      } else {\n                        peg$currPos = s0;\n                        s0 = peg$FAILED;\n                      }\n                    } else {\n                      peg$currPos = s0;\n                      s0 = peg$FAILED;\n                    }\n                  } else {\n                    peg$currPos = s0;\n                    s0 = peg$FAILED;\n                  }\n                } else {\n                  peg$currPos = s0;\n                  s0 = peg$FAILED;\n                }\n              } else {\n                peg$currPos = s0;\n                s0 = peg$FAILED;\n              }\n            } else {\n              peg$currPos = s0;\n              s0 = peg$FAILED;\n            }\n          } else {\n            peg$currPos = s0;\n            s0 = peg$FAILED;\n          }\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecoordinate_pair() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    s1 = peg$parsenumber();\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma_wsp();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsenumber();\n        if (s3 !== peg$FAILED) {\n          peg$savedPos = s0;\n          s1 = peg$c31(s1, s3);\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n\n    return s0;\n  }\n\n  function peg$parsenonnegative_number() {\n    var s0, s1;\n\n    s0 = peg$currPos;\n    s1 = peg$parsefloating_point_constant();\n    if (s1 === peg$FAILED) {\n      s1 = peg$parsedigit_sequence();\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c32(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parsenumber() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    s1 = peg$currPos;\n    s2 = peg$parsesign();\n    if (s2 === peg$FAILED) {\n      s2 = null;\n    }\n    if (s2 !== peg$FAILED) {\n      s3 = peg$parsefloating_point_constant();\n      if (s3 !== peg$FAILED) {\n        s2 = [s2, s3];\n        s1 = s2;\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s1;\n      s1 = peg$FAILED;\n    }\n    if (s1 === peg$FAILED) {\n      s1 = peg$currPos;\n      s2 = peg$parsesign();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parsedigit_sequence();\n        if (s3 !== peg$FAILED) {\n          s2 = [s2, s3];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c33(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parseflag() {\n    var s0, s1;\n\n    s0 = peg$currPos;\n    if (peg$c34.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c35); }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c36(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parsecomma_wsp() {\n    var s0, s1, s2, s3, s4;\n\n    s0 = peg$currPos;\n    s1 = [];\n    s2 = peg$parsewsp();\n    if (s2 !== peg$FAILED) {\n      while (s2 !== peg$FAILED) {\n        s1.push(s2);\n        s2 = peg$parsewsp();\n      }\n    } else {\n      s1 = peg$FAILED;\n    }\n    if (s1 !== peg$FAILED) {\n      s2 = peg$parsecomma();\n      if (s2 === peg$FAILED) {\n        s2 = null;\n      }\n      if (s2 !== peg$FAILED) {\n        s3 = [];\n        s4 = peg$parsewsp();\n        while (s4 !== peg$FAILED) {\n          s3.push(s4);\n          s4 = peg$parsewsp();\n        }\n        if (s3 !== peg$FAILED) {\n          s1 = [s1, s2, s3];\n          s0 = s1;\n        } else {\n          peg$currPos = s0;\n          s0 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s0;\n        s0 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s0;\n      s0 = peg$FAILED;\n    }\n    if (s0 === peg$FAILED) {\n      s0 = peg$currPos;\n      s1 = peg$currPos;\n      s2 = peg$parsecomma();\n      if (s2 !== peg$FAILED) {\n        s3 = [];\n        s4 = peg$parsewsp();\n        while (s4 !== peg$FAILED) {\n          s3.push(s4);\n          s4 = peg$parsewsp();\n        }\n        if (s3 !== peg$FAILED) {\n          s2 = [s2, s3];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n      if (s1 !== peg$FAILED) {\n        peg$savedPos = s0;\n        s1 = peg$c37();\n      }\n      s0 = s1;\n    }\n\n    return s0;\n  }\n\n  function peg$parsecomma() {\n    var s0;\n\n    if (input.charCodeAt(peg$currPos) === 44) {\n      s0 = peg$c38;\n      peg$currPos++;\n    } else {\n      s0 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c39); }\n    }\n\n    return s0;\n  }\n\n  function peg$parsefloating_point_constant() {\n    var s0, s1, s2, s3;\n\n    s0 = peg$currPos;\n    s1 = peg$currPos;\n    s2 = peg$parsefractional_constant();\n    if (s2 !== peg$FAILED) {\n      s3 = peg$parseexponent();\n      if (s3 === peg$FAILED) {\n        s3 = null;\n      }\n      if (s3 !== peg$FAILED) {\n        s2 = [s2, s3];\n        s1 = s2;\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s1;\n      s1 = peg$FAILED;\n    }\n    if (s1 === peg$FAILED) {\n      s1 = peg$currPos;\n      s2 = peg$parsedigit_sequence();\n      if (s2 !== peg$FAILED) {\n        s3 = peg$parseexponent();\n        if (s3 !== peg$FAILED) {\n          s2 = [s2, s3];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c40(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parsefractional_constant() {\n    var s0, s1, s2, s3, s4;\n\n    s0 = peg$currPos;\n    s1 = peg$currPos;\n    s2 = peg$parsedigit_sequence();\n    if (s2 === peg$FAILED) {\n      s2 = null;\n    }\n    if (s2 !== peg$FAILED) {\n      if (input.charCodeAt(peg$currPos) === 46) {\n        s3 = peg$c41;\n        peg$currPos++;\n      } else {\n        s3 = peg$FAILED;\n        if (peg$silentFails === 0) { peg$fail(peg$c42); }\n      }\n      if (s3 !== peg$FAILED) {\n        s4 = peg$parsedigit_sequence();\n        if (s4 !== peg$FAILED) {\n          s2 = [s2, s3, s4];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s1;\n      s1 = peg$FAILED;\n    }\n    if (s1 === peg$FAILED) {\n      s1 = peg$currPos;\n      s2 = peg$parsedigit_sequence();\n      if (s2 !== peg$FAILED) {\n        if (input.charCodeAt(peg$currPos) === 46) {\n          s3 = peg$c41;\n          peg$currPos++;\n        } else {\n          s3 = peg$FAILED;\n          if (peg$silentFails === 0) { peg$fail(peg$c42); }\n        }\n        if (s3 !== peg$FAILED) {\n          s2 = [s2, s3];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c40(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parseexponent() {\n    var s0, s1, s2, s3, s4;\n\n    s0 = peg$currPos;\n    s1 = peg$currPos;\n    if (peg$c43.test(input.charAt(peg$currPos))) {\n      s2 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s2 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c44); }\n    }\n    if (s2 !== peg$FAILED) {\n      s3 = peg$parsesign();\n      if (s3 === peg$FAILED) {\n        s3 = null;\n      }\n      if (s3 !== peg$FAILED) {\n        s4 = peg$parsedigit_sequence();\n        if (s4 !== peg$FAILED) {\n          s2 = [s2, s3, s4];\n          s1 = s2;\n        } else {\n          peg$currPos = s1;\n          s1 = peg$FAILED;\n        }\n      } else {\n        peg$currPos = s1;\n        s1 = peg$FAILED;\n      }\n    } else {\n      peg$currPos = s1;\n      s1 = peg$FAILED;\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c40(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parsesign() {\n    var s0;\n\n    if (peg$c45.test(input.charAt(peg$currPos))) {\n      s0 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s0 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c46); }\n    }\n\n    return s0;\n  }\n\n  function peg$parsedigit_sequence() {\n    var s0, s1, s2;\n\n    s0 = peg$currPos;\n    s1 = [];\n    if (peg$c47.test(input.charAt(peg$currPos))) {\n      s2 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s2 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c48); }\n    }\n    if (s2 !== peg$FAILED) {\n      while (s2 !== peg$FAILED) {\n        s1.push(s2);\n        if (peg$c47.test(input.charAt(peg$currPos))) {\n          s2 = input.charAt(peg$currPos);\n          peg$currPos++;\n        } else {\n          s2 = peg$FAILED;\n          if (peg$silentFails === 0) { peg$fail(peg$c48); }\n        }\n      }\n    } else {\n      s1 = peg$FAILED;\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c49(s1);\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n  function peg$parsewsp() {\n    var s0, s1;\n\n    s0 = peg$currPos;\n    if (peg$c50.test(input.charAt(peg$currPos))) {\n      s1 = input.charAt(peg$currPos);\n      peg$currPos++;\n    } else {\n      s1 = peg$FAILED;\n      if (peg$silentFails === 0) { peg$fail(peg$c51); }\n    }\n    if (s1 !== peg$FAILED) {\n      peg$savedPos = s0;\n      s1 = peg$c37();\n    }\n    s0 = s1;\n\n    return s0;\n  }\n\n\n    function merge(first,more){\n      if (!more) return [first];\n      for (var a=[first],i=0,l=more.length;i<l;i++) a[i+1]=more[i][1];\n      return a;\n    }\n\n    var cmds = {m:'moveto',l:'lineto',h:'horizontal lineto',v:'vertical lineto',c:'curveto',s:'smooth curveto',q:'quadratic curveto',t:'smooth quadratic curveto',a:'elliptical arc',z:'closepath'};\n    for (var code in cmds) cmds[code.toUpperCase()]=cmds[code];\n    function commands(code,args){\n      if (!args) args=[{}];\n      for (var i=args.length;i--;){\n        var cmd={code:code,command:cmds[code]};\n        if (code==code.toLowerCase()) cmd.relative=true;\n        for (var k in args[i]) cmd[k]=args[i][k];\n        args[i] = cmd;\n      }\n      return args;\n    }\n\n\n  peg$result = peg$startRuleFunction();\n\n  if (peg$result !== peg$FAILED && peg$currPos === input.length) {\n    return peg$result;\n  } else {\n    if (peg$result !== peg$FAILED && peg$currPos < input.length) {\n      peg$fail(peg$endExpectation());\n    }\n\n    throw peg$buildStructuredError(\n      peg$maxFailExpected,\n      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,\n      peg$maxFailPos < input.length\n        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)\n        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)\n    );\n  }\n}\n\nmodule.exports = {\n  SyntaxError: peg$SyntaxError,\n  parse:       peg$parse\n};\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./~/svg-path-parser/parser.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///./~/svg-path-parser/parser.js?");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

eval("// shim for using process in browser\nvar process = module.exports = {};\n\n// cached from whatever global is present so that test runners that stub it\n// don't break things.  But we need to wrap it in a try catch in case it is\n// wrapped in strict mode code which doesn't define any globals.  It's inside a\n// function because try/catches deoptimize in certain engines.\n\nvar cachedSetTimeout;\nvar cachedClearTimeout;\n\nfunction defaultSetTimout() {\n    throw new Error('setTimeout has not been defined');\n}\nfunction defaultClearTimeout () {\n    throw new Error('clearTimeout has not been defined');\n}\n(function () {\n    try {\n        if (typeof setTimeout === 'function') {\n            cachedSetTimeout = setTimeout;\n        } else {\n            cachedSetTimeout = defaultSetTimout;\n        }\n    } catch (e) {\n        cachedSetTimeout = defaultSetTimout;\n    }\n    try {\n        if (typeof clearTimeout === 'function') {\n            cachedClearTimeout = clearTimeout;\n        } else {\n            cachedClearTimeout = defaultClearTimeout;\n        }\n    } catch (e) {\n        cachedClearTimeout = defaultClearTimeout;\n    }\n} ())\nfunction runTimeout(fun) {\n    if (cachedSetTimeout === setTimeout) {\n        //normal enviroments in sane situations\n        return setTimeout(fun, 0);\n    }\n    // if setTimeout wasn't available but was latter defined\n    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {\n        cachedSetTimeout = setTimeout;\n        return setTimeout(fun, 0);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedSetTimeout(fun, 0);\n    } catch(e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally\n            return cachedSetTimeout.call(null, fun, 0);\n        } catch(e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error\n            return cachedSetTimeout.call(this, fun, 0);\n        }\n    }\n\n\n}\nfunction runClearTimeout(marker) {\n    if (cachedClearTimeout === clearTimeout) {\n        //normal enviroments in sane situations\n        return clearTimeout(marker);\n    }\n    // if clearTimeout wasn't available but was latter defined\n    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {\n        cachedClearTimeout = clearTimeout;\n        return clearTimeout(marker);\n    }\n    try {\n        // when when somebody has screwed with setTimeout but no I.E. maddness\n        return cachedClearTimeout(marker);\n    } catch (e){\n        try {\n            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally\n            return cachedClearTimeout.call(null, marker);\n        } catch (e){\n            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.\n            // Some versions of I.E. have different rules for clearTimeout vs setTimeout\n            return cachedClearTimeout.call(this, marker);\n        }\n    }\n\n\n\n}\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    if (!draining || !currentQueue) {\n        return;\n    }\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = runTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            if (currentQueue) {\n                currentQueue[queueIndex].run();\n            }\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    runClearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        runTimeout(drainQueue);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\nprocess.prependListener = noop;\nprocess.prependOnceListener = noop;\n\nprocess.listeners = function (name) { return [] }\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n//////////////////\n// WEBPACK FOOTER\n// (webpack)/~/process/browser.js\n// module id = 4\n// module chunks = 0\n\n//# sourceURL=webpack:///(webpack)/~/process/browser.js?");

/***/ })
/******/ ]);
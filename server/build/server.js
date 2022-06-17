/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 927:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const utils_1 = __webpack_require__(593);
const store_1 = __webpack_require__(923);
class AttributeController {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.store = new store_1.Store("db.json");
            this.db = yield this.store.read();
        });
    }
    getAbbreviatureList() {
        return this.db.abbreviatures;
    }
    getAttributeList() {
        return this.db.attributes;
    }
    addAbbreviature(abbrev) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // check if already exists
            const exists = this.db.abbreviatures.find((e) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase());
            if (exists) {
                return new utils_1.Result(400, `La abreviatura ${abbrev.abbreviature} ya existe.`);
            }
            this.db.abbIdentity = this.db.abbIdentity + 1;
            this.db.abbreviatures.unshift({
                id: this.db.abbIdentity,
                name: abbrev.name,
                abbreviature: abbrev.abbreviature.replace(/\b\w/g, (c) => c.toUpperCase()),
                description: (_a = abbrev.description) !== null && _a !== void 0 ? _a : abbrev.name,
            });
            this.updateAttributes();
            yield this.store.write(this.db);
            return new utils_1.Result(200);
        });
    }
    editAbbreviature(abbrev) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = this.db.abbreviatures.find((e) => e.abbreviature.toUpperCase() == abbrev.abbreviature.toUpperCase() && e.id != abbrev.id);
            if (exists) {
                return new utils_1.Result(400, `La abreviatura ${abbrev.abbreviature} ya existe.`);
            }
            const currentAbbrev = this.db.abbreviatures.find((e) => e.id == abbrev.id);
            if (currentAbbrev) {
                currentAbbrev.name = abbrev.name;
                currentAbbrev.abbreviature = abbrev.abbreviature.replace(/\b\w/g, (c) => c.toUpperCase());
                currentAbbrev.description = abbrev.description;
            }
            this.updateAttributes();
            yield this.store.write(this.db);
            return new utils_1.Result(200);
        });
    }
    deleteAbbreviature(abbrevId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.abbreviatures = this.db.abbreviatures.filter((e) => e.id != abbrevId);
            this.updateAttributes();
            yield this.store.write(this.db);
            return new utils_1.Result(200);
        });
    }
    addAttribute(attr) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // validate
            const attrResult = this.calculate(attr.description);
            if (attrResult.status === 200) {
                const exists = this.db.attributes.find((e) => e.attribute.toUpperCase() == attrResult.attribute.toUpperCase() && e.id != attr.id);
                if (exists) {
                    return new utils_1.Result(400, `El atributo ${attr.attribute} (${exists.name}) ya existe.`);
                }
                this.db.attrIdentity = this.db.attrIdentity + 1;
                this.db.attributes.unshift({
                    id: this.db.attrIdentity,
                    name: (_a = attrResult.parts) === null || _a === void 0 ? void 0 : _a.filter((part) => part.wordType != 'StopWord').map((part) => part.original).join(' '),
                    attribute: attrResult.attribute,
                    description: attr.description,
                });
                yield this.store.write(this.db);
                return new utils_1.Result(200);
            }
            return new utils_1.Result(400, attrResult.errors.join("\n"));
        });
    }
    editAttribute(attr) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentAttr = this.db.attributes.find((e) => e.id == attr.id);
            const attrResult = this.calculate(attr.name);
            if (attrResult.status === 200) {
                if (currentAttr) {
                    const exists = this.db.attributes.find((e) => e.attribute.toUpperCase() == attrResult.attribute.toUpperCase() && e.id != attr.id);
                    if (exists) {
                        return new utils_1.Result(400, `El atributo ${attr.attribute} (${exists.name}) ya existe.`);
                    }
                    currentAttr.name = (_a = attrResult.parts) === null || _a === void 0 ? void 0 : _a.filter((part) => part.wordType != 'StopWord').map((part) => part.original).join(' ');
                    currentAttr.attribute = attr.attribute;
                    currentAttr.description = attr.description;
                }
                yield this.store.write(this.db);
                return new utils_1.Result(200);
            }
            return new utils_1.Result(400, attrResult.errors.join("\n"));
        });
    }
    deleteAttribute(attrId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.db.attributes = this.db.attributes.filter((e) => e.id != attrId);
            yield this.store.write(this.db);
            return new utils_1.Result(200);
        });
    }
    updateAttributes() {
        const attributes = this.db.attributes;
        attributes.forEach((attr) => {
            const attrResult = this.calculate(attr.name);
            if (attrResult.status == 200) {
                attr.attribute = attrResult.attribute;
            }
        });
    }
    calculate(raw) {
        var _a;
        const abbrevsLowerCase = this.db.abbreviatures.map((e) => e.abbreviature.toLocaleLowerCase());
        const [result, words] = this.validateInputWords(raw);
        const parts = [];
        if (result.status === 200) {
            let conceptType;
            // check stop words
            words.forEach((word) => {
                // stop word
                if (stopWords.includes(word.toLocaleLowerCase())) {
                    parts.push({
                        current: "",
                        original: word,
                        wordType: "StopWord",
                    });
                }
                // abbreviation
                else if (abbrevsLowerCase.includes(word.toLocaleLowerCase())) {
                    const abb = this.db.abbreviatures.find((e) => {
                        if (e.name.toLocaleLowerCase() === word.toLocaleLowerCase()) {
                            return e;
                        }
                        return false;
                    });
                    if (abb) {
                        parts.push({
                            current: abb.abbreviature,
                            original: word,
                            wordType: "Abbreviation",
                        });
                    }
                    else
                        throw new Error("Cannot find abbrev");
                }
                // default
                else {
                    parts.push({
                        current: word,
                        original: word,
                        wordType: "Default",
                    });
                }
            });
            // apply rules
            const defaultWords = parts.filter((part) => part.wordType === 'Default');
            // Cuando el concepto tiene una palabra y termina en ese, poner las 4 primeras letras de la palabra y agregar ese al final.
            if (defaultWords.length === 1 && defaultWords[0].current[defaultWords[0].current.length - 1] === 's') {
                defaultWords[0].current = defaultWords[0].current.slice(0, 4) + 's';
                conceptType = 'OneWordEndS';
            }
            // Cuando el concepto tiene 2 palabras que terminan en ese, poner las 4 primeras letras de la primera palabra, las 4 primeras letras de la segunda y agregar ese al final.
            else if (defaultWords.length === 2 && defaultWords[1].current[defaultWords[1].current.length - 1] === 's') {
                defaultWords[0].current = defaultWords[0].current.slice(0, 4);
                defaultWords[1].current = defaultWords[1].current.slice(0, 4) + 's';
                conceptType = 'TwoWordsEndS';
            }
            // Cuando el concepto tiene 2 palabras se utiliza el truncamiento con las primeras 4 letras por palabra
            else if (defaultWords.length === 2) {
                defaultWords[0].current = defaultWords[0].current.slice(0, 4);
                defaultWords[1].current = defaultWords[1].current.slice(0, 4);
                conceptType = 'OneOrTwoWords';
            }
            // Cuando el concepto tiene 1 palabra se utiliza el truncamiento con las primeras 4 letras por palabra
            else if (defaultWords.length === 1) {
                defaultWords[0].current = defaultWords[0].current.slice(0, 4);
                conceptType = 'OneOrTwoWords';
            }
            // Cuando el concepto tiene 3 palabras hasta 10, utilizar el criterio de truncamiento para las fórmulas fijas, esto es, se toma la inicial de cada palabra.
            else {
                defaultWords.forEach((part) => part.current = part.current.slice(0, 1));
                conceptType = 'ThreeOrMoreWords';
            }
            // set current to starting in capital letter
            defaultWords.forEach((part) => part.current = part.current.replace(/\b\w/g, (c) => c.toUpperCase()));
            let attribute = parts.map((part) => part.current.trim().replace(/\b\w/g, (c) => c.toUpperCase())).join('');
            return { status: 200, parts, attribute, conceptType };
        }
        return { status: 400, errors: [(_a = result === null || result === void 0 ? void 0 : result.description) !== null && _a !== void 0 ? _a : ""] };
    }
    validateInputWords(raw) {
        const words = raw
            .split(" ")
            // remove spaces
            .map((e) => e
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""))
            // filter 0 length
            .filter((e) => e.length > 0);
        if (words.length > 10) {
            return [{ status: 400, description: "No se puede ingresar mas de 10 palabras." }];
        }
        return [{ status: 200 }, words];
    }
}
const stopWords = [
    "a",
    "aca",
    "ahi",
    "al",
    "algo",
    "algun",
    "alguna",
    "alguno",
    "algunos",
    "alla",
    "alli",
    "ambos",
    "ante",
    "antes",
    "aquel",
    "aquella",
    "aquello",
    "aquellos",
    "aqui",
    "arriba",
    "asi",
    "atras",
    "aun",
    "aunque",
    "bien",
    "cada",
    "casi",
    "como",
    "con",
    "cual",
    "cuales",
    "cualquier",
    "cualquiera",
    "cualquieras",
    "cuan",
    "cuando",
    "cuanto",
    "cuanta",
    "cuantas",
    "de",
    "del",
    "demas",
    "desde",
    "donde",
    "dos",
    "el",
    "el",
    "ella",
    "ello",
    "ellos",
    "ellas",
    "en",
    "eres",
    "esa",
    "ese",
    "eso",
    "esas",
    "esos",
    "esta",
    "estas",
    "etc",
    "ha",
    "hasta",
    "la",
    "lo",
    "los",
    "las",
    "me",
    "mi",
    "mis",
    "mia",
    "mias",
    "mientras",
    "muy",
    "ni",
    "nosotras",
    "nosotros",
    "nuestra",
    "nuestro",
    "nuestras",
    "nuestros",
    "nos",
    "otra",
    "otro",
    "otros",
    "para",
    "pero",
    "pues",
    "que",
    "que",
    "si",
    "si",
    "siempre",
    "siendo",
    "sin",
    "sino",
    "sobre",
    "sr",
    "sra",
    "sres",
    "sta",
    "su",
    "sus",
    "te",
    "tu",
    "tus",
    "un",
    "una",
    "uno",
    "unas",
    "unos",
    "usted",
    "ustedes",
    "vosotras",
    "vosotros",
    "vuestra",
    "vuestro",
    "vuestras",
    "vuestros",
    "y",
    "ya",
];
exports["default"] = new AttributeController();


/***/ }),

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.App = void 0;
const express = __webpack_require__(860);
const cors = __webpack_require__(582);
const body_parser_1 = __webpack_require__(986);
const routes_1 = __webpack_require__(479);
const attribute_1 = __webpack_require__(927);
class App {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield attribute_1.default.initialize();
            // await loadFromExcel("./../data.xlsx");
        });
    }
    runServer() {
        return __awaiter(this, void 0, void 0, function* () {
            // initialize ctrls
            yield this.initialize();
            const port = process.env.PORT || 4000;
            const basePath = process.env.BASE_HREF || "";
            this.appServer = express();
            this.appServer.use(cors({
                origin: (_, callback) => callback(null, true),
                credentials: true,
                exposedHeaders: ["Content-Disposition"],
            }));
            this.appServer.use((req, res, next) => {
                console.log(`Request ${req.url}`);
                next();
            });
            this.appServer.use((0, body_parser_1.json)({ limit: "50mb" }));
            this.appServer.use(basePath + "/api", routes_1.default);
            // start http server
            this.appServer.listen(port, () => {
                console.info(`************ Server listening on ${port} ************`);
            });
        });
    }
}
exports.App = App;
const app = new App();
app.runServer();


/***/ }),

/***/ 479:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __webpack_require__(860);
const attribute_1 = __webpack_require__(927);
const router = express.Router();
/**
 * Get abreviature list
 */
router.get(`/abbreviature/list`, function getAbbreviatureList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const abbList = yield attribute_1.default.getAbbreviatureList();
        return res.status(200).json(abbList);
    });
});
/**
 * Post add abreviature
 */
router.post(`/abbreviature/add`, function postAbbreviatureAdd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const abbrev = req.body;
        const result = yield attribute_1.default.addAbbreviature(abbrev);
        return res.status(200).json(result);
    });
});
/**
 * Post edit abreviature
 */
router.post(`/abbreviature/edit`, function postAbbreviatureEdit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const abbrev = req.body;
        const result = yield attribute_1.default.editAbbreviature(abbrev);
        return res.status(200).json(result);
    });
});
/**
 * Post delete abreviature
 */
router.post(`/abbreviature/delete`, function postAbbreviatureDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const abbrevId = req.body.id;
        const result = yield attribute_1.default.deleteAbbreviature(abbrevId);
        return res.status(200).json(result);
    });
});
/**
 * Get attributes list
 */
router.get(`/attribute/list`, function getAttributeList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const attList = yield attribute_1.default.getAttributeList();
        return res.status(200).json(attList);
    });
});
/**
 * Post add attribute
 */
router.post(`/attribute/add`, function postAttributeAdd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const attr = req.body;
        const result = yield attribute_1.default.addAttribute(attr);
        return res.status(200).json(result);
    });
});
/**
 * Post edit attribute
 */
router.post(`/attribute/edit`, function postAttributeEdit(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const attr = req.body;
        const result = yield attribute_1.default.editAttribute(attr);
        return res.status(200).json(result);
    });
});
/**
 * Post delete attribute
 */
router.post(`/attribute/delete`, function postAttributeDelete(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const attrId = req.body.id;
        const result = yield attribute_1.default.deleteAttribute(attrId);
        return res.status(200).json(result);
    });
});
exports["default"] = router;


/***/ }),

/***/ 923:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Store = void 0;
const fs_1 = __webpack_require__(147);
class Store {
    constructor(filename) {
        this.filename = filename;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                (0, fs_1.readFile)(this.filename, { encoding: "utf-8" }, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    if (data === null) {
                        return res(null);
                    }
                    else {
                        return res(JSON.parse(data));
                    }
                });
            });
        });
    }
    write(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, fs_1.writeFile)(this.filename, JSON.stringify(obj, null, 2), (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
}
exports.Store = Store;


/***/ }),

/***/ 593:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadFromExcel = exports.Result = void 0;
const excelToJson = __webpack_require__(181);
const path = __webpack_require__(17);
const attribute_1 = __webpack_require__(927);
class Result {
    constructor(status, description) {
        this.status = status;
        this.description = description;
    }
}
exports.Result = Result;
function loadFromExcel(fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = excelToJson({
            sourceFile: path.join(__dirname, fileName),
            header: {
                rows: 1,
            },
            sheets: [
                {
                    name: "Hoja1",
                    columnToKey: {
                        A: "description",
                        D: "name",
                    },
                },
                {
                    name: "Hoja2",
                    columnToKey: {
                        A: "name",
                        B: "abbreviature",
                    },
                },
            ],
        });
        // for (const row of data["Hoja2"]) {
        //   const result = await ctrlAttribute.addAbbreviature(row);
        //   console.log(`${row.name} -> ${result.status} ${result.description}`);
        // }
        for (const row of data["Hoja1"]) {
            const result = yield attribute_1.default.addAttribute(row);
            console.log(`${row.name} -> ${result.status} ${result.description}`);
        }
    });
}
exports.loadFromExcel = loadFromExcel;


/***/ }),

/***/ 986:
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ 181:
/***/ ((module) => {

module.exports = require("convert-excel-to-json");

/***/ }),

/***/ 582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;
//# sourceMappingURL=server.js.map
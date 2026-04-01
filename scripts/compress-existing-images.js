"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var cloudinary_1 = require("cloudinary");
var sharp_1 = __importDefault(require("sharp"));
var path_1 = require("path");
var dotenv_1 = require("dotenv");
// Load environment variables manually if needed
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), ".env") });
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), ".env.local") });
// Ensure env variables are loaded
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error("Missing Cloudinary Env Vars");
    process.exit(1);
}
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
var prisma = new client_1.PrismaClient();
var MAX_SIZE_BYTES = 500 * 1024; // 500 KB limit for existing images
function getCloudinaryPublicId(url) {
    return __awaiter(this, void 0, void 0, function () {
        var parts, uploadIndex, pathParts, fullPathAndFile, publicIdWithExt, lastDotIndex;
        return __generator(this, function (_a) {
            try {
                parts = url.split("/");
                uploadIndex = parts.indexOf("upload");
                if (uploadIndex === -1)
                    return [2 /*return*/, null];
                pathParts = parts.slice(uploadIndex + 1);
                // Skip version if present
                if (pathParts[0] && pathParts[0].startsWith("v")) {
                    pathParts = pathParts.slice(1);
                }
                fullPathAndFile = pathParts.join("/");
                publicIdWithExt = fullPathAndFile.split("?")[0];
                lastDotIndex = publicIdWithExt.lastIndexOf(".");
                return [2 /*return*/, lastDotIndex !== -1 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt];
            }
            catch (error) {
                return [2 /*return*/, null];
            }
            return [2 /*return*/];
        });
    });
}
function processImage(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, arrayBuffer, buffer, sizeKB, compressedBuffer_1, newSizeKB, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!url || !url.includes("cloudinary.com"))
                        return [2 /*return*/, url];
                    console.log("\nAnalyzing Image: ".concat(url));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        console.log("[SKIP] Could not fetch image (Status: ".concat(res.status, ")"));
                        return [2 /*return*/, url];
                    }
                    return [4 /*yield*/, res.arrayBuffer()];
                case 3:
                    arrayBuffer = _a.sent();
                    buffer = Buffer.from(arrayBuffer);
                    sizeKB = Math.round(buffer.length / 1024);
                    if (buffer.length <= MAX_SIZE_BYTES) {
                        console.log("[OK] Size is ".concat(sizeKB, "KB (Under 500KB). No action needed."));
                        return [2 /*return*/, url];
                    }
                    console.log("[COMPRESSING] Size is ".concat(sizeKB, "KB (> 500KB). Processing..."));
                    return [4 /*yield*/, (0, sharp_1.default)(buffer)
                            .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
                            .webp({ quality: 75 })
                            .toBuffer()];
                case 4:
                    compressedBuffer_1 = _a.sent();
                    newSizeKB = Math.round(compressedBuffer_1.length / 1024);
                    console.log("[UPLOAD] Sharp reduced size from ".concat(sizeKB, "KB to ").concat(newSizeKB, "KB. Uploading to Cloudinary..."));
                    // Upload new buffer to Cloudinary
                    return [2 /*return*/, new Promise(function (resolve) {
                            var uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "evisiting_card" }, function (error, result) { return __awaiter(_this, void 0, void 0, function () {
                                var oldPublicId, delErr_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(error || !result)) return [3 /*break*/, 1];
                                            console.error("[ERROR] Upload failed for ".concat(url, ":"), error);
                                            resolve(url); // Return original URL if failed
                                            return [3 /*break*/, 7];
                                        case 1:
                                            console.log("[SUCCESS] New URL: ".concat(result.secure_url));
                                            return [4 /*yield*/, getCloudinaryPublicId(url)];
                                        case 2:
                                            oldPublicId = _a.sent();
                                            if (!oldPublicId) return [3 /*break*/, 6];
                                            _a.label = 3;
                                        case 3:
                                            _a.trys.push([3, 5, , 6]);
                                            return [4 /*yield*/, cloudinary_1.v2.uploader.destroy(oldPublicId)];
                                        case 4:
                                            _a.sent();
                                            console.log("[DELETED] Old huge image removed from Cloudinary: ".concat(oldPublicId));
                                            return [3 /*break*/, 6];
                                        case 5:
                                            delErr_1 = _a.sent();
                                            console.log("[WARNING] Failed to delete old image ".concat(oldPublicId), delErr_1);
                                            return [3 /*break*/, 6];
                                        case 6:
                                            resolve(result.secure_url);
                                            _a.label = 7;
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }); });
                            var stream = require('stream');
                            var readableStream = new stream.PassThrough();
                            readableStream.end(compressedBuffer_1);
                            readableStream.pipe(uploadStream);
                        })];
                case 5:
                    err_1 = _a.sent();
                    console.error("[ERROR] Failed to process ".concat(url, ":"), err_1);
                    return [2 /*return*/, url];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var businesses, totalSpaceSavedBytes, compressedCount, _i, businesses_1, business, needsUpdate, newLogo, newCover, newGalleryRaw, newServicesRaw, updated, updated, gallery, newGalleryArray, i, updatedUrl, err_2, services, servicesChanged, i, updatedUrl, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting Cloudinary Existing Images Cleanup script...");
                    return [4 /*yield*/, prisma.business.findMany()];
                case 1:
                    businesses = _a.sent();
                    console.log("Found ".concat(businesses.length, " businesses in database.\n"));
                    totalSpaceSavedBytes = 0;
                    compressedCount = 0;
                    _i = 0, businesses_1 = businesses;
                    _a.label = 2;
                case 2:
                    if (!(_i < businesses_1.length)) return [3 /*break*/, 24];
                    business = businesses_1[_i];
                    console.log("--- Processing Business: ".concat(business.businessName, " [").concat(business.slug, "] ---"));
                    needsUpdate = false;
                    newLogo = business.logo;
                    newCover = business.coverPhoto;
                    newGalleryRaw = business.gallery;
                    newServicesRaw = business.services;
                    if (!business.logo) return [3 /*break*/, 4];
                    return [4 /*yield*/, processImage(business.logo)];
                case 3:
                    updated = _a.sent();
                    if (updated !== business.logo) {
                        newLogo = updated;
                        needsUpdate = true;
                    }
                    _a.label = 4;
                case 4:
                    if (!business.coverPhoto) return [3 /*break*/, 6];
                    return [4 /*yield*/, processImage(business.coverPhoto)];
                case 5:
                    updated = _a.sent();
                    if (updated !== business.coverPhoto) {
                        newCover = updated;
                        needsUpdate = true;
                    }
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 12, , 13]);
                    if (!(business.gallery && typeof business.gallery === 'string')) return [3 /*break*/, 11];
                    gallery = JSON.parse(business.gallery);
                    if (!Array.isArray(gallery)) return [3 /*break*/, 11];
                    newGalleryArray = [];
                    i = 0;
                    _a.label = 7;
                case 7:
                    if (!(i < gallery.length)) return [3 /*break*/, 10];
                    return [4 /*yield*/, processImage(gallery[i])];
                case 8:
                    updatedUrl = _a.sent();
                    newGalleryArray.push(updatedUrl);
                    if (updatedUrl !== gallery[i])
                        needsUpdate = true;
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 7];
                case 10:
                    newGalleryRaw = JSON.stringify(newGalleryArray);
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_2 = _a.sent();
                    console.log("Gallery Parse Error:", err_2);
                    return [3 /*break*/, 13];
                case 13:
                    _a.trys.push([13, 19, , 20]);
                    if (!(business.services && typeof business.services === 'string')) return [3 /*break*/, 18];
                    services = JSON.parse(business.services);
                    if (!Array.isArray(services)) return [3 /*break*/, 18];
                    servicesChanged = false;
                    i = 0;
                    _a.label = 14;
                case 14:
                    if (!(i < services.length)) return [3 /*break*/, 17];
                    if (!services[i].image) return [3 /*break*/, 16];
                    return [4 /*yield*/, processImage(services[i].image)];
                case 15:
                    updatedUrl = _a.sent();
                    if (updatedUrl !== services[i].image) {
                        services[i].image = updatedUrl;
                        servicesChanged = true;
                        needsUpdate = true;
                    }
                    _a.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 14];
                case 17:
                    if (servicesChanged) {
                        newServicesRaw = JSON.stringify(services);
                    }
                    _a.label = 18;
                case 18: return [3 /*break*/, 20];
                case 19:
                    err_3 = _a.sent();
                    console.log("Services Parse Error:", err_3);
                    return [3 /*break*/, 20];
                case 20:
                    if (!needsUpdate) return [3 /*break*/, 22];
                    console.log("[DB UPDATE] Saving new optimized URLs for ".concat(business.slug, "..."));
                    return [4 /*yield*/, prisma.business.update({
                            where: { id: business.id },
                            data: {
                                logo: newLogo,
                                coverPhoto: newCover,
                                gallery: newGalleryRaw,
                                services: newServicesRaw
                            }
                        })];
                case 21:
                    _a.sent();
                    console.log("[DB UPDATE] Successfully saved ".concat(business.slug, "."));
                    return [3 /*break*/, 23];
                case 22:
                    console.log("[SKIP DB] No changes needed for ".concat(business.slug, "."));
                    _a.label = 23;
                case 23:
                    _i++;
                    return [3 /*break*/, 2];
                case 24:
                    console.log("\nCleanup Complete! All existing businesses have been analyzed.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });

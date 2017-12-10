#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var glob = require("glob");
var plist = require("plist");
//Get my directory
var thisPath = process.argv[1];
var thisPath = path.dirname(thisPath); //dependency directory
var privacyText = "This app requires the camera to function";
const myPackagePath = path.resolve(thisPath, "package.json");
if (fs.existsSync(myPackagePath)) {
  const mypackage = require(myPackagePath);
  if (typeof mypackage.IOSMicrophonePrivacyText != "undefined") {
    privacyText = mypackage.IOSMicrophonePrivacyText;
  }
}

var thisPath = path.dirname(thisPath); // node_modules
var baseName = path.basename(thisPath);
if (!baseName.startsWith("node_modules")) {
  console.log("This is not a dependency: ", thisPath);
  process.exit();
}
var thisPath = path.dirname(thisPath); // parent
const packagePath = path.resolve(thisPath, "package.json");
if (fs.existsSync(packagePath)) {
  const package = require(packagePath);
  if (typeof package.IOSMicrophonePrivacyText != "undefined") {
    console.log("Setting from parent package");
    privacyText = package.IOSMicrophonePrivacyText;
  }
}
var iosPath = path.resolve(thisPath, "ios");
if (!fs.existsSync(iosPath)) {
  console.log("Could not find ios in ", thisPath, iosPath);
  console.log(fs.readdirSync(thisPath));
  process.exit();
}
plists = glob.sync(path.resolve(iosPath + "/*/Info.plist"));
plists.map(path => {
  const source = fs.readFileSync(path, "utf8");
  var o = plist.parse(source);
  o.NSMicrophoneUsageDescription = privacyText;
  const xml = plist.build(o);
  fs.writeFileSync(path, xml);
});

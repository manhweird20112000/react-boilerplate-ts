"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var args = process.argv.slice(2);
var branch = args[0];
var commit = args[1];
var output = args[2] || "./commit.txt";
if (!branch) {
    console.error("Error: Branch is required");
    process.exit(1);
}
if (!commit) {
    console.error("Error: Commit is required");
    process.exit(1);
}
console.log(commit);
// console.log(
//   execSync(`git log -n 1 --pretty=format:"%h %s" ${commit}`, {
//     encoding: "utf-8",
//   })
// );
console.log("Branch: ".concat(branch));
console.log("Commit: ".concat(commit));
console.log("Output: ".concat(output));

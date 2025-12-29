import { execSync } from "child_process";

const args = process.argv.slice(2);

const branch = args[0];
const commit = args[1];
const output = args[2] || "./commit.txt";

if (!branch) {
  console.error("Error: Branch is required");
  process.exit(1);
}

if (!commit) {
  console.error("Error: Commit is required");
  process.exit(1);
}

console.log(commit)

// console.log(
//   execSync(`git log -n 1 --pretty=format:"%h %s" ${commit}`, {
//     encoding: "utf-8",
//   })
// );

console.log(`Branch: ${branch}`);
console.log(`Commit: ${commit}`);
console.log(`Output: ${output}`);

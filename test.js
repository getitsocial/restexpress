const randtoken = require('rand-token');
const arr = [];
const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)

for (let i = 0; i < 100000; i+=1) {
	arr.push(randtoken.uid(32))
}
console.log(findDuplicates(arr));

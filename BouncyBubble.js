var array = [];
for (var i = 0; i < 20; i++) {
    array[i] = Math.floor((Math.random() * 100) + 1);
}
console.log('unsorted: ' + array);
var result = bouncyBubbleSort(array);
console.log('sorted: ' + result);

function bouncyBubbleSort(array) {
    var isSwapped = false;
    var begin = 0;
    var end = 0;

    function beginToEnd() {
        for (var i = begin; i < array.length - 1 - end; i++) {
            if (array[i] > array[i + 1]) {
                var temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                isSwapped = true;
            }
        }
        end++;
    }

    function endToBegin() {
        for (var i = array.length - 1 - end; i > begin; i--) {
            if (array[i - 1] > array[i]) {
                var temp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = temp;
                isSwapped = true;
            }
        }
        begin++;
    }
    for (var i = 0; i < array.length - 1; i++) {
        isSwapped = false;
        if (i % 2 == 0) {
            beginToEnd();
        }
        if (i % 2 != 0) {
            endToBegin();
        }
        if (!isSwapped) {
            break;
        }
        console.log(array);
    }
    return array;
}
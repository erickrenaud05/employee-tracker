module.exports = function formTable(arr, ...topRows){
    const columnsSize = [];

    for(let columns of topRows){
        columnsSize.push(columns.length);
    }

    console.log(columnsSize)
    for(let i = 0; i < arr.length; i++){
        for(let j = 1; j < topRows.length; j++){
            if(arr[i][topRows[j]].length > columnsSize[j]){          
                columnsSize[j] = arr[i][topRows[j]].length;
            }
        }
    }
    console.log(columnsSize)
    var titleString = '\n';
    var underLine = '\n';

    for(let i = 0; i < topRows.length; i++){
        if(topRows[i].length === columnsSize[i]){
            titleString = titleString + topRows[i] + ' ';
        } else{
            titleString = titleString + topRows[i]
            for(let j = 0; j <= (columnsSize[i] - topRows[i].length); j++) {
                titleString = titleString + ' ';
            }
        }
        for(let j = 0; j < columnsSize[i]; j++){
            underLine = underLine + '-';
        }
        underLine = underLine + ' ';
    }
    console.log(titleString,  underLine)

    for(let row of arr){
        //each row
        var rowString = '';
        for(let i = 0; i < topRows.length; i++){
            if(row[topRows[i]].length === columnsSize[i]){
                rowString = rowString + row[topRows[i]] + ' ';
            } else{
                if(row[topRows[i]] === ' '){
                    rowString = rowString + 'null'
                } else{
                    rowString = rowString + row[topRows[i]];
                }
                for(let j = 0; j <= (columnsSize[i] - String(row[topRows[i]]).length); j++) {
                    rowString = rowString + ' ';
                }
            }
        }
        console.log(rowString)
    }
    
}

// {
//     employee_id: 5,
//     employee_first_name: 'Kunal',
//     employee_last_name: 'Singh',
//     employee_role: 'Account Manager',
//     manager_name: ' '
//   },
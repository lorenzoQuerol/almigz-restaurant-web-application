// Get date and time
const today = new Date();
const date = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + "-" + today.getMilliseconds();;
const dateTime = date+'_'+time;

function filterDataByDate(data,frDate,toDate){
    var tempData = []
    for(var i = 0; i < data.length; i++){
        if(data[i].dateCreated.slice(0,10) <= toDate && data[i].dateCreated.slice(0,10) >= frDate){
            tempData.push(i);
        }
    }
    return tempData;
}

function downloadCSV (csv){
    //DOWNLOAD FUNCTION
    var tag = document.createElement("a");
    var csvFile = new Blob([csv], {type: 'text/plain'});
    tag.href = URL.createObjectURL(csvFile);
    tag.download = "SummaryReport_" + dateTime + ".csv";
    tag.click()
}


export default function downloadSummary(data,frDate,toDate){
    
    const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
   
    var json = [];
    

    var filteredDataArr = filterDataByDate(data,frDate,toDate);

    filteredDataArr.forEach( i => {
        for (var j = 0; j < data[i].order.length; j++){
            var filter ={
                "Full Name":data[i].fullName,
                "Contact Number":data[i].contactNum[0],
                "Branch":data[i].branch,
                "Invoice Number": data[i].invoiceNum,
                "Status" : status[data[i].orderStatus],
                "Remarks":data[i].reasonForCancel,
                "Total Price":data[i].order[j].quantity * data[i].order[j].menuItem.productPrice,
                "Payment Method": data[i].payMethod,
                "Date Created":data[i].dateCreated,
                "Product Name":data[i].order[j].menuItem.productName,
                "Qty":data[i].order[j].quantity
            }
            json.push(filter);
        }
    });

    if(json.length){
        var fields = Object.keys(json[0])
        var replacer = function(key, value) { return value === null ? '' : value } 

        var csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
        })
        csv.unshift(fields.join(',')) // add header column
        csv = csv.join('\r\n');
        //DOWNLOAD
        downloadCSV(csv)
    }
    else{
        window.alert("No data")
    }
}





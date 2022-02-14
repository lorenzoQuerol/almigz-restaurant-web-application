

function downloadCSV (csv){
    
    // Get date and time
    const today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds() + "-" + today.getMilliseconds();;
    var dateTime = date+'_'+time;

	
	
    //DOWNLOAD FUNCTION
    var tag = document.createElement("a");
    var csvFile = new Blob([csv], {type: 'text/plain'});
    tag.href = URL.createObjectURL(csvFile);
    tag.download = "SummaryReport_" + dateTime + ".csv";
    tag.click()
}


export default function downloadSummary(data){
    
    const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
   
    var json = [];
   
    
    
    for (var i = 0; i < data.length; i++){
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
    }

    

    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 

    var csv = json.map(function(row){
    return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
    }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');

    // console.log(csv)
    // console.log(data.transaction.dateCreated)
    // console.log(data.transaction.branch)
    // console.log(data.transaction.deliveryTime)
    // console.log(data.transaction.order)
    // console.log(data.transaction.payMethod)

    //DOWNLOAD
    downloadCSV(csv)
}





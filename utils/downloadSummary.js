

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
    var json = []
    json.push(data.transaction)
    
    var fields = Object.keys(json[0])
    
    
    var replacer = function(key, value) { return value === null ? '' : value } 

    var csv = json.map(function(row){
    return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
    }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');

    console.log(csv)
    // console.log(data.transaction.dateCreated)
    // console.log(data.transaction.branch)
    // console.log(data.transaction.deliveryTime)
    // console.log(data.transaction.order)
    // console.log(data.transaction.payMethod)

    //DOWNLOAD
    downloadCSV(csv)
}





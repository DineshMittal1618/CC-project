const createDropdown=(ls)=>{
    const list=createList(ls);
    var option='';
        const rows=list.length;
        console.log(list.length);
        
        for(var i=0;i<rows;i++)
        {
            option +='<tr>';
            option +='<td>'+ list[i]+ '</td>' ;
            option +='</tr>';
        }
    
        document.write('<table>' + option +'</table>') ;
}
const createList=(ls)=>{
    const list=[];
    let k=0;
    var j=0;

    for(let i=0;i<ls.length;i++)
    {
        if(ls[i]==',' || i==ls.length-1)
        {
            list[k]=ls.substring(j,i);
            j=i+1;
            k++;
        }
        
    }
    console.log(list);
    return list;
}

class GenerateTableData{
  private map: Map<string, any>;
  app:HTMLElement;
  constructor(tableData:any,appInstance:HTMLElement){
    this.map = new Map<string, any>();
    tableData.forEach(table => {
      this.map.set(table.name,table.data)
    });
    this.app = appInstance;
  }

  getAppHtml(build){
    this.app.appendChild(build)
  }
  
  createElement(type:string,className="",innerHTML=""){
    let ele = document.createElement(type)
    ele.className = className
    ele.innerHTML = innerHTML;
    return ele;
  }

  generateTables():void{
    let build = ""
    let mainDiv = this.createElement('div','padding');
    this.map.keys().forEach((key,value)=>{
      let h2 = this.createElement('h4',"text-center",`<b>Table ${value+1}: ${key}</b>`);
      mainDiv.appendChild(h2)
      let table = this.createElement('table','table table-bordered table-hover text-center align-middle')
      let thead = this.createElement('thead','table-dark');
      
      thead.appendChild(this.generateTableHead(this.map.get(key),value,key,key.split(' ').join('_')))
      
      let tBody = this.generateTableBodyData(this.map.get(key),key,key.split(' ').join('_'),value)
      
      table.appendChild(thead);
      table.appendChild(tBody)
      mainDiv.appendChild(h2)
      mainDiv.appendChild(table)

      mainDiv.appendChild(this.addItemInForm(key,tBody.id))
      mainDiv.appendChild(this.createElement('hr'))

    })
    this.getAppHtml(mainDiv)
  }

  addItemInForm(key,tdId){
    let fContainer = this.createElement('div')
    let h5 = this.createElement('h5',"text-center",`<b>Add ${key}</b>`);
    fContainer.appendChild(h5)
    let form = this.createElement('form','padding mb-2');
    let fdiv = this.createElement('div','form-group');
    let lable = this.createElement('label',"","Name:")
    let input = this.generateInputElement('text','form-control','Name of the animal',`${tdId}_name`);
    fdiv.appendChild(lable)
    fdiv.appendChild(input)
    lable = this.createElement('label',"","Size:")
    input = this.generateInputElement('number','form-control','Size of the animal',`${tdId}_size`);
    fdiv.appendChild(lable)
    fdiv.appendChild(input)
    lable = this.createElement('label',"","Location:")
    input = this.generateInputElement('text','form-control','Location of the animal',`${tdId}_location`);
    fdiv.appendChild(lable)
    fdiv.appendChild(input)
    form.appendChild(fdiv)
    form.appendChild(this.generateSubmitButton(key,tdId))
    fContainer.appendChild(form);
    return fContainer
  }

  generateSubmitButton(key,tdId){
    let btn = this.createElement('button','btn btn-primary mt-1', 'Submit')
    btn.type='submit';
    btn.addEventListener('click',(event)=>{
      event.preventDefault()
      event.stopPropagation()
      app.addAnimal(key,tdId);

    })
    return btn;
  }

  generateInputElement(type,clas,placeholder,id,value=""){
    let input = this.createElement('input');
    input.type = type;
    input.placeholder = placeholder
    input.className = clas,
    input.id=id;
    if(value!=""){
      input.value = value;
    }
    return input;
  }


  private generateTableHead(singleRow:any,tableNum,key:string,tdId:string){

    let tr = this.createElement('tr',"table-head");
    for(let data of singleRow){
      tdId = `${tdId}-${tableNum}`
      Object.keys(data).forEach(columnHead=>{
          let th = this.createElement('th');
          th.innerText = `${columnHead}`
          th.appendChild(this.generateSortButton(columnHead,tableNum,key,tdId))
          tr.appendChild(th);
        })

        let th = this.createElement('th');
        th.innerText = `Action`
        tr.appendChild(th);
      
      break;
    }
    return tr;
  }

  private generateSortButton(columnHead:string,tableNumber,key:string,tdId:string){
    let btn = this.createElement('button','btn btn-sm btn-light','<i class="fa fa-sort"></i>');
    if((tableNumber==0 && columnHead!='image') || (tableNumber==1 && (columnHead=='name'|| columnHead=='location')) || (tableNumber==2 && columnHead=='size')){
      btn.addEventListener('click',()=>{
        app.sortTableData(tdId,columnHead,key)
      })
      return btn
    }
    return this.createElement('span');
  } 

  sortTable(tdId:string,columanName:string,key:string){
    let tbody = document.getElementById(tdId)
    tbody.innerHTML = "";
    let dataArr = this.map.get(key)
    if(columanName==='size'){
      dataArr.sort((a,b)=>a[columanName] - b[columanName])
    }else{
      dataArr.sort((a,b)=> a[columanName].localeCompare(b[columanName], undefined, { sensitivity: 'base' }));
    }
    this.generateTableDataRow(key,dataArr,tbody)

  } 

  generateTableDataRow(key,dataArr,tbody):void{
    let idCount=0;
    let tableNumber = Number.parseInt(tbody.id.split('-')[1]);
    for(let data of dataArr){
      let tr = this.createElement('tr');
      tr.id = `${tbody.id + "_" + idCount}`

      let td1 = this.createElement('td',"",data['species'])
      td1.id =  `${tbody.id + "_" +idCount +"_0"}`;

      let name = data['name'];
      if(tableNumber == 1){
        name = `<b>${data['name']}</b>`
      }else if(tableNumber===2){
        name = `<span style='color:blue'><b><em>${data['name']}</em></b></span>`
      }

      let td2 = this.createElement('td',"",name);
      
      td2.id =  `${tbody.id + "_" +idCount +"_1"}`;
      let td3 = this.createElement('td',"",`${data['size']}ft.`)
      td3.id =  `${tbody.id + "_" +idCount +"_2"}`;
      let td4 = this.createElement('td',"",data['location'])
      td4.id =  `${tbody.id + "_" +idCount +"_3"}`;
      let td5 = this.createElement('td')
      td5.appendChild(this.generateImageCard(data['image'],data['name']))

      td2.id =  `${tbody.id + "_" +idCount +"_4"}`;
      let td6 = this.createElement('td')
      td6.id =  `${tbody.id + "_" +idCount +"_5"}`;
      td6.appendChild(this.generateEditButton(key,idCount,tbody.id,tr.id))
      td6.appendChild(this.generateDeleteButton(key,idCount,tbody.id))

      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tr.appendChild(td6)
      tbody.appendChild(tr);
      idCount++;
    }
  }

  generateImageCard(pth,name=""){
    if(pth===""){
      pth='data/images/placeholder.jpg'
    }
    let card = this.createElement('div','card p-1 image-cntr');
    let img = this.createElement('img','card-img-top');
    let div = this.createElement('div','overlay',`<b>${name}</b>`)

    img.src = pth;
    card.appendChild(img);
    card.appendChild(div);
    return card 
  }

  generateDeleteButton(key,idxx,tdId){
    let button = this.createElement('button','btn btn-sm btn-danger','<i class="fa fa-trash"></i>');
    button.addEventListener('click',()=>{
      app.deleteAnimal(key,idxx,tdId);
    })
    return button
  }

  generateEditButton(key,idxx,tdId,trId){
    let button = this.createElement('button','btn btn-sm btn-primary margin','<i class="fa fa-pencil"></i>');
    button.addEventListener('click',()=>{
      app.editAnimal(key,idxx,tdId,trId);
    })
    return button
  }

  private generateTableBodyData(dataArr:any,key,tdId:any,taleNumber){
    let tbody  = this.createElement('tbody',"table-body");
    tbody.id = `${tdId}-${taleNumber}`
    this.generateTableDataRow(key,dataArr,tbody)
    return tbody;
  }

  deleteData(key:string,index:number,tdId){
    let td = document.getElementById(tdId)
    td?.innerHTML = "";
    let data:any = this.map.get(key);
    data = data?.filter((e,idx)=>idx!==index);
    this.map.set(key,data);
    this.generateTableDataRow(key,data,td);
  }

  editData(key:string,index:number,tdId:any,trId){
    let td = document.getElementById(tdId)
    td?.innerHTML = "";
    let data:any = this.map.get(key);
    this.generateTableDataRow(key,data,td);

    let currentData = data[index];
    let tr = document.getElementById(trId);

    let name = document.getElementById(`${trId}_4`);
    let size = document.getElementById(`${trId}_2`);
    let location = document.getElementById(`${trId}_3`);
    let action = document.getElementById(`${trId}_5`);

    name?.innerHTML = "";
    name?.appendChild(this.generateInputElement('text','form-control','please enter new Name',`${trId}_4_name`,currentData['name']))
    size?.innerHTML = ""
    size?.appendChild(this.generateInputElement('number','form-control','please enter new Name',`${trId}_2_size`,currentData['size']))
    location?.innerHTML = ""
    location?.appendChild(this.generateInputElement('text','form-control','please enter new Name',`${trId}_3_location`,currentData['location']))
    
    action?.innerHTML = ""

    action?.appendChild(this.generateAcceptOrRejectButton('accept',key,index,tdId,trId))

    action?.appendChild(this.generateAcceptOrRejectButton('reject',key,index,tdId,trId))
  }

  generateAcceptOrRejectButton(type,key,idxx,tdId,trId,name="",size=0,location=""){
    let button = this.createElement('button',`btn btn-sm btn-${type=='accept'?'primary':'danger'} margin`,`<i class="fa fa-${type=='accept'?'check':'times'}"></i>`);
    button.addEventListener('click',(event)=>{
      event.preventDefault()
      event.stopPropagation()
      if(type=='accept'){
        let newData = {...this.map.get(key)[idxx]};
        newData['name'] = this.getValueFromInputElemetnUsingId(`${trId}_4_name`);
        newData['size'] = this.getValueFromInputElemetnUsingId(`${trId}_2_size`),
        newData['location'] = this.getValueFromInputElemetnUsingId(`${trId}_3_location`)

        app.acceptEditAnimal(key,idxx,tdId,trId,newData)
      }else{
        app.cancelEditAnimal(key,idxx,tdId,trId);
      }
    })
    return button;
  }  

  private getValueFromInputElemetnUsingId(id){
    return document.getElementById(id)?.value;
  }

  

  addData(key:string,tdId){
    let data:any = this.map.get(key);
    let nameElement = document.getElementById(`${tdId}_name`)
    let sizeElement = document.getElementById(`${tdId}_size`);
    let locationElement = document.getElementById(`${tdId}_location`);

    let name = nameElement.value 
    let size = sizeElement.value===''?NaN:sizeElement.value; 
    let location = locationElement.value 

    for(let e of data){
      if(name===e['name']){
        alert(`${name} already exist`)
        return;
      }
    }

    if(name===""){
      alert('name can not be empty')
      return;
    }

    if(location===""){
      alert('location can not be empty')
      return;
    }

    if(Number.isNaN(size)){
      alert('Please provide valid size')
      return;
    }
    let tempData = {
      "species":key,
      "name": nameElement.value==""?"null":nameElement.value,
      "size": sizeElement.value==NaN?-1:sizeElement.value,
      "location":locationElement.value==""?"null":locationElement.value,
      "image":""
    }

    nameElement.value = "" 
    sizeElement.value = "" 
    locationElement.value = "" 

    data.push(tempData)
    this.map.set(key,data);
    let tBody = document.getElementById(tdId);
    tBody?.innerHTML = ""; 
    this.generateTableDataRow(key,data,tBody);
  }

  acceptEditData(key,idx,tdId,trId,editedData){
    let data = this.map.get(key);
    data[idx] = editedData;
    this.map.set(key,data);
    let tBody = document.getElementById(tdId);
    tBody?.innerHTML = ""; 
    this.generateTableDataRow(key,data,tBody);
  }

  cancelEditData(key,idx,tdId,trId){
    let data = this.map.get(key);
    let tBody = document.getElementById(tdId);
    tBody?.innerHTML = ""; 
    this.generateTableDataRow(key,data,tBody);
  }
}

class Main{
  app:HTMLElement
  generateTableData: GenerateTableData;
  constructor(id:string){
        this.app = document.getElementById(id) as HTMLElement;
        this.MakeData()
  }

  private getData(filePath:string):any{
    return new Promise((resolve,reject)=>{
      fetch(filePath).then(data=>{
        return data.json();
      }).then(data=>{
        resolve(data)
      }).catch(err=>{
        reject(new Error(`not able get data from ${filePath}`))
      })
    })
  } 

  
  MakeData():void{
    Promise.all([
      this.getData('./data/bigCat.json'),
      this.getData('./data/dogs.json'),
      this.getData('./data/bigFish.json')
    ])
    .then(results => {
        this.generateTableData = new GenerateTableData(results,this.app);
        this.generateTableData.generateTables()
    })
    .catch(error => {
    });
  }

  sortTableData(tdId:string,columanName:string,dataKey:string){
    this.generateTableData.sortTable(tdId,columanName,dataKey);
  }

  deleteAnimal(tableName:string,index:number,tdId){
    this.generateTableData.deleteData(tableName,index,tdId)
  }

  addAnimal(key:string,tdId:string){
    this.generateTableData.addData(key,tdId)
  }

  editAnimal(key,idx,tdId,trId){
    this.generateTableData.editData(key,idx,tdId,trId);
  }

  acceptEditAnimal(key,idx,tdId,trId,newData){
    this.generateTableData.acceptEditData(key,idx,tdId,trId,newData);
  }

  cancelEditAnimal(key,idx,tdId,trId){
    this.generateTableData.cancelEditData(key,idx,tdId,trId);
  }

}

const app = new Main('app');

(window as any).app = app;
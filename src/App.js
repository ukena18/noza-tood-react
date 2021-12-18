import React,{useState,useEffect} from "react";
import './App.css';


function App(){
    // title for title input i am using e.target.value and set title so it can work simatanously
  const [title,setTitle] = useState('')
  // after we get the data from fetch we keep it in the tasks
  const [tasks,setTasks] = useState([])
  // this is for keep the info for uopdate api 
  const [activeTask,setActiveTask]=useState({id:null,title:'',completed:false})
  // that is for update func if editing is false send create api  else send update api
  const [editing,setEditing] = useState(false)
  // for complete value of the task
  const [comp,setComp] = useState(false)


// useEffect fires at the beginnig and if tasks are changed
useEffect(()=>{
  // list api
  const list_url = 'https://noza-todo.herokuapp.com/api/task-list/';
  // fetch it
  fetch(list_url)
  // turn to json format
  .then(res=>res.json())
  // get the info and set it to tasks
  .then(info=>{
    setTasks(info)
  });

  
  // it is run everytime task changed
},[tasks])

// edit function inside of map func
// has current task props
const editHandle = (task)=>{
  // get the current task.title
    setTitle(task.title)
    // since it is editing setEditing(true) so it is sending to update api
    setEditing(true)
    // setActiveTask to current task
    setActiveTask(task)
}


// delete function inside of map func
// has current task props
const deleteHandle = (task) =>{
  console.log("deleted ")
  // send it to delete api with current id
  var url = `https://noza-todo.herokuapp.com/api/task-delete/${task.id}`
  
  // fetch it , use DELETE method ,
  // specified contenttype
  fetch(url,{
    method:"DELETE",
    headers:{
      'Content-type':'application/json',
    },
  }).then(()=>console.log("succesful"))
  
}


// strike-unstrike for crossing
// has current task props
const crossHandler = (task) =>{
  // comp = !comp
  setComp((prev)=>!prev)
  
  // update api with current task id
 const url = `https://noza-todo.herokuapp.com/api/task-update/${task.id}`
  //fet it,usePOST method 
  // headers content-type
  // send the updated task to api 
  // api handle he rest and changed it inside database
  fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    // send the updated version of current task
    body:JSON.stringify({'completed':comp, title:task.title})
  }).then(()=>console.log(comp))
  

}


// sunbmit button has create api and update api
const submitHandle  = (e) =>{
  console.log("submitted")
  e.preventDefault()
  // create api
  var url = 'https://noza-todo.herokuapp.com/api/task-create/'
  // if editing=true it is gonna be update api else create api
  if (editing){
      url = `https://noza-todo.herokuapp.com/api/task-update/${activeTask.id}`
  }
  // fetch it, usePOST method 
  fetch(url, {
    // define method
    method:'POST',
    // specify it is json format 
    // and also since we are using django and forms we are sending csrf_token
    headers:{
      'Content-type':'application/json',
      
    },
    // what we are sending , so request.POST can get it
    body:JSON.stringify({'title':title})
  }).then(()=>console.log("it is working"))
}
  return (
    <div className="container">

		<div id="task-container">
			<div id="form-wrapper">
				<form id="form">
					<div class="flex-wrapper">
						<div style={{flex: 6}}>
							<input id="title" value={title} onChange={e=>setTitle(e.target.value)}  className="form-control" type="text" name="title" placeholder="Add task" />
		  		</div>
						<div style={{flex: 1}}>
							<input id="submit" onClick={(e)=>submitHandle(e)} className="btn" type="submit" />
						</div>
					</div>
				</form>
			</div>

			<div id="list-wrapper">
    {tasks.map(task=>(
      <div key={task.id} className="task-wrapper flex-wrapper" >
          <div style={{flex: 7}} >
            {(task.completed) == false ?
              <span onClick={() => crossHandler(task)}>{task.title}</span>:
              <strike onClick={() => crossHandler(task)}>{task.title}</strike>
            }
            
          </div>

          <div style={{flex: 1}}>
            <button className="btn btn-sm btn-outline-info"  onClick={()=>editHandle(task)}>Edit</button>
          </div>

          <div style={{flex: 1}}>
            <button className="btn btn-sm btn-outline-dark delete" onClick={()=>deleteHandle(task)}>-</button>
          </div>


      </div>
    ))}
			</div>
		</div>

	</div>
  );
 
}


export default App;

import { ToDo } from "./classes/ToDo.js";

const todo = document.getElementById("todo")! as HTMLInputElement;
const cateogory = document.getElementById("category")! as HTMLSelectElement;
const sttus = document.querySelectorAll("[name=status]")! as NodeList;
const container = document.querySelector(".todos") as HTMLTableSectionElement ;

const updateTodo = document.getElementById("update-todo")! as HTMLInputElement;
const updateCateogory = document.getElementById("update-category")! as HTMLSelectElement;
const updateSttus = document.querySelectorAll("[name=update]")! as NodeList;
const updateId = document.getElementById("update-id")! as HTMLInputElement;

const toggleModalBtn = document.getElementById("toggle-modal");

const updateForm = document.getElementById("update-form")! as HTMLFormElement;

const form = document.getElementById("todo-form") as HTMLFormElement;

var todos : {
    id : number,
    todo : string,
    category : string ,
    status : boolean,
}[] ;

renderAll();

form.addEventListener("submit" , ( e: Event ) : void  => {

    e.preventDefault();

    let status : boolean;

    sttus.forEach( ( s : any ) => {
        if(s.checked){
            status = s.value == "true"  ? true : false;
        }
    })

    
    const todoItem : {
        todo : string , 
        category : string,
        status : boolean,
    } = {
        todo : todo.value,
        category : cateogory.value,
        status : status!,
    }

    fetch("http://localhost:3000/todos" , {
       method : "POST",
       body : JSON.stringify(todoItem),
       headers : {
         "Content-type" : "application/json"
       }
    })

    // renderAll();

    todo.focus();
    
});

function renderAll(): void
{
    fetch("http://localhost:3000/todos")
    .then( res => res.json())
    .then( ( datas : {
        id : number,
        todo : string,
        category : string ,
        status : boolean,
    }[] ) => {
        
        todos = datas;

        container.innerHTML = "";

        if( datas.length > 0 )
        {
            datas.forEach( d => {
                container.innerHTML += ToDo.format( d.id , d.todo , d.category , d.status );
            })
    
            const deleteBtns = document.querySelectorAll(".delete-btn") as NodeList;
    
            const toggleBtns = document.querySelectorAll(".toggle-status-btn") as NodeList;

            const updateBtns = document.querySelectorAll(".update-btn") as NodeList;
        
    
            deleteBtns.forEach( ( btn ) : void => {
                btn.addEventListener("click" , ( e : Event) => {
                    e.preventDefault();
    
                    const target : number  = Number((e.currentTarget as HTMLButtonElement ).getAttribute("data-target"));
                    
                    if(confirm(`Are you sure to delete?`))
                    {
                       fetch(`http://localhost:3000/todos/${target}` , {
                            method : "DELETE",
                       })
                    }
                })
            })
    
            toggleBtns.forEach( ( btn ): void => {
                btn.addEventListener( "click" , ( e :Event ) => {
    
                    e.preventDefault();
    
                    let target : string  = ( e.target as HTMLElement).getAttribute("data-target")!;
    
                    let [ id , status ]  = target.split(",");

                    if(confirm("Are you sure to change status?"))
                    {   
                        const data : {
                            id : number,
                            todo : string,
                            category : string ,
                            status : boolean,
                        }  = datas.filter( d => {
                            return d.id == Number(id);
                        })[0];
    
                        fetch(`http://localhost:3000/todos/${id}` , {
                            headers : {
                                "Content-type" : "application/json"
                            },
                            method : "PUT",
                            body : JSON.stringify({
                                todo : data.todo,
                                category : data.category,
                                status : status == "true" ? false : true,
                            })
                        })
                    }
                })
            })

            updateBtns.forEach( btn => {
                btn.addEventListener( "click" , ( e : Event ) => {
                    
                    let target : number = Number( ( e.target as HTMLElement ).getAttribute("data-target") );

                    const data : {
                        id : number,
                        todo : string,
                        category : string ,
                        status : boolean,
                    }  = datas.filter( d => {
                        return d.id == Number(target);
                    })[0];

                    updateTodo.value = `${data.todo}`;
                    updateCateogory.value = data.category;
                    updateId.value = `${data.id}`;
                    
                    // updateSttus.forEach( ( status : Node ) : void => {

                    //     if( ((status as HTMLInputElement).value == "true") == data.status )
                    //     {
                    //         (status as HTMLInputElement).checked;
                    //     }
                    // })
                    toggleModalBtn?.click();

                })
            })


        }

        else{
            container.innerHTML = "<tr class='text-center'><td colspan='5'>There is no todo!</td></tr>";
        }
    });
}


updateForm.addEventListener( "submit" , ( e : Event ) => {
    e.preventDefault();

    let status : boolean ;

    updateSttus.forEach( ( s : any ) => {
        if(s.checked){
            status = s.value == "true"  ? true : false;
        }
    })

    console.log(updateTodo.value)

    fetch(`http://localhost:3000/todos/${Number(updateId.value)}`,{
        headers : {
            "Content-type" : "application/json"
        },
        method : "PUT",
        body : JSON.stringify({
            todo : updateTodo.value,
            category : updateCateogory.value,
            status : status!,
        })
    })

    toggleModalBtn?.click();

    renderAll();
})
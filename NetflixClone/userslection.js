const users=[];

const memberDiv=document.querySelector('.memberDiv');
const addicon=document.querySelector('.addicon');
const userIcons=()=>{
    users.reverse();
    users.map((curElem) => {
        memberDiv.insertAdjacentHTML('afterbegin', `
        <button class="btn"><span>${curElem}</span></button>
        `);
    })
};
addicon.addEventListener('click',()=>{
    let userName=prompt("Enter Profile Name:");
    if(userName != null && !users.includes(userName)){
        users.push(userName)
        console.log(users);
        memberDiv.insertAdjacentHTML('afterbegin', `
        <button class="btn"><span>${userName}</span></button>
        `);
    }else{
         alert("Profile Already Exists");
    }
})
userIcons();
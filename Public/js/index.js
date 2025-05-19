
document.addEventListener('DOMContentLoaded', ()=>{
const userData = JSON.parse(localStorage.getItem('user'));
if(userData){
  const welcomeMessage = document.getElementById("wel");
  if(welcomeMessage){
    welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
  }
}
});


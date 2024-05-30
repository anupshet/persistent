
const btn = document.getElementById('button');

btn.addEventListener('click',(ele)=>{
  ele.preventDefault();
  document.querySelector('.container').style.background='#ccc';
})



const factorial = (x)=>{
  if(x==1) return x;
  return factorial(x-1) * x;
}

const power = (x) =>{
  let  j = x;
  let ans = 1;
  while(j--){
    anx = ans * x;
  }
  return ans;
}

const serise = (x) =>{
  let ans = 0;
  for(let i=1;i<=x;i++){
    if(i%2==1){
      ans = ans + (factorial(x) / power(x));
    }else{
      ans = ans - (factorial(x)/power(x));
    }
  }

  return ans;
}

console.log(serise(5))

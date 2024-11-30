const factorial = (x)=>{
  if(x==1) return x;
  return factorial(x-1) * x;
}

// const giveSerise = (num,x,len) =>{
//   let ans = factorial(num);
//   let nm = 1;
//   let dm = 1;
//   for(let i=1;i<=len;i++){
//     if(i!=num){
//       nm = nm * (x-i)
//       dm = sm * (num-i)
//     }
//   }
//   return ans * nm/dm;
// }


// const serise = (x,len) =>{
//   ans = 0;
//   for(let i=1;i<=len;i++){
//     ans += giveSerise(i,x);
//   }
// }

const giveSerise = (num,x) =>{
  let ans = factorial(num);
  let nm = 1;
  let dm = 1;
  for(let i=1;i<=4;i++){
    if(i!=num){
      nm = nm * (x-i)
      dm = dm * (num-i)
    }
  }
  return ans * nm/dm;
}


const serise = (x) =>{
  ans = 0;
  for(let i=1;i<=4;i++){
    ans += giveSerise(i,x);
  }
  return ans;
}

console.log(serise(1))

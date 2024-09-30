// let arr = [12, 34, 556, 78, 8];

// arr.forEach((obj, index) => {
//     if (obj === 12) {
//         console.log(`Found at position ${index}`);
//     }
// });


// let student={
//     name:"eldho",
//     location:"kjm"
// }

// console.log(student.name)


const http=require('http')

const app=http.createServer((req,res)=>{
    console.log(req)
    res.end("hello my first reponse")
})

app.listen(8000);